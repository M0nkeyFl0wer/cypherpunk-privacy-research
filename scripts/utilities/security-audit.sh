#!/bin/bash
# Security Audit Script for Web3 Privacy GitHub Pages
# Runs comprehensive security checks

set -e

echo "🔒 Running Security Audit..."
echo "=============================="
echo ""

# Change to project directory
cd "$(dirname "$0")/.."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ISSUES=0

# 1. Check for exposed secrets
echo "🔍 Checking for exposed secrets..."
# Exclude validation code, build artifacts, and research data directories
SECRET_MATCHES=$(grep -r "sk-ant-[a-zA-Z0-9]" \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=.next \
  --exclude-dir=aztec-protocol \
  --exclude-dir=tornado-cash \
  --exclude-dir=monero \
  --exclude-dir=zcash \
  --exclude="*.md" \
  --exclude="security-audit.sh" \
  --exclude="*Client.ts" \
  --exclude="validation.ts" \
  . 2>/dev/null | grep -v "startsWith('sk-ant-')" | grep -v "validation" || true)

if [ -n "$SECRET_MATCHES" ]; then
  echo -e "${RED}✗ WARNING: Potential API keys found in codebase${NC}"
  echo "$SECRET_MATCHES"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}✓ No exposed API keys found${NC}"
fi

# 2. Check npm dependencies for vulnerabilities
echo ""
echo "📦 Checking npm dependencies..."
if command -v npm &> /dev/null; then
  AUDIT_OUTPUT=$(npm audit --json 2>/dev/null || true)

  if [ -n "$AUDIT_OUTPUT" ]; then
    CRITICAL=$(echo "$AUDIT_OUTPUT" | grep -o '"critical":[0-9]*' | grep -o '[0-9]*' || echo "0")
    HIGH=$(echo "$AUDIT_OUTPUT" | grep -o '"high":[0-9]*' | grep -o '[0-9]*' || echo "0")

    if [ "$CRITICAL" -gt 0 ] || [ "$HIGH" -gt 0 ]; then
      echo -e "${RED}✗ Found $CRITICAL critical and $HIGH high severity vulnerabilities${NC}"
      echo "  Run: npm audit fix"
      ISSUES=$((ISSUES + 1))
    else
      echo -e "${GREEN}✓ No critical or high severity vulnerabilities${NC}"
    fi
  fi
else
  echo -e "${YELLOW}⚠ npm not found, skipping dependency check${NC}"
fi

# 3. Check security headers configuration
echo ""
echo "🛡️  Checking security headers..."
if grep -q "X-Frame-Options" next.config.js; then
  echo -e "${GREEN}✓ Security headers configured${NC}"
else
  echo -e "${RED}✗ Security headers missing in next.config.js${NC}"
  ISSUES=$((ISSUES + 1))
fi

# 4. Check for CSP configuration
echo ""
echo "🔐 Checking Content Security Policy..."
if grep -q "Content-Security-Policy" next.config.js; then
  echo -e "${GREEN}✓ CSP configured${NC}"
else
  echo -e "${RED}✗ CSP not configured${NC}"
  ISSUES=$((ISSUES + 1))
fi

# 5. Check for HTTPS enforcement
echo ""
echo "🔒 Checking HTTPS enforcement..."
if grep -q "Strict-Transport-Security" next.config.js; then
  echo -e "${GREEN}✓ HSTS configured${NC}"
else
  echo -e "${YELLOW}⚠ HSTS not configured${NC}"
fi

# 6. Check for rate limiting implementation
echo ""
echo "⏱️  Checking rate limiting..."
if [ -f "lib/security/rateLimit.ts" ]; then
  echo -e "${GREEN}✓ Rate limiting implemented${NC}"
else
  echo -e "${RED}✗ Rate limiting not found${NC}"
  ISSUES=$((ISSUES + 1))
fi

# 7. Check for input validation
echo ""
echo "✅ Checking input validation..."
if [ -f "lib/security/validation.ts" ]; then
  echo -e "${GREEN}✓ Input validation implemented${NC}"
else
  echo -e "${RED}✗ Input validation not found${NC}"
  ISSUES=$((ISSUES + 1))
fi

# 8. Check for Seshat security restrictions
echo ""
echo "🔒 Checking Seshat security restrictions..."
if [ -f "lib/security/seshatRestrictions.ts" ]; then
  echo -e "${GREEN}✓ Seshat restrictions implemented${NC}"
else
  echo -e "${RED}✗ Seshat security restrictions not found${NC}"
  ISSUES=$((ISSUES + 1))
fi

# 9. Check for .env files in git (exclude research data directories)
echo ""
echo "🔍 Checking for .env files in git..."
ENV_FILES=$(git ls-files | grep "\.env$" | grep -v "aztec-protocol/" | grep -v "tornado-cash/" | grep -v ".env.template" || true)

if [ -n "$ENV_FILES" ]; then
  echo -e "${RED}✗ .env files found in application code${NC}"
  echo "$ENV_FILES"
  ISSUES=$((ISSUES + 1))
else
  echo -e "${GREEN}✓ No .env files in application code${NC}"
fi

# 10. Check .gitignore
echo ""
echo "📝 Checking .gitignore..."
if [ -f ".gitignore" ]; then
  if grep -q "node_modules" .gitignore && grep -q ".env" .gitignore; then
    echo -e "${GREEN}✓ .gitignore properly configured${NC}"
  else
    echo -e "${YELLOW}⚠ .gitignore incomplete${NC}"
  fi
else
  echo -e "${RED}✗ .gitignore not found${NC}"
  ISSUES=$((ISSUES + 1))
fi

# Summary
echo ""
echo "=============================="
if [ $ISSUES -eq 0 ]; then
  echo -e "${GREEN}✓ All security checks passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Found $ISSUES security issue(s)${NC}"
  echo ""
  echo "Recommendations:"
  echo "1. Fix exposed secrets immediately"
  echo "2. Run: npm audit fix"
  echo "3. Ensure all security features are implemented"
  echo "4. Review SECURITY.md for best practices"
  exit 1
fi
