# I2P - Code Review Report

## Repository Overview

### Official Repositories
- **Primary**: https://i2pgit.org/ (self-hosted)
- **GitHub Mirror**: https://github.com/i2p

### i2pd (C++ Implementation)
- **GitHub**: https://github.com/PurpleI2P/i2pd
- **Stars**: 3,310
- **Forks**: 500+
- **Language**: C++ (97%+)

## Languages

### Java I2P
| Language | Percentage |
|----------|------------|
| Java | ~85% |
| JSP | ~5% |
| Shell | ~3% |
| Other | ~7% |

### i2pd
| Language | Percentage |
|----------|------------|
| C++ | 97%+ |
| CMake | ~2% |
| Other | ~1% |

## Development Practices

### Version Control
- Self-hosted Git (i2pgit.org)
- GitHub mirrors for visibility
- Monotone historically (migrated to Git)

### Release Process
- Numbered releases (current: 2.x)
- Signed releases
- Multiple implementations maintained

## Code Quality

### Strengths
- 20+ years of development
- Multiple independent implementations
- Active modernization of cryptography
- Well-documented protocols

### Concerns
- Java implementation has larger attack surface
- Less external scrutiny than Tor
- Smaller contributor base
- No formal security audits

## Notable Components

### Java I2P
| Component | Purpose |
|-----------|---------|
| router | Core routing logic |
| apps | Built-in applications |
| core | Cryptographic primitives |
| streaming | TCP-like layer |

### i2pd
| Component | Purpose |
|-----------|---------|
| libi2pd | Core library |
| libi2pd_client | Client functionality |
| daemon | Background service |

## Sources
- https://github.com/i2p
- https://github.com/PurpleI2P/i2pd
- https://i2pgit.org/

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
