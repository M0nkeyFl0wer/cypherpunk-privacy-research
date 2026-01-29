# Security & Audits

*Research Date: 2026-01-28*

---

## Security Audits

| Auditor | Date | Report | Status |
|---------|------|--------|--------|
| Monoceros Alpha | April 2021 | [PDF](https://s3.us-west-1.amazonaws.com/assets.hop.exchange/reports/MonocerosAlpha_-_Hop_Audit.pdf) | Complete |
| Solidified | May 2021 | [PDF](https://s3.us-west-1.amazonaws.com/assets.hop.exchange/reports/Audit_Report_-_Hop_05.05.2021.pdf) | Complete |

Audit reports available in [contracts/audits](https://github.com/hop-protocol/contracts/tree/master/audits).

---

## Bug Bounty Program

- **Status:** Limited (web-only)
- **Smart Contract Bounty:** None found
- **Immunefi:** Not listed (404 error)
- **DeFiSafety Bug Bounty Score:** 0%

Web bug bounty covers authentication/authorization flaws per [GitHub docs](https://github.com/hop-protocol/docs/blob/master/faq.md).

---

## Security Architecture

**Strengths:**
- Non-custodial design
- Multi-signature with timelock on all contracts
- Trustless hToken system
- On-chain security (no centralized multi-sig vulnerabilities)
- No oracle dependency

**Weaknesses (per DeFiSafety):**
- **Admin Controls Score:** 11%
- No documentation of admin capabilities
- Contracts not labeled upgradeable/immutable
- Timelock: 24 hours (below 48hr recommendation)
- No documented flashloan protection

---

## Known Incidents

**No exploits or hacks found.**

Per CoinGecko (March 2023): "There haven't been any reported security issues concerning its bridge."

---

## Security Assessment

| Category | Score/Status |
|----------|--------------|
| DeFiSafety Overall | 87% |
| Audits | 2 complete (public) |
| Bug Bounty | Limited (web only) |
| Known Exploits | None |
| Admin Controls | Poorly documented (11%) |
| Testing | Exceptional (1121% ratio) |

**TVL:** ~$45-59M (DefiLlama)

---

## Sources

- [Monoceros Alpha Audit](https://s3.us-west-1.amazonaws.com/assets.hop.exchange/reports/MonocerosAlpha_-_Hop_Audit.pdf)
- [Solidified Audit](https://s3.us-west-1.amazonaws.com/assets.hop.exchange/reports/Audit_Report_-_Hop_05.05.2021.pdf)
- [DeFiSafety Report](https://www.defisafety.com/app/pqrs/433)
- [DefiLlama](https://defillama.com/protocol/hop-protocol)
