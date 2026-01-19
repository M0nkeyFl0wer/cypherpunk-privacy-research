# Code Review: Telegram

**Last Updated**: 2026-01-19

---

## Open Source Status

### Open Source Components
| Component | License | Repository |
|-----------|---------|------------|
| Desktop Client | GPL v2 | telegramdesktop/tdesktop |
| Android Client | GPL v2 | TelegramMessenger (various) |
| iOS Client | GPL v2 | TelegramMessenger (various) |
| TDLib | Boost 1.0 | tdlib/td |
| Web Clients | GPL v3 | Various |

### Closed Source
- Server infrastructure
- Backend code
- MTProto server implementation

---

## Key Repository: tdesktop

**URL**: https://github.com/telegramdesktop/tdesktop
**Stars**: 29,577
**Language**: C++
**License**: GPL v2

### Build Verification
Telegram claims apps can be verified as built from GitHub source through reproducible builds.

---

## TDLib

Cross-platform library for building Telegram clients:
- **License**: Boost Software License 1.0
- **Languages**: C++ with bindings for many languages
- **Purpose**: Enables third-party client development

---

## Protocol Documentation

MTProto is documented at core.telegram.org but is:
- Proprietary (not an open standard)
- Developed internally
- Not independently standardized

---

## Sources

| Source | Type |
|--------|------|
| [GitHub - tdesktop](https://github.com/telegramdesktop/tdesktop) | Official |
| [Telegram Apps](https://telegram.org/apps) | Official |

---

*Constitutional Research Note: While Telegram's clients are open source, the proprietary server and protocol mean security claims cannot be fully verified.*
