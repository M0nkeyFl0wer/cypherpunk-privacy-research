# Security Analysis: Confer

**Last Updated**: 2026-01-19

---

## Security Architecture

Confer implements a novel privacy architecture for AI assistants:

### End-to-End Encryption
- Prompts encrypted on user's device before transmission
- Uses WebAuthn passkey system for key derivation
- Keys never leave user's control

### Trusted Execution Environment (TEE)
- Hardware-enforced isolation
- Host machine cannot access TEE memory
- Processing occurs in secure enclave
- Response generated in isolated environment

---

## How It Differs from ChatGPT

| Aspect | Confer | ChatGPT |
|--------|--------|---------|
| Prompt Access | Encrypted, inaccessible | Visible to OpenAI |
| Server Access | TEE isolated | Full server access |
| Training | Not used for training | May be used |
| Operator View | Cannot read | Can read |

---

## Verification

### Open Source
- Entire codebase is open source
- Anyone can clone repository
- Reproducible builds available

### Attestation
- Build measurements can be verified
- Compare local build to running servers
- Cryptographic verification of TEE integrity

---

## Limitations

### Platform Support
WebAuthn passkeys work best on:
- macOS Sequoia
- iOS
- Android

Windows/Linux require third-party authenticator (password manager)

### New Technology
- Launched December 2025
- Limited track record
- TEE security depends on hardware vendor

---

## Founder Credibility

Moxie Marlinspike's track record:
- Created Signal (gold standard for messaging)
- Co-authored Signal Protocol (used by billions)
- Strong cryptographic credentials
- Consistent privacy advocacy

---

## Sources

| Source | Type |
|--------|------|
| [TechCrunch](https://techcrunch.com/2026/01/18/moxie-marlinspike-has-a-privacy-conscious-alternative-to-chatgpt/) | News |
| [TIME](https://time.com/7346534/signal-confer-ai-moxie-marlinspike/) | News |
| [Confer Blog](https://confer.to/blog) | Official |

---

*Constitutional Research Note: Confer represents a significant privacy innovation for AI assistants. The combination of E2E encryption and TEE processing addresses a major gap in AI privacy. The founder's credentials (Moxie Marlinspike) provide strong credibility, though the product is new and long-term track record is pending.*
