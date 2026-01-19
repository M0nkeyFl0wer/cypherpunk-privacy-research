# Technical Analysis: Proton Mail

**Last Updated**: 2026-01-19

---

## Encryption Architecture

### OpenPGP Implementation

Proton Mail uses the OpenPGP standard for email encryption:

```
Sender                           Recipient
  │                                  │
  │ Compose email                    │
  │      │                           │
  │      ▼                           │
  │ Encrypt with recipient's         │
  │ public key                       │
  │      │                           │
  │      ▼                           │
  │ Sign with sender's               │
  │ private key                      │
  │      │                           │
  └──────┼───────────────────────────┤
         │    Encrypted Transit      │
         │                           │
         └───────────────────────────┼──▶ Decrypt with
                                     │    private key
                                     │
                                     │    Verify signature
                                     │
                                     ▼
                                   Read
```

### Key Components

| Component | Technology |
|-----------|------------|
| Web Crypto | OpenPGP.js |
| Go Crypto | gopenpgp |
| Key Derivation | Argon2 |
| Transport | TLS 1.3 |

---

## Zero-Access Architecture

### Design Principle
User keys are encrypted with the user's password. Proton cannot decrypt user data because:

1. Private keys encrypted at rest
2. Decryption only in user's browser/app
3. Password never sent to server
4. Server only stores encrypted blobs

---

## Proton Bridge

For desktop email clients (Outlook, Thunderbird, Apple Mail):

- Local IMAP/SMTP server
- Handles encryption/decryption locally
- Written in Go
- Open source

---

## Product Suite Integration

| Product | Encryption |
|---------|------------|
| Mail | OpenPGP E2E |
| VPN | Various protocols |
| Drive | E2E encrypted storage |
| Calendar | E2E encrypted events |
| Pass | E2E encrypted vault |
| Wallet | Bitcoin with E2E |

---

## Sources

| Source | Type |
|--------|------|
| [Proton Documentation](https://proton.me/support) | Official |
| [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) | Technical |

---

*Constitutional Research Note: Proton's adherence to OpenPGP standards ensures interoperability and allows independent verification of their encryption claims through the open-source client code.*
