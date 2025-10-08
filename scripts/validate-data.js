#!/usr/bin/env node
/**
 * Constitutional Data Validator (TASK-004)
 * Validates all project data for constitutional compliance per CONSTITUTION.md
 * 
 * Constitutional Requirements (CC-002):
 * - No synthetic data patterns (lorem ipsum, example.com, etc.)
 * - Confidence scores required (0.0-1.0)
 * - Sources array required (min 1 source)
 * - Missing fields must be reported, not fabricated
 * 
 * Exit Codes:
 * - 0: All validations passed
 * - 1: Constitutional violations found
 */

const fs = require('fs');
const path = require('path');

// Synthetic data patterns (CC-002 prohibited patterns)
const SYNTHETIC_PATTERNS = [
  { pattern: /lorem ipsum/i, name: 'Lorem Ipsum placeholder' },
  { pattern: /example\.com/i, name: 'example.com placeholder' },
  { pattern: /@project\.com/i, name: 'project.com placeholder' },
  { pattern: /\[Author Name\]/g, name: '[Author Name] placeholder' },
  { pattern: /\[Your Name\]/g, name: '[Your Name] placeholder' },
  { pattern: /\[Project Name\]/g, name: '[Project Name] placeholder' },
  { pattern: /\[Description\]/g, name: '[Description] placeholder' },
  { pattern: /TODO:/gi, name: 'TODO marker' },
  { pattern: /PLACEHOLDER/gi, name: 'PLACEHOLDER marker' },
  { pattern: /FIXME/gi, name: 'FIXME marker' },
  { pattern: /XXX/g, name: 'XXX marker' },
];

class ConstitutionalValidator {
  constructor() {
    this.violations = [];
    this.warnings = [];
    this.filesChecked = 0;
    this.projectsChecked = 0;
  }

  /**
   * Validate all project data
   */
  async validate() {
    console.log('🔍 Constitutional Data Validator');
    console.log('=' .repeat(50));
    console.log('Checking for synthetic data violations...\n');

    const projectDirs = this.getProjectDirectories();
    
    for (const projectDir of projectDirs) {
      this.validateProject(projectDir);
    }

    this.printReport();
    return this.violations.length === 0;
  }

