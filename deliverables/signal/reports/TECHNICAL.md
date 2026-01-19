# Technical Analysis: Signal

**Last Updated**: 2026-01-19

---

## Technical Overview

Signal implements the Signal Protocol, a cryptographic protocol providing end-to-end encryption for instant messaging. The protocol combines the Extended Triple Diffie-Hellman (X3DH) key agreement protocol with the Double Ratchet algorithm to provide forward secrecy and post-compromise security.

---

## Signal Protocol Architecture

### Protocol Stack

```
┌─────────────────────────────────────────────────────┐
│                   APPLICATION                        │
│  (Signal-Android, Signal-iOS, Signal-Desktop)       │
├─────────────────────────────────────────────────────┤
│                 SESSION LAYER                        │
│  (Message encryption, Group management)              │
├─────────────────────────────────────────────────────┤
│                DOUBLE RATCHET                        │
│  (Key derivation, Message keys)                      │
├─────────────────────────────────────────────────────┤
│                    X3DH                              │
│  (Initial key agreement)                             │
├─────────────────────────────────────────────────────┤
│              CRYPTOGRAPHIC PRIMITIVES                │
│  (Curve25519, AES-256-GCM, HMAC-SHA256)             │
└─────────────────────────────────────────────────────┘
```

---

## X3DH (Extended Triple Diffie-Hellman)

### Purpose
Establishes a shared secret between two parties who may be offline (asynchronous key exchange).

### Key Types

| Key | Type | Usage |
|-----|------|-------|
| Identity Key (IK) | Long-term | User identity |
| Signed Prekey (SPK) | Medium-term | Rotated periodically |
| One-time Prekeys (OPK) | Ephemeral | Used once per session |
| Ephemeral Key (EK) | Per-message | Fresh for each exchange |

### X3DH Key Agreement

```
Alice                                     Bob
  |                                        |
  |      [IK_A, EK_A] ───────────────────> |
  |                                        |
  |  DH1 = DH(IK_A, SPK_B)                |
  |  DH2 = DH(EK_A, IK_B)                 |
  |  DH3 = DH(EK_A, SPK_B)                |
  |  DH4 = DH(EK_A, OPK_B) [if available] |
  |                                        |
  |  SK = KDF(DH1 || DH2 || DH3 || DH4)   |
```

---

## Double Ratchet Algorithm

### Purpose
Derives unique encryption keys for every message, providing:
- **Forward Secrecy**: Compromised keys don't reveal past messages
- **Post-Compromise Security**: Future messages become secure after breach

### Ratchet Components

| Ratchet | Function |
|---------|----------|
| **Root Ratchet** | Derives chain keys from DH results |
| **Sending Chain** | Generates message keys for sending |
| **Receiving Chain** | Generates message keys for receiving |

### Message Key Derivation

```
                    ┌─────────────────┐
                    │   Root Key      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌─────────┐   ┌─────────┐   ┌─────────┐
        │Chain Key│   │Chain Key│   │Chain Key│
        │   N     │   │  N+1    │   │  N+2    │
        └────┬────┘   └────┬────┘   └────┬────┘
             │              │              │
             ▼              ▼              ▼
        ┌─────────┐   ┌─────────┐   ┌─────────┐
        │Msg Key  │   │Msg Key  │   │Msg Key  │
        │   N     │   │  N+1    │   │  N+2    │
        └─────────┘   └─────────┘   └─────────┘
```

---

## Post-Quantum Cryptography

### PQXDH (Post-Quantum X3DH)

Added in September 2023 to protect against future quantum computers:

| Component | Classical | Post-Quantum |
|-----------|-----------|--------------|
| Key Exchange | X25519 | CRYSTALS-Kyber |
| Approach | ECDH | Lattice-based |
| Combined | Hybrid - both must be broken |

### SPQR (Sparse Post Quantum Ratchet)

The Triple Ratchet combines:
1. **Double Ratchet** (classical)
2. **SPQR** (post-quantum)
3. **Mixed keys** from both

**Formal Verification**: ProVerif machine-checked proofs confirm security properties.

---

## Cryptographic Primitives

| Primitive | Algorithm | Purpose |
|-----------|-----------|---------|
| Key Exchange | X25519 (Curve25519) | ECDH key agreement |
| Encryption | AES-256-GCM | Message encryption |
| MAC | HMAC-SHA256 | Message authentication |
| KDF | HKDF-SHA256 | Key derivation |
| Signature | Ed25519 | Identity key signatures |
| PQ Key Exchange | CRYSTALS-Kyber | Post-quantum KEM |

