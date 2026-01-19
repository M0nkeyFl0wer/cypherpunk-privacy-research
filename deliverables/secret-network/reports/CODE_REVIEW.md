# Code Review: Secret Network

**Last Updated**: 2026-01-19

---

## Repository Overview

| Repository | Description | Languages |
|------------|-------------|-----------|
| [scrtlabs/SecretNetwork](https://github.com/scrtlabs/SecretNetwork) | Main blockchain | Go, Rust |
| [SecretFoundation/docs](https://github.com/SecretFoundation/docs) | Documentation | Markdown |

---

## Open Source Status

- **License**: MIT
- **Open Source**: Yes (client-side, node software)
- **Contract Code**: Public on-chain (auditable)
- **Active Development**: Yes

---

## Technology Stack

### Blockchain Layer
- **Framework**: Cosmos SDK
- **Consensus**: Tendermint BFT (Proof of Stake)
- **Language**: Go

### Smart Contracts
- **Framework**: CosmWasm (modified)
- **Language**: Rust → WebAssembly
- **Privacy**: Custom "compute" module for SGX integration

### Privacy Layer
- **Hardware**: Intel SGX
- **Enclaves**: Secure execution environment
- **Encryption**: AES-256-GCM for state encryption

---

## Architecture

```
┌─────────────────────────────────────────┐
│           Application Layer             │
│  (Secret Contracts - Rust/CosmWasm)     │
├─────────────────────────────────────────┤
│         Compute Module (SGX)            │
│  (Encrypted inputs/outputs/state)       │
├─────────────────────────────────────────┤
│           Cosmos SDK                    │
│  (Staking, Governance, IBC)             │
├─────────────────────────────────────────┤
│          Tendermint BFT                 │
│  (Consensus, Networking)                │
└─────────────────────────────────────────┘
```

---

## CosmWasm Modifications

Secret Contracts differ from standard CosmWasm:
- Handle encrypted data
- Secure enclave integration
- Key management design

Contract code is public, but:
- Input data is encrypted
- Output data is encrypted
- Internal state is encrypted

---

## Development Workflow

### Writing Secret Contracts
1. Write contract in Rust
2. Compile to WebAssembly
3. Deploy to Secret Network
4. Contract executes in SGX enclave

### Testing
- Local development environment available
- Testnet for pre-mainnet testing
- SecretJS SDK for frontend integration

---

## Key Dependencies

| Dependency | Purpose |
|------------|---------|
| Cosmos SDK | Blockchain framework |
| Tendermint | Consensus engine |
| CosmWasm | Smart contract runtime |
| Intel SGX SDK | TEE integration |

---

## Recent Activity

The codebase shows active development with regular releases addressing:
- Security updates
- Performance improvements
- SGX attestation updates
- IBC compatibility

---

## Code Quality Considerations

### Strengths
- Built on battle-tested Cosmos SDK
- CosmWasm provides Rust's memory safety
- MIT license allows broad usage
- Documentation available

### Areas for Verification
- SGX integration complexity
- Custom cryptographic implementations
- Audit reports not comprehensively listed

---

## Sources

| Source | Type |
|--------|------|
| [GitHub - SecretNetwork](https://github.com/scrtlabs/SecretNetwork) | Code |
| [Secret Contracts Intro](https://docs.scrt.network/secret-network-documentation/development/development-concepts/secret-contract-fundamentals/secret-contracts-introduction) | Documentation |
| [Cosmos SDK Docs](https://docs.scrt.network/secret-network-documentation/overview-ecosystem-and-technology/techstack/blockchain-technology/cosmos-sdk) | Documentation |

---

## Actual Code Analysis (January 2026)

Analysis performed via direct code inspection on cloned repository.

### Cryptographic Implementation

**Files Analyzed**:
- `cosmwasm/enclaves/shared/crypto/src/lib.rs`
- `cosmwasm/enclaves/shared/crypto/src/aes_siv.rs`
- `cosmwasm/enclaves/execute/src/registration/seed_exchange.rs`

#### Encryption: AES-SIV (RFC 5297)

```rust
// cosmwasm/enclaves/shared/crypto/src/aes_siv.rs
/// AES-SIV encryption in rust - https://tools.ietf.org/html/rfc5297
///
/// This is a unique AES mode for deterministic encryption, where it is
/// difficult to generate random values. The risks of reusing a nonce are
/// only such that encrypting the same data with the same nonce and ad
/// will give the same result.
```

**Why AES-SIV?**: The code comments explain:
> "We assume that the risk of using [AES-SIV] is much lesser than the risk of using AES-GCM, or other nonce-collision sensitive ciphers."

AES-SIV is **nonce-misuse resistant** - unlike AES-GCM which catastrophically fails on nonce reuse.

#### Key Management

```rust
// cosmwasm/enclaves/execute/src/registration/seed_exchange.rs
pub fn encrypt_seed(
    seed_to_share: Seed,
    pk: &[u8; PUBLIC_KEY_SIZE],
    sk: &[u8],
) -> Result<[u8; SINGLE_ENCRYPTED_SEED_SIZE], EnclaveError> {
    // ECDH to derive shared encryption key
    let shared_enc_key = derive_key(sk, pk)?;

    // encrypt the seed using the symmetric key derived in the previous stage
    let res = match AESKey::new_from_slice(&shared_enc_key)
        .encrypt_siv(seed_to_share.as_slice(), Some(&authenticated_data))
```

**Key Exchange**: ECDH (Elliptic Curve Diffie-Hellman)

### Cryptographic Summary

| Component | Algorithm | Standard |
|-----------|-----------|----------|
| Authenticated Encryption | AES-128-SIV | RFC 5297 |
| Key Derivation | HKDF-SHA256 | RFC 5869 |
| Signatures | Ed25519 | RFC 8032 |
| Blockchain Signatures | secp256k1 | SEC 2 |
| Key Exchange | ECDH | ANSI X9.63 |
| Hash | SHA-256 | FIPS 180-4 |

### SGX Enclave Architecture

```rust
// cosmwasm/enclaves/execute/src/lib.rs
#[cfg(not(target_env = "sgx"))]
extern crate sgx_tstd as std;

extern crate sgx_trts;
extern crate sgx_types;
```

The enclave code compiles specifically for Intel SGX TEE, using Intel's SGX SDK bindings.

**Enclave Components**:

| Directory | Purpose |
|-----------|---------|
| `enclaves/execute/` | Contract execution enclave |
| `enclaves/shared/crypto/` | Cryptographic primitives |
| `enclaves/shared/utils/` | Key management, storage |
| `enclaves/ffi-types/` | C FFI type definitions |

### Memory Safety

**Languages**:
- Go (Cosmos SDK, blockchain logic)
- Rust (SGX enclaves, smart contracts)

**Rust Enclave Code**:
- Compiles with `#![no_std]` when not in SGX mode
- Uses Intel SGX standard library (`sgx_tstd`)
- Rust memory safety protections apply within enclave

### Trust Model

| Trust Boundary | Protection |
|----------------|------------|
| User → Node | Transaction encryption |
| Node → Enclave | SGX attestation |
| Enclave memory | SGX hardware isolation |
| State storage | AES-SIV encryption |

**Key Trust Assumption**: Intel SGX hardware is secure (hardware root of trust).

### Known Limitations

Per code analysis and documentation:

1. **Hardware Trust**: Relies on Intel SGX - side-channel attacks theoretically possible
2. **Transaction Graph**: Who transacts with whom is visible (not encrypted)
3. **Timing Analysis**: Possible but mitigated by Tendermint batching

### Build System

```bash
# Requires Intel SGX SDK and Rust SGX toolchain
cargo build --target x86_64-unknown-linux-sgx
```

SGX mode can be switched between simulation (`SW`) and hardware (`HW`).

---

*Constitutional Research Note: Secret Network builds on established frameworks (Cosmos SDK, CosmWasm) with custom SGX integration for privacy. The codebase is open-source and actively maintained. The choice of AES-SIV over AES-GCM shows thoughtful consideration of nonce-misuse risks in the SGX environment. The main complexity is in the SGX/enclave integration layer.*
