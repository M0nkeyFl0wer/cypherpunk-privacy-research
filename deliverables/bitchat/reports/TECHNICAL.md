# Technical Analysis: Bitchat

**Last Updated**: 2026-01-22

---

## Overview

Bitchat is a hybrid P2P messaging app combining Bluetooth Low Energy (BLE) mesh networking with Nostr protocol for internet-based communication. It operates fully offline via Bluetooth and optionally connects to 290+ Nostr relays.

---

## Architecture

### Transport Layers

| Layer | Technology | Purpose | Range |
|-------|------------|---------|-------|
| Primary | Bluetooth LE Mesh | Offline/local | 30m direct, 300m via relay |
| Secondary | Nostr Protocol | Internet global | Unlimited |
| Optional | Tor (Arti) | Anonymous networking | Unlimited |

### Message Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Device A  │────▶│  BLE Mesh   │────▶│   Device B  │
│             │     │   Network   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                        ▲
       │            ┌─────────────┐             │
       └───────────▶│ Nostr Relay │─────────────┘
                    │   Network   │
                    │  (290+)     │
                    └─────────────┘
```

---

## Cryptography

### Noise Protocol Framework
| Component | Specification |
|-----------|---------------|
| Handshake | XX (mutual authentication, forward secrecy) |
| Cipher | ChaCha20-Poly1305 (AEAD) |
| Key Exchange | X25519 (Curve25519) |
| Hash | SHA-256 |
| Key Derivation | HKDF-SHA256 |
| Rekey | Every 1 hour or 10,000 messages |

### Nostr Integration (NIP-17)
- Gift-wrapped messages for metadata privacy
- secp256k1 public/private key pairs
- Event-based message format

---

## Traffic Analysis Countermeasures

| Feature | Implementation |
|---------|----------------|
| Dummy Messages | 30-120 second random intervals |
| Timing Jitter | 50-500ms random delays |
| Message Padding | PKCS#7-style padding |
| Metadata | TTL and message ID only (no sender/recipient) |

---

## Code Structure (iOS)

### Noise Protocol Files
```
NoiseProtocol.swift          # Core protocol implementation
NoiseSession.swift           # Session management
NoiseSessionManager.swift    # Multi-session handling
NoiseEncryptionService.swift # Encryption/decryption
NoiseSecurityValidator.swift # Input validation
NoiseSecurityConstants.swift # Crypto constants
NoiseRateLimiter.swift       # DoS protection
```

### Services
```
KeychainManager.swift            # iOS Keychain integration
MessageDeduplicationService.swift # Replay attack protection
VerificationService.swift        # Identity verification
PrivateChatManager.swift         # Private conversation handling
NostrTransport.swift             # Nostr relay communication
MessageRouter.swift              # Message routing logic
```

---

## Dependencies

### iOS (Swift)
| Package | Version | Purpose |
|---------|---------|---------|
| swift-secp256k1 | 0.21.1 | Elliptic curve cryptography |
| Arti | Local | Tor integration |
| BitLogger | Local | Logging |

### Android (Kotlin)
| Component | Purpose |
|-----------|---------|
| BLE Libraries | Bluetooth mesh |
| Nostr Libraries | Relay communication |
| Crypto Libraries | Encryption |

---

## Platform Support

| Platform | Status | Min Version | Language |
|----------|--------|-------------|----------|
| iOS | ✅ Released | iOS 16.0+ | Swift |
| Android | ✅ Released | Android 8.0+ | Kotlin |
| macOS | ✅ Released | macOS 13+ | Swift |
| Web | ❌ No | N/A | N/A |
| Desktop (Win/Linux) | ❌ No | N/A | N/A |

---

## Bluetooth LE Mesh

### Specifications
- **Standard**: Bluetooth Low Energy (BLE)
- **Protocol**: Custom binary protocol optimized for BLE
- **Direct Range**: ~30 meters
- **Relay Range**: ~300 meters (via intermediate devices)
- **Power**: Optimized for mobile battery

### Mesh Topology
```
      [A]
     /   \
   [B]   [C]
   / \   / \
 [D] [E][F] [G]
