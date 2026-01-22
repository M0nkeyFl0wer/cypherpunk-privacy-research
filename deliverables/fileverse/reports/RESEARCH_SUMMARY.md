# Fileverse Research Summary

## Verified Data (Tier 1 - High Confidence)

### Basic Project Information
- **Name:** Fileverse
- **Website:** https://fileverse.io/
- **GitHub:** https://github.com/fileverse (49 public repos)
- **Description:** "Privacy-first workspace & collaboration apps – end-to-end encrypted, decentralized, onchain"
- **Category:** Tooling (collaboration, decentralized-storage, file-sharing, productivity)
- **Status:** Active (last GitHub update: January 2026)
- **Location:** Greece
- **Contact:** hello@fileverse.io

### Team (Verified via GitHub)

**Key Contributors:**
| GitHub | Contributions | Notes |
|--------|---------------|-------|
| @kylengn | 224 | Top contributor |
| @mbj36 | 197 | Core developer |
| @maitrakhatri | 120 | Core developer |
| @Joshua-onwuzu | 62 | Smart contracts |
| @SrishtiLodhi | 38 | Contributor |

**Verified Team Members:**
- Joshua Onwuzu - Smart contract development
- Vijay Krishnavanshi - Development

**Note:** Founders not publicly identified in available sources.

### Funding (Verified)

| Round | Amount | Date | Investors |
|-------|--------|------|-----------|
| Pre-seed | $1.5M | 2022 | Factor (Lead), Balaji Srinivasan, Safe, Gnosis Chain |
| Gitcoin | Multiple rounds | 2022+ | 13,000+ donors |

