#!/bin/bash
# Findora Research - Bash Commands Reference
# Date: 2025-10-07
# Purpose: Command reference for independent work or when Claude Code is down

###############################################################################
# DIRECTORY SETUP
###############################################################################

# Create research directory structure
mkdir -p /home/flower/web3privacy-research/deliverables/findora/sources
mkdir -p /home/flower/web3privacy-research/deliverables/findora/images
mkdir -p /home/flower/web3privacy-research/deliverables/findora/contracts

###############################################################################
# FILE VIEWING COMMANDS
###############################################################################

# View main verified data (formatted JSON)
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | jq '.'

# View executive summary
cat /home/flower/web3privacy-research/deliverables/findora/sources/RESEARCH_SUMMARY.md

# View research log
cat /home/flower/web3privacy-research/deliverables/findora/sources/research_log.md

# View constitutional compliance report
cat /home/flower/web3privacy-research/deliverables/findora/sources/CONSTITUTIONAL_COMPLIANCE.md

# View complete index
cat /home/flower/web3privacy-research/deliverables/findora/sources/INDEX.md

# List all research files
ls -lah /home/flower/web3privacy-research/deliverables/findora/sources/

###############################################################################
# DATA EXTRACTION COMMANDS
###############################################################################

# Extract Tier 1 data only
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '.tier_1_data'

# Extract data gaps list
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '.data_gaps_requiring_deeper_research'

# Extract all high-confidence data (0.9+)
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '[.tier_1_data, .tier_2_data, .tier_3_data] |
      to_entries[] |
      .value |
      to_entries[] |
      select(.value.confidence >= 0.9)'

# Count total sources
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '.research_methodology.unique_sources_consulted'

###############################################################################
# SEARCH COMMANDS
###############################################################################

# Search for specific data in JSON
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '.tier_1_data.website_url'

# Search for all gaps
grep -r "DATA_GAP" /home/flower/web3privacy-research/deliverables/findora/sources/

# Find all URLs cited
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '.. | .sources? | select(. != null) | .[]' | sort -u

###############################################################################
# VALIDATION COMMANDS
###############################################################################

# Check JSON validity
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | jq empty && \
  echo "✅ JSON is valid" || echo "❌ JSON is invalid"

# Count data points with high confidence
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '[.. | .confidence? | select(. != null and . >= 0.9)] | length'

# Count data gaps
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '.data_gaps_requiring_deeper_research | length'

