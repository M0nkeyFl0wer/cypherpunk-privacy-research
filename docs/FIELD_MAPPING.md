# Field Mapping: Our Data → Web3Privacy YAML Schema

This document maps our rich JSON data structure to the Web3Privacy Explorer YAML schema, showing how to enrich their data with our research.

## Overview

- **Our Format**: JSON files (`constitutional_research.json`, `project_metadata.json`, analysis files)
- **Their Format**: YAML (`index.yaml` per project)
- **Strategy**: Transform our detailed multi-source data into their simpler but broader schema

---

## Core Identity Fields

| Our Field | Their Field | Mapping Notes |
|-----------|-------------|---------------|
| `constitutional_research.project_overview.name` | `name` | Direct mapping |
| `project_metadata.project_name` | `name` | Fallback if constitutional missing |
| `slug` | `id` | Lowercase hyphenated identifier |
| `constitutional_research.project_overview.description` | `description` | Use our detailed description (50-200 chars) |
| `constitutional_research.project_overview.tagline` | N/A | Could add as extended description |

**Enrichment Value**: Our names have confidence scores and multiple source verification.

---

## Categories & Classification

| Our Field | Their Field | Mapping Notes |
|-----------|-------------|---------------|
| `category` | `categories` | Map to their category enum |
| `subcategories` | `categories` | Multiple categories supported |
| N/A | `usecases` | Could map from our privacy techniques |
| `constitutional_research.technical_architecture.blockchain_type` | `ecosystem` | e.g., "Layer 2 zkRollup" → "ethereum" |

**Category Mapping Table**:
```javascript
{
  'defi': 'defi',
  'wallet': 'applications',  // or create 'wallet' category
  'currency': 'currency',
  'infrastructure': 'infrastructure',
  'computing': 'infrastructure',
  'messaging': 'applications',
  'bridges': 'infrastructure',
  'layer2-privacy': 'infrastructure'
}
```

**Enrichment Value**: We have detailed subcategories and confidence scoring for classifications.

---

## Links & Resources

| Our Field | Their Field | Mapping Notes |
|-----------|-------------|---------------|
| `constitutional_research.project_overview.website` | `links.web` | Verified with HTTP status |
| `github` | `links.github` | Primary GitHub org/repo |
| `constitutional_research.project_overview.documentation` | `links.docs` | Official documentation URL |
| N/A | `links.whitepaper` | Could extract from sources |
| `sources[].url` where type='twitter' | `links.twitter` | Extract from data sources |
| N/A | `links.discord` | Could extract from contact info |
| N/A | `links.telegram` | Could extract from contact info |

**Enrichment Value**: All our URLs are verified with HTTP status codes and confidence scores.

---

## Team Information

| Our Field | Their Field | Mapping Notes |
|-----------|-------------|---------------|
| `constitutional_research.team_and_governance.founders[]` | `team.teammembers[]` | Map founder data |
| `constitutional_research.team_and_governance.team_size` | `team.members_count` | Verified team count |
| `team[].name` | `team.teammembers[].name` | Team member names |
| `team[].github` | `team.teammembers[].link` | GitHub profile links |
| `team[].role` | `team.teammembers[].role` | Job titles/roles |
| `constitutional_research.team_and_governance.anonymous` | `team.anonymous` | Boolean flag |

**Example Transformation**:
```yaml
team:
  anonymous: false
  members_count: 15
  teammembers:
    - name: Zac Williamson
      role: CEO & Co-founder
      link: https://github.com/zacwilliamson
      confidence: 0.95
```

**Enrichment Value**: We have detailed founder backgrounds, CERN affiliations, previous projects, confidence scores.

---

## Technology & Privacy

| Our Field | Their Field | Mapping Notes |
|-----------|-------------|---------------|
| `privacyTechniques[]` | `technology.features` | Array of privacy mechanisms |
| `constitutional_research.technical_architecture.privacy_technology[]` | `technology.features` | Detailed crypto primitives |
| `techStack[]` | `technology.type` | Primary tech (first item) |
| `constitutional_research.technical_architecture.smart_contract_language` | `technology.type` | e.g., "Noir (Rust-like DSL)" |
| `constitutional_research.technical_architecture.language_breakdown` | Custom field | Percentage breakdown |
| `constitutional_research.technical_architecture.evm_compatible` | `blockchain_features.evm_compatible` | Boolean |
| `constitutional_research.technical_architecture.opensource` | `blockchain_features.opensource` | Verify on GitHub |

