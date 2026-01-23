#!/bin/bash
# Constitutional Research Runner - Single Project
# Usage: ./research-runner.sh <project-name>

set -e

PROJECT="$1"
RESEARCH_DIR="/home/your-username/web3-research"
OUTPUT_DIR="$RESEARCH_DIR/results/$PROJECT"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

if [ -z "$PROJECT" ]; then
    echo "Usage: $0 <project-name>"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

# Constitutional Research Prompt (v3 compliant)
PROMPT="Research the privacy/security project: $PROJECT

CONSTITUTIONAL REQUIREMENTS (STRICT):
1. REAL DATA ONLY - No synthetic data, no placeholders, no assumptions
2. MULTI-SOURCE VERIFICATION - Verify critical facts from 2+ sources
3. CONFIDENCE SCORING - Tag all data 0.0-1.0
4. HONEST GAP REPORTING - Report what cannot be found, don't fabricate
5. SOURCE CITATION - Every claim needs a URL

SECURITY ANALYSIS (MANDATORY - no privacy without security):
- Search for security audits: '{project} audit site:github.com OR site:code4rena.com OR site:sherlock.xyz'
- Search for exploits: '{project} hack OR exploit OR vulnerability'
- Document trust model (trustless/optimistic/multisig/centralized)
- Note any admin keys, upgrade mechanisms, centralization risks

IF THIS IS A BRIDGE PROJECT:
- Document validator/guardian structure
- List all known exploits with amounts
- Assess privacy leakage (timing correlation, amount matching, address linkage)
- Rate security risk: LOW/MEDIUM/HIGH/CRITICAL

OUTPUT FORMAT (JSON):
{
  \"project\": \"$PROJECT\",
  \"research_date\": \"$(date +%Y-%m-%d)\",
  \"ecosystem\": \"ethereum|l2-arbitrum|l2-optimism|l2-zksync|l2-scroll|cosmos|standalone|multichain\",
  \"category\": \"mixer|zk-rollup|bridge|wallet|identity|defi|messaging|vpn|tooling|other\",
  \"description\": \"...\",
  \"website\": {\"url\": \"...\", \"confidence\": 0.0-1.0},
  \"github\": {\"url\": \"...\", \"confidence\": 0.0-1.0},
  \"privacy_tech\": [\"zk-snarks\", \"ring-signatures\", etc],
  \"blockchain_support\": [\"ethereum\", \"arbitrum\", \"optimism\", etc],
  \"security\": {
    \"audits\": [{\"auditor\": \"...\", \"date\": \"...\", \"scope\": \"...\", \"findings\": \"...\", \"url\": \"...\"}],
    \"exploits\": [{\"date\": \"...\", \"amount\": \"...\", \"attack_vector\": \"...\", \"root_cause\": \"...\"}],
    \"trust_model\": \"trustless|optimistic|multisig|centralized\",
    \"trust_assumptions\": \"...\",
    \"upgrade_mechanism\": \"...\",
    \"admin_keys\": \"...\",
    \"security_rating\": \"LOW|MEDIUM|HIGH|CRITICAL\",
    \"security_rating_justification\": \"...\"
  },
  \"privacy_assessment\": {
    \"surveillance_risk\": \"low|medium|high\",
    \"metadata_protection\": true/false,
    \"censorship_resistant\": true/false
  },
  \"gaps\": [\"what could not be verified\"],
  \"sources\": [\"all URLs used\"],
  \"overall_confidence\": 0.0-1.0
}

Be thorough but efficient. Verify facts, cite sources, report gaps honestly.
SECURITY ANALYSIS IS NOT OPTIONAL - document what you find or explicitly state gaps."

# Run claude with timeout
echo "[$TIMESTAMP] Starting research: $PROJECT"
timeout 300 claude -p "$PROMPT" --output-format json > "$OUTPUT_DIR/research_${TIMESTAMP}.json" 2>&1

# Validate output
if [ -f "$OUTPUT_DIR/research_${TIMESTAMP}.json" ]; then
    if jq -e '.project' "$OUTPUT_DIR/research_${TIMESTAMP}.json" > /dev/null 2>&1; then
        echo "[$TIMESTAMP] SUCCESS: $PROJECT"
        exit 0
    else
        echo "[$TIMESTAMP] INVALID JSON: $PROJECT"
        exit 2
    fi
else
    echo "[$TIMESTAMP] FAILED: $PROJECT - no output"
    exit 1
fi
