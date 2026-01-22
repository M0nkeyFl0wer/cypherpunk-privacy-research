# Monero (XMR)

## Description

Monero is the leading **privacy-by-default cryptocurrency**. Every transaction automatically hides the sender, receiver, and amount using ring signatures, stealth addresses, and RingCT. Unlike opt-in privacy systems, Monero's mandatory privacy creates a large anonymity set for all users.

## Links

- **Website**: https://getmonero.org
- **GitHub**: https://github.com/monero-project/monero
- **Forum**: https://forum.getmonero.org
- **Reddit**: https://reddit.com/r/Monero

## Category

Privacy Cryptocurrency

---

## Privacy Technology

### Core Privacy Features

| Technology | Function | Status |
|------------|----------|--------|
| **Ring Signatures** | Hides sender among 16 decoys | Active (mandatory) |
| **Stealth Addresses** | One-time addresses hide receiver | Active |
| **RingCT** | Pedersen commitments hide amounts | Active |
| **Bulletproofs+** | Efficient range proofs | Active |
| **Dandelion++** | Network-level transaction privacy | Active |

### How It Works

```
MONERO TRANSACTION PRIVACY

Sender Privacy (Ring Signatures):
┌─────────────────────────────────────┐
│  Real Input → ┐                      │
│  Decoy 1    → ├─→ Ring Signature     │
│  Decoy 2    → │   (can't tell which  │
│  ...        → │   is real)           │
│  Decoy 16   → ┘                      │
└─────────────────────────────────────┘

Amount Privacy (RingCT):
┌─────────────────────────────────────┐
│  Amount: ████████ (hidden)          │
│  Commitment proves: input = output  │
│  No one can see actual values       │
└─────────────────────────────────────┘

Receiver Privacy (Stealth Addresses):
┌─────────────────────────────────────┐
│  Public address → One-time address  │
│  Each transaction gets unique addr  │
│  No address reuse, no linking       │
└─────────────────────────────────────┘
```

### Upcoming Upgrades

| Upgrade | Impact | Timeline |
|---------|--------|----------|
| **FCMP++** | Full anonymity set (all outputs ever) | 2025-2026 |
| **Seraphis/Jamtis** | Next-gen protocol, better addresses | Research |
| **Tachyon** | Asynchronous transactions | Research |

---

## GitHub Statistics

| Metric | Value |
|--------|-------|
| Stars | 9,904 |
| Forks | 3,276 |
| Contributors | 100+ |
| Primary Language | C++ (80%) |
| Created | April 30, 2014 |

### Top Contributors

| Username | Commits |
|----------|---------|
| fluffypony | 3,078 |
| moneromooo-monero | 3,058 |
| luigi1111 | 1,623 |
| tobtoht | 382 |
| hyc | 260 |

---

## Governance

**Model**: Decentralized, community-driven

- No CEO, foundation, or central authority
- Rough consensus via GitHub, IRC, Matrix
- Funded by Community Crowdfunding System (CCS)
- Rotating pseudonymous maintainers

---

## Regulatory Status

Monero faces significant regulatory pressure due to its privacy features:

| Aspect | Status |
|--------|--------|
| Major exchange listings | Declining (delisted from Kraken EU, Binance, OKX) |
| Legal status | Legal in most jurisdictions |
| Law enforcement stance | Frequently targeted |
| Compliance features | None (privacy is mandatory) |

---

## Team

See [TEAM.md](reports/TEAM.md) for detailed contributor information.

## Security

See [SECURITY.md](reports/SECURITY.md) for audits, bug bounty, and vulnerabilities.

## OPSEC Assessment

See [opsec_vulnerability_assessment.md](reports/opsec_vulnerability_assessment.md) for infrastructure analysis.

---

*Research completed with Constitutional Research Framework v3*
*Last updated: 2026-01-22*
