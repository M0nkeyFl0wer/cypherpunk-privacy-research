# Technical Analysis: Secret Network

**Last Updated**: 2026-01-28

---

## Architecture Overview

Secret Network is a privacy-focused Layer-1 blockchain built on Cosmos SDK with a custom "compute" module that enables encrypted smart contract execution using Intel SGX Trusted Execution Environments.

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│           (Secret Contracts - Rust/CosmWasm)                 │
├─────────────────────────────────────────────────────────────┤
│                  Compute Module (SGX)                        │
│         (Encrypted inputs/outputs/state)                     │
├─────────────────────────────────────────────────────────────┤
│                    Cosmos SDK                                │
│           (Staking, Governance, IBC, Bank)                   │
├─────────────────────────────────────────────────────────────┤
│                  Tendermint BFT                              │
│            (Consensus, Networking)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Consensus | Tendermint BFT | Byzantine fault-tolerant consensus |
| Framework | Cosmos SDK | Modular blockchain framework |
| Smart Contracts | CosmWasm (modified) | Rust-based WASM contracts |
| Privacy | Intel SGX | Hardware-based encryption |
| Interoperability | IBC Protocol | Cross-chain communication |

---

## Privacy Technology: Intel SGX

### What is a TEE?

A Trusted Execution Environment (TEE) is a protected area inside a processor where code runs securely and privately. It acts as a "blackbox" for computation:
- Input and output can be observed
- Internal state is never revealed
- Not accessible to operating system
- Not accessible to hardware owner

### Intel SGX Implementation

Intel Software Guard Extensions (SGX) creates isolated "enclaves":

```
┌──────────────────────────────────────────────────────┐
│                 Operating System                      │
│  ┌────────────────────────────────────────────────┐  │
│  │            SGX Enclave (Isolated)               │  │
│  │  ┌────────────────────────────────────────────┐│  │
│  │  │  Secret Contract Execution                 ││  │
│  │  │  - Decrypt inputs                          ││  │
│  │  │  - Execute contract logic                  ││  │
│  │  │  - Encrypt outputs                         ││  │
│  │  │  - State encrypted at rest                 ││  │
│  │  └────────────────────────────────────────────┘│  │
│  │       Memory encrypted by hardware             │  │
│  └────────────────────────────────────────────────┘  │
│        OS cannot access enclave contents              │
└──────────────────────────────────────────────────────┘
```

---

## Encryption Flow

### Transaction Lifecycle

```
1. USER SIDE
   ┌─────────────────────────────────────────────────┐
   │ User generates encryption key via ECDH          │
   │ (Diffie-Hellman with enclave's public key)      │
   └────────────────────────┬────────────────────────┘
                            │
                            ▼
2. ENCRYPTION
   ┌─────────────────────────────────────────────────┐
   │ User encrypts transaction inputs                │
   │ (AES-SIV with derived key + nonce)              │
   └────────────────────────┬────────────────────────┘
                            │
                            ▼
3. BROADCAST
   ┌─────────────────────────────────────────────────┐
   │ Encrypted transaction submitted to network      │
   │ Enters encrypted mempool                        │
   └────────────────────────┬────────────────────────┘
                            │
                            ▼
4. ENCLAVE PROCESSING
   ┌─────────────────────────────────────────────────┐
   │ Validator receives transaction                  │
   │ Passed to SGX enclave                           │
   │ Decrypted inside enclave only                   │
   │ Contract executes on plaintext                  │
   │ Results encrypted before leaving               │
   └────────────────────────┬────────────────────────┘
                            │
                            ▼
5. STATE UPDATE
   ┌─────────────────────────────────────────────────┐
   │ New state encrypted with consensus key          │
   │ Stored on chain (encrypted)                     │
   │ Encrypted output returned to user               │
   └─────────────────────────────────────────────────┘
```

### Key Derivation Chain

```
Consensus Seed (Master Key)
        │
        ├── I/O Encryption Key
        │   └── User-specific keys (via ECDH + nonce)
        │
        ├── State Encryption Key
        │   └── Per-contract encryption
        │
        ├── Registration Key
        │   └── New node seed distribution
        │
        └── Callback Secret
            └── Inter-contract authentication
```

