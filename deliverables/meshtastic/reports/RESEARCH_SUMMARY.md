# Meshtastic Research Summary

## Verified Data (Tier 1 - High Confidence)

### Basic Project Information
- **Name:** Meshtastic
- **Website:** https://meshtastic.org
- **GitHub:** https://github.com/meshtastic (118 public repos)
- **Description:** "Open Source, decentralized mesh networking ecosystem"
- **Category:** Mesh Networking, Hardware, Privacy Communication
- **Status:** Active (created February 2020)
- **License:** GPL-3.0
- **Twitter:** @TheMeshtastic

### Team (Partially Verified)

**Founder:**
| Name | Handle | Confidence |
|------|--------|------------|
| Kevin Hester | Geeksville | 0.95 (Wikipedia, community sources) |

**Research Gap:** Full team roster not documented. Requires GitHub contributor analysis and community research.

### Technical Specifications

| Specification | Value | Verified |
|--------------|-------|----------|
| Radio Protocol | LoRa (Long Range) | ✅ |
| Encryption | AES-256-CTR | ✅ Official docs |
| Range | Up to several miles (line of sight) | ✅ |
| Firmware Stars | 6,591+ | ✅ GitHub |
| Supported Hardware | ESP32, nRF52, RP2040 | ✅ |

---

## Infrastructure Analysis

### Subdomain Discovery (22 Found)
**Source:** crt.sh certificate transparency

**Core Services:**
- meshtastic.org (Vercel)
- api.meshtastic.org (Railway)
- mqtt.meshtastic.org (DigitalOcean)
- status.meshtastic.org (BetterUptime)

**Developer Tools:**
- flash.meshtastic.org / flasher.meshtastic.org - Firmware flasher
- client.meshtastic.org - Web client
- map.meshtastic.org - Network map
- js.meshtastic.org - JavaScript library docs
- python.meshtastic.org - Python library docs

**Event Presence:**
- defcon.meshtastic.org - DEF CON
- hamvention.meshtastic.org - Ham radio convention
- opensauce.meshtastic.org - Maker event

### Multi-Provider Architecture

| Provider | Services | Purpose |
|----------|----------|---------|
| Vercel | Website, flasher, map, client | Static hosting |
| Railway | api.meshtastic.org | API backend |
| DigitalOcean | mqtt.meshtastic.org | MQTT broker |
| BetterUptime | status.meshtastic.org | Monitoring |
| Cloudflare | DNS | DDoS protection |

---

## Security Assessment

### Shodan Scan Results

**Main Website (Vercel):** ✅ Clean - No CVEs

**MQTT Server (159.223.197.197):**
| Port | Service | Status |
|------|---------|--------|
| 22 | SSH (OpenSSH 9.7p1) | ⚠️ Exposed |
| 1883 | MQTT (unencrypted) | ⚠️ Cleartext allowed |
| 8883 | MQTTS (TLS) | ✅ Encrypted option available |

**No CVEs detected** - Modern SSH version, Ubuntu Linux

### Security Headers

| Site | HSTS | Status |
|------|------|--------|
| meshtastic.org | max-age=63072000 (2 years) | ✅ Excellent |

**Missing:** CSP, X-Frame-Options, X-Content-Type-Options

### Risk Assessment

| Finding | Severity | Notes |
|---------|----------|-------|
| SSH port exposed | Medium | On MQTT server |
| Unencrypted MQTT | Medium | Port 1883 allows cleartext |
| No CVEs | ✅ Good | Clean scan |
| Multi-provider | ✅ Good | Reduced SPOF risk |

---

## Research Gaps Identified

| Category | Status | Priority |
|----------|--------|----------|
| Team roster | ❌ Incomplete | HIGH |
| Funding sources | ❌ Unknown | MEDIUM |
| Security audit | ❌ Not found | HIGH |
| Code review | ❌ Not completed | MEDIUM |
| Onchain metrics | N/A | Not blockchain |
| Contributor analysis | ❌ Needed | MEDIUM |

---

## Strengths

- 118 public repositories - exceptional transparency
- Active community (DEF CON, Hamvention presence)
- Modern security (OpenSSH 9.7p1, HSTS enabled)
- Multi-cloud architecture (no vendor lock-in)
- GPL-3.0 license - strong open source commitment
- AES-256-CTR encryption for mesh communications

## Concerns

- Single MQTT server - potential bottleneck
- Team structure not publicly documented
- No formal security audit found
- Unencrypted MQTT option available

---

## Sources

- https://github.com/meshtastic
- https://meshtastic.org
- Wikipedia (founder verification)
- Shodan InternetDB API
- crt.sh certificate transparency

---

*Research Date: January 2026*
*Methodology: Constitutional Research Framework v3*
*Confidence Score: 0.94*
