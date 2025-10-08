#!/bin/bash
# Deeper Network Research - Bash Commands Reference
# Created: 2025-10-07
# Purpose: Quick reference for research verification commands

# =============================================================================
# FILE LOCATIONS
# =============================================================================
DELIVERABLES_DIR="/home/flower/web3privacy-research/deliverables/deeper-network/sources"
RESEARCH_DATA_DIR="/home/flower/web3privacy-research/research-data/projects-seshat-results/deeper-network"

# =============================================================================
# VIEW RESEARCH OUTPUTS
# =============================================================================

# View verified data JSON (pretty printed)
view_verified_data() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '.'
}

# View only high-confidence data (≥0.8)
view_high_confidence() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '
        .tier_1_core_data |
        to_entries |
        map(select(.value.confidence >= 0.8)) |
        from_entries
    '
}

# View all data gaps
view_gaps() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '.identified_gaps'
}

# View research summary (markdown)
view_summary() {
    less "$DELIVERABLES_DIR/RESEARCH_SUMMARY.md"
}

# View gap analysis
view_gap_analysis() {
    less "$DELIVERABLES_DIR/GAP_ANALYSIS.md"
}

# =============================================================================
# DATA QUALITY CHECKS
# =============================================================================

# Check overall completeness percentage
check_completeness() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq -r '
        .data_quality_assessment.completeness_percentage
    '
}

# Check overall confidence score
check_confidence() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq -r '
        .data_quality_assessment.overall_confidence
    '
}

# List all sources used
list_sources() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq -r '
        .data_quality_assessment.verification_methods[]
    '
}

# Count verified vs unverified fields
count_fields() {
    echo "=== Field Verification Status ==="
    echo "Total fields: 22"
    echo -n "Verified fields: "
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '
        [.tier_1_core_data, .tier_2_extended_data, .tier_3_additional_data] |
        map(to_entries) |
        flatten |
        map(select(.value.confidence >= 0.7)) |
        length
    '
    echo -n "Low confidence: "
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '
        [.tier_1_core_data, .tier_2_extended_data, .tier_3_additional_data] |
        map(to_entries) |
        flatten |
        map(select(.value.confidence < 0.7)) |
        length
    '
}

# =============================================================================
# GITHUB DATA QUERIES
# =============================================================================

# Get GitHub repository stats
github_stats() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '
        .github_technical_analysis.metrics
    '
}

# Get recent commit activity
github_activity() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '
        .github_technical_analysis.activity_metrics
    '
}

# Get technology stack
github_tech() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '
        .github_technical_analysis.technology_stack
    '
}

# =============================================================================
# GAP ANALYSIS QUERIES
# =============================================================================

# List high-priority gaps only
high_priority_gaps() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq -r '
        .identified_gaps[] |
        select(.priority == "high") |
        "[\(.priority)] \(.field) - \(.next_steps)"
    '
}

# List all gaps with estimated effort
gaps_by_effort() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq -r '
        .identified_gaps[] |
        "[\(.estimated_effort)] \(.field) - \(.next_steps)"
    ' | sort
}

# =============================================================================
# CONSTITUTIONAL COMPLIANCE CHECKS
# =============================================================================

# Check constitutional compliance status
check_compliance() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '
        .constitutional_compliance_report
    '
}

# List all principles with pass/fail status
compliance_principles() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq -r '
        .constitutional_compliance_report.principles_followed |
        to_entries[] |
        "\(.value.status) - \(.key): \(.value.evidence)"
    '
}

# =============================================================================
# SEARCH AND FILTER
# =============================================================================

# Search for specific field by name
search_field() {
    local field_name=$1
    cat "$DELIVERABLES_DIR/verified_data.json" | jq --arg field "$field_name" '
        .. |
        select(type == "object" and has($field))? |
        .[$field]
    '
}

# Find all fields with confidence below threshold
low_confidence_fields() {
    local threshold=${1:-0.7}
    cat "$DELIVERABLES_DIR/verified_data.json" | jq --arg thresh "$threshold" '
        [.tier_1_core_data, .tier_2_extended_data, .tier_3_additional_data] |
        map(to_entries) |
        flatten |
        map(select(.value.confidence < ($thresh | tonumber))) |
        map({field: .key, confidence: .value.confidence, gap: .value.gap})
    '
}

# =============================================================================
# EXPORT AND REPORTING
# =============================================================================