**Privacy Techniques Mapping** (Our → Theirs):
```javascript
{
  "Zero-Knowledge Proofs (ZK-SNARKs)": "zk-SNARKs",
  "PLONK Proof System": "PLONK",
  "Ring Signatures": "ring-signatures",
  "Stealth Addresses": "stealth-addresses",
  "Tor Network Integration": "tor",
  "Homomorphic Encryption": "FHE",
  "Multi-Party Computation (MPC)": "MPC"
}
```

**Enrichment Value**:
- We have 10+ detailed privacy techniques per project vs their 1-2
- Source-verified cryptographic primitives
- Language breakdown percentages from GitHub API

---

## Blockchain Features

| Our Field | Their Field | Mapping Notes |
|-----------|-------------|---------------|
| GitHub analysis → `opensource` | `blockchain_features.opensource` | Verify repo is public |
| Constitutional research → `custody` | `blockchain_features.asset_custody_type` | non-custodial, custodial, hybrid |
| N/A | `blockchain_features.upgradability.enabled` | Analyze smart contracts |
| N/A | `blockchain_features.p2p` | Check architecture notes |

**Enrichment Value**: We can verify open source status, analyze contract upgradeability from GitHub.

---

## Tokens & Assets

| Our Field | Their Field | Mapping Notes |
|-----------|-------------|---------------|
| `constitutional_research.token_economics.native_token` | `tokens[].name` | Token name |
| `constitutional_research.token_economics.token_symbol` | `tokens[].symbol` | Ticker symbol |
| `constitutional_research.smart_contracts[].contract_address` | `tokens[].contract_address` | Verified addresses |
| N/A | `tokens[].token_link` | Link to CoinGecko/CMC |
| N/A | `have_token` | Boolean based on above |

**Enrichment Value**: We have verified contract addresses from multiple chains, token supply data.

---

## Funding Information

| Our Field | Their Field | Mapping Notes |
|-----------|-------------|---------------|
| `constitutional_research.funding_and_investment.total_funding` | `funding[].name` | e.g., "$100M Series B" |
| `constitutional_research.funding_and_investment.key_investors[]` | `funding[].name` | Investor names |
| `constitutional_research.funding_and_investment.funding_rounds[]` | `funding[]` | Array of rounds |
| `investors[]` | `funding[].name` | Investor list |

**Example Transformation**:
```yaml
funding:
  - name: Series B - $100M
    link: https://techcrunch.com/2022/12/15/aztec-network-100m-a16z
    date: "2022-12-15"
    round: "Series B"
    amount: "$100M"
    investors: ["a16z Crypto", "Paradigm", "Variant"]
```

**Enrichment Value**: Verified funding data with sources, dates, investor confidence scores.

---

## Security & Audits

| Our Field | Their Field | Mapping Notes |
|-----------|-------------|---------------|
| `constitutional_research.audits_and_security[]` | `audits[]` | Security audit reports |
| Audit sources → `audit_company` | `audits[].name` | Auditor name |
| Audit date | `audits[].time` | YYYY-MM-DD format |
| Audit report URL | `audits[].link` | Public report link |

**Example Transformation**:
```yaml
audits:
  - name: Trail of Bits
    link: https://github.com/trailofbits/publications/blob/master/reviews/Aztec.pdf
    time: "2023-05-15"
    scope: "PLONK implementation, cryptographic primitives"
```

**Enrichment Value**: We have detailed audit findings, scope, remediation status from constitutional research.

---

## Project Status

| Our Field | Their Field | Mapping Notes |
|-----------|-------------|---------------|
| `status` | `project_status.version` | active → Mainnet, testnet → Testnet |
| `maturity_level` | `project_status.version` | Map to MVP/Alpha/Beta/Mainnet |
| `constitutional_research.project_overview.status` | `project_status.version` | "Testnet live (May 2025)" |
| N/A | `project_status.sunset` | Check if deprecated |
| `last_update` | `project_status.last_update` | GitHub activity date |

**Status Mapping**:
```javascript
{
  'active': 'Mainnet',
  'testnet': 'Testnet',
  'in-development': 'Alpha',
  'beta': 'Beta',
  'deprecated': 'Sunset'
}
```

**Enrichment Value**: We have precise version numbers, launch dates with sources.

---

## Privacy & Compliance

| Our Field | Their Field | Mapping Notes |
|-----------|-------------|---------------|
| N/A | `privacy_policy.defined` | Check if privacy policy exists |
| N/A | `privacy_policy.link` | Link to privacy policy |
| N/A | `default_privacy` | Boolean - privacy by default |
| N/A | `traceability.kyc` | KYC requirements |
| N/A | `traceability.tracked_data` | What data is tracked |
| Constitutional compliance notes | `compliance` | Regulatory compliance |

**Enrichment Value**: We can analyze documentation and smart contracts to verify privacy claims.

