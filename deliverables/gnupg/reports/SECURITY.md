# GnuPG - Security Report

## Audit Status
**No formal independent third-party security audit** (per official GnuPG wiki)

Relies on open-source community review model with full disclosure.

## Government Certification

| Certification | Details |
|--------------|---------|
| BSI-VSA-10867 | German Federal Office for Information Security |
| VS-NfD | Approved for restricted documents |
| EU-RESTRICTED | Compliant |
| NATO-RESTRICTED | Compliant |
| Valid Until | May 2027 (extension planned) |

## Recent Vulnerabilities (39C3, December 2025)
Researchers disclosed 14 vulnerabilities across GnuPG, Sequoia PGP, age, and minisign:
- Signature verification bypasses
- Encryption breaking
- Memory corruption
- C string processing errors (null byte injection)

GnuPG response: "Responsible Disclosure Requires Accountability" (blog post 2026-01-22)

Researcher disclosure site: gpg.fail

## Notable CVEs

| CVE | Description | Severity |
|-----|-------------|----------|
| CVE-2022-3515 | Integer overflow in Libksba/CRL parser | Critical (RCE) |
| 2024 | 1 vulnerability, avg score 5.9/10 | Medium |
| Historical | Signature forgery, keyserver DoS (2019), CSRF | Various |

## Security Model

### Strengths
- 25+ years of development and scrutiny
- Government certifications for classified handling
- Open source, auditable code
- Strong cryptographic foundations

### Concerns
- No formal third-party audit despite critical infrastructure status
- Recent 39C3 disclosures show implementation issues
- Legacy codebase in C (memory safety concerns)

## Known Attack Classes
- Side-channel attacks (acoustic, electromagnetic)
- Implementation bugs in string/memory handling
- Keyserver abuse (signature flooding, 2019)

## Bug Bounty
- No formal bug bounty program found
- Full disclosure policy for all bugs

## Notable Use
- Edward Snowden used GnuPG to evade NSA monitoring during 2013 leaks
- Standard tool for journalists and security professionals

## Sources
- https://www.gnupg.org/documentation/security.html
- https://www.cvedetails.com/vulnerability-list/vendor_id-4711/Gnupg.html
- https://gpg.fail

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
