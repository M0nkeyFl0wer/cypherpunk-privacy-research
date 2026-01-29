# YubiKey (Yubico) - Code Review Report

## Repository Overview

Yubico maintains 101 public repositories on GitHub, primarily SDKs, libraries, and tools for integrating YubiKey functionality.

**GitHub Organization**: https://github.com/Yubico

## Key Repositories

### yubioath-flutter (Yubico Authenticator)
- **Stars**: 1,264
- **Language**: Dart
- **Purpose**: Cross-platform OATH authenticator app
- **Platforms**: Desktop (Windows/macOS/Linux) and Android

### yubikey-manager
- **Stars**: 1,053
- **Language**: Python
- **Purpose**: CLI tool for configuring YubiKey
- **License**: BSD-2-Clause

### libfido2
- **Stars**: 687
- **Language**: C
- **Purpose**: Library for FIDO2/WebAuthn operations
- **Used by**: OpenSSH, browsers, system integrations

### java-webauthn-server
- **Stars**: 534
- **Language**: Java
- **Purpose**: Server-side WebAuthn library
- **Use case**: Enterprise integration

### python-fido2
- **Stars**: 510
- **Language**: Python
- **Purpose**: FIDO2 client library
- **License**: BSD-2-Clause

## Mobile SDKs

| Repository | Stars | Language | Platform |
|------------|-------|----------|----------|
| yubikit-android | 143 | Kotlin | Android |
| yubikit-swift | 18 | Swift | iOS |

## Development Activity
- Active maintenance across all repositories
- Regular releases and security updates
- Open issue tracking and PR acceptance

## Code Quality Observations
- Well-documented APIs
- Consistent coding standards
- Comprehensive test suites in major repositories
- BSD/Apache licensing for libraries (permissive)

## Gaps
- Internal firmware code is proprietary (not open source)
- Hardware design specifications not public
- Some enterprise tools are closed source

## Sources
- https://github.com/Yubico
- https://github.com/YubicoLabs

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
