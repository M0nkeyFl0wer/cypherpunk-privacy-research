# Technical Analysis: NYM

**Last Updated**: 2026-01-19

---

## Architecture Overview

NYM implements a decentralized mixnet based on the Loopix design with economic incentives via the NYM token.

```
[Client] → [Gateway] → [Mix1] → [Mix2] → [Mix3] → [Gateway] → [Destination]
              ↑                                        ↑
         Entry point                              Exit point
              └──── Sphinx packets with cover traffic ────┘
```

---

## Core Components

### 1. Mix Nodes
- Shuffle packets from multiple sources
- Add random delays (timing obfuscation)
- Strip one encryption layer per hop
- Economic incentives via NYM staking

### 2. Gateways
- **Entry Gateway**: Accepts client connections, routes into mixnet
- **Exit Gateway**: Delivers packets to destinations
- Provide mailbox functionality for offline clients

### 3. Validators
- Run on Cosmos SDK blockchain
- Manage NYM token economics
- Track reputation and rewards

---

## Sphinx Packet Format

### Layered Encryption
```
Message → [Layer3(Mix3) → [Layer2(Mix2) → [Layer1(Mix1) → [Header]]]]
```

Each layer contains:
- Encrypted routing information for next hop
- Encrypted payload (or inner layer)
- MAC for integrity verification

### Properties
- **Forward Secrecy**: Compromise of one hop doesn't reveal others
- **Unlinkability**: Packets entering/exiting a node are cryptographically unlinkable
- **Integrity**: MACs prevent tampering

---

## Coconut Credentials

### Purpose
Enable anonymous payment and service access without revealing identity.

### Properties
- **Blind Issuance**: Issuer doesn't learn credential contents
- **Re-randomizable**: Same credential can be used multiple times unlinkably
- **Selective Disclosure**: Reveal only required attributes
- **Multi-authority**: Multiple issuers can contribute to credentials

### Use Case
1. User buys NYM tokens (pseudonymous)
2. Tokens converted to Coconut credentials (unlinkable)
3. Credentials used to access mixnet (anonymous)

---

## Cover Traffic

### Loopix Cover Traffic Model
- **Loop packets**: Client sends packets to self through mixnet
- **Drop packets**: Packets that are discarded at destination
- **Real packets**: Actual user messages

### Purpose
- Masks when users are actually communicating
- Prevents traffic analysis based on timing
- Maintains constant traffic patterns

---

## Network Topology

### Layer Structure
- **Layer 1-3**: Mix nodes in stratified topology
- Packets traverse one node from each layer
- Geographic distribution encouraged

### Decentralization
- Hundreds of mix nodes globally
- Permissionless operation (stake NYM to run node)
- Reputation system for quality of service

---

## Token Economics

### NYM Token
- Native token on Cosmos-based chain
- Used for:
  - Staking (node operators)
  - Service fees (users)
  - Governance

### Rewards
- Mix nodes earn rewards based on:
  - Uptime
  - Packet processing
  - Quality metrics

---

## Client Integration

### SDK Support
- Rust SDK
- TypeScript/JavaScript SDK
- Go SDK
- WebAssembly builds

### Integration Patterns
1. **Socks5 Proxy**: Drop-in privacy for existing apps
2. **Direct SDK**: Native mixnet integration
3. **NymVPN**: Consumer-ready VPN application

---

## Performance Characteristics

| Metric | Typical Value |
|--------|---------------|
| Hops | 5 (3 mix + 2 gateway) |
| Latency | 100ms - 2s (varies with cover traffic) |
| Throughput | Suitable for messaging, browsing |
| Not suitable for | Real-time gaming, video calls |

---

## Comparison to Tor

| Aspect | NYM | Tor |
|--------|-----|-----|
| Packet format | Sphinx | Onion |
| Cover traffic | Yes | No |
| Timing obfuscation | Yes | Limited |
| Economic incentives | NYM token | None (volunteers) |
| Node selection | Stratified layers | Circuit selection |
| Latency | Higher | Lower |

---

## Sources

| Source | Type |
|--------|------|
| [NYM Whitepaper](https://nymtech.net/nym-whitepaper.pdf) | Technical |
| [Loopix Paper](https://arxiv.org/abs/1703.00536) | Academic |
| [NYM Documentation](https://nymtech.net/docs/) | Official |

---

*Constitutional Research Note: NYM implements a mixnet design with strong academic foundations (Loopix). The combination of Sphinx packets, cover traffic, and Coconut credentials provides multi-layered privacy guarantees. The trade-off is higher latency compared to systems like Tor.*
