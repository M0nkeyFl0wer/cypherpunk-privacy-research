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

## Actual Code Analysis (January 2026)

Analysis performed via direct code inspection on cloned repository.

### Dependency Vulnerability Scan

```bash
$ cargo audit (nym)
```

| Metric | Result |
|--------|--------|
| Dependencies Scanned | 1,133 |
| Vulnerabilities Found | **1** |
| Unmaintained Warnings | 10 |

**VULNERABILITY FOUND**:

| Advisory | Package | Severity | Issue |
|----------|---------|----------|-------|
| RUSTSEC-2023-0071 | `rsa` v0.9.10 | Medium | Marvin Attack timing sidechannel |

**Details**: The `rsa` crate has a non-constant-time implementation that leaks key information through timing. However, **NYM's core Sphinx protocol uses x25519, not RSA**. The RSA dependency appears to be transitive.

### Sphinx Packet Cryptography

**Core Implementation**: `common/nymsphinx/`

NYM uses a layered Sphinx packet format with x25519:

```rust
// common/cosmwasm-smart-contracts/mixnet-contract/src/mixnode.rs:582
/// Base58-encoded x25519 public key used for sphinx key derivation.
pub sphinx_key: SphinxKey,
```

**Cryptographic Primitives**:

| Component | Algorithm | Standard |
|-----------|-----------|----------|
| Key Exchange | x25519 | RFC 7748 |
| Packet Encryption | Sphinx | Academic (Danezis & Goldberg) |
| Node Identity | Ed25519 | RFC 8032 |

### Mixnet Architecture

**From code analysis**:

```
Client → Gateway → Mix1 → Mix2 → Mix3 → Exit Gateway → Destination
            ↑
      Sphinx packets with layered encryption
```

Each hop can only decrypt its layer, learning only:
- Previous hop
- Next hop
- Nothing about source or destination

### Memory Safety

**Language**: Rust (memory-safe by design)

| Concern | Status |
|---------|--------|
| Unsafe blocks | Minimal (audit recommended) |
| Memory leaks | Prevented by ownership |
| Buffer overflows | Compiler-prevented |

### E2E Coverage

| Feature | Protection |
|---------|------------|
| Message Content | Encrypted (Sphinx) |
| Metadata | Hidden (mixnet routing) |
| Traffic Analysis | Mitigated (cover traffic) |
| Timing Analysis | Mitigated (delays) |

### Unmaintained Dependencies (Non-Security)

| Crate | Advisory |
|-------|----------|
| ansi_term | RUSTSEC-2021-0139 |
| bincode | RUSTSEC-2025-0141 |
| derivative | RUSTSEC-2024-0388 |
| gcc | RUSTSEC-2025-0121 |
| instant | RUSTSEC-2024-0384 |
| opentelemetry-jaeger | RUSTSEC-2025-0123 |
| paste | RUSTSEC-2024-0436 |
| rustls-pemfile | RUSTSEC-2025-0134 |

These are maintenance warnings, not security vulnerabilities.

### Recommendations

1. **RSA Dependency**: Investigate if RSA can be removed or if the transitive usage is in a non-critical path
2. **Dependency Updates**: Several unmaintained crates should be migrated to alternatives
3. **Security Audit**: External audit recommended for Sphinx implementation

---

*Constitutional Research Note: NYM maintains a fully open-source codebase in Rust with active development. The use of Rust provides memory safety guarantees important for security-critical networking code. One transitive dependency vulnerability (RSA timing sidechannel) was identified but doesn't affect core Sphinx cryptography which uses x25519.*
