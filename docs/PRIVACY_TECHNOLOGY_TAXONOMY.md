# Privacy Technology Taxonomy

*A standardized classification system for privacy technologies across all researched projects*

---

## Purpose

This taxonomy enables:
1. **Cross-project comparison** - Which projects use similar technologies?
2. **Graph visualization** - Show technology relationships between projects
3. **Filtering** - Users can search by privacy technology type
4. **Gap analysis** - Identify projects missing detailed tech documentation

---

## Technology Categories

### 1. Zero-Knowledge Proofs (ZKP)

| Technology | Description | Example Projects |
|------------|-------------|------------------|
| **zk-SNARKs** | Succinct non-interactive arguments of knowledge | Zcash, Tornado Cash, zkSync |
| **zk-STARKs** | Scalable transparent arguments of knowledge (no trusted setup) | StarkEx, StarkNet |
| **Bulletproofs** | Short non-interactive zero-knowledge proofs | Monero (Bulletproofs+), Grin |
| **Groth16** | Specific zk-SNARK construction | Zcash Sapling, many ZKP projects |
| **Halo2** | Recursive ZKP without trusted setup | Zcash Orchard |
| **PLONK** | Universal zk-SNARK construction | Various L2s |

### 2. Ring Signatures & Stealth

| Technology | Description | Example Projects |
|------------|-------------|------------------|
| **Ring Signatures** | Signer is hidden among group of possible signers | Monero, Bytecoin |
| **CLSAG** | Compact linkable spontaneous anonymous group signatures | Monero (current) |
| **Stealth Addresses** | One-time addresses per transaction | Monero, Umbra |
| **Dual-Key Stealth** | View key + Spend key separation | Monero |

### 3. Mixers & Mixnets

| Technology | Description | Example Projects |
|------------|-------------|------------------|
| **Coin Mixing** | Transaction obfuscation via mixing | Tornado Cash, CoinJoin |
| **Mixnet** | Message routing through multiple nodes | Nym, Loopix |
| **Sphinx Packets** | Onion-encrypted packet format for mixnets | Nym |
| **Cover Traffic** | Dummy messages to hide real traffic | Nym |

### 4. Confidential Transactions

| Technology | Description | Example Projects |
|------------|-------------|------------------|
| **RingCT** | Ring Confidential Transactions (amount hiding) | Monero |
| **Pedersen Commitments** | Cryptographic commitment to hide values | Monero, Grin, Mimblewimble |
| **Range Proofs** | Prove values are in valid range without revealing | Bulletproofs implementation |

### 5. Multi-Party Computation (MPC)

| Technology | Description | Example Projects |
|------------|-------------|------------------|
| **Threshold Signatures** | N-of-M signing without revealing full key | Various custody solutions |
| **Secret Sharing** | Split secrets among parties | Shamir's Secret Sharing implementations |
| **Secure Computation** | Compute on encrypted data | Secret Network, Partisia |

### 6. Trusted Execution Environments (TEE)

| Technology | Description | Example Projects |
|------------|-------------|------------------|
| **Intel SGX** | Hardware enclave for secure computation | Secret Network, Signal CDSI, Oasis |
| **ARM TrustZone** | Mobile secure execution | MobileCoin |
| **AMD SEV** | Memory encryption for VMs | Some cloud privacy solutions |

### 7. Encryption Protocols

| Technology | Description | Example Projects |
|------------|-------------|------------------|
| **Signal Protocol** | Double Ratchet + X3DH key exchange | Signal, WhatsApp, Session |
| **Sealed Sender** | Hide sender metadata from server | Signal |
| **End-to-End Encryption** | Only endpoints can decrypt | Most messaging apps |
| **Forward Secrecy** | Past sessions stay secure if key compromised | Signal Protocol, TLS 1.3 |
| **Post-Quantum** | Resistant to quantum computer attacks | Signal PQXDH, NIST PQC algorithms |

### 8. Network Privacy

| Technology | Description | Example Projects |
|------------|-------------|------------------|
| **Onion Routing** | Multi-layer encryption through relays | Tor, I2P |
| **Dandelion++** | Transaction broadcast privacy | Monero |
| **VPN Tunneling** | Encrypted tunnel to exit node | Various VPNs |
| **Mesh Networking** | Peer-to-peer routing | Meshtastic, Briar |

### 9. Identity & Credentials

| Technology | Description | Example Projects |
|------------|-------------|------------------|
| **Anonymous Credentials** | Prove attributes without revealing identity | Semaphore, Sismo |
| **Merkle Trees** | Efficient membership proofs | Various ZKP applications |
| **Nullifiers** | Prevent double-spending while preserving privacy | Tornado Cash, Zcash |
| **Key Transparency** | Auditable key directories | Signal KT |

