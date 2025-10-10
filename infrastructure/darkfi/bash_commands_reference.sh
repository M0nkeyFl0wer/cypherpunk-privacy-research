#!/bin/bash
# DarkFi Research - Bash Commands Reference
# Date: 2025-10-07
# Purpose: All commands used during research for future reference

# ============================================
# DIRECTORY SETUP
# ============================================

# Create deliverables directory structure
mkdir -p /home/flower/web3privacy-research/deliverables/darkfi/sources

# ============================================
# GITHUB API RESEARCH
# ============================================

# Fetch repository metadata
curl -s "https://api.github.com/repos/darkrenaissance/darkfi" | \
  jq '{name, description, html_url, homepage, language, stargazers_count, forks_count, created_at, updated_at, topics}'

# Fetch README content
curl -s "https://raw.githubusercontent.com/darkrenaissance/darkfi/master/README.md" | head -100

# Fetch top contributors
curl -s "https://api.github.com/repos/darkrenaissance/darkfi/contributors" | \
  jq '[.[] | {login, contributions, html_url}] | .[0:10]'

# Fetch README base64 decoded
curl -s "https://api.github.com/repos/darkrenaissance/darkfi/readme" | \
  jq -r '.content' | base64 -d | head -100

# ============================================
# WEB3PRIVACY REPOSITORY SEARCH
# ============================================

# Search for DarkFi data files
curl -s "https://raw.githubusercontent.com/web3privacy/web3privacy/main/src/projects/darkfi.md"

# List projects directory
curl -s "https://api.github.com/repos/web3privacy/web3privacy/contents/src/projects" | \
  jq '.[] | select(.name | contains("darkfi")) | .name'

# ============================================
# WEBSITE LINK EXTRACTION
# ============================================

# Extract social media links from official website
curl -s "https://dark.fi/" | \
  grep -oP '(https?://[^\s<>"]+)' | \
  grep -E '(twitter|discord|telegram|github|codeberg)' | \
  sort -u

# Extract links from documentation
curl -s "https://darkrenaissance.github.io/darkfi/" | \
  grep -oP '(https?://[^\s<>"]+)' | \
  grep -E '(twitter|discord|telegram|github)' | \
  head -20

# Extract community links from README
curl -s "https://raw.githubusercontent.com/darkrenaissance/darkfi/master/README.md" | \
  grep -i "community\|chat\|irc\|discord\|telegram" -A 3 | \
  head -30

# Decode and extract links from GitHub README
curl -s "https://api.github.com/repos/darkrenaissance/darkfi/readme" | \
  jq -r '.content' | base64 -d | \
  grep -oP '(https?://[^\s\)]+)' | \
  grep -E '(twitter|discord|telegram|irc|dark\.fi)' | \
  sort -u

# ============================================
# DOCUMENTATION STRUCTURE
# ============================================

# Fetch documentation table of contents
curl -s "https://raw.githubusercontent.com/darkrenaissance/darkfi/master/doc/src/SUMMARY.md" | \
  head -50

# ============================================
# TOKEN/MARKET DATA RESEARCH
# ============================================

# Search CoinGecko for DarkFi token
curl -s "https://api.coingecko.com/api/v3/search?query=darkfi" | \
  jq '.coins[] | select(.name | contains("DarkFi")) | {id, symbol, name, market_cap_rank}'

# ============================================
# FILE VERIFICATION
# ============================================

# Verify created files
ls -lh /home/flower/web3privacy-research/deliverables/darkfi/sources/

# Check JSON validity
jq '.' /home/flower/web3privacy-research/deliverables/darkfi/sources/verified_data.json

# View research summary
cat /home/flower/web3privacy-research/deliverables/darkfi/sources/research_summary.md

# View compliance report
cat /home/flower/web3privacy-research/deliverables/darkfi/sources/constitutional_compliance.md

# ============================================
# USEFUL JQ QUERIES FOR JSON DATA
# ============================================

# Extract all sources
jq '.research_metadata.sources_consulted' \
  /home/flower/web3privacy-research/deliverables/darkfi/sources/verified_data.json

# Extract gaps
jq '.research_metadata.gaps_identified' \
  /home/flower/web3privacy-research/deliverables/darkfi/sources/verified_data.json

# Extract GitHub stats
jq '.tier_1_core_data.github.stats' \
  /home/flower/web3privacy-research/deliverables/darkfi/sources/verified_data.json

# Extract founders
jq '.tier_2_extended_data.founders' \
  /home/flower/web3privacy-research/deliverables/darkfi/sources/verified_data.json

# Extract top contributors
jq '.tier_3_comprehensive_data.team.top_contributors_github' \
  /home/flower/web3privacy-research/deliverables/darkfi/sources/verified_data.json

# Check constitutional compliance
jq '.constitutional_compliance' \
  /home/flower/web3privacy-research/deliverables/darkfi/sources/verified_data.json

# ============================================
# DATA VALIDATION
# ============================================

# Count total data points
jq 'paths(scalars) | length' \
  /home/flower/web3privacy-research/deliverables/darkfi/sources/verified_data.json

# Find all confidence scores
jq '.. | select(type == "number" and . >= 0 and . <= 1) | select(. != 0 and . != 1)' \
  /home/flower/web3privacy-research/deliverables/darkfi/sources/verified_data.json

# Extract all URLs for verification
jq '.. | select(type == "string" and startswith("http"))' \
  /home/flower/web3privacy-research/deliverables/darkfi/sources/verified_data.json | \
  sort -u

# ============================================
# RESEARCH AUTOMATION (FUTURE USE)
# ============================================

# Clone DarkFi repository for local analysis
# git clone https://github.com/darkrenaissance/darkfi.git /tmp/darkfi-research
# cd /tmp/darkfi-research

# Count contributors
# git shortlog -sn --all | wc -l

# Find all Rust files
# find . -name "*.rs" | wc -l

# Search for contract implementations
# grep -r "contract" --include="*.rs" | head -20

# ============================================
# NOTES
# ============================================

# This script documents all bash commands used during the DarkFi research mission
# It serves as a reference for:
# 1. Reproducing the research process
# 2. Verifying data sources
# 3. Future research automation
# 4. Learning and knowledge transfer

# All commands are tested and verified as of 2025-10-07

echo "DarkFi Research - Bash Commands Reference"
echo "All commands documented for future use"
echo "File location: /home/flower/web3privacy-research/deliverables/darkfi/bash_commands_reference.sh"
