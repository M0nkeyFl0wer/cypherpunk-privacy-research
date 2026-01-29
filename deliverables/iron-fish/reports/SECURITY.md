# Security & Audits

*Research Date: 2026-01-28*

---

## Security Audits

### 1. Inversed Tech - Core Protocol (June 2023)
- **Scope:** Protocol design, Rust implementation, ZKP circuits
- **Team:** Daniel Benarroch (ex-QEDIT), Bryan Gillespie (Berkeley PhD), Aurelien Nicolas (Scroll Security Lead)
- **Findings:** 37 total - 33 informational, 4 security concerns (3 critical, 1 warning)
- **Resolution:** All critical findings fixed before mainnet launch (April 20, 2023)
- **Most Significant:** Asset ID Malleability - could break input/output balance invariant
- **Report:** [ironfish-audit-report-FINAL.pdf](https://ironfish-static.s3.amazonaws.com/ironfish-audit-report-FINAL.pdf)

### 2. Trail of Bits - FishHash Algorithm (January 2024)
- **Scope:** FishHash specification, CPU implementations (Rust/C++), memory-hardness, ASIC resistance
- **Duration:** 7 days + fix review (April 2024)
- **Findings:** No practical exploitations, implementations match specification
- **Report:** [FishHash Summary Report](https://ironfish-static.s3.amazonaws.com/%5B202402%5DIron+Fish+FishHash+-+Summary+Report+with+Fix+Review.pdf)

---

## Trusted Setup Ceremony

- **Dates:** February 13 - March 3, 2023
- **Purpose:** Generate proving/verifying keys for zk-SNARKs
- **Security Model:** Multi-party computation - secure if one participant deletes "toxic waste"
- **Participation:** Open to anyone with Iron Fish installed

---

## Bug Bounty Program

### HackerOne (Historical - ended November 2023)
| Severity | Reward |
|----------|--------|
| Low | $1,000 |
| Medium | $2,500 |
| High | $5,000 |
| Critical | $10,000 |

**Current Status:** Replacement program announced but not found publicly.

**Vulnerability Disclosure:** contact@ironfish.network (do not file public GitHub issues)

---

## Known Incidents

**None found.** Asset ID Malleability vulnerability was discovered and fixed during pre-mainnet audit.

---

## Security Assessment

| Aspect | Rating |
|--------|--------|
| Protocol Audit | Complete (Inversed Tech) |
| Mining Audit | Complete (Trail of Bits) |
| Trusted Setup | Community participated |
| Bug Bounty | Transitioning |
| Known Exploits | None |

**Overall:** Strong security posture. Two professional audits from reputable firms. Critical vulnerabilities fixed before mainnet. One of the longest-running testnets before launch.

---

## Sources

- [Iron Fish Audit Blog](https://ironfish.network/learn/blog/2023-08-11-audit)
- [FishHash Audit Blog](https://ironfish.network/learn/blog/2024-05-14-fish-hash-audit)
- [Inversed Tech Audit PDF](https://ironfish-static.s3.amazonaws.com/ironfish-audit-report-FINAL.pdf)
- [Trail of Bits FishHash PDF](https://ironfish-static.s3.amazonaws.com/%5B202402%5DIron+Fish+FishHash+-+Summary+Report+with+Fix+Review.pdf)
- [HackerOne Program](https://hackerone.com/iron_fish_bbp)
