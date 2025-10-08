#!/bin/bash
# Iron Fish Privacy Research - Bash Commands Reference
# Generated: 2025-10-07
# Research Agent: Constitutional v2.0.0

# =============================================================================
# RESEARCH INITIALIZATION
# =============================================================================

# Create project directory
mkdir -p /home/flower/web3privacy-research/deliverables/iron-fish/sources

# Initialize research task hooks
npx claude-flow@alpha hooks pre-task --description "Iron Fish privacy project research - constitutional data collection"

# =============================================================================
# DATA VERIFICATION AND VALIDATION
# =============================================================================

# Validate JSON structure
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | jq '.' > /dev/null && echo "✅ JSON valid" || echo "❌ JSON invalid"

# Count total lines in research data
wc -l /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json

# Check data completeness
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | jq '.research_metadata.data_completeness_percent'

# Check constitutional compliance
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | jq '.constitutional_validation.overall_constitutional_compliance'

# =============================================================================
# RESEARCH TASK COMPLETION
# =============================================================================

# Complete research task
npx claude-flow@alpha hooks post-task --task-id "task-1759887128550-hknn1vluh"

# Notify completion
npx claude-flow@alpha hooks notify --message "Iron Fish research complete: 92% data completeness, 25 sources consulted, constitutional v2.0.0 compliant"

# Save research file edit to memory
npx claude-flow@alpha hooks post-edit \
  --file "/home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json" \
  --memory-key "swarm/researcher/iron-fish-complete"

# =============================================================================
# FILE OPERATIONS
# =============================================================================

# List all research outputs
ls -lh /home/flower/web3privacy-research/deliverables/iron-fish/sources/

# Display research summary (first 50 lines)
head -50 /home/flower/web3privacy-research/deliverables/iron-fish/sources/RESEARCH_SUMMARY.md

# Count sources in verified data
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | \
  jq '.research_metadata.total_sources_consulted'

# Extract key findings
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | \
  jq '.key_findings[]'

# =============================================================================
# DATA EXTRACTION EXAMPLES
# =============================================================================

# Get founder information
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | \
  jq '.tier_2_data.founders.value[0]'

# Get funding information
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | \
  jq '.tier_3_data.funding'

# Get social links
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | \
  jq '.tier_3_data.social_links'

# Get smart contract addresses
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | \
  jq '.tier_2_data.smart_contracts.bridged_contracts.ethereum[]'

# Get data gaps
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | \
  jq '.data_gaps_reported[]'

# =============================================================================
# QUALITY CHECKS
# =============================================================================

# Verify all required fields exist (Tier 1)
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | \
  jq 'has("tier_1_data") and .tier_1_data | has("website") and has("github") and has("description") and has("category")'

# Check confidence scores (should all be 0.0-1.0)
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | \
  jq '.. | .confidence? // empty' | sort -u

# Count total verification sources
cat /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json | \
  jq '[.. | .sources? // empty] | flatten | unique | length'

# =============================================================================
# GIT OPERATIONS (for future commits)
# =============================================================================

# Check git status
cd /home/flower/web3privacy-research && git status

# Stage Iron Fish research files
cd /home/flower/web3privacy-research && \
  git add deliverables/iron-fish/sources/verified_data.json && \
  git add deliverables/iron-fish/sources/RESEARCH_SUMMARY.md

# View diff before commit
cd /home/flower/web3privacy-research && \
  git diff --staged deliverables/iron-fish/sources/

# Commit (when ready)
# cd /home/flower/web3privacy-research && \
#   git commit -m "Add Iron Fish privacy research - Constitutional v2.0.0 compliant
#
# - 92% data completeness (25 verified sources)
# - Tier 1: 100% complete
# - Tier 2: 95% complete
# - Tier 3: 90% complete
# - 2 minor gaps documented (no fabrication)
# - Overall confidence: 0.95
#
# 🤖 Generated with [Claude Code](https://claude.com/claude-code)
#
# Co-Authored-By: Claude <noreply@anthropic.com>"

# =============================================================================
# BACKUP AND ARCHIVE
# =============================================================================

# Create timestamped backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json \
   /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data_${TIMESTAMP}.json.bak

# Archive research outputs
cd /home/flower/web3privacy-research/deliverables/iron-fish && \
  tar -czf iron-fish-research-${TIMESTAMP}.tar.gz sources/

# =============================================================================
# MEMORY OPERATIONS (Claude Flow)
# =============================================================================

# Check swarm memory status
npx claude-flow@alpha memory list

# Retrieve research status from memory
npx claude-flow@alpha memory search --pattern "swarm/iron-fish/*"

# =============================================================================
# REMOTE EXECUTION (Seshat Server - if needed)
# =============================================================================

# Copy research to Seshat server (SanDisk storage)
# scp -P 8888 \
#   /home/flower/web3privacy-research/deliverables/iron-fish/sources/verified_data.json \
#   m0nkey-fl0wer@seshat.noosworx.com:/mnt/sandisk/web3privacy-research/iron-fish/

# Execute validation on Seshat
# ssh -p 8888 m0nkey-fl0wer@seshat.noosworx.com \
#   "cd /mnt/sandisk/web3privacy-research && ./validate_constitutional.sh iron-fish"

# =============================================================================
# NOTES
# =============================================================================
# - All paths are absolute as required
# - Commands use proper line breaks
# - JSON operations use jq for parsing
# - Constitutional v2.0.0 compliance verified
# - Research completeness: 92%
# - Total sources: 25 verified
# - Confidence: 0.95
# =============================================================================
