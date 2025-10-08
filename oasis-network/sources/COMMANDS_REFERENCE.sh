#!/bin/bash
# Oasis Network - Research Commands Reference
# All commands used during constitutional research session
# Date: 2025-10-08T01:42:10Z
# Purpose: Enable independent research verification and future updates

echo "=== OASIS NETWORK RESEARCH COMMANDS ==="
echo "Constitutional v2.0.0 - Real Data Collection"
echo ""

# =============================================================================
# GITHUB API COMMANDS
# =============================================================================

echo "1. GITHUB ORGANIZATION DATA"
echo "----------------------------"
echo "Command:"
echo 'curl -s "https://api.github.com/orgs/oasisprotocol" | python3 -m json.tool'
echo ""
echo "Expected fields: login, name, description, public_repos, followers, created_at, is_verified, blog"
echo ""

echo "2. GITHUB REPOSITORY - oasis-core"
echo "---------------------------------"
echo "Command:"
echo 'curl -s "https://api.github.com/repos/oasisprotocol/oasis-core" | python3 -m json.tool | grep -E "name|description|stargazers_count|forks_count|homepage"'
echo ""

echo "3. GITHUB CONTRIBUTORS - Top 10"
echo "-------------------------------"
echo "Command:"
echo 'curl -s "https://api.github.com/repos/oasisprotocol/oasis-core/contributors?per_page=10" | python3 -m json.tool | grep -E "login|contributions|html_url"'
echo ""

echo "4. GITHUB REPOSITORY - sapphire-paratime"
echo "----------------------------------------"
echo "Command:"
echo 'curl -s "https://api.github.com/repos/oasisprotocol/sapphire-paratime" | python3 -m json.tool | grep -E "name|description|stargazers_count|forks_count"'
echo ""

echo "5. GITHUB REPOSITORY - emerald-paratime"
echo "---------------------------------------"
echo "Command:"
echo 'curl -s "https://api.github.com/repos/oasisprotocol/emerald-paratime" | python3 -m json.tool | grep -E "name|description|stargazers_count|forks_count"'
echo ""

echo "6. GITHUB REPOSITORY - oasis-sdk"
echo "--------------------------------"
echo "Command:"
echo 'curl -s "https://api.github.com/repos/oasisprotocol/oasis-sdk" | python3 -m json.tool | grep -E "name|description|stargazers_count"'
echo ""

echo "7. GITHUB REPOSITORY - oasis-web3-gateway"
echo "-----------------------------------------"
echo "Command:"
echo 'curl -s "https://api.github.com/repos/oasisprotocol/oasis-web3-gateway" | python3 -m json.tool | grep -E "name|description|stargazers_count"'
echo ""

echo "8. GITHUB REPOSITORIES LIST - Top 10 by Stars"
echo "---------------------------------------------"
echo "Command:"
echo 'curl -s "https://api.github.com/orgs/oasisprotocol/repos?per_page=10&sort=stars" | python3 -m json.tool | grep -E "name|description|stargazers_count|html_url"'
echo ""

# =============================================================================
# COINGECKO API COMMANDS
# =============================================================================

echo "9. COINGECKO - ROSE Token Market Data"
echo "-------------------------------------"
echo "Command:"
echo 'curl -s "https://api.coingecko.com/api/v3/coins/oasis-network" | python3 -c "import json,sys; d=json.load(sys.stdin); print(json.dumps({\"current_price_usd\": d[\"market_data\"][\"current_price\"].get(\"usd\"), \"market_cap_usd\": d[\"market_data\"][\"market_cap\"].get(\"usd\"), \"total_supply\": d[\"market_data\"][\"total_supply\"], \"circulating_supply\": d[\"market_data\"][\"circulating_supply\"], \"max_supply\": d[\"market_data\"][\"max_supply\"]}, indent=2))"'
echo ""
echo "Expected output: JSON with price, market cap, supplies"
echo ""

echo "10. COINGECKO - Social Links & Homepage"
echo "---------------------------------------"
echo "Command:"
echo 'curl -s "https://api.coingecko.com/api/v3/coins/oasis-network" | python3 -c "import json, sys; d = json.load(sys.stdin); links = d.get(\"links\", {}); print(\"Homepage:\", links.get(\"homepage\", [])); print(\"Blockchain sites:\", links.get(\"blockchain_site\", [])[:3]); print(\"Twitter:\", links.get(\"twitter_screen_name\")); print(\"Telegram:\", links.get(\"telegram_channel_identifier\"))"'
echo ""

