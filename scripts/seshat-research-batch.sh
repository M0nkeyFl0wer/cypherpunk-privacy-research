#!/bin/bash
# Seshat Research Batch Runner
# Run missing research and random validation

set -e

RESEARCH_DIR="${RESEARCH_DIR:-$HOME/web3-research}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$RESEARCH_DIR/logs/batch_${TIMESTAMP}.log"

mkdir -p "$RESEARCH_DIR/results" "$RESEARCH_DIR/logs" "$RESEARCH_DIR/validation"

log() {
    echo "[$(date +%H:%M:%S)] $1" | tee -a "$LOG_FILE"
}

# Projects that need research
MISSING_RESEARCH=("hop-protocol" "layerzero")

# Projects to validate (sample from known projects)
VALIDATE_PROJECTS=("monero" "zcash" "tornado-cash" "rotki" "miden")

log "=== SESHAT RESEARCH BATCH ==="
log "Starting at: $(date)"

#######################################
# PART 1: Research missing projects
#######################################
log ""
log "=== RESEARCHING MISSING PROJECTS ==="

for project in "${MISSING_RESEARCH[@]}"; do
    log "Researching: $project"
    OUTPUT_DIR="$RESEARCH_DIR/results/$project"
    mkdir -p "$OUTPUT_DIR"

    # Run research with claude
    PROMPT="Research the Web3 project: $project

CONSTITUTIONAL REQUIREMENTS:
1. REAL DATA ONLY - No fabrication, no placeholders
2. MULTI-SOURCE VERIFICATION - Verify from 2+ sources
3. CONFIDENCE SCORING - All data tagged 0.0-1.0
4. GAP REPORTING - Report what cannot be verified
5. SOURCE CITATION - URL for every claim

TEAM RESEARCH (PRIORITY):
- Search: '$project founder CEO CTO'
- Search LinkedIn: 'site:linkedin.com $project blockchain'
- Search GitHub: '$project site:github.com contributors'
- Verify backgrounds with multiple sources
- Note: DO NOT fabricate backgrounds. If unverified, mark as 'background: unverified'

OUTPUT FORMAT (JSON):
{
  \"project\": \"$project\",
  \"research_date\": \"$(date +%Y-%m-%d)\",
  \"team\": {
    \"founders\": [
      {
        \"name\": \"...\",
        \"role\": \"...\",
        \"background\": \"... OR 'unverified'\",
        \"linkedin\": \"...\",
        \"github\": \"...\",
        \"confidence\": 0.0-1.0,
        \"sources\": [\"url1\", \"url2\"]
      }
    ],
    \"company\": {
      \"name\": \"...\",
      \"registration\": \"...\",
      \"location\": \"...\"
    }
  },
  \"description\": \"...\",
  \"website\": \"...\",
  \"github\": \"...\",
  \"category\": \"bridge|defi|wallet|etc\",
  \"privacy_tech\": [],
  \"gaps\": [\"what could not be verified\"],
  \"sources\": [\"all URLs used\"],
  \"overall_confidence\": 0.0-1.0
}

Be thorough. Verify facts. Report gaps honestly. NO FABRICATION."

    if timeout 600 claude -p "$PROMPT" --output-format json > "$OUTPUT_DIR/research_${TIMESTAMP}.json" 2>&1; then
        if jq -e '.project' "$OUTPUT_DIR/research_${TIMESTAMP}.json" > /dev/null 2>&1; then
            log "SUCCESS: $project"
        else
            log "WARN: $project - invalid JSON output"
        fi
    else
        log "FAIL: $project - timeout or error"
    fi
done

#######################################
# PART 2: Random data validation
#######################################
log ""
log "=== DATA VALIDATION ==="

VALIDATION_OUTPUT="$RESEARCH_DIR/validation/validation_${TIMESTAMP}.json"
echo "[" > "$VALIDATION_OUTPUT"

for i in "${!VALIDATE_PROJECTS[@]}"; do
    project="${VALIDATE_PROJECTS[$i]}"
    log "Validating: $project"

    PROMPT="FACT CHECK for Web3 privacy project: $project

TASK: Verify key facts about this project from primary sources.

CHECK THESE ITEMS:
1. Who founded this project? Verify names and backgrounds.
2. Is the project still active? Check GitHub activity.
3. What is the main privacy technology used?
4. Are there any known security issues or audits?

CONSTITUTIONAL RULES:
- Only report what you can verify from official sources
- Mark unverifiable claims as 'unverified'
- Cite all sources with URLs
- NO FABRICATION

OUTPUT FORMAT (JSON):
{
  \"project\": \"$project\",
  \"validation_date\": \"$(date +%Y-%m-%d)\",
  \"founders_verified\": {
    \"names\": [\"...\"],
    \"accuracy\": \"VERIFIED|PARTIALLY_VERIFIED|UNVERIFIED\",
    \"sources\": [\"urls\"]
  },
  \"active_status\": {
    \"status\": \"active|inactive|unknown\",
    \"last_github_activity\": \"...\",
    \"source\": \"url\"
  },
  \"privacy_tech_verified\": {
    \"technologies\": [\"...\"],
    \"accuracy\": \"VERIFIED|PARTIALLY_VERIFIED|UNVERIFIED\",
    \"sources\": [\"urls\"]
  },
  \"issues_found\": [\"any inaccuracies or concerns\"],
  \"overall_data_quality\": \"GOOD|FAIR|POOR\",
  \"recommendations\": [\"what needs updating\"]
}"

    RESULT=$(timeout 300 claude -p "$PROMPT" --output-format json 2>/dev/null || echo "{\"error\": \"timeout\", \"project\": \"$project\"}")

    # Add comma if not first
    [ $i -gt 0 ] && echo "," >> "$VALIDATION_OUTPUT"
    echo "$RESULT" >> "$VALIDATION_OUTPUT"

    # Quick status
    QUALITY=$(echo "$RESULT" | jq -r '.overall_data_quality // "ERROR"')
    log "  -> $project: $QUALITY"
done

echo "]" >> "$VALIDATION_OUTPUT"

#######################################
# PART 3: Summary
#######################################
log ""
log "=== SUMMARY ==="
log "Research output: $RESEARCH_DIR/results/"
log "Validation output: $VALIDATION_OUTPUT"
log "Log file: $LOG_FILE"
log "Completed at: $(date)"

# Show validation summary
log ""
log "Validation Results:"
jq -r '.[] | "\(.project // "unknown"): \(.overall_data_quality // .error // "ERROR")"' "$VALIDATION_OUTPUT" 2>/dev/null || log "Could not parse validation results"

log ""
log "=== DONE ==="
