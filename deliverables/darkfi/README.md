# DarkFi

## Description

**Anonymous. Uncensored. Sovereign.**

DarkFi is a Layer 1 privacy blockchain designed with anonymity at the forefront. It offers flexible private primitives that can be wielded to create any kind of application. DarkFi uses advances in zero-knowledge cryptography (Halo2 on Pallas curve) and includes a custom contracting language (ZKAS) and developer toolkits to create uncensorable code.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| Category | Privacy Layer 1 Blockchain |
| Consensus | Proof of Work (RandomX) |
| Proof System | Halo2 |
| Smart Contracts | zkVM with WASM runtime |
| Status | Alpha Testnet |
| Founded | 2020 |
| License | AGPL-3.0 |

## Links

- **Website**: [dark.fi](https://dark.fi/)
- **GitHub**: [github.com/darkrenaissance/darkfi](https://github.com/darkrenaissance/darkfi)
- **Mirror**: [codeberg.org/darkrenaissance/darkfi](https://codeberg.org/darkrenaissance/darkfi)
- **Documentation**: [dark.fi/book](https://dark.fi/book/)
- **Twitter**: [@DarkFiSquad](https://twitter.com/DarkFiSquad)

## GitHub Statistics

| Metric | Value |
|--------|-------|
| Stars | 1,310 |
| Forks | 143 |
| Contributors | 53 |
| Language | Rust |
| Last Updated | 2026-01-28 |

## Core Features

- **Anonymous Transactions**: All transfers hide sender, receiver, and amount
- **Zero-Knowledge Contracts**: Custom zkVM for private smart contracts
- **Anonymous Atomic Swaps**: OTC swaps without revealing parties
- **Anonymous DAO**: Self-governing decentralized organization with private voting
- **DarkIRC**: P2P anonymous chat application

## Key Team Members

- **Amir Taaki** - Founder (Early Bitcoin developer, BIP creator, DarkWallet co-creator)
- **Rachel-Rose O'Leary** - Core Developer & Writer (Former CoinDesk tech lead, Lunarpunk author)

See [TEAM.md](reports/TEAM.md) for detailed team information.

## Security

- **Audit**: zkSecurity (February 2024)
- **Report**: [dark.fi/zksecurity-audit-q124.pdf](https://dark.fi/zksecurity-audit-q124.pdf)

See [SECURITY.md](reports/SECURITY.md) for security analysis.

## Technical Architecture

- **ZKAS**: Custom ZK assembly language with full compiler toolchain
- **zkVM**: Heap-based execution model with 20+ opcodes
- **Poseidon Hashing**: ZK-friendly hash function for commitments
- **Pedersen Commitments**: Value and token hiding

See [TECHNICAL.md](reports/TECHNICAL.md) for technical deep-dive.

## Code Review

Comprehensive analysis of the DarkFi codebase including:
- ZK circuit implementations
- Smart contract system
- P2P network layer
- Blockchain consensus

See [CODE_REVIEW.md](reports/CODE_REVIEW.md) for full code review.

## Products

| Product | Type | Description |
|---------|------|-------------|
| darkfid | Full Node | Validates blockchain and maintains P2P connectivity |
| drk | CLI Wallet | Key management and contract interaction |
| darkirc | Anonymous IRC | P2P anonymous chat |
| DarkFi App | GUI | Desktop/mobile application (Android, Linux, Windows, macOS) |

## Latest Release

- **Version**: app-0.3-alpha
- **Date**: 2025-11-01
- **Status**: Alpha Testnet (not for production use)

---

*Research completed with Constitutional Research v2.0.0*
*Last updated: 2026-01-28*
