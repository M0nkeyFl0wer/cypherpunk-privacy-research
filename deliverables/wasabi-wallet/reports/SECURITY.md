# Security & Audits

*Research Date: 2026-01-28*

---

## Security Audits

**No formal third-party security audits found.**

Wasabi Wallet relies on its open-source model for security verification. The codebase is publicly available on GitHub, allowing independent security researchers and the community to review the code.

**Third-Party Security Rating:**
- [CER.live](https://cer.live/wallet/wasabi-windows) rates Wasabi Wallet with a **BBB security rating** (considered good)

**Open-Source Verification:**
- Full source code available at [github.com/WalletWasabi/WalletWasabi](https://github.com/WalletWasabi/WalletWasabi)
- Community can audit code and submit vulnerabilities
- All releases are PGP-signed with key fingerprint: `6FB3 872B 5D42 292F 5992 0797 8563 4832 8949 861E`

---

## Bug Bounty Program

**Active Bug Bounty Program**

Wasabi Wallet maintains a bug bounty program encouraging responsible disclosure of security vulnerabilities.

**Reporting Channels:**
- **Email:** security@wasabiwallet.io (PGP encryption encouraged)
- **GitHub:** Private vulnerability reporting via GitHub Security Advisories
- **PGP Key Fingerprint:** `F079 0C08 68BD BAB8 EE33 F9CE 50FB 7FEB 00F9 7588`

**Bounty Examples:**
- Testing bounties for releases (e.g., v1.1.12): 0.3 BTC total bounty pool with point system
- Ondrej Vejpustek (TREZOR team) received a Bitcoin bounty for the 2020 DoS vulnerability disclosure

**Disclosure Policy:**
- Non-critical vulnerabilities: Open regular GitHub issues
- Critical vulnerabilities: Use responsible disclosure via GitHub security advisories or encrypted email

**Source:** [Security Policy - Wasabi Docs](https://docs.wasabiwallet.io/building-wasabi/Security.html)

---

## Known Incidents

### 1. WabiSabi Deanonymization Vulnerability (December 2024)

**Severity:** Critical
**Status:** Patched

A vulnerability in the WabiSabi coinjoin protocol allowed malicious coordinators to deanonymize coinjoin participants.

**Technical Details:**
- Malicious coordinators could assign unique maximum amount parameters to different users
- This "tagging attack" allowed tracking inputs to outputs, negating privacy benefits
- The vulnerability affected the Keyed Verification Anonymous Credentials (KVACs) system

**Affected Versions:**
- Wasabi Wallet v2.2.1.0 and below
- Ginger Wallet v2.0.13 and below
- BTCPay Server coinjoin plugin v1.0.101.0 and below

**Discovery:** Reported by security researcher drkgry to GingerWallet team
**Note:** Wasabi maintainer Lucas Ontivero stated a fix existed since 2021 but was broken during a refactoring

**Sources:**
- [Bitcoin Magazine - WabiSabi Deanonymization Vulnerability](https://bitcoinmagazine.com/technical/wabisabi-deanonymization-vulnerability-disclosed)
- [GingerWallet Discussion #116](https://github.com/GingerPrivacy/GingerWallet/discussions/116)

---

### 2. July 2024 Coordinated Attack

**Severity:** High
**Status:** Resolved

A sophisticated, multi-vector attack on July 9-10, 2024 involving:

1. **Layer 7 DDoS Attacks:** Targeted free coordinators to redirect liquidity
2. **Supply Chain Compromise:** Malicious Wasabi-2.0.8.1.msi installer uploaded via compromised GitHub account
3. **Protocol Exploitation:** wasabicoordinator.io exploited a vulnerability to charge unauthorized fees

**Attack Details:**
- Malicious coordinator used suspicious parameters (only 2 inputs required, maximum fees)
- Vulnerability allowed coordinators to charge higher fees than user-specified
- Fraudulent installer promptly removed after detection

**Response:**
- Version 2.1.0 released with vulnerability patches
- Users advised to pause coinjoining until update
- Additional access restrictions implemented

**Impact:** Limited due to WabiSabi protocol robustness and quick response

**Source:** [GitHub Discussion #13249 - Security Incident Disclosure](https://github.com/WalletWasabi/WalletWasabi/discussions/13249)

---

### 3. CoinJoin DoS Vulnerability (2020)

**Severity:** Medium (DoS only, no fund theft or deanonymization)
**Status:** Fixed in v4 Hard Fork

**Discovery Timeline:**
- 2020-05-10: Ondrej Vejpustek (TREZOR team) reported via PGP-encrypted email
- 2020-05-11: Vulnerability confirmed by Wasabi team
- 2020-05-12: Bitcoin bounty paid to researcher
- 2020-08-05: Client-side fix released in v1.1.12
- 2020-09-03: v4 Hard Fork deployed with complete fix

**Technical Details:**
- Attacker could register bitcoin for a mix without proper verification
- Would cause mismatch between inputs and outputs, halting CoinJoin process
- Could perform DoS attack while remaining difficult to identify
- **No funds could be stolen and no deanonymization possible**

**Impact:** No known exploitation before fix was deployed

**Sources:**
- [Wasabi Blog - Responsible Disclosure & v4 Hard Fork](https://blog.wasabiwallet.io/responsible-disclosure-v4-hard-fork/)
- [Nasdaq - Wasabi Wallet Patches Flaw](https://www.nasdaq.com/articles/wasabi-wallet-patches-flaw-that-could-have-thwarted-bitcoin-privacy-feature-2020-09-03)

---

## Regulatory Impact on Security

**CoinJoin Coordinator Shutdown (June 2024)**

Following the arrest of Samourai Wallet founders on money laundering charges in April 2024, zkSNACKs (Wasabi's developer) discontinued its native CoinJoin coordinator service and prohibited US citizens from using their services.

This created security implications:
- Users now rely on third-party coordinators
- July 2024 incident demonstrated risks of malicious coordinators
- WabiSabi protocol designed to be coordinator-trustless, but vulnerabilities can still exist

---

## Security Assessment

**Overall Rating: Moderate**

**Strengths:**
- Open-source code enabling community audits
- Active bug bounty program with documented payouts
- Responsible disclosure history with TREZOR team
- Quick response to July 2024 coordinated attack
- BBB rating on CER.live
- PGP-signed releases

**Concerns:**
- No formal third-party security audits published
- December 2024 deanonymization vulnerability was critical
- Coordinator-dependent privacy model has inherent risks
- Shutdown of official coordinator increases reliance on third parties

**Recommendations for Users:**
- Always verify PGP signatures before installation
- Keep wallet updated to latest version
- Be cautious when selecting coinjoin coordinators
- Monitor GitHub security advisories

---

## Sources

- [Wasabi Docs - Security Policy](https://docs.wasabiwallet.io/building-wasabi/Security.html)
- [GitHub - WalletWasabi Security](https://github.com/WalletWasabi/WalletWasabi/security)
- [GitHub Discussion #13249 - July 2024 Incident](https://github.com/WalletWasabi/WalletWasabi/discussions/13249)
- [Bitcoin Magazine - WabiSabi Vulnerability](https://bitcoinmagazine.com/technical/wabisabi-deanonymization-vulnerability-disclosed)
- [Wasabi Blog - v4 Hard Fork Disclosure](https://blog.wasabiwallet.io/responsible-disclosure-v4-hard-fork/)
- [CER.live - Wasabi Windows Rating](https://cer.live/wallet/wasabi-windows)
- [GingerWallet Discussion #116 - Vulnerability Report](https://github.com/GingerPrivacy/GingerWallet/discussions/116)
- [Cryptonews - Wasabi Wallet Review](https://cryptonews.com/reviews/wasabi-wallet-review/)
