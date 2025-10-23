#!/bin/bash
# ARPA Network Research - Bash Command Reference
# Generated: 2025-10-08
# Purpose: Quick reference for analyzing ARPA Network repositories and data

# =============================================================================
# REPOSITORY CLONING AND SETUP
# =============================================================================

# Clone main ARPA Network BLS-TSS repository
git clone https://github.com/ARPA-Network/BLS-TSS-Network.git /tmp/arpa-bls-tss
cd /tmp/arpa-bls-tss

# Clone standards repository
git clone https://github.com/ARPA-Network/BLS-TSS-Network-Standards.git /tmp/arpa-standards

# Clone MPC mainnet repository
git clone https://github.com/ARPA-Network/mpc-mainnet.git /tmp/arpa-mpc

# Clone Randcast user contracts
git clone https://github.com/ARPA-Network/Randcast-User-Contract.git /tmp/arpa-randcast

# =============================================================================
# CODE ANALYSIS
# =============================================================================

# Count lines of code by language in BLS-TSS-Network
cd /tmp/arpa-bls-tss
find . -name "*.rs" | xargs wc -l | tail -1    # Rust code
find . -name "*.sol" | xargs wc -l | tail -1   # Solidity code
find . -name "*.py" | xargs wc -l | tail -1    # Python code

# List all Rust crates
find . -name "Cargo.toml" -type f

# Analyze Rust dependencies
cat Cargo.toml | grep -A 20 "\[dependencies\]"

# Find threshold BLS implementation
find . -name "*.rs" -type f -exec grep -l "threshold.*bls\|bls.*threshold" {} \;

# Find DKG implementation
find . -name "*.rs" -type f -exec grep -l "dkg\|distributed.*key" {} \;

# =============================================================================
# SMART CONTRACT ANALYSIS
# =============================================================================

# List all Solidity contracts
find . -name "*.sol" -type f

# Find contract interfaces
grep -r "interface.*Controller\|interface.*Adapter\|interface.*Coordinator" . --include="*.sol"

# Find BLS signature verification in contracts
grep -r "verifyBLS\|BLSSignature\|threshold.*signature" . --include="*.sol"

# =============================================================================
# CRYPTOGRAPHY ANALYSIS
# =============================================================================

# Find BN254 curve implementations
grep -r "bn254\|BN254\|bn_254" . --include="*.rs" --include="*.sol"

# Find BLS12-381 curve implementations
grep -r "bls12.*381\|BLS12_381\|bls12_381" . --include="*.rs" --include="*.sol"

# Find elliptic curve operations
grep -r "pairing\|scalar.*mult\|point.*add" . --include="*.rs"

# Find DKG protocol implementation
grep -r "distributed.*key.*gen\|DKG.*process\|shamir.*secret" . --include="*.rs"

# =============================================================================
# DOCUMENTATION EXTRACTION
# =============================================================================

# Extract README content
cat README.md

# Find all markdown documentation
find . -name "*.md" -type f

# Extract API documentation from Rust code
grep -r "///" . --include="*.rs" | head -50

# Find configuration examples
find . -name "*.toml" -o -name "*.yaml" -o -name "*.json" | grep -v node_modules

# =============================================================================
# NETWORK ARCHITECTURE ANALYSIS
# =============================================================================

# Find node implementation
find . -path "*/arpa-node/*" -name "*.rs"

# Find coordinator implementation
grep -r "Coordinator" . --include="*.rs" --include="*.sol" | wc -l

# Find adapter implementation
grep -r "Adapter" . --include="*.rs" --include="*.sol" | wc -l

# Find controller implementation
grep -r "Controller" . --include="*.rs" --include="*.sol" | wc -l

# =============================================================================
# TESTING AND VALIDATION
# =============================================================================

# Find test files
find . -name "*test*.rs" -o -name "*test*.sol" -o -name "*test*.py"

# Count test coverage
find . -name "*test*.rs" | wc -l
find . -name "*test*.sol" | wc -l

# Find benchmark tests
grep -r "benchmark\|bench_" . --include="*.rs"

# =============================================================================
# DEPLOYMENT ANALYSIS
# =============================================================================

# Find deployment scripts
find . -name "*deploy*" -o -name "*migration*"

