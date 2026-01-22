# Telegram Research Summary

## Verified Data (Tier 1 - High Confidence)

### Basic Project Information
- **Name:** Telegram
- **Website:** https://telegram.org
- **GitHub:** https://github.com/telegramdesktop (desktop only)
- **Description:** Cloud-based instant messaging service
- **Category:** Messaging, Privacy (partial)
- **Status:** Active
- **Users:** 950+ million monthly active users
- **License:** GPL-3.0 (desktop client only)

### Team (Verified)

**Founders:**
| Name | Role | Background | Confidence |
|------|------|------------|------------|
| Pavel Durov | Founder, CEO | VKontakte founder, left Russia 2014 | 1.0 |
| Nikolai Durov | Co-founder, Technical Lead | MTProto architect, mathematician | 1.0 |

**Company:**
- Headquarters: Dubai, UAE
- Funding: Self-funded by Durov brothers + TON ICO (returned)
- Team Size: Relatively small for user base

---

## Critical Privacy Notice

**Telegram does NOT provide end-to-end encryption by default.**

| Chat Type | Encryption | Telegram Can Read? |
|-----------|------------|-------------------|
| Regular chats | Server-client | **YES** |
| Group chats | Server-client | **YES** |
| Channels | Server-client | **YES** |
| Secret Chats | End-to-end | No |

---

## Infrastructure Analysis

### DNS & Hosting
| Component | Provider |
|-----------|----------|
| DNS | Google Domains |
| Nameservers | ns-cloud-b{1-4}.googledomains.com |
| Web Server | nginx 1.18.0 (EOL) |

### Subdomain Discovery (36 Found)
**Source:** crt.sh certificate transparency

**Core Services:**
- telegram.org - Main website
- api.telegram.org - Bot API
- web.telegram.org - Web client
- core.telegram.org - Documentation
- osx.telegram.org - macOS app

**Mail Infrastructure:**
- mx1, mx2, mx10, mx101, mx110.telegram.org

**Suspicious Patterns:**
- Multiple double-dash domains in cert logs (chinese--telegram.org, china--telegram.org)
- Likely phishing attempts, not official infrastructure

---

## Security Assessment

### Shodan Scan Results

**Main Website (149.154.167.99):**

| Finding | Severity | Status |
|---------|----------|--------|
| nginx 1.18.0 | HIGH | End of Life product |
| CVE-2023-44487 | HIGH | HTTP/2 Rapid Reset DDoS |
| CVE-2021-23017 | HIGH | DNS Resolver vulnerability |
| CVE-2021-3618 | MEDIUM | ALPACA TLS confusion attack |
| CVE-2025-23419 | TBD | Recent vulnerability |

### Security Headers

| Header | Status |
|--------|--------|
| HSTS | ✅ Enabled with preload |
| X-Frame-Options | ✅ SAMEORIGIN |
| CSP | ❌ Missing |
| X-Content-Type-Options | ❌ Missing |
| Referrer-Policy | ❌ Missing |

---

## MTProto Protocol Analysis

### Design Concerns
- **Proprietary protocol** - not based on established standards
- Custom constructions instead of proven primitives
- Academic analysis found "technically trivial to more advanced theoretical" weaknesses

### Mitigating Factors
- MTProto 2.0 addressed some earlier issues
- Perfect Forward Secrecy supported
- "Immediate risk is low" for most users

---

## Open Source Status

| Component | Status |
|-----------|--------|
| Desktop client | ✅ Open source |
| Mobile clients | ⚠️ Partially open |
| Server | ❌ Closed source |

**GitHub Organization:**
- 20 public repositories
- Created: December 2013
- Stars (desktop): 29,577

---

## Comparison to Signal

| Feature | Telegram | Signal |
|---------|----------|--------|
| Default E2E | ❌ NO | ✅ YES |
| Group E2E | ❌ NO | ✅ YES |
| Protocol | Proprietary MTProto | Open Signal Protocol |
| Server Code | Closed | Open |
| Metadata | Collected | Minimized |

---

## Risk Assessment

### Critical Findings
1. **4 CVEs detected** on main server
2. **nginx 1.18.0 is end-of-life** - security patches not available
3. **Server-side encryption by default** - not E2E
4. **Server is closed source** - cannot verify claims

### Positive Findings
- HSTS with preload enabled
- Desktop client is open source
- Secret Chats offer E2E encryption
- Leadership has track record of resisting government pressure

---

## Strengths

- 950+ million users - massive network effect
- Feature-rich (channels, bots, file sharing)
- Founders left Russia over privacy demands
- Secret Chats provide opt-in E2E
- Excellent UX and cross-platform support

## Concerns

- **E2E encryption NOT default** - most conversations visible to Telegram
- nginx 1.18.0 with known CVEs on main infrastructure
- Proprietary MTProto protocol (not industry standard)
- Server code closed source
- Phone number required (identity linkage)
- Missing security headers (CSP)

---

## Recommendations

**Use Telegram For:**
- Large group coordination
- Channels and broadcasts
- File sharing
- Public communities

**Do NOT Use Telegram For:**
- Privacy-critical communications
- Sensitive personal matters
- Adversarial threat models
- Any situation requiring verified E2E

**If You Must Use Telegram Privately:**
1. Use Secret Chats exclusively
2. Enable self-destruct timers
3. Verify encryption keys
4. Remember: **no group E2E available**

---

## Sources

- https://telegram.org
- https://github.com/telegramdesktop
- https://core.telegram.org/mtproto (MTProto documentation)
- https://mtpsym.github.io/ (Academic security analysis)
- https://en.wikipedia.org/wiki/Telegram_(software)
- Shodan InternetDB API
- crt.sh certificate transparency

---

*Research Date: January 2026*
*Methodology: Constitutional Research Framework v3*
*Confidence Score: 0.91*