echo "11. COINGECKO - Categories & Logo"
echo "---------------------------------"
echo "Command:"
echo 'curl -s "https://api.coingecko.com/api/v3/coins/oasis-network" | python3 -c "import json, sys; d = json.load(sys.stdin); print(\"Categories:\", d.get(\"categories\", [])); print(\"Logo:\", d.get(\"image\", {}).get(\"large\"))"'
echo ""

# =============================================================================
# WEBSITE SCRAPING COMMANDS
# =============================================================================

echo "12. WEBSITE - Meta Description"
echo "------------------------------"
echo "Command:"
echo 'curl -s -L "https://oasisprotocol.org" | grep -i "meta.*description" | head -5'
echo ""
echo "Extracts: Official project description from meta tags"
echo ""

echo "13. WEBSITE - Check for Founder Mention (Dawn Song)"
echo "---------------------------------------------------"
echo "Command:"
echo 'curl -s -L "https://oasisprotocol.org" | grep -o "Dawn Song" | head -1'
echo ""
echo "Expected: \"Dawn Song\" if found on homepage"
echo ""

echo "14. DOCUMENTATION SITE - Verify ParaTime Content"
echo "------------------------------------------------"
echo "Command:"
echo 'curl -s -L "https://docs.oasis.io" | grep -o "ParaTime\|Sapphire\|Emerald\|Cipher\|confidential\|privacy" | head -20'
echo ""
echo "Verifies: Technical content presence in documentation"
echo ""

# =============================================================================
# COMBINED DATA EXTRACTION SCRIPTS
# =============================================================================

echo "15. COMPREHENSIVE DATA EXTRACTION SCRIPT"
echo "========================================="
cat << 'SCRIPT_EOF'

# Save this as: oasis_comprehensive_research.sh

#!/bin/bash

OUTPUT_DIR="./oasis_research_output"
mkdir -p "$OUTPUT_DIR"

echo "Starting Oasis Network comprehensive research..."
echo "Output directory: $OUTPUT_DIR"
echo ""

# 1. GitHub Organization
echo "[1/8] Fetching GitHub organization data..."
curl -s "https://api.github.com/orgs/oasisprotocol" > "$OUTPUT_DIR/github_org.json"

# 2. Top Repositories
echo "[2/8] Fetching top repositories..."
curl -s "https://api.github.com/orgs/oasisprotocol/repos?per_page=20&sort=stars" > "$OUTPUT_DIR/github_repos.json"

# 3. Core Repository Details
echo "[3/8] Fetching oasis-core details..."
curl -s "https://api.github.com/repos/oasisprotocol/oasis-core" > "$OUTPUT_DIR/oasis_core.json"

# 4. Contributors
echo "[4/8] Fetching top contributors..."
curl -s "https://api.github.com/repos/oasisprotocol/oasis-core/contributors?per_page=20" > "$OUTPUT_DIR/contributors.json"

# 5. Sapphire ParaTime
echo "[5/8] Fetching Sapphire ParaTime data..."
curl -s "https://api.github.com/repos/oasisprotocol/sapphire-paratime" > "$OUTPUT_DIR/sapphire.json"

# 6. Emerald ParaTime
echo "[6/8] Fetching Emerald ParaTime data..."
curl -s "https://api.github.com/repos/oasisprotocol/emerald-paratime" > "$OUTPUT_DIR/emerald.json"

# 7. CoinGecko Market Data
echo "[7/8] Fetching ROSE token market data..."
curl -s "https://api.coingecko.com/api/v3/coins/oasis-network" > "$OUTPUT_DIR/coingecko.json"

# 8. Website Homepage
echo "[8/8] Fetching website homepage..."
curl -s -L "https://oasisprotocol.org" > "$OUTPUT_DIR/homepage.html"

echo ""
echo "Research complete! Data saved to: $OUTPUT_DIR"
echo ""
echo "To extract specific fields:"
echo "  Organization name: cat $OUTPUT_DIR/github_org.json | python3 -m json.tool | grep 'name'"
echo "  ROSE price: cat $OUTPUT_DIR/coingecko.json | python3 -m json.tool | grep 'current_price' | head -5"
echo "  Top repo stars: cat $OUTPUT_DIR/github_repos.json | python3 -m json.tool | grep 'stargazers_count' | head -10"

