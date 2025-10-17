/**
 * Data Loader Module
 * Loads and merges all project data files into a unified object
 *
 * Handles:
 * - constitutional_research.json (main research data)
 * - project_metadata.json (basic metadata)
 * - analysis/github_analysis.json (GitHub stats)
 * - analysis/smart_contracts.json (contract addresses)
 * - sources/verified_data.json (verified external data)
 */

const fs = require('fs');
const path = require('path');

/**
 * Load a JSON file safely, return null if missing or invalid
 */
function loadJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Warning: Failed to load ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Load all data files for a project
 * @param {string} projectPath - Path to project directory (e.g., deliverables/aztec-network)
 * @returns {object|null} Merged project data or null if critical files missing
 */
function loadProjectData(projectPath) {
  const projectSlug = path.basename(projectPath);

  // Load all possible data files
  const constitutionalResearch = loadJsonSafe(path.join(projectPath, 'constitutional_research.json'));
  const projectMetadata = loadJsonSafe(path.join(projectPath, 'project_metadata.json'));
  const githubAnalysis = loadJsonSafe(path.join(projectPath, 'analysis/github_analysis.json'));
  const smartContracts = loadJsonSafe(path.join(projectPath, 'analysis/smart_contracts.json'));
  const verifiedData = loadJsonSafe(path.join(projectPath, 'sources/verified_data.json'));

  // Check for minimum required data
  if (!constitutionalResearch && !projectMetadata) {
    console.error(`Error: ${projectSlug} missing both constitutional_research.json and project_metadata.json`);
    return null;
  }

  // Read README and CARD for text content
  let readmeContent = null;
  let cardContent = null;

  try {
    const readmePath = path.join(projectPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      readmeContent = fs.readFileSync(readmePath, 'utf8');
    }
  } catch (error) {
    // README is optional
  }

  try {
    const cardPath = path.join(projectPath, 'CARD.md');
    if (fs.existsSync(cardPath)) {
      cardContent = fs.readFileSync(cardPath, 'utf8');
    }
  } catch (error) {
    // CARD is optional
  }

  // Merge all data sources
  const mergedData = {
    // Core identifiers
    slug: projectSlug,

    // Constitutional research (most comprehensive)
    constitutional: constitutionalResearch,

    // Metadata
    metadata: projectMetadata,

    // Analysis data
    github: githubAnalysis,
    contracts: smartContracts,
    verified: verifiedData,

    // Text content
    readme: readmeContent,
    card: cardContent,

    // Paths for reference
    paths: {
      base: projectPath,
      readme: path.join(projectPath, 'README.md'),
      card: path.join(projectPath, 'CARD.md')
    }
  };

  // Calculate data completeness score
  mergedData.completeness = calculateCompleteness(mergedData);

  // Calculate confidence score (from metadata or constitutional)
  mergedData.confidence = extractConfidence(mergedData);

  return mergedData;
}

/**
 * Calculate data completeness percentage
 */
function calculateCompleteness(data) {
  let totalFields = 0;
  let filledFields = 0;

  // Check constitutional research fields
  if (data.constitutional) {
    const cr = data.constitutional;
    totalFields += 10;

    if (cr.project_overview?.name) filledFields++;
    if (cr.project_overview?.description) filledFields++;
    if (cr.project_overview?.website) filledFields++;
    if (cr.technical_architecture?.privacy_technology?.length > 0) filledFields++;
    if (cr.team_and_governance?.founders?.length > 0) filledFields++;
    if (cr.token_economics?.native_token) filledFields++;
    if (cr.audits_and_security?.length > 0) filledFields++;
    if (cr.funding_and_investment?.total_funding) filledFields++;
    if (cr.sources?.length > 0) filledFields++;
    if (data.readme || data.card) filledFields++;
  }

  // Check metadata fields
  if (data.metadata) {
    totalFields += 5;

    if (data.metadata.project_name) filledFields++;
    if (data.metadata.category) filledFields++;
    if (data.metadata.status) filledFields++;
    if (data.metadata.github) filledFields++;
    if (data.metadata.confidence) filledFields++;
  }

  // Check analysis data
  if (data.github) {
    totalFields += 3;
    filledFields += 3; // If file exists, consider it filled
  }

  if (data.contracts) {
    totalFields += 2;
    filledFields += 2;
  }

  return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
}

/**
 * Extract confidence score from available data
 */
function extractConfidence(data) {
  // Priority: metadata > constitutional > default
  if (data.metadata?.confidence) {
    return data.metadata.confidence;
  }

  if (data.constitutional?.confidence) {
    return data.constitutional.confidence;
  }

  // Default based on completeness
  if (data.completeness >= 70) return 0.8;
  if (data.completeness >= 50) return 0.7;
  if (data.completeness >= 30) return 0.6;
  return 0.5;
}

/**
 * Discover all project directories in deliverables folder
 * @param {string} deliverablesPath - Path to deliverables directory
 * @returns {array} Array of project paths
 */
function discoverProjects(deliverablesPath) {
  try {
    const entries = fs.readdirSync(deliverablesPath, { withFileTypes: true });

    return entries
      .filter(entry => entry.isDirectory())
      .filter(entry => !entry.name.startsWith('.')) // Skip hidden dirs
      .map(entry => path.join(deliverablesPath, entry.name))
      .filter(projectPath => {
        // Must have at least one of the required files
        const hasConstitutional = fs.existsSync(path.join(projectPath, 'constitutional_research.json'));
        const hasMetadata = fs.existsSync(path.join(projectPath, 'project_metadata.json'));
        return hasConstitutional || hasMetadata;
      });
  } catch (error) {
    console.error(`Error discovering projects: ${error.message}`);
    return [];
  }
}

/**
 * Load all projects from deliverables directory
 * @param {string} deliverablesPath - Path to deliverables directory
 * @returns {array} Array of loaded project data objects
 */
function loadAllProjects(deliverablesPath) {
  const projectPaths = discoverProjects(deliverablesPath);
  console.log(`Found ${projectPaths.length} projects in ${deliverablesPath}`);

  const loadedProjects = [];
  const errors = [];

  for (const projectPath of projectPaths) {
    const data = loadProjectData(projectPath);
    if (data) {
      loadedProjects.push(data);
    } else {
      errors.push({
        path: projectPath,
        error: 'Failed to load project data'
      });
    }
  }

  console.log(`Successfully loaded ${loadedProjects.length} projects`);
  if (errors.length > 0) {
    console.log(`Failed to load ${errors.length} projects`);
  }

  return {
    projects: loadedProjects,
    errors: errors
  };
}

// Export functions
module.exports = {
  loadProjectData,
  loadAllProjects,
  discoverProjects,
  loadJsonSafe
};
