# Security & Audits

*Research Date: 2026-01-28*

---

## Security Audits

### ABDK Consulting (November 2019)

Tornado Cash's protocols, circuits, and smart contracts were audited by ABDK Consulting, a firm specializing in zero-knowledge cryptography and smart contracts.

**Result:** No critical issues were found and all outstanding issues were fixed.

**Audit Reports:**

| Report | Scope | Link (Archived) |
|--------|-------|-----------------|
| Cryptographic Review | Cryptographic primitives and security | [TornadoCash_cryptographic_review_ABDK.pdf](https://tornado.cash/audits/TornadoCash_cryptographic_review_ABDK.pdf) |
| Smart Contract Audit | Solidity smart contracts | [TornadoCash_contract_audit_ABDK.pdf](https://tornado.cash/audits/TornadoCash_contract_audit_ABDK.pdf) |
| Zk-SNARK Circuits Audit | Zero-knowledge circuit implementations | [TornadoCash_circuit_audit_ABDK.pdf](https://tornado.cash/audits/TornadoCash_circuit_audit_ABDK.pdf) |

**Note:** Original audit links may be inaccessible due to domain seizure following OFAC sanctions. Reports may be available via web archives or GitHub repositories.

**Source:** [GitHub - tornadocash/tornado-core](https://github.com/tornadocash/tornado-core)

### Decurity (Classic UI Audit)

The Tornado Cash Classic dApp user interface received a security audit from Decurity.

**Audit Report:** [TornadoCash_Classic_dApp_audit_Decurity.pdf](https://tornado.cash/audits/TornadoCash_Classic_dApp_audit_Decurity.pdf)

**Source:** [GitHub - tornadocash/tornado-classic-ui](https://github.com/tornadocash/tornado-classic-ui)

### Pessimistic Security Analysis

Pessimistic.io conducted an independent security analysis of Tornado Cash.

**Report Available:** [Tornado.Cash Security Analysis by Pessimistic.pdf](https://github.com/pessimistic-io/audits/blob/main/Tornado.Cash%20Security%20Analysis%20by%20Pessimistic.pdf)

### DeFiSafety Assessment

DeFiSafety conducted a process quality review noting that a single audit was performed before deployment and audit findings were made public. Some minor issues were commented on or scheduled for future releases.

**Source:** [DeFiSafety - Tornado Cash Report](https://www.defisafety.com/app/pqrs/347)

---

## Trusted Setup Ceremony (May 2020)

Tornado Cash conducted a record-breaking trusted setup ceremony for its zk-SNARK implementation.

**Key Details:**
- **Completion Date:** May 10, 2020
- **Total Contributions:** 1,114 (largest trusted setup ceremony at the time)
- **Public Attestations:** 259 Twitter attestations
- **Anonymous Contributors:** 664
- **Identified Contributors:** 450
- **Rust Contributions:** 54

For comparison, Zcash's original ceremony had 6 participants (2016) and the Sapling upgrade had 87 participants (2018).

**Security Implication:** To compromise the zk-SNARK proofs, an attacker would need to compromise every single participant. With 1,114 participants, this is considered computationally infeasible.

**Post-Ceremony:** The operator address was set to `0x0000000000000000000000000000000000000000`, making the protocol fully immutable.

**Sources:**
- [Tornado Cash Medium - Trusted Setup Ceremony](https://tornado-cash.medium.com/tornado-cash-trusted-setup-ceremony-b846e1e00be1)
- [Tornado Cash Medium - Biggest Trusted Setup Ceremony](https://tornado-cash.medium.com/the-biggest-trusted-setup-ceremony-in-the-world-3c6ab9c8fffa)
- [CoinDesk - Developers Smash Their Keys](https://www.coindesk.com/tech/2020/05/18/developers-of-ethereum-privacy-tool-tornado-cash-smash-their-keys)

---

## Bug Bounty Program

No active bug bounty program was found on Immunefi or other major platforms as of the research date.

**Context:** Following the OFAC sanctions in August 2022, formal bug bounty programs may have been discontinued. The protocol's immutable nature also limits the scope for traditional bug bounty programs.

---

## Known Security Incidents

### 1. Governance Attack (May 2023)

**Date:** May 20, 2023
**Amount Stolen:** 483,000 TORN (~$2,173,500)
**Attacker Address:** Unknown (later returned partial control)

**Technical Details:**
The attacker exploited the governance system using a sophisticated metamorphic contract attack:

1. Created a proposal appearing identical to a previously legitimate proposal
2. Hidden `selfdestruct` function was not detected during voting
3. After approval, attacker triggered self-destruct and redeployed malicious code to the same address using CREATE2 opcode
4. Malicious code granted 10,000 TORN to each attacker-controlled address
5. Attacker accumulated 1.2 million votes (vs ~70,000 legitimate votes)
6. Drained 483,000 TORN from governance vaults

**Resolution:** The attacker surprisingly proposed to return control to the community. The restoration proposal passed on May 26, 2023, though over $1 million had already been extracted.

**Sources:**
- [Halborn - Explained: The Tornado Cash Hack](https://www.halborn.com/blog/post/explained-the-tornado-cash-hack-may-2023)
- [CoinDesk - Attacker Takes Over Tornado Cash DAO](https://www.coindesk.com/tech/2023/05/21/attacker-takes-over-tornado-cash-dao-with-vote-fraud-token-slumps-40)
- [Composable Security - Understanding the Governance Attack](https://composable-security.com/blog/understanding-the-tornado-cash-governance-attack/)
- [GitHub - Tornado Cash Exploit PoC](https://github.com/pcaversaccio/tornado-cash-exploit)

### 2. Malicious Code / Supply Chain Attack (January-February 2024)

**Date Discovered:** February 26, 2024
**Attack Period:** January 1, 2024 onwards
**Discoverer:** Security researcher Gas404

**Technical Details:**
A developer known as "Butterfly Effects" submitted governance proposal #47 containing hidden malicious JavaScript code that:

1. Captured users' private deposit notes (equivalent to private keys)
2. Encoded the data to appear as routine function calls
3. Transmitted deposit notes to an unauthorized external server
4. Targeted users accessing Tornado Cash through IPFS gateways (ipfs.io, cf-ipfs.com, eth.link)

**Impact:**
- All IPFS deployments since January 1, 2024 were compromised
- Exact amount stolen is uncertain
- At least one confirmed stolen deposit observed on Etherscan
- One address withdrew 3,200 ETH ($10 million) before redepositing

**Response:**
- Gas404 published findings and urged stakeholders to veto proposal #47
- Tornado Cash developers confirmed the compromise
- Users advised to withdraw exposed notes and generate new ones
- Token holders advised to cancel votes on proposal #47

**Sources:**
- [Checkmarx - Tornado Cash Theft Uncovered](https://checkmarx.com/blog/tornado-cash-theft-uncovered-malicious-code-drains-funds-for-months/)
- [BleepingComputer - Malicious Code Puts Funds at Risk](https://www.bleepingcomputer.com/news/security/malicious-code-in-tornado-cash-governance-proposal-puts-user-funds-at-risk/)
- [CoinDesk - Backend Exploit, User Deposits at Risk](https://www.coindesk.com/business/2024/02/26/tornado-cash-reportedly-suffers-backend-exploit-user-deposits-at-risk)
- [Risky Biz News - Backdoor Code Found](https://news.risky.biz/risky-biz-news-backdoor-code-found-in-tornado-cash/)

---

## Regulatory Events

### OFAC Sanctions (August 2022 - March 2025)

**Sanctioned:** August 8, 2022
**Reason:** Alleged laundering of $455+ million stolen by North Korean Lazarus Group
**Delisted:** March 21, 2025

**Legal Outcome:** The U.S. Fifth Circuit Court ruled in November 2024 that OFAC "overstepped its congressionally defined authority" because immutable smart contracts cannot be considered "property" under IEEPA.

**Sources:**
- [U.S. Treasury - Tornado Cash Delisting](https://home.treasury.gov/news/press-releases/sb0057)
- [CoinDesk - U.S. Government Removes Sanctions](https://www.coindesk.com/policy/2025/03/21/u-s-government-removes-tornado-cash-sanctions)
- [Venable LLP - Treasury Lifts Sanctions](https://www.venable.com/insights/publications/2025/04/a-legal-whirlwind-settles-treasury-lifts-sanctions)

---

## Security Assessment

### Strengths

1. **Core Protocol Audited:** The fundamental smart contracts, cryptographic primitives, and zk-SNARK circuits received comprehensive audits from ABDK Consulting with no critical issues found
2. **Record-Breaking Trusted Setup:** 1,114 participants make the zk-SNARK compromise computationally infeasible
3. **Immutable Contracts:** Core mixer contracts cannot be modified (operator set to null address)
4. **Open Source:** All code is publicly auditable

### Vulnerabilities Demonstrated

1. **Governance Layer Risk:** The May 2023 attack showed the governance system is vulnerable to metamorphic contract attacks using CREATE2 and selfdestruct
2. **Frontend/UI Attack Surface:** The February 2024 supply chain attack demonstrated that malicious code can be injected through governance proposals affecting UI deployments
3. **IPFS Gateway Dependency:** Users relying on third-party IPFS gateways face additional trust assumptions
4. **Community Vigilance Required:** Both attacks succeeded partly due to insufficient proposal review by voters

### Recommendations for Users

1. Run self-hosted instances when possible
2. Verify deployment hashes against known-good versions
3. Avoid third-party IPFS gateways for sensitive operations
4. Review governance proposals carefully before voting
5. Use fresh deposit notes and rotate regularly

---

## Sources

### Official Resources
- [GitHub - tornadocash/tornado-core](https://github.com/tornadocash/tornado-core)
- [GitHub - tornadocash/tornado-classic-ui](https://github.com/tornadocash/tornado-classic-ui)
- [Tornado Cash Medium](https://tornado-cash.medium.com/)

### Audit Reports
- [ABDK Audit Reports](https://tornado.cash/audits/) (archived)
- [Pessimistic Security Analysis](https://github.com/pessimistic-io/audits/blob/main/Tornado.Cash%20Security%20Analysis%20by%20Pessimistic.pdf)
- [DeFiSafety Report](https://www.defisafety.com/app/pqrs/347)

### Incident Analysis
- [Halborn - Governance Hack Explained](https://www.halborn.com/blog/post/explained-the-tornado-cash-hack-may-2023)
- [Checkmarx - Supply Chain Attack](https://checkmarx.com/blog/tornado-cash-theft-uncovered-malicious-code-drains-funds-for-months/)
- [Composable Security - Governance Attack](https://composable-security.com/blog/understanding-the-tornado-cash-governance-attack/)

### Regulatory
- [U.S. Treasury - Sanctions Press Release](https://home.treasury.gov/news/press-releases/jy0916)
- [U.S. Treasury - Delisting Press Release](https://home.treasury.gov/news/press-releases/sb0057)
