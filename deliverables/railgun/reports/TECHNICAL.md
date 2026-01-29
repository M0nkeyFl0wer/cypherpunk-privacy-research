# Technical Analysis: RAILGUN

*Last Updated: 2026-01-28*

---

## Architecture Overview

RAILGUN is an on-chain privacy system using zkSNARKs to enable private transactions directly on Ethereum and EVM chains without requiring bridges or separate chains.

```
User Wallet → Shield (Deposit) → Shielded Balance → Private DeFi → Unshield (Withdraw) → Public Wallet
                  ↓                      ↓                              ↑
           zkSNARK Proof        Encrypted UTXO State           zkSNARK Proof
```

---

## Core Privacy Technology

### zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge)

RAILGUN uses Groth16 zkSNARKs to prove transaction validity without revealing:
- Sender identity
- Recipient identity
- Transaction amount
- Token type
- Balance information

**Key Properties**:
- **Succinct**: Proofs are small and fast to verify
- **Non-Interactive**: No back-and-forth between prover and verifier
- **Zero-Knowledge**: Verifier learns nothing beyond statement validity

### On-Chain Implementation

RAILGUN leverages Ethereum precompiled contracts:
- **EIP-197**: Pairing operations for zkSNARK verification
- **EIP-198**: Modular exponentiation for cryptographic operations

```
User (off-chain) → Generate zkSNARK proof → Submit proof → Smart contract verifies on-chain
```

---

## Circuit Architecture

### 54 Circuits

RAILGUN implements **54 distinct circuits** for different transaction types:

| Circuit Type | Description |
|--------------|-------------|
| 1-to-1 | Single input, single output (simple transfer) |
| 5-to-1 | Multi-input, single output (token aggregation/swaps) |
| 7-to-2 | Multiple inputs/outputs (complex DeFi) |
| N-to-M | Various combinations for gas efficiency |

Each circuit is differentiated by:
- Number of input UTXOs (nullifiers)
- Number of output UTXOs (commitments)

### Circuit Routing

The system automatically selects optimal circuit combinations for gas efficiency. For example:
- Combining multiple small UTXOs → uses consolidation circuit
- Single transfer → uses minimal circuit

---

## UTXO Model

### Commitment Structure

Each shielded balance is stored as a **commitment** (hash) in a Merkle tree:

```solidity
struct CommitmentPreimage {
  bytes32 npk;        // Poseidon(Poseidon(spending_pubkey, nullifying_key), random)
  TokenData token;    // Token address, type, and subID
  uint120 value;      // Note value (up to ~1.3e36)
}
```

The commitment hash:
```solidity
commitment = PoseidonT4.poseidon([npk, tokenID, value])
```

### Nullifiers

When spending a commitment, a **nullifier** is revealed:
- Derived from the commitment but unlinkable to it
- Published on-chain to prevent double-spending
- Does not reveal which commitment was spent

```solidity
// Double-spend prevention
mapping(uint256 => mapping(bytes32 => bool)) public nullifiers;

require(!nullifiers[treeNumber][nullifier], "Note already spent");
nullifiers[treeNumber][nullifier] = true;
```

---

## Merkle Tree Implementation

### Tree Parameters

| Parameter | Value |
|-----------|-------|
| Tree Depth | 16 levels |
| Capacity | 2^16 = 65,536 commitments per tree |
| Hash Function | Poseidon (zkSNARK-friendly) |
| Zero Value | `keccak256("Railgun") % SNARK_SCALAR_FIELD` |

### Root History

```solidity
// Historical roots for recent commitments
mapping(uint256 => mapping(bytes32 => bool)) public rootHistory;
```

Allows withdrawals against recent Merkle roots, preventing front-running attacks.

### Tree Rotation

When a tree fills up:
```solidity
function newTree() internal {
  merkleRoot = newTreeRoot;  // Pre-computed empty tree root
  nextLeafIndex = 0;
  treeNumber += 1;
}
```

---

## Hash Functions

### Poseidon Hash

RAILGUN uses **Poseidon** hash function - optimized for zkSNARKs:

```solidity
library PoseidonT3 {
  function poseidon(bytes32[2] memory input) public pure returns (bytes32) {}
}

library PoseidonT4 {
  function poseidon(bytes32[3] memory input) public pure returns (bytes32) {}
}
```

**Why Poseidon?**:
- Low constraint count in zkSNARK circuits
- More efficient than Pedersen or MiMC for this use case
- Security proven in academic literature

---

## Transaction Flow

### 1. Shield (Deposit)

```solidity
function shield(ShieldRequest[] calldata _shieldRequests) external {
  // 1. Validate note preimages
  // 2. Transfer tokens into contract
  // 3. Calculate fee and adjust commitment value
  // 4. Hash commitment for Merkle tree
  // 5. Insert leaves into tree
  // 6. Emit Shield event (encrypted ciphertext)
}
```

**Fee Structure**:
```solidity
uint120 public shieldFee;  // Basis points (100 = 1%)
(uint120 base, uint120 fee) = getFee(_note.value, true, shieldFee);
```

### 2. Private Transaction

```solidity
function transact(Transaction[] calldata _transactions) external {
  // 1. Validate each transaction (proof, merkle root, nullifiers)
  // 2. Nullify spent notes (mark as used)
  // 3. Accumulate new commitments
  // 4. Process unshields if present
  // 5. Insert new commitments to tree
}
```

### 3. Unshield (Withdraw)

Part of `transact()` - when `unshield != NONE`:
```solidity
function transferTokenOut(CommitmentPreimage calldata _note) internal {
  // Calculate fee
  (uint120 base, uint120 fee) = getFee(_note.value, true, unshieldFee);

  // Transfer to recipient (npk contains recipient address)
  token.safeTransfer(address(uint160(uint256(_note.npk))), base);

  // Transfer fee to treasury
  token.safeTransfer(treasury, fee);
}
```

