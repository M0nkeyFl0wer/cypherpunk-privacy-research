# Meshtastic

## Description
Meshtastic is an open-source, decentralized off-grid mesh networking protocol using LoRa (Long Range) radio technology for encrypted long-range communication without internet or cellular infrastructure. Created by Kevin Hester in 2020, it enables text messaging, GPS location sharing, and alerts across peer-to-peer networks using affordable hardware starting at under $10.

In 2025, Meshtastic has become a global movement with deployments in 42+ countries, 300+ contributors, and 15,000+ Discord community members. It's being explored by municipalities as backup communication systems for natural disasters.

## Links
- **Website**: https://meshtastic.org
- **Documentation**: https://meshtastic.org/docs/
- **GitHub**: https://github.com/meshtastic
- **Discord**: https://discord.gg/meshtastic
- **Reddit**: https://reddit.com/r/meshtastic

## Category
Privacy Infrastructure (Mesh Networking / Off-Grid Communication)

## Ecosystem
Non-blockchain (Traditional Privacy Technology)

## Key Features

### Communication
- **Text Messaging**: Short encrypted messages over LoRa
- **GPS Location Sharing**: Share and track positions
- **Channel System**: Multiple private/public channels
- **Store and Forward**: Messages hop across nodes

### Privacy & Security
- **AES-256-CTR Encryption**: All messages encrypted
- **Per-Channel Keys**: Different keys for different groups
- **No Central Server**: Fully decentralized
- **No Internet Required**: Works completely offline
- **License-Free**: Uses ISM bands (no radio license needed)

### Hardware
- Entry-level devices from $9.90
- Popular options: T-Beam, T-Echo (~$40)
- Supported chipsets: ESP32, nRF52840
- Optional: GPS, WiFi, screens

## Project Status
**Status**: Production (Active Development)

### Key Milestones
| Date | Event |
|------|-------|
| 2019 | First prototypes with TTGO T-Beam |
| 2020 | Meshtastic v0.1.0 released |
| 2024 | DEF CON deployment (2,000+ nodes) |
| 2025 | Global community, 42+ countries |

## Team
See [TEAM.md](reports/TEAM.md) for detailed team information.

### Key Contributors
- **Kevin Hester (Geeksville)** - Founder, embedded engineer
- **Jonathan Bennett** - Core developer, Meshtastic Solutions
- **Tony Good** - Hardware designer
- **300+ community contributors**

## Technical Details
See [TECHNICAL.md](reports/TECHNICAL.md) for technical documentation.

## Security
See [SECURITY.md](reports/SECURITY.md) for security analysis.

## Code Review
See [CODE_REVIEW.md](reports/CODE_REVIEW.md) for repository analysis.

## GitHub Metrics

| Repository | Stars | Language |
|------------|-------|----------|
| firmware | 6,591 | C++ |
| meshtastic (docs) | 1,523 | MDX |
| Meshtastic-Android | 1,334 | Kotlin |
| web | 642 | TypeScript |
| Meshtastic-Apple | 588 | Swift |
| device-ui | 432 | C |
| ATAK-Plugin | 400 | C |

## Use Cases

- **Outdoor Recreation**: Hiking, skiing, camping
- **Emergency Communication**: Natural disasters, grid failures
- **Events**: Festivals, conferences, trail runs
- **Community Networks**: Neighborhood meshes
- **Tactical**: ATAK integration for teams

## Hardware Compatibility

| Device | Price | Features |
|--------|-------|----------|
| T1000-E | ~$35 | Popular, compact |
| T-Beam | ~$40 | GPS, battery, screen |
| T-Echo | ~$50 | GPS, e-ink screen |
| RAK WisBlock | Varies | Modular system |
| Heltec V3 | ~$20 | Budget option |

## Limitations
- Line-of-sight required for best range
- Low bandwidth (text only, no voice/video)
- Latency over multiple hops
- Network depends on node density

---
*Research completed with Constitutional Research v2.0.0*
*Last updated: 2026-01-19*
