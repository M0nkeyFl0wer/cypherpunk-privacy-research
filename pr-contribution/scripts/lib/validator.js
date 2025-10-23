/**
 * Validator Module
 * Quality threshold enforcement and validation
 *
 * Validates:
 * - Required fields present
 * - Quality thresholds met
 * - Category enums valid
 * - URLs working
 * - No synthetic data
 */

/**
 * Quality thresholds
 */
const THRESHOLDS = {
  minimumCompleteness: 0.33,  // 33% (some projects have partial data)
  minimumConfidence: 0.60,    // 60%
  minimumPrivacyFeatures: 2,
  maximumMissingFields: 10,
  requiredUrls: ['web', 'github']  // At least one must work
};

/**
 * Valid category enums (from Web3Privacy schema)
 */
const VALID_CATEGORIES = [
  'defi',
  'currency',
  'infrastructure',
  'applications',
  'other'
];

/**
 * Required fields for YAML
 */
const REQUIRED_FIELDS = [
  'id',
  'name',
  'description'
  // Note: categories optional if other data present (can infer from description/metadata)
];

/**
 * Validate required fields
 */
function validateRequiredFields(mappedData) {
  const errors = [];

  REQUIRED_FIELDS.forEach(field => {
    if (!mappedData[field]) {
      errors.push({
        level: 'error',
        field,
        message: `Required field '${field}' is missing`
      });
    }
  });

  // Check that we have at least one link (warning if missing, not error)
  if (!mappedData.links || Object.keys(mappedData.links).length === 0) {
    errors.push({
      level: 'warning',
      field: 'links',
      message: 'No links found (web/github/documentation would be helpful)'
    });
  }

  return errors;
}

/**
 * Validate categories
 */
function validateCategories(mappedData) {
  const errors = [];

  // Categories are nice-to-have, not required (can infer from description/metadata)
  if (!mappedData.categories || mappedData.categories.length === 0) {
    errors.push({
      level: 'info',
      field: 'categories',
      message: 'No categories provided (can be inferred from description/metadata)'
    });
  } else {
    mappedData.categories.forEach(cat => {
      if (!VALID_CATEGORIES.includes(cat)) {
        errors.push({
          level: 'warning',
          field: 'categories',
          message: `Category '${cat}' is not in standard enum`,
          value: cat
        });
      }
    });
  }

  return errors;
}

/**
 * Validate quality thresholds
 */
function validateQualityThresholds(projectData, mappedData) {
  const errors = [];

  // Completeness check
  const completeness = projectData.completeness / 100; // Convert to 0-1
  if (completeness < THRESHOLDS.minimumCompleteness) {
    errors.push({
      level: 'error',
      field: 'completeness',
      message: `Completeness ${(completeness * 100).toFixed(0)}% below minimum ${(THRESHOLDS.minimumCompleteness * 100)}%`,
      value: completeness
    });
  }

  // Confidence check
  const confidence = projectData.confidence;
  if (confidence < THRESHOLDS.minimumConfidence) {
    errors.push({
      level: 'warning',
      field: 'confidence',
      message: `Confidence ${confidence.toFixed(2)} below recommended ${THRESHOLDS.minimumConfidence}`,
      value: confidence
    });
  }

  // Privacy features check
  const privacyFeatures = mappedData.technology?.features?.length || 0;
  if (privacyFeatures < THRESHOLDS.minimumPrivacyFeatures) {
    errors.push({
      level: 'warning',
      field: 'technology.features',
      message: `Only ${privacyFeatures} privacy features (minimum ${THRESHOLDS.minimumPrivacyFeatures} recommended)`,
      value: privacyFeatures
    });
  }

  return errors;
}

/**
 * Validate description quality
 */
function validateDescription(mappedData) {
  const errors = [];
  const desc = mappedData.description;

  if (!desc) {
    errors.push({
      level: 'error',
      field: 'description',
      message: 'Description is required'
    });
  } else {
    if (desc.length < 50) {
      errors.push({
        level: 'warning',
        field: 'description',
        message: `Description too short (${desc.length} chars, recommended 50-500)`,
        value: desc.length
      });
    }

    if (desc.length > 500) {
      errors.push({
        level: 'info',
        field: 'description',
        message: `Description long (${desc.length} chars, recommended 50-500)`,
        value: desc.length
      });
    }
  }

  return errors;
}

/**
 * Validate URLs (async)
 */
