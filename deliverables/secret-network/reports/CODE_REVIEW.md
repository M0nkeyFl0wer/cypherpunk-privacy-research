# Code Review: Secret Network

**Last Updated**: 2026-01-28
**Repository**: [scrtlabs/SecretNetwork](https://github.com/scrtlabs/SecretNetwork)
**Version Analyzed**: v1.23.3
**Languages**: Rust (SGX Enclaves), Go (Cosmos SDK)

---

## Executive Summary

Secret Network is a privacy-focused Layer-1 blockchain built on Cosmos SDK with custom Intel SGX integration for confidential smart contract execution. The codebase demonstrates sophisticated cryptographic engineering with thoughtful security trade-offs. This review analyzes the actual source code, focusing on the privacy-critical components.

---

## Repository Structure

```
SecretNetwork/
├── cosmwasm/                    # Smart contract runtime (modified CosmWasm)
│   ├── enclaves/               # SGX enclave code (Rust)
│   │   ├── execute/            # Contract execution enclave
│   │   ├── shared/             # Shared cryptographic libraries
│   │   │   ├── crypto/         # AES-SIV, HKDF, Ed25519, secp256k1
│   │   │   ├── contract-engine/ # WASM execution engine
│   │   │   └── utils/          # Key management utilities
│   │   └── ffi-types/          # C FFI type definitions
│   └── packages/               # Rust packages
├── x/                          # Cosmos SDK modules
│   ├── compute/                # Secret contract execution module
│   └── registration/           # Node registration & attestation
├── go-cosmwasm/                # Go bindings to WASM runtime
├── app/                        # Application configuration
└── cmd/                        # CLI commands
```

---

## Cryptographic Implementation Analysis

### 1. Authenticated Encryption: AES-SIV (RFC 5297)

**File**: `cosmwasm/enclaves/shared/crypto/src/aes_siv.rs`

```rust
/// AES-SIV encryption in rust - https://tools.ietf.org/html/rfc5297
///
/// This is a unique AES mode for deterministic encryption, where it is difficult
/// to generate random values. The risks of reusing a nonce are only such that
/// encrypting the same data with the same nonce and ad (additional-data) will
/// give the same result.
///
/// Uses aes_siv crate, which has not been constant-time audited and other good
/// stuff, but we assume that the risk of using it is much lesser than the risk
/// of using AES-GCM, or other nonce-collision sensitive ciphers.
```

**Implementation**:
```rust
impl SIVEncryptable for AESKey {
    fn encrypt_siv(&self, plaintext: &[u8], ad: Option<&[&[u8]]>) -> Result<Vec<u8>, CryptoError> {
        aes_siv_encrypt(plaintext, ad, self.get())
    }

    fn decrypt_siv(&self, plaintext: &[u8], ad: Option<&[&[u8]]>) -> Result<Vec<u8>, CryptoError> {
        aes_siv_decrypt(plaintext, ad, self.get())
    }
}

fn aes_siv_encrypt(
    plaintext: &[u8],
    ad: Option<&[&[u8]]>,
    key: &SymmetricKey,
) -> Result<Vec<u8>, CryptoError> {
    let ad = ad.unwrap_or(&[&[]]);
    let mut cipher = Aes128Siv::new(&GenericArray::clone_from_slice(key));
    cipher.encrypt(ad, plaintext).map_err(|e| {
        warn!("aes_siv_encrypt error: {:?}", e);
        CryptoError::EncryptionError
    })
}
```

**Code Review Assessment**:

| Aspect | Rating | Notes |
|--------|--------|-------|
| Algorithm Choice | Excellent | AES-SIV is nonce-misuse resistant - critical for SGX where random number generation is constrained |
| Implementation | Good | Uses well-maintained `aes_siv` crate |
| Error Handling | Adequate | Returns generic error, logs warning |
| Constant-Time | Unknown | Comment acknowledges crate not audited for constant-time |

**Why AES-SIV over AES-GCM?**

The code comments explicitly explain the rationale: In SGX environments, generating truly random nonces is difficult. AES-GCM catastrophically fails on nonce reuse (reveals XOR of plaintexts and allows forgery). AES-SIV degrades gracefully - nonce reuse only reveals if two plaintexts are identical.

### 2. Key Derivation: HKDF-SHA256 (RFC 5869)

**File**: `cosmwasm/enclaves/shared/crypto/src/kdf.rs`

```rust
const KDF_SALT: [u8; 32] = [
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x4b, 0xea,
    0xd8, 0xdf, 0x69, 0x99, 0x08, 0x52, 0xc2, 0x02, 0xdb, 0x0e, 0x00, 0x97,
    0xc1, 0xa1, 0x2e, 0xa6, 0x37, 0xd7, 0xe9, 0x6d,
];

impl Kdf<AESKey> for Seed {
    fn derive_key_from_this(&self, data: &[u8]) -> AESKey {
        let mut input_bytes: Vec<u8> = self.as_slice().to_vec();
        input_bytes.extend_from_slice(data);
        hkdf_sha_256(&input_bytes, &[b"seed"])
    }
}

pub fn hkdf_sha_256(input_bytes: &[u8], info: &[&[u8]]) -> AESKey {
    let salt = hkdf::Salt::new(hkdf::HKDF_SHA256, &KDF_SALT);
    let prk = salt.extract(input_bytes);
    let okm = prk.expand(info, My(SECRET_KEY_SIZE)).unwrap();
    let mut result: AESKey = AESKey::default();
    let _ = okm.fill(result.as_mut());
    result
}
```

**Code Review Assessment**:

| Aspect | Rating | Notes |
|--------|--------|-------|
| Algorithm | Excellent | HKDF-SHA256 is industry standard |
| Salt | Good | Fixed salt provides domain separation |
| Info Parameter | Good | Context-specific info strings ("seed") |
| Implementation | Good | Uses Ring crypto library |

### 3. Seed Exchange: ECDH + AES-SIV

**File**: `cosmwasm/enclaves/execute/src/registration/seed_exchange.rs`

```rust
pub fn encrypt_seed(
    seed_to_share: Seed,
    pk: &[u8; PUBLIC_KEY_SIZE],
    sk: &[u8],
) -> Result<[u8; SINGLE_ENCRYPTED_SEED_SIZE], EnclaveError> {
    // ECDH to derive shared encryption key
    let shared_enc_key = derive_key(sk, pk)?;

    // Authenticated data includes recipient public key
    let authenticated_data = pk.to_vec();

    // Encrypt using AES-SIV with authenticated data
    let res = match AESKey::new_from_slice(&shared_enc_key)
        .encrypt_siv(seed_to_share.as_slice(), Some(&[&authenticated_data]))
    // ...
}
```

**Security Properties**:
- ECDH key exchange ensures only the intended recipient can decrypt
- Authenticated data binds ciphertext to recipient's public key
- Prevents ciphertext substitution attacks

### 4. Contract I/O Encryption

**File**: `cosmwasm/enclaves/shared/contract-engine/src/io.rs`

```rust
pub fn calc_encryption_key(nonce: &IoNonce, user_public_key: &Ed25519PublicKey) -> AESKey {
    let enclave_io_key = KEY_MANAGER.get_consensus_io_exchange_keypair().unwrap();
    let tx_encryption_ikm = enclave_io_key.diffie_hellman(user_public_key);
    AESKey::new_from_slice(&tx_encryption_ikm).derive_key_from_this(nonce)
}
```

**Encryption Flow**:
1. User and enclave perform ECDH key exchange
2. User provides nonce for freshness
3. Symmetric key derived from shared secret + nonce
4. All contract inputs/outputs encrypted with derived key

**Code Review Assessment**:

| Aspect | Rating | Notes |
|--------|--------|-------|
| Key Derivation | Good | ECDH + nonce provides forward secrecy per transaction |
| Nonce Handling | Good | User-provided nonce prevents replay |
| Selective Encryption | Interesting | Only WASM messages encrypted; Bank/Staking messages public |

### 5. Callback Authentication

```rust
pub fn create_callback_signature(
    _sender: &CanonicalAddr,
    msg_to_pass: &Vec<u8>,
    sent_funds: &[Coin],
) -> Vec<u8> {
    let mut sig_bytes = KEY_MANAGER.get_consensus_callback_secret().unwrap().get().to_vec();
    sig_bytes.extend(msg_to_pass.as_slice());
    sig_bytes.extend(serde_json::to_vec(sent_funds).unwrap());
    sha2::Sha256::digest(sig_bytes.as_slice()).to_vec()
}
```

**Purpose**: Authenticates inter-contract messages, allowing receiving contracts to verify sender identity.

---

## SGX Enclave Architecture

### Enclave Entry Points

**File**: `cosmwasm/enclaves/execute/src/lib.rs`

```rust
#[cfg(not(target_env = "sgx"))]
extern crate sgx_tstd as std;

extern crate sgx_trts;
extern crate sgx_types;

pub use enclave_contract_engine;
pub mod registration;
mod ecalls;  // External function calls
```

**Enclave Components**:

| Directory | Purpose |
|-----------|---------|
| `enclaves/execute/` | Contract execution enclave |
| `enclaves/shared/crypto/` | Cryptographic primitives |
| `enclaves/shared/contract-engine/` | WASM execution within SGX |
| `enclaves/shared/utils/` | Key management, storage |
| `enclaves/ffi-types/` | C FFI type definitions for Go interop |

### Memory Safety

- **Rust in SGX**: All enclave code is Rust, providing memory safety guarantees
- **No-std Environment**: Compiles with `#![no_std]` for minimal attack surface
- **SGX Standard Library**: Uses Intel's `sgx_tstd` instead of standard library

---

## Cosmos SDK Integration

### Compute Module

**File**: `x/compute/internal/keeper/keeper.go`

The compute module bridges Go (Cosmos SDK) and Rust (SGX enclave):

```go
// Keeper maintains Wasmer instance for SGX operations
type Keeper struct {
    wasmer wasm.Wasmer  // Encapsulates SGX enclave operations
    // ...
}

// Contract execution delegates to enclave
func (k Keeper) Execute(ctx sdk.Context, ...) {
    k.wasmer.Execute(...)  // Encrypted state operations
}
```

**Key Integration Points**:

1. **Contract Keys**: `types.ContractKey` stores encryption keys for each contract
2. **Signature Info**: `wasmTypes.SigInfo` passes transaction signing data to enclave
3. **State Rotation**: `RotateStoreFlush()` handles encrypted state migrations
4. **Validator Evidence**: `SetEnclaveColdEvidences()` submits validator attestations

### Registration Module

**File**: `x/registration/internal/keeper/keeper.go`

Node registration flow:
1. Node presents attestation certificate
2. Certificate verified via `VerifyCombinedCert(certificate)`
3. If valid, node receives encrypted consensus seed
4. Seed decrypted inside node's SGX enclave

---

## Trust Model Analysis

### Trust Boundaries

| Boundary | Protection Mechanism |
|----------|----------------------|
| User -> Node | Transaction encryption (ECDH + AES-SIV) |
| Node OS -> Enclave | Intel SGX hardware isolation |
| Enclave Memory | Hardware encryption (SGX sealing) |
| State Storage | AES-SIV encryption with consensus keys |
| Node -> Node | Remote attestation |

### Assumptions

1. **Intel SGX is Secure**: Hardware root of trust
2. **Cryptographic Assumptions**: Standard (ECDH, AES-SIV, SHA-256)
3. **Enclave Code is Correct**: Open-source, auditable

### Known Limitations (per code analysis)

1. **Transaction Graph**: Who transacts with whom is visible (addresses public)
2. **Timing Analysis**: Possible, mitigated by Tendermint batching
3. **Side Channels**: SGX historically vulnerable to microarchitectural attacks

---

## Cryptographic Summary

| Component | Algorithm | Standard | Implementation |
|-----------|-----------|----------|----------------|
| Authenticated Encryption | AES-128-SIV | RFC 5297 | `aes_siv` crate |
| Key Derivation | HKDF-SHA256 | RFC 5869 | `ring` crate |
| Signatures | Ed25519 | RFC 8032 | Custom implementation |
| Blockchain Signatures | secp256k1 | SEC 2 | Standard Cosmos |
| Key Exchange | ECDH (Curve25519) | ANSI X9.63 | Custom implementation |
| Hash | SHA-256 | FIPS 180-4 | `sha2` crate |

---

## Code Quality Assessment

### Strengths

1. **Thoughtful Cryptographic Choices**: AES-SIV selection shows deep understanding of SGX constraints
2. **Rust Memory Safety**: All security-critical enclave code in Rust
3. **Domain Separation**: Proper use of HKDF info strings and salts
4. **Open Source**: Full codebase publicly available for review
5. **Active Development**: Regular releases (v1.23.3 as of December 2025)

### Areas for Improvement

1. **Constant-Time Operations**: Code comments acknowledge `aes_siv` crate not audited for constant-time behavior
2. **Error Handling**: Generic error types may obscure root causes
3. **Documentation**: Inline documentation varies in completeness
4. **Audit Status**: No comprehensive third-party audit reports publicly available

### Technical Debt

- Legacy certificate handling code (`FetchRawPubKeyFromLegacyCert`)
- Migration code for older enclave versions
- `todo` comments in test infrastructure

---

## Security Considerations

### SGX-Specific Risks

1. **Side-Channel Attacks**: Spectre, Meltdown, xAPIC, Wiretap.fail all demonstrated on SGX
2. **Attestation Forgery**: Historical vulnerabilities in Intel attestation
3. **Enclave Size Limits**: ~256MB EPC, constraints on contract complexity

### Mitigations Observed

1. **v1.22 Upgrade**: Network access control, trusted allowlist, seed rotation
2. **Semi-Permissioned Mode**: v1.23 allows governance-approved validators
3. **Regular Updates**: Active response to disclosed vulnerabilities

### Recommendations

1. **Formal Verification**: Consider formal verification of cryptographic core
2. **Third-Party Audit**: Comprehensive security audit of enclave code
3. **Constant-Time Audit**: Verify timing-attack resistance of crypto operations
4. **Fuzzing**: Continuous fuzz testing of input parsing

---

## Build System

```bash
# Requires Intel SGX SDK and Rust SGX toolchain
cargo build --target x86_64-unknown-linux-sgx

# Mode switching
SGX_MODE=SW  # Simulation mode
SGX_MODE=HW  # Hardware mode
```

**Enclave Configuration**: `Enclave.config.prod.xml` defines production enclave settings (heap size, stack size, etc.)

---

## Conclusion

Secret Network's codebase demonstrates sophisticated cryptographic engineering tailored for the unique constraints of SGX environments. The choice of AES-SIV over AES-GCM, proper use of HKDF for key derivation, and ECDH for key exchange show security-conscious design decisions.

The main trade-off is the reliance on Intel SGX hardware security, which has faced multiple academic attacks. However, the team has demonstrated active response to vulnerabilities with the v1.22 and v1.23 upgrades.

**Code Quality Score**: 8/10

**Key Strengths**: Thoughtful crypto choices, Rust memory safety, active maintenance
**Key Concerns**: SGX hardware trust dependency, no public comprehensive audit

---

## Sources

| Source | Type |
|--------|------|
| [GitHub - SecretNetwork](https://github.com/scrtlabs/SecretNetwork) | Code Repository |
| [cosmwasm/enclaves/shared/crypto/](https://github.com/scrtlabs/SecretNetwork/tree/master/cosmwasm/enclaves/shared/crypto) | Cryptographic Implementation |
| [x/compute/](https://github.com/scrtlabs/SecretNetwork/tree/master/x/compute) | Compute Module |
| [x/registration/](https://github.com/scrtlabs/SecretNetwork/tree/master/x/registration) | Registration Module |
| [Secret Network Documentation](https://docs.scrt.network) | Official Docs |
| [Secret Network Graypaper](https://scrt.network/graypaper) | Technical Specification |

---

*Code review performed via direct analysis of public GitHub repository. Last commit analyzed: 2026-01-28.*
