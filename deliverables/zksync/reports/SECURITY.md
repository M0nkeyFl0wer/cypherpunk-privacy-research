# Security & Audits

*Research Date: 2026-01-28*

## Overview

zkSync Era has undergone extensive security auditing through a multi-layered approach combining internal audits, external audits from reputable firms, and public competitive audit contests. Since 2022, OpenZeppelin has provided continuous security coverage for Matter Labs, with 819 issues found across 48 comprehensive audits.

---

## Security Audits

### OpenZeppelin Audits (Ongoing Partnership since 2022)

| Date | Audit Name | Status |
|------|-----------|--------|
| 2025-06 | V29 Release Audit | Completed |
| 2025-04 | ZKsync Crypto Precompiles Audit | Completed |
| 2025-04 | Protocol Precompiles Implementation | Completed |
| 2025-04 | Era Contracts Precompile Audit | Completed |
| 2025-04 | SSO Account OIDC Recovery Solidity Audit | Completed |
| 2025-03 | Protocol Precompiles Implementation | Completed |
| 2025-02 | ZKsync Paymaster Audit | Completed |
| 2025-02 | ZK Token, Capped Minter, Merkle Distributor Audit | Completed |
| 2025-02 | Distributor Diff Audit | Completed |
| 2024-06 | Layer 1 Governance Diff Audit | Completed |
| 2024-06 | Protocol Defense Audit | Completed |
| 2022-11-28 to 2022-12-23 | Layer 2 Bootloader | Completed |
| 2022-11-21 to 2022-11-25 | Layer 1 Diff Audit (Upgrade Audit) | Completed |
| 2022-09-05 to 2022-09-30 | Layer 1 Smart Contracts | 0 Critical Issues |

**Partnership Results:**
- $1B+ total value secured
- Zero major security incidents despite rapid innovation
- 819 issues found across 48 audits

