#!/usr/bin/env node
/**
 * Main Transformation Script
 * Transforms all 43 publication-ready projects from JSON to Web3Privacy YAML
 *
 * Workflow:
 * 1. Discover all projects in deliverables/
 * 2. Load data for each project
 * 3. Quick validate (skip URL checks for speed)
 * 4. Map fields to YAML format
 * 5. Generate YAML files
 * 6. Categorize as "enrichment" (overlap) or "new-projects"
 * 7. Generate summary reports
 */

const path = require('path');
const fs = require('fs');
const dataLoader = require('./lib/dataLoader');
const fieldMapper = require('./lib/fieldMapper');
const yamlGenerator = require('./lib/yamlGenerator');
const validator = require('./lib/validator');
const syntheticDetector = require('./lib/syntheticDetector');

// Known W3P Explorer projects (partial list for overlap detection)
const KNOWN_W3P_PROJECTS = [
  'tornado-cash', 'monero', 'zcash', 'aztec', 'railgun', 'nym',
  'secret-network', 'mask-network', 'oasis-network', 'zksync',
  'wasabi-wallet', 'incognito', 'xx-network', 'mysterium-network',
  'mobilecoin', 'orchid', 'dark-fi', 'iron-fish', 'protocol',
  'anon', 'privacy', 'zkpool', 'polygon-id', 'shielded'
];

const DELIVEABLES_PATH = path.join(__dirname, '../../deliverables');
const OUTPUT_DIR = path.join(__dirname, '../output');
const ENRICHMENT_DIR = path.join(OUTPUT_DIR, 'enrichment');
const NEW_PROJECTS_DIR = path.join(OUTPUT_DIR, 'new-projects');
const ERRORS_DIR = path.join(OUTPUT_DIR, 'errors');
const REPORTS_DIR = path.join(__dirname, '../reports');

