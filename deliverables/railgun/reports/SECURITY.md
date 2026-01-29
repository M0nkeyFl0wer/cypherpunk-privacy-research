# Security & Audits

*Research Date: 2026-01-28*

---

## Security Audits

### Audit Summary

RAILGUN's code has been audited **over 10 times** by multiple security firms. The protocol claims comprehensive review of smart contracts, zkSNARK circuits, and cryptographic implementations.

### Confirmed Auditors

| Auditor | Specialization | Rating/Notes |
|---------|----------------|--------------|
| **Trail of Bits** | Smart contracts, cryptography | Elite-tier auditor |
| **ABDK Consulting** | ZK cryptography, circuits | Specialized in zkSNARKs |
| **Zokyo** | Smart contracts | 100 rating |
| **Hashcloak** | Privacy tech, cryptography | - |
| **Pessimistic** | Smart contract security | - |
| **Hacken** | Smart contract audits | - |
| **Halborn** | Smart contracts | Upcoming audit |

### Audit Reports

Audit reports are published at: https://assets.railgun.org/docs/audits/

**Note**: Direct links to individual audit reports were not accessible during research. Users should verify current report availability.

**Sources**:
- [CoinEx RAILGUN Response](https://coinex.medium.com/you-ask-we-answer-vol-21-insight-into-railgun-projects-response-54ff6e176a3d)
- [Yahoo Finance - Railway Wallet Launch](https://finance.yahoo.com/news/defi-privacy-protocol-railgun-launches-130000894.html)

---

## Private Proofs of Innocence (PPOI)

### Overview

PPOI is RAILGUN's compliance system deployed in 2024 that screens incoming funds to prevent illicit assets from contaminating the privacy pool.

### How It Works

1. **Shield Monitoring**: When tokens are shielded (deposited), the system checks their origin
2. **Exclusion Lists**: Data sources maintain lists of known malicious addresses
3. **Privacy-Preserving**: Uses zero-knowledge proofs - no user data revealed
4. **Jurisdictional Flexibility**: Users can select relevant authority lists (US Treasury, EU, etc.)

### Technical Details

- **Data Source**: Publicly available blockchain data only
- **Default List**: OFAC designated addresses updated by Chainalysis
- **Standby Period**: "Unshield-Only Standby Period" prevents address hopping by bad actors
- **No Access Given**: No third party gains access to RAILGUN user information

### Proven Track Record

| Incident | Date | Amount | Result |
|----------|------|--------|--------|
| Inferno Drainer | 2024 | $530,000 | **Blocked** |
| zkLend Attack | Feb 2025 | $9.5M | **Blocked** |

**Vitalik Buterin Comment**: Called the zkLend blocking "a solid demonstration of compliant privacy in practice"

### Limitations

| Incident | Date | Amount | Result |
|----------|------|--------|--------|
| Upbit Hacker | Late 2025 | $36M | **Bypassed** |

The Upbit incident demonstrates that sophisticated attackers can potentially circumvent PPOI screening.

**Sources**:
- [RAILGUN Docs - PPOI](https://docs.railgun.org/wiki/assurance/private-proofs-of-innocence)
- [PPOI Medium Article](https://medium.com/@Railgun_Project/having-your-privacy-eating-it-too-railgun-proof-of-innocence-efcba557aac4)
- [GitHub - PPOI](https://github.com/Railgun-Community/private-proof-of-innocence)

---

## Historical Incidents

### Lazarus Group Allegations (January 2023)

**Context**: Before PPOI was deployed

**Allegations**: FBI claimed North Korean Lazarus Group used RAILGUN to launder:
- Over $60 million (41,000 ETH) from Harmony Horizon Bridge heist
- Additional ~$2.7M (897 ETH) laundering observed

**Important Note**: These events occurred **before** the PPOI system was developed or deployed. The protocol could not have blocked these transactions as the compliance system did not exist at the time.

**Source**: [AnChain AI Analysis](https://www.anchain.ai/blog/railgun-demystified)

### Protocol Security

**RAILGUN itself has never been hacked or exploited.**

The incidents above involve RAILGUN being **used** by attackers from other protocol exploits, not vulnerabilities in RAILGUN's code.

---

## Smart Contract Security

### Architecture Strengths

1. **Upgradeable Proxy Pattern**: Uses EIP-1967 transparent proxy allowing bug fixes
2. **Modular Design**: Separate contracts for different functions
3. **OpenZeppelin Base**: Built on audited OpenZeppelin upgradeable contracts
4. **Ownership Controls**: Only owner (governance) can modify critical parameters

### Key Security Patterns Observed in Code

```solidity
// Reentrancy protection via proper state changes
// From RailgunLogic.sol
nullifierHashes[_nullifierHash] = true;  // State change BEFORE transfer
_processWithdraw(_recipient, _relayer, _fee, _refund);

// Fee bounds checking
require(_shieldFee <= BASIS_POINTS / 2, "RailgunLogic: Shield Fee exceeds 50%");
require(_unshieldFee <= BASIS_POINTS / 2, "RailgunLogic: Unshield Fee exceeds 50%");

// Field bounds validation
if (uint256(_note.npk) >= SNARK_SCALAR_FIELD) return (false, "Invalid Note NPK");
```

### Token Security

```solidity
// SafeERC20 usage for token transfers
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
using SafeERC20 for IERC20;

// Balance verification after transfer
uint256 balanceBefore = token.balanceOf(address(this));
token.safeTransferFrom(address(msg.sender), address(this), base);
uint256 balanceAfter = token.balanceOf(address(this));
require(balanceAfter - balanceBefore == base, "RailgunLogic: ERC20 transfer failed");
```

---

## Cryptographic Security

### zkSNARK Implementation

- **Curve**: BN254 (alt_bn128)
- **Proof System**: Groth16
- **Hash Function**: Poseidon (zkSNARK-friendly)
- **Precompiles**: Uses EIP-196, EIP-197 for efficient on-chain verification

### Circuit Security

- **54 Circuits**: Different input/output combinations for transaction types
- **Public Inputs**: Merkle root, nullifiers, commitments, bound parameters hash
- **Verification**: On-chain verifier checks proof validity against verification keys

---

## Governance Security

### Staking Contract

```solidity
// From Staking.sol
uint256 public constant STAKE_LOCKTIME = 30 days;
uint256 public constant SNAPSHOT_INTERVAL = 1 days;
```

- **30-day unlock period**: Prevents flash loan governance attacks
- **Snapshotting**: Historical voting power prevents manipulation

### Potential Risks

1. **Governance Attacks**: Like Tornado Cash's May 2023 attack, metamorphic contracts could theoretically exploit governance
2. **Proxy Upgrade Risk**: Malicious upgrade could compromise funds (mitigated by timelock governance)

---

## Operational Security

### Relayer System

RAILGUN uses relayers to submit transactions on behalf of users:
- Users don't need ETH for gas
- Relayers see withdrawal recipient (not sender)
- Fee structure controlled by governance

### Viewing Keys

Users can generate viewing keys for:
- Auditor access
- Tax compliance
- Selective disclosure
- Does not reveal other users' information

---

## Bug Bounty Program

No public bug bounty program was found on Immunefi or similar platforms during research.

**Recommendation**: Users should verify current bug bounty status directly with RAILGUN.

---

## Security Assessment Summary

### Strengths

| Aspect | Assessment |
|--------|------------|
| Audit Coverage | Excellent - 10+ audits from top firms |
| Code Quality | High - Professional patterns, OpenZeppelin base |
| Protocol Safety | No direct exploits/hacks on RAILGUN itself |
| Compliance Innovation | PPOI is novel privacy-preserving compliance |
| Ethereum Foundation Support | Credibility endorsement |

### Concerns

| Aspect | Assessment |
|--------|------------|
| PPOI Bypass | Sophisticated attackers can circumvent (Upbit case) |
| Pseudonymous Team | Limits accountability |
| Audit Report Access | Not easily accessible |
| Upgrade Risk | Proxy pattern allows contract changes |

### Risk Level: **LOW-MEDIUM**

RAILGUN has strong security fundamentals with extensive audits and no protocol-level exploits. The main risks are:
1. Regulatory (privacy protocols face legal scrutiny)
2. Compliance system not perfect (PPOI bypasses documented)
3. Smart contract upgrade potential (standard for upgradeable protocols)

---

## Sources

| Source | Type |
|--------|------|
| [RAILGUN Docs - PPOI](https://docs.railgun.org/wiki/assurance/private-proofs-of-innocence) | Official |
| [GitHub - Contract](https://github.com/Railgun-Privacy/contract) | Code |
| [AnChain AI - Railgun Demystified](https://www.anchain.ai/blog/railgun-demystified) | Analysis |
| [Coin360 - zkLend Hack](https://coin360.com/news/zkLend-hack-railgun-fail) | News |
| [The Block - Vitalik Praise](https://www.theblock.co/post/340807/vitalik-buterin-praises-compliance-focused-privacy-project-railgun) | News |
| [CoinEx Medium](https://coinex.medium.com/you-ask-we-answer-vol-21-insight-into-railgun-projects-response-54ff6e176a3d) | Interview |

---

*Constitutional Research Note: RAILGUN's security profile is strong with extensive third-party audits and no direct protocol exploits. The PPOI compliance system is innovative but imperfect - a realistic assessment given the cat-and-mouse nature of blockchain compliance. The protocol's use for money laundering prior to PPOI deployment is documented but occurred before compliance systems existed.*
