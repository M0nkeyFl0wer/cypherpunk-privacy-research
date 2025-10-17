# Data Conversion Specification: JSON → Web3Privacy YAML

**Version**: 1.0
**Date**: 2025-10-15
**Purpose**: Transform our constitutional research JSON data into Web3Privacy YAML format
**Status**: Implementation Ready

---

## Overview

### Input Format
- **Source Directory**: `/deliverables/[project-slug]/`
- **Key Files**:
  - `constitutional_research.json` - Main research data (detailed)
  - `project_metadata.json` - Basic metadata
  - `analysis/github_analysis.json` - GitHub statistics
  - `analysis/smart_contracts.json` - Contract addresses
  - `sources/verified_data.json` - Verified external data
  - `README.md` - Full documentation

### Output Format
- **Target**: YAML files compatible with Web3Privacy `explorer-data` repository
- **Structure**: Single `index.yaml` per project
- **Location**: `output/[project-id]/index.yaml`

---

## Transformation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: Data Collection                                        │
├─────────────────────────────────────────────────────────────────┤
│ 1. Read constitutional_research.json                            │
│ 2. Read project_metadata.json                                   │
│ 3. Read analysis/github_analysis.json                           │
│ 4. Read analysis/smart_contracts.json                           │
│ 5. Merge all data sources into unified object                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: Data Validation                                        │
├─────────────────────────────────────────────────────────────────┤
│ 1. Verify URLs return HTTP 200/301/302                          │
│ 2. Check GitHub repo is public and accessible                   │
│ 3. Validate no synthetic data patterns                          │
│ 4. Confirm minimum completeness threshold (40%)                 │
│ 5. Check for required fields (name, description, links)         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: Field Mapping                                          │
├─────────────────────────────────────────────────────────────────┤
│ 1. Map identity fields (id, name, description)                  │
│ 2. Map categories (our category → their categories enum)        │
│ 3. Map links (web, github, docs, social)                        │
│ 4. Transform team data (founders → teammembers)                 │
│ 5. Convert privacy techniques (detailed → features array)       │
│ 6. Extract technology stack                                     │
│ 7. Map funding & investors                                      │
│ 8. Map audits & security                                        │
│ 9. Add constitutional metadata (optional section)               │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: YAML Generation                                        │
├─────────────────────────────────────────────────────────────────┤
│ 1. Build YAML object following their schema                     │
│ 2. Sort fields in standard order                                │
│ 3. Add comments for constitutional data                         │
│ 4. Validate YAML syntax                                         │
│ 5. Write to output/[project-id]/index.yaml                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 5: Quality Assurance                                      │
├─────────────────────────────────────────────────────────────────┤
│ 1. Parse generated YAML to verify syntax                        │
│ 2. Check against Web3Privacy schema                             │
│ 3. Generate comparison report (before/after)                    │
│ 4. Create summary statistics                                    │
│ 5. Flag projects needing manual review                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Field Mapping Rules

### 1. Identity Fields

```javascript
{
  // Target YAML field ← Source JSON path

  id: slugify(constitutional_research.project_overview.name) || project_metadata.project_name,
  name: constitutional_research.project_overview.name || project_metadata.project_name,
  description: constitutional_research.project_overview.description || README excerpt (first 200 chars),

  // Validation rules
  rules: {
    id: "lowercase, hyphenated, alphanumeric only",
    name: "1-100 characters, proper capitalization",
    description: "50-500 characters, no placeholder text"
  }
}
```

### 2. Categories

```javascript
// Category mapping table
const categoryMap = {
  'defi': 'defi',
  'wallet': 'applications',
  'currency': 'currency',
  'infrastructure': 'infrastructure',
  'computing': 'infrastructure',
  'messaging': 'applications',
  'bridges': 'infrastructure',
  'layer2-privacy': 'infrastructure',
  'identity': 'applications',
  'other': null  // Skip, use subcategories
};

// Transformation
categories: [
  categoryMap[category],
  ...subcategories.map(sc => categoryMap[sc]).filter(Boolean)
].filter(unique);

// Add ecosystem tags
ecosystem: extractBlockchainPlatforms(
  constitutional_research.technical_architecture.blockchain_type
);
```

