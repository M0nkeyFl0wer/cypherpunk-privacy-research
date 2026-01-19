# Secret Network

**Category**: Privacy Infrastructure - Privacy Blockchain
**Ecosystem**: Cosmos
**Status**: Active Production
**Last Updated**: 2026-01-19

---

## Overview

Secret Network is a privacy-focused Layer 1 blockchain built on Cosmos SDK that enables "Secret Contracts" - smart contracts where inputs, outputs, and state are encrypted. This is achieved using Trusted Execution Environments (Intel SGX) on validator nodes.

Unlike transparent blockchains where all transaction data is public, Secret Network allows developers to build applications with programmable privacy, where users control what information is revealed.

---

## Key Features

- **Encrypted Smart Contracts**: Inputs, outputs, and state are encrypted
- **Public Code**: Contract logic is verifiable on-chain
- **TEE-based Privacy**: Intel SGX hardware enclaves
- **IBC Compatible**: Interoperable with Cosmos ecosystem
- **Encrypted Mempool**: Frontrunning resistant by default
- **Secret NFTs**: NFTs with private content and ownership
- **Viewing Keys**: Selective disclosure to chosen parties

---

## Privacy Model

Secret Network uses hardware-based privacy via Trusted Execution Environments:

1. User submits encrypted transaction
2. Validator nodes decrypt inside SGX enclave
3. Computation happens in protected memory
4. Only encrypted results leave the enclave
5. Contract state remains encrypted on-chain

---

## Team

| Name | Role | Background |
|------|------|------------|
| Guy Zyskind | CEO, SCRT Labs | MIT Media Lab, whitepaper author |
| Can Kisagun | Co-founder, SCRT Labs | Technical co-founder |
| Tor Bair | Founder, Secret Foundation | Core contributor |

**Note**: Leadership controversy in January 2023 regarding foundation fund management.

---

## Token (SCRT)

- **Use Cases**: Gas fees, staking, governance
- **Listed**: Major exchanges (Kraken, etc.)
- **Staking**: Proof-of-stake with delegated validators

---

## Links

- **Website**: https://scrt.network
- **GitHub**: https://github.com/scrtlabs/SecretNetwork
- **Documentation**: https://docs.scrt.network
- **Graypaper**: https://scrt.network/graypaper

---

## Constitutional Research Notes

- **Verified**: Website, GitHub, team (core members), technology
- **Confidence**: 0.85 (High)
- **Gaps**: Complete organizational structure, full audit list
- **Controversy**: 2023 foundation fund dispute documented
