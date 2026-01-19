# Technical Analysis: Secret Network

**Last Updated**: 2026-01-19

---

## Architecture Overview

Secret Network is a Cosmos SDK blockchain with a custom "compute" module that enables encrypted smart contract execution using Intel SGX Trusted Execution Environments.

```
User → Encrypted Tx → Validator SGX Enclave → Encrypted State → Response
```

---

## Privacy Technology

### Trusted Execution Environment (TEE)

TEE is a protected area inside a processor where code runs securely and privately. Intel SGX is the specific TEE implementation used.

**Properties**:
- Code executes in isolated "enclave"
- Memory is encrypted
- Not accessible to operating system
- Not accessible to node operator

### Encryption Flow

1. **Client-side**: User encrypts transaction inputs
2. **Enclave entry**: Validator decrypts inside SGX
3. **Execution**: Contract runs on plaintext data
4. **Enclave exit**: Results encrypted before returning
5. **State storage**: Contract state encrypted at rest

---

## Secret Contracts

### How They Work

```rust
// Example Secret Contract (simplified)
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,  // Encrypted input
) -> Result<Response, ContractError> {
    // Code here runs inside SGX enclave
    // 'msg' is decrypted here

    // State operations are encrypted/decrypted automatically
    let state = STATE.load(deps.storage)?;

    // Return is encrypted before leaving enclave
    Ok(Response::new())
}
```

### What's Encrypted vs Public

| Encrypted | Public |
|-----------|--------|
| Function inputs | Contract code (WASM binary) |
| Return values | Transaction sender |
| Contract state | Gas fees |
| Internal computation | Block height |

---

## Consensus & Shared Secrets

### Problem
How do multiple validators reach consensus on encrypted state?

### Solution
Validators share secrets via a secure key management protocol:
1. Bootstrap node generates master key inside SGX
2. New validators receive key share after attestation
3. All validators can decrypt/encrypt state consistently
4. Key never leaves SGX enclaves

---

## Key Management

### User Keys
- Each user has encryption keys for their transactions
- Keys derived from wallet seed
- Viewing keys for selective disclosure

### Network Keys
- Shared consensus encryption key
- Distributed among all validators
- Protected by SGX attestation

---

## IBC Interoperability

Secret Network is IBC-compatible:
- Send/receive tokens from other Cosmos chains
- Cross-chain contract calls (encrypted)
- Private data on public chain ecosystems

---

## Use Cases Enabled

### Private DeFi
- Hidden order sizes (no frontrunning)
- Private collateral positions
- Sealed-bid auctions

### Secret NFTs
- Private content (images, files)
- Private ownership
- Selective reveals

### Privacy Infrastructure
- Private data storage
- Encrypted communication
- Random number generation

---

## Performance Characteristics

| Metric | Value |
|--------|-------|
| Block time | ~6 seconds |
| Finality | Immediate (Tendermint) |
| TPS | Varies with contract complexity |
| SGX overhead | Additional latency for enclave operations |

---

## Comparison to ZK-Based Privacy

| Aspect | Secret Network (TEE) | ZK Proofs |
|--------|---------------------|-----------|
| Trust | Hardware (Intel) | Math only |
| Computation | General purpose | Limited (expensive) |
| Proof generation | N/A | Slow |
| Verification | Attestation | Fast |
| Scalability | Good | Improving |

---

## Technical Limitations

### Hardware Dependency
- Requires SGX-capable hardware
- Intel as single hardware vendor
- Side-channel attack surface

### Attestation
- Depends on Intel Attestation Services
- Must verify SGX patches

### Not Protected
- Transaction graph (who transacts with whom)
- Timing analysis

---

## Sources

| Source | Type |
|--------|------|
| [Secret Network Techstack](https://docs.scrt.network/secret-network-documentation/introduction/secret-network-techstack) | Official |
| [Private Computation Flow](https://docs.scrt.network/secret-network-documentation/introduction/secret-network-techstack/privacy-technology/private-computation-and-consensus-flow) | Official |
| [Secret Graypaper](https://scrt.network/graypaper) | Technical |

---

*Constitutional Research Note: Secret Network takes a hardware-based approach to privacy (TEE/SGX) rather than cryptographic approaches (ZK proofs). This enables general-purpose private computation but introduces a trust assumption in Intel hardware. The trade-off is practical programmability vs. trustless cryptographic guarantees.*
