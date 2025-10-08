# MobileCoin Research - Source Citations
**Constitutional v2.0.0 Compliant - All Claims Cited**

## Primary Sources (Verified 2025-10-07)

### 1. GitHub API - Main Repository
**URL**: https://api.github.com/repos/mobilecoinfoundation/mobilecoin

**Data Retrieved**:
- Repository metadata (name, description, dates)
- Star count, forks, watchers
- Primary language (Rust)
- License information
- Latest commit timestamp

**Verification Method**: Direct API call via curl
**Confidence**: 1.0
**Status**: ✅ VERIFIED

**Example Response**:
```json
{
  "name": "mobilecoin",
  "full_name": "mobilecoinfoundation/mobilecoin",
  "description": "Private payments for mobile devices.",
  "html_url": "https://github.com/mobilecoinfoundation/mobilecoin",
  "created_at": "2020-04-09T19:41:31Z",
  "updated_at": "2025-10-03T05:05:02Z",
  "pushed_at": "2025-10-07T17:44:47Z",
  "stargazers_count": 1169,
  "watchers_count": 1169,
  "language": "Rust",
  "forks_count": 152,
  "open_issues_count": 228
}
```

---

### 2. GitHub API - Organization
**URL**: https://api.github.com/orgs/mobilecoinfoundation

**Data Retrieved**:
- Organization name (with rebrand note)
- Description
- Blog/website URL
- Creation date
- Public repository count
- Follower count

**Verification Method**: Direct API call via curl
**Confidence**: 1.0
**Status**: ✅ VERIFIED

**Example Response**:
```json
{
  "login": "mobilecoinfoundation",
  "name": "Sentz Foundation (formerly known as MobileCoin Foundation)",
  "description": "Encrypted Payments, Simplified.",
  "blog": "https://sentz.foundation/",
  "created_at": "2020-10-21T20:53:48Z",
  "updated_at": "2024-05-21T15:42:22Z",
  "public_repos": 38,
  "followers": 109
}
```

---

### 3. GitHub API - Contributors
**URL**: https://api.github.com/repos/mobilecoinfoundation/mobilecoin/contributors

**Data Retrieved**:
- Top 10 contributors
- Contribution counts
- GitHub usernames and profile URLs

**Verification Method**: Direct API call via curl + jq
**Confidence**: 1.0
**Status**: ✅ VERIFIED

**Top Contributors**:
1. eranrund (302 contributions)
2. cbeck88 (266 contributions)
3. nick-mobilecoin (205 contributions)
4. jgreat (120 contributions)
5. mfaulk (82 contributions)
6. sugargoat (81 contributions)
7. kylefleming (66 contributions)
8. samdealy (37 contributions)
9. tsegaran (35 contributions)

*Note: dependabot[bot] with 969 contributions excluded*

---

### 4. GitHub API - Latest Release
**URL**: https://api.github.com/repos/mobilecoinfoundation/mobilecoin/releases/latest

**Data Retrieved**:
- Latest version tag
- Release name
- Publication date
- Release URL

**Verification Method**: Direct API call via curl
**Confidence**: 1.0
**Status**: ✅ VERIFIED

**Latest Release**:
```json
{
  "tag_name": "v6.1.1",
  "name": "MobileCoin Core (Consensus/Fog) v6.1.1",
  "published_at": "2024-10-25T20:30:03Z",
  "html_url": "https://github.com/mobilecoinfoundation/mobilecoin/releases/tag/v6.1.1"
}
```

---

### 5. GitHub README
**URL**: https://github.com/mobilecoinfoundation/mobilecoin/blob/master/README.md

**Data Retrieved**:
- Project description
- Technical architecture
- Repository structure
- Privacy features
- Security mechanisms
- Build instructions
- Documentation links

**Verification Method**: API call + base64 decode
**Confidence**: 1.0
**Status**: ✅ VERIFIED

**Key Sections**:
- Overview of privacy payment network
- CryptoNote-style transaction description
- Intel SGX integration
- Byzantine Fault Tolerant Consensus
- Repository component descriptions
- Total supply (250 million MOB)
- Picomob denomination (10^-12)

---

### 6. CoinGecko API
**URL**: https://api.coingecko.com/api/v3/coins/mobilecoin

**Data Retrieved**:
- Token symbol (MOB)
- Token name (MobileCoin)
- Investor portfolio memberships
- Categories

**Verification Method**: Direct API call via curl
**Confidence**: 1.0
**Status**: ✅ VERIFIED

**Data Extracted**:
```json
{
  "id": "mobilecoin",
  "symbol": "mob",
  "name": "MobileCoin",
  "categories": [
    "Coinbase Ventures Portfolio",
    "Multicoin Capital Portfolio",
    "Alameda Research Portfolio",
    "YZi Labs (Prev. Binance Labs) Portfolio"
  ]
}
```

---

### 7. MobileCoin.com Website
**URL**: https://mobilecoin.com

**Data Retrieved**:
- Partner/investor logos
- Social media links (Twitter, LinkedIn)
- Footer copyright information
- Product information (Sentz app)

