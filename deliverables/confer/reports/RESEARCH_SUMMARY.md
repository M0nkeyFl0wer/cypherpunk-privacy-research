# Confer Research Summary

## Verified Data (Tier 1 - High Confidence)

### Basic Project Information
- **Name:** Confer
- **Website:** https://confer.to
- **GitHub:** None found (closed source)
- **Description:** Private AI chat with E2E encryption and TEE
- **Category:** Privacy AI, Confidential Computing
- **Status:** Active (launched December 2025)
- **Founder:** Moxie Marlinspike (Signal creator)

### Pricing

| Tier | Limit | Price |
|------|-------|-------|
| Free | 20 messages/day | $0 |
| Paid | Unlimited | $35/month |

### Team (Verified)

**Founder:**
| Name | Role | Background | Confidence |
|------|------|------------|------------|
| Moxie Marlinspike | Founder | Signal Protocol creator, former Signal CEO | 1.0 |

**Research Gap:** Full team roster not publicly documented.

---

## Technical Architecture

### Privacy Claims (Unverifiable without source code)
- End-to-end encryption of prompts before leaving device
- Confidential computing with Trusted Execution Environment (TEE)
- Passkeys (Face ID/Touch ID) for key derivation
- No data collection by design

### Infrastructure Analysis

| Service | Provider | Purpose |
|---------|----------|---------|
| confer.to | AWS CloudFront + S3 | Main website |
| api.confer.to | AWS | API backend |
| inference.confer.to | Google Cloud | AI inference with TEE |
| artifacts.confer.to | AWS | Storage |

### Subdomain Discovery (7 Found)
**Source:** crt.sh certificate transparency

- confer.to
- api.confer.to
- api-staging.confer.to
- artifacts.confer.to
- inference.confer.to
- inference-staging.confer.to
- **inference-baremetal-staging.confer.to** (suggests custom TEE hardware)

---

## Security Assessment

### Shodan Scan Results

**CloudFront CDN (52.85.12.44):** ✅ Clean
- Standard AWS CloudFront
- No CVEs detected

**Inference Server (34.160.220.247):** ✅ Clean
- Google Cloud Platform
- No CVEs detected

### Security Headers

| Feature | Status |
|---------|--------|
| HTTPS | ✅ Enforced |
| S3 Encryption | ✅ AES256 (server-side) |
| Exposed Ports | 80, 443 only |
| CDN | ✅ CloudFront |

### Risk Assessment

| Finding | Severity | Notes |
|---------|----------|-------|
| Closed source | HIGH | Cannot verify privacy claims |
| No CVEs | ✅ Good | Clean scan |
| Multi-cloud | ✅ Good | AWS + GCP (reduced SPOF) |
| Minimal attack surface | ✅ Good | Only 80/443 exposed |

---

## Trust Model

### Relies On
1. **Moxie's reputation** - Signal Protocol creator
2. **TEE guarantees** - Google Cloud Confidential VMs
3. **Company claims** - No independent verification possible

### Cannot Verify
- Actual E2E encryption implementation
- TEE attestation details
- Data handling practices
- Key derivation security

---

## Research Gaps Identified

| Category | Status | Priority |
|----------|--------|----------|
| Source code | ❌ Closed | HIGH |
| Security audit | ❌ Unknown | HIGH |
| TEE attestation | ❌ Not published | HIGH |
| Full team | ❌ Incomplete | MEDIUM |
| Pricing history | ❌ Limited | LOW |

---

## Strengths

- Founded by Moxie Marlinspike (Signal creator)
- Multi-cloud architecture (AWS + GCP)
- TEE-based confidential computing
- Minimal attack surface
- S3 encryption at rest
- Staging environments (mature DevOps)

## Concerns

- **Closed source** - Cannot verify privacy claims
- No public security audit
- No published TEE attestation
- No open-source client code
- Trust relies entirely on reputation
- Paid tier expensive ($35/month)

---

## Comparison to Open Alternatives

| Feature | Confer | LocalAI | Ollama |
|---------|--------|---------|--------|
| Privacy claims | TEE + E2E | Local only | Local only |
| Verifiable | ❌ No | ✅ Yes | ✅ Yes |
| Open source | ❌ No | ✅ Yes | ✅ Yes |
| Founder credibility | ✅ High | Varies | Varies |

---

## Recommendations

**For Users:**
- Suitable if you trust Moxie's reputation
- Cannot independently verify privacy claims
- Consider open-source alternatives if auditability matters

**For Confer Team:**
1. Publish TEE attestation reports
2. Open-source client-side encryption code
3. Document cryptographic protocol
4. Commission independent security audit

---

## Sources

- https://confer.to
- crt.sh certificate transparency
- Shodan InternetDB API
- DNS resolution (dig)
- HTTP header analysis

---

*Research Date: January 2026*
*Methodology: Constitutional Research Framework v3*
*Confidence Score: 0.78 (lower due to closed source)*
