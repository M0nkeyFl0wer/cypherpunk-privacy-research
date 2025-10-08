/**
 * Rate Limiting Implementation
 * Prevents abuse and ensures fair usage
 */

import { checkRateLimit as checkLimit } from './validation';

/**
 * Rate limit configurations
 */
export const RATE_LIMITS = {
  chat: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  search: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },
  feedback: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  apiKeyTest: {
    maxRequests: 3,
    windowMs: 5 * 60 * 1000, // 5 minutes
  },
} as const;

/**
 * Get user identifier for rate limiting
 */
function getUserIdentifier(): string {
  if (typeof window === 'undefined') return 'server';

  // Use fingerprint based on browser characteristics
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.colorDepth,
    screen.width + 'x' + screen.height,
  ].join('|');

  // Simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return 'user_' + Math.abs(hash).toString(36);
}

/**
 * Check rate limit for chat requests
 */
export function checkChatRateLimit(): { allowed: boolean; retryAfter?: number } {
  const userId = getUserIdentifier();
  return checkLimit(
    `chat_${userId}`,
    RATE_LIMITS.chat.maxRequests,
    RATE_LIMITS.chat.windowMs
  );
}

/**
 * Check rate limit for search requests
 */
export function checkSearchRateLimit(): { allowed: boolean; retryAfter?: number } {
  const userId = getUserIdentifier();
  return checkLimit(
    `search_${userId}`,
    RATE_LIMITS.search.maxRequests,
    RATE_LIMITS.search.windowMs
  );
}

/**
 * Check rate limit for feedback submissions
 */
export function checkFeedbackRateLimit(): { allowed: boolean; retryAfter?: number } {
  const userId = getUserIdentifier();
  return checkLimit(
    `feedback_${userId}`,
    RATE_LIMITS.feedback.maxRequests,
    RATE_LIMITS.feedback.windowMs
  );
}

/**
 * Check rate limit for API key testing
 */
export function checkApiKeyTestRateLimit(): { allowed: boolean; retryAfter?: number } {
  const userId = getUserIdentifier();
  return checkLimit(
    `apitest_${userId}`,
    RATE_LIMITS.apiKeyTest.maxRequests,
    RATE_LIMITS.apiKeyTest.windowMs
  );
}

/**
 * Format retry-after message
 */
export function formatRetryMessage(retryAfter: number): string {
  if (retryAfter < 60) {
    return `Please try again in ${retryAfter} seconds`;
  }

  const minutes = Math.ceil(retryAfter / 60);
  return `Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}`;
}
