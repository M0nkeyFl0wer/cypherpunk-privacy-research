/**
 * Privacy-respecting local telemetry
 *
 * All data is stored locally in the browser and never sent to external services.
 * This provides basic analytics while respecting user privacy.
 *
 * Data collected:
 * - Page views (path only, no query params)
 * - Session duration
 * - Referrer (if from external site)
 * - Basic device info (viewport size category, not fingerprinting)
 *
 * Data NOT collected:
 * - IP addresses
 * - Cookies
 * - Personal information
 * - Precise device fingerprints
 */

export interface PageView {
  path: string;
  timestamp: number;
  referrer?: string;
  viewport: 'mobile' | 'tablet' | 'desktop';
  sessionId: string;
}

export interface TelemetryData {
  pageViews: PageView[];
  sessions: {
    id: string;
    startTime: number;
    endTime: number;
    pageCount: number;
  }[];
  totalPageViews: number;
  uniquePaths: string[];
  lastUpdated: number;
}

const STORAGE_KEY = 'w3p_telemetry';
const SESSION_KEY = 'w3p_session';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Get viewport category without fingerprinting
 */
function getViewportCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Generate a random session ID (not persistent across sessions)
 */
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Get or create session
 */
function getSession(): { id: string; isNew: boolean } {
  if (typeof window === 'undefined') {
    return { id: generateSessionId(), isNew: true };
  }

  const stored = sessionStorage.getItem(SESSION_KEY);
  if (stored) {
    const session = JSON.parse(stored);
    const now = Date.now();
    // Check if session is still valid
    if (now - session.lastActivity < SESSION_TIMEOUT) {
      session.lastActivity = now;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { id: session.id, isNew: false };
    }
  }

  // Create new session
  const newSession = {
    id: generateSessionId(),
    startTime: Date.now(),
    lastActivity: Date.now(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  return { id: newSession.id, isNew: true };
}

/**
 * Load telemetry data from localStorage
 */
export function loadTelemetry(): TelemetryData {
  if (typeof window === 'undefined') {
    return {
      pageViews: [],
      sessions: [],
      totalPageViews: 0,
      uniquePaths: [],
      lastUpdated: Date.now(),
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Corrupted data, reset
    }
  }

  return {
    pageViews: [],
    sessions: [],
    totalPageViews: 0,
    uniquePaths: [],
    lastUpdated: Date.now(),
  };
}

/**
 * Save telemetry data to localStorage
 */
function saveTelemetry(data: TelemetryData): void {
  if (typeof window === 'undefined') return;

  // Keep only last 1000 page views to avoid localStorage bloat
  if (data.pageViews.length > 1000) {
    data.pageViews = data.pageViews.slice(-1000);
  }

  // Keep only last 100 sessions
  if (data.sessions.length > 100) {
    data.sessions = data.sessions.slice(-100);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Track a page view
 */
export function trackPageView(path: string): void {
  if (typeof window === 'undefined') return;

  const session = getSession();
  const data = loadTelemetry();

  // Clean path (remove query params for privacy)
  const cleanPath = path.split('?')[0];

  const pageView: PageView = {
    path: cleanPath,
    timestamp: Date.now(),
    referrer: document.referrer && !document.referrer.includes(window.location.hostname)
      ? new URL(document.referrer).hostname
      : undefined,
    viewport: getViewportCategory(),
    sessionId: session.id,
  };

  data.pageViews.push(pageView);
  data.totalPageViews++;

  if (!data.uniquePaths.includes(cleanPath)) {
    data.uniquePaths.push(cleanPath);
  }

  // Update or create session
  if (session.isNew) {
    data.sessions.push({
      id: session.id,
      startTime: Date.now(),
      endTime: Date.now(),
      pageCount: 1,
    });
  } else {
    const existingSession = data.sessions.find(s => s.id === session.id);
    if (existingSession) {
      existingSession.endTime = Date.now();
      existingSession.pageCount++;
    }
  }

  data.lastUpdated = Date.now();
  saveTelemetry(data);
}

/**
 * Track a custom event
 */
export function trackEvent(category: string, action: string, label?: string): void {
  if (typeof window === 'undefined') return;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Telemetry Event]', { category, action, label });
  }

  // Events are logged but not stored (to keep storage minimal)
  // Extend this if you want to store events
}

/**
 * Get analytics summary
 */
export function getAnalyticsSummary(): {
  totalPageViews: number;
  uniquePages: number;
  totalSessions: number;
  topPages: { path: string; views: number }[];
  viewportBreakdown: { mobile: number; tablet: number; desktop: number };
  recentActivity: PageView[];
} {
  const data = loadTelemetry();

  // Count page views per path
  const pathCounts: Record<string, number> = {};
  const viewportCounts = { mobile: 0, tablet: 0, desktop: 0 };

  for (const pv of data.pageViews) {
    pathCounts[pv.path] = (pathCounts[pv.path] || 0) + 1;
    viewportCounts[pv.viewport]++;
  }

  const topPages = Object.entries(pathCounts)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return {
    totalPageViews: data.totalPageViews,
    uniquePages: data.uniquePaths.length,
    totalSessions: data.sessions.length,
    topPages,
    viewportBreakdown: viewportCounts,
    recentActivity: data.pageViews.slice(-20).reverse(),
  };
}

/**
 * Clear all telemetry data
 */
export function clearTelemetry(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Export telemetry data as JSON (for backup/analysis)
 */
export function exportTelemetry(): string {
  const data = loadTelemetry();
  return JSON.stringify(data, null, 2);
}