### 3. Links & Resources

```javascript
links: {
  web: constitutional_research.project_overview.website,
  github: project_metadata.github || sources.find(s => s.type === 'github'),
  docs: constitutional_research.project_overview.documentation,
  whitepaper: sources.find(s => s.url.includes('whitepaper')),
  twitter: sources.find(s => s.type === 'twitter')?.url?.replace(/.*twitter\.com\//, ''),
  telegram: extractSocialLinks('telegram'),
  discord: extractSocialLinks('discord'),
  blog: sources.find(s => s.type === 'blog')?.url
}

// URL Validation Function
async function validateUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
    return response.status >= 200 && response.status < 400;
  } catch (error) {
    return false;
  }
}
```

### 4. Team Information

```javascript
team: {
  anonymous: constitutional_research.team_and_governance.anonymous || false,

  members_count: constitutional_research.team_and_governance.team_size ||
                 counted_team_members.length,

  teammembers: constitutional_research.team_and_governance.founders.map(founder => ({
    name: founder.name,
    role: founder.role || 'Founder',
    link: founder.github || founder.linkedin || founder.twitter
  })).concat(
    // Add non-founder team members if available
    other_team_members.map(member => ({
      name: member.name,
      role: member.role,
      link: member.github
    }))
  )
}

// Quality checks
- Filter out placeholder names ("John Doe", "Author Name")
- Verify links return 200 status
- Add confidence score in comment if < 0.8
```

### 5. Technology & Privacy Features

```javascript
technology: {
  type: extractPrimaryTech(constitutional_research.technical_architecture),

  features: transformPrivacyTechniques(
    constitutional_research.technical_architecture.privacy_technology
  ),

  stack: constitutional_research.technical_architecture.language_breakdown
    ? Object.keys(language_breakdown).slice(0, 5)  // Top 5 languages
    : tech_stack.filter(tech => isLanguageOrFramework(tech))
}

// Privacy technique transformation
const privacyFeatureMap = {
  'Zero-Knowledge Proofs (ZK-SNARKs)': 'zk-SNARKs',
  'Zero-Knowledge Proofs (ZK-STARKs)': 'zk-STARKs',
  'PLONK Proof System': 'PLONK',
  'Ring Signatures': 'ring-signatures',
  'Stealth Addresses': 'stealth-addresses',
  'Coin Mixing': 'mixing',
  'Tor Network Integration': 'tor',
  'Homomorphic Encryption': 'FHE',
  'Multi-Party Computation': 'MPC',
  'Trusted Execution Environment': 'TEE',
  'Private Transactions': 'private-transactions',
  'Encrypted Messaging': 'encrypted-messaging'
};

function transformPrivacyTechniques(techniques) {
  return techniques
    .map(tech => {
      // Try exact match
      if (privacyFeatureMap[tech]) return privacyFeatureMap[tech];

      // Try fuzzy match
      for (const [key, value] of Object.entries(privacyFeatureMap)) {
        if (tech.toLowerCase().includes(key.toLowerCase()) ||
            key.toLowerCase().includes(tech.toLowerCase())) {
          return value;
        }
      }

      // Return original if no match (will need manual review)
      return tech;
    })
    .filter(unique);
}
```

### 6. Blockchain Features

```javascript
blockchain_features: {
  opensource: github_analysis?.public === true,

  asset_custody_type: determineAssetCustody(
    constitutional_research.privacy_and_compliance
  ),

  evm_compatible: constitutional_research.technical_architecture.evm_compatible === true,

  p2p: checkIfP2P(constitutional_research.technical_architecture),

  upgradability: {
    enabled: checkContractUpgradeability(analysis.smart_contracts),
    type: extractUpgradePattern(analysis.smart_contracts)
  }
}

function determineAssetCustody(privacyCompliance) {
  const text = JSON.stringify(privacyCompliance).toLowerCase();
  if (text.includes('non-custodial') || text.includes('self-custody')) {
    return 'non-custodial';
  } else if (text.includes('hybrid')) {
    return 'hybrid';
  } else if (text.includes('custodial')) {
    return 'custodial';
  }
  return null;  // Unknown
}
```

