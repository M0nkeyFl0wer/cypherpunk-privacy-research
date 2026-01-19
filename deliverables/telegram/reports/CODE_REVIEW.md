# Code Review: Telegram

**Last Updated**: 2026-01-19

---

## Open Source Status

### Open Source Components
| Component | License | Repository |
|-----------|---------|------------|
| Desktop Client | GPL v2 | telegramdesktop/tdesktop |
| Android Client | GPL v2 | TelegramMessenger (various) |
| iOS Client | GPL v2 | TelegramMessenger (various) |
| TDLib | Boost 1.0 | tdlib/td |
| Web Clients | GPL v3 | Various |

### Closed Source
- Server infrastructure
- Backend code
- MTProto server implementation

---

## Key Repository: tdesktop

**URL**: https://github.com/telegramdesktop/tdesktop
**Stars**: 29,577
**Language**: C++
**License**: GPL v2

### Build Verification
Telegram claims apps can be verified as built from GitHub source through reproducible builds.

---

## TDLib

Cross-platform library for building Telegram clients:
- **License**: Boost Software License 1.0
- **Languages**: C++ with bindings for many languages
- **Purpose**: Enables third-party client development

---

## Protocol Documentation

MTProto is documented at core.telegram.org but is:
- Proprietary (not an open standard)
- Developed internally
- Not independently standardized

---

## Actual Code Analysis (January 2026)

Analysis performed via direct code inspection on cloned tdesktop repository.

### Cryptographic Implementation Analysis

**Critical File**: `Telegram/SourceFiles/mtproto/mtproto_auth_key.cpp`

#### SHA-1 Usage (DEPRECATED for cryptographic use)

```cpp
void AuthKey::prepareAES_oldmtp(const MTPint128 &msgKey, MTPint256 &aesKey, MTPint256 &aesIV, bool send) const {
    bytes::array<20> sha1_a, sha1_b, sha1_c, sha1_d;
    // ...
    openssl::Sha1To(sha1_a, data_a);
    openssl::Sha1To(sha1_b, data_b);
    openssl::Sha1To(sha1_c, data_c);
    openssl::Sha1To(sha1_d, data_d);
    // Key derived by concatenating SHA1 hash fragments
    memcpy(key, sha1_a.data(), 8);
    memcpy(key + 8, sha1_b.data() + 8, 12);
    // ...
}
```

**SHA-1 Instances in MTProto**:

| File | SHA1 Calls | Purpose |
|------|------------|---------|
| mtproto_auth_key.cpp | 5 | AES key derivation, key ID generation |
| mtproto_dc_key_creator.cpp | 8 | DC key creation |
| mtproto_rsa_public_key.cpp | 1 | RSA fingerprinting |
| mtproto_dc_key_binder.cpp | 1 | Key binding |

**Total**: 29+ SHA-1 usages across MTProto codebase (many in cryptographically critical paths)

**Contrast**: Signal uses SHA-256 exclusively in core protocol; SHA-1 only available as generic utility.

### Memory Safety Analysis

**Language**: C++ (manual memory management required)

| Metric | Count | Risk Level |
|--------|-------|------------|
| `memcpy` in MTProto | 69 | Medium-High |
| `malloc/free` patterns | Present | Medium |
| Manual offset calculations | Extensive | Medium |

**Example of Manual Memory Operations** (mtproto_auth_key.cpp:69-75):

```cpp
memcpy(key, sha1_a.data(), 8);
memcpy(key + 8, sha1_b.data() + 8, 12);
memcpy(key + 8 + 12, sha1_c.data() + 4, 12);
memcpy(iv, sha1_a.data() + 8, 12);
memcpy(iv + 12, sha1_b.data(), 8);
memcpy(iv + 12 + 8, sha1_c.data() + 16, 4);
memcpy(iv + 12 + 8 + 4, sha1_d.data(), 8);
```

**Risk**: Off-by-one errors or buffer overflows possible if any offset calculations are incorrect.

**Contrast**: Signal's Rust implementation has zero unsafe blocks in protocol code; compiler enforces memory safety.

### Key Derivation Comparison

| Aspect | Telegram MTProto | Signal Protocol |
|--------|-----------------|-----------------|
| Key Derivation | Custom (SHA1/SHA256 concat) | HKDF-SHA256 (RFC 5869) |
| Hash Function | SHA-1 in legacy paths | SHA-256 only |
| Standard Compliance | Proprietary | RFC-compliant |
| Post-Quantum | None | CRYSTALS-KYBER-1024 |

### E2E Encryption Coverage

| Feature | E2E Status | Notes |
|---------|------------|-------|
| 1:1 Cloud Chats | NOT E2E | Server can read |
| Group Chats | NOT E2E | Server can read |
| Secret Chats | E2E (opt-in) | Manual activation required |
| Voice Calls | E2E | |
| Video Calls | E2E | |
| File Transfers | NOT E2E | Unless in Secret Chat |

**Critical Finding**: Regular Telegram chats are NOT end-to-end encrypted. Messages are encrypted client-to-server but **Telegram servers can read message content**.

**Contrast**: Signal encrypts ALL messages end-to-end by default.

### Static Analysis Results

```bash
$ semgrep --config auto Telegram/SourceFiles/mtproto/
```

| Finding | Count |
|---------|-------|
| Default ruleset matches | 0 |

Note: Semgrep default rules may not cover custom cryptographic implementations. Manual review identified concerns above.

### Academic Security Research

**Royal Holloway/ETH Zurich (2021)**:
Published analysis found MTProto 2.0:
- "Fell short of providing key indistinguishability"
- Timing side-channel vulnerabilities
- Reordering attack possible under certain conditions

**CVEs**:
- **CVE-2024-7014** ("EvilVideo"): Malicious video could execute code
- Multiple XSS vulnerabilities in web clients

---

## Comparison Summary: Telegram vs Signal

| Aspect | Telegram | Signal |
|--------|----------|--------|
| Protocol | Custom MTProto | Signal Protocol (open standard) |
| Hash Functions | SHA-1 in critical paths | SHA-256 only |
| Key Derivation | Custom concatenation | HKDF (RFC 5869) |
| Post-Quantum | None | CRYSTALS-KYBER-1024 |
| Memory Safety | C++ (manual) | Rust (compiler-enforced) |
| E2E Default | No (opt-in Secret Chats) | Yes (all messages) |
| Server Code | Closed source | Open source |
| Formal Verification | None published | Published F* proofs |

---

## Sources

| Source | Type |
|--------|------|
| [GitHub - tdesktop](https://github.com/telegramdesktop/tdesktop) | Official |
| [Telegram Apps](https://telegram.org/apps) | Official |

---

*Constitutional Research Note: While Telegram's clients are open source, the proprietary server and protocol mean security claims cannot be fully verified.*
