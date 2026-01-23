// Metadata for graph nodes - descriptions, vulnerabilities, and links
// This provides rich tooltip content for the ProjectMiniGraph

export interface LanguageMetadata {
  description: string;
  vulnerabilities: string[];
  securityNotes?: string;
  learnMoreUrl?: string;
}

export interface TopicMetadata {
  description: string;
  relatedConcepts?: string[];
  learnMoreUrl?: string;
}

export interface LicenseMetadata {
  description: string;
  permissions: string[];
  limitations: string[];
  learnMoreUrl?: string;
}

// Language-specific security information
export const languageMetadata: Record<string, LanguageMetadata> = {
  // Systems languages
  'rust': {
    description: 'Memory-safe systems language with strong type system and ownership model.',
    vulnerabilities: [
      'Unsafe blocks can introduce memory vulnerabilities',
      'Supply chain attacks via crates.io dependencies',
      'Logic errors in cryptographic implementations',
    ],
    securityNotes: 'Memory safety by default. Unsafe code requires explicit marking.',
    learnMoreUrl: 'https://doc.rust-lang.org/book/ch19-01-unsafe-rust.html',
  },
  'c': {
    description: 'Low-level systems language with direct memory access.',
    vulnerabilities: [
      'Buffer overflows (CWE-120)',
      'Use-after-free (CWE-416)',
      'Integer overflows (CWE-190)',
      'Format string vulnerabilities (CWE-134)',
      'Null pointer dereference (CWE-476)',
    ],
    securityNotes: 'Manual memory management. Requires careful auditing.',
    learnMoreUrl: 'https://cwe.mitre.org/data/definitions/658.html',
  },
  'c++': {
    description: 'Systems language with object-oriented features.',
    vulnerabilities: [
      'All C vulnerabilities plus object lifecycle issues',
      'Double-free vulnerabilities',
      'Type confusion in polymorphism',
      'Virtual function table hijacking',
    ],
    securityNotes: 'Complex memory model. Smart pointers help but don\'t eliminate risks.',
    learnMoreUrl: 'https://cwe.mitre.org/data/definitions/659.html',
  },
  'go': {
    description: 'Google\'s systems language with garbage collection and concurrency primitives.',
    vulnerabilities: [
      'Race conditions in goroutines',
      'Slice bounds checking bypasses',
      'Unsafe package misuse',
      'Integer overflow in 32-bit contexts',
    ],
    securityNotes: 'Memory-safe by default. Concurrency requires careful synchronization.',
    learnMoreUrl: 'https://go.dev/doc/security/',
  },

  // Web/scripting languages
  'javascript': {
    description: 'Dynamic scripting language for web and Node.js applications.',
    vulnerabilities: [
      'Prototype pollution (CWE-1321)',
      'XSS via DOM manipulation',
      'Insecure deserialization',
      'npm supply chain attacks',
      'Type coercion bugs',
    ],
    securityNotes: 'Dynamic typing can mask bugs. Use TypeScript for better safety.',
    learnMoreUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html',
  },
  'typescript': {
    description: 'Typed superset of JavaScript with compile-time checking.',
    vulnerabilities: [
      'Runtime still JavaScript (all JS vulnerabilities apply)',
      'Type assertions can bypass safety',
      'any type defeats type checking',
    ],
    securityNotes: 'Better than JS but types are erased at runtime.',
    learnMoreUrl: 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html',
  },
  'python': {
    description: 'High-level interpreted language popular for scripting and data science.',
    vulnerabilities: [
      'Pickle deserialization attacks',
      'Command injection via subprocess',
      'YAML deserialization (PyYAML load)',
      'pip supply chain attacks',
    ],
    securityNotes: 'Dynamic typing. Be careful with eval/exec and deserialization.',
    learnMoreUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/Python_Security_Cheat_Sheet.html',
  },

  // Smart contract languages
  'solidity': {
    description: 'Primary language for Ethereum smart contracts.',
    vulnerabilities: [
      'Reentrancy attacks (like DAO hack)',
      'Integer overflow/underflow (pre-0.8)',
      'Front-running / MEV extraction',
      'Access control flaws',
      'Delegatecall vulnerabilities',
      'Oracle manipulation',
    ],
    securityNotes: 'Immutable once deployed. Requires thorough auditing.',
    learnMoreUrl: 'https://swcregistry.io/',
  },
  'vyper': {
    description: 'Pythonic smart contract language designed for security.',
    vulnerabilities: [
      'Reentrancy (still possible)',
      'Compiler bugs (historically)',
      'Same EVM-level risks as Solidity',
    ],
    securityNotes: 'Simpler than Solidity by design. Fewer footguns.',
    learnMoreUrl: 'https://docs.vyperlang.org/en/stable/security.html',
  },
  'move': {
    description: 'Resource-oriented language for blockchain (Sui, Aptos).',
    vulnerabilities: [
      'Resource handling edge cases',
      'Module upgrade attacks',
      'Access control misconfigurations',
    ],
    securityNotes: 'Strong resource safety. Newer ecosystem, less battle-tested.',
    learnMoreUrl: 'https://move-language.github.io/move/',
  },
  'cairo': {
    description: 'Language for StarkNet STARK proofs and contracts.',
    vulnerabilities: [
      'Proof soundness issues',
      'Felt overflow behavior',
      'Storage collision in proxies',
    ],
    securityNotes: 'ZK-native. Different security model than EVM.',
    learnMoreUrl: 'https://book.cairo-lang.org/',
  },

  // Proof/verification languages
  'circom': {
    description: 'DSL for writing zero-knowledge circuits.',
    vulnerabilities: [
      'Under-constrained circuits',
      'Trusted setup compromise (Groth16)',
      'Signal assignment vs constraint confusion',
    ],
    securityNotes: 'Circuits are hard to audit. Formal verification recommended.',
    learnMoreUrl: 'https://docs.circom.io/',
  },
  'noir': {
    description: 'Rust-like language for zero-knowledge proofs (Aztec).',
    vulnerabilities: [
      'Under-constrained proofs',
      'Backend-specific soundness issues',
    ],
    securityNotes: 'Higher-level than Circom. Newer, evolving rapidly.',
    learnMoreUrl: 'https://noir-lang.org/',
  },

  // JVM languages
  'java': {
    description: 'Object-oriented language running on the JVM.',
    vulnerabilities: [
      'Deserialization attacks (Log4Shell-style)',
      'XML External Entity (XXE)',
      'Injection in JDBC queries',
      'Reflection-based attacks',
    ],
    securityNotes: 'Memory-safe but complex serialization is dangerous.',
    learnMoreUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html',
  },
  'kotlin': {
    description: 'Modern JVM language with null safety.',
    vulnerabilities: [
      'Same JVM vulnerabilities as Java',
      'Null safety bypassed via Java interop',
    ],
    securityNotes: 'Better null handling than Java. Still JVM attack surface.',
    learnMoreUrl: 'https://kotlinlang.org/docs/security.html',
  },
  'scala': {
    description: 'Functional/OOP hybrid on JVM.',
    vulnerabilities: [
      'Same JVM vulnerabilities as Java',
      'Macro-based code injection',
    ],
    securityNotes: 'Functional style can reduce bugs. JVM risks remain.',
  },

  // Other notable languages
  'haskell': {
    description: 'Pure functional language with strong type system.',
    vulnerabilities: [
      'Space leaks from lazy evaluation',
      'Unsafe functions (unsafePerformIO)',
      'Template Haskell injection',
    ],
    securityNotes: 'Strong guarantees from type system. Purity aids reasoning.',
    learnMoreUrl: 'https://wiki.haskell.org/Security',
  },
  'ocaml': {
    description: 'Functional language used in formal verification.',
    vulnerabilities: [
      'Obj.magic bypasses type safety',
      'C FFI vulnerabilities',
    ],
    securityNotes: 'Strong type system. Used for Tezos/Coq. Relatively safe.',
  },
  'swift': {
    description: 'Apple\'s modern systems language.',
    vulnerabilities: [
      'Force unwrapping crashes',
      'C interop vulnerabilities',
      'Race conditions in actors',
    ],
    securityNotes: 'Memory-safe by default. Optional handling prevents nulls.',
  },
  'shell': {
    description: 'Bash/shell scripting for automation.',
    vulnerabilities: [
      'Command injection (CWE-78)',
      'Path traversal',
      'Unquoted variable expansion',
      'Glob injection',
    ],
    securityNotes: 'Inherently dangerous for security-critical code.',
    learnMoreUrl: 'https://github.com/anordal/shellharden/blob/master/how_to_do_things_safely_in_bash.md',
  },
  'assembly': {
    description: 'Low-level CPU instructions (various architectures).',
    vulnerabilities: [
      'All memory safety issues of C',
      'Side-channel attacks',
      'ROP/JOP gadget chains',
    ],
    securityNotes: 'Maximum control = maximum responsibility. Hard to audit.',
  },
};

