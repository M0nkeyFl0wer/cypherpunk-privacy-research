# Miden (0xMiden)

## Description
Miden is a STARK-based zero-knowledge virtual machine and Ethereum Layer 2 rollup that prioritizes privacy, client-side proving, and high throughput. Originally incubated by Polygon Labs, Miden became an independent project (0xMiden) in March 2025 after securing $25M in seed funding led by a16z crypto.

The project features built-in privacy by default, where the ledger stores only state commitments rather than full transaction data. Users can optionally disclose specific information when needed, supporting flexible privacy strategies for both individual users and institutions.

## Links
- **Website**: https://miden.build
- **Documentation**: https://docs.miden.xyz
- **GitHub**: https://github.com/0xPolygonMiden
- **Twitter**: https://twitter.com/0xMiden

## Category
Privacy Infrastructure (ZK Rollup / zkVM / Layer 2)

## Ecosystem
Ethereum

## Key Features

### Privacy Model
- **Default Privacy**: Ledger stores only state commitments, not full transaction data
- **Private Accounts**: Transaction details communicated off-chain via side channels
- **Public Accounts**: Optional transparency for smart contracts requiring it
- **Selective Disclosure**: Developers can reveal specific trades or calls when needed

### Technical Architecture
- **STARK Proofs**: Transparent setup, no trusted ceremony required
- **Client-Side Proving**: Proof generation on user devices (1-2 seconds on laptop)
- **Actor Model**: Each account executes independently with parallel proof generation
- **Quantum Resistance**: Hash-based security provides theoretical quantum safety

### Performance
- Single-threaded: ~20-25 KHz
- 8-core systems: ~140 KHz
- 64-core systems: ~265 KHz
- Proof verification: <3 milliseconds

## Project Status
**Status**: Active Development (Alpha Testnet)

### Timeline
| Date | Milestone |
|------|-----------|
| Nov 2021 | Initial prototype announced |
| 2024 | Alpha testnet launches |
| Mar 2025 | Spin-off from Polygon Labs to 0xMiden |
| Apr 2025 | $25M seed round (a16z, 1kx, Hack VC) |
| Jan 2026 | Miden VM v0.20.2 released |

## Team
See [TEAM.md](reports/TEAM.md) for detailed team information.

### Founders
- **Bobbin Threadbare** - Founder & Lead Developer (former Facebook/Novi ZK researcher, creator of Distaff VM and Winterfell)
- **Dominik Schmid** - Co-founder (background unverified)
- **Azeem Khan** - Co-founder, Business Development (former Gitcoin, ConsenSys)

## Technical Details
See [TECHNICAL.md](reports/TECHNICAL.md) for technical documentation.

## Security
See [SECURITY.md](reports/SECURITY.md) for security analysis.

## Code Review
See [CODE_REVIEW.md](reports/CODE_REVIEW.md) for repository analysis.

## Funding
| Round | Amount | Lead Investors | Date |
|-------|--------|----------------|------|
| Seed | $25M | a16z crypto, 1kx, Hack VC | Apr 2025 |

**Other Investors**: Finality Capital Partners, Symbolic Capital, P2 Ventures, Delta Fund, MH Ventures

**Angel Investors**: Avery Ching (Aptos Labs CEO), Rune Christensen (MakerDAO founder)

---
*Research completed with Constitutional Research v2.0.0*
*Last updated: 2026-01-19*