# Generate CSV of all data points with confidence
export_csv() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq -r '
        [.tier_1_core_data, .tier_2_extended_data, .tier_3_additional_data] |
        map(to_entries) |
        flatten |
        ["Field", "Value", "Confidence", "Sources", "Gap"],
        (.[] | [.key, .value.value, .value.confidence,
                (.value.sources | join("; ")),
                (.value.gap // "N/A")])
        | @csv
    '
}

# Generate gap summary report
gap_report() {
    echo "=== Deeper Network - Gap Summary Report ==="
    echo "Generated: $(date)"
    echo ""
    echo "Total Gaps: $(cat "$DELIVERABLES_DIR/verified_data.json" | jq '.identified_gaps | length')"
    echo ""
    echo "High Priority:"
    high_priority_gaps
    echo ""
    echo "Total Estimated Effort:"
    cat "$DELIVERABLES_DIR/verified_data.json" | jq -r '
        .identified_gaps[] | .estimated_effort
    ' | grep -oE '[0-9]+' | awk '{sum+=$1} END {print sum " minutes"}'
}

# =============================================================================
# WEB VERIFICATION HELPERS (Manual Steps)
# =============================================================================

# Print website verification steps
website_verification_steps() {
    cat << 'EOF'
=== Website Verification Steps ===

1. Access website:
   firefox https://deeper.network &
   # OR
   curl -I https://deeper.network

2. Extract logo:
   # Right-click logo > Save Image As...
   # Or use wget:
   wget https://deeper.network/logo.png -O logo.png

3. Find team page:
   # Navigate to /team, /about, or /company
   firefox https://deeper.network/team &

4. Extract social links:
   # Check footer, header, or about page
   # Document Twitter, Discord, Telegram, LinkedIn

5. Find token info:
   # Look for /token, /tokenomics, or /ecosystem
   firefox https://deeper.network/token &

6. Update verified_data.json with findings
EOF
}

# Print token verification steps
token_verification_steps() {
    cat << 'EOF'
=== Token Verification Steps ===

1. CoinGecko:
   firefox https://www.coingecko.com/en/coins/deeper-network &

2. CoinMarketCap:
   firefox https://coinmarketcap.com/currencies/deeper-network/ &

3. Extract contract addresses from both sources

4. Verify on Etherscan/BscScan:
   firefox https://etherscan.io/token/[CONTRACT_ADDRESS] &

5. Cross-reference all 3 sources for confidence 0.9+

6. Update verified_data.json with findings
EOF
}

# Print team verification steps
team_verification_steps() {
    cat << 'EOF'
=== Team Verification Steps ===

1. LinkedIn company page:
   firefox https://www.linkedin.com/company/deeper-network/ &
   # Click "People" tab
   # Document names and roles

2. Crunchbase:
   firefox https://www.crunchbase.com/organization/deeper-network &
   # Check "People" section

3. Official website team page:
   firefox https://deeper.network/team &

4. Cross-reference all 3 sources
   # Require 2+ sources for verification

5. Update verified_data.json with confirmed names
EOF
}

# =============================================================================
# USEFUL JQ QUERIES
# =============================================================================

# Get all fields that need 2+ source verification
needs_verification() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '
        [.tier_1_core_data, .tier_2_extended_data, .tier_3_additional_data] |
        map(to_entries) |
        flatten |
        map(select(.value.verification_count < 2)) |
        map(.key)
    '
}

# Get all TIER 1 data only
tier1_only() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '.tier_1_core_data'
}

# Get all TIER 2 data only
tier2_only() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '.tier_2_extended_data'
}

# Get all TIER 3 data only
tier3_only() {
    cat "$DELIVERABLES_DIR/verified_data.json" | jq '.tier_3_additional_data'
}

# =============================================================================
# QUICK ACCESS FUNCTIONS
# =============================================================================

# List all available functions
list_functions() {
    cat "$0" | grep '^[a-z_]*()' | sed 's/().*//' | sort
}

# Print help
help() {
    cat << 'EOF'
=== Deeper Network Research - Command Reference ===

DATA VIEWING:
  view_verified_data        - View all verified data (JSON)
  view_high_confidence      - View only high-confidence data (≥0.8)
  view_gaps                 - View all identified gaps
  view_summary              - View research summary (markdown)
  view_gap_analysis         - View detailed gap analysis

QUALITY CHECKS:
  check_completeness        - Show overall completeness percentage
  check_confidence          - Show overall confidence score
  list_sources              - List all data sources used
  count_fields              - Count verified vs unverified fields

GITHUB QUERIES:
  github_stats              - Show GitHub repository statistics
  github_activity           - Show recent commit activity
  github_tech               - Show technology stack

GAP ANALYSIS:
  high_priority_gaps        - List high-priority gaps only
  gaps_by_effort            - List gaps sorted by estimated effort
  gap_report                - Generate comprehensive gap report

COMPLIANCE:
  check_compliance          - Show constitutional compliance status
  compliance_principles     - List all principles with status

SEARCH:
  search_field <name>       - Search for specific field
  low_confidence_fields     - Find fields below confidence threshold
  needs_verification        - Find fields needing 2+ sources

EXPORT:
  export_csv                - Export all data to CSV format
  gap_report                - Generate gap summary report

MANUAL VERIFICATION:
  website_verification_steps  - Print website verification steps
  token_verification_steps    - Print token verification steps
  team_verification_steps     - Print team verification steps

UTILITIES:
  list_functions            - List all available functions
  help                      - Show this help message

USAGE:
  Source this file:
    source RESEARCH_COMMANDS.sh

  Run any function:
    check_completeness
    view_gaps
    gap_report

EXAMPLES:
  # Check data quality
  check_completeness
  check_confidence

  # View high-priority gaps
  high_priority_gaps

  # Generate gap report
  gap_report > gap_report.txt

  # Export to CSV
  export_csv > deeper_network_data.csv

  # Search for specific field
  search_field "founders"
EOF
}

# =============================================================================
# AUTO-RUN ON SOURCE
# =============================================================================

# If sourced, show help automatically
if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
    echo "Deeper Network Research Commands Loaded"
    echo "Type 'help' for available commands"
    echo "Type 'list_functions' to see all functions"
fi
