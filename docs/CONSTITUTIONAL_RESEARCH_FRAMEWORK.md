# Constitutional Research Framework v3

*The governing principles and prompt structure for all Web3 Privacy Research*

---

## What Is Constitutional Research?

The Constitutional Research Framework is a **set of inviolable principles** that govern how research is conducted in this project. Like a constitution for a nation, these rules cannot be broken regardless of convenience or time pressure.

The framework emerged from a failed PR submission where fabricated data and unverified claims damaged research credibility. These principles prevent that from happening again.

---

## Core Principles (The "Constitution")

### Article 1: Truth Over Convenience

```
NEVER fabricate, infer, or assume data.
If information cannot be verified, mark it as UNKNOWN.
"No data available" is always preferable to invented data.
```

### Article 2: Source Everything

```
Every claim must have a traceable source.
No source = No claim.
Sources must be specific (URL, document name, timestamp) not vague ("various sources").
```

### Article 3: Confidence Scoring

```
All data points receive a confidence score from 0.0 to 1.0:
- 1.0: Directly from official source, easily verifiable
- 0.8-0.9: Multiple independent sources agree
- 0.6-0.7: Single reliable source
- 0.4-0.5: Secondary source or aged data
- 0.0-0.3: Unverified or questionable

Never present low-confidence data as fact.
```

### Article 4: Temporal Awareness

```
All research is timestamped.
Data older than 90 days should be flagged for review.
Metrics (stars, TVL, users) require refresh dates.
Historical data is labeled as historical.
```

### Article 5: Primary Source Priority

```
Source hierarchy (highest to lowest reliability):
1. Official website, GitHub repository, verified documentation
2. Official social media, press releases
3. Data aggregators (CoinGecko, DeFiLlama, GitHub API)
4. News articles, third-party reviews
5. Community wikis, forums, unverified sources
```

### Article 6: Scope Boundaries

```
Research what exists, not what might exist.
Do not speculate about future features.
Do not assume unstated relationships.
Do not extrapolate from incomplete data.
```

### Article 7: Honest Gap Reporting

```
Document what you COULD NOT find.
Missing data is valuable information.
"Team information not publicly disclosed" tells the reader something important.
Never hide gaps or pretend completeness.
```

---

## Research Prompt Structure

The following prompt template is used when conducting Constitutional Research:

### Phase 1: Project Discovery

```markdown
## Constitutional Research: {PROJECT_NAME}

### Discovery Checklist

1. **Official Website**
   - URL: [to be verified]
   - Status: [active/inactive/parked]
   - Last verified: [date]

2. **GitHub Repository**
   - Organization: [to be verified]
   - Main repo URL: [to be verified]
   - Stars: [number]
   - Last commit: [date]
   - License: [type]

3. **Social Presence**
   - Twitter/X: [handle or "not found"]
   - Discord: [invite or "not found"]
   - Telegram: [handle or "not found"]

4. **Market Data (if applicable)**
   - CoinGecko: [URL or "not listed"]
   - Token symbol: [symbol or "no token"]
```

### Phase 2: Deep Research

```markdown
## Deep Research: {PROJECT_NAME}

### Team & Leadership
- [ ] Check "About" or "Team" page on official site
- [ ] Review GitHub contributors (top 10 by commits)
- [ ] Search LinkedIn for "{project name} founder/CEO"
- [ ] Check Crunchbase for company/funding info
- [ ] Note: Anonymous teams are valid - document this finding

**Findings:**
| Name | Role | Source | Confidence |
|------|------|--------|------------|
| [name] | [role] | [source URL] | [0.0-1.0] |

### Technology & Architecture
- [ ] Locate whitepaper or technical documentation
- [ ] Identify blockchain/network (Ethereum, Cosmos, standalone, etc.)
- [ ] Note privacy technology used (ZKP, MPC, TEE, ring signatures, etc.)
- [ ] Check for smart contract addresses
- [ ] Verify open source status

**Findings:**
| Aspect | Value | Source | Confidence |
|--------|-------|--------|------------|
| Blockchain | [network] | [source] | [0.0-1.0] |
| Privacy tech | [type] | [source] | [0.0-1.0] |
| Open source | [yes/no/partial] | [source] | [0.0-1.0] |

### Security & Audits
- [ ] Search "{project name} audit" on Google
- [ ] Check project docs for audit reports
- [ ] Search common auditors: Trail of Bits, OpenZeppelin, Certik, etc.
- [ ] Check for bug bounty program
- [ ] Note any disclosed vulnerabilities

**Findings:**
| Audit Date | Auditor | Scope | Result | Source |
|------------|---------|-------|--------|--------|
| [date] | [firm] | [scope] | [pass/findings] | [URL] |
```

