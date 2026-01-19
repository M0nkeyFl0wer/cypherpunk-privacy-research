# Technical Analysis: Meshtastic

**Last Updated**: 2026-01-19

---

## Technical Overview

Meshtastic is a decentralized mesh networking protocol using LoRa (Long Range) radio modulation for low-power, long-distance communication. Messages hop across nodes without requiring internet or cellular infrastructure.

---

## Architecture

### Network Topology

```
      ┌─────────┐
      │ Node A  │
      │(origin) │
      └────┬────┘
           │ LoRa
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Node B  │ │ Node C  │
│ (relay) │ │ (relay) │
└────┬────┘ └────┬────┘
     │           │
     └─────┬─────┘
           ▼
      ┌─────────┐
      │ Node D  │
      │(target) │
      └─────────┘
```

### Communication Flow

1. User composes message on phone app
2. App sends message to node via Bluetooth
3. Node encrypts and broadcasts via LoRa
4. Nearby nodes receive and rebroadcast
5. Message hops until reaching destination
6. Destination node sends to user's phone via BT

---

## LoRa Technology

### Radio Characteristics

| Parameter | Value |
|-----------|-------|
| Modulation | LoRa (Chirp Spread Spectrum) |
| Frequency | ISM bands (915 MHz US, 868 MHz EU, etc.) |
| Range | 1-10+ km line-of-sight |
| Power | 10-100 mW (license-free limits) |
| Data Rate | 0.3-50 kbps |

### Why LoRa?
- Long range at low power
- License-free operation
- Robust in noisy environments
- Penetrates obstacles (somewhat)
- Battery-friendly

---

## Encryption

### Message Security

```
┌─────────────────────────────────────┐
│           Encrypted Packet          │
├─────────────────────────────────────┤
│ Header (unencrypted)                │
│ - Packet type                       │
│ - Sender/Receiver IDs               │
│ - Hop count                         │
├─────────────────────────────────────┤
│ Payload (AES-256-CTR encrypted)     │
│ - Message content                   │
│ - GPS coordinates (if enabled)      │
└─────────────────────────────────────┘
```

### Channel Keys
- Each channel has its own AES-256 key
- Default channel uses known key (low security)
- Private channels use custom keys
- Keys shared via QR code or URL

---

## Hardware

### Supported Chipsets

| Chipset | Features | Use Case |
|---------|----------|----------|
| **ESP32** | WiFi, BT, dual-core | General purpose |
| **nRF52840** | BLE 5, low power | Battery efficiency |

### Common Boards

| Board | Price | Features |
|-------|-------|----------|
| TTGO T-Beam | ~$40 | GPS, 18650 battery, OLED |
| TTGO T-Echo | ~$50 | GPS, e-ink display |
| Heltec V3 | ~$20 | Budget, OLED |
| RAK WisBlock | Varies | Modular, customizable |
| T1000-E | ~$35 | Commercial, compact |

---

## Protocol

### Message Types

| Type | Purpose |
|------|---------|
| Text | Chat messages |
| Position | GPS coordinates |
| Telemetry | Device metrics |
| Admin | Configuration |
| Routing | Network management |

### Protocol Buffers
- Typed message definitions
- Efficient binary encoding
- Cross-platform compatibility
- Versioned schema

---

## Mesh Routing

### Algorithm
- Flooding with controlled rebroadcast
- Hop limit to prevent infinite loops
- SNR-based relay decisions
- Store and forward capability

### Large Event Mode
- "Short Turbo" mode for high-density
- Limited rebroadcasting
- Tested at DEF CON (2,000+ nodes)

---

## Client Applications

### Mobile

| Platform | Technology |
|----------|------------|
| Android | Kotlin, native |
| iOS | Swift, native |

### Desktop

| Platform | Technology |
|----------|------------|
| Web | TypeScript, Vue |
| CLI | Python |

### Integration

| System | Purpose |
|--------|---------|
| ATAK | Tactical mapping |
| Home Assistant | IoT integration |

---

## Performance

### Typical Metrics

| Metric | Value |
|--------|-------|
| Range | 1-10+ km (terrain dependent) |
| Latency | Seconds to minutes (hop dependent) |
| Throughput | ~200 bytes/message |
| Battery Life | Days to weeks |
| Hop Limit | Configurable (default: 3) |

---

## Limitations

1. **Bandwidth**: Text only, no voice/video
2. **Latency**: Multi-hop adds delay
3. **Line-of-Sight**: Best range with clear path
4. **Density**: Network needs adequate nodes
5. **Regulations**: ISM band power limits

---

## Sources

| Source | Type |
|--------|------|
| [Meshtastic Documentation](https://meshtastic.org/docs/) | Official |
| [LoRa Alliance](https://lora-alliance.org/) | Technical |
| [Wikipedia](https://en.wikipedia.org/wiki/Meshtastic) | Reference |

---

*Constitutional Research Note: Meshtastic's technical design prioritizes resilience and accessibility over maximum performance. The use of license-free bands and affordable hardware democratizes mesh networking, while LoRa provides impressive range for the power levels involved.*
