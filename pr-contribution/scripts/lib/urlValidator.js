/**
 * URL Validator Module
 * Validates URLs with HTTP status checks and caching
 *
 * Features:
 * - HTTP/HTTPS validation
 * - Caching to avoid re-checking same URLs
 * - Rate limiting
 * - Timeout handling
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// URL validation cache (in-memory)
const urlCache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Validate a single URL
 * @param {string} url - URL to validate
 * @param {number} timeout - Timeout in milliseconds (default 5000)
 * @returns {Promise<object>} Validation result with status code
 */
async function validateUrl(url, timeout = 5000) {
  if (!url || typeof url !== 'string') {
    return {
      valid: false,
      status: null,
      error: 'Invalid URL input'
    };
  }

  // Check cache first
  const cached = urlCache.get(url);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.result;
  }

  try {
    // Parse URL
    const parsedUrl = new URL(url);

    // Choose HTTP or HTTPS module
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const result = await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, timeout);

      const req = client.request(
        {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port,
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'HEAD', // HEAD request to save bandwidth
          headers: {
            'User-Agent': 'Web3Privacy-Data-Validator/1.0'
          }
        },
        (res) => {
          clearTimeout(timeoutId);

          const status = res.statusCode;
          const valid = status >= 200 && status < 400; // 200-399 are success

          resolve({
            valid,
            status,
            error: null,
            redirected: status >= 300 && status < 400,
            location: res.headers.location || null
          });
        }
      );

      req.on('error', (error) => {
        clearTimeout(timeoutId);
        reject(error);
      });

      req.end();
    });

    // Cache the result
    urlCache.set(url, {
      timestamp: Date.now(),
      result
    });

    return result;

  } catch (error) {
    const result = {
      valid: false,
      status: null,
      error: error.message
    };

    // Cache errors too (for a shorter time)
    urlCache.set(url, {
      timestamp: Date.now(),
      result
    });

    return result;
  }
}

/**
 * Validate multiple URLs in batch
 * @param {array} urls - Array of URLs to validate
 * @param {number} delayMs - Delay between requests (default 100ms)
 * @returns {Promise<object>} Object with URL -> validation result mapping
 */
async function validateUrlsBatch(urls, delayMs = 100) {
  const results = {};

  for (const url of urls) {
    if (url) {
      results[url] = await validateUrl(url);

      // Delay to avoid overwhelming servers
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  return results;
}

/**
 * Validate all URLs in a links object
 * @param {object} links - Object with link keys (web, github, docs, etc.)
 * @returns {Promise<object>} Object with validation results per link type
 */
async function validateLinksObject(links) {
  if (!links || typeof links !== 'object') {
    return {};
  }

  const results = {};

  for (const [key, url] of Object.entries(links)) {
    if (url && typeof url === 'string') {
      results[key] = await validateUrl(url);
    }
  }

  return results;
}

/**
 * Extract all URLs from project data
 * @param {object} projectData - Loaded project data
 * @returns {array} Array of URLs found in project
 */
function extractUrls(projectData) {
  const urls = new Set();

  // From constitutional research
  if (projectData.constitutional) {
    const cr = projectData.constitutional;

    if (cr.project_overview?.website) urls.add(cr.project_overview.website);
    if (cr.project_overview?.documentation) urls.add(cr.project_overview.documentation);

    // From sources
    if (cr.sources) {
      cr.sources.forEach(source => {
        if (source.url) urls.add(source.url);
      });
    }
  }

  // From metadata
  if (projectData.metadata?.github) {
    urls.add(projectData.metadata.github);
  }

  return Array.from(urls);
}

/**
 * Get cache statistics
 * @returns {object} Cache stats
 */
function getCacheStats() {
  return {
    size: urlCache.size,
    entries: Array.from(urlCache.keys())
  };
}

/**
 * Clear URL cache
 */
function clearCache() {
  urlCache.clear();
}

/**
 * Delay utility
 * @param {number} ms - Milliseconds to delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Export functions
module.exports = {
  validateUrl,
  validateUrlsBatch,
  validateLinksObject,
  extractUrls,
  getCacheStats,
  clearCache,
  delay
};
