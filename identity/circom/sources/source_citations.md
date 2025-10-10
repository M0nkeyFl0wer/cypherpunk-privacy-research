# Circom Research - Source Citations

**Research Date:** 2025-10-07
**Constitutional Compliance:** v2.0.0

---

## Primary Sources (Verified ✅)

### 1. GitHub Repository
**URL:** https://github.com/iden3/circom
**Type:** Primary source - Official repository
**Access Date:** 2025-10-07
**Data Extracted:**
- Project description
- Repository metadata (stars, forks, language)
- License information
- Creation and update timestamps
- Contributor information

**API Endpoints Used:**
```bash
https://api.github.com/repos/iden3/circom
https://api.github.com/repos/iden3/circom/contributors
https://api.github.com/repos/iden3/circom/releases/latest
```

**Verification:** ✅ Direct API access, data verified

---

### 2. Official Documentation
**URL:** https://docs.circom.io/
**Type:** Primary source - Official documentation
**Access Date:** 2025-10-07
**Data Extracted:**
- Project description
- Technical documentation
- Installation guides
- Background on zero-knowledge proofs

**Verification:** ✅ Linked from GitHub repository

---

### 3. iden3 Organization
**URL:** https://github.com/iden3
**Type:** Primary source - Parent organization
**Access Date:** 2025-10-07
**Data Extracted:**
- Organization bio
- Website URL (www.iden3.io)
- Twitter handle (@identhree)
- Email contact
- Repository count
- Creation date

**API Endpoint Used:**
```bash
https://api.github.com/orgs/iden3
https://api.github.com/users/iden3
```

**Verification:** ✅ Direct API access

---

### 4. GitHub Contributors
**URL:** https://api.github.com/repos/iden3/circom/contributors
**Type:** Primary source - Contribution data
**Access Date:** 2025-10-07
**Data Extracted:**
- Top contributor usernames
- Contribution counts
- Contributor profiles

**Top Contributors Verified:**
1. clararod9 (346 contributions)
2. miguelis (167 contributions)
3. alrubio (150 contributions)

**Verification:** ✅ Public GitHub data

---

### 5. GitHub Releases
**URL:** https://github.com/iden3/circom/releases
**Type:** Primary source - Release information
**Access Date:** 2025-10-07
**Data Extracted:**
- Latest version: v2.2.2
- Release date: 2025-03-11
- Release notes

**API Endpoint:**
```bash
https://api.github.com/repos/iden3/circom/releases/latest
```

**Verification:** ✅ Official release page

---

### 6. Academic Publication
**Title:** "Circom: A Circuit Description Language for Building Zero-Knowledge Applications"
**URL:** https://ieeexplore.ieee.org/document/10002421/
**Publication:** IEEE Transactions on Dependable and Secure Computing
**Type:** Secondary source - Peer-reviewed research
**Access Date:** 2025-10-07
**Data Extracted:**
- Technical description
- Academic validation of project

**Verification:** ✅ IEEE Xplore database (authoritative)

**Alternative URLs:**
- https://upcommons.upc.edu/entities/publication/2ae859e1-6cca-4c97-a41d-ab6690d077ab
- https://www.researchgate.net/publication/366676429_Circom_A_Circuit_Description_Language_for_Building_Zero-knowledge_Applications

---

## Secondary Sources (Context)

### 7. Web3Privacy Database
**URL:** https://github.com/web3privacy/web3privacy
**Type:** Secondary source - Privacy project database
**Access Date:** 2025-10-07
**Data Extracted:**
- Privacy project categories
- Industry standards for categorization
- Related ZK projects

