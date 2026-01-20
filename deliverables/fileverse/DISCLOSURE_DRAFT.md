# Security Disclosure - DRAFT

**Status:** NOT SENT - Review before sending
**Contact:** hello@fileverse.io
**Standard:** 90-day responsible disclosure

---

## Email Subject

Security Vulnerability Report - Gun Node Infrastructure

---

## Email Body

Hello Fileverse Security Team,

I am a security researcher conducting an assessment of privacy-focused Web3 projects. During my research, I identified infrastructure vulnerabilities affecting your Gun.js relay nodes that I wanted to bring to your attention.

### Summary

Two of your servers have known CVEs and are running end-of-life software:

| Host | IP | Issue |
|------|-----|-------|
| gun-node.fileverse.io | 13.213.218.98 | 2 CVEs, nginx 1.24.0 (EOL) |
| prod-gun-node.fileverse.io | 18.136.133.200 | 2 CVEs, nginx 1.24.0 (EOL) |

### Vulnerabilities

**1. CVE-2023-44487 - HTTP/2 Rapid Reset Attack**
- Severity: HIGH (CVSS 7.5)
- Impact: Denial of Service via HTTP/2 stream cancellation
- Reference: https://nvd.nist.gov/vuln/detail/CVE-2023-44487

**2. CVE-2025-23419 - SSL Session Reuse Authentication Bypass**
- Severity: MEDIUM (CVSS 4.3)
- Impact: Bypasses client certificate authentication via TLS session resumption
- Reference: https://nginx.org/en/security_advisories.html

**3. nginx 1.24.0 End-of-Life**
- EOL Date: April 23, 2024
- Impact: No longer receiving security patches
- Reference: https://endoflife.date/nginx

### Additional Observations

- Server version exposed in HTTP headers (`Server: nginx/1.24.0 (Ubuntu)`)
- Nodes not behind CDN protection (direct AWS exposure)
- No HSTS or security headers configured on these endpoints

### Verification Method

These findings were identified using:
- DNS resolution (dig)
- Shodan InternetDB API (passive scanning)
- HTTP header analysis (curl)
- Certificate transparency logs (crt.sh)

No active exploitation or penetration testing was performed.

### Recommended Remediation

1. Upgrade nginx to 1.26.3+ or 1.27.4+ (patches both CVEs)
2. Add Cloudflare or similar CDN in front of Gun nodes
3. Configure `server_tokens off;` to hide version
4. Add HSTS and security headers

### Disclosure Timeline

Following responsible disclosure practices:
- **Day 0 (Today):** Initial report sent to Fileverse
- **Day 90:** Public disclosure if unresolved

I am happy to verify fixes once applied and will not publish details until you have had reasonable time to address these issues.

Please confirm receipt of this report.

Best regards,
[Your Name]
[Your Contact]

---

## Notes for Sender

- Standard practice is 90 days, but many orgs fix faster
- Offer to extend if they're actively working on it
- Keep communication professional and helpful
- Document all correspondence with timestamps

## References

- [OWASP Vulnerability Disclosure Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)
- [CISA Vulnerability Disclosure Policy Template](https://www.cisa.gov/vulnerability-disclosure-policy-template)
- [RFC 9116 - security.txt format](https://www.rfc-editor.org/rfc/rfc9116)