### 7. Tokens & Assets

```javascript
// Check if project has a native token
have_token: constitutional_research.token_economics.native_token !== null,

tokens: constitutional_research.token_economics.native_token ? [{
  name: constitutional_research.token_economics.native_token,
  symbol: constitutional_research.token_economics.token_symbol,
  contract_address: analysis.smart_contracts.find(c => c.is_token)?.contract_address,
  token_link: findTokenLink(token_symbol)  // CoinGecko/CMC lookup
}] : []

function findTokenLink(symbol) {
  // Try to find token on major platforms
  const candidates = [
    `https://www.coingecko.com/en/coins/${symbol.toLowerCase()}`,
    `https://coinmarketcap.com/currencies/${symbol.toLowerCase()}`
  ];

  // Would need to verify which one exists
  return null;  // Manual review needed
}
```

### 8. Funding Information

```javascript
funding: constitutional_research.funding_and_investment.funding_rounds.map(round => ({
  name: `${round.round_type} - ${round.amount}`,
  type: mapFundingType(round.round_type),
  link: round.announcement_url || round.source_url,
  value: parseAmount(round.amount),
  time: round.date || round.year
}))

// Also extract individual investors
investors: constitutional_research.funding_and_investment.key_investors || []

function mapFundingType(roundType) {
  const typeMap = {
    'Seed': 'seed',
    'Pre-Seed': 'pre-seed',
    'Series A': 'series-a',
    'Series B': 'series-b',
    'ICO': 'ico',
    'Token Sale': 'token-sale',
    'Grant': 'grant'
  };
  return typeMap[roundType] || roundType.toLowerCase();
}
```

### 9. Security & Audits

```javascript
audits: constitutional_research.audits_and_security
  .filter(audit => audit.audit_status === 'Completed')
  .map(audit => ({
    name: audit.auditor || extractAuditorFromUrl(audit.report_url),
    company: audit.auditor,
    link: audit.report_url,
    time: audit.audit_date || extractDateFromReport(audit.report_url)
  }))

// Extract auditor from common patterns
function extractAuditorFromUrl(url) {
  const auditors = [
    'Trail of Bits', 'ConsenSys Diligence', 'OpenZeppelin',
    'CertiK', 'PeckShield', 'Quantstamp', 'Hacken',
    'Sigma Prime', 'Runtime Verification'
  ];

  for (const auditor of auditors) {
    if (url.toLowerCase().includes(auditor.toLowerCase().replace(' ', '-'))) {
      return auditor;
    }
  }

  return null;  // Manual review needed
}
```

### 10. Project Status

```javascript
project_status: {
  version: mapStatus(status, maturity_level),
  testnet: status === 'testnet' || maturity_level === 'beta',
  mainnet: status === 'active' || maturity_level === 'production',
  launched: constitutional_research.project_overview.launch_date,
  sunset: status === 'deprecated'
}

function mapStatus(status, maturity) {
  if (status === 'deprecated' || maturity === 'sunset') return 'Sunset';
  if (status === 'mainnet' || maturity === 'production') return 'Mainnet';
  if (status === 'testnet' || maturity === 'beta') return 'Testnet';
  if (status === 'in-development' || maturity === 'alpha') return 'Alpha';
  if (maturity === 'experimental') return 'MVP';
  return 'Unknown';
}
```

### 11. Constitutional Metadata (Proposed Addition)

```javascript
// Add as optional section at end of YAML
data_quality: {
  confidence: confidence,  // 0.0-1.0
  completeness: completeness / 100,  // Convert percentage to decimal
  verification_date: last_update || new Date().toISOString().split('T')[0],

  sources: sources.map(source => ({
    type: source.type,
    url: source.url,
    verified: source.confidence >= 0.8,
    retrieved_at: source.retrieved_at
  })),

  missing_fields: missing_fields,

  notes: verification_notes || null
}
```

---

## Validation Rules

### Required Fields (Must Have)
- `id` (string, alphanumeric + hyphens)
- `name` (string, 1-100 chars)
- `description` (string, 50-500 chars)
- `categories` (array, at least 1 valid category)
- `links.web` OR `links.github` (at least one)

### Recommended Fields (Should Have)
- `technology.type`
- `technology.features` (at least 2)
- `project_status.version`
- `team` (if not anonymous)

### Optional Fields (Nice to Have)
- `funding`
- `audits`
- `tokens`
- `investors`
- `data_quality` (our proposed addition)

### Quality Thresholds
```javascript
const qualityChecks = {
  minimumCompleteness: 0.40,  // 40%
  minimumConfidence: 0.60,    // 60%
  minimumPrivacyFeatures: 2,
  maximumMissingFields: 10,
  requiredUrls: ['web', 'github'],  // At least one must work

  syntheticDataPatterns: [
    /lorem ipsum/i,
    /example\.com/i,
    /@project\.com/i,
    /\[Author Name\]/i,
    /TODO:/i,
    /PLACEHOLDER/i,
    /test@test\.com/i
  ]
};

