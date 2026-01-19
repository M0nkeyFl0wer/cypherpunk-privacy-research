/**
 * Seshat Server Security Restrictions
 * Limits remote operations to search functionality only
 */

/**
 * Allowed operations on Seshat server
 */
const ALLOWED_OPERATIONS = new Set([
  'search',
  'query',
  'chat',
]);

/**
 * Blocked patterns that should never be allowed
 */
const BLOCKED_PATTERNS = [
  // Command injection attempts
  /[;&|`$]/,
  /\$\(/,
  /`.*`/,

  // File system operations
  /\.\./,
  /\/etc\//,
  /\/root\//,
  /\/home\//,
  /\/var\//,
  /\/usr\//,

  // Shell commands
  /\brm\b/,
  /\bmv\b/,
  /\bcp\b/,
  /\bchmod\b/,
  /\bchown\b/,
  /\bkill\b/,
  /\bsudo\b/,
  /\bsu\b/,
  /\bwget\b/,
  /\bcurl\b/,
  /\bssh\b/,
  /\bscp\b/,
  /\bexec\b/,
  /\beval\b/,

  // Script execution
  /\bsh\b/,
  /\bbash\b/,
  /\bpython\b/,
  /\bnode\b/,
  /\bperl\b/,

  // Network operations
  /\bnc\b/,
  /\bnetcat\b/,
  /\bnmap\b/,
  /\btelnet\b/,
];

/**
 * Validate that a query is safe for Seshat
 */
export function validateSeshatQuery(query: string): { valid: boolean; error?: string } {
  if (typeof query !== 'string') {
    return { valid: false, error: 'Query must be a string' };
  }

  const trimmed = query.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Query cannot be empty' };
  }

  if (trimmed.length > 1000) {
    return { valid: false, error: 'Query too long (max 1000 characters)' };
  }

  // Check for blocked patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      console.warn('[SECURITY] Blocked Seshat query:', trimmed);
      return { valid: false, error: 'Query contains forbidden patterns' };
    }
  }

  return { valid: true };
}

/**
 * Validate operation type
 */
export function validateSeshatOperation(operation: string): boolean {
  return ALLOWED_OPERATIONS.has(operation.toLowerCase());
}

/**
 * Sanitize query for Seshat Ollama endpoint
 */
export function sanitizeSeshatQuery(query: string): string {
  // Remove any control characters
  let sanitized = query.replace(/[\x00-\x1F\x7F]/g, '');

  // Remove any backslashes (prevent escape sequences)
  sanitized = sanitized.replace(/\\/g, '');

  // Trim to reasonable length
  sanitized = sanitized.slice(0, 1000);

  return sanitized.trim();
}

/**
 * Create safe Ollama request payload
 */
export interface SafeOllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
}

// Model configuration - use env var or default to qwen3:8b (good balance of speed/quality)
const OLLAMA_MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'qwen3:8b';

export function createSafeOllamaRequest(
  query: string,
  stream: boolean = false
): SafeOllamaRequest | null {
  const validation = validateSeshatQuery(query);

  if (!validation.valid) {
    console.error('[SECURITY] Invalid Seshat query:', validation.error);
    return null;
  }

  const sanitized = sanitizeSeshatQuery(query);

  return {
    model: OLLAMA_MODEL,
    prompt: sanitized,
    stream,
  };
}

/**
 * Validate Seshat endpoint URL
 */
export function validateSeshatEndpoint(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Only allow specific Seshat endpoints
    const allowedHosts = ['your-server.example.com', 'localhost'];
    const allowedPaths = ['/api/generate', '/api/chat'];

    if (!allowedHosts.includes(parsed.hostname)) {
      return false;
    }

    if (!allowedPaths.some(path => parsed.pathname.startsWith(path))) {
      return false;
    }

    // Only allow specific port
    if (parsed.port !== '11434' && parsed.port !== '') {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Rate limiting specifically for Seshat operations
 */
const seshatRateLimits = new Map<string, { count: number; resetTime: number }>();

export function checkSeshatRateLimit(
  userId: string
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const key = `seshat_${userId}`;
  const state = seshatRateLimits.get(key);

  const maxRequests = 20; // Max 20 requests per minute
  const windowMs = 60 * 1000;

  if (!state || now >= state.resetTime) {
    seshatRateLimits.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true };
  }

  if (state.count < maxRequests) {
    state.count++;
    return { allowed: true };
  }

  const retryAfter = Math.ceil((state.resetTime - now) / 1000);
  return { allowed: false, retryAfter };
}

/**
 * Log security events for monitoring
 */
export function logSecurityEvent(event: {
  type: 'blocked_query' | 'rate_limit' | 'invalid_operation';
  query?: string;
  operation?: string;
  timestamp: number;
}): void {
  // In production, this should send to a security monitoring service
  console.warn('[SESHAT SECURITY]', {
    ...event,
    timestamp: new Date(event.timestamp).toISOString(),
  });

  // Store in localStorage for debugging (max 100 events)
  try {
    const stored = localStorage.getItem('seshat_security_log');
    const log = stored ? JSON.parse(stored) : [];

    log.push(event);

    // Keep only last 100 events
    if (log.length > 100) {
      log.shift();
    }

    localStorage.setItem('seshat_security_log', JSON.stringify(log));
  } catch (e) {
    // Ignore localStorage errors
  }
}

/**
 * Get security log for review
 */
export function getSecurityLog(): any[] {
  try {
    const stored = localStorage.getItem('seshat_security_log');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