---

## JSON Schema Extension

Add to `verified_data.json` and `constitutional_research.json`:

```json
{
  "privacy_technology": {
    "primary_mechanism": "string - main privacy technology",
    "category": "string - from taxonomy categories above",
    "technologies": [
      {
        "name": "string - technology name from taxonomy",
        "category": "string - category from taxonomy",
        "implementation": "string - optional: specific implementation details",
        "status": "string - active/deprecated/experimental"
      }
    ],
    "cryptographic_primitives": [
      "string - e.g., 'Curve25519', 'AES-256-GCM', 'SHA-256'"
    ],
    "privacy_model": "string - 'mandatory' | 'opt-in' | 'configurable'",
    "anonymity_set": "string - description of anonymity set size",
    "metadata_protection": "string - what metadata is/isn't protected"
  }
}
```

---

## Visualization Opportunities

### 1. Technology Network Graph

```
                    ┌─────────────┐
                    │  zk-SNARKs  │
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
      ┌─────────┐    ┌─────────┐    ┌─────────┐
      │  Zcash  │    │ Tornado │    │  zkSync │
      └────┬────┘    │  Cash   │    └─────────┘
           │         └─────────┘
           ▼
      ┌─────────┐
      │ Halo2   │ (Zcash Orchard upgrade)
      └─────────┘
```

**Implementation**: D3.js force-directed graph where:
- **Nodes** = Projects + Technologies
- **Edges** = "Uses" relationship
- **Clustering** = Projects using same tech cluster together

### 2. Technology Matrix View

| Project | ZKP | Ring Sigs | MPC | TEE | E2E | Mixnet |
|---------|-----|-----------|-----|-----|-----|--------|
| Zcash | zk-SNARKs | - | - | - | - | - |
| Monero | Bulletproofs | CLSAG | - | - | - | - |
| Signal | - | - | - | SGX | Signal Protocol | - |
| NYM | - | - | - | - | - | Sphinx |
| Secret Network | - | - | - | SGX | - | - |

### 3. Contributor Social Graph

```
┌──────────────────────────────────────────────────────────┐
│                 CONTRIBUTOR NETWORK                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│     [str4d]─────────[Zcash]                             │
│         │                                                │
│         └───────────[librustzcash]                      │
│                                                          │
│     [fluffypony]────[Monero]                            │
│                                                          │
│     [vbuterin]──┬───[Ethereum]                          │
│                 │                                        │
│                 └───[Zcash trusted setup]               │
│                                                          │
│     [moxie]─────────[Signal]                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Required Schema Fields

### Minimum Viable Privacy Tech Data

Every project MUST have:

```json
{
  "privacy_technology": {
    "primary_mechanism": "required - string",
    "privacy_model": "required - mandatory|opt-in|none",
    "technologies": ["required - at least one technology name"]
  }
}
```

### Contributor Cross-Referencing

```json
{
  "contributors": [
    {
      "username": "string - GitHub username (primary key)",
      "display_name": "string - Real name if public",
      "role": "string - role at this project",
      "github_url": "string - https://github.com/username",
      "twitter": "string or null",
      "linkedin": "string or null",
      "other_projects": ["array of project IDs they also contribute to"]
    }
  ]
}
```

---

## Implementation Priority

### Phase 1: Audit Existing Data
- [ ] Check which projects have `privacy_mechanism` field
- [ ] Check which projects have structured contributor links
- [ ] Generate gap report

### Phase 2: Enrich High-Priority Projects
- [ ] Add privacy_technology schema to Monero, Zcash (done)
- [ ] Add to Signal, Nym, Secret Network, Tornado Cash
- [ ] Add to remaining 40+ deliverable projects

### Phase 3: Build Visualization
- [ ] Technology network graph component
- [ ] Contributor network component
- [ ] Technology filter/search on projects page

### Phase 4: Cross-Reference Contributors
- [ ] Build contributor database keyed by GitHub username
- [ ] Link contributors across projects
- [ ] Generate "also contributes to" relationships

---

## Current Coverage Audit

### Projects WITH good privacy tech data:
- Monero (ring signatures, RingCT, Bulletproofs+, stealth addresses)
- Zcash (zk-SNARKs, Groth16, Halo2, shielded pools)
- Signal (Signal Protocol, Sealed Sender, SGX CDSI)
- NYM (Mixnet, Sphinx packets, cover traffic)

### Projects NEEDING privacy tech enrichment:
- Most messaging apps (Telegram, Protonmail, etc.)
- Many DeFi privacy tools
- L2 ZK rollups (zkSync, StarkNet references)
- Identity/credential projects (Semaphore, iden3)

---

*This taxonomy is version 1.0. Update as new technologies emerge.*
*Last updated: 2026-01-22*
