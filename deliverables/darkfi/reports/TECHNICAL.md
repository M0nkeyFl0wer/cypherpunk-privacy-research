# DarkFi Technical Architecture

*Research Date: 2026-01-28*

---

## Overview

DarkFi is a Layer 1 privacy blockchain featuring a custom zero-knowledge virtual machine (zkVM) built on the Halo2 proving system. The project represents one of the most technically ambitious privacy-focused blockchain implementations, with a novel ZK assembly language (ZKAS) and fully anonymous smart contracts.

---

## Core Technology Stack

| Component | Technology |
|-----------|------------|
| Primary Language | Rust (1.87.0+) |
| Proof System | Halo2 |
| Curve | Pallas (Pasta curves) |
| Consensus | Proof of Work (RandomX) |
| Smart Contracts | zkVM with WASM runtime |
| Database | sled (with SQLCipher encryption) |
| Networking | Custom P2P with TLS (rustls) |
| License | AGPL-3.0 |

---

## Architecture

### System Components

```
                    ┌─────────────────────────────────────┐
                    │           DarkFi Node               │
                    │            (darkfid)                │
                    └─────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Validator   │         │   Blockchain    │         │    P2P Net      │
│               │         │                 │         │                 │
│ - Block valid │         │ - Block storage │         │ - Sessions      │
│ - TX verify   │         │ - State mgmt    │         │ - Peer disc     │
│ - Fee calc    │         │ - Overlay       │         │ - Broadcasting  │
└───────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           │
        ▼                           ▼
┌───────────────┐         ┌─────────────────┐
│    Runtime    │         │   Contracts     │
│               │         │                 │
│ - WASM exec   │         │ - Money         │
│ - Host funcs  │         │ - DAO           │
│ - Memory      │         │ - Deployooor    │
└───────────────┘         └─────────────────┘
        │
        ▼
┌───────────────────────────────────────────────┐
│              Zero-Knowledge System             │
│                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────────┐   │
│  │  zkVM   │  │  ZKAS   │  │   Gadgets   │   │
│  │         │  │Compiler │  │             │   │
│  │ Halo2   │  │         │  │ EC, Hash,   │   │
│  │ Proofs  │  │ Lexer   │  │ Range,SMT   │   │
│  └─────────┘  └─────────┘  └─────────────┘   │
└───────────────────────────────────────────────┘
```

---

## Zero-Knowledge System

### Proof System: Halo2

