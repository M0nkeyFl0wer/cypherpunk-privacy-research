# Security Analysis: Meshtastic

**Last Updated**: 2026-01-19

---

## Security Overview

Meshtastic provides encrypted off-grid communication using AES-256 encryption. While designed for privacy, the security model has trade-offs appropriate for its use case as a resilient communication tool rather than a high-security system.

---

## Encryption

### Message Encryption
- **Algorithm**: AES-256-CTR
- **Scope**: Message payloads encrypted before transmission
- **Key Management**: Per-channel symmetric keys

### Channel Security
| Channel Type | Key | Privacy |
|--------------|-----|---------|
| **Primary** | Default or custom | Medium - known key |
| **Private** | Shared via QR/URL | High - custom key |
| **Admin** | Device-specific | Device management |

### Key Distribution
- Keys shared via QR codes or URLs
- No automated key exchange
- Manual key rotation required

---

## Network Security

### Decentralization
- No central server to compromise
- Each node is independent
- Network continues if nodes fail

### Traffic Analysis
| Threat | Mitigation |
|--------|------------|
| Message content | AES-256 encrypted |
| Message metadata | Partially visible (headers) |
| Network topology | Observable via radio |
| Location | GPS sharing is opt-in |

### Radio Considerations
- LoRa transmissions are radio signals
- Direction finding is possible
- ISM bands are shared spectrum

---

## Known Limitations

### Security Trade-offs

1. **No Perfect Forward Secrecy**
   - Static channel keys
   - Key compromise reveals all channel messages

2. **Metadata Exposure**
   - Packet headers visible
   - Node IDs in clear
   - Radio timing observable

3. **Physical Security**
   - Devices can be captured
   - Keys stored on device
   - No hardware security modules (typically)

4. **Key Distribution**
   - Manual key sharing
   - QR codes can be photographed
   - No authentication protocol

---

## Threat Model

### Appropriate For
- Outdoor recreation communication
- Emergency/disaster backup
- Community coordination
- Privacy from casual observation

### NOT Appropriate For
- State-level adversaries
- High-security communications
- Protection against targeted surveillance
- Situations requiring plausible deniability

---

## Best Practices

### For Users
1. Use unique keys for sensitive channels
2. Rotate keys periodically
3. Disable GPS if location privacy needed
4. Physical security of devices
5. Don't share keys over insecure channels

### For Deployments
1. Segment channels by sensitivity
2. Plan key distribution carefully
3. Consider node placement security
4. Document key holders
5. Have key rotation procedures

---

## Audit Status

### Formal Audits
- No formal security audits found in public records
- Community review through open-source development
- 300+ contributors provide code review coverage

### Bug Reports
- GitHub issues for security bugs
- Community-reported vulnerabilities
- No formal bug bounty program found

---

## Comparison to Alternatives

| Feature | Meshtastic | goTenna | Briar |
|---------|------------|---------|-------|
| Encryption | AES-256 | AES-256 | Signal Protocol |
| Open Source | Yes | No | Yes |
| PFS | No | Unknown | Yes |
| Hardware | DIY/Commercial | Proprietary | Phone |
| Range | Long (LoRa) | Medium | Varies |

---

## Sources

| Source | Type |
|--------|------|
| [Meshtastic Documentation](https://meshtastic.org/docs/) | Official |
| [Meshtastic Wikipedia](https://en.wikipedia.org/wiki/Meshtastic) | Reference |
| [Shellntel Guide](https://blog.shellntel.com/p/building-a-meshtastic-node) | Technical |

---

*Constitutional Research Note: Meshtastic provides "good enough" security for its intended use cases. Users should understand it's designed for resilient off-grid communication, not maximum security. The encryption is solid (AES-256), but the overall security model has trade-offs appropriate for a mesh network.*
