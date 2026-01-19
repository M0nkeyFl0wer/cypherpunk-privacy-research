# Technical Analysis: Confer

**Last Updated**: 2026-01-19

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     USER DEVICE                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  1. User types prompt                           │    │
│  │  2. WebAuthn passkey derives encryption key     │    │
│  │  3. Prompt encrypted locally                    │    │
│  └─────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────┘
                         │ Encrypted
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   CONFER SERVERS                        │
│  ┌─────────────────────────────────────────────────┐    │
│  │            Trusted Execution Environment        │    │
│  │  ┌───────────────────────────────────────────┐ │    │
│  │  │ • Encrypted prompt received               │ │    │
│  │  │ • Decryption ONLY here                    │ │    │
│  │  │ • LLM processing                          │ │    │
│  │  │ • Response encrypted                      │ │    │
│  │  │ • Host CANNOT access this memory          │ │    │
│  │  └───────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────┘
                         │ Encrypted Response
                         ▼
┌─────────────────────────────────────────────────────────┐
│                     USER DEVICE                         │
│        Response decrypted with user's key               │
└─────────────────────────────────────────────────────────┘
```

---

## Key Technologies

### WebAuthn Passkeys
- Industry standard for passwordless authentication
- Uses device biometrics (Face ID, Touch ID)
- Key derivation for encryption
- Best support on Apple devices

### Trusted Execution Environment (TEE)
- Hardware security feature
- Isolated memory region
- Even OS/hypervisor cannot access
- Examples: Intel SGX, AMD SEV, ARM TrustZone

### Confidential Computing
- Processing sensitive data in encrypted form
- Decryption only in secure enclave
- Host infrastructure has no access

---

## Verification Model

### Open Source
```bash
# Clone repository
git clone [confer-repo]

# Build locally
make build

# Compare measurements to server attestation
# Cryptographic verification of running code
```

### Remote Attestation
- TEE provides cryptographic proof of code running
- Users can verify server runs published code
- Hardware-backed guarantees

---

## Comparison to Standard AI

### Traditional AI (ChatGPT, etc.)
```
User → [plaintext] → Server → [plaintext processing] → User
         ⚠️ Server sees everything
```

### Confer
```
User → [encrypted] → Server/TEE → [encrypted processing] → User
         ✅ Server sees nothing
```

---

## Limitations

1. **Hardware Dependency**: TEE security depends on chip manufacturer
2. **Side Channels**: Theoretical attacks on TEE exist (academic)
3. **Platform Support**: Best on modern Apple devices
4. **Latency**: Encryption/decryption adds overhead
5. **Cost**: $35/month vs $20 for ChatGPT

---

## Sources

| Source | Type |
|--------|------|
| [TechCrunch Article](https://techcrunch.com/2026/01/18/moxie-marlinspike-has-a-privacy-conscious-alternative-to-chatgpt/) | News |
| [Confer Blog](https://confer.to/blog) | Official |

---

*Constitutional Research Note: Confer's technical architecture represents state-of-the-art privacy for cloud AI. The combination of E2E encryption with TEE processing ensures meaningful privacy guarantees, though users should understand the hardware trust assumptions involved.*
