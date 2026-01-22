# Security & Audits

*Research Date: 2026-01-22*

---

## Security Overview

Zcash has undergone **extensive professional security audits** due to its corporate backing and the complexity of zk-SNARK cryptography. The Electric Coin Company (ECC) has invested significantly in third-party security reviews.

---

## Security Audits

### Major Audits

| Date | Auditor | Scope | Result |
|------|---------|-------|--------|
| 2016 | NCC Group | Initial launch code | Passed |
| 2016 | Coinspect | Protocol & implementation | Passed |
| 2018 | NCC Group | Sapling upgrade | Passed with findings |
| 2019 | Trail of Bits | Sapling cryptography | Passed |
| 2020 | Least Authority | Zebra (Zcash Foundation) | Passed |
| 2021 | NCC Group | Orchard (NU5) | Passed |
| 2022 | Trail of Bits | librustzcash | Passed |
| Ongoing | ECC Internal | Protocol research | Continuous |

### Audit Reports (Public)

- NCC Group Sapling audit: https://research.nccgroup.com/
- Trail of Bits reports: https://github.com/trailofbits/publications
- Least Authority Zebra audit: https://leastauthority.com/

---

## Bug Bounty Program

### HackerOne Program

- **Platform**: HackerOne
- **URL**: https://hackerone.com/zcash
- **Status**: Active
- **Managed by**: Electric Coin Company

### Rewards

| Severity | Reward Range |
|----------|--------------|
| Critical | Up to $100,000 |
| High | $10,000 - $50,000 |
| Medium | $1,000 - $10,000 |
| Low | $500 - $1,000 |

Zcash's bug bounty is one of the most generous in cryptocurrency.

---

## Known Vulnerabilities & Responses

### Historical Issues (Resolved)

| Year | Issue | Severity | Resolution |
|------|-------|----------|------------|
| 2018 | InternalH collision (Sapling) | Critical | Fixed before exploit |
| 2019 | Counterfeiting vulnerability | Critical | Patched, disclosed responsibly |
| 2020 | Transparent pool leakage | Medium | User education |
| 2021 | Sprout to Sapling migration | Low | Migration guidance |

### The 2019 Counterfeiting Bug

The most significant Zcash vulnerability:
- Discovered internally by ECC cryptographer
- Would have allowed infinite hidden inflation
- Fixed silently, disclosed after network upgrade
- No evidence of exploitation
- Highlighted trusted setup risks

---

## Privacy Technology Security

### zk-SNARKs

| Component | Current Implementation | Security Notes |
|-----------|----------------------|----------------|
| Proof System | Groth16 → Halo2 | Halo2 eliminates trusted setup |
| Proving Key | Powers of Tau ceremony | Multi-party computation |
| Circuit | Orchard (current) | Replaces Sprout, Sapling |

### Shielded Pools

| Pool | Status | Technology |
|------|--------|------------|
| Sprout | Deprecated | Original zk-SNARKs |
| Sapling | Active | Improved efficiency |
| Orchard | Active (NU5+) | Halo2, no trusted setup |

### Trusted Setup Ceremony

**Powers of Tau** (2017-2018):
- 87 participants
- If ANY participant destroyed their toxic waste, setup is secure
- Participants included Vitalik Buterin, cryptographers worldwide
- Orchard (Halo2) eliminates need for trusted setup

---

## Security Architecture

### Privacy Model (Opt-in)

| Pool Type | Privacy | Usage |
|-----------|---------|-------|
| Transparent (t-addr) | None (like Bitcoin) | ~95% historically |
| Shielded (z-addr) | Full | ~5% (growing) |

**Note**: Unlike Monero, Zcash privacy is optional. Most transactions remain transparent, reducing overall anonymity set.

### View Keys

- Allows selective disclosure to auditors
- Compliance-friendly design
- Controversial in privacy community

---

## Upcoming Security Improvements

### Zcash Posterity Fund (ZPF)

New funding mechanism to ensure long-term security maintenance.

### Crosslink

- Proof-of-Stake sidechain proposal
- Would change consensus model
- Security implications under research

### Tachyon

- Asynchronous transaction processing
- Improved scalability
- Under development

---

## Regulatory & Compliance

### Exchange Delisting Risk

Unlike Monero, Zcash maintains exchange listings due to:
- Optional privacy (transparent addresses available)
- View key compliance capability
- Corporate governance (known leadership)

### Compliance Features

| Feature | Purpose |
|---------|---------|
| View keys | Auditor access to transaction history |
| Transparent addresses | Optional full transparency |
| Known leadership | Regulatory engagement possible |

---

## Security Comparison

| Feature | Zcash | Monero | Bitcoin |
|---------|-------|--------|---------|
| Cryptographic basis | zk-SNARKs | Ring signatures | ECDSA |
| Privacy default | No | Yes | No |
| Trusted setup | Historical (Sprout/Sapling) | None | None |
| Proof verification | Fast | Fast | Fast |
| Quantum resistance | Partial | Limited | None |
| Audit capability | View keys | None | Full |

---

## Security Contacts

- **Security Email**: security@electriccoin.co
- **HackerOne**: https://hackerone.com/zcash
- **Disclosure Policy**: https://z.cash/responsible-disclosure/

---

## Sources

- NCC Group audit reports
- Trail of Bits publications
- Electric Coin Company blog
- Zcash Improvement Proposals (ZIPs)
- Historical vulnerability disclosures

*Last updated: 2026-01-22*
