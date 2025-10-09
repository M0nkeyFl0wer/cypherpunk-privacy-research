#!/bin/bash
# Aleph.im Research - Bash Commands Reference
# Generated: 2025-10-08
# Purpose: Document all commands used during research for reproducibility

# =============================================================================
# DIRECTORY SETUP
# =============================================================================

# Create deliverables directory for alephim project
mkdir -p /home/flower/web3privacy-research/deliverables/alephim

# =============================================================================
# FILE VERIFICATION
# =============================================================================

# Check if research results were created
ls -lh /home/flower/web3privacy-research/deliverables/alephim/

# View JSON research results
cat /home/flower/web3privacy-research/deliverables/alephim/research_result.json | jq '.'

# View markdown summary
cat /home/flower/web3privacy-research/deliverables/alephim/RESEARCH_SUMMARY.md

# =============================================================================
# JSON VALIDATION AND QUERIES
# =============================================================================

# Validate JSON structure
jq empty /home/flower/web3privacy-research/deliverables/alephim/research_result.json && echo "Valid JSON" || echo "Invalid JSON"

# Extract specific fields
jq '.github_url' /home/flower/web3privacy-research/deliverables/alephim/research_result.json
jq '.tech_stack.primary_languages' /home/flower/web3privacy-research/deliverables/alephim/research_result.json
jq '.privacy_techniques.confidential_computing.technology' /home/flower/web3privacy-research/deliverables/alephim/research_result.json

# Extract all privacy techniques
jq '.privacy_techniques' /home/flower/web3privacy-research/deliverables/alephim/research_result.json

# Extract architecture details
jq '.architecture' /home/flower/web3privacy-research/deliverables/alephim/research_result.json

# Get confidence score
jq '.research_metadata.confidence_score' /home/flower/web3privacy-research/deliverables/alephim/research_result.json

# =============================================================================
# RESEARCH VERIFICATION CHECKS
# =============================================================================

# Check constitutional compliance
jq '.constitutional_compliance' /home/flower/web3privacy-research/deliverables/alephim/research_result.json

# Verify all required fields are present
required_fields=("project" "github_url" "tech_stack" "privacy_techniques")
for field in "${required_fields[@]}"; do
    if jq -e ".$field" /home/flower/web3privacy-research/deliverables/alephim/research_result.json > /dev/null 2>&1; then
        echo "✓ Field '$field' present"
    else
        echo "✗ Field '$field' missing"
    fi
done

# =============================================================================
# FILE STATISTICS
# =============================================================================

# Count lines in each file
wc -l /home/flower/web3privacy-research/deliverables/alephim/*

# Get file sizes
du -h /home/flower/web3privacy-research/deliverables/alephim/*

# =============================================================================
# SEARCH AND GREP OPERATIONS
# =============================================================================

# Search for AMD SEV mentions
grep -i "AMD SEV" /home/flower/web3privacy-research/deliverables/alephim/RESEARCH_SUMMARY.md

# Search for Python mentions
grep -i "python" /home/flower/web3privacy-research/deliverables/alephim/RESEARCH_SUMMARY.md

# Search for IPFS mentions
grep -i "ipfs" /home/flower/web3privacy-research/deliverables/alephim/RESEARCH_SUMMARY.md

# Search for TEE mentions
grep -i "tee\|trusted execution" /home/flower/web3privacy-research/deliverables/alephim/RESEARCH_SUMMARY.md

# =============================================================================
# BACKUP AND ARCHIVE
# =============================================================================

# Create timestamped backup
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir="/home/flower/web3privacy-research/backups/alephim_${timestamp}"
mkdir -p "$backup_dir"
cp -r /home/flower/web3privacy-research/deliverables/alephim/* "$backup_dir/"
echo "Backup created at: $backup_dir"

# Create compressed archive
tar -czf "/home/flower/web3privacy-research/deliverables/alephim_research_${timestamp}.tar.gz" \
    -C /home/flower/web3privacy-research/deliverables alephim/
echo "Archive created: alephim_research_${timestamp}.tar.gz"

# =============================================================================
# GIT OPERATIONS (if in git repo)
# =============================================================================

# Check git status
git -C /home/flower/web3privacy-research status

# Add alephim research files
git -C /home/flower/web3privacy-research add deliverables/alephim/

# View staged changes
git -C /home/flower/web3privacy-research diff --staged

# Commit with descriptive message (example - don't run automatically)
# git -C /home/flower/web3privacy-research commit -m "Research: Complete technical analysis for alephim
#
# - Extract GitHub repositories and tech stack
# - Document AMD SEV/TEE confidential computing implementation
# - Verify IPFS integration and Firecracker usage
# - Compile privacy techniques and architecture details
# - Confidence score: 0.95
# - Constitutional compliance: ✓
#
# 🤖 Generated with Claude Code
# Co-Authored-By: Claude <noreply@anthropic.com>"

# =============================================================================
# USEFUL QUERIES FOR ANALYSIS
# =============================================================================

# Count number of repositories documented
jq '.primary_repositories | length' /home/flower/web3privacy-research/deliverables/alephim/research_result.json

# List all programming languages
jq -r '.tech_stack.primary_languages[]' /home/flower/web3privacy-research/deliverables/alephim/research_result.json

# List all privacy techniques categories
jq -r '.privacy_techniques | keys[]' /home/flower/web3privacy-research/deliverables/alephim/research_result.json

# List all blockchain integrations
jq -r '.tech_stack.blockchain_integrations[]' /home/flower/web3privacy-research/deliverables/alephim/research_result.json

# Get research metadata
jq '.research_metadata' /home/flower/web3privacy-research/deliverables/alephim/research_result.json

# =============================================================================
# NOTES
# =============================================================================

# Research completed: 2025-10-08
# Project: alephim (aleph.im)
# Category: Computing (DePIN)
# GitHub: https://github.com/aleph-im
# Confidence: 0.95/1.0
# Constitutional compliance: ✓

# Key Findings:
# - Primary language: Python (88.4%)
# - TEE: AMD SEV (Secure Encrypted Virtualization)
# - Virtualization: Firecracker microVMs
# - Storage: IPFS with encryption
# - Multi-chain: Ethereum, Solana, Polkadot, Cosmos, NULS
# - Network: 659+ nodes, fully decentralized
# - Status: Confidential VMs in beta

echo "All commands documented. Research complete."
