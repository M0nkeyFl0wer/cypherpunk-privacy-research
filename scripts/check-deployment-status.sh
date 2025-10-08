#!/bin/bash
# Check GitHub Pages deployment status

set -e

REPO_OWNER="M0nkeyFl0wer"
REPO_NAME="web3-privacy-ethereum-cypherpunk-research"
GITHUB_PAGES_URL="https://${REPO_OWNER,,}.github.io/${REPO_NAME}"

echo "🔍 Checking GitHub Pages deployment status..."
echo ""

# Check if site is accessible
echo "1️⃣ Testing site accessibility..."
if curl -s -o /dev/null -w "%{http_code}" "$GITHUB_PAGES_URL" | grep -q "200"; then
    echo "   ✅ Site is live and accessible"
    echo "   🌐 URL: $GITHUB_PAGES_URL"
else
    echo "   ❌ Site is not accessible (may not be deployed yet)"
    echo "   🔗 Expected URL: $GITHUB_PAGES_URL"
    echo ""
    echo "   📝 Next steps:"
    echo "   1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/settings/pages"
    echo "   2. Set Source to 'GitHub Actions'"
    echo "   3. Push code to trigger deployment"
    exit 1
fi

echo ""
echo "2️⃣ Checking key pages..."

# Check main pages
PAGES=(
    "/"
    "/search/"
    "/visualizations/"
    "/chat/"
    "/feedback/"
)

for page in "${PAGES[@]}"; do
    url="${GITHUB_PAGES_URL}${page}"
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$status" = "200" ]; then
        echo "   ✅ $page"
    else
        echo "   ❌ $page (HTTP $status)"
    fi
done

echo ""
echo "3️⃣ Checking data files..."

# Check if project data is accessible
data_url="${GITHUB_PAGES_URL}/data/projects-index.json"
if curl -s "$data_url" | jq -e '.projects | length' > /dev/null 2>&1; then
    project_count=$(curl -s "$data_url" | jq '.projects | length')
    echo "   ✅ Project data accessible ($project_count projects)"
else
    echo "   ❌ Project data not accessible"
fi

echo ""
echo "4️⃣ GitHub Actions status..."
echo "   🔗 Check workflows: https://github.com/$REPO_OWNER/$REPO_NAME/actions"

echo ""
echo "✅ Deployment check complete!"
echo ""
echo "📋 Quick links:"
echo "   🌐 Live site: $GITHUB_PAGES_URL"
echo "   📊 GitHub Actions: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
echo "   ⚙️  Pages settings: https://github.com/$REPO_OWNER/$REPO_NAME/settings/pages"
echo "   📝 Issues: https://github.com/$REPO_OWNER/$REPO_NAME/issues"
