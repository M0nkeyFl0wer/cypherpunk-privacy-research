# Railway

Railway is a private DeFi wallet powered by the RAILGUN privacy network that uses advanced zkSNARKs technology to enable untraceable ERC-20 token transactions across Ethereum, Arbitrum, Polygon, BSC, and other chains. Users can shield tokens for complete transaction privacy, interact with public DeFi platforms (swaps, yield farming, liquidity provision) from private 0zk addresses, and maintain encrypted wallet data stored only locally with zero activity logs. The wallet includes compliance features like Viewing Keys, Private Proofs of Innocence (Privacy Pools), and tax reporting tools, available on desktop, iOS, and Android.

## Basic Information

- **Website**: https://www.railway.xyz/
- **GitHub**: https://github.com/Railway-Wallet

## Technology Stack

- {'primary_languages': {'TypeScript': '96.3%', 'SCSS': '2.6%', 'JavaScript': '0.7%', 'Kotlin': '0.1%', 'Shell': '0.1%', 'HTML': '0.1%'}, 'mobile_architecture': {'framework': 'React Native', 'runtime': 'nodejs-mobile-react-native', 'description': 'Cross-platform mobile application with embedded Node.js runtime for cryptographic operations'}, 'desktop_architecture': {'framework': 'Electron (inferred)', 'description': 'Cross-platform desktop application for Mac, Windows, and Linux'}, 'web_architecture': {'framework': 'React (inferred from TypeScript stack)', 'description': 'Web-based wallet interface'}, 'blockchain_sdk': {'name': 'RAILGUN Wallet SDK', 'repositories': ['https://github.com/Railgun-Community/wallet', 'https://github.com/Railgun-Community/engine'], 'description': 'SDK library to develop RAILGUN-powered wallets with privacy features', 'compatibility': 'Node.js and modern web browsers'}, 'core_libraries': {'railgun_wallet_sdk': {'purpose': 'Shield ERC-20 tokens/NFTs, manage shielded balances, private transfers, private smart contract interactions', 'language': 'TypeScript'}, 'railgun_engine': {'purpose': 'JavaScript library to interact with RAILGUN smart contracts', 'language': 'TypeScript/JavaScript', 'features': ['Merkle tree data structure management', 'UTXO scanning and tracking', 'Wallet balance calculation', 'Contract history scanning', 'Transaction synchronization']}}, 'cryptographic_libraries': {'zk_snark': {'implementation': 'Groth16 proving system', 'circuits': '54 distinct circuits for various transaction types', 'description': 'Zero-knowledge proofs for transaction privacy'}, 'hash_functions': {'poseidon': {'purpose': 'Encrypt UTXOs and obscure user/transaction data', 'usage': 'SNARK-friendly hash function optimized for EVM execution', 'implementation': 'Custom EVM-optimized implementation (RAILGUN v3)'}}, 'key_management': {'mnemonic_generation': 'BIP-39 compatible', 'viewing_keys': 'Selective transaction transparency', 'blinded_commitments': 'Privacy-preserving transaction commitments'}}, 'smart_contract_interaction': {'eips_supported': ['EIP-197 (Elliptic curve precompiles)', 'EIP-198 (Modular exponentiation precompile)', 'EIP-5988 (Poseidon hash precompile - proposed)'], 'token_standards': ['ERC-20', 'ERC-721', 'ERC-1155']}, 'package_manager': 'yarn', 'blockchain_networks': ['Ethereum', 'Polygon', 'BNB Smart Chain (BSC)', 'Arbitrum']}
- TypeScript
- SCSS
- JavaScript
- Kotlin
- Shell
- HTML

## Research Metadata

- **Confidence**: 0.85
- **Last Updated**: 2025-10-09