---

## Message Encryption

### Envelope Structure

```
┌─────────────────────────────────────────────┐
│              Encrypted Message              │
├─────────────────────────────────────────────┤
│ Header (unencrypted)                        │
│ - Sender ratchet public key                 │
│ - Message number                            │
│ - Previous chain length                     │
├─────────────────────────────────────────────┤
│ Ciphertext (AES-256-GCM)                   │
│ - Encrypted message content                 │
│ - Authentication tag                        │
└─────────────────────────────────────────────┘
```

---

## Sealed Sender

### Metadata Protection

Hides sender identity from Signal servers:

```
Traditional:
  Server sees: Alice → Bob

Sealed Sender:
  Server sees: ??? → Bob
```

### Implementation
1. Sender encrypts message AND their identity
2. Only recipient can decrypt sender identity
3. Server cannot determine who sent the message

---

## Group Messaging

### Private Groups

Uses **Sender Keys** protocol:
1. Each member generates sender key
2. Sender keys distributed via Signal Protocol
3. Messages encrypted once for entire group
4. Zero-knowledge group credentials hide membership

### Group Properties
- Server doesn't know group membership
- Group title/avatar encrypted
- Member list encrypted on client

---

## Server Architecture

### Minimal Data Storage

| Data | Stored | Note |
|------|--------|------|
| Messages | Temporarily | Until delivered |
| Contacts | No | Hashed phone numbers only |
| Groups | Encrypted | Server can't read |
| Metadata | Minimal | Sealed sender limits exposure |

### Server Components

```
┌─────────────────────────────────────────────┐
│                Signal Server                 │
├───────────────┬──────────────┬──────────────┤
│  Registration │   Delivery   │   Storage    │
│    Service    │   Service    │   Service    │
├───────────────┼──────────────┼──────────────┤
│  Pre-key      │   Push       │   Profile    │
│  Distribution │   Notify     │   Storage    │
└───────────────┴──────────────┴──────────────┘
```

---

## Client Implementation

### Platform Technologies

| Platform | Language | Framework |
|----------|----------|-----------|
| Android | Kotlin | Native Android |
| iOS | Swift | Native iOS |
| Desktop | TypeScript | Electron |
| Crypto | Rust | libsignal |

### libsignal Bindings

```
         ┌───────────────────┐
         │   libsignal-rust  │
         │  (Core Protocol)  │
         └─────────┬─────────┘
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
┌─────────┐  ┌─────────┐  ┌─────────┐
│  Java   │  │  Swift  │  │  TypeScript│
│ Android │  │   iOS   │  │  Desktop │
└─────────┘  └─────────┘  └─────────┘
```

---

## Security Features

### User-Facing

| Feature | Purpose |
|---------|---------|
| Safety Numbers | Verify contact identity |
| Registration Lock | Prevent account takeover |
| Screen Security | Block screenshots |
| Disappearing Messages | Auto-delete |
| Incognito Keyboard | Disable learning |

### Protocol-Level

| Feature | Property |
|---------|----------|
| Forward Secrecy | Past messages safe |
| Post-Compromise Security | Future messages safe |
| Deniability | Can't prove sender |
| Metadata Protection | Sealed sender |

---

## Performance Characteristics

### Efficiency

| Operation | Overhead |
|-----------|----------|
| Key Agreement (X3DH) | ~1ms |
| Message Encryption | Negligible |
| Ratchet Step | ~0.1ms |
| Post-Quantum (PQXDH) | ~10ms additional |

### Message Size

- Minimal overhead (~100 bytes for encryption metadata)
- Efficient for text, media, calls

---

## Sources

| Source | Type |
|--------|------|
| [Signal Protocol Specification](https://signal.org/docs/) | Official |
| [X3DH Specification](https://signal.org/docs/specifications/x3dh/) | Official |
| [Double Ratchet Specification](https://signal.org/docs/specifications/doubleratchet/) | Official |
| [SPQR Blog Post](https://signal.org/blog/spqr/) | Official |
| [Academic Analysis (2016)](https://eprint.iacr.org/2016/1013.pdf) | Academic |

---

*Constitutional Research Note: The Signal Protocol represents a careful balance between security and usability. Its adoption by platforms serving billions of users demonstrates that strong encryption can be implemented at scale without compromising user experience.*
