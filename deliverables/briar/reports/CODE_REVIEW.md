# Briar - Code Review Report

## Repository Overview
- **Primary**: https://code.briarproject.org/briar/briar (GitLab)
- **GitHub**: https://github.com/briar (8 repositories, mirrors)
- **Protocol Specs**: https://code.briarproject.org/briar/briar-spec

## GitLab Statistics
| Metric | Value |
|--------|-------|
| Commits | 7,596+ |
| Branches | 133 |
| Tags | 200 |
| Created | November 30, 2015 |

## Languages
| Platform | Languages |
|----------|-----------|
| Android | Java, Kotlin |
| Desktop | Kotlin |

## Licensing
| Component | License |
|-----------|---------|
| Android app | GPL-3.0-or-later |
| Desktop app | AGPL |

## Code Quality

### Audit Feedback (Cure53, 2017)
> "Quality and readability of the app's source code was rather exceptional"

> "Good understanding of vulnerability patterns and threats"

> Cryptographic code "found to be exceptionally clear and sound"

### Development Practices
- Active maintenance
- Regular releases
- Security-focused development
- Reproducible builds

## Notable Components

| Component | Purpose |
|-----------|---------|
| bramble-core | Core protocol implementation |
| bramble-android | Android platform layer |
| briar-android | Android UI |
| briar-desktop | Desktop application |
| briar-mailbox | Message buffering service |

## Build Verification
- Docker images for reproducible builds
- APK verification possible
- Build instructions documented

## Protocol Specifications
- Formal specifications at briar-spec repository
- Bramble Protocol Suite documented
- Cryptographic choices explained

## Gaps
- GitLab doesn't display stars/forks prominently
- Contributor count not easily visible
- No automated security scanning results public

## Sources
- https://code.briarproject.org/briar/briar
- https://github.com/briar
- https://cure53.de/pentest-report_briar.pdf

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
