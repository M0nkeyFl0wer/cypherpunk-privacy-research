# Zcash (ZEC)

## Description

Zcash is a **privacy-optional cryptocurrency** using zk-SNARKs (zero-knowledge proofs) to enable fully shielded transactions. Unlike Monero's mandatory privacy, Zcash allows users to choose between transparent (like Bitcoin) and shielded transactions. Created by world-class cryptographers, it pioneered practical zk-SNARK deployment.

## Links

- **Website**: https://z.cash
- **GitHub**: https://github.com/zcash/zcash
- **Forum**: https://forum.zcashcommunity.com
- **Electric Coin Company**: https://electriccoin.co
- **Zcash Foundation**: https://zfnd.org

## Category

Privacy Cryptocurrency

---

## Privacy Technology

### Core Privacy Features

| Technology | Function | Status |
|------------|----------|--------|
| **zk-SNARKs** | Zero-knowledge proofs hide all tx data | Active |
| **Shielded Pools** | Encrypted transaction pools | Active (Sapling, Orchard) |
| **View Keys** | Selective disclosure to auditors | Active |
| **Unified Addresses** | Single address for multiple pools | Active |

### Shielded Pool Evolution

| Pool | Year | Technology | Status |
|------|------|------------|--------|
| Sprout | 2016 | Original zk-SNARKs | Deprecated |
| Sapling | 2018 | Improved efficiency | Active |
| Orchard | 2022 | Halo2 (no trusted setup) | Active |

### How It Works

```
ZCASH TRANSACTION TYPES

TRANSPARENT (t-addr) - Like Bitcoin:
┌─────────────────────────────────────┐
│  Sender: t1abc...    (visible)      │
│  Amount: 10 ZEC      (visible)      │
│  Receiver: t1xyz...  (visible)      │
│  ~85-95% of transactions            │
└─────────────────────────────────────┘

SHIELDED (z-addr) - Private:
┌─────────────────────────────────────┐
│  Sender: ████████    (hidden)       │
│  Amount: ████████    (hidden)       │
│  Receiver: ████████  (hidden)       │
│  zk-SNARK proves validity           │
│  ~5-15% of transactions             │
└─────────────────────────────────────┘
```

### Privacy Tradeoff

**Key Consideration**: Zcash privacy is only as strong as shielded pool adoption.

| Factor | Impact |
|--------|--------|
| Opt-in privacy | Most users stay transparent |
| Small anonymity set | Shielded pool is small |
| Regulatory friendly | Maintains exchange listings |
| View keys | Can be coerced for disclosure |

---

## GitHub Statistics

| Metric | Value |
|--------|-------|
| Stars | 5,080 |
| Forks | 2,104 |
| Contributors | 100+ |
| Primary Language | C++ (59%) |
| Created | November 22, 2014 |

### Top Contributors

| Username | Commits | Notes |
|----------|---------|-------|
| laanwj | 2,899 | Bitcoin Core (inherited) |
| str4d | 2,616 | ECC lead engineer |
| nuttycom | 1,133 | ECC developer |
| daira | 630 | Lead cryptographer |
| ebfull | 511 | Sapling creator |

---

## Governance

**Model**: Multi-stakeholder corporate governance

| Organization | Role |
|--------------|------|
| Electric Coin Company (ECC) | Protocol development |
| Zcash Foundation | Community, Zebra node |
| Zcash Community Grants (ZCG) | Grant funding |

### Funding

- Historical: 20% of block rewards (dev fund)
- Current: Transitioning post-NU5
- Known leadership: Zooko Wilcox (CEO), publicly identified team

---

## Regulatory Status

Zcash maintains good regulatory standing due to compliance features:

| Aspect | Status |
|--------|--------|
| Major exchange listings | Maintained (Coinbase, Kraken, Binance) |
| Legal status | Legal in most jurisdictions |
| Compliance features | View keys, transparent addresses |
| Regulatory engagement | Active (through ECC) |

---

## Comparison: Zcash vs. Monero

| Aspect | Zcash | Monero |
|--------|-------|--------|
| Privacy | Opt-in | Mandatory |
| Technology | zk-SNARKs | Ring signatures |
| Anonymity set | Shielded pool only | All transactions |
| Leadership | Identified (Zooko) | Pseudonymous |
| Exchange availability | High | Declining |
| Trusted setup | Historical (eliminated in Orchard) | Never |
| Auditability | View keys | None |

---

## Team

See [TEAM.md](reports/TEAM.md) for detailed leadership and contributor information.

## Security

See [SECURITY.md](reports/SECURITY.md) for audits, bug bounty, and vulnerabilities.

## OPSEC Assessment

See [opsec_vulnerability_assessment.md](reports/opsec_vulnerability_assessment.md) for infrastructure analysis.

---

*Research completed with Constitutional Research Framework v3*
*Last updated: 2026-01-22*