---

## Secret Contracts

### How They Differ from Standard CosmWasm

| Feature | Standard CosmWasm | Secret Contracts |
|---------|-------------------|------------------|
| Inputs | Public | Encrypted |
| Outputs | Public | Encrypted |
| State | Public | Encrypted |
| Code | Public | Public (auditable) |
| Execution | Any node | Inside SGX enclave |

### Contract Structure

```rust
// Example Secret Contract (simplified)
use cosmwasm_std::{DepsMut, Env, MessageInfo, Response};
use secret_std::Secret;

pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,  // Decrypted inside enclave
) -> Result<Response, ContractError> {
    // Code executes on plaintext data
    // All computation happens inside SGX enclave

    // State access is encrypted/decrypted automatically
    let mut state = STATE.load(deps.storage)?;
    state.count += 1;
    STATE.save(deps.storage, &state)?;

    // Return value encrypted before leaving enclave
    Ok(Response::new()
        .add_attribute("action", "increment"))
}
```

### What's Encrypted vs Public

| Encrypted | Public |
|-----------|--------|
| Function inputs (msg) | Contract code (WASM) |
| Return values | Transaction sender |
| Contract state | Gas fees |
| Internal computation | Block height/time |
| Inter-contract messages | Contract addresses |

---

## Consensus & Shared Secrets

### The Challenge

How do multiple validators reach consensus on encrypted state without revealing it?

### The Solution: Shared Consensus Seed

1. **Bootstrap**: First node generates random 256-bit consensus seed inside SGX
2. **Attestation**: New validators prove genuine SGX via remote attestation
3. **Distribution**: Existing validators share encrypted seed with new nodes
4. **Derivation**: All validators derive same keys from consensus seed
5. **Sealing**: Seed sealed to disk using SGX sealing

```
Bootstrap Node
      │
      ├── Generates consensus_seed (random 256 bits)
      │
      ├── Seals to ~/.sgx_secrets/consensus_seed.sealed
      │
      └── Derives all network keys via HKDF-SHA256
                    │
                    ▼
New Validator Joins
      │
      ├── Generates attestation proof
      │
      ├── Proves genuine SGX to network
      │
      └── Receives encrypted seed from existing validator
          (ECDH + AES-SIV encryption)
```

---

## Key Management

### User Keys
- Derived from wallet seed
- Used for encrypting transactions
- ECDH with enclave's public key
- Viewing keys for selective disclosure

### Network Keys
- Consensus seed (master key)
- Distributed among all validators
- Protected by SGX attestation
- Never leaves SGX enclaves

### Contract Keys
- Per-contract encryption keys
- Derived from consensus seed + contract address
- Enable state isolation between contracts

---

## IBC Interoperability

Secret Network is fully IBC-compatible:

```
┌─────────────────┐     IBC     ┌─────────────────┐
│  Secret Network │◄───────────►│  Cosmos Hub     │
│  (Private)      │             │  (Public)       │
└─────────────────┘             └─────────────────┘
        │
        │ Encrypted cross-chain calls
        ▼
┌─────────────────┐
│  Other IBC      │
│  Chains         │
└─────────────────┘
```

### Capabilities
- Send/receive tokens from other Cosmos chains
- Cross-chain contract calls (encrypted)
- Private data on public chain ecosystems
- Cosmos ecosystem integration

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| Block Time | ~6 seconds | Tendermint default |
| Finality | Immediate | Tendermint BFT |
| TPS | Variable | Depends on contract complexity |
| SGX Overhead | ~10-30% | Additional latency for enclave ops |
| EPC Limit | ~256 MB | Intel SGX memory constraint |

### Scalability Considerations

- **Contract Complexity**: SGX EPC limits constrain complex operations
- **State Size**: Large encrypted states increase processing time
- **Parallelization**: Single-threaded enclave execution per contract
- **Network**: Standard Cosmos networking characteristics

---

## Comparison: TEE vs ZK Proofs

