# DarkFi Security & Audits

*Research Date: 2026-01-28*

---

## Security Audits

### zkSecurity Audit (February 2024)

**Auditor**: [zkSecurity](https://www.zksecurity.xyz/)
**Date**: February 12-16, 2024
**Commit**: `ea50f9ac`
**Report**: [dark.fi/zksecurity-audit-q124.pdf](https://dark.fi/zksecurity-audit-q124.pdf)

#### Scope

The audit explicitly covered the design and implementation of cryptographic schemes used in:

| Component | Description |
|-----------|-------------|
| Money Contract | Token creation, transfers, atomic swaps, fees, PoW rewards |
| DAO Contract | Anonymous governance with proposals and voting |
| Deployooor Contract | Contract deployment and locking |
| Cryptographic Schemes | ZK circuits, signature schemes, encryption |

#### Critical Findings

| Finding | Description | Severity |
|---------|-------------|----------|
| DAO Proposal Nullifiers | Nullifiers could be reused, allowing potential double-voting or replay attacks | Critical |
| ElGamal MAC Weakness | Cryptographic weakness in message authentication code implementation | Critical |
| Weak Fiat-Shamir | Challenge construction lacks sufficient entropy, potentially enabling proof forgery | Critical |
| Deterministic Nonce | Nonces generated deterministically rather than randomly, risking key recovery | Critical |

#### Medium Findings

| Finding | Description | Severity |
|---------|-------------|----------|
| Unnecessary Deployment Proof | Redundant proof verification during contract deployment | Medium |

#### Auditor Assessment

> "Darkfi's codebase was found to be well-organized, with clarity provided by a large number of inline code comments."

#### Recommendations

1. **Nonce Generation**: Follow RFC 6979 (ECDSA) or RFC 8032 (EdDSA) for deterministic nonce generation
2. **Fiat-Shamir**: Strengthen challenge entropy in ZK proofs
3. **Nullifier System**: Implement proper nullifier tracking to prevent reuse
4. **ElGamal MAC**: Review and strengthen authentication mechanism

---

## Bug Bounty Program

**Status**: No public bug bounty program found

The project operates as open source under AGPL-3.0, encouraging security researchers to review and report issues through:
- GitHub Issues: [github.com/darkrenaissance/darkfi/issues](https://github.com/darkrenaissance/darkfi/issues)
- Direct contact through DarkIRC

---

## Security Architecture

### Zero-Knowledge Security

| Component | Implementation |
|-----------|----------------|
| Proof System | Halo2 (trusted setup-free) |
| Curve | Pallas (from Pasta curves) |
| Hash Function | Poseidon (ZK-friendly) |
| Commitments | Pedersen commitments |
| Merkle Trees | Poseidon-based sparse Merkle trees |

### Privacy Model

DarkFi implements privacy at the protocol level:

1. **Anonymous Transactions**: All transfers hide sender, receiver, and amount
2. **Nullifier System**: Prevents double-spending without revealing which coins are spent
3. **Zero-Knowledge Proofs**: Validate transactions without exposing details
4. **Anonymous DAO Voting**: Vote nullifiers prevent linking votes to voters

### Network Security

| Feature | Implementation |
|---------|----------------|
| Transport | TLS via rustls with ring crypto provider |
| Peer Discovery | Dynamic reseeding with session-based architecture |
| File Permissions | Unix-specific hardening (0o700) |
| State Integrity | Atomic transactions with overlay pattern |

---

## Known Attack Vectors

### Addressed by Design

| Attack | Mitigation |
|--------|------------|
| Double Spending | Nullifier tracking in Merkle trees |
| Front-running | Encrypted transaction contents |
| MEV Extraction | Anonymous transaction ordering |
| Sybil Attacks | PoW consensus with RandomX |

### Requires Further Hardening (per Audit)

| Attack | Status |
|--------|--------|
| Proof Forgery | Fiat-Shamir strengthening recommended |
| Key Recovery | Deterministic nonce improvement needed |
| Replay Attacks | DAO nullifier fix required |
| MAC Forgery | ElGamal MAC hardening needed |

---

## Cryptographic Primitives

### Elliptic Curve Cryptography

| Primitive | Standard |
|-----------|----------|
| Curve | Pallas (Pasta curves) |
| Operations | Addition, scalar multiplication variants |
| Signatures | Schnorr signatures |
| Key Derivation | EC-based public key derivation |

### Hash Functions

| Primitive | Use Case |
|-----------|----------|
| Poseidon | ZK-friendly hashing, nullifiers, coin commitments |
| BLAKE3 | Transaction hashing for signatures |
| Merkle Roots | Coin existence proofs |

### Commitment Schemes

| Scheme | Use Case |
|--------|----------|
| Pedersen | Value and token commitments with blinding factors |
| Poseidon-based | Coin hash commitments |

---

## Development Security Practices

### Code Quality

| Practice | Status |
|----------|--------|
| Open Source | AGPL-3.0 license |
| Version Control | Git with full commit history |
| Mirror Repository | Codeberg backup |
| Issue Tracking | GitHub Issues enabled |
| Fuzzing | Dedicated `fuzz/` directory |
| Testing | Integration tests in `tests/` |

### Build Security

| Requirement | Details |
|-------------|---------|
| Rust Version | 1.87.0+ (memory-safe language) |
| Dependencies | Auditable Cargo.lock |
| WASM Target | Isolated contract execution |
| Database | SQLCipher for encrypted storage |

---

## Current Security Status

### Project Phase

**Alpha Testnet** - Not recommended for production use with real funds

### Latest Release

- **Version**: app-0.3-alpha
- **Date**: 2025-11-01
- **Status**: Testing/Development

### Active Security Measures

1. **Continuous Development**: Daily commits with security improvements
2. **Open Source Review**: 53 contributors providing code review
3. **Professional Audit**: zkSecurity audit completed
4. **Fuzzing Infrastructure**: Active fuzz testing

---

## Recommendations for Users

### Current State

| Use Case | Recommendation |
|----------|----------------|
| Production | Not recommended (alpha software) |
| Testing | Use testnet only |
| Development | Suitable for experimentation |
| Research | Full source available for analysis |

### Security Checklist

- [ ] Understand alpha software risks
- [ ] Never use real funds on testnet
- [ ] Keep software updated
- [ ] Review zkSecurity audit findings
- [ ] Monitor GitHub for security patches

---

## Reporting Vulnerabilities

**Primary Channels**:
1. GitHub Issues (for non-critical): [github.com/darkrenaissance/darkfi/issues](https://github.com/darkrenaissance/darkfi/issues)
2. DarkIRC for private disclosure
3. Twitter [@DarkFiSquad](https://twitter.com/DarkFiSquad)

**Note**: As a privacy-focused project, DarkFi does not publicly advertise security contact emails. Researchers should use the community channels for responsible disclosure.

---

## Sources

| Source | Type |
|--------|------|
| [zkSecurity Audit Report](https://dark.fi/zksecurity-audit-q124.pdf) | Official Audit |
| [GitHub Repository](https://github.com/darkrenaissance/darkfi) | Source Code |
| [ZK Security Reviews Collection](https://github.com/nullity00/zk-security-reviews/blob/main/Darkfi/2024-darkfi-report.pdf) | Third-party Archive |
| [FOSDEM 2025 Presentation](https://archive.fosdem.org/2025/schedule/event/fosdem-2025-6632-darkfi-zero-knowledge-cryptography-for-anonymous-uncensored-organizations/) | Technical Presentation |