// Ensure output directories exist
[ENRICHMENT_DIR, NEW_PROJECTS_DIR, ERRORS_DIR, REPORTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Check if project might be in existing W3P database
 */
function isLikelyEnrichment(projectId, projectName) {
  const lowerName = projectName.toLowerCase();
  const lowerID = projectId.toLowerCase();

  return KNOWN_W3P_PROJECTS.some(known =>
    lowerName.includes(known) ||
    lowerID.includes(known)
  );
}

/**
 * Transform single project
 */
async function transformProject(projectPath, projectId) {
  try {
    // Step 1: Load data
    const projectData = dataLoader.loadProjectData(projectPath);
    if (!projectData) {
      return {
        projectId,
        status: 'error',
        reason: 'Failed to load project data',
        error: 'No data files found'
      };
    }

    // Step 2: Map fields first
    const mappedData = fieldMapper.transformProject(projectData);
    if (!mappedData) {
      return {
        projectId,
        status: 'error',
        reason: 'Failed to map project fields',
        error: 'Field mapping returned null'
      };
    }

    // Step 3: Validate
    const fullValidation = await validator.validateProject(projectData, mappedData, syntheticDetector);

    if (fullValidation.action !== 'include') {
      return {
        projectId,
        projectName: mappedData.name,
        status: 'rejected',
        reason: fullValidation.reason,
        issues: fullValidation.summary
      };
    }

    // Step 4: Generate YAML
    const yamlContent = yamlGenerator.generateYAML(mappedData);

    // Step 5: Determine category
    const isEnrichment = isLikelyEnrichment(projectId, mappedData.name);
    const outputDir = isEnrichment ? ENRICHMENT_DIR : NEW_PROJECTS_DIR;

    // Step 6: Write YAML file
    const yamlPath = path.join(outputDir, `${projectId}.yaml`);
    fs.writeFileSync(yamlPath, yamlContent, 'utf-8');

    return {
      projectId,
      projectName: mappedData.name,
      status: 'success',
      category: isEnrichment ? 'enrichment' : 'new-projects',
      completeness: projectData.completeness,
      confidence: projectData.confidence,
      privacyFeatures: mappedData.technology?.features?.length || 0,
      teamMembers: mappedData.team?.teammembers?.length || 0,
      yamlPath: path.relative(OUTPUT_DIR, yamlPath),
      issues: fullValidation.summary
    };
  } catch (error) {
    // Write detailed error file
    const errorPath = path.join(ERRORS_DIR, `${projectId}-error.json`);
    fs.writeFileSync(errorPath, JSON.stringify({
      projectId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, null, 2), 'utf-8');

    return {
      projectId,
      status: 'error',
      reason: error.message,
      stack: error.stack
    };
  }
}

/**
 * Main transformation pipeline
 */
async function transformAllProjects() {
  console.log('\n' + '='.repeat(80));
  console.log('🚀 TRANSFORMING ALL 43 PUBLICATION-READY PROJECTS');
  console.log('='.repeat(80));

  // Discover projects
  console.log('\n📂 Discovering projects...');
  const projectPaths = dataLoader.discoverProjects(DELIVEABLES_PATH);
  console.log(`✅ Found ${projectPaths.length} projects\n`);

  // Transform all projects
  const results = [];
  let successCount = 0;
  let enrichmentCount = 0;
  let newProjectCount = 0;
  let errorCount = 0;

  for (let i = 0; i < projectPaths.length; i++) {
    const projectPath = projectPaths[i];
    const projectId = path.basename(projectPath);

    // Progress indicator
    process.stdout.write(`[${i + 1}/${projectPaths.length}] Processing ${projectId}...`);

    const result = await transformProject(projectPath, projectId);
    results.push(result);

    if (result.status === 'success') {
      successCount++;
      if (result.category === 'enrichment') {
        enrichmentCount++;
      } else {
        newProjectCount++;
      }
      console.log(` ✅ ${result.category.toUpperCase()}`);
    } else if (result.status === 'rejected') {
      console.log(` ⚠️  REJECTED: ${result.reason}`);
      errorCount++;
    } else {
      console.log(` ❌ ERROR: ${result.reason}`);
      errorCount++;

      // Write error details
      const errorPath = path.join(ERRORS_DIR, `${projectId}-error.json`);
      fs.writeFileSync(errorPath, JSON.stringify(result, null, 2), 'utf-8');
    }
  }

  // Generate summary report
  console.log('\n' + '='.repeat(80));
  console.log('📊 TRANSFORMATION SUMMARY');
  console.log('='.repeat(80));

  const summary = {
    timestamp: new Date().toISOString(),
    totalProjects: projectPaths.length,
    successful: successCount,
    enrichment: enrichmentCount,
    newProjects: newProjectCount,
    failed: errorCount,
    successRate: ((successCount / projectPaths.length) * 100).toFixed(1) + '%',
    details: results.filter(r => r.status === 'success' || r.status === 'rejected'),
    errors: results.filter(r => r.status === 'error')
  };

  // Write summary
  const summaryPath = path.join(REPORTS_DIR, 'transformation-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');

  // Display summary
  console.log(`\n✅ Successful: ${successCount}/${projectPaths.length} (${summary.successRate})`);
  console.log(`  📝 Enrichment projects: ${enrichmentCount}`);
  console.log(`  ✨ New projects: ${newProjectCount}`);
  if (errorCount > 0) {
    console.log(`  ❌ Failed: ${errorCount}`);
  }

  console.log(`\n📁 Output locations:`);
  console.log(`  • Enrichments: ${path.relative(process.cwd(), ENRICHMENT_DIR)}`);
  console.log(`  • New projects: ${path.relative(process.cwd(), NEW_PROJECTS_DIR)}`);
  if (errorCount > 0) {
    console.log(`  • Errors: ${path.relative(process.cwd(), ERRORS_DIR)}`);
  }
  console.log(`  • Report: ${path.relative(process.cwd(), summaryPath)}`);

  // Detailed breakdown
  console.log('\n📋 PROJECT DETAILS:');
  console.log('-'.repeat(80));

  const successProjects = results.filter(r => r.status === 'success');
  successProjects.forEach((project, idx) => {
    console.log(`${idx + 1}. ${project.projectName} (${project.projectId})`);
    console.log(`   Category: ${project.category}`);
    console.log(`   Quality: ${project.completeness}% complete, ${(project.confidence * 100).toFixed(0)}% confidence`);
    console.log(`   Features: ${project.privacyFeatures} privacy techniques, ${project.teamMembers} team members`);
  });

  if (errorCount > 0) {
    console.log('\n⚠️  FAILED PROJECTS:');
    console.log('-'.repeat(80));
    const failedProjects = results.filter(r => r.status !== 'success');
    failedProjects.forEach((project, idx) => {
      console.log(`${idx + 1}. ${project.projectId}`);
      console.log(`   Reason: ${project.reason}`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('✨ TRANSFORMATION COMPLETE');
  console.log('='.repeat(80) + '\n');

  return summary;
}

// Run transformation
transformAllProjects().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
