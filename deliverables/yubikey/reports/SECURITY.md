# YubiKey (Yubico) - Security Report

## Certifications

| Certification | Details |
|--------------|---------|
| FIPS 140-2 | Level 1 (Certificate #3907), Level 2 (#3914), Physical Security Level 3 |
| FIPS 140-3 | Validation submitted (YubiKey 5 FIPS Series) |
| FIDO Level 2 (L2) | Firmware 5.7+ |
| NIST SP 800-63B | AAL3 (Authenticator Assurance Level 3) compliant |
| SOC 2 Type II | Conducted by Schellman & Company for YubiEnterprise Services |
| DoD Approved | MFA token for unclassified and secret classified systems |
| CMMC Level III | Compliant |
| FedRAMP | Compliant |

## Security Audits
- Third-party security reviews conducted but auditor names not publicly disclosed
- Security embedded in SDLC: threat modeling, design reviews, automated static/dynamic analysis
- Manual code review and penetration tests for major releases

## Known Vulnerabilities

### CVE-2024-45678 (EUCLEAK) - HIGH
- **Type**: Side-channel vulnerability in Infineon cryptographic library
- **Impact**: ECDSA private key extraction with physical access + specialized equipment
- **Affected**: YubiKey 5 Series firmware < 5.7.0
- **Note**: Went unnoticed for 14 years; devices with vulnerable firmware cannot be updated
- **Fixed**: Firmware 5.7+ uses Yubico's own cryptographic library
- **Source**: https://www.yubico.com/support/security-advisories/ysa-2024-03/

### CVE-2025-29991 - LOW
- **Type**: FIDO CTAP Protocol signature length verification issue
- **Affected**: YubiKey 5.4.1-5.7.3
- **Fixed**: 5.7.4
- **Source**: https://www.yubico.com/support/security-advisories/ysa-2025-02/

### CVE-2024-35311 - LOW
- **Type**: FIDO Relying Party enumeration without user verification
- **Source**: https://www.yubico.com/support/security-advisories/ysa-2024-02/

### CVE-2024-31498 - MEDIUM
- **Type**: YubiKey Manager GUI privilege escalation on Windows when run as Administrator
- **Source**: https://www.yubico.com/support/security-advisories/ysa-2024-01/

## Security Model
- Private keys generated and stored on device, never exported
- Tamper-resistant hardware
- No batteries = no attack surface from power management
- Restricted NFC mode by default in firmware 5.7+ (tamper protection during shipping)

## Bug Bounty
- No public bug bounty program found
- Vulnerabilities reported through security advisory process

## Incident Response
- Security advisories published at https://www.yubico.com/support/security-advisories/
- Coordinated disclosure with researchers

## Sources
- https://www.yubico.com/trust/
- https://www.yubico.com/support/security-advisories/
- https://docs.yubico.com/

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