```

Messages hop through mesh nodes to reach destination.

---

## Nostr Integration

### NIPs Supported
| NIP | Purpose |
|-----|---------|
| NIP-01 | Basic protocol |
| NIP-17 | Gift-wrapped private messages |

### Relay Infrastructure
- **Supported Relays**: 290+
- **Relay Selection**: Automatic
- **Relay Redundancy**: Multi-relay broadcast

---

## Storage

### Local Storage
| Data | Storage |
|------|---------|
| Keys | iOS Keychain / Android Keystore |
| Messages | Local encrypted database |
| Contacts | Local encrypted database |

### Server Storage
- **None** - fully decentralized
- Messages stored on Nostr relays temporarily
- BLE mesh has no persistent storage

---

## Network Architecture

### Decentralization Model
| Component | Centralized? | Notes |
|-----------|--------------|-------|
| Servers | ✅ None | P2P only |
| User Data | ❌ Local | Device only |
| Message Routing | ❌ Mesh/Relays | Distributed |
| Key Management | ❌ Local | Device only |

### Website Infrastructure
| Service | Provider |
|---------|----------|
| bitchat.free | GitHub Pages |
| IPs | 185.199.108-111.153 |

---

## Security Architecture

### Key Management
```
Master Key (device-local)
    │
    └──▶ Session Keys (per-conversation)
              │
              └──▶ Message Keys (ratcheted per hour/10k msgs)
```

### Threat Mitigations
| Threat | Mitigation |
|--------|------------|
| MITM | Noise XX handshake (partial - see vulnerabilities) |
| Replay | MessageDeduplicationService |
| DoS | NoiseRateLimiter |
| Traffic Analysis | Dummy messages, timing jitter, padding |
| Key Compromise | Session-level forward secrecy |

---

## Performance

### GitHub Metrics
| Repo | Stars | Forks | Issues |
|------|-------|-------|--------|
| iOS | 24,644 | 2,302 | 232 |
| Android | 4,560 | 636 | - |

### Adoption
- **Total Downloads**: 360,000+
- **Peak Day**: 50,000 (Nepal protests)
- **Notable Spikes**: Madagascar, Uganda, Iran

---

## Comparison to Alternatives

| Feature | Bitchat | Signal | Briar |
|---------|---------|--------|-------|
| Offline BLE | ✅ Yes | ❌ No | ✅ Yes |
| Internet Mode | ✅ Yes (Nostr) | ✅ Yes | ✅ Yes (Tor) |
| Double Ratchet | ❌ No | ✅ Yes | ✅ Yes |
| Nostr Integration | ✅ Yes | ❌ No | ❌ No |
| Tor Support | ✅ Yes (Arti) | ❌ No | ✅ Yes |
| Group E2E | ⚠️ Limited | ✅ Yes | ✅ Yes |

---

## Future Development

### Planned Features (from roadmap)
- Double Ratchet implementation
- Key rotation mechanism
- Enhanced Noise Protocol migration
- Additional platform support

---

## Sources

| Source | Type |
|--------|------|
| [Whitepaper](https://github.com/permissionlesstech/bitchat/blob/main/WHITEPAPER.md) | Official |
| [BRING_THE_NOISE.md](https://github.com/permissionlesstech/bitchat/blob/main/BRING_THE_NOISE.md) | Official |
| [GitHub - iOS](https://github.com/permissionlesstech/bitchat) | Primary |
| [GitHub - Android](https://github.com/permissionlesstech/bitchat-android) | Primary |

---

*Constitutional Research Note: Bitchat's technical approach is innovative - combining BLE mesh with Nostr creates a unique hybrid that works both online and offline. However, the cryptographic implementation lags behind Signal's proven Double Ratchet approach.*
