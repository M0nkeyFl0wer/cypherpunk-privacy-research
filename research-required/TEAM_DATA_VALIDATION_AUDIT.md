# Team Data Validation Audit Report

**Audit Date**: 2026-01-23
**Auditor**: Constitutional Research Process
**Triggered By**: Discovery of fabricated data in Miden TEAM.md (Azeem Khan profile)

---

## Executive Summary

This audit reviewed all TEAM.md files across deliverables to identify:
1. Files with verifiable source URLs
2. Files with claims lacking sources
3. Files with potential errors or fabricated data
4. Empty placeholder files

**Total TEAM.md files reviewed**: 93+ files
**Files with substantial content (>25 lines)**: 13 files
**Confirmed errors found**: 1 (Azeem Khan - FIXED)
**Files requiring additional sourcing**: 5

---

## Confirmed Errors (Fixed)

### 1. Miden - Azeem Khan Profile
**Error Type**: Fabricated background information
**Original Claim**: "Former Meta blockchain team member" with "Expertise in blockchain development"
**Reality**: Business development/communications executive, not engineer
- Co-founder of MorphL2
- Former Partnerships & Fundraising Lead at Gitcoin
- ConsenSys alumni, CoinDesk columnist

**Status**: FIXED - Updated with verified sources (LinkedIn, CoinDesk, The Org, CypherHunter)

---

## Validation Categories

### Category A: Well-Sourced (Direct Verifiable URLs)
These files have direct source links for claims made:

| Project | Source Quality | Sources Included |
|---------|---------------|------------------|
| Tornado Cash | Excellent | DOJ, OFAC, CoinDesk court coverage |
| Bitchat | Excellent | GitHub, Wikipedia, TechCrunch, nadim.computer |
| Signal | Excellent | Wikipedia, ProPublica IRS filings, Signal Blog |
| NYM | Good | Official blog, TechCrunch, Binance Labs |
| Meshtastic | Good | Wikipedia, official docs, community blog |
| Cake Wallet | Good | Official sites, ChangeNow interview, LinkedIn |
| Miden (post-fix) | Good | CoinDesk, BlockBeats, LinkedIn, CypherHunter |
| Confer | Good | TechCrunch, TIME, Gizmodo |

### Category B: Partially Sourced (Claims Need Verification)
These files have some sources but specific claims lack direct verification:

| Project | Issue | Action Required |
|---------|-------|-----------------|
| Zcash | GitHub data solid, but "stepping back" claim for Zooko needs news link | Add news source for governance crisis |
| Monero | GitHub data solid, but MRL researcher backgrounds unverified | Add academic paper links |
| Secret Network | "2,500+ academic citations" claim unverified | Verify via Google Scholar |
| Telegram | Only Wikipedia link, minimal sourcing | Add more news sources |
| ProtonMail | Minimal - just official site and Wikipedia | Add CERN origin documentation |

### Category C: Empty Placeholders (No Team Data)
These files correctly state "Team information not publicly available":

- zkSync
- Oasis Network
- DarkFi
- HOPR
- Iron Fish
- MobileCoin
- Fluidkey
- Firo
- Findora
- Concordium
- Deeper Network
- Elusiv
- Fileverse
- (And 30+ others)

**Note**: Empty placeholders are NOT errors - they correctly indicate research gaps.

---

## Root Cause Analysis

### How the Azeem Khan Error Occurred

1. **Lack of direct source verification**: The profile was written without linking to verifiable sources
2. **Assumption-based filling**: Background was inferred or fabricated rather than verified
3. **No cross-reference check**: LinkedIn and other profiles were not consulted
4. **Missing validation step**: No requirement to include source URLs for each claim

### Why This Is Dangerous

- Damages credibility of entire research project
- Could harm individuals' professional reputations
- Violates constitutional research principles
- Creates legal liability if used for investment decisions

---

## Prevention Measures

### Immediate Changes

1. **Mandatory Source URLs**: Every claim about a person must include a direct source link
2. **Template Update**: Add "Sources Required" section to TEAM.md template
3. **Verification Levels**: Clearly mark each claim as VERIFIED, UNVERIFIED, or PLACEHOLDER

### Validation Protocol

For each team member claim:
```
[ ] LinkedIn profile checked
[ ] GitHub profile checked
[ ] Company website checked
[ ] News sources checked
[ ] Source URL included in file
```

### Warning Signs of Fabricated Data

- Generic descriptions ("expertise in X")
- No source links
- Background that seems "too convenient"
- Missing specific details (dates, companies, roles)

---

## Files Requiring Priority Updates

1. **Secret Network** - Verify citation count claim
2. **Zcash** - Add news sources for governance crisis
3. **Monero** - Add academic paper links for MRL researchers
4. **Telegram** - Expand sourcing
5. **ProtonMail** - Add CERN documentation

---

## Audit Methodology

1. Identified all TEAM.md files via glob pattern
2. Filtered for files with >25 lines (substantial content)
3. Read each file, catalogued:
   - Claims made about individuals
   - Sources provided
   - Verification level
4. Cross-referenced known errors (Azeem Khan)
5. Categorized by source quality

---

## Constitutional Research Reminder

From project guidelines:
- **Evidence Required For**: Ownership claims, conflict of interest, financial connections
- **Forbidden Without Evidence**: "X owns Y" (without records), bold claims without sources
- **Use Instead**: "Ownership should be verified via [registry]", separate "Verified facts" from "To investigate"

This audit enforces these principles for team/personnel data.

---

*This is a living document. Update after each research session that modifies team data.*
