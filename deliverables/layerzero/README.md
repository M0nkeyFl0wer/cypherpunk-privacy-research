# LayerZero - Constitutional Research

## Overview

LayerZero is an open-source, immutable omnichain messaging protocol that enables cross-chain communication across 120+ blockchains including EVM, Solana, Sui, Move, and TON networks.

## Security Rating: MEDIUM-HIGH

**Rationale:** Extensive audit coverage (11+ audits), industry-leading $15M bug bounty, immutable core contracts. However, application-layer security depends on DVN configuration choices. The September 2025 $GAIN exploit demonstrated peer initialization vulnerabilities. V2 architecture significantly improves over V1 trust model.

## Key Findings

### Trust Model (V2 - Current)

- **DVN (Decentralized Verifier Networks):** 35+ independent verifiers including Google Cloud, Chainlink, Polyhedra, Deutsche Telekom
- **X-of-Y-of-N Security Model:** Applications choose DVN combinations and thresholds
- **Application-Owned Security:** Developers control their security parameters
- **Censorship Resistance:** Lossless, exactly-once delivery with guaranteed finality

### Security History

| Date | Incident | Impact | Status |
|------|----------|--------|--------|
| Jan 2023 | Critical vulnerability allegations by James Prestwich | Potential fund theft via MultiSig | Disputed |
| Sep 2025 | $GAIN token exploit | 84% price crash, $3M stolen | Confirmed |

### Audit Coverage

- ChainSecurity, Zellic, Dedaub, Code4rena, Paladin
- 11+ total audits
- Active $15M bug bounty on Immunefi
- ~$1M paid to whitehats

### Stargate Relationship

Stargate Finance is the first dApp built on LayerZero and has been acquired by LayerZero DAO:
- $70B total value transferred
- Native asset bridge (USDC, USDT, ETH, BTC)
- 80+ chains supported
- Uses 2/2 Stargate + Nethermind DVN configuration

## Files

- `constitutional_research.json` - Full research data
- `project_metadata.json` - Project summary metadata

## Sources

See `constitutional_research.json` for complete source list with 25+ references.