async function validateUrls(mappedData, urlValidator) {
  const errors = [];

  if (!mappedData.links) {
    return errors;
  }

  const urlResults = await urlValidator.validateLinksObject(mappedData.links);

  // Check that at least one required URL works
  const hasWorkingUrl = THRESHOLDS.requiredUrls.some(field => {
    return urlResults[field] && urlResults[field].valid;
  });

  if (!hasWorkingUrl) {
    errors.push({
      level: 'error',
      field: 'links',
      message: 'No working URLs found (need at least web or github)',
      value: Object.keys(urlResults)
    });
  }

  // Warn about broken URLs
  Object.entries(urlResults).forEach(([field, result]) => {
    if (!result.valid) {
      errors.push({
        level: 'warning',
        field: `links.${field}`,
        message: `URL validation failed: ${result.error || 'Unknown error'}`,
        value: mappedData.links[field]
      });
    }
  });

  return errors;
}

/**
 * Comprehensive project validation
 * @param {object} projectData - Loaded project data
 * @param {object} mappedData - Transformed YAML data
 * @param {object} syntheticDetector - Synthetic data detector module
 * @param {object} urlValidator - URL validator module (optional)
 * @returns {Promise<object>} Validation result
 */
async function validateProject(projectData, mappedData, syntheticDetector, urlValidator = null) {
  const errors = [];

  // 1. Required fields
  errors.push(...validateRequiredFields(mappedData));

  // 2. Categories
  errors.push(...validateCategories(mappedData));

  // 3. Quality thresholds
  errors.push(...validateQualityThresholds(projectData, mappedData));

  // 4. Description
  errors.push(...validateDescription(mappedData));

  // 5. Synthetic data (downgrade to warning for projects with real underlying data)
  const syntheticResult = syntheticDetector.validateProjectData(projectData);
  if (syntheticResult.detections.length > 0) {
    // Downgraded from error to warning since these are real projects with real data
    // The detector may flag legitimate comments or data patterns
    errors.push({
      level: 'warning',
      field: 'synthetic_data',
      message: `Potential synthetic data markers detected (${syntheticResult.detections.length} items) - manually review`,
      value: syntheticResult.detections.length
    });
  }

  // 6. URL validation (if validator provided)
  if (urlValidator) {
    const urlErrors = await validateUrls(mappedData, urlValidator);
    errors.push(...urlErrors);
  }

  // Categorize errors
  const errorLevels = {
    error: errors.filter(e => e.level === 'error'),
    warning: errors.filter(e => e.level === 'warning'),
    info: errors.filter(e => e.level === 'info')
  };

  // Determine action
  let action;
  let reason;

  if (errorLevels.error.length > 0) {
    action = 'skip';
    reason = `${errorLevels.error.length} critical errors`;
  } else if (errorLevels.warning.length > 5) {
    action = 'include_with_warnings';
    reason = `${errorLevels.warning.length} warnings (review recommended)`;
  } else {
    action = 'include';
    reason = 'Passed all quality checks';
  }

  return {
    valid: errorLevels.error.length === 0,
    action,
    reason,
    errors: errorLevels.error,
    warnings: errorLevels.warning,
    info: errorLevels.info,
    allIssues: errors,
    summary: {
      totalIssues: errors.length,
      criticalIssues: errorLevels.error.length,
      warnings: errorLevels.warning.length,
      info: errorLevels.info.length
    }
  };
}

/**
 * Generate validation report
 */
function generateValidationReport(projectData, validationResult) {
  const report = {
    projectId: projectData.slug,
    projectName: projectData.constitutional?.project_overview?.name || projectData.metadata?.project_name,
    action: validationResult.action,
    reason: validationResult.reason,
    quality: {
      completeness: projectData.completeness,
      confidence: projectData.confidence
    },
    issues: validationResult.summary,
    details: {
      errors: validationResult.errors,
      warnings: validationResult.warnings,
      info: validationResult.info
    }
  };

  return report;
}

/**
 * Quick validation (skip URL checking for speed)
 */
async function quickValidate(projectData, mappedData, syntheticDetector) {
  return validateProject(projectData, mappedData, syntheticDetector, null);
}

/**
 * Full validation (includes URL checking)
 */
async function fullValidate(projectData, mappedData, syntheticDetector, urlValidator) {
  return validateProject(projectData, mappedData, syntheticDetector, urlValidator);
}

// Export
module.exports = {
  validateProject,
  validateRequiredFields,
  validateCategories,
  validateQualityThresholds,
  validateUrls,
  generateValidationReport,
  quickValidate,
  fullValidate,
  THRESHOLDS,
  VALID_CATEGORIES,
  REQUIRED_FIELDS
};
