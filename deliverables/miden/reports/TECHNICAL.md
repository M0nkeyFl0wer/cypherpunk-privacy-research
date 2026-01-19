# Technical Analysis: Miden (0xMiden)

**Last Updated**: 2026-01-19

---

## Technical Overview

Miden is a STARK-based zero-knowledge virtual machine designed to serve as the execution layer for a privacy-focused Ethereum L2 rollup. It prioritizes ZK-friendliness over EVM compatibility, enabling unique features unavailable on Ethereum mainnet.

---

## Core Architecture

### Execution Model

**Stack-Based Virtual Machine**

Miden VM operates as a stack machine where all instruction inputs and outputs are managed through an operation stack. This design choice simplifies state representation for proof generation, as only stack reads and writes require tracking.

```
Input → Stack Operations → Execution Trace → STARK Proof → Verification
```

**RISC-like Instruction Set**

The VM employs a simplified instruction set, similar to Reduced Instruction Set Computing (RISC), to minimize the number of constraints in the proof system. Fewer constraints translate to faster proof generation and smaller proof sizes.

---

## Memory Organization

The system divides program state across logical memory segments:

| Segment | Purpose |
|---------|---------|
| **Code Segment** | Stores contract bytecode |
| **Stack** | Manages operands and temporary values |
| **Advice Tape** | Holds input data from blockchain and side channels |
| **Memory** | Supports dynamic storage for complex data structures |

---

## STARK Proof System

### Why STARK Over SNARK?

Miden selected STARK (Scalable Transparent ARguments of Knowledge) technology for three critical advantages:

| Property | STARK | SNARK | Impact |
|----------|-------|-------|--------|
| **Trusted Setup** | None required | Required | Eliminates "toxic waste" risk |
| **Quantum Resistance** | Hash-based security | ECC-based | Better quantum safety |
| **Proof Size** | Larger (30-100KB) | Smaller (~200B) | Trade-off for transparency |
| **Verification Speed** | Faster | Varies | Better for high-throughput |

### Proof Pipeline

The execution flow converts program behavior into verifiable claims:

1. **Trace Table Construction**: Records step-by-step execution with multiple columns tracking memory segment evolution

2. **AIR Conversion**: Transforms execution traces into Algebraic Intermediate Representation, expressing consistency rules as polynomial constraints

3. **STARK Generation**: Prover creates proofs (~30-100KB) through FRI protocol verification

4. **On-Chain Verification**: Verifier samples polynomial evaluations, completing validation in milliseconds

---

## Proving Framework

### Winterfell Prover

Originally developed at Facebook's Novi research division, Winterfell is a high-performance STARK prover:

- **Origin**: Meta/Facebook financial services research
- **Creator**: Bobbin Threadbare (now Miden founder)
- **Status**: Production-grade performance

### Plonky3 Integration

Miden now uses the Plonky3 framework for proving:

- Modern proof system architecture
- Optimized for recursive proofs
- Active development ecosystem

---

## Privacy Model

### Default Opacity with Selective Transparency

```
┌─────────────────────────────────────────────────────┐
│                    ON-CHAIN                         │
│  ┌───────────────────────────────────────────────┐  │
│  │  State Commitment (Hash of Account State)     │  │
│  │  - No transaction details                      │  │
│  │  - No amounts                                  │  │
│  │  - No addresses                                │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                    OFF-CHAIN                        │
│  ┌───────────────────────────────────────────────┐  │
│  │  Full Account State                            │  │
│  │  Private Notes (communicated via side channel) │  │
│  │  Transaction Details                           │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Key Principle**: "By default, the ledger stores only state commitments. Developers can optionally disclose specific trades or contract calls when needed."

### Account Types

| Type | Visibility | Use Case |
|------|------------|----------|
| **Private Account** | State commitment only | Personal wallets, private transactions |
| **Public Account** | Full code and state visible | DeFi protocols, public smart contracts |

### Note System

Private notes enable asset transfers between accounts:

1. Sender creates encrypted note
2. Note commitment stored on-chain
3. Note details communicated off-chain (side channel)
4. Recipient consumes note with proof of knowledge

---

## Actor Model

### Parallel Execution Architecture

Each account operates as an independent **Actor** with:

- Own execution context
- Own state management
- Independent proof generation

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Actor A │     │ Actor B │     │ Actor C │
│ ─────── │     │ ─────── │     │ ─────── │
│ Execute │     │ Execute │     │ Execute │
│    ↓    │     │    ↓    │     │    ↓    │
│ Prove   │     │ Prove   │     │ Prove   │
└────┬────┘     └────┬────┘     └────┬────┘
     │               │               │
     └───────────────┼───────────────┘
                     │
              ┌──────▼──────┐
              │   Network   │
              │ Aggregation │
              └─────────────┘
```

