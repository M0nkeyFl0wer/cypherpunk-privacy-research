# Security & Audits

*Research Date: 2026-01-28*

---

## Security Audits

LayerZero maintains **99 audit reports** from 15+ security firms in their [public Audits repository](https://github.com/LayerZero-Labs/Audits).

### Major Audit Firms

| Firm | Audits | Notable Scope |
|------|--------|---------------|
| **Zellic** | Multiple | DVNs, OApp/OFT, Starknet V2, EigenLayer DVN |
| **OtterSec** | Multiple | Aptos Bridge, Endpoint V2, Solana, IOTA V2 |
| **ChainSecurity** | OFT/OApp (Jan 2024) | "Satisfactory level of security" |
| **Paladin** | Multiple | DVN, Endpoint V2, ZRO Claim |
| **Certora** | Endpoint V1/V2 | Formal verification |
| **Hexens** | Multiple | Arbitrum OFT, Rate Limiter |
| **Pashov** | Multiple | Solana Endpoint/OFT |

### Recent Audits (2025-2026)
- LZ-Multicall: Paladin, OtterSec, UNH-IOL (Jan 2026)
- Starknet V2: OtterSec, Zellic (Sep-Dec 2025)
- EigenLayer DVN: OtterSec, Zellic (Sep 2025)
- USDT OFT: Zellic, OtterSec (Jan 2025)

---

## Bug Bounty Program

**Platform:** [Immunefi](https://immunefi.com/bug-bounty/layerzero/)

| Tier | Maximum Reward |
|------|----------------|
| Group 1 (Critical) | **$15,000,000** |
| Group 2 | $1,500,000 |

- **Launched:** May 2023 (largest crypto bug bounty at launch)
- **Requirements:** KYC mandatory, OFAC screening, PoC required
- **Payment:** USDC, USDT, BUSD

---

## Security Model - DVN Architecture

**Decentralized Verifier Networks (DVNs):**
- Permissionless design - anyone can build a DVN
- Customizable "X of Y of N" quorum
- **35+ DVN Operators** including Google Cloud, Polyhedra (ZK), Axelar
- EigenLayer partnership for cryptoeconomic security with slashing

---

## Known Incidents

### 1. January 2023 - "Backdoor" Allegations
- James Prestwich alleged bypass capabilities with default settings
- CEO acknowledged but stated not hidden, only affects default configs
- **No funds exploited**

### 2. November 2023 - Messaging Vulnerability
- Could "brick the messaging process"
- Manual workaround available; severity: medium

### 3. 2025 - Griffin AI Token Exploit
- Third-party token exploited unauthorized peer initialization
- $3M laundered; **not a LayerZero core vulnerability**

---

## Security Assessment

| Aspect | Rating |
|--------|--------|
| Audit Coverage | **EXCELLENT** - 99 audits |
| Bug Bounty | **EXCELLENT** - $15M max |
| Incident History | **GOOD** - No core exploits |
| Security Model | **STRONG** - Modular DVN |
| Transparency | **GOOD** - Public audit repo |

**Stats:**
- **$50B+** transaction volume
- **$345M** TVL
- **132+** supported blockchains
- **Zero** core protocol exploits

---

## Sources

- [LayerZero Audits Repository](https://github.com/LayerZero-Labs/Audits)
- [Immunefi Bug Bounty](https://immunefi.com/bug-bounty/layerzero/)
- [ChainSecurity Audit](https://www.chainsecurity.com/security-audit/layerzero-oft-oapp)
- [LayerZero DVN Docs](https://docs.layerzero.network/v2/concepts/modular-security/security-stack-dvns)
- [CoinDesk - Backdoor Allegations](https://www.coindesk.com/tech/2023/01/30/bridge-platform-layerzero-denies-allegations-it-kept-backdoor-secret/)
- [DefiLlama](https://defillama.com/protocol/layerzero)
