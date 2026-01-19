# Security Analysis: Secret Network

**Last Updated**: 2026-01-19

---

## Privacy Model

Secret Network uses Trusted Execution Environments (Intel SGX) to provide encrypted smart contract execution where no one - including node operators - can see the data being processed.

---

## Trusted Execution Environment (TEE)

### Intel SGX
- Hardware-based security feature in Intel CPUs
- Creates isolated "enclaves" for secure computation
- Data is encrypted in memory
- Even the operating system cannot access enclave data

### Implementation
Every Secret Network validator:
1. Runs SGX-enabled hardware
2. Executes contract code inside secure enclaves
3. Decrypts user inputs only within the enclave
4. Encrypts outputs before returning

---

## Security Design Assumptions

From the Secret Network graypaper:

1. **Untrusted Hosts**: Each node is assumed to be run by a malicious host
2. **Trusted Enclaves**: SGX enclaves execute code securely
3. **Cryptographic Guarantees**: Standard cryptographic assumptions hold

---

## What Secret Network Protects

### Encrypted
- Transaction inputs (function parameters)
- Contract state (database)
- Transaction outputs (return values)

### Public
- Contract code (auditable)
- Transaction sender/receiver (like all blockchains)
- Gas fees

---

## SGX Attestation

Node operators must verify their SGX enclaves:
1. Authenticate with Intel Attestation Services
2. On-chain verification of enclave authenticity
3. Proof that hardware is patched against known exploits

---

## Known Vulnerabilities & Mitigations

### Wiretap.fail Attack (2024)
**Academic researchers discovered**:
- Physical access attack on certain Intel SGX systems
- Affects Secret Network, Phala, Crust Network, IntegriTee

**Secret Network Response**:
- Proactive measures implemented in v1.22 upgrade
- According to researchers, "Secret Network is the only project that implemented such proactive measures"

**Important Context**:
- Attack requires **physical access** to servers
- Attack can only put **data privacy at risk**
- Attack **cannot affect funds**
- Most theoretical SGX attacks occur in research labs

---

## Security Features

### Encrypted Mempool
- Transactions are encrypted before entering mempool
- Prevents frontrunning by default
- Order sizes, bids, liquidation points all hidden

### Viewing Keys
- Users can create keys to share specific data
- Selective disclosure to auditors, regulators, or partners
- Privacy preserved for everyone else

---

## Trust Assumptions

### Users Must Trust
- Intel SGX hardware security
- Node operators running genuine enclaves
- Attestation verification process

### Mitigating Factors
- Distributed validator set (no single point of failure)
- On-chain attestation verification
- Open-source contract code

---

## Comparison to Other Privacy Approaches

| Approach | Secret Network | ZK Proofs | Mixnets |
|----------|---------------|-----------|---------|
| Privacy via | Hardware (TEE) | Math | Network routing |
| Computation | General purpose | Limited | N/A |
| Trust assumption | Intel SGX | Math only | Node operators |
| Performance | Fast | Slow to generate | Variable |

---

## Sources

| Source | Type |
|--------|------|
| [Secret Network Graypaper](https://scrt.network/graypaper) | Technical |
| [SGX Documentation](https://docs.scrt.network/secret-network-documentation/introduction/secret-network-techstack/privacy-technology/intel-sgx) | Official |
| [Wiretap.fail Response](https://scrt.network/blog/secret-network-security-update-intel-sgx-vulnerability-response) | Official |

---

*Constitutional Research Note: Secret Network's security relies on Intel SGX hardware, which introduces a trust assumption in Intel. Academic attacks exist but require physical access. The project actively responds to security disclosures and implemented proactive mitigations. The main security trade-off is hardware trust vs. pure cryptographic approaches like ZK proofs.*
