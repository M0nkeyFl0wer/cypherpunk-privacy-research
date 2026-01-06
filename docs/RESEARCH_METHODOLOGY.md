# Research Methodology & Lessons Learned

*Comprehensive documentation of the Web3 Privacy Research Project*

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Research Methodology](#research-methodology)
3. [Data Structure & Schema](#data-structure--schema)
4. [The PR Disaster](#the-pr-disaster)
5. [Lessons Learned](#lessons-learned)
6. [Schema Extension Proposal](#schema-extension-proposal)
7. [Future Recommendations](#future-recommendations)

---

## Project Overview

### Scope

This research project analyzed **959 privacy-focused Web3 projects** with the goal of contributing verified, high-quality data to the [Web3Privacy Explorer](https://explorer.web3privacy.info/).

**Final Distribution:**
| Category | Count | Description |
|----------|-------|-------------|
| Analyzed (submitted) | 40 | Comprehensive research complete with verified data |
| Analyzed (incomplete) | 131 | Research attempted but insufficient verified data |
| Research-required | 788 | Awaiting basic data or comprehensive research |

### Timeline

- **December 2024**: Project initiated
- **January 2025**: PR #1997 submitted to web3privacy/explorer-data
- **January 2025**: PR rejected due to data quality issues
- **January 2025**: PR #2060 submitted with corrected data
- **January 2025**: Research site created at cypherpunk-research.benwest.io

---

## Research Methodology

### Constitutional Research Framework

Each project was researched using a structured "Constitutional Research" approach that prioritizes:

1. **Verification over volume** - Every data point must have a traceable source
2. **Primary sources first** - Official websites, GitHub, whitepapers before secondary sources
3. **Confidence scoring** - Each field rated for reliability (0.0 - 1.0)
4. **Temporal awareness** - Data includes collection dates for freshness tracking

### Data Collection Process

```
1. Initial Discovery
   ├── Official website crawl
   ├── GitHub repository analysis
   ├── CoinGecko/CoinMarketCap verification
   └── Social media presence check

2. Deep Research
   ├── Whitepaper/documentation review
   ├── Team member verification (LinkedIn, Twitter, public bios)
   ├── Funding history (Crunchbase, press releases)
   ├── Smart contract verification (Etherscan, block explorers)
   └── News/media coverage analysis

3. Validation
   ├── Cross-reference multiple sources
   ├── Flag unverifiable claims
   ├── Assign confidence scores
   └── Document source URLs
```

### Source Hierarchy

Sources ranked by reliability:

| Tier | Source Type | Confidence Modifier |
|------|-------------|---------------------|
| 1 | Official website, GitHub, verified docs | +0.2 |
| 2 | Official social media, press releases | +0.1 |
| 3 | CoinGecko, DeFiLlama, established aggregators | +0.0 |
| 4 | News articles, third-party reviews | -0.1 |
| 5 | Community wikis, forums | -0.2 |

### Verification Rules

- **Names**: Must match official branding exactly
- **Team members**: Require public profile link OR multiple independent sources
- **Contract addresses**: Verified via block explorer
- **Metrics**: Include collection timestamp, refresh required if >30 days old
- **Descriptions**: Sourced from official materials, not generated

---

## Data Structure & Schema

### Directory Structure

```
deliverables/{project-id}/
├── README.md                    # Project overview (templated)
├── CARD.md                      # Quick summary card
├── constitutional_research.json # Research methodology metadata
├── project_metadata.json        # Basic project info
├── sources/
│   └── verified_data.json       # Primary research data (structured)
├── reports/
│   ├── TEAM.md                  # Team & leadership analysis
│   ├── SECURITY.md              # Security assessment
│   ├── technical_analysis.md    # Technical deep-dive
│   ├── CODE_REVIEW.md           # Code quality analysis
│   ├── opsec_vulnerability_assessment.md
│   └── news_report.md           # Recent news/developments
└── analysis/
    ├── github_analysis.json     # GitHub metrics
    └── osint_*.json             # OSINT research data
```

### verified_data.json Schema

Multiple formats evolved during research. Key formats:

**Format A: Tiered Data (Iron Fish, Firo, HOPR)**
```json
{
  "tier_1_data": {
    "name": { "value": "Project Name", "confidence": 1.0 },
    "description": { "value": "...", "confidence": 0.9 },
    "website": { "value": "https://...", "confidence": 1.0 }
  },
  "tier_2_data": {
    "founders": { "value": [...], "confidence": 0.8 }
  }
}
```

**Format B: Categorical (Zcash)**
```json
{
  "project_basic_info": {
    "official_name": "Zcash",
    "description": "..."
  },
  "founders_and_scientists": {...},
  "organizations": {...}
}
```

**Format C: Flat with Metadata (Monero)**
```json
{
  "basic_information": {
    "name": { "value": "Monero", "confidence": 1.0, "sources": [...] }
  },
  "market_data": {...},
  "official_links": {...}
}
```

**Format D: Event-Based (Tornado Cash)**
```json
{
  "project_name": "Tornado Cash",
  "legal_history": {
    "status": "OFAC Sanctioned",
    "key_events": [...]
  },
  "contracts": [...],
  "milestones": [...]
}
```

### Web3Privacy Explorer Schema (Limited)

The explorer only accepts these fields:
```yaml
name: string
description: string
team:
  anonymous: boolean
  teammembers:
    - name: string
      role: string
      link: string (optional)
links:
  web: string
  github: string
  twitter: string (optional)
ecosystem: string[]
product_launch_day: string
```

**Fields NOT supported by explorer:**
- Contract addresses
- Milestones/timeline
- Market data/metrics
- Legal history
- Security assessments
- Technical specifications
- Funding history
- Governance structure

---

## The PR Disaster

### What Happened

**PR #1997** was submitted to web3privacy/explorer-data with research data for 129 projects.

**The Problem:**
1. PR modified existing project files instead of only adding new ones
2. Template/placeholder data was accidentally included alongside research
3. High-quality existing descriptions were overwritten with generic AI-generated text
4. Diff was not carefully reviewed before submission

**Discovery:**
A Zcash community developer reviewed the PR and flagged that:
- Zcash's curated description was being replaced with template text
- Other established projects had similar overwrites
- Data quality would degrade if merged

**Result:**
- PR was not merged
- Required creating PR #2060 with corrected data
- Highlighted the need for better QA processes

### Root Causes

1. **Bulk submission**: 129 projects in one PR made review impossible
2. **Mixed data quality**: Verified research mixed with empty templates
3. **No staging environment**: No way to preview changes before PR
4. **Schema mismatch**: Deep research had no place in limited explorer schema
5. **Time pressure**: Rushed to submit without proper validation

---

## Lessons Learned

### Technical Lessons

1. **Separate new from modified**
   - NEVER modify existing files without explicit review
   - Add-only PRs are safer than update PRs
   - Use `git diff --name-status` to verify

2. **Small, focused PRs**
   - Max 10-20 projects per PR
   - Group by ecosystem or category
   - Easier to review, easier to revert

3. **Validation pipeline**
   - Automated schema validation before commit
   - Cross-reference against existing data
   - Flag any file modifications

4. **Preview environment**
   - Build local preview of explorer
   - Verify data renders correctly
   - Check for regressions

### Process Lessons

1. **Constitutional research works**
   - Verified data with sources is defensible
   - Confidence scores help prioritize
   - Timestamps enable freshness tracking

2. **Schema limitations are real**
   - Explorer schema is minimal by design
   - Deep research needs separate hosting
   - Link to external research via descriptions

3. **Community feedback is valuable**
   - Maintainers catch things you miss
   - Public review improves quality
   - Respond constructively to criticism

### Data Quality Lessons

1. **Templates are dangerous**
   - Empty templates look like real data
   - "No description available" is better than fake description
   - Never submit placeholder content

2. **AI-generated content needs review**
   - LLM descriptions can be inaccurate
   - Always verify against primary sources
   - Prefer official descriptions when available

3. **Partial data is okay**
   - Better to have 40 high-quality entries than 129 mixed
   - Mark incomplete research clearly
   - Don't pad with fabricated data

---

## Schema Extension Proposal

### Proposed New Fields

Based on research findings, propose adding to explorer schema:

```yaml
# Extended Project Schema (Proposed)

name: string
description: string

# NEW: Link to comprehensive research
research_url: string  # IPFS or permanent URL to full research

# NEW: Contract deployments
contracts:
  - network: string
    address: string
    name: string
    verified: boolean

# NEW: Project timeline
milestones:
  - date: string
    event: string
    source: string

# NEW: On-chain metrics
metrics:
  tvl: number
  tvl_source: string
  last_updated: string

# NEW: Legal/compliance status
legal_status: string  # active, sanctioned, ceased, etc.

# Existing fields
team: {...}
links: {...}
ecosystem: string[]
```

### Implementation Approach

**Phase 1: research_url field**
- Single new field, minimal schema change
- Links to IPFS-hosted research
- Backwards compatible

**Phase 2: contracts & metrics**
- Addresses GitHub issues #1939, #1940
- DeFiLlama integration for TVL
- Etherscan integration for contracts

**Phase 3: milestones & legal**
- Historical timeline data
- Compliance/regulatory status
- Community governance info

### Related GitHub Issues

- [#1947](https://github.com/web3privacy/explorer-data/issues/1947) - LLM data crawler
- [#1940](https://github.com/web3privacy/explorer-data/issues/1940) - Add TVL for privacy projects
- [#1939](https://github.com/web3privacy/explorer-data/issues/1939) - Add TVL for individual projects

---

## Future Recommendations

### For This Project

1. **Complete research-required projects**
   - Prioritize high-impact projects (788 remaining)
   - Use validated methodology
   - Submit in small batches

2. **Maintain research site**
   - Host at cypherpunk-research.benwest.io
   - Demonstrate extended schema value
   - Link from explorer entries

3. **Propose schema changes**
   - Forum post with examples
   - Start with `research_url` field
   - Build community support

### For Future Contributors

1. **Read existing data first**
   - Understand current quality level
   - Don't overwrite good data
   - Add value, don't replace

2. **Use the constitutional framework**
   - Source everything
   - Score confidence
   - Document methodology

3. **Start small**
   - 5-10 projects first
   - Get feedback early
   - Iterate based on review

4. **Separate research from submissions**
   - Full research in dedicated repository
   - Explorer entries link to research
   - Keep explorer data minimal/verifiable

---

## Appendix A: Data Quality Audit

*Audit completed: January 2025*

### Project Report Coverage (40 projects in deliverables/)

| Report Type | Files Exist | Substantive Content | Notes |
|-------------|-------------|---------------------|-------|
| **TEAM.md** | 40 | 0 | All templates - team data IS in JSON but not synced |
| **SECURITY.md** | 40 | 0 | All templates - no audit data found |
| **technical_analysis.md** | 16 | 16 | Real tech stack data |
| **CODE_REVIEW.md** | 39 | 39 | Real GitHub metrics |
| **opsec_vulnerability_assessment.md** | 9 | 9 | Substantive analysis |
| **news_report.md** | 18 | 17 | Recent news coverage |
| **CARD.md** | 25 | 25 | Quick summary cards |

### JSON Data Richness (verified_data.json)

| Field | Projects | Examples |
|-------|----------|----------|
| Team data (founders, etc.) | 18 | monero, zcash, iron-fish, tornado-cash |
| contracts | 1 | tornado-cash |
| milestones | 1 | tornado-cash |
| metrics | 1 | tornado-cash |
| market_data | 1 | monero |
| legal_history | 1 | tornado-cash |
| github_metrics | 1 | monero |

### Per-Project Data Completeness

**Most Complete (6/6 categories):**
- tornado-cash, mask-network, semaphore, hopr

**Well Documented (4-5 categories):**
- iron-fish, zk-money, sienna-network, concordium, fluidkey, circom

**Needs Work (1-2 categories):**
- darkfi, fileverse, findora, iden3, mobilecoin, privatepool, sentinel, starkex, zeal, zkvote

### Key Finding: Data Sync Gap

**Critical Issue:** 18 projects have team data in `verified_data.json` but the `TEAM.md` files are all empty templates. The markdown reports were generated before JSON research was complete and never synced.

**Affected Projects with Team Data in JSON but Template TEAM.md:**
- cake-wallet, circom, concordium, findora, fluidkey, hopr, iron-fish
- mask-network, monero, orchid, oxen, semaphore, tornado-cash
- wasabi-wallet, webb-protocol, xx-network, zcash, zk-money

**Recommendation:** Either:
1. Generate TEAM.md from JSON data automatically
2. Remove template TEAM.md files and rely solely on JSON rendering
3. Manually update TEAM.md files from JSON sources

---

## Appendix B: Key Files

| File | Description |
|------|-------------|
| `RESEARCH_SCOPE_SUMMARY.md` | Project scope and statistics |
| `PR2_DRAFT_WITH_RESEARCH_LINKS.md` | Draft explorer entries |
| `docs/RESEARCH_METHODOLOGY.md` | This document |
| `scripts/generate-site-data.js` | Research site data generator |
| `scripts/convert_verified_data.py` | JSON to YAML converter |
| `deliverables/*/sources/verified_data.json` | Primary research data |

---

*Document created: January 2025*
*Last updated: January 2025*
*Research site: https://cypherpunk-research.benwest.io*
