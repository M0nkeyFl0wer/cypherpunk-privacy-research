# Heads Up - Gun Node Security

**To:** hello@fileverse.io
**Subject:** Quick security heads up - Gun nodes

---

Hey Fileverse team,

I'm working on a research project surveying Web3 privacy tools and infrastructure for the cypherpunk/Ethereum ecosystem. While reviewing Fileverse, I noticed your Gun relay nodes have a couple of issues worth fixing:

**Affected:**
- `gun-node.fileverse.io` (13.213.218.98)
- `prod-gun-node.fileverse.io` (18.136.133.200)

**Issues:**

1. **nginx 1.24.0** - EOL since April 2024, no longer getting security patches

2. **CVE-2023-44487** (HIGH) - HTTP/2 Rapid Reset DDoS vulnerability
   - https://nvd.nist.gov/vuln/detail/CVE-2023-44487

3. **CVE-2025-23419** (MEDIUM) - TLS session reuse can bypass client cert auth
   - https://nginx.org/en/security_advisories.html

4. Server version exposed in headers (`Server: nginx/1.24.0 (Ubuntu)`)

**Quick fixes:**
```bash
# Upgrade nginx to 1.26.3+ (fixes both CVEs)
sudo apt update && sudo apt install nginx

# Hide version in nginx.conf
server_tokens off;
```

Also worth putting Cloudflare in front of these - they're currently direct to AWS.

Everything else looks solid - your API and storage services have great security headers.

Let me know if you want more details or help verifying fixes.

Cheers,
[Your name]
