#!/bin/bash
# Concordium Research - Bash Commands Reference
# Date: 2025-10-07
# Purpose: Reference commands for continuing Concordium data collection

# ============================================
# PHASE 1 COMPLETE - Files Created
# ============================================
# - verified_data.json (16KB) - All verified data with sources
# - research_gaps.json (6KB) - 8 identified gaps with priorities
# - research_summary.md (7KB) - Human-readable summary

# ============================================
# PHASE 2 - FILL DATA GAPS (Next Steps)
# ============================================

# --- Quick Win #1: Social Media Links (5 min) ---
# Use Chrome MCP to navigate and extract footer links
# Target: https://www.concordium.com/
# Extract: Twitter, Discord, Telegram, GitHub social links

# --- Quick Win #2: Logo URL (5 min) ---
# Option A: Screenshot logo from homepage
# Option B: Download from brand assets
# Option C: Get GitHub org avatar
curl -s https://api.github.com/orgs/Concordium | jq -r '.avatar_url'

# --- Quick Win #3: Token Data via CoinGecko API (5 min) ---
# Get CCD token metrics
curl -s "https://api.coingecko.com/api/v3/coins/concordium" | jq '.'

# Alternative: CoinMarketCap (requires API key)
# curl -H "X-CMC_PRO_API_KEY: YOUR_KEY" \
#   "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=CCD"

# --- Medium Priority: Blockchain Explorer ---
# Find Concordium's official block explorer
# Expected: CCDScan or similar
# Extract: Contract addresses, network stats, TPS

# Search for explorer URL
# Likely: https://ccdscan.io or similar

# --- Medium Priority: Technical Documentation ---
# Deep dive into consensus mechanism
# Target: https://docs.concordium.com/en/mainnet/docs/protocol/concordium-protocol.html
# Use Chrome MCP to navigate and extract:
# - Consensus algorithm details
# - Block time
# - Finality time
# - TPS specifications

# --- High Priority: Funding Data ---
# Option A: CrunchBase (requires account)
# URL: https://www.crunchbase.com/organization/concordium

# Option B: Manual web search
# Search terms: "Concordium funding round" "Concordium investors" "Concordium Series A"

# Option C: LinkedIn research
# Check Lars Seier Christensen's posts for funding announcements
# Check Blockchain Founders Group partnership details

# ============================================
# VERIFICATION COMMANDS
# ============================================

# Check file integrity
ls -lah /home/flower/web3privacy-research/deliverables/concordium/sources/

# Validate JSON files
jq '.' /home/flower/web3privacy-research/deliverables/concordium/sources/verified_data.json > /dev/null && echo "✅ verified_data.json is valid"
jq '.' /home/flower/web3privacy-research/deliverables/concordium/sources/research_gaps.json > /dev/null && echo "✅ research_gaps.json is valid"

# Count verified sources
jq '.research_metadata.verified_sources' /home/flower/web3privacy-research/deliverables/concordium/sources/verified_data.json

# Check completeness scores
jq '.research_metadata.completeness' /home/flower/web3privacy-research/deliverables/concordium/sources/verified_data.json

# List all data gaps
jq '.data_gaps_summary.critical_gaps[]' /home/flower/web3privacy-research/deliverables/concordium/sources/verified_data.json

# ============================================
# CONSTITUTIONAL COMPLIANCE CHECK
# ============================================

# Verify no fabrication
jq '.constitutional_compliance.real_data_only' /home/flower/web3privacy-research/deliverables/concordium/sources/verified_data.json

# Verify gaps reported
jq '.constitutional_compliance.fabrication_free' /home/flower/web3privacy-research/deliverables/concordium/sources/verified_data.json

# Check all tier 1 data has sources
jq '.tier_1_data | to_entries[] | {key: .key, has_sources: (.value.sources != null)}' \
  /home/flower/web3privacy-research/deliverables/concordium/sources/verified_data.json

# ============================================
# NEXT AGENT COORDINATION
# ============================================

# If using Claude Flow swarm for gap filling:
# npx claude-flow@alpha swarm init --topology mesh
# npx claude-flow@alpha agent spawn --type researcher --task "Fill CONC-003 social media gap"
# npx claude-flow@alpha agent spawn --type researcher --task "Fill CONC-008 token economics gap"

# Store research status in coordination memory:
# npx claude-flow@alpha hooks post-edit \
#   --file "verified_data.json" \
#   --memory-key "swarm/concordium/research-status"

# ============================================
# REMOTE EXECUTION (If needed on Seshat)
# ============================================

# SSH to Seshat for heavy data processing
# ssh -p8888 m0nkey-fl0wer@seshat.noosworx.com

# Copy research files to Seshat for processing
# scp -P8888 /home/flower/web3privacy-research/deliverables/concordium/sources/*.json \
#   m0nkey-fl0wer@seshat.noosworx.com:/path/to/sandisk/research/

# ============================================
# NOTES
# ============================================
# - All commands use absolute paths as required
# - JSON validation included for data integrity
# - Constitutional compliance v2.0.0 enforced
# - Phase 1 complete: 78% overall completeness
# - 8 gaps identified, prioritized, and actionable
# - Zero fabricated data - all gaps honestly reported
