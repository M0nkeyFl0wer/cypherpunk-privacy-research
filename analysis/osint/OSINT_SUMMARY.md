# OSINT Summary Report

**Generated**: 2026-01-19
**Tool**: SpiderFoot 4.0
**Methodology**: Passive reconnaissance

---

## Scan Overview

| Project | Domain | Scan Size | Key Findings |
|---------|--------|-----------|--------------|
| Signal | signal.org | 344KB | 5 IPs, 3 subdomains, Cloudflare CDN |
| Telegram | telegram.org | 872KB | Own infrastructure (149.154.x.x) |
| Meshtastic | meshtastic.org | 384KB | 2 open ports (80, 443), Vercel hosting |
| NYM | nymtech.net | 3.2MB | Company: Nym Technologies SA |
| Miden | polygon.technology | 344KB | Part of Polygon infrastructure |
| Secret Network | scrt.network | 176KB | Minimal public footprint |

---

## Infrastructure Analysis

### Signal (signal.org)
- **CDN**: Cloudflare (104.18.x.x range)
- **Subdomains Found**:
  - cdn3.signal.org
  - www.signal.org
- **IP Addresses**:
  - 104.18.11.47 (Cloudflare)
  - 104.18.10.47 (Cloudflare)
- **Security Note**: Uses privacy-preserving Cloudflare proxy - real origin IPs hidden
- **False Positive Note**: Malicious co-hosted sites are Cloudflare shared IP artifacts

### Telegram (telegram.org)
- **Infrastructure**: Self-hosted (149.154.167.99)
- **Subdomains Found**:
  - kws2-1.web.telegram.org
- **Company Affiliates**:
  - Hetzner Online GmbH (German hosting)
  - Dynadot Inc (domain registrar)
- **Note**: Operates own data centers, not cloud-dependent

### Meshtastic (meshtastic.org)
- **IP Address**: 76.76.21.21 (Vercel)
- **Open Ports**:
  - 80/tcp (HTTP)
  - 443/tcp (HTTPS)
- **Hosting**: Vercel (standard Next.js deployment)
- **50 Co-hosted sites**: Shared Vercel infrastructure

### NYM (nymtech.net)
- **Company**: Nym Technologies SA (Swiss registered)
- **Similar Domains**: 17 found
- **Minimal Infrastructure Exposure**: Good OPSEC

### Miden/Polygon (polygon.technology)
- **Part of**: Polygon Labs infrastructure
- **Note**: Miden is a product within Polygon ecosystem

### Secret Network (scrt.network)
- **Minimal Footprint**: 176KB scan result
- **Good OPSEC**: Limited infrastructure exposure

---

## Security Observations

### Positive Practices

| Project | Practice |
|---------|----------|
| Signal | Cloudflare proxy hides origin servers |
| NYM | Swiss company registration, minimal exposure |
| Secret Network | Minimal public infrastructure footprint |
| Telegram | Self-hosted infrastructure (independence) |

### Areas for Investigation

| Project | Observation |
|---------|-------------|
| Meshtastic | Standard Vercel hosting - supply chain dependency |
| Miden | Part of larger Polygon infrastructure |

---

## Similar Domains Detected

Potential typosquatting or related domains found:

| Project | Count | Example Domains |
|---------|-------|-----------------|
| Signal | 67 | signal.ad, signal.ch |
| Miden | 66 | polygon-related |
| Telegram | 48 | Various TLDs |
| Secret | 35 | scrt.* variants |
| NYM | 17 | nym.* variants |

---

## Raw Data Location

Detailed scan results stored in:
- `analysis/osint/signal_scan.json`
- `analysis/osint/telegram_scan.json`
- `analysis/osint/meshtastic_scan.json`
- `analysis/osint/nym_scan.json`
- `analysis/osint/miden_scan.json`
- `analysis/osint/secret_scan.json`

---

## Methodology Notes

This scan used SpiderFoot's passive reconnaissance modules:
- DNS lookups
- WHOIS queries
- Certificate transparency logs
- Similar domain detection
- Port scanning (limited)

No active exploitation or intrusive testing was performed.

---

*Constitutional Research Note: OSINT findings should be cross-referenced with official documentation. Similar domains flagged do not indicate malicious activity - they may be legitimate regional sites or unrelated third parties.*
