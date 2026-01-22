# Security & Audits

*Research Date: 2026-01-22*

---

## Security Overview

Monero has a **strong security track record** with continuous cryptographic research, multiple code audits, and active bug bounty programs. The Monero Research Lab (MRL) provides ongoing academic-grade security analysis.

---

## Security Audits

### Formal Audits

| Date | Auditor | Scope | Result |
|------|---------|-------|--------|
| 2017 | Kudelski Security | Bulletproofs implementation | Passed with recommendations |
| 2018 | Kudelski Security | RingCT + protocol review | Passed |
| 2020 | JP Aumasson (Teserakt) | Bulletproofs+ | Passed |
| 2020 | Trail of Bits | Triptych (research) | Academic review |
| Ongoing | MRL | Protocol cryptography | Continuous |

### Monero Research Lab (MRL) Papers

Academic-style security research published by MRL:

| Paper | Topic | Status |
|-------|-------|--------|
| MRL-0001 | A Note on Chain Reactions | Published |
| MRL-0002 | Counterfeiting via Merkle Tree | Published |
| MRL-0003 | Monero is Not That Mysterious | Published |
| MRL-0004 | Improving Obfuscation | Published |
| MRL-0005 | Ring Signature Confidential Transactions | Published |
| MRL-0006 | An Efficient Implementation of Monero Subaddresses | Published |
| MRL-0007 | Spending Output Selection | Published |
| MRL-0008 | Dual Linkable Ring Signatures (DLRS) | Published |
| MRL-0009 | Thring Signatures | Published |
| MRL-0010 | Triptych Signatures | Published |

Full list: https://www.getmonero.org/resources/research-lab/

---

## Bug Bounty Program

### HackerOne Program

- **Platform**: HackerOne
- **URL**: https://hackerone.com/monero
- **Status**: Active
- **Scope**: Core protocol, wallet, daemon

### Rewards

| Severity | Reward Range |
|----------|--------------|
| Critical | Up to $10,000+ |
| High | $1,000 - $5,000 |
| Medium | $500 - $1,000 |
| Low | $100 - $500 |

Rewards paid in XMR from community donations.

---

## Known Vulnerabilities & Responses

### Historical Issues (Resolved)

| Year | Issue | Severity | Resolution |
|------|-------|----------|------------|
| 2017 | Burning bug (hidden inflation) | Critical | Patched, no exploitation |
| 2018 | Key image reuse detection | Medium | Protocol hardening |
| 2019 | Output selection bias | Medium | Improved decoy selection |
| 2020 | CLSAG side-channel | Low | Fixed in implementation |
| 2021 | Decoy selection fingerprinting | Medium | Research-based improvements |

### Responsible Disclosure

Monero maintains a responsible disclosure process:
- security@getmonero.org
- HackerOne program
- 90-day disclosure timeline
- Coordinated with researchers

---

## Privacy Technology Security

### Ring Signatures

| Parameter | Current Value | Security Implication |
|-----------|---------------|---------------------|
| Ring size | 16 (mandatory) | 1-in-16 anonymity set per transaction |
| Decoy selection | Gamma distribution | Prevents timing analysis |

### RingCT (Confidential Transactions)

- Hides transaction amounts
- Based on Pedersen commitments
- Bulletproofs+ for efficient range proofs

### Stealth Addresses

- One-time addresses per transaction
- Prevents address linking
- Dual-key system (view key + spend key)

---

## Upcoming Security Improvements

### FCMP++ (Full-Chain Membership Proofs)

- Eliminates ring signatures entirely
- Full anonymity set (all outputs ever created)
- Based on Curve Trees research
- Expected: 2025-2026

### Seraphis

- Next-generation transaction protocol
- Improved address system (Jamtis)
- Better multisig support
- Long-term roadmap

---

## Security Comparison

| Feature | Monero | Bitcoin | Zcash |
|---------|--------|---------|-------|
| Amount hiding | Always (RingCT) | Never | Optional (shielded) |
| Sender hiding | Always (ring sigs) | Never | Optional |
| Receiver hiding | Always (stealth) | Never | Optional |
| Mandatory privacy | Yes | No | No |
| Audit trail | None | Full | Optional |

---

## Security Contacts

- **Security Email**: security@getmonero.org
- **HackerOne**: https://hackerone.com/monero
- **PGP Key**: Available on getmonero.org
- **Dev Chat**: #monero-dev on Matrix/IRC

---

## Sources

- Monero Research Lab papers
- HackerOne program
- GetMonero.org security documentation
- Historical vulnerability disclosures
- Kudelski Security audit reports

*Last updated: 2026-01-22*