SCRIPT_EOF

echo ""

# =============================================================================
# QUICK REFERENCE COMMANDS
# =============================================================================

echo "16. QUICK VERIFICATION COMMANDS"
echo "================================"
echo ""
echo "Check GitHub org exists:"
echo '  curl -s "https://api.github.com/orgs/oasisprotocol" | grep "login"'
echo ""
echo "Get current ROSE price:"
echo '  curl -s "https://api.coingecko.com/api/v3/simple/price?ids=oasis-network&vs_currencies=usd" | python3 -m json.tool'
echo ""
echo "Count GitHub repos:"
echo '  curl -s "https://api.github.com/orgs/oasisprotocol" | python3 -c "import json,sys; print(\"Public repos:\", json.load(sys.stdin)[\"public_repos\"])"'
echo ""
echo "Check website is live:"
echo '  curl -s -o /dev/null -w "%{http_code}" "https://oasisprotocol.org"'
echo '  # Expected: 200'
echo ""

# =============================================================================
# RATE LIMIT CHECKS
# =============================================================================

echo "17. GITHUB API RATE LIMIT CHECK"
echo "================================"
echo "Command:"
echo '  curl -s "https://api.github.com/rate_limit" | python3 -m json.tool'
echo ""
echo "Monitor your remaining API calls before running bulk research"
echo ""

# =============================================================================
# DATA VALIDATION COMMANDS
# =============================================================================

echo "18. DATA VALIDATION COMMANDS"
echo "============================"
echo ""
echo "Validate JSON files:"
echo '  python3 -m json.tool < verified_data.json > /dev/null && echo "Valid JSON" || echo "Invalid JSON"'
echo ""
echo "Check confidence scores:"
echo '  grep -r "\"confidence\":" verified_data.json | wc -l'
echo ""
echo "Find data gaps:"
echo '  grep -r "\"gap" verified_data.json'
echo ""

# =============================================================================
# FUTURE RESEARCH UPDATES
# =============================================================================

echo "19. UPDATING RESEARCH DATA"
echo "=========================="
echo ""
echo "To update all data, run:"
echo "  1. Re-run all API commands above"
echo "  2. Compare new data with existing verified_data.json"
echo "  3. Update confidence scores if sources changed"
echo "  4. Document any new gaps discovered"
echo "  5. Update timestamps in metadata"
echo ""
echo "Key fields to monitor for changes:"
echo "  - GitHub star counts (popularity)"
echo "  - ROSE token price and market cap"
echo "  - Circulating supply (tokenomics)"
echo "  - New repository additions"
echo "  - Team/founder information"
echo ""

# =============================================================================
# TROUBLESHOOTING
# =============================================================================

echo "20. TROUBLESHOOTING"
echo "==================="
echo ""
echo "If API calls fail:"
echo "  1. Check internet connection: ping -c 3 api.github.com"
echo "  2. Verify API endpoints: curl -I https://api.github.com"
echo "  3. Check rate limits: curl -s https://api.github.com/rate_limit"
echo "  4. Use authenticated requests for higher limits (add -H 'Authorization: token YOUR_TOKEN')"
echo ""
echo "If data parsing fails:"
echo "  1. Verify Python3 is installed: python3 --version"
echo "  2. Check JSON validity: curl -s URL | python3 -m json.tool"
echo "  3. Use jq as alternative: curl -s URL | jq ."
echo ""

# =============================================================================
# CONSTITUTIONAL COMPLIANCE CHECKLIST
# =============================================================================

echo "21. CONSTITUTIONAL v2.0.0 COMPLIANCE CHECKLIST"
echo "=============================================="
echo ""
echo "Before finalizing research, verify:"
echo "  [ ] All data from real sources (no fabrication)"
echo "  [ ] Multi-source verification for critical claims (2+ sources)"
echo "  [ ] Confidence scores assigned (0.0-1.0)"
echo "  [ ] Data gaps honestly reported"
echo "  [ ] All sources cited with URLs/API endpoints"
echo "  [ ] Timestamps recorded for all API calls"
echo "  [ ] No placeholder or synthetic data"
echo ""

echo "=== END OF REFERENCE COMMANDS ==="
echo ""
echo "All commands verified during research session: 2025-10-08T01:42:10Z"
echo "For updates or questions, refer to CITATIONS.md and RESEARCH_SUMMARY.md"
