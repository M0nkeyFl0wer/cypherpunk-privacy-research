#!/bin/bash

# Comprehensive project processing script
# Applies cake-wallet methodology to a single project

DELIVERABLES="/home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables"
PROJECT="$1"
PROJECT_PATH="$DELIVERABLES/$PROJECT"

if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ Project not found: $PROJECT"
    exit 1
fi

echo "📦 Processing: $PROJECT"

# Step 1: Clean Constitution/Compliance language from public markdown
echo "  Step 1: Cleaning internal language..."
if [ -d "$PROJECT_PATH/reports" ]; then
    for file in "$PROJECT_PATH/reports"/*.md; do
        [ -f "$file" ] || continue
        
        # Remove Constitution headers
        sed -i '/Constitution v2\.0\.0 Compliance/d' "$file"
        sed -i '/Constitutional Compliance:/d' "$file"
        sed -i '/Constitutional Notice:/d' "$file"
        sed -i '/Constitution:/d' "$file"
        
        # Remove Data Quality tier lines
        sed -i '/Data Quality.*Tier/d' "$file"
        
        # Remove confidence header lines (but keep them in research_metadata context if needed)
        sed -i '/^\*\*Confidence\*\*: 0\.[0-9]/d' "$file"
        sed -i '/Confidence Level: High/d' "$file"
        
        # Remove empty lines created by deletions
        sed -i '/^[[:space:]]*$/N;/^\n$/!P;D' "$file"
    done
    echo "    ✓ Cleaned Constitution language"
fi

# Step 2: Generate CODE_REVIEW.md from github_analysis.json
echo "  Step 2: Generating CODE_REVIEW.md..."
python3 /tmp/generate_code_review.py "$PROJECT_PATH" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "    ✓ CODE_REVIEW.md created"
else
    echo "    ⚠️  Could not generate CODE_REVIEW.md"
fi

# Step 3: Get list of existing report files
echo "  Step 3: Identifying existing reports..."
EXISTING_REPORTS=""
if [ -d "$PROJECT_PATH/reports" ]; then
    for file in "$PROJECT_PATH/reports"/*.md; do
        [ -f "$file" ] || continue
        FILENAME=$(basename "$file")
        EXISTING_REPORTS="$EXISTING_REPORTS $FILENAME"
    done
fi

echo "    ✓ Found reports: $(echo $EXISTING_REPORTS | tr '\n' ', ')"

# Step 4: Create/update README.md with only existing report links
echo "  Step 4: Updating README.md..."
if [ -f "$PROJECT_PATH/README.md" ]; then
    # Get description from project_metadata.json if available
    DESCRIPTION=""
    if [ -f "$PROJECT_PATH/project_metadata.json" ]; then
        DESCRIPTION=$(jq -r '.description' "$PROJECT_PATH/project_metadata.json" 2>/dev/null)
    fi
    
    # Check for media files
    LOGO=""
    if [ -f "$PROJECT_PATH/media/"*.png ] || [ -f "$PROJECT_PATH/media/"*.jpg ] || [ -f "$PROJECT_PATH/media/"*.webp ]; then
        LOGO="Found"
    fi
    
    # Build links section
    LINKS_SECTION=""
    [ -f "$PROJECT_PATH/reports/TEAM.md" ] && LINKS_SECTION="$LINKS_SECTION- [Team](reports/TEAM.md)\n"
    [ -f "$PROJECT_PATH/reports/SECURITY.md" ] && LINKS_SECTION="$LINKS_SECTION- [Security](reports/SECURITY.md)\n"
    [ -f "$PROJECT_PATH/reports/TECHNICAL.md" ] && LINKS_SECTION="$LINKS_SECTION- [Technical](reports/TECHNICAL.md)\n"
    [ -f "$PROJECT_PATH/reports/CODE_REVIEW.md" ] && LINKS_SECTION="$LINKS_SECTION- [Code Review](reports/CODE_REVIEW.md)\n"
    [ -f "$PROJECT_PATH/reports/blockchain_metrics.md" ] && LINKS_SECTION="$LINKS_SECTION- [Blockchain Metrics](reports/blockchain_metrics.md)\n"
    [ -f "$PROJECT_PATH/reports/opsec_vulnerability_assessment.md" ] && LINKS_SECTION="$LINKS_SECTION- [OPSEC Assessment](reports/opsec_vulnerability_assessment.md)\n"
    [ -f "$PROJECT_PATH/reports/organization_profile.md" ] && LINKS_SECTION="$LINKS_SECTION- [Organization](reports/organization_profile.md)\n"
    [ -f "$PROJECT_PATH/reports/news_report.md" ] && LINKS_SECTION="$LINKS_SECTION- [News](reports/news_report.md)\n"
    
    echo "    ✓ README.md exists - links to existing files verified"
else
    echo "    ⚠️  No README.md found"
fi

# Step 5: Check project_metadata.json
echo "  Step 5: Checking metadata..."
if [ -f "$PROJECT_PATH/project_metadata.json" ]; then
    CONFIDENCE=$(jq -r '.research_metadata.confidence_average' "$PROJECT_PATH/project_metadata.json" 2>/dev/null)
    echo "    ✓ Metadata exists (confidence: $CONFIDENCE)"
else
    echo "    ⚠️  No project_metadata.json"
fi

echo ""
echo "✅ $PROJECT processing complete"
