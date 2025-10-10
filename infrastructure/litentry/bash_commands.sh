#!/bin/bash
# Litentry Research - Bash Commands Reference
# Generated: 2025-10-08
# Purpose: Quick reference for research commands used

# Create deliverables directory
mkdir -p /home/flower/web3privacy-research/deliverables/litentry

# Verify deliverable files
ls -lah /home/flower/web3privacy-research/deliverables/litentry/

# View research result JSON
cat /home/flower/web3privacy-research/deliverables/litentry/research_result.json

# View research summary
cat /home/flower/web3privacy-research/deliverables/litentry/research_summary.md

# Check file sizes
du -h /home/flower/web3privacy-research/deliverables/litentry/research_result.json
du -h /home/flower/web3privacy-research/deliverables/litentry/research_summary.md

# Validate JSON format
python3 -m json.tool /home/flower/web3privacy-research/deliverables/litentry/research_result.json > /dev/null && echo "Valid JSON" || echo "Invalid JSON"

# Search for specific information in research files
grep -i "privacy" /home/flower/web3privacy-research/deliverables/litentry/research_summary.md
grep -i "TEE" /home/flower/web3privacy-research/deliverables/litentry/research_result.json
grep -i "github" /home/flower/web3privacy-research/deliverables/litentry/research_result.json

# Count lines in deliverables
wc -l /home/flower/web3privacy-research/deliverables/litentry/research_summary.md
wc -l /home/flower/web3privacy-research/deliverables/litentry/research_result.json

# View constitutional compliance section
grep -A 10 "constitutional_compliance" /home/flower/web3privacy-research/deliverables/litentry/research_result.json

# Extract GitHub URLs
grep -o "https://github.com/[^\"]*" /home/flower/web3privacy-research/deliverables/litentry/research_result.json

# Check confidence scores
grep "confidence" /home/flower/web3privacy-research/deliverables/litentry/research_result.json

# Note: All commands use absolute paths as per Claude Code best practices
# Research conducted in accordance with Web3Privacy Research Constitution v2.0.0