// Topic descriptions for privacy/crypto concepts
export const topicMetadata: Record<string, TopicMetadata> = {
  'zero-knowledge-proofs': {
    description: 'Cryptographic proofs that reveal nothing beyond statement validity.',
    relatedConcepts: ['zk-SNARKs', 'zk-STARKs', 'Groth16', 'PLONK'],
    learnMoreUrl: 'https://zkp.science/',
  },
  'privacy': {
    description: 'Protection of user data and transaction details from surveillance.',
    relatedConcepts: ['encryption', 'anonymity', 'data minimization'],
  },
  'encryption': {
    description: 'Transformation of data to prevent unauthorized access.',
    relatedConcepts: ['AES', 'ChaCha20', 'public-key cryptography'],
  },
  'blockchain': {
    description: 'Distributed ledger with cryptographic linking of blocks.',
    relatedConcepts: ['consensus', 'merkle trees', 'finality'],
  },
  'defi': {
    description: 'Decentralized finance protocols for permissionless financial services.',
    relatedConcepts: ['AMM', 'lending', 'yield farming'],
  },
  'layer-2': {
    description: 'Scaling solutions built on top of base blockchains.',
    relatedConcepts: ['rollups', 'state channels', 'plasma'],
  },
  'mixnet': {
    description: 'Network that mixes traffic to prevent correlation analysis.',
    relatedConcepts: ['Tor', 'onion routing', 'traffic analysis resistance'],
  },
  'mpc': {
    description: 'Multi-party computation for collaborative computation on private data.',
    relatedConcepts: ['secret sharing', 'garbled circuits', 'threshold signatures'],
  },
  'tee': {
    description: 'Trusted Execution Environment - hardware-isolated secure enclaves.',
    relatedConcepts: ['SGX', 'TrustZone', 'confidential computing'],
  },
  'homomorphic-encryption': {
    description: 'Encryption allowing computation on ciphertext.',
    relatedConcepts: ['FHE', 'CKKS', 'BFV'],
  },
  'anonymity': {
    description: 'State of being unidentifiable within a set of subjects.',
    relatedConcepts: ['pseudonymity', 'unlinkability', 'anonymity set'],
  },
  'metadata-protection': {
    description: 'Hiding who communicates with whom, when, and how often.',
    relatedConcepts: ['traffic analysis', 'timing attacks', 'padding'],
  },
};

