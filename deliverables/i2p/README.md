# I2P (Invisible Internet Project)

## Description
I2P is a fully decentralized anonymous overlay network that uses "garlic routing" (bundling multiple messages) and unidirectional tunnels to provide stronger traffic analysis resistance than traditional onion routing. Founded in 2003 by the pseudonymous "jrandom" (who mysteriously disappeared in 2007), I2P hosts its own ecosystem of services called "eepsites" accessible via .i2p domains.

## Links
- **Website**: https://geti2p.net/
- **GitHub**: https://github.com/i2p
- **Documentation**: https://geti2p.net/en/docs/

## Category
Online (Anonymous Overlay Network)

## Ecosystem
Non-blockchain (Traditional Privacy Technology)

## Key Features

### Garlic Routing
- Bundles multiple messages ("cloves") vs Tor's single-message onion routing
- Unidirectional tunnels (4 tunnels per communication)
- Fully distributed (no central directory servers like Tor)
- Packet-switched rather than circuit-switched

### Cryptography
- **Modern**: X25519, Ed25519, ChaCha20-Poly1305, SHA-256
- **Legacy**: 2048-bit ElGamal, AES-256-CBC, DSA-SHA1
- **Transport**: NTCP2, SSU2 (both with forward secrecy)

## Project Status
**Status**: Production (20+ Years Active)

### Network Size
- ~55,000 computers worldwide
- ~12,000 active nodes
- ~6% are floodfill routers

## Team
See [TEAM.md](reports/TEAM.md) for detailed team information.

### Key Contributors
- **jrandom** - Founder (disappeared 2007)
- **zzz** - Project Manager since 2007
- **str4d** - Release Manager, Cryptography Lead

## Technical Details
See [TECHNICAL.md](reports/TECHNICAL.md) for technical documentation.

## Security
See [SECURITY.md](reports/SECURITY.md) for security analysis.

## Code Review
See [CODE_REVIEW.md](reports/CODE_REVIEW.md) for repository analysis.

## Implementations
| Implementation | Language | Notes |
|---------------|----------|-------|
| Java I2P | Java | Original, includes built-in apps |
| i2pd | C++ | Lightweight (~50MB vs 200MB) |
| Kovri | C++ | Monero project fork |

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
