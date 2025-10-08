/**
 * Input Validation and Sanitization Utilities
 * Defensive security layer for user inputs
 */

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .slice(0, 10000); // Max 10k characters
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return '';

  try {
    const parsed = new URL(url);
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.href;
  } catch {
    return '';
  }
}

/**
 * Validate API key format (doesn't verify authenticity)
 */
export function validateApiKeyFormat(key: string, provider: 'anthropic' | 'openai'): boolean {
  if (typeof key !== 'string' || key.length === 0) return false;

  switch (provider) {
    case 'anthropic':
      return key.startsWith('sk-ant-') && key.length >= 24 && key.length <= 200;
    case 'openai':
      return key.startsWith('sk-') && key.length >= 20 && key.length <= 200;
    default:
      return false;
  }
}

/**
 * Validate chat message
 */
export interface ValidatedMessage {
  valid: boolean;
  message?: string;
  error?: string;
}

export function validateChatMessage(message: string): ValidatedMessage {
  if (typeof message !== 'string') {
    return { valid: false, error: 'Message must be a string' };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (trimmed.length > 10000) {
    return { valid: false, error: 'Message too long (max 10,000 characters)' };
  }

  // Check for suspicious patterns (basic XSS prevention)
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: 'Message contains potentially unsafe content' };
    }
  }

  return { valid: true, message: sanitizeInput(trimmed) };
}

/**
 * Validate project slug
 */
export function validateProjectSlug(slug: string): boolean {
  if (typeof slug !== 'string') return false;

  // Only allow alphanumeric, hyphens, underscores
  return /^[a-z0-9-_]+$/i.test(slug) && slug.length > 0 && slug.length <= 100;
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): ValidatedMessage {
  if (typeof query !== 'string') {
    return { valid: false, error: 'Query must be a string' };
  }

  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Query cannot be empty' };
  }

  if (trimmed.length > 200) {
    return { valid: false, error: 'Query too long (max 200 characters)' };
  }

  return { valid: true, message: sanitizeInput(trimmed) };
}

/**
 * Rate limiting state
 */
interface RateLimitState {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitState>();

/**
 * Check rate limit for a given key
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const state = rateLimitStore.get(key);

  // No previous state or window expired
  if (!state || now >= state.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true };
  }

  // Within window
  if (state.count < maxRequests) {
    state.count++;
    return { allowed: true };
  }

  // Rate limit exceeded
  const retryAfter = Math.ceil((state.resetTime - now) / 1000);
  return { allowed: false, retryAfter };
}

/**
 * Clean up expired rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, state] of rateLimitStore.entries()) {
    if (now >= state.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}

/**
 * Generate secure random string (for session IDs, etc.)
 */
export function generateSecureId(length: number = 32): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Fallback (less secure)
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}