**Benefit**: Removes global lock contention, dramatically boosting parallelism and throughput.

### Foreign Procedure Invocation (FPI)

Enables cross-contract reads within a single Trace Table, supporting composable smart contract interactions while maintaining actor independence.

---

## Performance Characteristics

### Throughput Benchmarks

| Configuration | Performance |
|--------------|-------------|
| Single-threaded | ~20-25 KHz |
| 8-core system | ~140 KHz |
| 64-core system | ~265 KHz |

### Proof Metrics

| Metric | Value |
|--------|-------|
| Proof size | 30-100 KB |
| Verification time | <3 milliseconds |
| Client proving time | 1-2 seconds (MacBook Pro) |
| Typical cycle cost | ~90K cycles |

### Client-Side Proving

Proof generation occurs on user devices:

- Standard laptops: 1-2 seconds
- Mobile devices: Supported (mainstream device compatibility)
- Privacy benefit: Private keys never leave device

---

## Comparison to Other Systems

### vs. EVM-Compatible zkRollups

| Feature | Miden | zkEVM (Polygon, zkSync) |
|---------|-------|-------------------------|
| EVM Compatibility | Partial | Full |
| Privacy Default | Yes | No |
| Proof System | STARK | SNARK |
| Trusted Setup | None | Required |
| Client-Side Proving | Yes | No |
| Quantum Resistance | Yes | No |

### vs. Other Privacy Solutions

| Feature | Miden | Aztec | Aleo |
|---------|-------|-------|------|
| Proof System | STARK | SNARK | SNARK |
| Execution Model | Stack VM | UTXO | Account |
| Privacy Default | Yes | Yes | Yes |
| Ethereum L2 | Yes | Yes | No |

---

## Developer Experience

### Supported Languages

| Language | Status | Tool |
|----------|--------|------|
| Miden Assembly | Stable | Native |
| Rust | In Development | Miden Compiler |
| High-level DSL | Planned | Future |

### Development Flow

```
High-Level Code → MidenIR → Miden Assembly → VM Execution → STARK Proof
```

### Tooling

- **Miden Compiler**: Converts MidenIR to Miden Assembly
- **Miden Client**: Reference implementation for user interactions
- **Miden Node**: Operator software for running network nodes
- **AirScript**: DSL for writing AIR constraints

---

## Network Architecture

### Components

| Component | Purpose |
|-----------|---------|
| **Miden VM** | Execution and proof generation |
| **Miden Node** | Network operation and block production |
| **Miden Client** | User interaction and proof submission |
| **Ethereum L1** | Settlement layer and data availability |

### Transaction Flow

1. User creates transaction on client
2. Client generates STARK proof locally
3. Proof submitted to Miden network
4. Operator aggregates proofs
5. Batch proof submitted to Ethereum

---

## Current Limitations

### Alpha Status

- Not production-ready
- Feature set incomplete
- Smart contract capabilities developing
- Mainnet not yet launched

### Known Constraints

1. Limited EVM compatibility (by design)
2. Higher proof sizes than SNARKs
3. Developer tooling still maturing
4. Off-chain note communication required for privacy

---

## Roadmap Highlights

| Period | Target |
|--------|--------|
| 2021 | Initial prototype |
| 2024 | Alpha testnet |
| 2025 Q1 | Independence from Polygon |
| 2025 Q4 | Original mainnet target |
| 2026+ | Production deployment |

---

## Sources

| Source | Type |
|--------|------|
| [Gate.io Deep Analysis](https://www.gate.com/learn/articles/deep-analysis-of-miden-a-high-performance-zero-knowledge-virtual-machine-architecture-based-on-stark/8979) | Technical |
| [Polygon Blog - Miden Announcement](https://polygon.technology/blog/polygon-unveils-miden-an-advanced-zk-starks-based-scaling-solution) | Official |
| [GitHub - 0xPolygonMiden](https://github.com/0xPolygonMiden) | Official |
| [Miden Documentation](https://docs.miden.xyz) | Official |
| [Polygon Forum - Miden Deep Dive](https://forum.polygon.technology/t/polygon-miden-deep-dive-a-stark-based-zk-rollup/2192) | Community |

---

*Constitutional Research Note: This technical analysis is based on publicly available documentation and may not reflect the most current state of development. The project is in alpha, and specifications may change before mainnet launch.*
