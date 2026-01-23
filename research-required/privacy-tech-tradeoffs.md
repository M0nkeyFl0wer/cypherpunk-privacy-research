# Privacy Technology Trade-offs and Vulnerabilities

Research compiled January 2026 for graph tooltips.

## zk-SNARKs

**How it works:** Zero-knowledge succinct non-interactive arguments of knowledge. Allows proving a statement is true without revealing the underlying data. Uses elliptic curve cryptography.

### Trade-offs
- **Trusted setup required** - Initial ceremony generates "toxic waste" that must be destroyed. If compromised, fake proofs possible.
- **Small proof size** - Very compact proofs (~200 bytes), fast verification
- **Not quantum resistant** - Relies on elliptic curves vulnerable to quantum computers
- **High prover cost** - Generating proofs is computationally expensive

### Known Vulnerabilities
- **Under-constrained circuits** - 95 of 141 vulnerabilities in 2018-2024 study were soundness issues (circuit layer)
- **Frozen Heart vulnerability** - Implementation errors from incomplete proof system papers
- **Unsafe circuit reuse** - Reusing circuits without proper input constraints
- **Gnark Plonk verifier bug** - Framework implementation errors

### Security Considerations
- Audit focus: Circuit constraints, input validation, trusted setup integrity
- Use established proving systems (Groth16, PLONK, Halo2)
- Verify trusted setup ceremony participation

**Sources:**
- [SoK: Understanding Security Vulnerabilities in SNARKs (2024)](https://arxiv.org/html/2402.15293v3)
- [Cointelegraph: Circuit Layer Vulnerabilities](https://cointelegraph.com/news/researchers-identify-key-circuit-layer-vulnerabilities-snark-systems)

---

## zk-STARKs

**How it works:** Scalable Transparent Arguments of Knowledge. Uses hash-based cryptography instead of elliptic curves. No trusted setup required.

### Trade-offs
- **No trusted setup** - Transparent, no "toxic waste"
- **Quantum resistant** - Hash-based cryptography survives quantum attacks
- **Larger proofs** - 10-100x larger than SNARKs
- **Slower verification** - More computation to verify

### Known Vulnerabilities
- **Proof soundness issues** - Similar circuit-level bugs as SNARKs
- **Felt overflow** - Cairo-specific integer handling issues
- **Younger ecosystem** - Less battle-tested than SNARKs

### Security Considerations
- Audit focus: Arithmetic over finite fields, constraint systems
- Monitor Cairo/StarkNet security advisories

---

## Ring Signatures (CryptoNote/RingCT)

**How it works:** Sender signs with their key plus decoy keys from the blockchain. Verifier knows one key signed but not which one.

### Trade-offs
- **Anonymity set size** - Privacy depends on ring size (more decoys = better privacy but larger transactions)
- **No trusted setup** - Pure cryptography
- **Plausible deniability** - Can't prove you didn't sign

### Known Vulnerabilities
- **Timing analysis** - Transaction timing can leak information
- **Output age heuristics** - Fresh outputs often real, old often decoys
- **Flood attacks** - Attacker creates many outputs to dominate ring selection
- **Chain reaction analysis** - Eliminating decoys across multiple transactions

### Security Considerations
- Use maximum ring size
- Random decoy selection algorithm quality matters
- Avoid predictable transaction patterns

---

## Trusted Execution Environments (Intel SGX)

**How it works:** Hardware-isolated secure enclaves that process data while encrypted. Even the OS can't see inside.

### Trade-offs
- **Hardware trust required** - Must trust Intel/chip manufacturer
- **Side-channel vulnerable** - Multiple attacks demonstrated
- **Fast execution** - Near-native performance
- **Attestation** - Can prove code running in enclave

### Known Vulnerabilities
- **Spectre/Meltdown variants** - CPU speculation attacks
- **Plundervolt** - Voltage manipulation attacks
- **SGAxe** - Cache-based key extraction
- **Foreshadow/L1TF** - L1 cache attacks

### Security Considerations
- Keep SGX firmware updated
- Assume side-channels exist, design accordingly
- Don't rely solely on SGX for security

---

## Mixnets

**How it works:** Messages encrypted in layers, routed through multiple nodes that each strip one layer. Nodes mix message ordering.

### Trade-offs
- **Latency** - Messages delayed for mixing (seconds to minutes)
- **Strong metadata protection** - Timing analysis resistant
- **Requires cover traffic** - Fake messages to hide real patterns
- **Economic incentives needed** - Node operators need motivation

### Known Vulnerabilities
- **Global adversary** - If attacker sees all traffic, correlation possible
- **Sybil attacks** - Attacker runs many nodes to deanonymize
- **Intersection attacks** - Long-term observation narrows anonymity set
- **Node collusion** - Multiple compromised nodes on same path

### Security Considerations
- Verify node diversity (jurisdiction, operator)
- Use cover traffic
- Rotate paths frequently

---

## Stealth Addresses (EIP-5564)

**How it works:** Sender generates one-time address for each payment using receiver's public key. Only receiver can find/spend funds.

### Trade-offs
- **Scanning required** - Receiver must scan all transactions to find theirs
- **No sender privacy** - Only hides receiver
- **Simple cryptography** - Well-understood ECDH
- **Per-transaction addresses** - No address reuse

### Known Vulnerabilities
- **Timing correlation** - If receiver spends immediately, linkable
- **View key compromise** - Leaks all incoming transaction info
- **Implementation bugs** - Key derivation errors

### Security Considerations
- Use proper scanning infrastructure
- Protect view keys carefully
- Add delay before spending

---

## Bulletproofs

**How it works:** Short non-interactive zero-knowledge proofs for range proofs and arithmetic circuits. No trusted setup.

### Trade-offs
- **No trusted setup** - Transparent
- **Logarithmic proof size** - Scales well
- **Slower verification** - Linear verification time
- **Aggregatable** - Multiple proofs combine efficiently

### Known Vulnerabilities
- **Verifier DoS** - Slow verification can be exploited
- **Implementation complexity** - Many moving parts
- **Weaker soundness guarantees** - Computational, not statistical

### Security Considerations
- Use audited implementations
- Batch verification where possible
