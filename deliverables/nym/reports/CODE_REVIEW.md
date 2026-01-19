# Code Review: NYM

**Last Updated**: 2026-01-19

---

## Repository Overview

| Repository | Description | Language |
|------------|-------------|----------|
| [nymtech/nym](https://github.com/nymtech/nym) | Main mixnet codebase | Rust |
| [nymtech/nym-vpn-client](https://github.com/nymtech/nym-vpn-client) | VPN client application | Rust |

---

## Open Source Status

- **License**: Apache 2.0
- **Fully Open Source**: Yes
- **Active Development**: Yes (commits as of Jan 2026)

---

## Primary Language: Rust

NYM is built primarily in Rust, providing:
- Memory safety without garbage collection
- High performance for network operations
- Strong type system for cryptographic code
- WebAssembly compilation support

---

## Key Components

### nym-node
The main binary that runs mixnet infrastructure:
- **Mixnode**: Shuffles Sphinx packets for privacy
- **Entry Gateway**: Entry point for traffic into mixnet
- **Exit Gateway**: Delivers traffic to final destination

### nym-wallet
Desktop wallet application:
- Built with Tauri framework
- Manages NYM tokens
- Node operator tools

### nym-cli
Command-line interface for:
- Interacting with the network
- Managing credentials
- Administrative tasks

### nym-explorer
Block explorer and network viewer:
- Mixnet statistics
- Node performance metrics
- Network health monitoring

---

## NymVPN Client

Cross-platform VPN application:
- **Framework**: Tauri (Rust + web frontend)
- **Protocols**:
  - Mixnet (5-hop anonymous routing)
  - WireGuard + AmneziaWG (fast tunneling)
- **Features**:
  - Zero-knowledge credentials
  - Metadata protection
  - Cross-platform (Windows, macOS, Linux, Android, iOS)

---

## Recent Releases

| Version | Date | Key Changes |
|---------|------|-------------|
| NymVPN v1.22.0 | Jan 2026 | Tauri 2.9.2, Rustc 1.91.0 |
| NymVPN v1.19.0 | Nov 2025 | Performance improvements |
| NymVPN v1.16.0 | Sep 2025 | Rustc 1.88.0 update |

---

## Code Quality Indicators

### Positive
- Memory-safe Rust implementation
- Active maintenance with regular releases
- Modular architecture (multiple crates)
- Documentation available

### Areas for Verification
- Third-party security audits not found in research
- Test coverage metrics not publicly available

---

## Deprecated Repositories

- **nym-mixnet**: Legacy Rust implementation, deprecated
- Use main `nymtech/nym` repository instead

---

## Build System

- Cargo (Rust package manager)
- CI/CD via GitHub Actions
- Multi-platform builds

---

## Sources

| Source | Type |
|--------|------|
| [GitHub - nymtech/nym](https://github.com/nymtech/nym) | Code |
| [GitHub - nymtech/nym-vpn-client](https://github.com/nymtech/nym-vpn-client) | Code |
| [NymVPN Releases](https://github.com/nymtech/nym-vpn-client/releases) | Releases |

---

*Constitutional Research Note: NYM maintains a fully open-source codebase in Rust with active development. The use of Rust provides memory safety guarantees important for security-critical networking code. Specific audit reports were not found during research.*
