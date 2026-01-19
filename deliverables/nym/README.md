# NYM

**Category**: Privacy Infrastructure - Mixnet
**Ecosystem**: Cosmos / Multichain
**Status**: Active Production
**Last Updated**: 2026-01-19

---

## Overview

NYM is a decentralized mixnet infrastructure providing network-level privacy against sophisticated end-to-end attackers. Unlike VPNs which only hide your IP address, NYM provides metadata privacy by mixing packets from multiple users through multiple hops, making traffic analysis extremely difficult.

The project builds on the Loopix academic research and uses the Sphinx packet format for anonymous communication with blinded, re-randomizable Coconut credentials for anonymous transactions.

---

## Key Features

- **Multi-hop Mixnet**: Packets are encrypted in layers (like Tor) and routed through multiple mix nodes
- **Cover Traffic**: Generates dummy traffic to prevent timing analysis
- **Sphinx Packets**: Cryptographically unlinkable packet format
- **Coconut Credentials**: Anonymous, reusable credentials for payments
- **NymVPN**: Consumer-facing VPN product using the mixnet
- **Token Economics**: NYM token incentivizes mix node operators

---

## Privacy Architecture

NYM addresses the metadata problem that even encrypted communications leak:
- **Who** is talking to whom
- **When** they are communicating
- **How much** data is exchanged
- **Where** they are located

By routing traffic through a decentralized network of mix nodes that batch, reorder, and add cover traffic, NYM makes these patterns undetectable.

---

## Team

The founding team originated from the EU-funded PANORAMIX project:

| Name | Role | Background |
|------|------|------------|
| Harry Halpin | CEO | Former MIT researcher, W3C Web Crypto standardization |
| George Danezis | Co-founder | Chainspace founder, academic researcher |
| Claudia Diaz | Chief Scientist | KU Leuven professor, privacy researcher |
| Aggelos Kiayias | Co-founder | PANORAMIX coordinator |
| Ania Piotrowska | Co-founder | Loopix mixnet designer |

---

## Funding

| Round | Amount | Lead | Date |
|-------|--------|------|------|
| Incubation | - | Binance Labs | 2019 |
| Seed | $6M | Polychain Capital | Jul 2021 |
| Series A | $13M | a16z crypto | Nov 2021 |

---

## Links

- **Website**: https://nymtech.net
- **GitHub**: https://github.com/nymtech
- **Documentation**: https://nymtech.net/docs/
- **NymVPN**: https://nymvpn.com

---

## Constitutional Research Notes

- **Verified**: Website, GitHub, team, funding
- **Confidence**: 0.9 (High)
- **Gaps**: Detailed organizational structure, complete team roster, specific audit reports