| Aspect | Secret Network (TEE) | ZK-Based Systems |
|--------|---------------------|------------------|
| Trust Model | Hardware (Intel) | Mathematics only |
| Computation | General purpose | Limited/expensive |
| Proof Generation | N/A | Slow (seconds to minutes) |
| Verification | Attestation | Fast (~milliseconds) |
| Privacy Scope | Full contract state | Specific properties |
| Hardware Requirement | SGX CPU | Standard CPU |
| Maturity | Production since 2020 | Rapidly improving |

### Trade-offs

**TEE Advantages**:
- General-purpose computation
- No proof generation overhead
- Simpler developer experience
- Established production deployment

**ZK Advantages**:
- No hardware trust dependency
- Trustless verification
- Survives hardware compromise
- Improving rapidly (2024-2026)

---

## Use Cases Enabled

### Private DeFi
- Hidden order sizes (no frontrunning)
- Private collateral positions
- Sealed-bid auctions
- Private liquidation thresholds

### Secret NFTs
- Private content (images, files)
- Private ownership records
- Selective reveals
- Access-controlled media

### Privacy Infrastructure
- Private data storage
- Encrypted communication
- Verifiable random number generation
- Private voting/governance

### Confidential AI (2025+)
- Secret AI SDK
- NVIDIA Confidential Computing integration
- TEE-based AI inference
- Private model weights and inputs

---

## Technical Limitations

### Hardware Dependency
- Requires Intel SGX-capable hardware
- Intel as single hardware vendor
- SGX deprecation risk (Intel focus shifting)
- Geographic hardware availability

### SGX Constraints
- ~256 MB EPC (Enclave Page Cache)
- Single-threaded enclave execution
- Side-channel attack surface
- Attestation dependency on Intel

### Privacy Limitations
- Transaction graph visible (who interacts with whom)
- Timing analysis possible
- Gas consumption observable
- Contract addresses public

### Not Protected
```
Visible on-chain:
├── Sender address
├── Receiver address
├── Gas usage
├── Block timing
├── Contract deployment
└── Token transfers (amounts may be hidden)
```

---

## Development Workflow

### Writing Secret Contracts

```bash
# 1. Create contract in Rust
cargo generate --git https://github.com/scrtlabs/secret-template

# 2. Write contract logic
# (same as CosmWasm with privacy-aware patterns)

# 3. Compile to WASM
cargo build --release --target wasm32-unknown-unknown

# 4. Optimize
wasm-opt -Os contract.wasm -o contract_optimized.wasm

# 5. Deploy to Secret Network
secretcli tx compute store contract.wasm --from mykey
```

### Testing

- **Local Development**: LocalSecret (Docker-based testnet)
- **Testnet**: Pulsar-3 public testnet
- **Mainnet**: Secret-4

### SDK Options

- **SecretJS**: JavaScript/TypeScript
- **secret.py**: Python
- **SecretCLI**: Command line

---

## 2026 Roadmap: SGX Decoupling

Major planned architectural change:

### Goal
Ability to run Secret Network nodes without SGX hardware

### Implications
- Reduced hardware dependency
- Broader validator participation
- Alternative TEE support possible
- Maintains privacy guarantees

### Approach
- Hybrid architecture
- Alternative confidential computing options
- Backward compatibility with existing contracts

---

## Sources

| Source | Type |
|--------|------|
| [Secret Network Techstack](https://docs.scrt.network/secret-network-documentation/introduction/secret-network-techstack) | Official Documentation |
| [Private Computation Flow](https://docs.scrt.network/secret-network-documentation/introduction/secret-network-techstack/privacy-technology/private-computation-and-consensus-flow) | Official Documentation |
| [Secret Graypaper](https://scrt.network/graypaper) | Technical Specification |
| [Intel SGX Documentation](https://docs.scrt.network/secret-network-documentation/introduction/secret-network-techstack/privacy-technology/intel-sgx) | Official Documentation |
| [GitHub - SecretNetwork](https://github.com/scrtlabs/SecretNetwork) | Source Code |
| [Secret Network 2026 Roadmap](https://scrt.network/blog/secret-network-2026-roadmap) | Official Blog |

---

*Technical analysis based on documentation review, code inspection, and public specifications.*
