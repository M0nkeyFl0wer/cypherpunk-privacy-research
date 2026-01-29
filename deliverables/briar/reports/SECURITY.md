# Briar - Security Report

## Security Audits

### Radically Open Security (September-October 2023)
- **Commissioned by**: Open Technology Fund Security Lab
- **Type**: Crystal-box (white box) assessment
- **Scope**: Android and desktop clients, protocols, cryptography
- **Findings**: 6 issues total
  - 0 Extreme/High/Elevated risk
  - 1 Moderate risk
  - 5 Low risk
- **Retest**: February-March 2024 - 4 of 6 issues resolved
- **Remaining**: OTF-003, OTF-005 planned for future fixes

### Cure53 (March 2017)
- **Duration**: 6 testers, 13 days
- **Quote**: "Quality and readability of the app's source code was rather exceptional"
- **Quote**: "Good understanding of vulnerability patterns and threats"
- **Cryptography**: "Found to be exceptionally clear and sound, with no vulnerabilities spotted"
- **Conclusion**: "Briar secure messenger can be recommended for use"
- **Status**: All issues addressed in beta release

## Cryptography

### Bramble Protocol Suite
Custom delay-tolerant networking stack:

| Protocol | Purpose |
|----------|---------|
| BHP | Bramble Handshake Protocol |
| BQP v4 | Bramble QR Code Protocol |
| BRP | Bramble Rendezvous Protocol |
| BSP | Bramble Synchronisation Protocol |
| BTP v4 | Bramble Transport Protocol |

### BTP Security Properties
- Confidentiality
- Integrity
- Authenticity
- Forward secrecy (periodic key rotation)

### Cryptographic Primitives
| Component | Algorithm |
|-----------|-----------|
| Hash/PRF | BLAKE2b |
| Signatures | Ed25519 |
| Message padding | 1024 bytes (vs Signal's 160) |

## Security Model

### Threat Model
- Designed for journalist/activist use cases
- Assumes adversary may control network
- Works without internet infrastructure

### Strengths
- No central servers (no single point of compromise)
- Tor integration for anonymity
- Bluetooth/Wi-Fi fallback during shutdowns
- Two independent security audits with good results
- Reproducible builds

### Limitations
- No iOS support (Apple platform restrictions)
- Both parties must be online simultaneously (mitigated by Mailbox)
- Smaller user base = smaller anonymity set

## Sources
- https://cure53.de/pentest-report_briar.pdf
- https://www.opentech.fund/security-safety-audits/briar-security-audit/
- https://code.briarproject.org/briar/briar-spec

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