# Check file sizes
du -h /home/flower/web3privacy-research/deliverables/findora/sources/*

# Count total lines of research
wc -l /home/flower/web3privacy-research/deliverables/findora/sources/*.{json,md} 2>/dev/null

###############################################################################
# EXPORT COMMANDS
###############################################################################

# Create backup of all research
tar -czf "/home/flower/web3privacy-research/deliverables/findora/findora_research_backup_$(date +%Y%m%d_%H%M%S).tar.gz" \
  /home/flower/web3privacy-research/deliverables/findora/sources/

# Export summary to plain text
cat /home/flower/web3privacy-research/deliverables/findora/sources/RESEARCH_SUMMARY.md | \
  sed 's/^#\+//' > /home/flower/web3privacy-research/deliverables/findora/summary.txt

# Export all URLs to file
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq -r '.. | .sources? | select(. != null) | .[]' | \
  sort -u > /home/flower/web3privacy-research/deliverables/findora/all_sources.txt

###############################################################################
# NEXT STEPS - GAP FILLING COMMANDS
###############################################################################

# Clone GitHub repos (if accessible)
cd /tmp
git clone https://github.com/FindoraNetwork/platform.git
git clone https://github.com/FindoraNetwork/findora-sdk.git
git clone https://github.com/FindoraNetwork/FIPs.git

# Search for contract addresses in cloned repos
find /tmp/platform -type f -name "*.rs" -o -name "*.toml" | \
  xargs grep -i "contract\|address" | head -20

# Search for team info in commits
cd /tmp/platform
git log --format='%an <%ae>' | sort -u | head -20

###############################################################################
# WEB RESEARCH COMMANDS (requires curl/wget)
###############################################################################

# Fetch Findora website (if online)
curl -L https://findora.org/ > /tmp/findora_website.html

# Check website status
curl -I https://findora.org/ 2>&1 | head -5

# Fetch documentation
curl -L https://wiki.dev.findora.org/docs/Introduction/intro/ > /tmp/findora_docs.html

# Check GitHub API for repo info
curl -s https://api.github.com/orgs/FindoraNetwork | jq '.'

# Get latest tweets (requires API key)
# curl -H "Authorization: Bearer YOUR_TOKEN" \
#   "https://api.twitter.com/2/users/by/username/findora" | jq '.'

###############################################################################
# CONSTITUTIONAL COMPLIANCE CHECKS
###############################################################################

# Verify no fabricated data (check for common placeholder words)
grep -i "lorem\|ipsum\|placeholder\|example\|todo\|tbd\|tba" \
  /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json && \
  echo "⚠️ Potential fabrication detected" || echo "✅ No fabrication detected"

# Count citations per data point
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '[.. | .sources? | select(. != null) | length] | add'

# Verify all data has confidence scores
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '[.. | .confidence? | select(. != null)] | length'

###############################################################################
# REPORTING COMMANDS
###############################################################################

# Generate quick stats
echo "=== FINDORA RESEARCH STATISTICS ==="
echo "Files created: $(find /home/flower/web3privacy-research/deliverables/findora/sources/ -type f | wc -l)"
echo "Total size: $(du -sh /home/flower/web3privacy-research/deliverables/findora/sources/ | cut -f1)"
echo "Total lines: $(wc -l /home/flower/web3privacy-research/deliverables/findora/sources/*.{json,md} 2>/dev/null | tail -1 | awk '{print $1}')"
echo "Data gaps: $(cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | jq '.data_gaps_requiring_deeper_research | length')"
echo "Unique sources: $(cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | jq '.research_methodology.unique_sources_consulted')"

# Create HTML report (requires pandoc)
# pandoc /home/flower/web3privacy-research/deliverables/findora/sources/RESEARCH_SUMMARY.md \
#   -o /home/flower/web3privacy-research/deliverables/findora/report.html

###############################################################################
# USAGE EXAMPLES
###############################################################################

# Example 1: View all high-priority gaps
echo "High-priority data gaps:"
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq -r '.data_gaps_requiring_deeper_research[] | select(.priority == "high") | .gap'

# Example 2: Export founder information (when available)
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '.tier_2_data.founders'

# Example 3: Check research date
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq -r '.research_date'

# Example 4: List all social media links
cat /home/flower/web3privacy-research/deliverables/findora/sources/verified_data.json | \
  jq '.tier_3_data.social_links'

###############################################################################
# CLEANUP COMMANDS
###############################################################################

# Remove temporary files
rm -rf /tmp/platform /tmp/findora-sdk /tmp/FIPs
rm -f /tmp/findora_*.html

# Archive old research (if updating)
# mv /home/flower/web3privacy-research/deliverables/findora/sources \
#   /home/flower/web3privacy-research/deliverables/findora/sources_archive_$(date +%Y%m%d)

###############################################################################
# NOTES
###############################################################################

# This file contains all commands used during Findora research
# Commands are organized by category for easy reference
# All paths are absolute as required by user instructions
# Some commands require additional tools (jq, pandoc, curl)

# To make this file executable:
# chmod +x /home/flower/web3privacy-research/deliverables/findora/BASH_COMMANDS.sh

# To run specific sections, use:
# bash /home/flower/web3privacy-research/deliverables/findora/BASH_COMMANDS.sh

###############################################################################
# END OF COMMANDS
###############################################################################
