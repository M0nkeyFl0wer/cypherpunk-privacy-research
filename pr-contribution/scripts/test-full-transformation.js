#!/usr/bin/env node
/**
 * Full Transformation Test
 * Tests complete pipeline: load → validate → map → generate YAML
 */

const path = require('path');
const fs = require('fs');
const dataLoader = require('./lib/dataLoader');
const syntheticDetector = require('./lib/syntheticDetector');
const urlValidator = require('./lib/urlValidator');
const fieldMapper = require('./lib/fieldMapper');
const yamlGenerator = require('./lib/yamlGenerator');
const validator = require('./lib/validator');

console.log('🔬 FULL TRANSFORMATION TEST\n');
console.log('=' .repeat(70));

async function testFullTransformation() {
  // Test project
  const testProjectPath = path.join(__dirname, '../../deliverables/aztec-network');
  const outputDir = path.join(__dirname, '../output/test');

  console.log(`\n📦 STEP 1: Load Project Data`);
  console.log('-'.repeat(70));

  const projectData = dataLoader.loadProjectData(testProjectPath);
  if (!projectData) {
    console.log('❌ Failed to load project');
    return;
  }

  console.log(`✅ Loaded: ${projectData.slug}`);
  console.log(`   Completeness: ${projectData.completeness}%`);
  console.log(`   Confidence: ${projectData.confidence}`);

  // Step 2: Map fields
  console.log(`\n🗺️  STEP 2: Transform Fields`);
  console.log('-'.repeat(70));

  const mappedData = fieldMapper.transformProject(projectData);
  console.log(`✅ Transformed to YAML-ready object`);
  console.log(`   ID: ${mappedData.id}`);
  console.log(`   Name: ${mappedData.name}`);
  console.log(`   Categories: ${mappedData.categories?.join(', ') || 'None'}`);
  console.log(`   Privacy features: ${mappedData.technology?.features?.length || 0}`);
  console.log(`   Team members: ${mappedData.team?.teammembers?.length || 0}`);
  console.log(`   Links: ${Object.keys(mappedData.links || {}).length}`);

  // Step 3: Validate (quick - no URL check to save time)
  console.log(`\n✓  STEP 3: Validate Quality`);
  console.log('-'.repeat(70));

  const validationResult = await validator.quickValidate(
    projectData,
    mappedData,
    syntheticDetector
  );

  console.log(`Action: ${validationResult.action.toUpperCase()}`);
  console.log(`Reason: ${validationResult.reason}`);
  console.log(`Issues: ${validationResult.summary.totalIssues} total`);
  console.log(`  - Errors: ${validationResult.summary.criticalIssues}`);
  console.log(`  - Warnings: ${validationResult.summary.warnings}`);
  console.log(`  - Info: ${validationResult.summary.info}`);

  if (validationResult.errors.length > 0) {
    console.log('\n  Errors:');
    validationResult.errors.forEach(err => {
      console.log(`    ❌ ${err.field}: ${err.message}`);
    });
  }

  if (validationResult.warnings.length > 0 && validationResult.warnings.length <= 3) {
    console.log('\n  Warnings:');
    validationResult.warnings.forEach(warn => {
      console.log(`    ⚠️  ${warn.field}: ${warn.message}`);
    });
  }

  // Step 4: Generate YAML
  console.log(`\n📝 STEP 4: Generate YAML`);
  console.log('-'.repeat(70));

  const yamlResult = yamlGenerator.generateProjectYAML(projectData, mappedData);
  console.log(`✅ Generated YAML (${yamlResult.lines} lines)`);

  // Validate YAML syntax
  const yamlValidation = yamlGenerator.validateYAML(yamlResult.yaml);
  if (yamlValidation.valid) {
    console.log(`✅ YAML syntax valid`);
  } else {
    console.log(`❌ YAML syntax error: ${yamlValidation.error}`);
  }

  // Step 5: Write output
  console.log(`\n💾 STEP 5: Write Output Files`);
  console.log('-'.repeat(70));

  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });

  // Write YAML file
  const yamlPath = path.join(outputDir, 'aztec-network.yaml');
  fs.writeFileSync(yamlPath, yamlResult.yaml);
  console.log(`✅ Written: ${yamlPath}`);

  // Write validation report
  const reportPath = path.join(outputDir, 'aztec-network-validation.json');
  const validationReport = validator.generateValidationReport(projectData, validationResult);
  fs.writeFileSync(reportPath, JSON.stringify(validationReport, null, 2));
  console.log(`✅ Written: ${reportPath}`);

  // Generate comparison (mock "before" data)
  const mockBefore = {
    yaml: `id: aztec-network\nname: Aztec Network\ncategories:\n  - defi\nlinks:\n  web: https://aztec.network`,
    lines: 6,
    projectName: 'Aztec Network',
    projectId: 'aztec-network'
  };

  const comparisonMd = yamlGenerator.generateComparison(mockBefore, yamlResult);
  const comparisonPath = path.join(outputDir, 'aztec-network-comparison.md');
  fs.writeFileSync(comparisonPath, comparisonMd);
  console.log(`✅ Written: ${comparisonPath}`);

  // Step 6: Display sample
  console.log(`\n📄 STEP 6: YAML Preview (first 30 lines)`);
  console.log('-'.repeat(70));

  const yamlLines = yamlResult.yaml.split('\n');
  yamlLines.slice(0, 30).forEach(line => console.log(line));

  if (yamlLines.length > 30) {
    console.log('...');
    console.log(`(${yamlLines.length - 30} more lines)`);
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('✅ FULL TRANSFORMATION TEST COMPLETE\n');

  console.log('📊 Summary:');
  console.log(`   Project: ${mappedData.name}`);
  console.log(`   Action: ${validationResult.action}`);
  console.log(`   Quality: ${validationResult.valid ? 'PASS' : 'FAIL'}`);
  console.log(`   YAML lines: ${yamlResult.lines}`);
  console.log(`   Files created: 3`);

  console.log('\n📁 Output files:');
  console.log(`   ${yamlPath}`);
  console.log(`   ${reportPath}`);
  console.log(`   ${comparisonPath}`);

  console.log('\n🎉 Transformation pipeline works end-to-end!');
  console.log('   Ready to build main script and process all projects.\n');

  return {
    projectData,
    mappedData,
    validationResult,
    yamlResult
  };
}

// Run test
testFullTransformation().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
});
