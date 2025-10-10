#!/bin/bash
# Tornado Cash Research - Bash Commands Reference
# Generated: 2025-10-07
# Purpose: Step-by-step commands for managing Tornado Cash research deliverables

# =============================================================================
# DIRECTORY SETUP
# =============================================================================

# Create complete directory structure
mkdir -p /home/flower/web3privacy-research/deliverables/tornado-cash/media

# Verify directory creation
ls -la /home/flower/web3privacy-research/deliverables/tornado-cash/

# =============================================================================
# FILE VERIFICATION
# =============================================================================

# List all research files
ls -lh /home/flower/web3privacy-research/deliverables/tornado-cash/

# Check JSON data structure
cat /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json | jq '.' | head -50

# Validate JSON syntax
jq empty /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json && echo "JSON is valid" || echo "JSON has errors"

# Count lines in each file
wc -l /home/flower/web3privacy-research/deliverables/tornado-cash/*.md
wc -l /home/flower/web3privacy-research/deliverables/tornado-cash/*.json

# =============================================================================
# MEDIA DOWNLOADS (MANUAL - REQUIRES BROWSER)
# =============================================================================

# LOGO DOWNLOADS
# Visit these URLs in browser and download manually:

# 1. CryptoLogos.cc (PNG + SVG)
echo "Visit: https://cryptologos.cc/torn"
echo "Click download, save to: /home/flower/web3privacy-research/deliverables/tornado-cash/media/logo.png"
echo "Click SVG download, save to: /home/flower/web3privacy-research/deliverables/tornado-cash/media/logo.svg"

# 2. Logotyp.us (SVG vector)
echo "Visit: https://logotyp.us/logo/tornado-cash/"
echo "Download SVG (vector format)"

# 3. CDNLogo.com (Multiple formats)
echo "Visit: https://cdnlogo.com/logo/tornado-cash_27691.html"
echo "Download PNG, SVG, EPS, or AI format"

# FOUNDER PHOTOS - Roman Storm
echo ""
echo "=== Roman Storm Photos ==="
echo "1. CoinDesk trial coverage: https://www.coindesk.com/policy/2025/07/14/right-to-code-tornado-cash-dev-roman-storm-s-money-laundering-trial-kicks-off-monday"
echo "2. CoinDesk verdict: https://www.coindesk.com/policy/2025/08/06/roman-storm-guilty-of-unlicensed-money-transmitting-conspiracy-in-partial-verdict"
echo "3. Twitter/X: https://x.com/rstormsf"
echo "Save to: /home/flower/web3privacy-research/deliverables/tornado-cash/media/roman-storm.jpg"

# FOUNDER PHOTOS - Alexey Pertsev
echo ""
echo "=== Alexey Pertsev Photos ==="
echo "1. DLNews coverage: https://www.dlnews.com/articles/regulation/tornado-cash-dev-alexey-pertsev-guilty-of-money-laundering/"
echo "2. CoinDesk guilty verdict: https://www.coindesk.com/policy/2024/05/14/tornado-cash-developer-alexey-pertsev-found-guilty-of-money-laundering"
echo "3. Hacker News: https://thehackernews.com/2024/05/dutch-court-sentences-tornado-cash-co.html"
echo "Save to: /home/flower/web3privacy-research/deliverables/tornado-cash/media/alexey-pertsev.jpg"

# FOUNDER PHOTOS - Roman Semenov (Limited Availability)
echo ""
echo "=== Roman Semenov Photos ==="
echo "1. Chainalysis blog: https://www.chainalysis.com/blog/ofac-sanctions-roman-semenov-tornado-cash/"
echo "2. Treasury press release: https://home.treasury.gov/news/press-releases/jy1702"
echo "3. Search LinkedIn: 'Roman Semenov Tornado Cash'"
echo "Save to: /home/flower/web3privacy-research/deliverables/tornado-cash/media/roman-semenov.jpg"

# =============================================================================
# IMAGE VERIFICATION (AFTER MANUAL DOWNLOAD)
# =============================================================================

# Check if images exist
ls -lh /home/flower/web3privacy-research/deliverables/tornado-cash/media/

# Verify image properties (requires imagemagick)
# Install if needed: sudo apt-get install imagemagick
identify /home/flower/web3privacy-research/deliverables/tornado-cash/media/*.png
identify /home/flower/web3privacy-research/deliverables/tornado-cash/media/*.jpg
identify /home/flower/web3privacy-research/deliverables/tornado-cash/media/*.svg

# Check file types
file /home/flower/web3privacy-research/deliverables/tornado-cash/media/*

# Verify minimum resolution (800x600 recommended)
identify -format "%f: %wx%h\n" /home/flower/web3privacy-research/deliverables/tornado-cash/media/*.jpg
identify -format "%f: %wx%h\n" /home/flower/web3privacy-research/deliverables/tornado-cash/media/*.png

# =============================================================================
# DATA ANALYSIS
# =============================================================================

# Extract specific JSON fields
jq '.overview' /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json
jq '.founders' /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json
jq '.timeline' /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json
jq '.key_statistics' /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json

# Count data sources
jq '.data_sources | length' /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json

# List all identified data gaps
jq '.data_gaps' /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json

# Get confidence score
jq '.confidence_score' /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json

# =============================================================================
# CONSTITUTIONAL COMPLIANCE CHECK
# =============================================================================

# Verify no synthetic data markers (should return empty)
grep -i "placeholder\|TODO\|FIXME\|sample\|example\|fake" /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json && echo "WARNING: Possible synthetic data found" || echo "✅ No synthetic data markers detected"

# Verify all sources cited
jq '.data_sources[] | select(length > 0)' /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json | wc -l

# Check data gaps are documented
jq '.data_gaps | length' /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json

# =============================================================================
# GIT OPERATIONS
# =============================================================================

# Check git status
cd /home/flower/web3privacy-research
git status

# Add tornado-cash research to git (when ready)
git add deliverables/tornado-cash/

# View changes
git diff --cached deliverables/tornado-cash/

# Commit with constitutional compliance note
# git commit -m "Add comprehensive Tornado Cash research

# - Complete technical analysis (zk-SNARKs, Merkle trees)
# - All three founders documented with legal status
# - Full legal timeline (sanctions, trials, verdicts)
# - 9+ verified data sources
# - Constitutional compliance: Real data only, gaps documented
# - Confidence score: 0.95 (95%)

# DELIVERABLES:
# - tornado-cash-research.json (structured data)
# - TORNADO_CASH_SUMMARY.md (public README)
# - MEDIA_DOWNLOAD_GUIDE.md (asset instructions)
# - COMMANDS_REFERENCE.sh (this file)

# GAPS (logged):
# - Founder photos require manual browser download
# - See MEDIA_DOWNLOAD_GUIDE.md for instructions

# Constitutional compliance: v2.0.0 ✅"

# =============================================================================
# BACKUP & EXPORT
# =============================================================================

# Create backup of research
tar -czf tornado-cash-research-backup-$(date +%Y%m%d).tar.gz \
  /home/flower/web3privacy-research/deliverables/tornado-cash/

# Copy to external storage (adjust path as needed)
# cp tornado-cash-research-backup-*.tar.gz /path/to/backup/location/

# Export JSON for external use
cp /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json \
   /home/flower/web3privacy-research/deliverables/tornado-cash-$(date +%Y%m%d).json

# =============================================================================
# SEARCH & GREP COMMANDS
# =============================================================================

# Search for specific terms in JSON
jq '. | select(.project_name == "Tornado Cash")' /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json

# Find all URLs in research
jq '.. | .sources? // empty | .[]' /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json

# Search markdown files for specific topics
grep -r "zk-SNARK" /home/flower/web3privacy-research/deliverables/tornado-cash/*.md
grep -r "Roman Storm" /home/flower/web3privacy-research/deliverables/tornado-cash/*.md
grep -r "OFAC" /home/flower/web3privacy-research/deliverables/tornado-cash/*.md

# Count total links documented
grep -o "https://[^\"]*" /home/flower/web3privacy-research/deliverables/tornado-cash/tornado-cash-research.json | wc -l

# =============================================================================
# VALIDATION & QUALITY CHECKS
# =============================================================================

# Check for broken markdown links (requires npm package markdown-link-check)
# npm install -g markdown-link-check
# markdown-link-check /home/flower/web3privacy-research/deliverables/tornado-cash/TORNADO_CASH_SUMMARY.md
# markdown-link-check /home/flower/web3privacy-research/deliverables/tornado-cash/MEDIA_DOWNLOAD_GUIDE.md

# Spell check markdown files (requires aspell)
# aspell -c /home/flower/web3privacy-research/deliverables/tornado-cash/TORNADO_CASH_SUMMARY.md

# Word count for all markdown
wc -w /home/flower/web3privacy-research/deliverables/tornado-cash/*.md

# =============================================================================
# LEARNING NOTES
# =============================================================================

# DIRECTORY STRUCTURE:
# - Always organize research in dedicated subdirectories
# - Use media/ subdirectory for images and assets
# - Keep markdown files separate from structured data (JSON)

# JSON VALIDATION:
# - Use 'jq' to validate and pretty-print JSON
# - 'jq empty file.json' checks syntax without output
# - 'jq . file.json' formats and displays entire file

# CONSTITUTIONAL COMPLIANCE:
# - Document ALL data gaps explicitly
# - Never fabricate data to fill gaps
# - Always cite sources with URLs
# - Use confidence scores for data quality

# FILE ORGANIZATION:
# - JSON for structured, machine-readable data
# - Markdown for human-readable summaries
# - Shell scripts for reproducible commands
# - Separate guide for manual tasks (browser downloads)

# =============================================================================
# FUTURE REFERENCE
# =============================================================================

# This file demonstrates:
# 1. Systematic directory creation
# 2. JSON validation and querying with jq
# 3. Constitutional compliance verification
# 4. Manual vs automated task separation
# 5. Git workflow for research projects
# 6. Backup and archival procedures

# Key Tools Used:
# - mkdir -p (create nested directories)
# - ls -lh (list files with human-readable sizes)
# - jq (JSON processor)
# - grep (text search)
# - wc (word/line count)
# - tar (archival)
# - git (version control)

echo ""
echo "=== Tornado Cash Research Commands Reference ==="
echo "All commands documented for reproducibility"
echo "Execute commands step-by-step as needed"
echo ""
