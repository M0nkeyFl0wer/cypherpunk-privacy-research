# Tails OS - Security Report

## Security Audits

### Late 2024 - Radically Open Security
- **Scope**: Automatic upgrade mechanism, Persistent Storage
- **Conclusion**: "The Tails operating system leaves a strong security impression"
- **Findings**: 4 issues
  - OTF-001 (High): Local privilege escalation in Tails Upgrader
  - OTF-002 (High): Arbitrary code execution in Python scripts
  - OTF-003 (Moderate): Argument injection in GNOME scripts
  - OTF-004 (Low): Untrusted search path in Tor Browser launcher
- **Note**: All required attacker to already have compromised an application
- **No remote code execution vulnerabilities found**

### November 2023 - Radically Open Security
- **Scope**: Persistent Storage, Unsafe Browser, Wayland integration
- **Findings**: 6 High, 1 Moderate, 3 Low, 1 Unknown
- **Status**: All fixed

## Notable Vulnerabilities

| CVE | Description | Severity |
|-----|-------------|----------|
| CVE-2023-32233 | Use-after-free in Netfilter nf_tables | High |
| CVE-2024-56406 | Heap-based buffer overflow in Perl | Medium |
| CVE-2022-1802, CVE-2022-1529 | Firefox JavaScript engine zero-days | High |

### 2014 I2P Zero-Day
- Could de-anonymize Tor users
- Discovered by Exodus Intelligence
- Addressed in subsequent releases

## Security Design

### Amnesic Properties
- System runs entirely in RAM
- No writes to persistent storage by default
- RAM overwritten on shutdown
- Clean state on every boot

### Network Security
- All traffic forced through Tor network
- Network-level rules prevent non-Tor connections
- MAC address spoofing

### Application Isolation
- AppArmor profiles for applications
- Sandboxed browser environment

## Persistent Storage Security
- Optional encrypted storage using LUKS2
- Argon2id key derivation
- Encrypted by default but forensically detectable

## Limitations
- Forensic analysis can detect Tails was used (not what was done)
- Cold boot attacks possible if RAM not properly cleared
- Hardware-level attacks not mitigated

## Sources
- https://tails.net/security/
- https://www.opentech.fund/security-safety-audits/

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
