# Technical Analysis: Telegram

**Last Updated**: 2026-01-19

---

## Architecture

### Cloud-Based Model
Unlike Signal, Telegram uses cloud storage:
- Messages stored on Telegram servers
- Sync across unlimited devices
- Cloud backup by default

### Encryption Layers

```
┌─────────────────────────────────────────────┐
│              REGULAR CHATS                  │
├─────────────────────────────────────────────┤
│  Client ←──MTProto──→ Server ←──MTProto──→ Client │
│         (encrypted)    (decrypted)   (encrypted)   │
│                        ▲                           │
│                        │                           │
│              Server CAN read                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│              SECRET CHATS                   │
├─────────────────────────────────────────────┤
│  Client ←────────E2E────────→ Client       │
│                                             │
│         Server CANNOT read                  │
└─────────────────────────────────────────────┘
```

---

## MTProto 2.0

### Components
1. **Authorization Layer**: Key exchange
2. **Transport Layer**: HTTP, WebSocket, TCP, UDP
3. **Encryption Layer**: AES-256-IGE, SHA-256

### Criticism
- Custom cryptographic constructions
- Not using established patterns
- "Rolling their own crypto"

### Defense
- Perfect Forward Secrecy supported
- Regular security updates
- Bug bounty program

---

## Secret Chats

### Features
- E2E encryption
- Device-specific (no cloud sync)
- Self-destruct timers
- Screenshot notifications

### Limitations
- Must be manually initiated
- Not available for groups
- No multi-device support

---

## Scalability Focus

Telegram prioritizes:
- Speed over security
- Features over privacy
- Scale (950M+ users)
- Group functionality (200K members)

---

## Sources

| Source | Type |
|--------|------|
| [MTProto Documentation](https://core.telegram.org/mtproto) | Official |
| [Telegram Encryption](https://telegram.org/faq#q-what-is-this-encryption-key) | Official |

---

*Constitutional Research Note: Telegram's technical architecture reveals different priorities than privacy-first messengers. The cloud model enables features (sync, large groups) at the cost of E2E encryption by default.*
