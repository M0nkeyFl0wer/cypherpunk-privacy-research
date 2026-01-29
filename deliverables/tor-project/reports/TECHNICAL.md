# Tor Project - Technical Report

## How Tor Works

### Onion Routing
1. Client obtains list of relays from directory servers
2. Client builds 3-hop circuit: Guard → Middle → Exit
3. Each layer of encryption is "peeled" by each relay
4. Only exit relay sees destination; only guard knows client IP
5. Circuit rotates every ~10 minutes

### Key Properties
- **Forward Secrecy**: Compromising one relay doesn't compromise past traffic
- **No Single Point of Knowledge**: No relay sees both source and destination
- **TLS Between Relays**: All inter-relay communication encrypted

## Network Statistics
- **Relays**: 7,000+ volunteer-operated worldwide
- **Users**: Millions daily
- **Bandwidth**: Terabits per second aggregate

## Software Components

### Tor (Core Daemon)
- **Language**: C
- **Purpose**: Core routing software
- **Runs on**: Windows, macOS, Linux, various Unix

### Arti (New Implementation)
- **Language**: Rust
- **Purpose**: Memory-safe Tor client
- **Status**: Under active development
- **Latest**: Arti 1.9.0 (Jan 2026)

### Tor Browser
- **Base**: Firefox ESR (Extended Support Release)
- **Modifications**: NoScript, HTTPS-Only, anti-fingerprinting
- **Platforms**: Windows 10+, macOS 10.15+, Linux, Android
- **Latest**: Tor Browser 14.0

### Pluggable Transports
| Transport | Purpose |
|-----------|---------|
| obfs4 | Obfuscates traffic to look random |
| meek | Uses cloud services as fronting |
| snowflake | Uses WebRTC for censorship circumvention |

## Onion Services (Hidden Services)
- **.onion addresses**: Self-authenticating via public key hash
- **End-to-end encryption**: Traffic never leaves Tor network
- **Server anonymity**: Server location hidden from clients

## Protocol Specifications
- **Directory Protocol**: Consensus-based relay directory
- **Cell Protocol**: Fixed-size 512-byte cells
- **Stream Multiplexing**: Multiple TCP streams per circuit
- **Cryptography**: AES-128-CTR, SHA-1/SHA-256, RSA-1024/Ed25519

## Tails Integration (Sept 2024)
- Tails OS merged into Tor Project
- Provides amnesic live operating system
- All traffic routed through Tor

## iOS Limitations
- No official Tor Browser for iOS
- Onion Browser (third-party) recommended
- Apple restrictions prevent full Tor integration

## Repository Statistics (GitHub Mirror)
| Metric | Value |
|--------|-------|
| Stars (tor) | ~4,800 |
| Forks | ~957 |
| Note | Primary development on GitLab |

## Sources
- https://spec.torproject.org/tor-design
- https://gitlab.torproject.org/
- https://support.torproject.org/

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
