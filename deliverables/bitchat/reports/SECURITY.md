# Security Analysis: Bitchat

**Last Updated**: 2026-01-22

---

## Critical Security Notice

**Bitchat has NOT received a formal external security audit.** The project's own disclaimer states:

> "This software has not received external security review and may contain vulnerabilities and does not necessarily meet its stated security goals. Do not use it for production use, and do not rely on its security whatsoever until it has been reviewed."

---

## Known Vulnerabilities

### BITCHAT-2025-001: Identity Authentication Bypass
**Severity**: CRITICAL
**Disclosed**: 2025-07-09
**Researcher**: Alex Radocea

**Description**: Ephemeral keys were not verified against identity keys, enabling man-in-the-middle impersonation attacks.

**Status**: In progress - migrating to Noise Protocol Framework
**Response Time**: Acknowledged

---

### BITCHAT-2025-002: Insufficient Forward Secrecy
**Severity**: HIGH
**Disclosed**: 2025-07-09

**Description**: Session-level forward secrecy only, not per-message. No Double Ratchet algorithm implemented.

**Impact**: If session key is compromised, all messages in that session can be decrypted (unlike Signal which uses per-message ratcheting).

**Status**: Acknowledged - design limitation

---

### BITCHAT-2025-003: Master Key Single Point of Failure
**Severity**: HIGH
**Disclosed**: 2025-07-09

**Description**: Single master key compromise = total permanent access. No key rotation mechanism.

**Status**: Design limitation

---

### BITCHAT-2025-004: Buffer Overflow
**Severity**: MEDIUM
**Disclosed**: 2025-07-09

**Description**: Memory corruption vulnerability in message handling.

**Status**: PATCHED
**Response Time**: 4 hours

---

## Third-Party Security Analysis

### Trail of Bits (2025-07-18)
**Assessment**: "Vulnerabilities are legitimate and concerning, fundamental design flaws, but early signs promising for fixes"

**Source**: [Trail of Bits Blog](https://blog.trailofbits.com/2025/07/18/building-secure-messaging-is-hard-a-nuanced-take-on-the-bitchat-security-debate/)

---

## Cryptographic Architecture

### Noise Protocol Framework (Current)
| Component | Implementation |
|-----------|----------------|
| Handshake Pattern | XX (mutual authentication) |
| Cipher | ChaCha20-Poly1305 (AEAD) |
| Key Exchange | X25519 (Curve25519) |
| Hash | SHA-256 |
| Key Derivation | HKDF-SHA256 |
| Rekey Trigger | 1 hour or 10,000 messages |

### Nostr Integration (NIP-17)
- Gift-wrapped messages for metadata privacy
- 290+ relay support
- Public/private key pairs (secp256k1)

### Privacy Features
| Feature | Implementation |
|---------|----------------|
| Dummy Messages | 30-120 second intervals |
| Timing Jitter | 50-500ms random delays |
| Message Padding | PKCS#7-style |
| Metadata | TTL and message ID only |

---

## Security vs. Signal Protocol Comparison

| Feature | Bitchat | Signal |
|---------|---------|--------|
| Forward Secrecy | Session-level | Per-message (Double Ratchet) |
| Post-Compromise Security | ❌ No | ✅ Yes |
| Key Rotation | Manual only | Automatic |
| Formal Verification | ❌ No | ✅ Yes |
| External Audit | ❌ No | ✅ Multiple |
| Open Source | ✅ Yes | ✅ Yes |

---

## Security Infrastructure

### Code-Level Security
| Component | File |
|-----------|------|
| Rate Limiting | NoiseRateLimiter.swift |
| Replay Protection | MessageDeduplicationService.swift |
| Key Storage | KeychainManager.swift (iOS Keychain) |
| Validation | NoiseSecurityValidator.swift |

### Dependencies
| Package | Version | Security Status |
|---------|---------|-----------------|
| swift-secp256k1 | 0.21.1 | ✅ Active maintenance |
| Arti (Tor) | Local | ⚠️ Beta status |

---

## Audit Status

| Type | Status |
|------|--------|
| External Security Audit | ❌ Not completed |
| Formal Verification | ❌ Not completed |
| Bug Bounty Program | ❌ Not available |
| Internal Code Review | ✅ GitHub PR process |

### Security-Experienced Contributors
- Nadim Kobeissi (Cure53 background, 250+ audits)
- Community security researchers

---

## Vulnerability Response

### Disclosed Issues Response Time
| Vulnerability | Response Time | Resolution |
|--------------|---------------|------------|
| Buffer Overflow | 4 hours | Patched |
| Identity Bypass | Days | In progress |
| Forward Secrecy | Acknowledged | Design limitation |

---

## Recommendations

### For Users
1. **Do NOT use for high-risk communications** until external audit
2. Use for low-stakes messaging only
3. Understand limitations vs. Signal
4. Keep app updated

### For Bitchat Team
1. Commission external security audit
2. Implement Double Ratchet for per-message forward secrecy
3. Add key rotation mechanism
4. Establish bug bounty program
5. Complete Noise Protocol migration

---

## Risk Assessment

| Finding | Severity | Notes |
|---------|----------|-------|
| No external audit | HIGH | Fundamental concern |
| Identity bypass vuln | CRITICAL | Being addressed |
| No Double Ratchet | HIGH | Design limitation |
| Master key SPOF | HIGH | No rotation |
| 4-hour patch response | ✅ Good | Quick response |
| Open source | ✅ Good | Community review possible |

---

## Sources

| Source | Type |
|--------|------|
| [Trail of Bits Analysis](https://blog.trailofbits.com/2025/07/18/building-secure-messaging-is-hard-a-nuanced-take-on-the-bitchat-security-debate/) | Security Research |
| [TechCrunch - Security Issues](https://techcrunch.com/2025/07/09/jack-dorsey-says-his-secure-new-bitchat-app-has-not-been-tested-for-security/) | News |
| [GitHub - BRING_THE_NOISE.md](https://github.com/permissionlesstech/bitchat/blob/main/BRING_THE_NOISE.md) | Official |
| [Whitepaper](https://github.com/permissionlesstech/bitchat/blob/main/WHITEPAPER.md) | Official |

---

*Constitutional Research Note: Despite security concerns, Bitchat represents an interesting experiment in offline-capable encrypted messaging. The team's quick response to the buffer overflow (4 hours) shows commitment, but the fundamental design limitations (no Double Ratchet, no key rotation) require users to accept different security trade-offs than Signal.*