// License descriptions
export const licenseMetadata: Record<string, LicenseMetadata> = {
  'MIT': {
    description: 'Permissive license allowing reuse with attribution.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    limitations: ['No liability', 'No warranty'],
    learnMoreUrl: 'https://choosealicense.com/licenses/mit/',
  },
  'Apache-2.0': {
    description: 'Permissive license with patent grant.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
    limitations: ['Trademark use', 'No liability', 'No warranty'],
    learnMoreUrl: 'https://choosealicense.com/licenses/apache-2.0/',
  },
  'GPL-3.0': {
    description: 'Strong copyleft license requiring source disclosure.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
    limitations: ['Must disclose source', 'Same license', 'No liability', 'No warranty'],
    learnMoreUrl: 'https://choosealicense.com/licenses/gpl-3.0/',
  },
  'AGPL-3.0': {
    description: 'GPL + network use triggers source disclosure.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
    limitations: ['Disclose source for network use', 'Same license', 'No liability'],
    learnMoreUrl: 'https://choosealicense.com/licenses/agpl-3.0/',
  },
  'BSD-3-Clause': {
    description: 'Permissive license similar to MIT.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    limitations: ['No liability', 'No warranty'],
    learnMoreUrl: 'https://choosealicense.com/licenses/bsd-3-clause/',
  },
  'MPL-2.0': {
    description: 'Weak copyleft - modified files must stay open.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
    limitations: ['Disclose source for modified files', 'Same license for modified files'],
    learnMoreUrl: 'https://choosealicense.com/licenses/mpl-2.0/',
  },
  'Unlicense': {
    description: 'Public domain dedication.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    limitations: ['No liability', 'No warranty'],
    learnMoreUrl: 'https://choosealicense.com/licenses/unlicense/',
  },
};