**Source:** [The Block](https://www.theblock.co/post/305321/fileverse-unveils-google-documents-competitor-ddocs)

### Products (Verified)

| Product | URL | Description |
|---------|-----|-------------|
| dDocs | https://ddocs.new | E2E encrypted Google Docs alternative |
| dSheets | https://dsheets.new | E2E encrypted Google Sheets alternative |
| Portal | https://portal.fileverse.io | Onchain collaboration platform |

---

## Technical Architecture

### Technology Stack
**Frontend:** TypeScript, SCSS, CSS, JavaScript
**Backend:** JavaScript, Node.js
**Smart Contracts:** Solidity, TypeScript (Hardhat, OpenZeppelin v4.8.1)
**Infrastructure:** IPFS, Arweave, Gun.js (real-time), OpenGSN

### Hosting Infrastructure
| Service | Provider | Status |
|---------|----------|--------|
| Main website | Vercel | Clean |
| Backend APIs | Heroku + Cloudflare | Clean |
| CDN | BunnyCDN, Fastly, Cloudflare | Clean |
| Gun nodes | AWS Singapore | **VULNERABILITIES** |
| Blog | Ghost.io | Clean |

### Blockchain Networks
- Ethereum (claimed)
- Gnosis Chain (verified - heartbit services)
- Base (verified - heartbit services)
- Sepolia (testnet)

### Key Repositories
| Repo | Stars | Purpose |
|------|-------|---------|
| fileverse-ddoc | 140 | Main dDocs application |
| fileverse-backend | 43 | Backend services |
| fileverse-dsheet | 34 | dSheets product |
| fileverse-storage | 22 | Storage layer |
| fileverse-cryptography | 10 | E2E encryption |
| zkovery | 8 | ZK account recovery |

---

## Security Assessment

> **DISCLOSURE STATUS: EMBARGOED**
> Vulnerabilities reported to vendor on 2026-01-20.
> Standard 90-day disclosure period ends 2026-04-20.

### Infrastructure Vulnerabilities

| Finding | Severity | Location |
|---------|----------|----------|
| CVE-2023-44487 | HIGH (CVSS 7.5) | Gun nodes |
| CVE-2025-23419 | MEDIUM (CVSS 4.3) | Gun nodes |
| nginx 1.24.0 EOL | MEDIUM | Gun nodes |

**Affected Services:**
- gun-node.fileverse.io (13.213.218.98)
- prod-gun-node.fileverse.io (18.136.133.200)

**Note:** These appear to be legacy Gun.js nodes - dDocs now uses Yjs for real-time sync.

### Security Headers Analysis

| Service | Grade | Issues |
|---------|-------|--------|
| api.fileverse.io | A+ | None |
| apps-storage.fileverse.io | A+ | None |
| rtc.fileverse.io | A | Minor |
| fileverse.io | C | Missing CSP, X-Frame-Options |
| gun-node.fileverse.io | F | No security headers, server exposed |

### Privacy Features (Claimed)

| Feature | Status | Verification |
|---------|--------|--------------|
| E2E Encryption | Claimed | Code exists (fileverse-cryptography) |
| IPFS Storage | Verified | Subdomain infrastructure confirms |
| ZK Recovery | Verified | zkovery repo exists |
| No KYC | Unknown | Requires testing |

---

## OSINT Findings

### Subdomain Discovery
**Total Found:** 63 subdomains via certificate transparency

**Categories:**
- Core Products: fileverse.io, ddocs.new, dsheets.new, portal.fileverse.io
- API/Backend: api, sync, rtc, export, onchain-proxy
- Storage/IPFS: ipfs, apps-storage, apps-ipfs, images
- Indexers: ddocs-indexer, apps-indexer, comments-indexer
- Blockchain: ens, gnosis-chain, base-heartbit, sepolia-heartbit
- Events: devcon, ethdenver, ethereumnyc, ethsf, dappcon

### Infrastructure Map
```
┌─────────────────────────────────────────────────────────────┐
│                    FILEVERSE INFRASTRUCTURE                  │
├─────────────────────────────────────────────────────────────┤
│  Vercel (Frontend)          Heroku (Backend)                │
│  ├── fileverse.io           ├── api.fileverse.io            │
│  ├── ddocs.new              ├── sync.fileverse.io           │
│  └── docs.fileverse.io      ├── rtc.fileverse.io            │
│                             └── apps-storage.fileverse.io   │
│                                                             │
│  AWS Singapore (Gun.js)     CDN Layer                       │
│  ├── gun-node.fileverse.io  ├── Cloudflare                  │
│  └── prod-gun-node [VULNS]  ├── BunnyCDN                    │
│                             └── Fastly                      │
│                                                             │
│  Decentralized              Blockchain                      │
│  ├── IPFS                   ├── Ethereum                    │
│  └── Arweave                ├── Gnosis Chain                │
│                             └── Base                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Endorsements

**Vitalik Buterin (December 2025):**
> "I've been impressed by (decentralized open-source encrypted docs). Every month more bugs get fixed, and recently it's finally at the point where I can comfortably send docs off for comment or collaboration, and things reliably don't break."

---

## Assessment

### Strengths
- 49 public repositories - excellent transparency
- Strong backend security headers (A+ on API services)
- Active development (commits through January 2026)
- Vitalik endorsement adds credibility
- ZK features for account recovery
- Multi-chain support (Ethereum, Gnosis, Base)
- Gitcoin community backing (13,000+ donors)

### Concerns
- Founders not publicly identified
- Legacy Gun nodes have unpatched CVEs
- Main website missing security headers
- Smart contract addresses not publicly documented
- Production networks not fully verified

### Recommendations

**For Users:**
- Suitable for general privacy-conscious document collaboration
- Verify E2E encryption claims before using for sensitive data
- Monitor for security updates

**For Fileverse Team:**
1. **URGENT:** Patch Gun nodes or decommission if unused
2. Add CSP and security headers to main website
3. Publicly document deployed smart contract addresses
4. Add security.txt for vulnerability disclosure

---

## Sources

### Primary
- https://github.com/fileverse
- https://fileverse.io
- https://docs.fileverse.io

### News/Research
- https://www.theblock.co/post/305321/fileverse-unveils-google-documents-competitor-ddocs
- https://fil.org/ecosystem-explorer/fileverse
- https://blog.web3.storage/posts/fileverse-private-file-sharing-collaboration-in-just-a-few-clicks

---

*Research Date: January 2026*
*Methodology: Constitutional Research Framework v3*
*Confidence Score: 0.92*
