/**
 * YAML Generator Module
 * Generates properly formatted YAML from mapped data
 *
 * Features:
 * - Proper field ordering (matches Web3Privacy schema)
 * - Clean formatting with consistent indentation
 * - Helpful comments for constitutional data
 * - Array and nested object handling
 */

const yaml = require('js-yaml');

/**
 * Field ordering for Web3Privacy YAML
 * Determines the order fields appear in output
 */
const FIELD_ORDER = [
  'id',
  'name',
  'categories',
  'ecosystem',
  'description',
  'product_launch_day',
  'team',
  'links',
  'project_status',
  'technology',
  'blockchain_features',
  'tokens',
  'have_token',
  'funding',
  'audits',
  'data_quality'
];

/**
 * Sort object keys according to field order
 */
function sortFields(obj) {
  const sorted = {};

  // Add fields in specified order
  FIELD_ORDER.forEach(field => {
    if (obj.hasOwnProperty(field)) {
      sorted[field] = obj[field];
    }
  });

  // Add any remaining fields
  Object.keys(obj).forEach(key => {
    if (!sorted.hasOwnProperty(key)) {
      sorted[key] = obj[key];
    }
  });

  return sorted;
}

/**
 * Clean object for YAML output
 * Removes null/undefined values, empty arrays/objects
 */
function cleanObject(obj) {
  if (Array.isArray(obj)) {
    const cleaned = obj
      .map(item => cleanObject(item))
      .filter(item => item !== null && item !== undefined);
    return cleaned.length > 0 ? cleaned : null;
  }

  if (obj && typeof obj === 'object') {
    const cleaned = {};

    Object.entries(obj).forEach(([key, value]) => {
      const cleanedValue = cleanObject(value);

      if (cleanedValue !== null &&
          cleanedValue !== undefined &&
          cleanedValue !== '' &&
          !(Array.isArray(cleanedValue) && cleanedValue.length === 0) &&
          !(typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0)) {
        cleaned[key] = cleanedValue;
      }
    });

    return Object.keys(cleaned).length > 0 ? cleaned : null;
  }

  return obj;
}

/**
 * Generate YAML string from mapped data
 * @param {object} mappedData - Transformed project data
 * @param {boolean} includeComments - Whether to add helpful comments
 * @returns {string} YAML string
 */
function generateYAML(mappedData, includeComments = true) {
  // Clean and sort
  const cleaned = cleanObject(mappedData);
  const sorted = sortFields(cleaned);

  // Generate base YAML
  let yamlString = yaml.dump(sorted, {
    indent: 2,
    lineWidth: 100,
    noRefs: true,
    sortKeys: false // We sort manually
  });

  // Add helpful comments if requested
  if (includeComments) {
    yamlString = addComments(yamlString, sorted);
  }

  return yamlString;
}

/**
 * Add helpful comments to YAML
 */
function addComments(yamlString, data) {
  const lines = yamlString.split('\n');
  const commented = [];

  // Add header comment
  commented.push('# Project data generated from constitutional research methodology');
  commented.push('# Multi-source verification with confidence scoring');
  commented.push('');

  let inDataQuality = false;

  lines.forEach(line => {
    // Add comment before data_quality section
    if (line.startsWith('data_quality:')) {
      commented.push('');
      commented.push('# Constitutional metadata (proposed addition)');
      commented.push('# This section provides transparency about data quality and sources');
      inDataQuality = true;
    }

    // Add inline comments for key fields
    if (line.includes('confidence:') && inDataQuality) {
      commented.push(line + '  # Data confidence score (0.0-1.0)');
    } else if (line.includes('completeness:') && inDataQuality) {
      commented.push(line + '  # Data completeness (0.0-1.0)');
    } else {
      commented.push(line);
    }
  });

  return commented.join('\n');
}

/**
 * Generate YAML file for a project
 * @param {object} projectData - Loaded project data
 * @param {object} mappedData - Transformed data
 * @returns {object} YAML string and metadata
 */
