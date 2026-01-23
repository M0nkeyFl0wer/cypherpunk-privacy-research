# Aztec Network

## Description

Aztec is a privacy-first Layer 2 zkRollup on Ethereum that brings programmable privacy to smart contracts. It enables confidential transactions and private state through zero-knowledge proofs, combining public and private execution into a single rollup with seamless composability across encrypted and unencrypted transactions.

**Tagline:** "The first decentralized, privacy-preserving L2 on Ethereum"

## Links

- **Website:** https://aztec.network
- **Documentation:** https://docs.aztec.network
- **GitHub:** https://github.com/AztecProtocol
- **Noir Language:** https://noir-lang.org/docs/

## Category

Privacy L2 / zkRollup (Ethereum Ecosystem)

## Project Status

- **Network Status:** Testnet (Ignition Chain live Nov 2025)
- **Mainnet Planned:** End of 2025 / Early 2026
- **Token:** AZTEC (TGE voting started Jan 22, 2026)

### GitHub Statistics
- Stars: 420 (aztec-packages)
- Forks: 584
- Primary Language: C++, TypeScript, Noir
- License: Apache License 2.0

## Technical Details

### Privacy Technology
- **Proving System:** PLONK (invented by Aztec team)
- **Variants:** TurboPlonk, UltraPlonk, Honk, Goblin Plonk
- **Polynomial Commitment:** KZG
- **Elliptic Curves:** BN254, Grumpkin

### Key Features
- Programmable privacy at all levels (user, data, metadata, transaction, code)
- Client-side proof generation (data never leaves user device)
- Hybrid execution: private functions local, public on network
- UTXO model for private state, account-based for public state
- Noir DSL for private smart contracts

### Trust Model
- Decentralized Proof-of-Stake (200K AZTEC stake required)
- 23,000+ validators across 6 continents
- No centralized sequencers, backdoors, or TEEs
- Escape hatch every 8 hours for permissionless proof submission

## Security

### Audits
| Date | Auditor | Scope |
|------|---------|-------|
| 2025 | ZKSecurity, Zellic, Spearbit | Bigfield primitive |
| 2025 | Nethermind Security | Noir language |
| 2022 | Solidified | Rollup smart contracts |
| 2022 | Sentnl | Cryptography fuzzing |
| 2022 | Internal | Aztec Connect contracts |

### Bug Bounty
- **Program:** ImmuneFi partnership
- **Total:** $2,000,000
- **Critical vulnerabilities:** Up to $1M each

### Known Vulnerabilities
All historical vulnerabilities were responsibly disclosed and patched before exploitation. $50K bounty paid for BigField vulnerability discovered by Xin Gao and Onur Kilic.

## Organization

- **Company:** Aztec Labs
- **Founded:** 2018
- **HQ:** London, UK
- **Funding:** $119M+ (Series B $100M in 2022)
- **Investors:** a16z, Paradigm, Consensys, Coinbase Ventures, Vitalik Buterin

## Team

- **Zac Williamson** - CEO, Co-Founder (PLONK co-inventor)
- **Joe Andrews** - CPO, Co-Founder
- **Ariel Gabizon** - Chief Scientist (PLONK co-inventor, Zcash alum)
- **Charlie Lye** - CTO

---
*Research completed with Constitutional Research Framework v3*
*Last updated: 2026-01-22*