DarkFi uses [Halo2](https://zcash.github.io/halo2/), a recursive SNARK proving system that eliminates the need for a trusted setup. Key advantages:

- **No trusted setup**: Unlike Groth16, Halo2 doesn't require a ceremony
- **Recursive proofs**: Proofs can verify other proofs
- **Efficient verification**: Fast on-chain verification
- **PLONK-based**: Uses PLONKish arithmetization

### Pallas Curve

The [Pallas curve](https://electriccoin.co/blog/the-pasta-curves-for-halo-2-and-beyond/) is part of the Pasta curve cycle, designed specifically for Halo2:

```
Curve: y^2 = x^3 + 5 over Fp
Field size: ~255 bits
Cycle partner: Vesta curve
```

### zkVM Architecture

The zkVM uses a **heap-based execution model**:

```rust
// Execution state (conceptual)
struct ZkCircuit {
    heap: Vec<HeapVar>,           // Circuit variables (points, scalars, fields)
    literal_heap: Vec<u64>,       // Constant uint64 values
    public_input_offset: usize,   // Instance constraint tracking
}

// Configuration with lazy chip initialization
struct VmConfig {
    arithmetic_chip: Option<ArithmeticChip>,
    ecc_chip: Option<EccChip>,
    poseidon_chip: Option<PoseidonChip>,
    range_check_chip: Option<RangeCheckChip>,
    // Only required chips are instantiated
}
```

**Execution Flow**:
1. **Setup Phase**: Initialize chips, load lookup tables, assign constants
2. **Witness Loading**: Convert witness data into circuit assignments
3. **Opcode Processing**: Sequentially execute each operation, pushing results to heap
4. **Public Output**: Constrain designated heap values as instance data

### ZKAS Compiler

ZKAS (ZK Assembly) is a complete toolchain for writing ZK circuits:

| Stage | File | Purpose |
|-------|------|---------|
| Lexer | `lexer.rs` | Tokenize source code |
| Parser | `parser.rs` | Build abstract syntax tree |
| Analyzer | `analyzer.rs` | Static and semantic validation |
| Compiler | `compiler.rs` | Generate binary bytecode |
| Decoder | `decoder.rs` | Read and interpret binaries |

**Example Circuit** (`proof/mint.zk`):
```
# Public inputs (constrained)
constrain_instance(coin_hash)
constrain_instance(value_commit_x)
constrain_instance(value_commit_y)
constrain_instance(token_commit_x)
constrain_instance(token_commit_y)

# Poseidon hash for coin identity
coin_hash = poseidon_hash(pub_x, pub_y, value, token, serial)

# Pedersen commitment for value
value_commit = ec_mul(VALUE_COMMIT_VALUE, value) + ec_mul(VALUE_COMMIT_RANDOM, value_blind)
```

### Supported Opcodes

**Elliptic Curve** (0x01-0x09):
| Opcode | Hex | Description |
|--------|-----|-------------|
| EcAdd | 0x01 | Point addition |
| EcMul | 0x02 | Scalar multiplication |
| EcMulBase | 0x03 | Multiplication with base field |
| EcMulShort | 0x04 | 64-bit scalar multiplication |
| EcMulVarBase | 0x05 | Variable base multiplication |
| EcGetX | 0x08 | Extract x coordinate |
| EcGetY | 0x09 | Extract y coordinate |

**Hashing** (0x10-0x21):
| Opcode | Hex | Description |
|--------|-----|-------------|
| PoseidonHash | 0x10 | Hash N base field elements |
| MerkleRoot | 0x20 | Calculate Merkle root |
| SparseMerkleRoot | 0x21 | Sparse Merkle tree root |

**Arithmetic** (0x30-0x32):
| Opcode | Hex | Description |
|--------|-----|-------------|
| BaseAdd | 0x30 | Field addition |
| BaseMul | 0x31 | Field multiplication |
| BaseSub | 0x32 | Field subtraction |

**Validation** (0x50-0x53):
| Opcode | Hex | Description |
|--------|-----|-------------|
| RangeCheck | 0x50 | 64/253-bit range check |
| LessThanStrict | 0x51 | Strict comparison |
| LessThanLoose | 0x52 | Loose comparison |
| BoolCheck | 0x53 | Boolean constraint |

**Conditionals** (0x60-0x61):
| Opcode | Hex | Description |
|--------|-----|-------------|
| CondSelect | 0x60 | Conditional selection |
| ZeroCondSelect | 0x61 | Zero-based selection |

**Constraints** (0xe0-0xf0):
| Opcode | Hex | Description |
|--------|-----|-------------|
| ConstrainEqualBase | 0xe0 | Base field equality |
| ConstrainEqualPoint | 0xe1 | Point equality |
| ConstrainInstance | 0xf0 | Public input constraint |

### Cryptographic Gadgets

| Gadget | Purpose |
|--------|---------|
| Arithmetic | Base field operations |
| Small Range Check | 0-8 bit validation |
| Native Range Check | Field-native with lookup table |
| Less Than | Comparison with lookup table |
| Is Zero | Zero detection |
| Is Equal | Equality check |
| Conditional Selection | Branching logic |
| Zero Conditional | Zero-based branching |
| Sparse Merkle Tree | Poseidon-based SMT |

---

## Blockchain Implementation

### Consensus: RandomX Proof-of-Work

DarkFi uses [RandomX](https://github.com/tevador/RandomX), the same algorithm as Monero:

| Parameter | Value |
|-----------|-------|
| Algorithm | RandomX |
| Key Rotation | Every 2,048 blocks |
| Rotation Delay | 64 blocks |
| Difficulty | Dynamic adjustment |

**Advantages**:
- ASIC-resistant (CPU/GPU mining)
- Memory-hard algorithm
- Proven security from Monero

### Block Structure

Blocks are decomposed into separate sled database trees:

```rust
struct Block {
    header: BlockHeader,
    txs: Vec<Transaction>,
    signature: Signature,
}

// Stored in separate trees for efficiency
Trees:
  - headers: BlockHash -> BlockHeader
  - blocks: BlockHash -> Block
  - transactions: TxHash -> (Transaction, Location)
  - block_order: Height -> BlockHash
  - block_difficulty: Height -> BlockDifficulty
```

### State Management

**Overlay Pattern** for speculative execution:

```rust
// Live state: Direct sled manipulation
fn apply_block(&self, block: &Block) -> Result<()> {
    let batch = self.db.transaction(|db| {
        // Atomic multi-tree updates
        db.apply_state_diff(diff)?;
        Ok(())
    })?;
    Ok(())
}

// Overlay: Isolated snapshots
struct BlockchainOverlay {
    state: OverlayState,
    checkpoints: Vec<Checkpoint>,
}

impl BlockchainOverlay {
    fn checkpoint(&mut self) { /* Save state */ }
    fn revert(&mut self) { /* Rollback to checkpoint */ }
}
```

**State Reversion**: `reset_to_height()` applies inverse diffs backwards for chain reorganization.

---

## Transaction System

### Transaction Structure

```rust
struct Transaction {
    // Contract calls with tree metadata (parent/children)
    calls: Vec<DarkLeaf<ContractCall>>,

    // Zero-knowledge proofs for each call
    proofs: Vec<Vec<Proof>>,

    // Schnorr signatures
    signatures: Vec<Vec<Signature>>,
}
```

### Verification Pipeline

1. **ZK Proof Verification** (`verify_zkps`):
   - Async validation against contract-specific verifying keys
   - Match proofs with public inputs
   - Verify circuit constraints

2. **Signature Verification** (`verify_sigs`):
   - Compute BLAKE3 hash of (calls + proofs)
   - Verify Schnorr signatures against public keys

```rust
async fn verify_transaction(&self, tx: &Transaction) -> Result<()> {
    // 1. Verify ZK proofs
    tx.verify_zkps(&self.verifying_keys).await?;

    // 2. Verify signatures
    tx.verify_sigs()?;

    Ok(())
}
```

---

## Smart Contract System

### Native Contracts

#### Money Contract

Handles all token operations:

| Function | Code | Description |
|----------|------|-------------|
| FeeV1 | 0x00 | Transaction fee handling |
| GenesisMintV1 | 0x01 | Initial token creation |
| PoWRewardV1 | 0x02 | Mining rewards |
| TransferV1 | 0x03 | Anonymous transfers |
| OtcSwapV1 | 0x04 | Atomic swaps |
| AuthTokenMintV1 | 0x05 | Authorized minting |
| AuthTokenFreezeV1 | 0x06 | Token freezing |
| TokenMintV1 | 0x07 | General minting |

**Privacy Model**:
- Coins stored as Pedersen commitments
- Nullifiers prevent double-spending
- Merkle proofs for coin existence
- All transfers hide sender/receiver/amount

#### DAO Contract

Anonymous governance:

| Function | Description |
|----------|-------------|
| Mint | Create anonymous credentials |
| Propose | Submit proposals |
| Vote | Anonymous voting |
| Exec | Execute passed proposals |
| AuthMoneyTransfer | Treasury operations |

**Privacy Model**:
- Vote nullifiers prevent double-voting
- Two-phase ZK verification
- 4-hour blockwindow for temporal constraints

#### Deployooor Contract

User-defined contract deployment and locking.

### WASM Runtime

Contracts execute in a sandboxed WASM environment:

```rust
// Runtime structure
mod runtime {
    mod vm_runtime;    // WASM execution engine
    mod memory;        // Controlled memory access
    mod import;        // Host function interface
}
```

**Features**:
- Memory isolation from host
- Defined host function interface
- Deterministic execution

---

## P2P Network Layer

### Session-Based Architecture

Six session types for different connection purposes:

| Session | Purpose |
|---------|---------|
| ManualSession | User-configured peers |
| InboundSession | Accept incoming connections |
| OutboundSession | Initiate outgoing connections |
| RefineSession | Optimize peer quality |
| SeedSyncSession | Bootstrap peer discovery |
| DirectSession | Direct P2P communication |

### Network Features

```rust
// Concurrent message broadcasting
async fn broadcast_with_exclude(
    &self,
    msg: SerializedMessage,
    exclude: Vec<ChannelPtr>
) {
    // Spawns detached tasks for non-blocking delivery
    // Uses FuturesUnordered for concurrent sends
}
```

**Security**:
- TLS via rustls with ring crypto provider
- Unix directory hardening (0o700)
- Dynamic peer reseeding
- Connection metering

---

## Data Structures

### Merkle Trees

| Type | Hash | Use Case |
|------|------|----------|
| Standard Merkle | Poseidon | Coin existence proofs |
| Sparse Merkle | Poseidon | Nullifier tracking |

### Commitments

| Type | Components | Use |
|------|------------|-----|
| Coin Commitment | pub_key + value + token + serial | Coin identity |
| Value Commitment | value + blind | Hide amount |
| Token Commitment | token_id + blind | Hide token type |
| Nullifier | secret + serial | Prevent double-spend |

---

## Build System

### Requirements

```bash
# System dependencies
apt install git cmake make gcc g++ pkg-config \
    libasound2-dev libclang-dev libfontconfig1-dev \
    liblzma-dev libssl-dev libsqlcipher-dev libsqlite3-dev

# Rust toolchain
rustup default stable
rustup target add wasm32-unknown-unknown

# Build
make
```

### Binary Outputs

| Binary | Purpose |
|--------|---------|
| darkfid | Full node daemon |
| drk | CLI wallet |
| darkirc | Anonymous IRC |
| app | GUI application |
| explorer | Block explorer |
| zkas | Circuit compiler |

---

## Performance Considerations

### Proof Generation

- Halo2 proofs are computationally intensive
- Chip lazy initialization reduces overhead for simple circuits
- Parallel proof generation possible

### State Management

- Overlay pattern enables speculative execution
- Atomic transactions prevent corruption
- Separate trees optimize read patterns

### Network

- Session-based design scales with peer count
- FuturesUnordered for concurrent operations
- Selective broadcasting reduces bandwidth

---

## Future Roadmap

Based on development activity:

1. **Mainnet Launch**: Currently Alpha Testnet
2. **Cross-chain Bridges**: Anonymous atomic swaps infrastructure
3. **DAO Ecosystem**: Governance tools expansion
4. **Mobile Clients**: Android app in development
5. **Developer Tooling**: ZKAS improvements

---

## Sources

| Source | Type |
|--------|------|
| [GitHub Repository](https://github.com/darkrenaissance/darkfi) | Source Code |
| [DarkFi Book](https://dark.fi/book/) | Documentation |
| [zkSecurity Audit](https://dark.fi/zksecurity-audit-q124.pdf) | Security Review |
| [Halo2 Book](https://zcash.github.io/halo2/) | Proof System Docs |
| [FOSDEM 2025 Talk](https://archive.fosdem.org/2025/schedule/event/fosdem-2025-6632-darkfi-zero-knowledge-cryptography-for-anonymous-uncensored-organizations/) | Technical Presentation |
