# I2P - Technical Report

## Architecture

### Garlic Routing vs Onion Routing
| Feature | I2P (Garlic) | Tor (Onion) |
|---------|--------------|-------------|
| Message bundling | Multiple "cloves" | Single message |
| Tunnel direction | Unidirectional | Bidirectional |
| Directory | Distributed (DHT) | Central servers |
| Switching | Packet-switched | Circuit-switched |
| Primary use | In-network services | Exit to clearnet |

### Tunnel Structure
- 4 tunnels per communication (2 sender, 2 receiver)
- Each tunnel is one-way only
- Tunnel length configurable (default: 3 hops)

## Network Statistics
| Metric | Value |
|--------|-------|
| Network size | ~55,000 computers |
| Active nodes | ~12,000 |
| Floodfill routers | ~6% |

## Implementations

### Java I2P (Original)
- **Language**: Java
- **RAM Usage**: ~200MB
- **Features**: Built-in apps (email, torrents, web server)
- **Platforms**: Windows, Linux, macOS, Android

### i2pd (PurpleI2P)
- **Language**: C++
- **GitHub Stars**: 3,310
- **RAM Usage**: ~50MB
- **Advantage**: Lightweight, no JVM required

### Other Implementations
| Name | Language | Notes |
|------|----------|-------|
| Kovri | C++ | Monero project fork |
| go-i2p | Go | In development |
| I2P+ | Java | Soft-fork of Java I2P |
| Ire | Rust | By str4d |

## Services

### Eepsites (.i2p domains)
- Self-hosted hidden websites
- Accessible only within I2P network
- No DNS - uses distributed naming

### Built-in Applications
| App | Purpose |
|-----|---------|
| I2PSnark | BitTorrent client |
| I2P-Bote | Encrypted email |
| Susimail | Webmail interface |
| Syndie | Forum/blog platform |

## Cryptography Stack

### Modern (Default)
```
Key Exchange: X25519
Signatures: Ed25519
Encryption: ChaCha20-Poly1305
Hash: SHA-256, BLAKE2b
```

### Legacy (Backward Compatibility)
```
Key Exchange: 2048-bit ElGamal
Encryption: AES-256-CBC
Signatures: DSA-SHA1
```

### Transport Protocols
| Protocol | Features |
|----------|----------|
| NTCP2 | TCP-based, forward secrecy |
| SSU2 | UDP-based, forward secrecy |

## Platform Support
- Windows
- Linux (Debian/Ubuntu repos)
- macOS
- Android (F-Droid, Google Play)

## Sources
- https://geti2p.net/en/docs/
- https://geti2p.net/spec/cryptography
- https://github.com/PurpleI2P/i2pd

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
