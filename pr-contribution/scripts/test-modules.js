#!/usr/bin/env node
/**
 * Test Script for Transformation Modules
 * Tests dataLoader, urlValidator, and syntheticDetector on a sample project
 */

const path = require('path');
const dataLoader = require('./lib/dataLoader');
const urlValidator = require('./lib/urlValidator');
const syntheticDetector = require('./lib/syntheticDetector');

console.log('🧪 Testing Transformation Modules\n');
console.log('=' .repeat(60));

// Test 1: Data Loader
console.log('\n📦 TEST 1: Data Loader');
console.log('-'.repeat(60));

const deliverablesPath = path.join(__dirname, '../../deliverables');
const testProjectPath = path.join(deliverablesPath, 'aztec-network');

console.log(`Loading project: ${testProjectPath}`);
const projectData = dataLoader.loadProjectData(testProjectPath);

if (projectData) {
  console.log('✅ Project loaded successfully');
  console.log(`   Slug: ${projectData.slug}`);
  console.log(`   Completeness: ${projectData.completeness}%`);
  console.log(`   Confidence: ${projectData.confidence}`);
  console.log(`   Has constitutional: ${projectData.constitutional ? 'Yes' : 'No'}`);
  console.log(`   Has metadata: ${projectData.metadata ? 'Yes' : 'No'}`);
  console.log(`   Has GitHub data: ${projectData.github ? 'Yes' : 'No'}`);
  console.log(`   Has README: ${projectData.readme ? 'Yes' : 'No'}`);
} else {
  console.log('❌ Failed to load project');
}

// Test 2: Synthetic Data Detection
console.log('\n🔍 TEST 2: Synthetic Data Detector');
console.log('-'.repeat(60));

if (projectData) {
  const syntheticReport = syntheticDetector.generateReport(projectData);
  console.log(`Clean: ${syntheticReport.clean ? '✅ Yes' : '⚠️  No'}`);
  console.log(`Total detections: ${syntheticReport.totalDetections}`);
  console.log(`High severity: ${syntheticReport.highSeverity}`);
  console.log(`Medium severity: ${syntheticReport.mediumSeverity}`);
  console.log(`Recommendation: ${syntheticReport.recommendation}`);

  if (syntheticReport.detections.length > 0) {
    console.log('\nDetected patterns:');
    syntheticReport.detections.slice(0, 3).forEach(d => {
      console.log(`  - ${d.path}: ${d.pattern} (${d.severity})`);
    });
  }
}

// Test 3: URL Validation
console.log('\n🌐 TEST 3: URL Validator');
console.log('-'.repeat(60));

if (projectData) {
  const urls = urlValidator.extractUrls(projectData);
  console.log(`Found ${urls.length} URLs to validate`);

  // Test first 3 URLs
  const testUrls = urls.slice(0, 3);
  console.log(`\nTesting first ${testUrls.length} URLs:`);

  (async () => {
    for (const url of testUrls) {
      const result = await urlValidator.validateUrl(url);
      const status = result.valid ? '✅' : '❌';
      console.log(`  ${status} ${url}`);
      console.log(`     Status: ${result.status || 'N/A'}, Error: ${result.error || 'None'}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS COMPLETE\n');
  })();
} else {
  console.log('⏭️  Skipping URL test (no project data)');
  console.log('\n' + '='.repeat(60));
  console.log('⚠️  TESTS INCOMPLETE (project loading failed)\n');
}