Source: [OpenZeppelin zkSync Partnership](https://www.openzeppelin.com/customer-stories/zksync)

### Halborn Security Audits

| Date | Audit Name | Duration | Status |
|------|-----------|----------|--------|
| 2023-01-09 to 2023-03-08 | ZK Proof System (Circuits & Verifier) | 2 months | Issues Resolved |
| 2023-07-12 to 2023-07-20 | Verifier Smart Contract | 8 days | Completed |
| 2023-10-02 to 2023-10-04 | Verifier Update (Aggregation Optionality) | 3 days | Completed |

**ZK Circuits Audit Key Finding:**
- STORAGE QUERIES FILTER circuit had a key generation issue where `shard_id` bits overlapped with `address` bits, causing incorrect ordering
- **Resolution:** SOLVED - Fixed offset and added assertion (Commit: 5109e0768c7de799f87ec67bf40b6a544cca4e4e)

Source: [Halborn zkSync Era Circuits Audit Report (PDF)](https://github.com/HalbornSecurity/PublicReports/blob/master/ZK%20Audits/MatterLabs_zkSync_Era_Circuits_Zero_Knowledge_Security_Audit_Report_Halborn_Final..pdf)

### Spearbit Security Review

| Date | Audit Name | Status |
|------|-----------|--------|
| 2025-03-22 to 2025-04-08 | ZKsync Protocol Security Review | Completed |
| 2023-11 | SNARK Wrapper Audit | Completed |

Source: [Spearbit/Cantina zkSync Case Study](https://cantina.mirror.xyz/JJH2l-X6iQA79ogiAdSW3fILyBC0AYvEsQCR3vzlQf8)

### Public Competitive Audits

#### Code4rena - zkSync Era (March 2024)
- **Duration:** March 7-28, 2024 (21 days)
- **Prize Pool:** $250,000 USDC
- **Scope:** 114 contracts, 10,663 SLoC

**Findings:**
| Severity | Count | Description |
|----------|-------|-------------|
| High | 1 | Paymaster refund calculation error - `postTransaction` callback receives inflated `_maxRefundedGas` that fails to subtract `spentOnPubdata` |
| Medium | 4 | Including: frozen chain cannot be unfrozen (typo bug), missing legacy bridge assignment, STM cannot force upgrade, potential double withdrawal during migration |
| Low/NC | 54+ | Documentation inconsistencies, gas optimizations, best practice deviations |

Source: [Code4rena zkSync Era Report](https://code4rena.com/reports/2024-03-zksync)

#### CodeHawks - zkSync Era (October-December 2024)
- **Duration:** October 28 - December 2, 2024
- **Prize Pool:** $500,000 USDC
- **Scope:** 15,741 nSLOC
- **Type:** Private, KYC-required contest
- **Status:** Complete, findings private

Source: [CodeHawks zkSync Era Contest](https://codehawks.cyfrin.io/c/2024-10-zksync)

### Secure3 Audit

- **Scope:** zkSync 2.0 Layer-1 building blocks
- **Duration:** Three-week audit contest
- **Result:** All findings fixed, zero critical issues found
- **Methodology:** Competition and cross-validation approach

Source: [Secure3 zkSync Audit Medium Post](https://medium.com/@Secure3/matter-labs-reveals-results-of-secure3s-second-zksync-2-0-security-audit-4508f2535817)

---

## Bug Bounty Programs

zkSync maintains multiple bug bounty programs on Immunefi:

### zkSync Era Bug Bounty
| Severity | Reward |
|----------|--------|
| Critical (Smart Contracts) | Up to $1,100,000 (min $100,000) |
| High (Smart Contracts) | $20,000 - $50,000 |
| Medium (Smart Contracts) | $5,000 |
| Low (Smart Contracts) | $1,000 |
| Critical (Blockchain/DLT) | $50,000 |
| High (Blockchain/DLT) | $15,000 |
| Critical (Web/Apps) | $20,000 |
| High (Web/Apps) | $5,000 |

**Critical Reward Calculation:** 10% of funds directly affected, up to $1,100,000 maximum with $100,000 floor.

**Program Details:**
- 92 assets in scope including core contracts, system contracts, L1 bridges, governance, and ZK proof circuits
- Proof of Concept required for all severity levels
- KYC required for payout
- Primacy of Impact model - impact validity determines eligibility

Source: [Immunefi zkSync Era Bug Bounty](https://immunefi.com/bug-bounty/zksyncera/)

### zkSync Lite Bug Bounty
- **Maximum Reward:** $2,300,000
- **Scope:** Smart contracts, ZK-SNARK circuits, web/app

Source: [Immunefi zkSync Lite Bug Bounty](https://immunefi.com/bug-bounty/zksync/)

### ZKsync OS Bug Bounty
- **Maximum Reward:** $100,000
- **Scope:** EVM execution layer compiled to RISC-V

Source: [Immunefi ZKsync OS Bug Bounty](https://immunefi.com/bug-bounty/zksync-os/)

---

## Known Incidents

### April 2025: Airdrop Admin Account Compromise

**Date:** April 15, 2025

**Impact:** ~$5 million (111 million ZK tokens)

**What Happened:**
- Attacker exploited compromised administrative credentials for an airdrop contract
- Used `sweepUnclaimed()` function to mint unclaimed ZK tokens from three airdrop distribution contracts
- ZK token price dropped nearly 20% to all-time low of $0.041

**What Was NOT Affected:**
- Core ZKSync protocol
- ZK token contract
- User funds

**Resolution:**
- Attacker accepted 10% bounty under safe harbor deal
- Returned 90% of stolen assets (~$5.7 million) by April 23, 2025
- Recovered: 44.6 million ZK tokens + ~1,800 ETH
- Assets now under ZKsync Security Council custody
- Compromised admin keys invalidated

**Response:**
- Worked with SEAL 911 (Security Alliance) for incident response
- Coordinated with exchanges to track stolen funds
- zkSync co-founder Alex Gluchowski confirmed no code flaw - purely operational key compromise

**Security Lessons:**
- Private key management remains critical vulnerability vector
- Multi-signature or MPC wallets recommended for privileged accounts
- Operational security as important as smart contract security

Sources:
- [Decrypt: ZKsync Hacker Returns Funds](https://decrypt.co/316099/zksync-hacker-accepts-bounty-returns-nearly-5m-in-stolen-crypto)
- [Halborn: zkSync Hack Explained](https://www.halborn.com/blog/post/explained-the-zksync-hack-april-2025)
- [The Block: ZKsync $5M Attack](https://www.theblock.co/post/350839/zksync-discloses-5-million-attack-compromised-airdrop-contract-admin-account)

### July 2025: Proof System Vulnerability

**Date:** July 30, 2025

**Status:** Proof system manually paused due to vulnerability

**Impact:** Partial liveness failure (proofs paused, but protocol still operational)

Source: [L2BEAT zkSync Era](https://l2beat.com/scaling/projects/zksync-era)

---

## ZK Proof System Security

### Architecture
- **Current System:** Boojum - STARK-powered proof system that wraps into SNARKs
- **Previous System:** PLONK-based SNARKs
- **Execution Delay:** 3 hours for proof verification
- **Hardware:** Capable of running on consumer-grade GPU hardware

### Components Audited
- Zero-knowledge circuits (by Halborn)
- Verifier smart contracts (by Halborn, OpenZeppelin)
- Crypto precompiles (by OpenZeppelin)
- SNARK wrapper (by Spearbit)

### Boojum Crate Security
The boojum crate covers:
- Circuit-based BN256 operations
- Affine and projective curve arithmetic
- Tower field extensions
- Non-native field arithmetic
- Pairing computations for zk-SNARK proof generation

Source: [zkSync Boojum Documentation](https://docs.zksync.io/zk-stack/components/prover/boojum-gadgets)

---

## Security Assessment

### Strengths

1. **Extensive Audit Coverage:** 48+ audits across multiple firms (OpenZeppelin, Halborn, Spearbit, Secure3, Code4rena, CodeHawks)
2. **Long-term Security Partnership:** Continuous OpenZeppelin engagement since 2022
3. **Multi-layered Approach:** Internal audits, external audits, public contests
4. **Comprehensive Bug Bounty:** Up to $1.1M for critical vulnerabilities
5. **Transparent Incident Response:** Quick disclosure and resolution of April 2025 incident
6. **Code Quality:** Auditors consistently note well-written and documented codebase

### Risk Factors (per L2BEAT Assessment)

1. **Stage 0 Classification:** Does not yet meet Stage 1 security requirements
2. **Operator Censorship:** Sequencers can stop processing queue entirely
3. **No Exit Window:** Central operator can censor withdrawals via TransactionFilterer
4. **Proposer Centralization:** Only whitelisted proposers can publish state roots
5. **Token Concentration:** ZK token represents 55.3% of total value secured
6. **Proof System Pause:** Currently manually paused due to vulnerability (July 2025)

### Overall Assessment

zkSync Era demonstrates strong commitment to security through its comprehensive audit program and transparent incident handling. The protocol has achieved $1B+ TVL with zero major smart contract exploits - the April 2025 incident was an operational security failure (key compromise) rather than a protocol vulnerability.

However, the protocol remains in "alpha state" with several centralization risks flagged by L2BEAT. Users should be aware that:
- The proof system has experienced a vulnerability requiring manual pause
- Operator permissions allow potential censorship
- The system does not yet meet Stage 1 decentralization requirements

Source: [L2BEAT zkSync Era Risk Assessment](https://l2beat.com/scaling/projects/zksync-era)

---

## Sources

### Official Documentation
- [zkSync Audits Documentation](https://docs.zksync.io/zksync-protocol/security/audits)
- [zkSync Bug Bounty Documentation](https://docs.zksync.io/zksync-protocol/security/bug-bounty)
- [zkSync Boojum Announcement](https://zksync.mirror.xyz/HJ2Pj45EJkRdt5Pau-ZXwkV2ctPx8qFL19STM5jdYhc)

### Audit Reports
- [Code4rena zkSync Era Report (March 2024)](https://code4rena.com/reports/2024-03-zksync)
- [CodeHawks zkSync Era Contest](https://codehawks.cyfrin.io/c/2024-10-zksync)
- [Halborn ZK Circuits Audit (GitHub PDF)](https://github.com/HalbornSecurity/PublicReports/blob/master/ZK%20Audits/MatterLabs_zkSync_Era_Circuits_Zero_Knowledge_Security_Audit_Report_Halborn_Final..pdf)
- [OpenZeppelin V29 Release Audit](https://www.openzeppelin.com/news/matterlabs-v.29-release-audit)
- [OpenZeppelin zkSync Customer Story](https://www.openzeppelin.com/customer-stories/zksync)
- [Matter Labs Audits GitHub Repository](https://github.com/matter-labs-audits/reports)

### Bug Bounty Programs
- [Immunefi zkSync Era](https://immunefi.com/bug-bounty/zksyncera/)
- [Immunefi zkSync Lite](https://immunefi.com/bug-bounty/zksync/)
- [Immunefi ZKsync OS](https://immunefi.com/bug-bounty/zksync-os/)

### Risk Assessment
- [L2BEAT zkSync Era](https://l2beat.com/scaling/projects/zksync-era)

### Incident Reports
- [Decrypt: Hacker Returns Funds](https://decrypt.co/316099/zksync-hacker-accepts-bounty-returns-nearly-5m-in-stolen-crypto)
- [Halborn: April 2025 Exploit Explained](https://www.halborn.com/blog/post/explained-the-zksync-hack-april-2025)
- [The Block: $5M Attack Disclosure](https://www.theblock.co/post/350839/zksync-discloses-5-million-attack-compromised-airdrop-contract-admin-account)
- [Blockworks: Token Theft](https://blockworks.co/news/zksync-hack-tokens-stolen)
