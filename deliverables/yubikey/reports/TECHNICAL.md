# YubiKey (Yubico) - Technical Report

## Supported Protocols

| Protocol | Description |
|----------|-------------|
| FIDO2/WebAuthn | Hardware-bound passkeys, discoverable credentials |
| FIDO U2F | Universal 2nd Factor (legacy) |
| PIV (Smart Card) | NIST SP 800-73 standard |
| OpenPGP | RSA 2048/4096, ECC P-256/P-384 |
| Yubico OTP | Proprietary one-time password |
| OATH-TOTP | RFC 6238 time-based codes |
| OATH-HOTP | RFC 4226 event-based codes |
| CTAP 2.1 | Latest FIDO Client to Authenticator Protocol |
| Challenge-Response | HMAC-SHA1 |

## Hardware Models

### YubiKey 5 Series
| Model | Connector | Features |
|-------|-----------|----------|
| YubiKey 5 NFC | USB-A | NFC, all protocols |
| YubiKey 5C NFC | USB-C | NFC, all protocols |
| YubiKey 5Ci | USB-C + Lightning | iOS compatible |
| YubiKey 5 Nano | USB-A (mini) | Low profile |
| YubiKey 5C Nano | USB-C (mini) | Low profile |

### YubiKey Bio Series
| Model | Features |
|-------|----------|
| YubiKey Bio - FIDO Edition | Fingerprint (up to 5), FIDO2 only |
| YubiKey Bio - Multi-protocol | Fingerprint + all protocols |

### Security Key Series
| Model | Features |
|-------|----------|
| Security Key NFC | USB-A, FIDO2/U2F only, budget option |
| Security Key C NFC | USB-C, FIDO2/U2F only |

### YubiHSM 2
- Hardware Security Module for server-side key protection
- PKCS#11, Microsoft CNG support

## Physical Specifications
- **Dimensions**: 18mm x 45mm x 3.3mm (standard)
- **Material**: Glass-fiber reinforced plastic
- **Durability**: IP68 rated, crush resistant
- **Power**: USB-powered, no batteries
- **Lifespan**: Designed for 10+ years

## Firmware 5.7 Features
- 100 discoverable credentials (up from 25)
- 64 OATH seeds (increased storage)
- Enhanced PIN complexity by default
- Unicode PIN support for PIV and OpenPGP
- Restricted NFC mode by default
- Yubico's own cryptographic library (replaced Infineon)

## Open Source Components

| Repository | Purpose | Language |
|------------|---------|----------|
| yubioath-flutter | Yubico Authenticator app | Dart |
| yubikey-manager | CLI management tool | Python |
| libfido2 | FIDO2 library | C |
| java-webauthn-server | WebAuthn server library | Java |
| python-fido2 | FIDO2 Python library | Python |
| yubikit-android | Android SDK | Kotlin |
| yubikit-swift | iOS SDK | Swift |
| Yubico.NET.SDK | .NET SDK | C# |

## Platform Compatibility
- Windows 10+
- macOS 10.15+
- Linux (most distributions)
- iOS 14.5+ (NFC/Lightning models)
- Android 5.0+
- ChromeOS

## Sources
- https://docs.yubico.com/hardware/yubikey/yk-tech-manual/
- https://github.com/Yubico
- https://www.yubico.com/products/

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