---

## Metadata & Constitutional Fields

| Our Field | Their Field | Notes |
|-----------|-------------|-------|
| `confidence` | **NEW FIELD** | Add confidence scoring (0.0-1.0) |
| `sources[]` | **NEW FIELD** | Multi-source verification array |
| `missing_fields[]` | **NEW FIELD** | Gap reporting for transparency |
| `data_quality` | **NEW FIELD** | Completeness, accuracy, freshness |
| `constitutional_research.verification_notes` | **NEW FIELD** | How data was verified |

**Proposed YAML Extension**:
```yaml
# Constitutional data quality (proposed addition)
data_quality:
  confidence: 0.95
  completeness: 0.80
  verification_date: "2025-10-10"
  sources:
    - type: github-api
      url: https://api.github.com/repos/AztecProtocol/aztec-packages
      verified: true
    - type: website
      url: https://aztec.network
      http_status: 200
  missing_fields: ["token_economics", "recent_news"]
```

---

## Complete Example: Aztec Network

### Our Data (Simplified):
```json
{
  "name": "Aztec Network",
  "description": "Privacy-first Layer 2 zkRollup on Ethereum",
  "category": "defi",
  "privacyTechniques": [
    "Zero-Knowledge Proofs (ZK-SNARKs)",
    "PLONK Proof System",
    "ZK-ZK Rollup (ZK²)",
    "Encrypted Transactions"
  ],
  "techStack": ["C++", "TypeScript", "Noir", "Solidity"],
  "confidence": 0.95,
  "sources": [
    {"type": "website", "url": "https://aztec.network", "confidence": 1.0},
    {"type": "github-api", "url": "https://github.com/AztecProtocol"}
  ]
}
```

### Transformed to Their YAML:
```yaml
id: aztec-network
name: Aztec Network
categories: [defi, infrastructure]
ecosystem: [ethereum]
description: "Privacy-first Layer 2 zkRollup on Ethereum enabling programmable privacy with both private and public smart contract execution."
product_launch_day: "2025-05-01"

team:
  anonymous: false
  members_count: 50
  teammembers:
    - name: Zac Williamson
      role: CEO & Co-founder
      link: https://github.com/zacwilliamson

links:
  web: https://aztec.network
  github: https://github.com/AztecProtocol
  docs: https://docs.aztec.network
  twitter: https://twitter.com/aztecnetwork
  discord: https://discord.gg/aztec

project_status:
  version: Testnet
  testnet: true
  mainnet_planned: "2025-Q4"

technology:
  type: Zero-knowledge rollup
  features:
    - ZK-SNARKs
    - PLONK
    - Encrypted transactions
    - Private state management
    - Hybrid public-private execution
  stack:
    - C++
    - TypeScript
    - Noir
    - Solidity

blockchain_features:
  opensource: true
  evm_compatible: false
  asset_custody_type: non-custodial
  p2p: true

funding:
  - name: Series B - $100M
    link: https://techcrunch.com/2022/12/15/aztec-network-100m-a16z
    round: Series B
    amount: "$100M"
    investors: [a16z Crypto, Paradigm, Variant]

audits:
  - name: Trail of Bits
    link: https://github.com/trailofbits/publications
    time: "2023-05-15"

# Proposed enrichment fields
data_quality:
  confidence: 0.95
  completeness: 0.80
  sources: 5
  last_verified: "2025-10-10"
```

---

## Summary: Our Unique Value-Add

### Fields We Add That They Often Lack:
1. **Confidence Scoring** (0.0-1.0) for all data points
2. **Multi-source Verification** with URLs and retrieval dates
3. **Detailed Privacy Techniques** (10+ vs their 1-2)
4. **Tech Stack Breakdown** with language percentages
5. **Team Backgrounds** with previous experience, affiliations
6. **Funding Details** with dates, amounts, investor lists
7. **GitHub Metrics** (stars, forks, contributors, activity)
8. **Audit Findings** (not just audit company, but scope and results)
9. **Launch Dates** with precision and source citation
10. **Missing Fields Reporting** (transparency about data gaps)

### Data Quality Metrics:
- **Our average**: 30-80% completeness with multi-source verification
- **Their average**: Basic fields populated, less detailed privacy/tech data
- **Enrichment potential**: 37 projects can be enhanced with 2-5x more data

---

## Next Steps

1. ✅ Field mapping documented
2. ⏳ Create transformation script (`scripts/json-to-yaml.js`)
3. ⏳ Generate sample YAMLs for top 5-10 projects
4. ⏳ Create pull request template with before/after comparison
5. ⏳ Submit pilot enrichment PR to web3privacy/explorer-data
