#!/bin/bash
# Zcash Research - Bash Commands Reference
# Date: 2025-10-07
# Constitutional Compliance: v2.0.0

# This file contains all bash commands used during Zcash data collection
# Useful for future reference or independent work when Claude Code is unavailable

echo "=== Zcash Research Bash Commands Reference ==="
echo "Research Date: 2025-10-07"
echo ""

# ============================================
# DIRECTORY SETUP
# ============================================
echo "1. Create output directories:"
echo ""
echo "mkdir -p deliverables/zcash/sources deliverables/zcash/media"
echo ""

# ============================================
# GITHUB API QUERIES
# ============================================
echo "2. GitHub API - Repository Metadata:"
echo ""
echo 'curl -s "https://api.github.com/repos/zcash/zcash" | jq '"'"'{name, full_name, description, created_at, updated_at, stargazers_count, forks_count, language, license: .license.name, topics, homepage, default_branch}'"'"
echo ""

echo "3. GitHub API - Top Contributors:"
echo ""
echo 'curl -s "https://api.github.com/repos/zcash/zcash/contributors?per_page=10" | jq '"'"'.[] | {login, contributions, html_url}'"'"' | head -50'
echo ""

echo "4. GitHub API - Latest Release:"
echo ""
echo 'curl -s "https://api.github.com/repos/zcash/zcash/releases/latest" | jq '"'"'{tag_name, name, published_at, body}'"'"' | head -30'
echo ""

echo "5. GitHub API - Individual Contributor Profiles:"
echo ""
echo 'curl -s "https://api.github.com/users/str4d" | jq '"'"'{login, name, company, blog, location, bio}'"'"
echo 'curl -s "https://api.github.com/users/nuttycom" | jq '"'"'{login, name, company, blog, location, bio}'"'"
echo 'curl -s "https://api.github.com/users/daira" | jq '"'"'{login, name, company, blog, location, bio}'"'"
echo ""

# ============================================
# MEDIA ASSET DOWNLOADS
# ============================================
echo "6. Download Zcash Favicon:"
echo ""
echo 'curl -s -L "https://z.cash/favicon.ico" -o deliverables/zcash/media/favicon.ico'
echo 'file deliverables/zcash/media/favicon.ico'
echo ""

echo "7. Attempt Logo SVG Download (returned HTML in this case):"
echo ""
echo 'curl -s -L "https://z.cash/wp-content/uploads/2022/05/zcash-icon-fullcolor.svg" -o deliverables/zcash/media/logo.svg'
echo 'file deliverables/zcash/media/logo.svg'
echo ""

echo "8. Attempt Logo from GitHub Repository:"
echo ""
echo 'curl -s -L "https://raw.githubusercontent.com/zcash/zcash/master/zcutil/zcash.ico" -o deliverables/zcash/media/zcash.ico'
echo 'file deliverables/zcash/media/zcash.ico'
echo ""

# ============================================
# WEB SCRAPING (using curl + jq)
# ============================================
echo "9. Example: Fetch and parse JSON data from API:"
echo ""
echo 'curl -s "https://api.example.com/endpoint" | jq '"'"'.key1, .key2'"'"
echo ""

# ============================================
# FILE VERIFICATION
# ============================================
echo "10. Verify downloaded files:"
echo ""
echo 'ls -lh deliverables/zcash/media/'
echo 'file deliverables/zcash/media/*'
echo ""

# ============================================
# JSON VALIDATION
# ============================================
echo "11. Validate JSON output:"
echo ""
echo 'jq empty deliverables/zcash/sources/verified_data.json && echo "Valid JSON" || echo "Invalid JSON"'
echo ""

# ============================================
# RESEARCH OUTPUT VERIFICATION
# ============================================
echo "12. Check research deliverables:"
echo ""
echo 'ls -lh deliverables/zcash/sources/'
echo ""

echo "13. Count lines in research documents:"
echo ""
echo 'wc -l deliverables/zcash/sources/verified_data.json'
echo 'wc -l deliverables/zcash/sources/citations.md'
echo 'wc -l deliverables/zcash/sources/research_summary.md'
echo ""

# ============================================
# CONSTITUTIONAL COMPLIANCE CHECK
# ============================================
echo "14. Check for constitutional compliance keywords in output:"
echo ""
echo 'grep -i "confidence" deliverables/zcash/sources/verified_data.json | head -10'
echo 'grep -i "source" deliverables/zcash/sources/verified_data.json | head -10'
echo 'grep -i "gap" deliverables/zcash/sources/verified_data.json'
echo ""

# ============================================
# PRETTY PRINT JSON
# ============================================
echo "15. Pretty print JSON for review:"
echo ""
echo 'jq . deliverables/zcash/sources/verified_data.json | less'
echo ""

# ============================================
# SEARCH SPECIFIC DATA IN JSON
# ============================================
echo "16. Extract specific data from JSON:"
echo ""
echo 'jq ".project_basic_info" deliverables/zcash/sources/verified_data.json'
echo 'jq ".founders_and_scientists.primary_founder" deliverables/zcash/sources/verified_data.json'
echo 'jq ".organizations.electric_coin_company" deliverables/zcash/sources/verified_data.json'
echo 'jq ".github_repository.top_contributors" deliverables/zcash/sources/verified_data.json'
echo ""

# ============================================
# BACKUP RESEARCH DATA
# ============================================
echo "17. Create backup of research data:"
echo ""
echo 'tar -czf zcash_research_backup_$(date +%Y%m%d).tar.gz deliverables/zcash/'
echo ""

# ============================================
# USEFUL TIPS
# ============================================
echo "=== USEFUL TIPS ==="
echo ""
echo "- Always use jq for JSON parsing and validation"
echo "- Use curl -s for silent mode (no progress bar)"
echo "- Use curl -L to follow redirects"
echo "- Use 'file' command to verify downloaded file types"
echo "- GitHub API rate limit: 60 requests/hour unauthenticated, 5000/hour authenticated"
echo "- Add GitHub token for higher rate limits: curl -H 'Authorization: token YOUR_TOKEN' ..."
echo ""

echo "=== GITHUB API AUTHENTICATION (Optional) ==="
echo ""
echo "For higher rate limits, authenticate your GitHub API requests:"
echo ""
echo '# Create a GitHub personal access token at: https://github.com/settings/tokens'
echo '# Then use it in your curl requests:'
echo 'curl -H "Authorization: token YOUR_GITHUB_TOKEN" https://api.github.com/repos/zcash/zcash'
echo ""

echo "=== WEB SCRAPING ALTERNATIVES ==="
echo ""
echo "If curl + jq doesn't work for complex HTML pages, consider:"
echo "- lynx -dump URL (text-based browser)"
echo "- wget -O- URL (similar to curl)"
echo "- pup (HTML parser like jq for JSON)"
echo ""

echo "=== END OF REFERENCE ==="
