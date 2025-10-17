/**
 * Synthetic Data Detector Module
 * Detects placeholder and synthetic data patterns
 *
 * Patterns detected:
 * - Lorem ipsum text
 * - Example.com emails/URLs
 * - Placeholder names
 * - TODO/FIXME markers
 * - Test data
 */

// Synthetic data patterns
const SYNTHETIC_PATTERNS = [
  { pattern: /lorem ipsum/i, name: 'Lorem Ipsum', severity: 'high' },
  { pattern: /example\.com/i, name: 'Example.com Domain', severity: 'high' },
  { pattern: /@project\.com/i, name: 'Project.com Email', severity: 'high' },
  { pattern: /\[Author Name\]/i, name: 'Placeholder Author', severity: 'high' },
  { pattern: /TODO:/i, name: 'TODO Marker', severity: 'medium' },
  { pattern: /PLACEHOLDER/i, name: 'Placeholder Text', severity: 'high' },
  { pattern: /test@test\.com/i, name: 'Test Email', severity: 'high' },
  { pattern: /FIXME:/i, name: 'FIXME Marker', severity: 'medium' },
  { pattern: /\[INSERT.*?\]/i, name: 'Insert Placeholder', severity: 'high' },
  { pattern: /TBD/i, name: 'To Be Determined', severity: 'medium' },
  { pattern: /john doe/i, name: 'John Doe', severity: 'high' },
  { pattern: /jane doe/i, name: 'Jane Doe', severity: 'high' },
  { pattern: /@example\./i, name: 'Example Email', severity: 'high' },
  { pattern: /dummy data/i, name: 'Dummy Data', severity: 'high' },
  { pattern: /sample.*?data/i, name: 'Sample Data', severity: 'medium' }
];

/**
 * Check if text contains synthetic data patterns
 * @param {string} text - Text to check
 * @returns {object|null} Detection result or null if clean
 */
function detectSynthetic(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  for (const { pattern, name, severity } of SYNTHETIC_PATTERNS) {
    if (pattern.test(text)) {
      return {
        detected: true,
        pattern: name,
        severity,
        matched: text.match(pattern)[0]
      };
    }
  }

  return {
    detected: false,
    pattern: null,
    severity: null
  };
}

/**
 * Check object recursively for synthetic data
 * @param {any} obj - Object to check
 * @param {string} path - Current path in object (for reporting)
 * @returns {array} Array of detections with paths
 */
function detectSyntheticInObject(obj, path = '') {
  const detections = [];

  if (typeof obj === 'string') {
    const result = detectSynthetic(obj);
    if (result && result.detected) {
      detections.push({
        path,
        ...result
      });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (item !== null && item !== undefined) {
        const itemDetections = detectSyntheticInObject(item, `${path}[${index}]`);
        detections.push(...itemDetections);
      }
    });
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        const newPath = path ? `${path}.${key}` : key;
        const valueDetections = detectSyntheticInObject(value, newPath);
        detections.push(...valueDetections);
      }
    });
  }

  return detections;
}

/**
 * Validate project data for synthetic patterns
 * @param {object} projectData - Loaded project data
 * @returns {object} Validation result
 */
function validateProjectData(projectData) {
  const detections = [];

  // Check constitutional research
  if (projectData.constitutional) {
    const crDetections = detectSyntheticInObject(
      projectData.constitutional,
      'constitutional'
    );
    detections.push(...crDetections);
  }

  // Check metadata
  if (projectData.metadata) {
    const metaDetections = detectSyntheticInObject(
      projectData.metadata,
      'metadata'
    );
    detections.push(...metaDetections);
  }

  // Check README
  if (projectData.readme) {
    const readmeResult = detectSynthetic(projectData.readme);
    if (readmeResult.detected) {
      detections.push({
        path: 'readme',
        ...readmeResult
      });
    }
  }

  // Check CARD
  if (projectData.card) {
    const cardResult = detectSynthetic(projectData.card);
    if (cardResult.detected) {
      detections.push({
        path: 'card',
        ...cardResult
      });
    }
  }

  // Categorize detections by severity
  const highSeverity = detections.filter(d => d.severity === 'high');
  const mediumSeverity = detections.filter(d => d.severity === 'medium');

  return {
    clean: detections.length === 0,
    detections,
    highSeverity,
    mediumSeverity,
    hasCriticalIssues: highSeverity.length > 0
  };
}

/**
 * Check if specific field contains synthetic data
 * @param {any} value - Field value to check
 * @param {string} fieldName - Field name for reporting
 * @returns {object} Detection result
 */
function checkField(value, fieldName = 'field') {
  if (typeof value === 'string') {
    const result = detectSynthetic(value);
    return {
      fieldName,
      ...result
    };
  }

  return {
    fieldName,
    detected: false,
    pattern: null,
    severity: null
  };
}

/**
 * Generate synthetic data report for project
 * @param {object} projectData - Loaded project data
 * @returns {object} Detailed report
 */
function generateReport(projectData) {
  const validation = validateProjectData(projectData);

  return {
    projectSlug: projectData.slug,
    clean: validation.clean,
    totalDetections: validation.detections.length,
    highSeverity: validation.highSeverity.length,
    mediumSeverity: validation.mediumSeverity.length,
    detections: validation.detections.map(d => ({
      path: d.path,
      pattern: d.pattern,
      severity: d.severity,
      matched: d.matched
    })),
    recommendation: validation.hasCriticalIssues
      ? 'SKIP - Contains high-severity synthetic data'
      : validation.detections.length > 0
      ? 'WARN - Contains medium-severity synthetic data'
      : 'PASS - No synthetic data detected'
  };
}

// Export functions
module.exports = {
  detectSynthetic,
  detectSyntheticInObject,
  validateProjectData,
  checkField,
  generateReport,
  SYNTHETIC_PATTERNS
};
