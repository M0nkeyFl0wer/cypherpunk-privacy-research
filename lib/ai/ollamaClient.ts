export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || 'https://ollama.noosworx.com/api';
const OLLAMA_MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'mistral';

/**
 * Chat with Ollama AI model
 * @param messages - Array of conversation messages
 * @param onStream - Optional callback for streaming responses
 * @returns Promise resolving to the assistant's response
 */
export async function chatWithOllama(
  messages: OllamaMessage[],
  onStream?: (chunk: string) => void
): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: !!onStream,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`);
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
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              fullResponse += json.message.content;
              onStream(json.message.content);
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
    const data: OllamaResponse = await response.json();
    return data.message.content;
  }
}

/**
 * Generate embeddings for text using Ollama
 * @param text - Text to generate embeddings for
 * @returns Promise resolving to embedding vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${OLLAMA_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama embeddings error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.embedding;
}
