export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-3-5-sonnet-20241022';
const ANTHROPIC_VERSION = '2023-06-01';

/**
 * Chat with Anthropic Claude API
 * @param messages - Array of conversation messages
 * @param apiKey - User's Anthropic API key
 * @param onStream - Optional callback for streaming responses
 * @returns Promise resolving to the assistant's response
 */
export async function chatWithAnthropic(
  messages: AnthropicMessage[],
  apiKey: string,
  onStream?: (chunk: string) => void
): Promise<string> {
  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    throw new Error('Invalid Anthropic API key. Key must start with "sk-ant-"');
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      stream: !!onStream,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Anthropic API error (${response.status}): ${errorData.error?.message || response.statusText}`
    );
  }

  if (onStream) {
    // Handle streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));

        for (const line of lines) {
          try {
            const data = line.replace('data: ', '');
            if (data === '[DONE]') continue;

            const json = JSON.parse(data);

            // Handle content_block_delta events for streaming
            if (json.type === 'content_block_delta') {
              const text = json.delta?.text || '';
              fullResponse += text;
              onStream(text);
            }
          } catch (e) {
            // Ignore parse errors for incomplete JSON chunks
          }
        }
      }
    }

    return fullResponse;
  } else {
    // Handle non-streaming response
    const data: AnthropicResponse = await response.json();
    return data.content[0]?.text || '';
  }
}

/**
 * Validate Anthropic API key format
 */
export function validateAnthropicKey(key: string): boolean {
  return key.startsWith('sk-ant-') && key.length > 20;
}

/**
 * Test Anthropic API key validity
 */
export async function testAnthropicKey(apiKey: string): Promise<boolean> {
  try {
    await chatWithAnthropic(
      [{ role: 'user', content: 'Hello' }],
      apiKey
    );
    return true;
  } catch (error) {
    console.error('API key test failed:', error);
    return false;
  }
}