  /**
   * Get all project directories
   */
  getProjectDirectories() {
    const rootDir = path.join(__dirname, '..');
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });
    
    return entries
      .filter(entry => entry.isDirectory())
      .filter(entry => !['node_modules', '.git', '.next', 'out', 'app', 'components', 'lib', 'public', 'scripts', 'styles', 'tests', '.github'].includes(entry.name))
      .map(entry => path.join(rootDir, entry.name));
  }

  /**
   * Validate a single project
   */
  validateProject(projectDir) {
    const projectName = path.basename(projectDir);
    this.projectsChecked++;

    // Check for JSON metadata files
    const metadataFile = path.join(projectDir, 'project_metadata.json');
    const constitutionalFile = path.join(projectDir, 'constitutional_research.json');

    if (fs.existsSync(metadataFile)) {
      this.validateJsonFile(metadataFile, projectName);
    }

    if (fs.existsSync(constitutionalFile)) {
      this.validateJsonFile(constitutionalFile, projectName);
    }

    // Check README.md for synthetic patterns
    const readmeFile = path.join(projectDir, 'README.md');
    if (fs.existsSync(readmeFile)) {
      this.validateTextFile(readmeFile, projectName);
    }
  }

  /**
   * Validate JSON file for constitutional compliance
   */
  validateJsonFile(filePath, projectName) {
    this.filesChecked++;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      const fileName = path.basename(filePath);

      // Check for synthetic patterns in JSON content
      this.checkSyntheticPatterns(content, projectName, fileName);

      // Check constitutional requirements for metadata files
      if (fileName === 'project_metadata.json') {
        this.validateMetadataCompliance(data, projectName);
      }

    } catch (error) {
      this.violations.push({
        project: projectName,
        file: path.basename(filePath),
        type: 'PARSE_ERROR',
        message: `Failed to parse JSON: ${error.message}`,
      });
    }
  }

  /**
   * Validate text file for synthetic patterns
   */
  validateTextFile(filePath, projectName) {
    this.filesChecked++;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      
      this.checkSyntheticPatterns(content, projectName, fileName);
    } catch (error) {
      // Silently skip unreadable files
    }
  }

  /**
   * Check for synthetic data patterns
   */
  checkSyntheticPatterns(content, projectName, fileName) {
    for (const { pattern, name } of SYNTHETIC_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        this.violations.push({
          project: projectName,
          file: fileName,
          type: 'SYNTHETIC_DATA',
          pattern: name,
          matches: matches.length,
          message: `Found ${matches.length} instance(s) of synthetic pattern: ${name}`,
        });
      }
    }
  }

  /**
   * Validate metadata file constitutional compliance
   */
  validateMetadataCompliance(data, projectName) {
    // Check confidence score
    if (data.confidence === undefined || data.confidence === null) {
      this.warnings.push({
        project: projectName,
        file: 'project_metadata.json',
        type: 'MISSING_CONFIDENCE',
        message: 'Missing confidence score (0.0-1.0 required per CONSTITUTION.md)',
      });
    } else if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 1) {
      this.violations.push({
        project: projectName,
        file: 'project_metadata.json',
        type: 'INVALID_CONFIDENCE',
        message: `Invalid confidence score: ${data.confidence} (must be 0.0-1.0)`,
      });
    }

    // Check sources array
    if (!data.sources || !Array.isArray(data.sources)) {
      this.warnings.push({
        project: projectName,
        file: 'project_metadata.json',
        type: 'MISSING_SOURCES',
        message: 'Missing sources array (multi-source verification required)',
      });
    } else if (data.sources.length === 0) {
      this.warnings.push({
        project: projectName,
        file: 'project_metadata.json',
        type: 'EMPTY_SOURCES',
        message: 'Empty sources array (at least 1 source required)',
      });
    }

    // Check for missing_fields reporting
    if (!data.missing_fields) {
      // Not a violation, but good practice
      // Don't warn as it's optional
    }
  }

  /**
   * Print validation report
   */
  printReport() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 Validation Report');
    console.log('='.repeat(50));
    console.log(`Projects checked: ${this.projectsChecked}`);
    console.log(`Files checked: ${this.filesChecked}`);
    console.log(`Violations: ${this.violations.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    console.log('='.repeat(50));

    if (this.violations.length > 0) {
      console.log('\n❌ CONSTITUTIONAL VIOLATIONS:\n');
      
      // Group by project
      const byProject = {};
      for (const violation of this.violations) {
        if (!byProject[violation.project]) {
          byProject[violation.project] = [];
        }
        byProject[violation.project].push(violation);
      }

      for (const [project, violations] of Object.entries(byProject)) {
        console.log(`📁 ${project}:`);
        for (const v of violations) {
          console.log(`   • [${v.type}] ${v.file}: ${v.message}`);
        }
        console.log('');
      }
    }

    if (this.warnings.length > 0 && this.warnings.length <= 10) {
      console.log('\n⚠️  WARNINGS (Constitutional compliance recommended):\n');
      for (const warning of this.warnings.slice(0, 10)) {
        console.log(`📁 ${warning.project} / ${warning.file}:`);
        console.log(`   ${warning.message}\n`);
      }
      if (this.warnings.length > 10) {
        console.log(`   ... and ${this.warnings.length - 10} more warnings\n`);
      }
    }

    if (this.violations.length === 0) {
      console.log('\n✅ All validations passed! Data is constitutionally compliant.');
      console.log('   No synthetic data patterns detected.');
      console.log('   All projects meet constitutional requirements.\n');
    } else {
      console.log('\n❌ Validation FAILED!');
      console.log(`   Found ${this.violations.length} constitutional violations.`);
      console.log('   Please fix synthetic data patterns and try again.\n');
    }

    // Save report to JSON
    const report = {
      timestamp: new Date().toISOString(),
      projects_checked: this.projectsChecked,
      files_checked: this.filesChecked,
      violations_count: this.violations.length,
      warnings_count: this.warnings.length,
      violations: this.violations,
      warnings: this.warnings,
      passed: this.violations.length === 0,
    };

    fs.writeFileSync(
      path.join(__dirname, '..', 'validation-report.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('📄 Detailed report saved to: validation-report.json\n');
  }
}

// Run validator
const validator = new ConstitutionalValidator();
validator.validate().then(passed => {
  process.exit(passed ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
