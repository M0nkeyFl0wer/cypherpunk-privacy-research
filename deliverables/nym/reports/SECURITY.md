# Security Analysis: Nym Mixnet

**Last Updated**: 2026-01-28
**Security Posture**: Strong (multiple audits, active remediation)

---

## Executive Summary

Nym has undergone extensive security scrutiny with four independent audits since 2021. The most comprehensive audit by Cure53 (July 2024) identified 43 findings including 5 critical vulnerabilities in the Coconut credential system and gateway encryption. All critical and high-severity issues have been remediated. The VPN component received an "excellent security posture" rating.

---

## Security Audit History

### Cure53 Comprehensive Audit (July 2024)

| Attribute | Detail |
|-----------|--------|
| Auditor | Cure53 (Germany) |
| Duration | 56 working days |
| Team Size | 6 senior security experts |
| Methodology | Crystal-box (full source access) |
| Report | [cure53.de/audit-report_nym.pdf](https://cure53.de/audit-report_nym.pdf) |

**Scope Coverage**:
- WP1: Mobile apps (Android/iOS)
- WP2: Desktop apps (Windows, Linux, macOS)
- WP3: Backend API and infrastructure
- WP4: VPN software and infrastructure
- WP5: Cryptographic implementations

**Findings Summary**:
| Severity | Count | Status |
|----------|-------|--------|
| Critical | 5 | All Remediated |
| High | 2 | All Remediated |
| Medium | 12 | Addressed |
| Low | 24 | Addressed |
| **Total** | **43** | - |

#### Critical Vulnerabilities (All Fixed)

**NYM-01-027: Nonce-key reuse in AES-CTR (Gateway)**
- **Issue**: XOR-based attacks possible due to nonce reuse
- **Impact**: Potential plaintext recovery in gateway communications
- **Fix**: Migrated to AES-256-GCM-SIV in release 2024.12-aero
- **Status**: Verified fixed

**NYM-01-009: BLS12-381 EC signature bypasses (Coconut)**
- **Issue**: Signature verification could be bypassed in credential library
- **Impact**: Potential credential forgery
- **Fix**: Additional verification checks in release 2024.13-magura
- **Practical Risk**: Low (protocol design prevented exploitation)
- **Status**: Verified fixed

**NYM-01-014: Partial signature bypass (Offline eCash)**
- **Issue**: Incomplete signature validation in eCash protocol
- **Impact**: Potential double-spend attacks
- **Fix**: Enhanced signature validation
- **Status**: Verified fixed

**NYM-01-033: Pointcheval-Sanders signature forgery**
- **Issue**: Theoretical forgery vulnerability in credential scheme
- **Impact**: Credential forgery possible in theory
- **Fix**: Additional checks implemented
- **Practical Risk**: None (relies on private attributes not used in practice)
- **Status**: Verified fixed

**NYM-01-042: Invalid eCash signature aggregation**
- **Issue**: Missing infinity point checks in aggregate signatures
- **Impact**: Invalid credential acceptance
- **Fix**: Infinity point validation added
- **Status**: Verified fixed

#### High-Severity Vulnerabilities (All Mitigated)

**NYM-01-030: Gateway skips credential serial number check**
- **Issue**: Serial numbers not validated at gateway level
- **Impact**: Potential credential reuse
- **Mitigation**: Offline eCash protocol design + 1-week credential expiration
- **Status**: Mitigated by design

**NYM-01-032: Bloom filter false positives**
- **Issue**: Parameter choices caused excessive false positives
- **Resolution**: Code removed due to performance overhead
- **Status**: Resolved (code removed)

#### Component Assessments

| Component | Rating | Notes |
|-----------|--------|-------|
| VPN Software (WP4) | Excellent | No vulnerabilities found |
| Desktop Apps (WP2) | Good | No significant security flaws |
| Mobile Apps (WP1) | Good | Minor issues only |
| Backend API (WP3) | Moderate | Manageable issues |
| Cryptography (WP5) | Requires attention | Critical issues found, all fixed |

---

### Oak Security Smart Contract Audit (December 2022)

| Attribute | Detail |
|-----------|--------|
| Auditor | Oak Security (Germany) |
| Duration | 2 weeks |
| Team Size | 4 security experts |
| Scope | Mixnet contracts, Vesting contracts |
| Report Published | March 27, 2023 |

**Findings Summary**:
| Severity | Count | Status |
|----------|-------|--------|
| Critical/Major | 9 | All Resolved |
| Minor/Info | 10 | Addressed |
| **Total** | **19** | - |

**Key Issues Identified**:
- Unbounded iteration in TrackUndelegation message handling
- Signature replay attacks
- Key collision risks
- Unauthorized family membership additions

**Resolution**: Nym team swiftly addressed all critical and major issues. Oak Security verified and approved fixes.

---

### Cryspen Cryptographic Audit (2023-2024)

| Attribute | Detail |
|-----------|--------|
| Auditor | Cryspen |
| Scope | Cryptographic implementations |
| Status | Completed |

Focus on formal verification and cryptographic correctness.

---

### Jean-Philippe Aumasson Review (2021)

| Attribute | Detail |
|-----------|--------|
| Auditor | Jean-Philippe Aumasson (noted cryptographer) |
| Scope | Initial cryptography review |
| Status | Completed |

Early-stage review of cryptographic design choices.

---

## Privacy Threat Model

### What Nym Protects Against

| Threat | Protection Level | Mechanism |
|--------|-----------------|-----------|
| Global passive adversary | Strong | Mixnet routing, cover traffic |
| Traffic analysis | Strong | Sphinx packets, timing delays |
| Timing correlation | Strong | Poisson-distributed delays |
| Metadata collection | Strong | Unlinkable packet format |
| ISP-level monitoring | Strong | Encrypted hops |
| Node-level compromise | Partial | Requires majority compromise |

### What Nym Does NOT Protect Against

| Threat | Limitation |
|--------|------------|
| Compromised endpoints | Application-level security needed |
| Malware on user device | Outside network layer scope |
| Application data leaks | Depends on integrated apps |
| Active attacks by majority nodes | Decentralization mitigates |
| Real-time applications | Latency trade-off |

---

## Cryptographic Security

### Algorithm Choices

| Component | Algorithm | Security Level |
|-----------|-----------|----------------|
| Key Exchange | X25519 | 128-bit equivalent |
| Identity | Ed25519 | 128-bit equivalent |
| Packet Encryption | AES-128-CTR | 128-bit |
| Gateway Encryption | AES-256-GCM-SIV | 256-bit, nonce-misuse resistant |
| Hashing | BLAKE3 | 256-bit output |
| Credentials | BLS12-381 | ~128-bit pairing security |

### Post-Cure53 Improvements

1. **AES-CTR to AES-GCM-SIV**: Upgraded gateway encryption to nonce-misuse resistant mode
2. **BLS12-381 validation**: Added infinity point and signature bypass checks
3. **Credential expiration**: 1-week limit reduces replay window

---

## Network Security Model

### Mixnet Architecture

```
Client → Entry Gateway → Mix Layer 1 → Mix Layer 2 → Mix Layer 3 → Exit Gateway → Destination
            │                                                              │
            └──────── Each hop knows only previous and next ───────────────┘
```

### Trust Assumptions

| Assumption | Implication |
|------------|-------------|
| Honest majority of mix nodes | Security degrades if >50% malicious |
| Decentralized node operation | Permissionless staking reduces central control |
| Cryptographic hardness | Standard assumptions (ECDLP, etc.) |

### Node Operator Security

| Measure | Purpose |
|---------|---------|
| NYM token staking | Economic incentive for honesty |
| Reputation system | Quality-based node selection |
| Geographic diversity | Reduces jurisdiction risks |
| Uptime requirements | Ensures network reliability |

---

## Operational Security Recommendations

### For Node Operators

1. **Hardware**: Dedicated server, not shared hosting
2. **Network**: DDoS protection, rate limiting
3. **Updates**: Apply releases promptly (security fixes)
4. **Monitoring**: Watch for unusual traffic patterns
5. **Key Management**: Secure sphinx key storage

### For Users

1. **Enable cover traffic**: Maximum privacy requires cover traffic
2. **Verify downloads**: Check signatures/checksums
3. **Keep updated**: Security patches in regular releases
4. **Understand limitations**: Mixnet protects network layer, not applications

### For Developers

1. **SDK integration**: Use official SDKs with cover traffic enabled
2. **Credential handling**: Follow zeroization patterns for sensitive data
3. **Error handling**: Don't leak timing information in error paths

---

## Vulnerability Disclosure

### Responsible Disclosure Process

| Method | Contact |
|--------|---------|
| Email | security@nym.com |
| Encryption | Required (PGP) |

### PGP Key Details

| Attribute | Value |
|-----------|-------|
| Key ID | 7C3C727F05090550 |
| Fingerprint | 24B2592E801A5AAA8666C8BA7C3C727F05090550 |
| Type | RSA 4096-bit |
| Expiration | October 29, 2026 |

**Important**: Do not open public GitHub issues for security vulnerabilities. Use encrypted email for responsible disclosure.

---

## Comparison to Alternatives

### Nym vs Tor

| Aspect | Nym | Tor |
|--------|-----|-----|
| Packet format | Sphinx | Onion |
| Cover traffic | Yes | No |
| Timing obfuscation | Strong (Poisson delays) | Limited |
| Traffic analysis resistance | Higher | Moderate |
| Latency | Higher (100ms-2s) | Lower (~200ms) |
| Economic incentives | NYM token | Volunteer-based |
| Audit history | Multiple recent audits | Extensive history |

### Nym vs VPNs

| Aspect | Nym Mixnet | Traditional VPN |
|--------|-----------|-----------------|
| Provider trust | Minimal (decentralized) | Full trust required |
| Metadata protection | Strong | None |
| Traffic analysis | Resistant | Vulnerable |
| IP hiding | Yes | Yes |
| Performance | Lower throughput | High throughput |

---

## Known CVEs

**Public CVEs**: None identified as of 2026-01-28

**Dependency Vulnerabilities**:
| Advisory | Package | Severity | Impact on Nym |
|----------|---------|----------|---------------|
| RUSTSEC-2023-0071 | rsa v0.9.10 | Medium | None (transitive, not used in core protocol) |

---

## Security Roadmap

Based on Cure53 recommendations and Nym's public statements:

1. **Continuous monitoring**: Nightly security audits via CI/CD
2. **Dependency management**: Migration from unmaintained crates
3. **Formal verification**: Expanded use of Cryspen-style proofs
4. **Bug bounty**: Consider public program for ongoing research

---

## Sources

| Source | Type | Date |
|--------|------|------|
| [Cure53 Audit Report](https://cure53.de/audit-report_nym.pdf) | Security Audit | July 2024 |
| [Nym Cure53 Response](https://nym.com/trust-center/Cure53-security-audit-2024) | Official | 2024 |
| [Oak Security Audit](https://nym.com/trust-center/oak-security-audit-contracts-2023) | Security Audit | March 2023 |
| [Nym Security Blog](https://nym.com/blog/Nym-security-audits-2023-2024) | Official | 2024 |
| [SECURITY.md](https://github.com/nymtech/nym/blob/develop/SECURITY.md) | Code | Current |

---

*Nym demonstrates a mature security posture with transparent disclosure of audit findings and rapid remediation. The comprehensive Cure53 audit provides confidence in the current implementation, while the academic pedigree of the team ensures ongoing cryptographic rigor.*
