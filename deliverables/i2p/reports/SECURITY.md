# I2P - Security Report

## Audit Status
**No formal third-party security audit found** (unlike Tor which has Cure53/NCC Group audits)

## Security Processes
- Vulnerability Response Process: Annual review meetings
- Documentation: https://geti2p.net/en/research/vrp
- Threat model published: https://geti2p.net/en/docs/how/threat-model

## Academic Research (Not Formal Audits)
| Paper | Year | Focus |
|-------|------|-------|
| "Practical Attacks Against The I2P Network" | 2013 | UCSB, RAID conference |
| "An Empirical Study of the I2P Anonymity Network" | 2018 | IMC conference |
| "The dark side of I2P: A forensic analysis case study" | 2017 | Forensic analysis |
| "Privacy-implications of performance-based peer selection" | 2011 | Grothoff |

## Known Vulnerabilities
- Local data stored unencrypted on participating nodes (forensic risk)
- Project acknowledges: "I2P is still a small network with a small development community and almost no interest from academic or research groups"

## Security Design

### Strengths vs Tor
- **Garlic routing**: Multiple messages bundled, harder to correlate
- **Unidirectional tunnels**: Separate inbound/outbound paths
- **Fully distributed**: No central directory servers (uses DHT)
- **Internal services focus**: Designed for in-network services, not exit traffic

### Weaknesses
- Smaller network = less anonymity set
- Less scrutiny than Tor
- Java implementation has larger attack surface
- No formal audits

## Cryptography
| Component | Algorithm |
|-----------|-----------|
| Key Exchange | X25519 |
| Signatures | Ed25519 |
| Encryption | ChaCha20-Poly1305 |
| Hash | SHA-256 |
| Transport | NTCP2, SSU2 (with PFS) |

## Bug Bounty
- No formal bug bounty program found

## Sources
- https://geti2p.net/en/docs/how/threat-model
- https://geti2p.net/en/research/vrp
- https://geti2p.net/spec/cryptography

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
