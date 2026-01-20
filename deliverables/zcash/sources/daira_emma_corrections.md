# Zcash Research Corrections - Daira-Emma Hopwood Feedback

**Reviewer:** Daira-Emma Hopwood (R&D Engineering Manager, Electric Coin Company)
**Date of Feedback:** December 25, 2025 & January 16, 2026
**Source:** Direct Telegram feedback

---

## Historical Timeline Corrections

### CryptoNote Dating Issue

**Original Claim:** CryptoNote dates from 2012

**Correction:** CryptoNote actually dates from **2014**, not 2012.

- The CryptoNote 1.0 and 2.0 papers had **backdated publication dates**
- This backdating was presumably related to the **ByteCoin premine** scandal
- Source: https://bitcointalk.org/index.php?topic=740112.0

**Implications:** Any references to CryptoNote originating in 2012 should be corrected to 2014. The ByteCoin premine scandal involved retroactively claiming earlier existence.

### Zerocash Paper & Zcash Development Timeline

**Correction:**
- Zerocash paper published: **2014**
- Zcash development started: **2015**
- Zcash mainnet launch: **October 28, 2016** ✓ (already correct)

### First Confidential Amounts Implementation

**Key Historical Fact:**
- Monero only deployed RingCT in **2017**
- Therefore, **Zcash was the first widely deployed cryptocurrency to ensure confidentiality of amounts**
- Zcash launched with shielded transactions (hiding amounts) in October 2016
- This is a significant historical claim that should be documented

---

## Protocol Characteristics Clarifications

### Privacy Policy

**Context:** The research may have fields like "privacy_policy" that don't apply to protocols.

**Correction:** A fully decentralized private blockchain **doesn't need a privacy policy**. That concept is for:
- Services (exchanges, custodians)
- Wallets (like Zashi)
- Companies (ECC, Zcash Foundation)

**What Zcash Has Instead:**
- Extensive documentation of **privacy properties**
- Technical specifications (ZIPs - Zcash Improvement Proposals)
- Cryptographic guarantees documented in papers

### Compliance

**Original Field/Question:** "compliance" or regulatory compliance

**Daira-Emma's Response:**
> "fuck no, we're cypherpunks, what do you take us for"

**Correction:**
- There is **no compliance in the protocol**
- Compliance is for:
  - Exchanges
  - Partially decentralized services (like NEAR)
  - Custodians
- The Zcash protocol itself is permissionless and uncensorable

### Wallet Authentication

**Original Claim:** Possible field showing "wallet sign-in"

**Correction:**
- There is **no wallet sign-in**
- Only **seed phrases** (mnemonic recovery phrases)
- This is fundamental to self-custody

### Data Collection

**Original Claim:** Possible field showing data collection status

**Correction:**
- There is **no collected data** in the protocol
- Users may **opt in** to specific wallet features that require data
- The protocol itself collects nothing
- This distinguishes protocol-level privacy from service-level privacy

---

## Technical Dependencies Note

**Context:** Fields for "technical dependencies needed for security"

**Daira-Emma's Note:**
> "I don't know how you express technical dependencies needed for security in a short field. That's an hour-long presentation."

**Recommendation:** Rather than oversimplifying, link to:
- [Zcash Protocol Specification](https://zips.z.cash/protocol/protocol.pdf)
- Security audit reports
- Academic papers (Zerocash, Sapling, etc.)

---

## Social Dependencies Note

**Context:** Fields for "social dependencies"

**Daira-Emma's Note:**
> "Social dependencies is a two-hour presentation, lol."

**Key Social Dependencies (High Level):**
- Two independent organizations (ECC and Zcash Foundation)
- Community governance through ZIP process
- Dev Fund mechanism (subject to community votes)
- No single point of failure in governance

---

## UI/Display Corrections

### Typo: "openess"

**Issue:** The word "openess" appeared on a pie chart summary

**Correction:** Should be "**openness**"

**Note:** This typo was not found in the current codebase search. May have been fixed or in a different view.

---

## Updated Historical Context Section

### Privacy Cryptocurrency Timeline (Corrected)

| Year | Event |
|------|-------|
| **2013** | Zerocoin protocol proposed (Johns Hopkins University) |
| **2014** | CryptoNote whitepaper published (NOT 2012 - dates were backdated) |
| **2014** | Zerocash paper published |
| **2014** | Monero launched (based on CryptoNote) - amounts visible |
| **2015** | Zerocoin Electric Coin Company formed |
| **2015** | Zcash development begins |
| **2016** | **Zcash launches (Oct 28)** - First cryptocurrency with confidential amounts |
| **2017** | Zcash Foundation formed |
| **2017** | Monero deploys RingCT - Monero now hides amounts |
| **2018** | Zcash Sapling upgrade |
| **2020** | Zcash Canopy upgrade |
| **2022** | Zcash NU5 (Orchard) upgrade |

### Key Historical Claim

**Zcash was the first widely deployed cryptocurrency to provide confidentiality of transaction amounts.** Monero only added this capability with RingCT in 2017, over a year after Zcash's launch.

---

## Cypherpunk Stance Documentation

**Philosophy:** Zcash is built on cypherpunk principles:

- **Privacy is a fundamental human right**
- **No KYC/AML in the protocol**
- **No censorship capability**
- **No backdoors**
- **Code is law (for the protocol)**

This should be reflected in how we document Zcash - it's not a regulated financial service, it's a privacy technology.

---

## Action Items

1. ✅ Document CryptoNote date correction (2014, not 2012)
2. ✅ Document ByteCoin premine context for backdated papers
3. ✅ Add Zerocash paper publication date (2014)
4. ✅ Note Zcash as first with confidential amounts
5. ✅ Clarify "privacy policy" doesn't apply to protocols
6. ✅ Clarify "compliance" is explicitly not part of protocol
7. ✅ Document no wallet sign-in, only seed phrases
8. ✅ Document no data collection at protocol level
9. ⚠️ Fix "openess" typo if found
10. ✅ Add cypherpunk stance to documentation

---

*Corrections reviewed and documented: 2026-01-19*
*Reviewer credit: Daira-Emma Hopwood*
