# Security Analysis: Telegram

**Last Updated**: 2026-01-19

---

## Critical Security Notice

**Telegram does NOT provide end-to-end encryption by default.** Regular chats, including all group chats, use server-client encryption only. This means Telegram's servers can access message content.

---

## Encryption Model

### Regular Chats (Default)
- **Protocol**: MTProto 2.0
- **Type**: Server-client encryption
- **E2E**: NO
- **Telegram Access**: YES - servers can read messages

### Secret Chats (Optional)
- **Protocol**: MTProto E2E
- **Type**: End-to-end encryption
- **E2E**: YES
- **Telegram Access**: NO
- **Limitations**: Not available for groups, device-specific

---

## MTProto Protocol

### Design
- Proprietary protocol developed by Telegram
- Not based on established standards (unlike Signal Protocol)
- Documentation available but not open standard

### Academic Analysis
Security researchers have identified concerns:
- "Technically trivial to more advanced theoretical" weaknesses
- Not using established cryptographic patterns
- Custom constructions instead of proven primitives

### Mitigating Factors
- For most users, "immediate risk is low"
- MTProto 2.0 addressed some earlier issues
- Perfect Forward Secrecy supported

---

## What Telegram CAN See

In regular chats, Telegram has access to:
- Message content
- Sender/recipient
- Timestamps
- Media files
- Group memberships
- Contact lists (if synced)

---

## What Telegram Claims

- Messages stored encrypted on servers
- Distributed across multiple jurisdictions
- No advertising-based business model
- Resisted government requests (historically)

### Verification
- Cannot independently verify server claims
- Server code is closed source
- Requires trust in Telegram

---

## Comparison to Signal

| Feature | Telegram | Signal |
|---------|----------|--------|
| Default E2E | NO | YES |
| Group E2E | NO | YES |
| Protocol | Proprietary | Open standard |
| Server Code | Closed | Open |
| Metadata | Collected | Minimized |

---

## Recommendations

### Use Telegram For:
- Large group coordination
- Channels and broadcasts
- File sharing
- Public communities

### Do NOT Use Telegram For:
- Privacy-critical communications
- Sensitive personal matters
- Situations requiring E2E by default
- Adversarial threat models

### If You Must Use Telegram Privately:
1. Use Secret Chats exclusively
2. Enable self-destruct timers
3. Verify encryption keys
4. Remember: no group E2E available

---

## Sources

| Source | Type |
|--------|------|
| [MTProto Documentation](https://core.telegram.org/mtproto) | Official |
| [Security Analysis](https://mtpsym.github.io/) | Academic |
| [Wikipedia](https://en.wikipedia.org/wiki/Telegram_(software)) | Reference |

---

*Constitutional Research Note: Telegram's security model is fundamentally different from Signal. The lack of default E2E encryption is a significant limitation for privacy-focused use cases. Users should understand that regular Telegram chats are NOT private from Telegram itself.*