// Project descriptions for the ecosystem graph
export const projectMetadata: Record<string, {
  description: string;
  highlights?: string[];
  url?: string;
}> = {
  // Privacy Coins
  'monero': {
    description: 'Leading privacy cryptocurrency using ring signatures, stealth addresses, and RingCT to obscure sender, receiver, and amounts.',
    highlights: ['Battle-tested since 2014', 'Default privacy (no transparent mode)', 'Active research community'],
    url: 'https://getmonero.org',
  },
  'zcash': {
    description: 'First cryptocurrency to implement zk-SNARKs, enabling fully shielded transactions while maintaining optional transparency.',
    highlights: ['Pioneered zk-SNARKs in production', 'Halo2 eliminates trusted setup', 'Foundation-funded development'],
    url: 'https://z.cash',
  },
  'iron-fish': {
    description: 'Privacy-focused Layer 1 blockchain using zk-SNARKs with Sapling protocol, designed for everyday transactions.',
    highlights: ['Full privacy by default', 'Rust implementation', 'Custom Sapling variant'],
    url: 'https://ironfish.network',
  },
  'firo': {
    description: 'Privacy coin pioneering Lelantus and Spark protocols for trustless anonymous transactions.',
    highlights: ['Lelantus burns and redeems', 'Spark adds receiver privacy', 'No trusted setup'],
    url: 'https://firo.org',
  },
  'oxen': {
    description: 'Privacy coin powering the Session messenger and Lokinet, using CryptoNote-based ring signatures.',
    highlights: ['Powers Session messenger', 'Service node network', 'Lokinet integration'],
    url: 'https://oxen.io',
  },
  'zano': {
    description: 'Privacy coin with confidential assets support, enabling private token creation on top of CryptoNote.',
    highlights: ['Confidential assets', 'Hybrid PoW/PoS', 'Ionic Swaps'],
    url: 'https://zano.org',
  },
  'mobilecoin': {
    description: 'Mobile-first privacy coin using SGX TEE and RingCT, designed for fast payments on phones.',
    highlights: ['3-second finality', 'SGX hardware security', 'Signal integration (paused)'],
    url: 'https://mobilecoin.com',
  },

  // Messaging
  'signal': {
    description: 'Gold standard for secure messaging. Double Ratchet protocol, sealed sender, and SGX-based contact discovery.',
    highlights: ['Post-quantum PQXDH upgrade', 'Sealed sender metadata protection', 'Open source'],
    url: 'https://signal.org',
  },
  'telegram': {
    description: 'Popular messenger with optional E2E encryption via MTProto. Secret chats are encrypted; regular chats are not.',
    highlights: ['Optional E2E only', 'Custom MTProto protocol', '900M+ users'],
    url: 'https://telegram.org',
  },
  'briar': {
    description: 'Mesh-capable messenger that works without internet using Tor, Wi-Fi, and Bluetooth for censorship resistance.',
    highlights: ['Works without internet', 'Tor integration', 'Mesh networking'],
    url: 'https://briarproject.org',
  },

  // Mixnets
  'nym': {
    description: 'Incentivized mixnet using Sphinx packets and cover traffic to prevent traffic analysis at network layer.',
    highlights: ['Economic incentives for nodes', 'Coconut credentials', 'Cosmos SDK'],
    url: 'https://nymtech.net',
  },
  'hopr': {
    description: 'Decentralized mixnet with Ethereum-based incentives, using layered encryption and packet mixing.',
    highlights: ['ETH-based incentives', 'Cover traffic', 'Node running rewards'],
    url: 'https://hoprnet.org',
  },
  'xx-network': {
    description: 'Quantum-resistant mixnet using cMix protocol, founded by cryptographer David Chaum.',
    highlights: ['Quantum resistant', 'cMix protocol', 'David Chaum project'],
    url: 'https://xx.network',
  },

  // Privacy Blockchains
  'secret-network': {
    description: 'First blockchain with encrypted smart contracts using Intel SGX TEE for confidential computation.',
    highlights: ['Encrypted contract state', 'SGX TEE security', 'Cosmos ecosystem'],
    url: 'https://scrt.network',
  },
  'oasis-network': {
    description: 'Privacy-enabled blockchain with confidential ParaTimes using TEE technology for private smart contracts.',
    highlights: ['ParaTime architecture', 'Data tokenization', 'Confidential compute'],
    url: 'https://oasisprotocol.org',
  },
  'darkfi': {
    description: 'Anonymous smart contract platform using zk-SNARKs for fully private DeFi and DAOs.',
    highlights: ['Anonymous smart contracts', 'Private DAOs', 'Lunarpunk ethos'],
    url: 'https://dark.fi',
  },
  'concordium': {
    description: 'Blockchain with built-in ID layer and zero-knowledge proofs for regulatory compliance with privacy.',
    highlights: ['ID layer for compliance', 'ZK proofs', 'Science-backed'],
    url: 'https://concordium.com',
  },
  'findora': {
    description: 'Privacy blockchain using Bulletproofs and Turbo-PLONK for confidential transactions and assets.',
    highlights: ['Bulletproofs + PLONK', 'Confidential assets', 'Auditable privacy'],
    url: 'https://findora.org',
  },
  'incognito': {
    description: 'Privacy layer for other blockchains using ring signatures to shield assets from any chain.',
    highlights: ['Cross-chain privacy', 'Ring signatures', 'pTokens'],
    url: 'https://incognito.org',
  },

  // Mixers
  'tornado-cash': {
    description: 'Ethereum mixer using zk-SNARKs to break transaction links. OFAC sanctions (2022) lifted March 2025 after Fifth Circuit ruling. Protocol remains operational.',
    highlights: ['zk-SNARK based', 'Sanctions lifted 2025', 'Protocol operational'],
    url: 'https://tornadocash.eth.link',
  },

  // ZK Rollups & Tooling
  'miden': {
    description: 'Polygon zk-rollup using STARKs for quantum resistance and no trusted setup requirements.',
    highlights: ['STARK-based (quantum safe)', 'No trusted setup', 'Polygon ecosystem'],
    url: 'https://polygon.technology/polygon-miden',
  },
  'zksync': {
    description: 'Ethereum L2 using zk-SNARKs (PLONK) for scalable and secure transactions.',
    highlights: ['PLONK proving system', 'Account abstraction', 'Matter Labs'],
    url: 'https://zksync.io',
  },
  'starkex': {
    description: 'StarkWare scaling engine using STARKs, powering dYdX, Immutable X, and others.',
    highlights: ['Powers major apps', 'STARK proofs', 'StarkWare'],
    url: 'https://starkware.co/starkex',
  },
  'circom': {
    description: 'Domain-specific language for writing zk-SNARK circuits, widely used in Ethereum ecosystem.',
    highlights: ['Circuit compiler', 'iden3 team', 'Groth16/PLONK output'],
    url: 'https://docs.circom.io',
  },
  'snarkjs': {
    description: 'JavaScript library for zk-SNARK proof generation and verification, companion to Circom.',
    highlights: ['Browser-compatible', 'Groth16 & PLONK', 'iden3 team'],
    url: 'https://github.com/iden3/snarkjs',
  },
  'zk-money': {
    description: 'Aztec privacy layer for Ethereum using zk-SNARKs. Service discontinued in 2023.',
    highlights: ['Aztec Connect (discontinued)', 'zk.money frontend', 'Private DeFi access'],
    url: 'https://aztec.network',
  },

  // Identity
  'semaphore': {
    description: 'Zero-knowledge protocol for anonymous membership proofs and signaling in groups.',
    highlights: ['Anonymous group membership', 'PSE/EF supported', 'Widely integrated'],
    url: 'https://semaphore.pse.dev',
  },
  'iden3': {
    description: 'Self-sovereign identity protocol using zk-SNARKs for private credential verification.',
    highlights: ['Circom creators', 'ZK identity proofs', 'Polygon ID basis'],
    url: 'https://iden3.io',
  },

  // VPNs
  'orchid': {
    description: 'Decentralized VPN marketplace with nanopayments, using onion routing architecture.',
    highlights: ['Nano-payments', 'Multi-hop routing', 'OXT token'],
    url: 'https://orchid.com',
  },
  'mysterium-network': {
    description: 'Decentralized VPN and proxy network with node operators earning for bandwidth.',
    highlights: ['P2P VPN network', 'Node rewards', 'Residential IPs'],
    url: 'https://mysterium.network',
  },
  'sentinel': {
    description: 'Cosmos-based decentralized VPN with dVPN nodes operated by community members.',
    highlights: ['Cosmos SDK', 'Community nodes', 'dVPN framework'],
    url: 'https://sentinel.co',
  },
  'deeper-network': {
    description: 'Hardware-based decentralized VPN with physical nodes for home network privacy.',
    highlights: ['Hardware nodes', 'Substrate chain', 'Home network focus'],
    url: 'https://deeper.network',
  },

  // Wallets
  'wasabi-wallet': {
    description: 'Bitcoin privacy wallet with built-in CoinJoin and mandatory Tor connection.',
    highlights: ['WabiSabi CoinJoin', 'Mandatory Tor', 'Bitcoin only'],
    url: 'https://wasabiwallet.io',
  },
  'cake-wallet': {
    description: 'Multi-currency mobile wallet with Monero focus, supporting atomic swaps.',
    highlights: ['Monero-first', 'Atomic swaps', 'Mobile native'],
    url: 'https://cakewallet.com',
  },
  'fluidkey': {
    description: 'Ethereum wallet using stealth addresses (EIP-5564) for receiving private payments.',
    highlights: ['EIP-5564 stealth addresses', 'Ethereum native', 'Fresh addresses per payment'],
    url: 'https://fluidkey.com',
  },
  'zeal': {
    description: 'Self-custody Ethereum wallet focused on local-first architecture and user sovereignty.',
    highlights: ['Local-first', 'No tracking', 'Open source'],
    url: 'https://zeal.app',
  },

  // Other
  'protonmail': {
    description: 'End-to-end encrypted email service based in Switzerland with zero-access encryption.',
    highlights: ['Swiss jurisdiction', 'Zero-access encryption', 'PGP compatible'],
    url: 'https://proton.me',
  },
  'mask-network': {
    description: 'Browser extension for encrypted social media posts and Web3 integration on Twitter/Facebook.',
    highlights: ['Social media encryption', 'Web3 bridge', 'Steganography option'],
    url: 'https://mask.io',
  },
  'meshtastic': {
    description: 'Open-source mesh networking for off-grid communication using LoRa radios.',
    highlights: ['LoRa mesh', 'No internet needed', 'AES encryption'],
    url: 'https://meshtastic.org',
  },
  'rotki': {
    description: 'Local-first portfolio tracker that never sends your data to the cloud.',
    highlights: ['No cloud uploads', 'Privacy respecting', 'Open source'],
    url: 'https://rotki.com',
  },
  'webb-protocol': {
    description: 'Cross-chain private bridge using zk-SNARKs for private transfers between blockchains.',
    highlights: ['Cross-chain privacy', 'ZK bridges', 'Multi-chain'],
    url: 'https://webb.tools',
  },
  'elusiv': {
    description: 'Privacy layer for Solana using zk-SNARKs with optional compliance features.',
    highlights: ['Solana native', 'Compliant privacy', 'ZK proofs'],
    url: 'https://elusiv.io',
  },
};

