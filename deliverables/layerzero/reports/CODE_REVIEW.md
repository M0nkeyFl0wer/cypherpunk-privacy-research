# Code Review: LayerZero

*Research Date: 2026-01-28*

---

## GitHub Analysis

**Organization:** [LayerZero-Labs](https://github.com/LayerZero-Labs)
- **Created:** September 15, 2021
- **Public Repositories:** 30

### Main Repositories

| Repository | Stars | Forks | Language | Purpose |
|------------|-------|-------|----------|---------|
| [LayerZero-v1](https://github.com/LayerZero-Labs/LayerZero-v1) | 1,955 | 1,249 | Solidity | V1 contracts |
| [endpoint-v1-solidity-examples](https://github.com/LayerZero-Labs/endpoint-v1-solidity-examples) | 1,022 | 546 | JavaScript | V1 examples |
| [LayerZero-v2](https://github.com/LayerZero-Labs/LayerZero-v2) | 737 | 465 | Move | V2 multi-chain |
| [devtools](https://github.com/LayerZero-Labs/devtools) | 202 | 260 | TypeScript | Developer tools |
| [Audits](https://github.com/LayerZero-Labs/Audits) | 43 | 26 | - | 99 audit reports |

### Activity Status
- **HIGHLY ACTIVE** - devtools updated January 28, 2026
- **80 open issues** on LayerZero-v2

---

## Architecture Overview

LayerZero is an omnichain interoperability protocol enabling cross-chain messaging across **132+ blockchains**.

**V2 Architecture:**
- **Ultra Light Node (ULN):** Basic messaging library supporting up to 254 DVNs
- **Decentralized Verifier Networks (DVNs):** Modular security with "X of Y of N" quorum
- **Executors:** Handle message execution on destination chains
- **OApp/OFT Standards:** Omnichain Applications and Fungible Tokens

---

## Languages and Frameworks

**LayerZero-v2:**
| Language | Lines |
|----------|-------|
| Move | 4,243,983 |
| Solidity | 967,651 |
| Rust | 463,026 |
| TypeScript | 40,393 |

**Multi-Chain Support:**
- Solidity: Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Fantom
- Move: Aptos ecosystem
- Rust: Solana, TON integrations

---

## Code Quality Indicators

- Active CI/CD via GitHub Actions
- Dedicated audits repository with **99 audit reports**
- Comprehensive documentation at [docs.layerzero.network](https://docs.layerzero.network/v2)
- Developer tooling with examples and SDKs

---

## Sources

- [GitHub: LayerZero-Labs](https://github.com/LayerZero-Labs)
- [LayerZero Documentation](https://docs.layerzero.network/v2)
- [Audits Repository](https://github.com/LayerZero-Labs/Audits)