### Phase 3: Validation & Output

```markdown
## Validation: {PROJECT_NAME}

### Cross-Reference Check
For each major claim, verify with at least 2 sources:

| Claim | Source 1 | Source 2 | Agreement | Final Confidence |
|-------|----------|----------|-----------|------------------|
| [claim] | [url1] | [url2] | [yes/no/partial] | [0.0-1.0] |

### Gap Documentation

**Data we could NOT verify:**
- [ ] List specific information that was sought but not found
- [ ] Explain why (no public info, paywalled, broken links, etc.)

### Final Output Structure

```json
{
  "project_name": "string",
  "research_timestamp": "ISO-8601 datetime",
  "research_method": "constitutional_research_v3",
  "confidence_score": 0.0-1.0,
  "completeness_percentage": 0-100,
  "verified_data": { ... },
  "gaps_and_missing_data": [ ... ],
  "sources": [ ... ]
}
```
```

---

## OSINT Assessment Prompt

For projects receiving OPSEC/OSINT analysis:

```markdown
## OPSEC Vulnerability Assessment: {PROJECT_NAME}

### Methodology
- Non-invasive OSINT only
- No active exploitation or unauthorized access
- Public data sources only

### Data Sources
1. **Shodan** - Infrastructure scanning
   - Query: domain:{domain}
   - Record: ports, services, CVEs

2. **DNS Enumeration**
   - Tool: crt.sh, DNS resolution
   - Record: subdomains, IP addresses, hosting providers

3. **Security Headers**
   - Check: HSTS, CSP, X-Frame-Options, etc.
   - Record: present/absent/value

4. **GitHub Analysis**
   - Organization stats, repository count
   - Contributor data, commit activity

5. **Email Discovery** (Hunter.io, if applicable)
   - Record: count found, patterns

### Output Format

**Research Data Quality Score:** [0.0-1.0]
(This rates OUR confidence in the research, not the project's security)

| Category | Finding | Assessment |
|----------|---------|------------|
| Infrastructure | [finding] | [risk level] |
| Domain Security | [finding] | [risk level] |
| Organizational OPSEC | [finding] | [risk level] |

**Potential Improvements:** (Not "Recommendations" - we assess, not advise)
- [improvement opportunity 1]
- [improvement opportunity 2]
```

---

## Quality Gates

Before any research is marked complete, it must pass these gates:

### Gate 1: No Fabrication
```
Review checklist:
- [ ] Every data point has a specific source
- [ ] No placeholder or template text remains
- [ ] "Unknown" used where data is unavailable
```

### Gate 2: Confidence Verification
```
Review checklist:
- [ ] All confidence scores are justified
- [ ] No 1.0 scores without direct official source
- [ ] Low-confidence items are flagged appropriately
```

### Gate 3: Temporal Integrity
```
Review checklist:
- [ ] Research timestamp is accurate
- [ ] Data refresh dates noted for metrics
- [ ] Historical vs current data distinguished
```

### Gate 4: Gap Honesty
```
Review checklist:
- [ ] Missing data sections are complete
- [ ] Gaps explain WHY data is missing
- [ ] No pretense of completeness where incomplete
```

---

## JSON Schema: constitutional_research.json

Every project contains a `constitutional_research.json` file:

