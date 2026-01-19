# Signal

## Description
Signal is an open-source, cross-platform encrypted messaging application that has become the gold standard for secure private communication. Developed by the Signal Technology Foundation, it pioneered the Signal Protocol - an end-to-end encryption system now used by billions of people through WhatsApp, Google Messages, Facebook Messenger, and Skype.

As of January 2025, Signal has approximately 70 million monthly active users and has been downloaded over 220 million times. The application is notably installed by default on CIA employee devices and is used for sensitive communications worldwide.

## Links
- **Website**: https://signal.org
- **Documentation**: https://signal.org/docs/
- **GitHub**: https://github.com/signalapp
- **Blog**: https://signal.org/blog/

## Category
Privacy Infrastructure (Encrypted Messaging / Cryptographic Protocol)

## Ecosystem
Non-blockchain (Traditional Privacy Technology)

## Key Features

### Signal Protocol
- **End-to-End Encryption**: All messages encrypted by default
- **Double Ratchet Algorithm**: Provides forward secrecy and post-compromise security
- **Extended Triple Diffie-Hellman (X3DH)**: Secure key agreement
- **Post-Quantum Cryptography**: SPQR/Triple Ratchet implementation (2023+)
- **Zero-Knowledge Group Credentials**: Private group membership

### Privacy Features
- Disappearing messages
- Sealed sender (metadata protection)
- Screen security (screenshot prevention)
- Registration lock
- Safety numbers verification

## Project Status
**Status**: Production (Active Development)

### Key Milestones
| Date | Event |
|------|-------|
| Jul 2014 | Signal released for iOS |
| Nov 2015 | Signal for Android released |
| Feb 2018 | Signal Foundation established ($50M from Brian Acton) |
| Jan 2022 | Moxie Marlinspike steps down as CEO |
| Sep 2022 | Meredith Whittaker becomes President |
| Sep 2023 | Post-quantum encryption (PQXDH) added |

## Team
See [TEAM.md](reports/TEAM.md) for detailed team information.

### Leadership
- **Moxie Marlinspike** - Founder, Former CEO (stepped down 2022)
- **Brian Acton** - Co-founder Signal Foundation, CEO
- **Meredith Whittaker** - President

## Technical Details
See [TECHNICAL.md](reports/TECHNICAL.md) for technical documentation.

## Security
See [SECURITY.md](reports/SECURITY.md) for security analysis.

## Code Review
See [CODE_REVIEW.md](reports/CODE_REVIEW.md) for repository analysis.

## GitHub Metrics

| Repository | Stars | Language |
|------------|-------|----------|
| Signal-Android | 28.2k | Kotlin |
| Signal-Desktop | 15.9k | TypeScript |
| Signal-iOS | 11.8k | Swift |
| Signal-Server | 10.3k | Java |
| libsignal | 5.3k | Rust |

## Protocol Adoption
The Signal Protocol is used by:
- **WhatsApp** (2+ billion users)
- **Facebook Messenger** (Secret Conversations)
- **Google Messages** (RCS encryption)
- **Skype** (Private Conversations)

## Organization
**Signal Technology Foundation**
- Type: 501(c)(3) Non-profit
- Founded: February 21, 2018
- Initial Funding: $50M loan from Brian Acton (WhatsApp co-founder)
- Mission: "Protect free expression and enable secure global communication through open source privacy technology"

---
*Research completed with Constitutional Research v2.0.0*
*Last updated: 2026-01-19*
