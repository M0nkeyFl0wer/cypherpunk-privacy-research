# PR 2 Draft: Enhanced Entries with Research Links

**Concept:** Richer descriptions that summarize key research findings, with IPFS links to full verified research data.

**Note:** IPFS CIDs are placeholders - will be generated after uploading research files.

---

## monero

```yaml
name: Monero
description: >
  Privacy-first cryptocurrency launched April 2014 via fair launch (no premine). 
  Implements ring signatures, stealth addresses, and confidential transactions 
  for untraceable peer-to-peer payments. Governed by decentralized workgroups 
  since 2024 transition from Core Team model. Developed by Monero Research Lab 
  cryptographers who created CLSAG and Bulletproofs protocols. 9,900+ GitHub stars.
  Full research: ipfs://Qm[MONERO_CID]
ecosystem:
- monero
team:
  anonymous: false
  teammembers:
  - name: fluffypony (Riccardo Spagni)
    role: Lead maintainer (historical)
  - name: binaryFate
    role: Core Team member (historical)
  - name: Monero Research Lab
    role: Protocol development workgroup
links:
  web: https://www.getmonero.org/
  github: https://github.com/monero-project/monero
product_launch_day: '2014-04'
```

---

## zcash

```yaml
name: Zcash
description: >
  First cryptocurrency implementing zero-knowledge proofs (zk-SNARKs) for 
  private transactions, launched October 2016. Founded by Zooko Wilcox-O'Hearn 
  with a team of world-class cryptographers including Eli Ben-Sasson and 
  Matthew Green. Pioneered trusted setup ceremonies and shielded transaction 
  technology now used across the industry. Governed by Electric Coin Company 
  and Zcash Foundation.
  Full research: ipfs://Qm[ZCASH_CID]
ecosystem:
- zcash
team:
  anonymous: false
  teammembers:
  - name: Zooko Wilcox-O'Hearn
    role: Founder
  - name: Josh Swihart
    role: CEO, Electric Coin Company
  - name: Eli Ben-Sasson
    role: Founding Scientist
  - name: Matthew Green
    role: Founding Scientist
  - name: Ian Miers
    role: Founding Scientist
links:
  web: https://z.cash/
  github: https://github.com/zcash/zcash
  twitter: https://twitter.com/ElectricCoinCo
product_launch_day: '2016-10-28'
```

---

## iron-fish

```yaml
name: Iron Fish
description: >
  Layer 1 privacy blockchain encrypting every transaction by default while 
  maintaining compliance through read-only view keys. Founded by Elena Nadolinski 
  (Forbes 30 Under 30, ex-Microsoft/Airbnb). Uses zk-SNARKs for shielded 
  transactions with focus on accessibility and regulatory compatibility. 
  Backed by a]z16 crypto fund and Sequoia.
  Full research: ipfs://Qm[IRONFISH_CID]
ecosystem:
- other
team:
  anonymous: false
  teammembers:
  - name: Elena Nadolinski
    role: Founder & CEO
    link: https://www.linkedin.com/in/elenanadolinski/
links:
  web: https://ironfish.network
  github: https://github.com/iron-fish/ironfish
```

---

## hopr

```yaml
name: HOPR
description: >
  Decentralized mixnet protocol providing network-level metadata privacy. 
  Unlike Tor, HOPR is economically sustainable through token incentives and 
  fully decentralized. Enables privacy-preserving point-to-point data exchange 
  for Web3 applications. 174 repositories, primary implementation in Rust.
  Full research: ipfs://Qm[HOPR_CID]
ecosystem:
- ethereum
team:
  anonymous: false
  teammembers: []
links:
  web: https://hoprnet.org/
  github: https://github.com/hoprnet
```

---

## firo

```yaml
name: Firo
description: >
  Privacy cryptocurrency (formerly Zcoin) implementing Lelantus Spark protocol 
  for high anonymity sets without trusted setup. Uses standard cryptographic 
  assumptions. Active development since 2016 with 758 GitHub stars and 
  consistent contributor activity. Focuses on practical, auditable privacy.
  Full research: ipfs://Qm[FIRO_CID]
ecosystem:
- other
team:
  anonymous: false
  teammembers: []
links:
  web: https://firo.org
  github: https://github.com/firoorg/firo
```

---

## oasis-network

```yaml
name: Oasis Network
description: >
  Privacy-enabled Layer 1 blockchain with confidential smart contract execution 
  via Sapphire ParaTime - the only confidential EVM in production. Founded by 
  Dawn Song (UC Berkeley professor, MacArthur Fellow). Designed for scalable, 
  interoperable privacy across DeFi, AI, and data tokenization use cases.
  Full research: ipfs://Qm[OASIS_CID]
ecosystem:
- ethereum
team:
  anonymous: false
  teammembers:
  - name: Dawn Song
    role: Founder
links:
  web: https://oasisprotocol.org
  github: https://github.com/oasisprotocol
```

---

## mysterium-network

```yaml
name: Mysterium Network
description: >
  Decentralized VPN built on blockchain, enabling permissionless bandwidth 
  sharing. Users can run nodes to provide VPN services and earn tokens. 
  Open source infrastructure for censorship-resistant internet access. 
  Operational since 2017 with active node network across 80+ countries.
  Full research: ipfs://Qm[MYSTERIUM_CID]
ecosystem:
- ethereum
team:
  anonymous: false
  teammembers: []
links:
  web: https://mysterium.network
  github: https://github.com/mysteriumnetwork
```

---

## rotki

```yaml
name: Rotki
description: >
  Open source portfolio tracker and accounting tool that runs locally - 
  your financial data never leaves your machine. Supports multiple blockchains, 
  exchanges, and DeFi protocols. Privacy by design: no servers, no tracking, 
  full data ownership. Active development with 2,600+ GitHub stars.
  Full research: ipfs://Qm[ROTKI_CID]
ecosystem:
- ethereum
team:
  anonymous: false
  teammembers: []
links:
  web: https://rotki.com
  github: https://github.com/rotki/rotki
```

---

# Next Steps

1. **Upload research JSONs to IPFS** - Each project's `verified_data.json` gets pinned
2. **Generate CIDs** - Replace placeholder `Qm[PROJECT_CID]` with real hashes
3. **Forum post** - Propose extended schema fields to web3privacy community
4. **Review** - You approve final descriptions before PR submission

# Forum Post Draft

**Title:** Proposal: Research Links & Extended Project Data

We've conducted in-depth research on 39 privacy projects including verified founder information, 
technical architecture analysis, funding history, GitHub metrics, and (where applicable) legal 
timeline documentation.

The current explorer schema captures basic directory information but doesn't have fields for:
- Detailed technical specifications
- Verified funding/investor data  
- Historical milestones
- Contract deployments
- Governance structures

**Proposal:** Add an optional `research_url` field that links to comprehensive project research 
(hosted on IPFS for permanence). This keeps the explorer lightweight while providing depth for 
users who want it.

Alternatively, we can include research summaries in the description field with IPFS links, 
as shown in our draft PR.

Thoughts?