```json
{
  "$schema": "constitutional_research_v3",

  "project_name": "string - official project name",
  "research_timestamp": "ISO-8601 datetime",
  "research_method": "constitutional_research_v3",

  "project_overview": {
    "name": "string",
    "type": "string - e.g., 'Privacy Protocol', 'Encrypted Messenger'",
    "ecosystem": "string - e.g., 'Ethereum', 'Cosmos', 'non-blockchain'",
    "confidence": "number 0.0-1.0"
  },

  "github_data": {
    "organization": "string or null",
    "verified_domains": ["array of verified domains"],
    "followers": "number",
    "key_repositories": [
      {
        "name": "string",
        "description": "string",
        "stars": "number",
        "language": "string"
      }
    ]
  },

  "metadata": {
    "confidence_score": "number 0.0-1.0 - overall research confidence",
    "completeness": "number 0-100 - percentage of fields populated",
    "sources_count": "number - total unique sources used",
    "research_host": "string - local/remote/automated",
    "enhancement_track": "string - research depth level"
  },

  "gaps_and_missing_data": [
    "array of strings describing what could not be verified"
  ],

  "sources": [
    "array of source types or URLs used"
  ],

  "website": "string - verified website URL",
  "website_confidence": "number 0.0-1.0",

  "description": "string - verified project description",
  "description_confidence": "number 0.0-1.0",

  "technical_highlights": {
    "protocol": "string or null",
    "encryption_algorithm": "string or null",
    "key_features": ["array of verified features"],
    "open_source": "boolean",
    "license": "string or null"
  },

  "security_audits": [
    {
      "date": "string YYYY-MM",
      "organization": "string",
      "scope": "string",
      "result": "string"
    }
  ],

  "organization": {
    "name": "string or null",
    "type": "string - e.g., 'LLC', '501(c)(3)', 'DAO', 'Unknown'",
    "founded": "string or null",
    "headquarters": "string or null"
  },

  "timeline": {
    "YYYY-MM-DD or YYYY-MM": "string - milestone description"
  },

  "research_metadata": {
    "constitutional_research_complete": "boolean",
    "web_research_date": "string YYYY-MM-DD",
    "multi_source_verification": "boolean"
  }
}
```

---

## Report File Standards

### TEAM.md
```markdown
# Team & Leadership

*Research Date: YYYY-MM-DD*

## Overview
[Brief description of governance/leadership model]

## Core Contributors
| Contributor | Role | Source | Confidence |
|-------------|------|--------|------------|
| [name] | [role] | [url] | [0.0-1.0] |

## Governance Model
[Description with sources]

## Sources
- [list all sources used]

*Last updated: YYYY-MM-DD*
```

### SECURITY.md
```markdown
# Security & Audits

*Research Date: YYYY-MM-DD*

## Security Overview
[Brief security posture summary]

## Security Audits
| Date | Auditor | Scope | Result | Source |
|------|---------|-------|--------|--------|
| [date] | [firm] | [scope] | [result] | [url] |

## Bug Bounty Program
[Details or "No public bug bounty program found"]

## Known Vulnerabilities
| Date | Issue | Severity | Resolution | Source |
|------|-------|----------|------------|--------|
| [date] | [issue] | [sev] | [resolution] | [url] |

## Sources
- [list all sources]

*Last updated: YYYY-MM-DD*
```

### opsec_vulnerability_assessment.md
```markdown
# {PROJECT} OPSEC & Vulnerability Assessment

**Project:** {name}
**Assessment Date:** YYYY-MM-DD
**Methodology:** Constitutional Research Framework v3
**Research Data Quality:** 0.XX (description of confidence level)

## Executive Summary
[2-3 sentence summary of findings]

**Overall Risk Rating:** [LOW/MEDIUM/HIGH] (for specific context, e.g., "for users requiring X")

## Infrastructure Overview
[Tables and findings]

## Security Analysis
[Findings from OSINT]

## Potential Improvements
[Numbered list - NOT recommendations, just observations]

## Methodology & Sources
[List of tools and data sources used]

*Report generated: YYYY-MM-DD*
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2024-12 | Initial framework |
| v2.0 | 2025-01 | Added confidence scoring, gap reporting |
| v3.0 | 2026-01 | Added OSINT methodology, clarified "Research Data Quality" vs project ratings |

---

## Related Documentation

- [Research Methodology](./RESEARCH_METHODOLOGY.md) - Process and lessons learned
- [Website Methodology Page](/methodology) - Public-facing explanation
- [Gap Analysis](./GAP_ANALYSIS.md) - Known data gaps across all projects

---

*This document governs all research in the Web3 Privacy Research Project.*
*Constitutional principles are non-negotiable.*
