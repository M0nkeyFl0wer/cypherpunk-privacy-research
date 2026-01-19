# Confer

## Description
Confer is a privacy-focused AI assistant created by Moxie Marlinspike (the founder of Signal) launched in December 2025. Unlike ChatGPT and other AI assistants, Confer is designed so that even the operators cannot access user conversations.

As Marlinspike explains: "Chat interfaces like ChatGPT know more about people than any other technology before. When you combine that with advertising, it's like someone paying your therapist to convince you to buy something."

Confer uses end-to-end encryption combined with Trusted Execution Environments (TEE) to ensure prompts are encrypted before leaving the user's device and can only be decrypted in secure, isolated hardware environments.

## Links
- **Website**: https://confer.to
- **Blog**: https://confer.to/blog

## Category
Privacy Infrastructure (Privacy AI / Confidential Computing)

## Ecosystem
Non-blockchain (Traditional Privacy Technology)

## Key Features

### Privacy Architecture
- **End-to-End Encryption**: Prompts encrypted before leaving device
- **Confidential Computing**: TEE (Trusted Execution Environment) processing
- **Hardware Isolation**: Host machine cannot access TEE memory or state
- **WebAuthn Passkeys**: Face ID/Touch ID for key derivation
- **Verifiable**: Open source codebase, reproducible builds

### How It Works
1. User types prompt on device
2. Prompt encrypted using WebAuthn passkey
3. Encrypted data sent to Confer servers
4. Decryption only occurs inside TEE
5. Response generated in isolated environment
6. Response encrypted back to user

### Pricing
| Tier | Price | Limits |
|------|-------|--------|
| Free | $0 | 20 messages/day, 5 chats |
| Unlimited | $35/month | Unlimited + advanced models |

## Founder
**Moxie Marlinspike**
- Creator of Signal
- Co-author of Signal Protocol
- Cryptographer and privacy advocate
- Stepped down from Signal CEO in 2022

## Platform Support
- macOS (native)
- iOS (native)
- Android (native)
- Windows (requires authenticator)
- Linux (requires authenticator)

## Open Source
Confer's codebase is open source:
- Anyone can clone and rebuild
- Measurements can be verified against running servers
- Reproducible builds for transparency

## Comparison to ChatGPT

| Feature | Confer | ChatGPT |
|---------|--------|---------|
| E2E Encryption | Yes | No |
| Operator Access | No | Yes |
| TEE Processing | Yes | No |
| Price | $35/mo | $20/mo |
| Open Source | Yes | No |

## Privacy Philosophy
Marlinspike's thesis: "It's a form of technology that actively invites confession" - AI chatbots learn intimate details about users, making privacy critical rather than optional.

---
*Research completed with Constitutional Research v2.0.0*
*Last updated: 2026-01-19*
