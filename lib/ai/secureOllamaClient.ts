/**
 * Secure Ollama Client with Seshat Restrictions
 * Only allows search/query operations, prevents command injection
 */

import {
  validateSeshatQuery,
  validateSeshatOperation,
  createSafeOllamaRequest,
  validateSeshatEndpoint,
  checkSeshatRateLimit,
  logSecurityEvent,
} from '@/lib/security/seshatRestrictions';

// Use local tunnel (via scripts/start-ollama-tunnel.sh) or direct connection
// Tunnel: ssh -N -L 11434:localhost:11434 seshat
const SESHAT_OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434/api/generate';

export interface SecureOllamaMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Securely chat with Ollama on Seshat
 * Enforces search-only operations
 */
export async function secureOllamaChat(
  messages: SecureOllamaMessage[],
  onStream?: (chunk: string) => void
): Promise<string> {
  // Generate user ID for rate limiting
  const userId = getUserId();

  // Check rate limit
  const rateLimit = checkSeshatRateLimit(userId);
  if (!rateLimit.allowed) {
    const error = `Rate limit exceeded. Please try again in ${rateLimit.retryAfter} seconds.`;
    logSecurityEvent({
      type: 'rate_limit',
      timestamp: Date.now(),
    });
    throw new Error(error);
  }

  // Validate operation type (only 'search' allowed)
  if (!validateSeshatOperation('search')) {
    logSecurityEvent({
      type: 'invalid_operation',
      operation: 'unknown',
      timestamp: Date.now(),
    });
    throw new Error('Invalid operation type');
  }

  // Get the user's query
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== 'user') {
    throw new Error('Invalid message format');
  }

  const query = lastMessage.content;

  // Validate query
  const validation = validateSeshatQuery(query);
  if (!validation.valid) {
    logSecurityEvent({
      type: 'blocked_query',
      query: query.slice(0, 100), // Log first 100 chars only
      timestamp: Date.now(),
    });
    throw new Error(validation.error || 'Invalid query');
  }

  // Create safe request
  const safeRequest = createSafeOllamaRequest(query, !!onStream);
  if (!safeRequest) {
    throw new Error('Failed to create safe request');
  }

  // Validate endpoint
  if (!validateSeshatEndpoint(SESHAT_OLLAMA_URL)) {
    throw new Error('Invalid Seshat endpoint');
  }

  try {
    const response = await fetch(SESHAT_OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(safeRequest),
    });

    if (!response.ok) {
      throw new Error(`Seshat error (${response.status}): ${response.statusText}`);
    }

    if (onStream && response.body) {
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              fullResponse += json.response;
              onStream(json.response);
            }
          } catch (e) {
            // Ignore JSON parse errors
          }
        }
      }

      return fullResponse;
    } else {
      // Handle non-streaming response
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim());
      let fullResponse = '';

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            fullResponse += json.response;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      return fullResponse;
    }
  } catch (error) {
    console.error('Seshat Ollama error:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to connect to Seshat'
    );
  }
}

/**
 * Get or create a user ID for rate limiting
 */
function getUserId(): string {
  try {
    let userId = localStorage.getItem('seshat_user_id');
    if (!userId) {
      userId = generateUserId();
      localStorage.setItem('seshat_user_id', userId);
    }
    return userId;
  } catch {
    return 'anonymous';
  }
}

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2);
}

/**
 * Test Seshat connection with security restrictions
 */
export async function testSeshatConnection(): Promise<boolean> {
  try {
    const result = await secureOllamaChat([
      { role: 'user', content: 'Hello' },
    ]);
    return result.length > 0;
  } catch (error) {
    console.error('Seshat connection test failed:', error);
    return false;
  }
}
