# Telegram

## Description
Telegram is a cross-platform cloud-based messaging service launched in 2013 by Pavel and Nikolai Durov. With over 950 million monthly active users (2024), it's one of the world's most popular messaging platforms.

**Important Privacy Note**: Unlike Signal, Telegram does NOT use end-to-end encryption by default. Regular chats use server-client encryption (MTProto), meaning Telegram servers can theoretically access message content. End-to-end encryption is only available through the optional "Secret Chats" feature, which is not available for group chats.

## Links
- **Website**: https://telegram.org
- **Documentation**: https://core.telegram.org
- **GitHub (Desktop)**: https://github.com/telegramdesktop
- **GitHub (TDLib)**: https://github.com/tdlib

## Category
Privacy Infrastructure (Messaging - Partial E2E)

## Ecosystem
Non-blockchain (formerly connected to TON)

## Key Features

### Communication
- **Cloud Sync**: Messages synced across devices
- **Large Groups**: Up to 200,000 members
- **Channels**: Broadcast to unlimited subscribers
- **File Sharing**: Up to 2GB per file
- **Bots**: Extensive bot platform

### Privacy Features
- **Secret Chats**: Optional E2E encryption (not default)
- **Self-Destructing Messages**: Timed deletion
- **Hidden Phone Number**: With Premium
- **MTProto 2.0**: Server-client encryption

## Encryption Status

| Chat Type | Encryption | E2E |
|-----------|------------|-----|
| Regular Chat | MTProto (server-client) | NO |
| Group Chat | MTProto (server-client) | NO |
| Secret Chat | MTProto E2E | YES |
| Voice Call | E2E | YES |

## GitHub Metrics

| Repository | Stars | Language |
|------------|-------|----------|
| tdesktop | 29,577 | C++ |
| libtgvoip | 91 | C++ |

## Open Source Status
- **Clients**: Open source (GPL v2/v3)
- **TDLib**: Cross-platform library (Boost 1.0)
- **Server**: Closed source
- **Protocol**: Documented but proprietary

## Security Concerns

1. **No Default E2E**: Regular chats readable by Telegram
2. **Proprietary Protocol**: MTProto not standard cryptography
3. **Closed Server**: Cannot verify server-side claims
4. **Metadata**: Telegram collects significant metadata
5. **Academic Criticism**: Cryptographic weaknesses identified

## Founder
**Pavel Durov** - Also founded VKontakte (Russian social network)

---
*Research completed with Constitutional Research v2.0.0*
*Last updated: 2026-01-19*

**Note**: For privacy-critical communications, Signal is generally recommended over Telegram due to default E2E encryption and open protocol.
