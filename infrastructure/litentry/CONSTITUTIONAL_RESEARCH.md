# Litentry

TEE worker based on integritee-network/worker framework

## Basic Information

- **Website**: https://litentry.network
- **GitHub**: https://github.com/litentry/litentry-parachain

## Technology Stack

- {'primary_languages': [{'language': 'Rust', 'percentage': 79.3, 'usage': 'Core blockchain implementation, runtime, pallets'}, {'language': 'TypeScript', 'percentage': 12.1, 'usage': 'GraphQL server, API layer'}, {'language': 'Solidity', 'percentage': 4.4, 'usage': 'EVM compatibility layer'}, {'language': 'Shell', 'usage': 'Build scripts and deployment automation'}, {'language': 'C', 'usage': 'SGX SDK integration'}, {'language': 'Python', 'usage': 'Worker launch scripts and configuration tools'}], 'frameworks_and_platforms': [{'name': 'Substrate', 'version': 'Latest', 'purpose': 'L1 blockchain framework', 'confidence': 1.0}, {'name': 'Polkadot', 'purpose': 'Relay chain for parachain slot (shared security and interoperability)', 'confidence': 1.0}, {'name': 'Kusama', 'purpose': 'Alternative relay chain (strategic focus on Polkadot)', 'confidence': 0.85}, {'name': 'Integritee', 'purpose': 'TEE sidechain framework for SGX worker implementation', 'confidence': 1.0}], 'key_dependencies': [{'name': 'Intel SGX SDK', 'purpose': 'Trusted Execution Environment implementation', 'configuration': 'SGX_MODE=SW for development, /opt/intel/sgxsdk/environment'}, {'name': 'Substrate pallets', 'purpose': 'Modular runtime components (governance, balance, parachain-system, etc.)'}, {'name': 'incubator-mesatee-sgx', 'purpose': 'Rust SGX SDK for writing Intel SGX applications in Rust', 'source': 'https://github.com/litentry/incubator-mesatee-sgx'}, {'name': 'tee-sgx-sdk', 'purpose': 'SGX pallet compilation to WASM blob/binary'}, {'name': 'Zombienet', 'purpose': 'Local network deployment and testing'}], 'build_system': ['Cargo (Rust package manager)', 'Makefile-based build processes', 'worker-log-level-config.toml for RUST_LOG configuration']}

## Research Metadata

