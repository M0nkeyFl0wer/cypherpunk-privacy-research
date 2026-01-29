# Security & Audits

*Research Date: 2026-01-28*

---

## Security Audits

### 1. Trail of Bits (August 2020)
- **Scope:** MobileCoin core protocol security review
- **Level of Effort:** 4 (Trail of Bits scale)
- **Report:** [MobileCoin.pdf](https://github.com/trailofbits/publications/blob/master/reviews/Mobilecoin.pdf)

### 2. NCC Group - Cryptographic Review (February 2020)
- **Scope:** RustCrypto AES/GCM and ChaCha20+Poly1305 implementations (used in SGX enclaves)
- **Effort:** 5 person-days
- **Findings:** No vulnerabilities; performance recommendations only
- **Report:** [NCC Group Public Report](https://research.nccgroup.com/2020/02/26/public-report-rustcrypto-aes-gcm-and-chacha20poly1305-implementation-review/)

---

## Bug Bounty Program

**Status:** No formal program on major platforms (Immunefi, HackerOne).

**Vulnerability Disclosure:**
- Email: security@mobilecoin.com
- GitHub Security Advisories available

---

## SGX Security Model

MobileCoin uses Intel SGX secure enclaves. Threat model defines five adversary levels:

1. **Oscar:** Network traffic monitoring only
2. **Eve:** Can observe Fog/consensus memory, cannot compromise SGX
3. **Mallory:** Root access on servers, cannot compromise SGX
4. **Darth:** Can compromise SGX or remote attestation
5. **Trudy:** Can compromise SGX but lacks infrastructure access

**Defense in Depth:** Even if SGX compromised:
- Recipients protected by one-time addresses
- Senders protected by ring signatures
- Amounts concealed with RingCT
- Forward secrecy after enclave patching

---

## Known Incidents

### FTX Market Manipulation (April 2021)
- **Nature:** Exchange exploit, NOT MobileCoin protocol vulnerability
- **Impact:** ~$800M loss to FTX
- **Details:** Trader manipulated MOB price on FTX ($6→$70), used as collateral
- **MobileCoin Protocol:** Not compromised
- **Source:** [Web3 Is Going Great](https://www.web3isgoinggreat.com/?id=ftx-mobilecoin-exploit)

---

## Security Assessment

| Aspect | Status |
|--------|--------|
| Protocol Audit | Trail of Bits (2020) |
| Crypto Audit | NCC Group (2020) - no vulnerabilities |
| Bug Bounty | None formal |
| Known Exploits | None (FTX was exchange issue) |
| Audit Age | 5+ years (concern) |

**Strengths:** Professional audits, thoughtful threat model, defense-in-depth architecture.

**Concerns:** Audits from 2020 (outdated), no formal bug bounty, SGX side-channel attack surface.

---

## Sources

- [Trail of Bits Audit](https://github.com/trailofbits/publications/blob/master/reviews/Mobilecoin.pdf)
- [NCC Group Audit](https://research.nccgroup.com/2020/02/26/public-report-rustcrypto-aes-gcm-and-chacha20poly1305-implementation-review/)
- [MobileCoin Fog Threat Model](https://github.com/mobilecoinfoundation/mobilecoin/blob/main/fog-threat-model-2.1.0.md)
- [GitHub Repository](https://github.com/mobilecoinfoundation/mobilecoin)
