# Code Review: Hop Protocol

*Research Date: 2026-01-28*

---

## GitHub Analysis

**Organization:** [github.com/hop-protocol](https://github.com/hop-protocol)
- **Created:** January 29, 2021
- **Public Repositories:** 30
- **Followers:** 473
- **Website:** https://hop.exchange

### Main Repositories

| Repository | Stars | Forks | Language | Purpose |
|------------|-------|-------|----------|---------|
| [hop](https://github.com/hop-protocol/hop) | 2,848 | 213 | TypeScript (98%) | Monorepo: SDK, frontend, hop-node |
| [contracts](https://github.com/hop-protocol/contracts) | 235 | 83 | TypeScript/Solidity | V1 smart contracts |
| [hop-airdrop](https://github.com/hop-protocol/hop-airdrop) | 179 | 219 | - | HOP token airdrop |
| [subgraph](https://github.com/hop-protocol/subgraph) | 24 | 10 | TypeScript | The Graph subgraphs |
| [hop-v2-monorepo](https://github.com/hop-protocol/hop-v2-monorepo) | 0 | 0 | TypeScript | V2 development |

### Activity Status
- **Last monorepo commit:** October 29, 2025
- **Total commits (monorepo):** 10,793
- **Open issues:** 33 (monorepo), 11 (contracts)
- **Active V2 development:** January 2026

---

## Architecture Overview

Hop Protocol implements a scalable rollup-to-rollup General Token Bridge:

1. **hTokens (Bridge Tokens):** Cross-network tokens that move between rollups or claim underlying assets on L1
2. **Automated Market Makers (AMMs):** Swap between bridge tokens and Canonical Tokens
3. **Bonders:** Liquidity providers who front funds for instant transfers

**Key Smart Contracts:**
- `L1_Bridge.sol` - Ethereum mainnet bridge
- `L2_Bridge.sol` - Abstract L2 bridge
- `HopBridgeToken.sol` - ERC20 hToken implementation
- L2-specific: `L2_ArbitrumBridge.sol`, `L2_OptimismBridge.sol`, `L2_XDaiBridge.sol`

---

## Languages and Frameworks

**Contracts Repository:**
| Language | Percentage |
|----------|------------|
| TypeScript | 60.7% |
| Solidity | 39.3% |

**Monorepo:**
| Language | Lines |
|----------|-------|
| TypeScript | 8,870,864 |
| JavaScript | 141,719 |
| Shell | 8,001 |

**Build Tools:**
- Hardhat (smart contracts)
- PNPM workspaces (monorepo)
- Vite (frontend)

---

## Code Quality Indicators

**Testing:**
- Test-to-code ratio: **1121%** (exceptional) per DeFiSafety
- Jest configuration present
- Testnet deployments with verifiable addresses

**Linting & Quality:**
- ESLint configuration
- TypeScript strict mode
- Husky Git hooks
- `.nvmrc` for Node version consistency

**Documentation:**
- Documentation score: **91%** per DeFiSafety
- Comprehensive README
- Software architecture with inheritance diagrams

---

## Sources

- [GitHub: hop-protocol](https://github.com/hop-protocol)
- [GitHub: hop-protocol/contracts](https://github.com/hop-protocol/contracts)
- [DeFiSafety Hop Report](https://www.defisafety.com/app/pqrs/433)
