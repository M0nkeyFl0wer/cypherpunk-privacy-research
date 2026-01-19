# Security Analysis: Proton Mail

**Last Updated**: 2026-01-19

---

## Security Overview

Proton Mail uses OpenPGP-compliant end-to-end encryption, meaning emails between Proton users are automatically encrypted. The service implements "zero-access encryption" where Proton cannot read user data.

---

## Encryption

### Email Encryption
| Type | Method | Protection |
|------|--------|------------|
| Proton-to-Proton | Automatic E2E | Full encryption |
| Proton-to-External | Optional password | Sender-controlled |
| External-to-Proton | Stored encrypted | At-rest encryption |

### Key Management
- Keys stored encrypted with user password
- Zero-access architecture
- PGP key export available

---

## Open Source & Audits

### Open Source Components
- **Web Interface**: MIT License - full source available
- **iOS App**: GPL v3
- **Android App**: GPL v3
- **Bridge**: Open source
- **gopenpgp**: High-level OpenPGP library

### Independent Audits
- Multiple third-party security audits conducted
- OpenPGP.js library widely reviewed
- Apps built from auditable source

### Closed Source
- Backend servers remain proprietary
- Cannot verify server-side claims independently

---

## Jurisdictional Protection

### Swiss Law
- Strong privacy legislation
- Outside EU/US jurisdiction
- Strict data protection requirements

### Known Legal Actions
- Some compliance with Swiss court orders
- IP logging cases when legally required
- Transparent about legal limitations

---

## 2025 Developments

- AI infrastructure moving to EU (Germany/Norway) due to Swiss privacy law concerns
- Continued expansion of product suite
- Block ordered in India (specific case)

---

## Limitations

1. **Backend Closed Source**: Cannot verify server claims
2. **Metadata**: Email metadata (to/from/subject) may be visible
3. **Legal Compliance**: Swiss court orders still apply
4. **External Email**: Encryption to non-Proton requires extra steps

---

## Sources

| Source | Type |
|--------|------|
| [Proton Open Source](https://proton.me/community/open-source) | Official |
| [Wikipedia](https://en.wikipedia.org/wiki/Proton_Mail) | Reference |
| [GitHub](https://github.com/ProtonMail) | Official |

---

*Constitutional Research Note: Proton Mail provides strong encryption for client-side operations with open-source, auditable code. The main limitation is closed-source backend, requiring trust in Proton AG's claims about server-side handling.*
