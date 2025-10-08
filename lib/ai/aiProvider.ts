import { chatWithOllama, type OllamaMessage } from './ollamaClient';
import { chatWithAnthropic, type AnthropicMessage } from './anthropicClient';

export type AIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type AIProvider = 'ollama' | 'anthropic';

/**
 * Unified AI chat interface that switches between providers
 */
export async function chat(
  messages: AIMessage[],
  provider: AIProvider,
  apiKey?: string,
  onStream?: (chunk: string) => void
): Promise<string> {
  if (provider === 'anthropic') {
    if (!apiKey) {
      throw new Error('Anthropic API key required when using Anthropic provider');
    }

    // Filter out system messages for Anthropic (they use a different format)
    const anthropicMessages: AnthropicMessage[] = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    // Prepend system message content to first user message if exists
    const systemMessage = messages.find(m => m.role === 'system');
    if (systemMessage && anthropicMessages.length > 0 && anthropicMessages[0].role === 'user') {
      anthropicMessages[0].content = `${systemMessage.content}\n\n${anthropicMessages[0].content}`;
    }

    return chatWithAnthropic(anthropicMessages, apiKey, onStream);
  } else {
    // Ollama supports system messages natively
    const ollamaMessages: OllamaMessage[] = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    return chatWithOllama(ollamaMessages, onStream);
  }
}

/**
 * Get provider from stored preferences or default
 */
export function getStoredProvider(): AIProvider {
  if (typeof window === 'undefined') return 'ollama';

  const stored = localStorage.getItem('ai_provider');
  return (stored === 'anthropic' || stored === 'ollama') ? stored : 'ollama';
}

/**
 * Store provider preference
 */
export function setStoredProvider(provider: AIProvider): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ai_provider', provider);
}

/**
 * Get stored API key
 */
export function getStoredApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('anthropic_api_key');
}

/**
 * Store API key
 */
export function setStoredApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('anthropic_api_key', apiKey);
}

/**
 * Clear stored API key
 */
export function clearStoredApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('anthropic_api_key');
}
