#!/bin/bash

# Batch processing script for Web3Privacy projects
# Applies cake-wallet template methodology to remaining projects

DELIVERABLES="/home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables"
TEMPLATE_DIR="$DELIVERABLES/cake-wallet"

PROJECT="$1"
PROJECT_PATH="$DELIVERABLES/$PROJECT"

if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ Project not found: $PROJECT"
    exit 1
fi

echo "Processing: $PROJECT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check for github_analysis.json
if [ -f "$PROJECT_PATH/analysis/github_analysis.json" ]; then
    echo "✅ Found github_analysis.json"
else
    echo "⚠️  Missing github_analysis.json"
    exit 1
fi

# 2. Check what reports exist
echo ""
echo "Existing reports in /reports:"
if [ -d "$PROJECT_PATH/reports" ]; then
    ls -1 "$PROJECT_PATH/reports/"*.md 2>/dev/null | sed 's|.*/||' | sed 's/^/  ✓ /'
else
    echo "  (no reports directory)"
fi

# 3. Check for confidence language in public markdown
echo ""
echo "Checking for internal language in public files:"
if grep -r "Confidence\|Constitution\|Data Quality.*Tier" "$PROJECT_PATH/reports/" 2>/dev/null | head -3; then
    echo "  ⚠️  Found confidence language - will need cleaning"
else
    echo "  ✅ No confidence language found"
fi

# 4. Check verified_data.json exists
if [ -f "$PROJECT_PATH/sources/verified_data.json" ]; then
    echo "✅ Found verified_data.json (internal research)"
else
    echo "⚠️  Missing verified_data.json"
fi

# 5. Check what analysis files exist
echo ""
echo "Analysis files available:"
if [ -d "$PROJECT_PATH/analysis" ]; then
    ls -1 "$PROJECT_PATH/analysis/" | sed 's/^/  - /'
fi

# 6. Check smart_contracts.json for actual data
if [ -f "$PROJECT_PATH/analysis/smart_contracts.json" ]; then
    COUNT=$(jq '.contracts | length' "$PROJECT_PATH/analysis/smart_contracts.json" 2>/dev/null || echo 0)
    echo "  Smart contracts: $COUNT"
fi

echo ""
echo "STATUS: Ready for processing"
