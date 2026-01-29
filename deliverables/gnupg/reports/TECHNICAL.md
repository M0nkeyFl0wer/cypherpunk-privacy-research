# GnuPG - Technical Report

## OpenPGP Implementation
- **Standard**: RFC 4880 (current), RFC 9580 (v6, July 2024)
- **Purpose**: Encryption, digital signatures, key management

## Cryptographic Algorithms

### Hash Functions
| Algorithm | Status |
|-----------|--------|
| SHA-256, SHA-384, SHA-512 | Recommended |
| SHA-224 | Supported |
| SHA-1 | Required for compatibility |
| RIPE-MD/160 | Supported |
| MD5 | Deprecated |

### Symmetric Encryption
| Algorithm | Status |
|-----------|--------|
| AES-128, AES-192, AES-256 | Recommended |
| Camellia | Supported |
| CAST5 | Legacy |
| 3DES | Legacy |

### Public Key
| Algorithm | Key Sizes |
|-----------|-----------|
| RSA | 1024-4096 bits |
| DSA | 1024-3072 bits |
| ECDSA | P-256, P-384, P-521 |
| EdDSA | Ed25519, Ed448 |
| ECDH | Curve25519, others |

## Software Suite

| Component | Purpose |
|-----------|---------|
| gpg | Main encryption/signing tool |
| gpgsm | S/MIME support |
| gpg-agent | Private key management |
| Libgcrypt | Cryptographic library |
| GPGME | GnuPG Made Easy (API) |
| Kleopatra | Key/certificate manager GUI |
| GpgOL | Microsoft Outlook plugin |
| GpgEX | Windows Explorer plugin |
| Gpg4win | Windows distribution |

## Version Branches

| Branch | Status | Maintainer |
|--------|--------|------------|
| 2.4.x | Stable | Werner Koch |
| 2.5.x | Development | Werner Koch |
| 1.4.x | Classic/Legacy | David Shaw |

## Platform Support
- Linux (native, most distros)
- Windows (Gpg4win)
- macOS
- Various Unix systems

## Code Statistics (GitHub Mirror)
| Metric | Value |
|--------|-------|
| Stars | 893 |
| Forks | 189 |
| Language | C (89.3%) |
| License | GPL-3.0, GPL-2.0, LGPL |

## Key Features
- Web of Trust key validation
- Keyserver integration
- Smartcard support (OpenPGP card)
- GnuPG Agent for key caching
- S2K (String-to-Key) for passphrases

## Sources
- https://gnupg.org/documentation/
- https://datatracker.ietf.org/doc/html/rfc4880
- https://datatracker.ietf.org/doc/html/rfc9580

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
