# GnuPG - Code Review Report

## Repository Overview
- **Primary**: https://dev.gnupg.org/
- **GitHub Mirror**: https://github.com/gpg/gnupg
- **Note**: Mirror only - PRs directed to gnupg.org bug tracker

## GitHub Statistics (Mirror)
| Metric | Value |
|--------|-------|
| Stars | 893 |
| Forks | 189 |
| Contributors | 66+ |

## Languages
| Language | Percentage |
|----------|------------|
| C | 89.3% |
| TeX | 2.2% |
| Scheme | 2.1% |
| M4 | 1.9% |
| Shell | 1.8% |
| Makefile | 1.1% |

## Licensing
- GPL-3.0 (primary)
- GPL-2.0
- LGPL 2.1
- LGPL 3.0
- CC0

## Development Practices

### Version Control
- Git (primary)
- Commit signing encouraged
- Mailing list for patches

### Build System
- Autotools (configure, make)
- Reproducible builds for releases

### Testing
- Test suite included
- Regression testing

## Code Quality

### Strengths
- 25+ years of refinement
- Extensive documentation
- Well-defined interfaces
- Government certification (BSI)

### Concerns
- Legacy C codebase
- Memory safety relies on careful coding
- Complex codebase (many features)
- Recent 39C3 vulnerabilities show ongoing risk

## Related Repositories

| Repository | Purpose |
|------------|---------|
| libgcrypt | Cryptographic library |
| libksba | X.509/CMS library |
| libassuan | IPC library |
| gpgme | High-level API |
| pinentry | Passphrase entry |

## Sources
- https://github.com/gpg/gnupg
- https://dev.gnupg.org/

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
