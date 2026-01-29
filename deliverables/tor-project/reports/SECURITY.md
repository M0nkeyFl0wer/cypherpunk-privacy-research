# Tor Project - Security Report

## Security Audits

### October 2025 - 7aSecurity
- **Scope**: Network Health tools
- **Findings**: 6 vulnerabilities
  - 1 Critical (Sybil Hunter)
  - 2 High-severity DoS (TagTor)
- **Status**: Addressed

### April-August 2023 - Radically Open Security
- **Findings**: 17 vulnerabilities
  - Most medium/low risk
  - 1 high-risk CSRF in Onbasca
- **Source**: SecurityWeek

### 2023 - Cure53
- **Scope**: Censorship circumvention tools
- **Findings**: 7 security findings, 2 high-severity
- **Status**: Mitigated

## Bug Bounty Program
- **Platform**: HackerOne (https://hackerone.com/torproject)
- **Launched**: January 2016 (private), 2017 (public)
- **Rewards**: $100-$4,000
  - Low: $100+
  - Medium: $500-$2,000
  - High: $2,000-$4,000
- **Scope**: Tor daemon and Tor Browser
- **Funding**: Initially supported by Open Technology Fund

## Notable Historical Incidents

### August 2013 - Freedom Hosting Exploit
- FBI used JavaScript attack against outdated Tor Browser Bundle
- Exposed user IPs through Firefox vulnerability
- Targeted users of illegal onion services

### 2015 - Carnegie Mellon/Relay Early Attack
- CMU CERT researchers allegedly helped FBI deanonymize onion services
- Led to arrests and takedowns
- Controversial collaboration with law enforcement

### October 2024 - IP Spoofing Attack
- Coordinated abuse complaints disrupted non-exit relays
- False reports to relay operators' ISPs

## Known Vulnerabilities (CVE)
- Full list: https://www.cvedetails.com/vulnerability-list/vendor_id-12287/product_id-23219/Torproject-TOR.html
- Various DoS vulnerabilities (memory access, memory leaks)
- TorMoil (2017): macOS/Linux file:// handling bypass

## Inherent Limitations
- Traffic correlation attacks (timing analysis) are a known weakness of low-latency anonymity networks
- Exit node can see unencrypted traffic to non-HTTPS destinations
- Malicious exit nodes can perform MITM on non-HTTPS traffic

## Security Model
- Assumes adversary cannot observe both ends of circuit simultaneously
- Designed against global passive adversary, not global active adversary
- Relies on diversity and distribution of relay operators

## Sources
- https://blog.torproject.org/
- https://www.torproject.org/docs/faq.html.en
- https://hackerone.com/torproject

---
*Research completed with Constitutional Research v3.0*
*Last updated: 2026-01-28*
