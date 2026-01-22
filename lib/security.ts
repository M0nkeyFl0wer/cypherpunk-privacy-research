/**
 * Security utilities for form protection
 *
 * Defenses against:
 * - Bot spam (honeypot, timing)
 * - Injection attacks (sanitization)
 * - Rate limiting abuse
 * - XSS attempts
 */

const RATE_LIMIT_KEY = 'w3p_rate_limit';
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 3;

/**
 * Honeypot field names - bots often fill these thinking they're real fields
 * Use innocuous names that bots target
 */
export const HONEYPOT_FIELDS = {
  // Looks like a real field bots want to fill
  website: 'website_url',
  phone: 'phone_number',
  // Hidden timing field
  timestamp: '_ts',
} as const;

/**
 * Minimum time (ms) between page load and form submission
 * Real users take at least a few seconds to fill a form
 */
export const MIN_SUBMISSION_TIME = 3000; // 3 seconds

/**
 * Check if submission passes honeypot validation
 */
export function validateHoneypot(formData: {
  honeypotWebsite?: string;
  honeypotPhone?: string;
  loadTimestamp?: number;
}): { valid: boolean; reason?: string } {
  // Check honeypot fields - should be empty
  if (formData.honeypotWebsite && formData.honeypotWebsite.trim() !== '') {
    console.warn('[Security] Honeypot triggered: website field filled');
    return { valid: false, reason: 'honeypot_website' };
  }

  if (formData.honeypotPhone && formData.honeypotPhone.trim() !== '') {
    console.warn('[Security] Honeypot triggered: phone field filled');
    return { valid: false, reason: 'honeypot_phone' };
  }

  // Check timing - too fast = likely bot
  if (formData.loadTimestamp) {
    const elapsed = Date.now() - formData.loadTimestamp;
    if (elapsed < MIN_SUBMISSION_TIME) {
      console.warn(`[Security] Timing check failed: ${elapsed}ms < ${MIN_SUBMISSION_TIME}ms`);
      return { valid: false, reason: 'too_fast' };
    }
  }

  return { valid: true };
}

/**
 * Check rate limiting
 */
export function checkRateLimit(): { allowed: boolean; remainingAttempts: number } {
  if (typeof window === 'undefined') {
    return { allowed: true, remainingAttempts: MAX_SUBMISSIONS_PER_WINDOW };
  }

  const now = Date.now();
  const stored = localStorage.getItem(RATE_LIMIT_KEY);

  let submissions: number[] = [];
  if (stored) {
    try {
      submissions = JSON.parse(stored);
    } catch {
      submissions = [];
    }
  }

  // Filter to only submissions within the window
  submissions = submissions.filter(t => now - t < RATE_LIMIT_WINDOW);

  const remaining = MAX_SUBMISSIONS_PER_WINDOW - submissions.length;

  return {
    allowed: submissions.length < MAX_SUBMISSIONS_PER_WINDOW,
    remainingAttempts: Math.max(0, remaining),
  };
}

/**
 * Record a submission for rate limiting
 */
export function recordSubmission(): void {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const stored = localStorage.getItem(RATE_LIMIT_KEY);

  let submissions: number[] = [];
  if (stored) {
    try {
      submissions = JSON.parse(stored);
    } catch {
      submissions = [];
    }
  }

  // Filter old submissions and add new one
  submissions = submissions.filter(t => now - t < RATE_LIMIT_WINDOW);
  submissions.push(now);

  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
}

/**
 * Sanitize user input to prevent XSS
 * For display purposes - strips HTML tags and dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: urls
    .replace(/javascript:/gi, '')
    // Remove data: urls
    .replace(/data:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Limit length
    .slice(0, 10000)
    // Trim whitespace
    .trim();
}

/**
 * Sanitize for URL encoding (for GitHub issue body)
 */
export function sanitizeForUrl(input: string): string {
  const sanitized = sanitizeInput(input);
  // Additional URL-safe sanitization
  return sanitized
    // Remove potential URL manipulation
    .replace(/[<>"'`]/g, '')
    // Normalize newlines
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

/**
 * Generate a simple proof-of-work challenge
 * Makes automated submissions more expensive
 */
export function generateChallenge(): { challenge: string; expectedPrefix: string } {
  const challenge = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  // Expect first 2 chars of hash to be '00' (easy challenge)
  return { challenge, expectedPrefix: '00' };
}

/**
 * Verify proof-of-work (simple version - just checks timing for now)
 * In production, you'd want actual hash verification
 */
export function verifyChallenge(startTime: number): boolean {
  const elapsed = Date.now() - startTime;
  // Must take at least 1 second (human interaction time)
  return elapsed >= 1000;
}

/**
 * Check if request looks suspicious
 */
export function checkSuspiciousPatterns(input: string): { suspicious: boolean; flags: string[] } {
  const flags: string[] = [];

  // Check for common spam patterns
  const spamPatterns = [
    /\b(viagra|cialis|casino|crypto.*airdrop|free.*bitcoin|click.*here|act.*now)\b/i,
    /\b(nigerian.*prince|lottery.*winner|inheritance.*fund)\b/i,
    // Excessive URLs
    /(https?:\/\/[^\s]+){5,}/i,
    // Suspicious encoding
    /&#x?[0-9a-f]+;/i,
    // Script injection attempts
    /<script|javascript:|vbscript:/i,
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(input)) {
      flags.push(pattern.source.slice(0, 30));
    }
  }

  return {
    suspicious: flags.length > 0,
    flags,
  };
}