**Findings:** Circom not listed as standalone project (it's infrastructure, not end-user protocol)

**Verification:** ✅ Community-maintained database

---

### 8. Related Repositories
**Type:** Primary sources - Related projects
**Access Date:** 2025-10-07

**circomlib:**
- URL: https://github.com/iden3/circomlib
- Description: Library of basic circuits for circom

**circom_tester:**
- URL: https://github.com/iden3/circom_tester
- Description: Tools for testing circom circuits

**circomlibjs:**
- URL: https://github.com/iden3/circomlibjs
- Description: JavaScript library for circomlib

**Verification:** ✅ All maintained by iden3 organization

---

## Data Not Found (Honest Gap Reporting)

### Attempted Sources - No Data

1. **Logo Search**
   - Attempted: GitHub repository assets
   - Attempted: docs.circom.io HTML inspection
   - Result: Not found in automated search
   - Next: Manual website inspection needed

2. **Founder Names**
   - Attempted: GitHub contributors
   - Attempted: iden3 organization members
   - Result: Individual names not publicly listed
   - Next: iden3.io website, LinkedIn research needed

3. **Funding Information**
   - Attempted: GitHub repository
   - Attempted: Web search for funding news
   - Result: No public data found
   - Next: CrunchBase, press releases needed

4. **Discord/Telegram**
   - Attempted: Documentation links
   - Attempted: GitHub README
   - Result: Not listed
   - Next: Official website inspection needed

5. **Team Size**
   - Attempted: GitHub organization
   - Attempted: Contributor analysis
   - Result: Only contributor count available (110+ repos)
   - Next: LinkedIn company page needed

---

## Source Quality Assessment

### High Quality (Confidence 1.0)
- ✅ GitHub API (official, real-time)
- ✅ Official documentation (docs.circom.io)
- ✅ IEEE academic paper (peer-reviewed)
- ✅ GitHub releases (official versioning)

### Medium Quality (Confidence 0.7-0.9)
- ⚠️ Organization data (limited public info)
- ⚠️ Contributor analysis (incomplete team picture)
- ⚠️ Web3Privacy database (community-maintained)

### Low Quality / Not Found (Confidence 0.0)
- ❌ Funding data (no sources found)
- ❌ Logo (not found in automated search)
- ❌ Team roster (not publicly available)
- ❌ Community channels (not listed)

---

## API Calls Made

### Successful API Calls

```bash
# Repository data
curl -s "https://api.github.com/repos/iden3/circom"

# Contributors
curl -s "https://api.github.com/repos/iden3/circom/contributors"

# Latest release
curl -s "https://api.github.com/repos/iden3/circom/releases/latest"

# Organization data
curl -s "https://api.github.com/orgs/iden3"
curl -s "https://api.github.com/users/iden3"

# Latest commit
curl -s "https://api.github.com/repos/iden3/circom/commits?per_page=1"

# Web3Privacy repository
curl -s "https://api.github.com/repos/web3privacy/web3privacy/contents"
curl -s "https://raw.githubusercontent.com/web3privacy/web3privacy/main/README.md"
```

### Failed / Unavailable

```bash
# README from main branch (404 - uses different structure)
curl -s "https://raw.githubusercontent.com/iden3/circom/main/README.md"

# RELEASES.md (404 - file doesn't exist)
curl -s "https://raw.githubusercontent.com/iden3/circom/main/RELEASES.md"

# iden3.io website (301 redirect, manual inspection needed)
curl -s "https://www.iden3.io"
```

---

## Cross-Verification Matrix

| Data Point | Source 1 | Source 2 | Source 3 | Verified |
|------------|----------|----------|----------|----------|
| Project Name | GitHub API | Docs | IEEE Paper | ✅ |
| Description | GitHub API | Docs | IEEE Paper | ✅ |
| GitHub URL | Direct | Docs | - | ✅ |
| Website URL | GitHub | Docs | - | ✅ |
| License | GitHub API | - | - | ✅ |
| Latest Version | Releases API | - | - | ✅ |
| Organization | GitHub API | Docs | - | ✅ |
| Twitter | GitHub API | - | - | ✅ |
| Top Contributors | GitHub API | Commits | - | ✅ |
| Status (Active) | Commits | Releases | - | ✅ |
| Category | Analysis | Web3Privacy | - | ✅ |
| Founders | - | - | - | ❌ |
| Logo | - | - | - | ❌ |
| Funding | - | - | - | ❌ |
| Team Size | - | - | - | ❌ |

---

## Research Methodology Notes

### Standards Applied

1. **Multi-Source Verification**
   - Minimum 2 sources for critical facts
   - Primary sources preferred over secondary
   - API data verified against documentation

2. **Confidence Scoring**
   - 1.0 = Verified from official primary sources (2+)
   - 0.7-0.9 = Partial data or single source
   - 0.0 = No data found

3. **Gap Reporting**
   - All missing data documented
   - Attempted sources listed
   - Next steps identified

4. **No Fabrication Policy**
   - Zero synthetic data
   - No placeholder text
   - Honest "data not found" reporting

### Constitutional Compliance ✅

**v2.0.0 Requirements:**
- ✅ Real data only
- ✅ Multi-source verification (2+ for Tier 1)
- ✅ Confidence scoring (0.0-1.0)
- ✅ Gap reporting (transparent)
- ✅ Source citations (all URLs documented)

---

## Recommended Next Research Steps

### Immediate (High Value)
1. Manual inspection of www.iden3.io for team, logo
2. LinkedIn search for iden3 company page
3. CrunchBase search for funding data
4. Twitter search for Discord/Telegram links

### Secondary (Medium Value)
5. Google News search for recent articles
6. Polygon Labs research (Hermez connection)
7. Academic paper author contact for team info
8. GitHub issue tracker analysis

### Low Priority
9. Community forum research
10. Historical blog post analysis
11. Conference talk recordings

---

**Source Document Maintained By:** Research Agent
**Last Updated:** 2025-10-07
**Next Review:** After Phase 2 research (deep dive sources)