function passesQualityThreshold(project) {
  return (
    project.completeness >= qualityChecks.minimumCompleteness &&
    project.confidence >= qualityChecks.minimumConfidence &&
    project.privacyFeatures.length >= qualityChecks.minimumPrivacyFeatures &&
    !hasSyntheticData(project)
  );
}
```

---

## Error Handling

### Error Categories

1. **Fatal Errors** (Skip project)
   - Missing required files (constitutional_research.json)
   - No name or description
   - All URLs return 404
   - Synthetic data detected in critical fields

2. **Warnings** (Include but flag)
   - Low confidence score (< 0.6)
   - Low completeness (< 50%)
   - Missing recommended fields
   - Broken secondary URLs

3. **Info** (Log but continue)
   - Optional fields missing
   - Fuzzy category mapping
   - Team data incomplete

### Error Logging Format
```javascript
{
  project_id: "aztec-network",
  errors: [
    { level: "error", field: "links.web", message: "URL returns 404" },
    { level: "warning", field: "team", message: "No team members found" },
    { level: "info", field: "audits", message: "No audit data available" }
  ],
  action: "skip" | "include_with_warnings" | "include"
}
```

---

## Output Structure

```
output/
├── enrichment/                    # Projects that exist in both repos
│   ├── aztec-network/
│   │   ├── index.yaml            # Transformed YAML
│   │   └── comparison.md         # Before/after comparison
│   ├── railgun/
│   │   ├── index.yaml
│   │   └── comparison.md
│   └── ...
│
├── new-projects/                  # Projects only in our repo
│   ├── 0xbow/
│   │   └── index.yaml
│   ├── alephim/
│   │   └── index.yaml
│   └── ...
│
├── errors/                        # Projects that failed validation
│   └── errors.json               # Error log
│
└── reports/
    ├── transformation-summary.json
    ├── quality-report.md
    └── field-coverage.md
```

---

## Script Architecture

```javascript
// Main transformation script structure

const TransformationPipeline = {

  // Step 1: Discovery
  async discoverProjects() {
    // Scan deliverables directory
    // Return list of project directories with required files
  },

  // Step 2: Load Data
  async loadProjectData(projectPath) {
    // Read all JSON files for project
    // Merge into single unified object
    // Return ProjectData
  },

  // Step 3: Validate
  async validateProject(projectData) {
    // Check quality thresholds
    // Validate URLs
    // Detect synthetic data
    // Return validation result
  },

  // Step 4: Transform
  async transformToYAML(projectData, validationResult) {
    // Map fields according to specification
    // Apply transformations
    // Build YAML object
    // Return YAML string
  },

  // Step 5: Write Output
  async writeOutput(projectId, yamlContent, category) {
    // Write to appropriate directory (enrichment vs new-projects)
    // Generate comparison file if enrichment
    // Log results
  },

  // Step 6: Report
  async generateReports(results) {
    // Summary statistics
    // Quality report
    // Error log
    // Field coverage analysis
  }
};