function generateProjectYAML(projectData, mappedData) {
  const yamlString = generateYAML(mappedData, true);

  return {
    yaml: yamlString,
    projectId: mappedData.id,
    projectName: mappedData.name,
    confidence: projectData.confidence,
    completeness: projectData.completeness,
    lines: yamlString.split('\n').length
  };
}

/**
 * Validate YAML syntax
 * @param {string} yamlString - YAML to validate
 * @returns {object} Validation result
 */
function validateYAML(yamlString) {
  try {
    const parsed = yaml.load(yamlString);
    return {
      valid: true,
      parsed,
      error: null
    };
  } catch (error) {
    return {
      valid: false,
      parsed: null,
      error: error.message
    };
  }
}

/**
 * Generate comparison file (before/after)
 * @param {object} originalYAML - Their current YAML (if exists)
 * @param {object} enrichedYAML - Our enriched YAML
 * @returns {string} Markdown comparison
 */
function generateComparison(originalYAML, enrichedYAML) {
  const md = [];

  md.push('# Data Enrichment Comparison');
  md.push('');
  md.push(`**Project**: ${enrichedYAML.projectName}`);
  md.push(`**Project ID**: ${enrichedYAML.projectId}`);
  md.push('');

  md.push('## Before (Current Web3Privacy Data)');
  md.push('');
  md.push('```yaml');
  if (originalYAML && originalYAML.yaml) {
    md.push(originalYAML.yaml);
  } else {
    md.push('# Project not currently in Web3Privacy database');
    md.push('# This is a NEW addition');
  }
  md.push('```');
  md.push('');

  md.push('## After (With Our Enrichment)');
  md.push('');
  md.push('```yaml');
  md.push(enrichedYAML.yaml);
  md.push('```');
  md.push('');

  md.push('## What We Added');
  md.push('');

  // Calculate improvements
  const beforeLines = originalYAML?.lines || 5;
  const afterLines = enrichedYAML.lines;
  const increase = Math.round(((afterLines - beforeLines) / beforeLines) * 100);

  md.push(`- **Data volume**: ${beforeLines} lines → ${afterLines} lines (**${increase}% increase**)`);
  md.push(`- **Confidence score**: ${enrichedYAML.confidence || 'N/A'}`);
  md.push(`- **Completeness**: ${enrichedYAML.completeness || 'N/A'}%`);
  md.push('');

  md.push('### New Fields Added:');
  const enrichedData = yaml.load(enrichedYAML.yaml);

  if (enrichedData.technology?.features?.length > 0) {
    md.push(`- **Privacy techniques**: ${enrichedData.technology.features.length} detailed features`);
  }

  if (enrichedData.team?.teammembers?.length > 0) {
    md.push(`- **Team members**: ${enrichedData.team.teammembers.length} verified members`);
  }

  if (enrichedData.audits?.length > 0) {
    md.push(`- **Security audits**: ${enrichedData.audits.length} audit reports`);
  }

  if (enrichedData.funding?.length > 0) {
    md.push(`- **Funding rounds**: ${enrichedData.funding.length} rounds documented`);
  }

  if (enrichedData.data_quality?.sources?.length > 0) {
    md.push(`- **Verified sources**: ${enrichedData.data_quality.sources.length} sources`);
  }

  md.push('');
  md.push('---');
  md.push('');
  md.push('*Generated with constitutional research methodology*');
  md.push('*Multi-source verification | Confidence scoring | Gap reporting*');

  return md.join('\n');
}

/**
 * Generate minimal YAML without comments (for production)
 */
function generateMinimalYAML(mappedData) {
  const cleaned = cleanObject(mappedData);
  const sorted = sortFields(cleaned);

  return yaml.dump(sorted, {
    indent: 2,
    lineWidth: 100,
    noRefs: true,
    sortKeys: false
  });
}

// Export functions
module.exports = {
  generateYAML,
  generateProjectYAML,
  validateYAML,
  generateComparison,
  generateMinimalYAML,
  sortFields,
  cleanObject
};