# Find network configurations
find . -name "*config*.json" -o -name "*config*.toml"

# Find supported blockchain configurations
grep -r "ethereum\|optimism\|base\|bnb\|taiko" . --include="*.json" --include="*.toml"

# =============================================================================
# DEPENDENCY ANALYSIS
# =============================================================================

# List all Rust dependencies
find . -name "Cargo.toml" -exec cat {} \; | grep -A 100 "\[dependencies\]"

# List all Node.js dependencies (if any)
find . -name "package.json" -exec cat {} \;

# Find external cryptography libraries
grep -r "use.*threshold\|use.*bls\|use.*curve" . --include="*.rs" | head -20

# =============================================================================
# GITHUB METADATA EXTRACTION
# =============================================================================

# Get repository statistics (requires GitHub CLI)
cd /tmp/arpa-bls-tss
gh repo view ARPA-Network/BLS-TSS-Network --json name,description,stargazerCount,forkCount,languages

# Get recent commits
git log --oneline -10

# Get contributor count
git shortlog -sn | wc -l

# Get repository size
du -sh .

# =============================================================================
# RANDCAST SPECIFIC ANALYSIS
# =============================================================================

# Find Randcast adapter implementation
find . -name "*Randcast*" -o -name "*randcast*"

# Find VRF implementation
grep -r "VRF\|verifiable.*random\|random.*number" . --include="*.rs" --include="*.sol"

# Find randomness generation logic
grep -r "generate.*random\|randomness.*gen\|threshold.*random" . --include="*.rs"

# =============================================================================
# EIGENLAYER INTEGRATION ANALYSIS
# =============================================================================

# Find EigenLayer references
grep -r "eigenlayer\|EigenLayer\|AVS\|restaking" . --include="*.rs" --include="*.sol" --include="*.md"

# Find staking contract references
grep -r "stake\|staker\|operator" . --include="*.sol"

# =============================================================================
# DATA EXTRACTION FOR RESEARCH
# =============================================================================

# Create summary of tech stack
echo "=== ARPA Network Tech Stack Summary ===" > /tmp/arpa-tech-stack.txt
echo "Rust Files:" >> /tmp/arpa-tech-stack.txt
find /tmp/arpa-bls-tss -name "*.rs" | wc -l >> /tmp/arpa-tech-stack.txt
echo "Solidity Files:" >> /tmp/arpa-tech-stack.txt
find /tmp/arpa-bls-tss -name "*.sol" | wc -l >> /tmp/arpa-tech-stack.txt
echo "Python Files:" >> /tmp/arpa-tech-stack.txt
find /tmp/arpa-bls-tss -name "*.py" | wc -l >> /tmp/arpa-tech-stack.txt

# Extract all crate names
echo "=== Rust Crates ===" >> /tmp/arpa-tech-stack.txt
find /tmp/arpa-bls-tss -name "Cargo.toml" -exec grep "^name =" {} \; >> /tmp/arpa-tech-stack.txt

# View the summary
cat /tmp/arpa-tech-stack.txt

# =============================================================================
# VERIFY RESEARCH DATA
# =============================================================================

# Verify GitHub URL is accessible
curl -s -o /dev/null -w "%{http_code}" https://github.com/ARPA-Network/BLS-TSS-Network

# Check if repository is active (recent commits)
cd /tmp/arpa-bls-tss
git log --since="6 months ago" --oneline | wc -l

# Verify main language percentages
cd /tmp/arpa-bls-tss
cloc . --json 2>/dev/null || echo "Install cloc for detailed stats: sudo apt install cloc"

# =============================================================================
# CLEANUP
# =============================================================================

# Remove cloned repositories (optional)
# rm -rf /tmp/arpa-bls-tss /tmp/arpa-standards /tmp/arpa-mpc /tmp/arpa-randcast

# =============================================================================
# NOTES
# =============================================================================
#
# This script provides commands for analyzing ARPA Network repositories.
# Commands are organized by analysis category for easy reference.
#
# Prerequisites:
# - git
# - gh (GitHub CLI) - optional for enhanced metadata
# - cloc - optional for detailed code statistics
#
# Usage:
# - Run individual commands as needed
# - Modify paths if cloning to different locations
# - Some commands require the repository to be cloned first
#
# =============================================================================