// Main execution
async function main() {
  const projects = await TransformationPipeline.discoverProjects();
  console.log(`Found ${projects.length} projects`);

  const results = [];

  for (const project of projects) {
    try {
      const data = await TransformationPipeline.loadProjectData(project.path);
      const validation = await TransformationPipeline.validateProject(data);

      if (validation.action === 'skip') {
        console.log(`⏭️  Skipping ${project.slug}: ${validation.errors[0].message}`);
        results.push({ ...project, status: 'skipped', validation });
        continue;
      }

      const yaml = await TransformationPipeline.transformToYAML(data, validation);
      await TransformationPipeline.writeOutput(project.slug, yaml, project.category);

      console.log(`✅ Transformed ${project.slug}`);
      results.push({ ...project, status: 'success', validation });

    } catch (error) {
      console.error(`❌ Error transforming ${project.slug}:`, error);
      results.push({ ...project, status: 'error', error: error.message });
    }
  }

  await TransformationPipeline.generateReports(results);
}
```

---

## Testing Strategy

### Unit Tests
```javascript
describe('Field Mapping', () => {
  test('maps privacy techniques correctly', () => {
    const input = ['Zero-Knowledge Proofs (ZK-SNARKs)', 'Ring Signatures'];
    const output = transformPrivacyTechniques(input);
    expect(output).toEqual(['zk-SNARKs', 'ring-signatures']);
  });

  test('validates URLs', async () => {
    const valid = await validateUrl('https://aztec.network');
    expect(valid).toBe(true);
  });

  test('detects synthetic data', () => {
    const synthetic = detectSyntheticData('Lorem ipsum dolor sit amet');
    expect(synthetic).toBe(true);
  });
});
```

### Integration Tests
```javascript
describe('Full Transformation', () => {
  test('transforms Aztec Network correctly', async () => {
    const data = await loadProjectData('deliverables/aztec-network');
    const yaml = await transformToYAML(data);

    expect(yaml).toContain('name: Aztec Network');
    expect(yaml).toContain('categories: [defi, infrastructure]');
    expect(yaml).toContain('zk-SNARKs');
  });
});
```

### Manual QA Checklist
- [ ] Open 5 generated YAML files in text editor
- [ ] Verify formatting is clean and readable
- [ ] Check all URLs by clicking them
- [ ] Compare with original source data for accuracy
- [ ] Ensure no placeholder text remains
- [ ] Validate YAML syntax with online parser

---

## Performance Considerations

- **Parallel Processing**: Transform multiple projects concurrently (max 5 at a time)
- **URL Validation**: Cache results to avoid re-checking same URLs
- **Rate Limiting**: Respect GitHub API rate limits (5000/hour authenticated)
- **Progress Tracking**: Show progress bar for long-running transformations
- **Checkpointing**: Save intermediate results to allow resuming

```javascript
const CONCURRENCY_LIMIT = 5;
const URL_CACHE_TTL = 3600; // 1 hour
const REQUEST_DELAY = 100; // ms between requests

async function transformWithConcurrency(projects) {
  const chunks = chunkArray(projects, CONCURRENCY_LIMIT);

  for (const chunk of chunks) {
    await Promise.all(chunk.map(p => transformProject(p)));
    await delay(REQUEST_DELAY);
  }
}
```

---

## Known Limitations

1. **Category Fuzzy Matching**: Some categories don't map 1:1, requires manual review
2. **Team Data Completeness**: Not all projects have full team info
3. **Token Links**: CoinGecko/CMC links need manual verification
4. **Audit Dates**: Sometimes need to be extracted from PDF reports
5. **Funding Amounts**: Formats vary ("$4.8M" vs "$4,800,000" vs "4.8 million")

---

## Recovery & Checkpoints

If the transformation is interrupted:

1. **Check progress**: `ls output/enrichment | wc -l`
2. **Find last completed**: `ls -lt output/enrichment | head -1`
3. **Resume from checkpoint**: Script will skip already-transformed projects
4. **Verify partial results**: Run QA on completed projects

Checkpoint file format:
```json
{
  "last_updated": "2025-10-15T21:30:00Z",
  "completed_projects": ["aztec-network", "railgun", "tornado-cash"],
  "failed_projects": ["project-x"],
  "total_processed": 15,
  "total_remaining": 102
}
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-15
**Next Review**: After first batch transformation
**Owner**: Flower (@flower)
