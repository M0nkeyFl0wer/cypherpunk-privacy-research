#!/bin/bash
# iExec Research - Bash Commands Reference
# Generated: 2025-10-08
# Purpose: Quick reference for research commands used

echo "=== iExec Research Commands Reference ==="
echo ""

# Directory creation
echo "1. Create deliverables directory:"
echo "   mkdir -p /home/flower/web3privacy-research/deliverables/iexec"
echo ""

# View research results
echo "2. View JSON research results:"
echo "   cat /home/flower/web3privacy-research/deliverables/iexec/research_result.json | jq ."
echo "   # (requires jq: sudo apt install jq)"
echo ""

echo "3. View summary document:"
echo "   less /home/flower/web3privacy-research/deliverables/iexec/research_summary.md"
echo ""

# Search within results
echo "4. Search for specific tech stack items:"
echo "   jq '.tech_stack' /home/flower/web3privacy-research/deliverables/iexec/research_result.json"
echo ""

echo "5. Extract privacy techniques:"
echo "   jq '.privacy_techniques' /home/flower/web3privacy-research/deliverables/iexec/research_result.json"
echo ""

echo "6. List all repositories:"
echo "   jq '.main_repositories[].name' /home/flower/web3privacy-research/deliverables/iexec/research_result.json"
echo ""

# File statistics
echo "7. Check file sizes and line counts:"
echo "   ls -lh /home/flower/web3privacy-research/deliverables/iexec/"
echo "   wc -l /home/flower/web3privacy-research/deliverables/iexec/*.{json,md}"
echo ""

# Git operations (if needed)
echo "8. Stage research files for commit:"
echo "   git add /home/flower/web3privacy-research/deliverables/iexec/research_result.json"
echo "   git add /home/flower/web3privacy-research/deliverables/iexec/research_summary.md"
echo ""

echo "9. Create commit:"
echo "   git commit -m 'Research: Complete iExec technical analysis with TEE/SGX details'"
echo ""

# Validation
echo "10. Validate JSON format:"
echo "    jq empty /home/flower/web3privacy-research/deliverables/iexec/research_result.json && echo 'Valid JSON'"
echo ""

# Quick stats
echo "11. Count data sources:"
echo "    jq '.data_sources | length' /home/flower/web3privacy-research/deliverables/iexec/research_result.json"
echo ""

echo "12. Check confidence score:"
echo "    jq '.confidence_score' /home/flower/web3privacy-research/deliverables/iexec/research_result.json"
echo ""

# Web searches performed
echo "=== Web Searches Performed ==="
echo "- iExec GitHub repository official iExecBlockchainComputing"
echo "- iExec decentralized cloud computing TEE Intel SGX technology stack"
echo "- iExec technology stack Solidity smart contracts Ethereum blockchain"
echo ""

# Repositories analyzed
echo "=== Repositories Analyzed ==="
echo "1. https://github.com/iExecBlockchainComputing/iexec-core"
echo "2. https://github.com/iExecBlockchainComputing/iexec-worker"
echo "3. https://github.com/iExecBlockchainComputing/iexec-sms"
echo "4. https://github.com/iExecBlockchainComputing/PoCo"
echo "5. https://github.com/iExecBlockchainComputing/iexec-sdk"
echo "6. https://github.com/iExecBlockchainComputing/iexec-apps"
echo ""

# Key findings quick reference
echo "=== Key Findings Quick Reference ==="
echo "Tech Stack: Java (99-100%), Solidity, TypeScript"
echo "Privacy: Intel SGX, TEE, Scone Framework, Gramine"
echo "Blockchain: Ethereum, ERC-2535 Diamond Proxy Pattern"
echo "Protocol: Proof-of-Contribution (PoCo)"
echo "Encryption: AES, TLS/SSL, Hardware attestation"
echo "Repositories: 188 total in organization"
echo "License: Apache License 2.0"
echo "Confidence: 0.95 (Multi-source verified)"
echo ""

echo "=== End of Reference ==="
