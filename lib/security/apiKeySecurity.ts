/**
 * Enhanced API Key Security
 * Additional protections for API key handling
 */

import { validateApiKeyFormat } from './validation';
import { checkApiKeyTestRateLimit } from './rateLimit';

/**
 * Securely store API key in localStorage with additional metadata
 */
export function secureStoreApiKey(key: string, provider: 'anthropic' | 'openai'): boolean {
  if (!validateApiKeyFormat(key, provider)) {
    return false;
  }

  try {
    const metadata = {
      key: key,
      provider: provider,
      stored: Date.now(),
      lastUsed: Date.now(),
    };

    localStorage.setItem('api_key_metadata', JSON.stringify(metadata));
    return true;
  } catch (error) {
    console.error('Failed to store API key:', error);
    return false;
  }
}

/**
 * Retrieve API key with usage tracking
 */
export function secureRetrieveApiKey(): { key: string; provider: string } | null {
  try {
    const stored = localStorage.getItem('api_key_metadata');
    if (!stored) return null;

    const metadata = JSON.parse(stored);

    // Update last used timestamp
    metadata.lastUsed = Date.now();
    localStorage.setItem('api_key_metadata', JSON.stringify(metadata));

    return {
      key: metadata.key,
      provider: metadata.provider,
    };
  } catch (error) {
    console.error('Failed to retrieve API key:', error);
    return null;
  }
}

/**
 * Clear API key and metadata
 */
export function secureClearApiKey(): void {
  try {
    localStorage.removeItem('api_key_metadata');
  } catch (error) {
    console.error('Failed to clear API key:', error);
  }
}

/**
 * Check if API key should be rotated (older than 30 days)
 */
export function shouldRotateApiKey(): boolean {
  try {
    const stored = localStorage.getItem('api_key_metadata');
    if (!stored) return false;

    const metadata = JSON.parse(stored);
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    return metadata.stored < thirtyDaysAgo;
  } catch {
    return false;
  }
}

/**
 * Test API key with rate limiting
 */
export async function testApiKeyWithRateLimit(
  key: string,
  provider: 'anthropic',
  testFunction: (key: string) => Promise<boolean>
): Promise<{ success: boolean; error?: string }> {
  // Check rate limit
  const rateLimit = checkApiKeyTestRateLimit();
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds`,
    };
  }

  // Validate format first
  if (!validateApiKeyFormat(key, provider)) {
    return {
      success: false,
      error: 'Invalid API key format',
    };
  }

  // Test the key
  try {
    const isValid = await testFunction(key);
    return { success: isValid };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'API key test failed',
    };
  }
}

/**
 * Mask API key for display (show first 8 and last 4 characters)
 */
export function maskApiKey(key: string): string {
  if (key.length < 16) return '****';

  const start = key.slice(0, 8);
  const end = key.slice(-4);
  const masked = '*'.repeat(Math.min(key.length - 12, 20));

  return `${start}${masked}${end}`;
}

/**
 * Validate API key hasn't been compromised (basic checks)
 */
export function validateKeyIntegrity(key: string): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Check for common patterns that might indicate a compromised key
  if (key.includes(' ')) {
    warnings.push('API key contains spaces');
  }

  if (key.length < 20) {
    warnings.push('API key is too short');
  }

  if (key.length > 250) {
    warnings.push('API key is unusually long');
  }

  // Check for suspicious patterns
  const repeatingPattern = /(.)\1{5,}/;
  if (repeatingPattern.test(key)) {
    warnings.push('API key contains suspicious repeating characters');
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

/**
 * Get API key usage statistics
 */
export function getApiKeyStats(): { stored: Date | null; lastUsed: Date | null; age: number } {
  try {
    const stored = localStorage.getItem('api_key_metadata');
    if (!stored) {
      return { stored: null, lastUsed: null, age: 0 };
    }

    const metadata = JSON.parse(stored);
    const age = Math.floor((Date.now() - metadata.stored) / (24 * 60 * 60 * 1000)); // Age in days

    return {
      stored: new Date(metadata.stored),
      lastUsed: new Date(metadata.lastUsed),
      age,
    };
  } catch {
    return { stored: null, lastUsed: null, age: 0 };
  }
}
