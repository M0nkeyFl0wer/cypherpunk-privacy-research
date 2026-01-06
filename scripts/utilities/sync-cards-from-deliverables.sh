#!/bin/bash
# Sync CARD.md and README.md files from deliverables to GitHub Pages site
# This script copies project cards and readmes to make them available in visualizations

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
DELIVERABLES_DIR="/home/flower/web3privacy-research/deliverables"
GITHUB_PAGES_DIR="/home/flower/web3-privacy-ethereum-cypherpunk-research"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Syncing Cards from Deliverables${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if deliverables directory exists
if [ ! -d "$DELIVERABLES_DIR" ]; then
    echo -e "${YELLOW}⚠️  Deliverables directory not found: $DELIVERABLES_DIR${NC}"
    exit 1
fi

# Counter variables
total_projects=0
cards_copied=0
readmes_copied=0
skipped=0

# Loop through all project directories in deliverables
for project_dir in "$DELIVERABLES_DIR"/*; do
    if [ ! -d "$project_dir" ]; then
        continue
    fi

    project_name=$(basename "$project_dir")
    total_projects=$((total_projects + 1))

    # Skip special directories
    if [[ "$project_name" == "analysis" ]]; then
        continue
    fi

    # Create target directory if it doesn't exist
    target_dir="$GITHUB_PAGES_DIR/$project_name"
    mkdir -p "$target_dir"

    # Copy CARD.md (uppercase) to card.md (lowercase)
    if [ -f "$project_dir/CARD.md" ]; then
        cp "$project_dir/CARD.md" "$target_dir/card.md"
        echo -e "${GREEN}✓${NC} Copied card: $project_name"
        cards_copied=$((cards_copied + 1))
    else
        echo -e "${YELLOW}⚠${NC}  No card: $project_name"
        skipped=$((skipped + 1))
    fi

    # Copy README.md
    if [ -f "$project_dir/README.md" ]; then
        cp "$project_dir/README.md" "$target_dir/README.md"
        readmes_copied=$((readmes_copied + 1))
    fi

    # Copy project_metadata.json if exists
    if [ -f "$project_dir/project_metadata.json" ]; then
        cp "$project_dir/project_metadata.json" "$target_dir/project_metadata.json"
    fi
done

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Sync Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Total projects: $total_projects${NC}"
echo -e "${GREEN}Cards copied: $cards_copied${NC}"
echo -e "${GREEN}READMEs copied: $readmes_copied${NC}"
echo -e "${YELLOW}Skipped (no card): $skipped${NC}"
echo ""
echo -e "${GREEN}✓ Sync complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run: cd $GITHUB_PAGES_DIR"
echo "2. Run: npm run build"
echo "3. Commit and push changes"
