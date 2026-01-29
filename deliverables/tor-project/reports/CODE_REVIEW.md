# Tor Project - Code Review Report

## Repository Overview

Primary development occurs on GitLab (gitlab.torproject.org), with GitHub mirrors available.

## Key Repositories

### tor (Core Daemon)
- **GitLab**: https://gitlab.torproject.org/tpo/core/tor
- **GitHub Mirror**: https://github.com/torproject/tor
- **Stars**: ~4,800
- **Language**: C
- **License**: BSD-3-Clause

### Arti (Rust Implementation)
- **GitLab**: https://gitlab.torproject.org/tpo/core/arti
- **Language**: Rust
- **Purpose**: Memory-safe, modern Tor client
- **Status**: Active development, approaching production readiness

### Tor Browser
- **GitLab**: https://gitlab.torproject.org/tpo/applications/tor-browser
- **Base**: Firefox ESR
- **Languages**: JavaScript, C++, XUL

### torspec (Protocol Specifications)
- **GitLab**: https://gitlab.torproject.org/tpo/core/torspec
- **Purpose**: Formal protocol documentation
- **Format**: Text specifications

## Development Practices

### Version Control
- GitLab as primary (self-hosted)
- GitHub mirrors for visibility
- Signed commits encouraged

### Code Review
- Merge requests require review
- Core team approval for sensitive changes
- Public discussion of design decisions

### Testing
- Automated CI/CD on GitLab
- Chutney for local network testing
- Shadow for large-scale simulation

### Release Process
- Stable and alpha release tracks
- Security releases as needed
- Reproducible builds for Tor Browser

## Code Quality Observations

### Strengths
- Well-documented protocol specifications
- Extensive inline comments
- Long history of security-conscious development
- Active migration to memory-safe Rust (Arti)

### Areas of Concern
- Legacy C codebase in core tor
- Some historical vulnerabilities from C memory handling
- Complexity of protocol implementation

## Contribution Statistics
- Hundreds of contributors over 20+ years
- Active core team of ~10-15 developers
- Regular external contributions

## Sources
- https://gitlab.torproject.org/
- https://github.com/torproject

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