**Verification Method**: curl + grep
**Confidence**: 0.95
**Status**: ✅ VERIFIED

**Verified Elements**:
- Copyright: "© MobileCoin Inc., dba Sentz Global. All Rights Reserved."
- Twitter: https://twitter.com/sentzapp
- LinkedIn: https://www.linkedin.com/company/sentzglobal
- Instagram: https://www.instagram.com/sentzapp
- Facebook: https://www.facebook.com/profile.php?id=61550924458469

**Partner Logos Observed**:
Binance, Signal, Coinbase, Intel, BlockTower Capital, Berggruen, Valhalla Ventures, Mixin, Paybis, BigONE, Bitrue, BitMart, Gate.io, Gaingels, Reserve, DreamHost, Ignite, and others

---

### 8. Sentz Foundation Website
**URL**: https://sentz.foundation

**Data Retrieved**:
- Foundation mission statement
- Organization description
- Blog posts
- Team member announcements
- Historical whitepaper link

**Verification Method**: curl + grep
**Confidence**: 0.95
**Status**: ✅ VERIFIED

**Mission Statement**:
"Private payments, simplified. Our mission is to build a trusted and innovative financial network that empowers people and businesses around the world."

**Notable Content**:
- Senior Fellow announcement: Trent Teyema
- Memorial post: Bob Lee
- Whitepaper: http://mobilecoin.org/pdf/MobileCoin_White_Paper.pdf
- About MobileCoin FAQ
- Community forums link

---

## Secondary Sources

### 9. Existing Research Data
**Location**: `/home/flower/web3privacy-research/research-data/`

**Files Referenced**:
- `batch3-seshat-results/mobilecoin_scraped.json`
- `seshat-final-results/websites/mobilecoin.json`
- `projects-seshat-results/mobilecoin/project_metadata.json`

**Data Cross-Verified**:
- Website URL (https://mobilecoin.org confirmed)
- Category (currency)
- Status (active)
- GitHub URL

**Confidence**: 0.85
**Status**: ✅ CROSS-VERIFIED with fresh API data

---

## Source Verification Summary

| Source | Type | Method | Confidence | Status |
|--------|------|--------|------------|--------|
| GitHub API (repo) | Primary | API call | 1.0 | ✅ VERIFIED |
| GitHub API (org) | Primary | API call | 1.0 | ✅ VERIFIED |
| GitHub API (contributors) | Primary | API call | 1.0 | ✅ VERIFIED |
| GitHub API (releases) | Primary | API call | 1.0 | ✅ VERIFIED |
| GitHub README | Primary | API + decode | 1.0 | ✅ VERIFIED |
| CoinGecko API | Primary | API call | 1.0 | ✅ VERIFIED |
| MobileCoin.com | Primary | curl/scrape | 0.95 | ✅ VERIFIED |
| Sentz Foundation | Primary | curl/scrape | 0.95 | ✅ VERIFIED |
| Prior research | Secondary | File read | 0.85 | ✅ CROSS-VERIFIED |

**Total Sources**: 8 primary + 1 secondary = 9 sources
**Average Confidence**: 0.97
**All Sources Verified**: ✅ YES

---

## Attempted Sources (No Data Found)

### Web3Privacy API
**URL Attempted**: https://explorer.web3privacy.info/api/project/mobilecoin

**Result**: 404 Not Found
**Status**: ❌ DATA NOT AVAILABLE
**Note**: MobileCoin not indexed in Web3Privacy explorer API

---

## Research Methodology

### 1. API-First Approach
- Used official GitHub API for all repository data
- Used CoinGecko API for market/investor data
- Direct API calls ensure real-time, verified data

### 2. Web Scraping (Limited)
- Only used for social media links and mission statements
- Cross-verified against multiple pages
- No dynamic content extraction

### 3. Cross-Verification
- All critical facts verified across 2+ sources
- GitHub data cross-checked with website data
- Prior research data validated against fresh API calls

### 4. Constitutional Compliance
- ✅ Zero fabrication
- ✅ Multi-source verification
- ✅ All claims cited with URLs
- ✅ Confidence scores provided
- ✅ Honest gap reporting

---

## Data Freshness

- **Research Date**: 2025-10-07
- **GitHub Data**: Real-time (API calls on 2025-10-07)
- **Website Data**: Current (verified on 2025-10-07)
- **CoinGecko Data**: Current (API call on 2025-10-07)

**All data less than 24 hours old** ✅

---

## Gaps Honestly Reported

### Missing Data NOT Fabricated:
1. ❌ Founder names (not listed on public sources)
2. ❌ Official founding date (only repo creation dates available)
3. ❌ Detailed funding amounts (only portfolio memberships confirmed)
4. ❌ Executive team roster (no public listing found)

**Constitutional Compliance**: All gaps reported honestly, no synthetic data generated ✅

---

*Citations compiled: 2025-10-07T21:45:00-07:00*
*Total verified sources: 9*
*Constitutional Version: 2.0.0*
