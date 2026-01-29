# Briar - Technical Report

## Architecture

### P2P Design
- Fully peer-to-peer (no central servers)
- Messages sync directly between users' devices
- No metadata collection possible (no servers to log)

### Transport Options
| Transport | Range | Requirement |
|-----------|-------|-------------|
| Tor | Global | Internet access |
| Wi-Fi | Local network | Same network |
| Bluetooth | ~10-30m | Physical proximity |
| USB/Memory card | N/A | Physical transfer |

## Bramble Protocol Suite

### Protocol Stack
```
Application Layer (Messages, Forums, Blogs)
          ↓
    Bramble Sync Protocol (BSP)
          ↓
    Bramble Transport Protocol (BTP)
          ↓
    Transport (Tor / Wi-Fi / Bluetooth)
```

### Cryptographic Design
| Component | Implementation |
|-----------|---------------|
| Hash/PRF | BLAKE2b |
| Signatures | Ed25519 |
| Key rotation | Periodic, time-based |
| Message padding | 1024 bytes |

## Features

### Communication
| Feature | Description |
|---------|-------------|
| Private messages | 1-to-1 encrypted chat |
| Group chats | Multi-party messaging |
| Forums | Threaded discussions |
| Blogs | Personal publishing |

### Briar Mailbox (v1.0.9+)
- Companion app for message buffering
- Install on spare device, leave connected
- Contacts can leave encrypted messages for pickup
- Solves asynchronous delivery problem
- Docker support (April 2024)

## Platform Support

| Platform | Status | Source |
|----------|--------|--------|
| Android | Production | Google Play, F-Droid |
| Windows | Production | Official release |
| macOS | Production | Official release |
| Linux | Production | Official release |
| iOS | NOT supported | Apple restrictions prevent P2P |

### iOS Limitations
Apple's restrictions on:
- Background processes
- Bluetooth/WiFi P2P APIs
- Prevent Briar's architecture from working

## Repository Statistics (GitLab)
| Metric | Value |
|--------|-------|
| Commits | 7,596+ |
| Branches | 133 |
| Tags | 200 |
| License | GPL-3.0+ (Android), AGPL (Desktop) |

## Download Statistics
| Store | Downloads |
|-------|-----------|
| Google Play | ~43,000/month |
| Aptoide | 1M+ total |

## Reproducible Builds
- Docker images provided for APK verification
- Build process documented

## Sources
- https://code.briarproject.org/briar/briar
- https://briarproject.org/manual/
- https://code.briarproject.org/briar/briar-spec

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