// Helper function to get metadata for a node
export function getNodeMetadata(nodeId: string, nodeType: string): {
  description: string;
  details?: string[];
  learnMoreUrl?: string;
} | null {
  const normalizedId = nodeId.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  if (nodeType === 'language') {
    const lang = languageMetadata[normalizedId];
    if (lang) {
      return {
        description: lang.description,
        details: lang.vulnerabilities,
        learnMoreUrl: lang.learnMoreUrl,
      };
    }
  }

  if (nodeType === 'topic') {
    const topic = topicMetadata[normalizedId];
    if (topic) {
      return {
        description: topic.description,
        details: topic.relatedConcepts,
        learnMoreUrl: topic.learnMoreUrl,
      };
    }
  }

  if (nodeType === 'license') {
    const license = licenseMetadata[normalizedId];
    if (license) {
      return {
        description: license.description,
        details: [...license.permissions.map(p => `✓ ${p}`), ...license.limitations.map(l => `✗ ${l}`)],
        learnMoreUrl: license.learnMoreUrl,
      };
    }
  }

  return null;
}

// Helper function to get project metadata for ecosystem graph
export function getProjectMetadata(projectId: string): {
  description: string;
  highlights?: string[];
  url?: string;
} | null {
  const normalizedId = projectId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return projectMetadata[normalizedId] || null;
}
