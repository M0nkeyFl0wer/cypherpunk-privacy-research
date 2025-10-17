# Task List: Web3Privacy Data Contribution Project

**Project Start**: 2025-10-15
**Current Phase**: Implementation
**Status**: 🟡 In Progress

---

## Quick Navigation

- [Completed Tasks](#completed-tasks-)
- [Current Sprint](#current-sprint-in-progress-)
- [Upcoming Tasks](#upcoming-tasks-)
- [Future Work](#future-work-)
- [Documents Reference](#documents-reference)
- [Quick Commands](#quick-commands)

---

## Completed Tasks ✅

### Phase 0: Discovery & Analysis
- [x] **Analyze Web3Privacy repository structure**
  - Explored `web3privacy/explorer-app` repository
  - Reviewed `web3privacy/explorer-data` structure
  - Documented their YAML schema format
  - Identified 745 projects in their database

- [x] **Analyze our data structure**
  - Documented constitutional_research.json format
  - Mapped project_metadata.json fields
  - Analyzed 117 projects in deliverables/
  - Calculated completeness scores

- [x] **Create overlap analysis script**
  - Built `scripts/analyze-overlap.js`
  - Identifies projects in both repositories
  - Categorizes enrichment vs new project candidates
  - Output: `analysis-output/overlap-analysis.json`
  - **Results**: 37 overlaps, 80 unique to us, 11+ gaps

- [x] **Generate field mapping documentation**
  - Created `FIELD_MAPPING.md` (393 lines)
  - Mapped every field from our JSON → their YAML
  - Documented transformation rules
  - Created privacy technique mapping table

- [x] **Create strategic PR plan**
  - Wrote `PR_STRATEGY.md` with 3-phase approach
  - Quantified value proposition (6-10x more data)
  - Defined pilot PR strategy (5-10 projects)
  - Outlined communication plan

- [x] **Write conversion specification**
  - Created `CONVERSION_SPEC.md` (comprehensive spec)
  - Defined 5-phase transformation pipeline
  - Documented validation rules
  - Created error handling framework

---

## Current Sprint (In Progress) 🚧

### Phase 1: Build Transformation Pipeline

#### Task 1.1: Create Data Loader Module
**Status**: 🔴 Not Started
**Priority**: High
**Estimate**: 2 hours
**File**: `scripts/lib/dataLoader.js`

**Description**: Build module to load and merge all project data files

**Implementation Steps**:
```bash
# Create lib directory
mkdir -p scripts/lib

# Build loader module
# - loadConstitutionalResearch(projectPath)
# - loadProjectMetadata(projectPath)
# - loadGithubAnalysis(projectPath)
# - loadSmartContracts(projectPath)
# - mergeProjectData(allData)
```

**Acceptance Criteria**:
- [ ] Loads all 5 JSON file types
- [ ] Handles missing files gracefully
- [ ] Merges into unified object
- [ ] Returns confidence score for merged data
- [ ] Unit tests pass

**Dependencies**: None

---

#### Task 1.2: Create URL Validator
**Status**: 🔴 Not Started
**Priority**: High
**Estimate**: 1 hour
**File**: `scripts/lib/urlValidator.js`

**Description**: Validate URLs with HTTP status checks and caching

**Implementation Steps**:
```bash
# Build validator with:
# - validateUrl(url) → returns status code
# - validateAllUrls(urlObject) → batch validation
# - Cache results for 1 hour
# - Rate limit: 100ms between requests
```

**Acceptance Criteria**:
- [ ] Validates HTTP 200/301/302 as success
- [ ] Caches results to avoid re-checking
- [ ] Handles timeouts gracefully (5s max)
- [ ] Returns detailed error for failures

**Dependencies**: None

---

#### Task 1.3: Create Synthetic Data Detector
**Status**: 🔴 Not Started
**Priority**: Medium
**Estimate**: 30 minutes
**File**: `scripts/lib/syntheticDetector.js`

**Description**: Detect placeholder/synthetic data patterns

**Implementation Steps**:
```javascript
const patterns = [
  /lorem ipsum/i,
  /example\.com/i,
  /@project\.com/i,
  /\[Author Name\]/i,
  /TODO:/i,
  /PLACEHOLDER/i,
  /test@test\.com/i
];

function detectSynthetic(text) {
  return patterns.some(pattern => pattern.test(text));
}
```

**Acceptance Criteria**:
- [ ] Detects all 7 common synthetic patterns
- [ ] Returns boolean + matched pattern
- [ ] Works on strings and objects recursively

**Dependencies**: None

---

#### Task 1.4: Create Field Mapper
**Status**: 🔴 Not Started
**Priority**: High
**Estimate**: 4 hours
**File**: `scripts/lib/fieldMapper.js`

**Description**: Core mapping logic from our JSON to their YAML schema

**Implementation Steps**:
```bash
# Implement mapping functions:
# - mapIdentityFields()
# - mapCategories()
# - mapLinks()
# - mapTeam()
# - mapTechnology()
# - mapFunding()
# - mapAudits()
# - mapProjectStatus()
# - mapBlockchainFeatures()
# - mapTokens()
# - buildConstitutionalMetadata()
```

**Acceptance Criteria**:
- [ ] All 11 field groups mapped
- [ ] Privacy technique transformation working
- [ ] Category mapping accurate
- [ ] Team data properly formatted
- [ ] Handles missing data gracefully
- [ ] Unit tests for each mapper function

**Dependencies**: CONVERSION_SPEC.md, FIELD_MAPPING.md

---

#### Task 1.5: Create YAML Generator
**Status**: 🔴 Not Started
**Priority**: High
**Estimate**: 2 hours
**File**: `scripts/lib/yamlGenerator.js`

**Description**: Generate properly formatted YAML from mapped data

**Implementation Steps**:
```bash
# Use 'js-yaml' library
npm install js-yaml --save

# Build generator:
# - buildYAMLObject(mappedData)
# - sortFieldsInOrder(yamlObj)
# - addComments(yamlObj)
# - generateYAMLString(yamlObj)
```

**Acceptance Criteria**:
- [ ] Generates valid YAML syntax
- [ ] Fields in proper order (matches their schema)
- [ ] Handles arrays and nested objects
- [ ] Adds helpful comments for constitutional data
- [ ] Validates against their schema

**Dependencies**: Field Mapper (Task 1.4)

---

#### Task 1.6: Create Validation Engine
**Status**: 🔴 Not Started
**Priority**: High
**Estimate**: 2 hours
**File**: `scripts/lib/validator.js`

**Description**: Validate project data against quality thresholds

**Implementation Steps**:
```bash
# Build validation engine:
# - validateRequiredFields()
# - checkQualityThresholds()
# - validateCategories()
# - checkUrls()
# - detectSyntheticData()
# - generateValidationReport()
```

**Acceptance Criteria**:
- [ ] Checks all required fields present
- [ ] Enforces minimum completeness (40%)
- [ ] Enforces minimum confidence (60%)
- [ ] Validates category enums
- [ ] Returns structured validation result
- [ ] Categorizes errors (fatal/warning/info)

**Dependencies**: URL Validator, Synthetic Detector

---

#### Task 1.7: Build Main Transformation Script
**Status**: 🔴 Not Started
**Priority**: High
**Estimate**: 3 hours
**File**: `scripts/transform-to-yaml.js`

**Description**: Main orchestration script that runs full pipeline

**Implementation Steps**:
```bash
# Main script structure:
# 1. Discover all projects in deliverables/
# 2. For each project:
#    a. Load data (dataLoader)
#    b. Validate (validator)
#    c. Map fields (fieldMapper)
#    d. Generate YAML (yamlGenerator)
#    e. Write output
# 3. Generate reports
# 4. Save checkpoint
```

**Acceptance Criteria**:
- [ ] Processes all 117 projects
- [ ] Handles errors gracefully
- [ ] Shows progress indicator
- [ ] Generates enrichment/ and new-projects/ folders
- [ ] Creates comparison files for enrichments
- [ ] Produces error log
- [ ] Saves checkpoint for resuming
- [ ] Runs in <5 minutes total

**Dependencies**: All above modules (1.1-1.6)

---

### Phase 2: Testing & QA

#### Task 2.1: Write Unit Tests
**Status**: 🔴 Not Started
**Priority**: Medium
**Estimate**: 3 hours
**File**: `scripts/__tests__/`

**Implementation Steps**:
```bash
# Install test framework
npm install --save-dev jest

# Write tests for:
# - dataLoader.test.js
# - urlValidator.test.js
# - syntheticDetector.test.js
# - fieldMapper.test.js
# - yamlGenerator.test.js
# - validator.test.js
```

**Acceptance Criteria**:
- [ ] 80%+ code coverage
- [ ] All critical paths tested
- [ ] Edge cases covered
- [ ] Tests run in <30 seconds

**Dependencies**: All modules built (Task 1.1-1.6)

---

#### Task 2.2: Test on Sample Projects
**Status**: 🔴 Not Started
**Priority**: High
**Estimate**: 1 hour

**Description**: Test transformation on 5 high-quality projects

**Test Projects**:
1. Aztec Network (10 privacy techniques)
2. Tornado Cash (80% completeness)
3. Railgun (smart contract data)
4. Nym (team data)
5. ARPA (funding data)

**Acceptance Criteria**:
- [ ] All 5 projects transform successfully
- [ ] Generated YAML is valid
- [ ] No synthetic data in output
- [ ] URLs validate correctly
- [ ] Privacy techniques map correctly

**Dependencies**: Main transformation script (Task 1.7)

---

#### Task 2.3: Manual QA Review
**Status**: 🔴 Not Started
**Priority**: High
**Estimate**: 2 hours

**Description**: Manually review generated YAML files

**QA Checklist**:
- [ ] Open 10 random YAML files in text editor
- [ ] Verify formatting is clean and readable
- [ ] Click all URLs to verify they work
- [ ] Compare with original JSON for accuracy
- [ ] Check privacy techniques mapped correctly
- [ ] Verify team member names are real (not placeholders)
- [ ] Confirm no "Lorem ipsum" or "TODO" text
- [ ] Validate category assignments make sense

**Dependencies**: Test on sample projects (Task 2.2)

---

### Phase 3: Generate Reports

#### Task 3.1: Create Transformation Summary Report
**Status**: 🔴 Not Started
**Priority**: Medium
**Estimate**: 1 hour
**File**: `scripts/generateReports.js`

**Description**: Generate summary statistics after transformation

**Report Contents**:
- Total projects processed
- Success / Warning / Error counts
- Average completeness score
- Average confidence score
- Field coverage statistics
- Category distribution
- URL validation results
- Top 10 highest quality projects

**Acceptance Criteria**:
- [ ] Generates `reports/transformation-summary.json`
- [ ] Generates `reports/transformation-summary.md` (human readable)
- [ ] Includes charts/tables
- [ ] Lists all errors with details

**Dependencies**: Main transformation script completed

---

#### Task 3.2: Create Before/After Comparison Files
**Status**: 🔴 Not Started
**Priority**: Medium
**Estimate**: 2 hours

**Description**: For enrichment projects, show what data we're adding

**Implementation**:
```bash
# For each project in enrichment/:
# 1. Fetch their current YAML from GitHub
# 2. Generate side-by-side comparison
# 3. Highlight new fields in green
# 4. Highlight changed fields in yellow
# 5. Save as comparison.md
```

**Acceptance Criteria**:
- [ ] Comparison file for each enrichment project
- [ ] Clear visual diff format
- [ ] Shows field additions
- [ ] Shows field enhancements
- [ ] Quantifies value add

**Dependencies**: Transformation complete (Task 1.7)

---

#### Task 3.3: Create Gap Analysis Report
**Status**: 🔴 Not Started
**Priority**: Low
**Estimate**: 1 hour
**File**: `reports/gap-analysis.md`

**Description**: Identify which projects in their DB we don't have

**Report Contents**:
- Projects only in their database (estimated 700+)
- Priority projects to research next
- Estimated research effort per project
- Suggested research methodology

**Acceptance Criteria**:
- [ ] Lists top 50 priority projects
- [ ] Explains selection criteria
- [ ] Provides research template
- [ ] Estimates total effort

**Dependencies**: Overlap analysis complete (✅ Done)

---

## Upcoming Tasks 📋

### Phase 4: Pilot PR Preparation

#### Task 4.1: Select Pilot Projects
**Priority**: High
**Estimate**: 30 minutes

**Criteria**:
- Top 5-10 projects by completeness
- Variety of categories (DeFi, wallet, infrastructure)
- All URLs validated
- No warnings or errors
- Rich data (8+ privacy techniques, team info, audits)

**Shortlist**:
1. Tornado Cash
2. Firn Protocol
3. Brume Wallet
4. Railgun
5. Secret Network
6. Nym
7. Penumbra
8. ARPA
9. Aztec Network
10. Litentry

---

#### Task 4.2: Create Comparison Document
**Priority**: High
**Estimate**: 2 hours
**File**: `pilot-pr/COMPARISON.md`

**Description**: Show before/after for pilot projects to demonstrate value

**Contents**:
- Side-by-side comparison for 2-3 example projects
- Quantified improvements (field count, data richness)
- Sample new fields we're proposing
- Quality metrics comparison

---

#### Task 4.3: Write Contribution Guide
**Priority**: Medium
**Estimate**: 1 hour
**File**: `pilot-pr/CONTRIBUTION_GUIDE.md`

**Description**: Explain our data methodology for Web3Privacy maintainers

**Contents**:
- Constitutional research methodology
- Multi-source verification approach
- Confidence scoring system
- How we validate URLs and team data
- Update cadence
- Maintenance commitment

---

#### Task 4.4: Prepare PR Description
**Priority**: High
**Estimate**: 1 hour

**Template**: See PR_STRATEGY.md

**Contents**:
- Overview of what we're adding
- Quantified value proposition
- Data quality metrics
- Methodology explanation
- Request for feedback on proposed new fields
- Offer to maintain contributed projects

---

#### Task 4.5: Fork Web3Privacy Explorer-Data Repo
**Priority**: High
**Estimate**: 15 minutes

**Steps**:
```bash
# 1. Fork on GitHub
# 2. Clone locally
git clone https://github.com/[your-username]/explorer-data.git
cd explorer-data

# 3. Create branch
git checkout -b pilot-enrichment-oct2025

# 4. Copy transformed YAML files to proper locations
# 5. Commit and push
```

---

#### Task 4.6: Submit Pilot PR
**Priority**: High
**Estimate**: 30 minutes

**Steps**:
1. Create PR from forked repo
2. Use prepared PR description
3. Attach comparison document
4. Attach contribution guide
5. Tag relevant maintainers
6. Monitor for feedback

---

### Phase 5: Full Rollout (After Pilot Accepted)

#### Task 5.1: Transform Remaining 32 Enrichment Projects
**Priority**: Medium
**Estimate**: 1 hour

**Steps**:
```bash
# Run transformation on remaining projects
node scripts/transform-to-yaml.js --category=enrichment --skip-pilot

# QA review
# Submit PR
```

---

#### Task 5.2: Validate "New Projects" Candidates
**Priority**: Medium
**Estimate**: 4 hours

**Description**: Verify 80 projects aren't duplicates under different names

**Process**:
- Cross-reference with their full 745 project list
- Check for name variations (Aztec vs Aztec Network)
- Verify GitHub URLs aren't already listed
- Confirm projects are still active
- Remove any duplicates found

---

#### Task 5.3: Transform & Submit New Projects PR
**Priority**: Medium
**Estimate**: 3 hours

**Steps**:
```bash
# Transform validated new projects
node scripts/transform-to-yaml.js --category=new-projects

# QA review
# Submit PR in batches (20 projects per PR)
```

---

## Future Work 🔮

### Visualization Tools PR
- Port D3.js network graph
- Port treemap visualization
- Port timeline visualization
- Adapt to their data format
- Create separate repo or propose integration

### Ongoing Maintenance
- Update projects quarterly
- Add new discoveries
- Monitor for project shutdowns
- Track audits and funding rounds
- Community engagement

### Research Gap Filling
- Research 50+ projects in their DB we don't have
- Use same constitutional methodology
- Submit enrichment PRs for those too

---

## Documents Reference

| Document | Purpose | Status |
|----------|---------|--------|
| [PR_STRATEGY.md](./PR_STRATEGY.md) | Overall contribution strategy | ✅ Complete |
| [CONVERSION_SPEC.md](./CONVERSION_SPEC.md) | Technical transformation specification | ✅ Complete |
| [FIELD_MAPPING.md](./FIELD_MAPPING.md) | Field-by-field mapping guide | ✅ Complete |
| [overlap-analysis.json](./analysis-output/overlap-analysis.json) | Project overlap analysis | ✅ Complete |
| `scripts/analyze-overlap.js` | Overlap analysis script | ✅ Complete |
| `scripts/transform-to-yaml.js` | Main transformation script | 🔴 Not Started |
| `scripts/lib/` | Transformation modules | 🔴 Not Started |

---

## Quick Commands

### Run overlap analysis
```bash
node scripts/analyze-overlap.js
```

### Run transformation (once built)
```bash
# Transform all projects
node scripts/transform-to-yaml.js

# Transform specific category
node scripts/transform-to-yaml.js --category=enrichment
node scripts/transform-to-yaml.js --category=new-projects

# Transform specific project
node scripts/transform-to-yaml.js --project=aztec-network

# Resume from checkpoint
node scripts/transform-to-yaml.js --resume
```

### Run tests (once built)
```bash
npm test
npm test -- --coverage
```

### Validate output
```bash
# Check YAML syntax
node scripts/validate-yaml.js output/enrichment/*/index.yaml

# Validate against schema
node scripts/validate-schema.js
```

### Generate reports
```bash
node scripts/generateReports.js
```

---

## Progress Tracking

### Overall Progress: 25% Complete

- **Phase 0: Discovery & Analysis** - ✅ 100% (6/6 tasks)
- **Phase 1: Build Pipeline** - 🔴 0% (0/7 tasks)
- **Phase 2: Testing & QA** - 🔴 0% (0/3 tasks)
- **Phase 3: Reports** - 🔴 0% (0/3 tasks)
- **Phase 4: Pilot PR** - 🔴 0% (0/6 tasks)
- **Phase 5: Full Rollout** - 🔴 0% (0/3 tasks)

### Estimated Time Remaining: 28 hours

**Sprint 1 (Current)**: 15 hours - Build transformation pipeline
**Sprint 2**: 7 hours - Testing & QA
**Sprint 3**: 6 hours - Pilot PR submission

---

## Notes & Context

### If Claude Code Crashes
1. Read this document (TASK_LIST.md)
2. Read CONVERSION_SPEC.md for technical details
3. Read PR_STRATEGY.md for strategic context
4. Check last completed task status
5. Check for checkpoint files in `output/.checkpoint.json`
6. Resume from current sprint tasks

### Key Decisions Made
- Using YAML output format (matches Web3Privacy)
- Proposing new `data_quality` section (optional)
- 40% minimum completeness threshold
- Pilot PR of 5-10 projects first
- Batch new projects 20 at a time

### Open Questions
- [ ] Should we propose schema extensions to Web3Privacy?
- [ ] What's the best way to handle ongoing updates?
- [ ] Should visualizations be separate tool or integrated?
- [ ] Who will maintain merged data long-term?

---

**Document Version**: 1.0
**Last Updated**: 2025-10-15 21:20 UTC
**Next Update**: After Sprint 1 completion
**Owner**: Flower (@flower)