---

## zkSNARK Verification

### Verifier Contract

```solidity
function verify(Transaction calldata _transaction) public view returns (bool) {
  // 1. Get verification key for this circuit type
  VerifyingKey memory vk = verificationKeys[nullifiersLength][commitmentsLength];

  // 2. Calculate public inputs
  uint256[] memory inputs = new uint256[](2 + nullifiersLength + commitmentsLength);
  inputs[0] = uint256(_transaction.merkleRoot);
  inputs[1] = hashBoundParams(_transaction.boundParams);
  // Add nullifiers and commitments...

  // 3. Verify Groth16 proof
  return Snark.verify(vk, _transaction.proof, inputs);
}
```

### Groth16 Pairing Check

```solidity
// BN254 pairing operation
function pairing(...) internal view returns (bool) {
  // Uses precompiled contract at address 8
  assembly {
    success := staticcall(sub(gas(), 2000), 8, input, PAIRING_INPUT_WIDTH, out, 0x20)
  }
  return out[0] != 0;
}
```

---

## Token Support

| Token Type | Support | Notes |
|------------|---------|-------|
| ERC-20 | Full | Fungible tokens, fees applied |
| ERC-721 | Full | NFTs, value must be 1 |
| ERC-1155 | Future | Not yet implemented |

### Token ID System

```solidity
function getTokenID(TokenData memory _tokenData) public pure returns (bytes32) {
  if (_tokenData.tokenType == TokenType.ERC20) {
    return bytes32(uint256(uint160(_tokenData.tokenAddress)));
  }
  // NFTs use keccak256 hash of token data
  return bytes32(uint256(keccak256(abi.encode(_tokenData))) % SNARK_SCALAR_FIELD);
}
```

---

## Adapt Module (Relay)

The Adapt/Relay system enables complex DeFi interactions:

```solidity
// Bound parameters include adapt contract
struct BoundParams {
  uint16 treeNumber;
  uint72 minGasPrice;
  UnshieldType unshield;
  uint64 chainID;
  address adaptContract;  // Must be msg.sender if set
  bytes32 adaptParams;
  CommitmentCiphertext[] commitmentCiphertext;
}
```

**Use Cases**:
- Private DEX swaps
- Private lending/borrowing
- Private LP provision

---

## Privacy Set

### Anonymity Pool

All users share the same anonymity pool:
- Larger pool = stronger privacy
- Volume since inception: $2B+
- WETH accounts for 76% of volume

### Privacy Guarantees

**What's Hidden**:
- Sender address
- Recipient address
- Transaction amount
- Token type (within pool)
- Balance information

**What's Public**:
- Shield events (with encrypted data)
- Unshield events (recipient address visible)
- Nullifier consumption
- Merkle root updates

---

## RAILGUN v3 (Planned)

### Key Improvements

1. **Modular Architecture**: Split privacy system into multiple contracts
2. **Gas Reduction**: 50-60% cheaper cross-contract transactions
3. **Upgradeability**: Individual components upgradeable
4. **Contract Size**: Overcomes Ethereum contract size limits

**Status**: In development, pending elite-tier audit before governance vote

---

## Supported Networks

| Network | Status | Contract Type |
|---------|--------|---------------|
| Ethereum | Live | Primary |
| Polygon | Live | Full |
| BSC | Live | Full |
| Arbitrum | Live | Full |

Each network has separate contracts and governance tokens (RAIL, RAILPOLY, RAILBSC).

---

## Comparison to Other Privacy Solutions

| Aspect | RAILGUN | Tornado Cash | Aztec |
|--------|---------|--------------|-------|
| Layer | L1 On-chain | L1 On-chain | L2 Rollup |
| Amounts | Variable (UTXO) | Fixed denominations | Variable |
| Token Types | ERC-20, ERC-721 | ETH, select ERC-20 | Various |
| DeFi Integration | Native | Limited | Native |
| Compliance | PPOI system | None | Viewing keys |
| Decentralization | Full | Full | Sequencer |

---

## Technical Limitations

1. **Proof Generation**: Client-side proof generation requires computational resources
2. **Circuit Constraints**: 54 circuits must cover all use cases
3. **Gas Costs**: zkSNARK verification is expensive (~300k gas per verify)
4. **Tree Size**: 65,536 commitments per tree before rotation

---

## Sources

| Source | Type |
|--------|------|
| [GitHub - Contract](https://github.com/Railgun-Privacy/contract) | Code |
| [RAILGUN Docs - ZK Cryptography](https://docs.railgun.org/wiki/learn/privacy-system/zero-knowledge-cryptography) | Official |
| [RAILGUN Docs - Developer Guide](https://docs.railgun.org/developer-guide) | Official |
| [Medium - RAILGUN v3](https://medium.com/@Railgun_Project/the-new-architecture-for-ethereum-privacy-introducing-railgun-v3-21e111fa297e) | Official |
| [Etherscan - Relay Contract](https://etherscan.io/address/0xfa7093cdd9ee6932b4eb2c9e1cde7ce00b1fa4b9) | Blockchain |

---

*Constitutional Research Note: RAILGUN represents a sophisticated implementation of zkSNARK-based privacy on Ethereum. Unlike Tornado Cash's fixed-denomination mixer, RAILGUN's UTXO model enables variable amounts and native DeFi interactions. The Poseidon hash function choice optimizes for zkSNARK efficiency. The PPOI compliance system is a novel approach to privacy-preserving compliance, though it has limitations as demonstrated by bypass incidents.*
