#!/bin/bash
# Validate research results against constitutional requirements

RESULTS_DIR="${1:-/home/your-username/web3-research/results}"

echo "Constitutional Research Validation Report"
echo "=========================================="
echo "Generated: $(date)"
echo ""

TOTAL=0
VALID=0
HIGH_CONF=0
MISSING_SOURCES=0
MISSING_GAPS=0

for dir in "$RESULTS_DIR"/*/; do
    [ -d "$dir" ] || continue
    project=$(basename "$dir")
    latest=$(ls -t "$dir"/*.json 2>/dev/null | head -1)

    ((TOTAL++))

    if [ ! -f "$latest" ]; then
        echo "FAIL: $project - no output file"
        continue
    fi

    # Check valid JSON
    if ! jq -e '.' "$latest" > /dev/null 2>&1; then
        echo "FAIL: $project - invalid JSON"
        continue
    fi

    ((VALID++))

    # Check confidence score
    conf=$(jq -r '.overall_confidence // 0' "$latest")
    if (( $(echo "$conf >= 0.8" | bc -l) )); then
        ((HIGH_CONF++))
    fi

    # Check sources array
    sources_count=$(jq -r '.sources | length // 0' "$latest")
    if [ "$sources_count" -lt 2 ]; then
        ((MISSING_SOURCES++))
        echo "WARN: $project - only $sources_count sources"
    fi

    # Check gaps reporting
    has_gaps=$(jq -e '.gaps | length > 0' "$latest" 2>/dev/null && echo "yes" || echo "no")
    if [ "$has_gaps" = "no" ]; then
        ((MISSING_GAPS++))
    fi

    # Summary line
    ecosystem=$(jq -r '.ecosystem // "unknown"' "$latest")
    category=$(jq -r '.category // "unknown"' "$latest")
    echo "OK: $project | $ecosystem | $category | conf:$conf | sources:$sources_count"
done

echo ""
echo "Summary"
echo "-------"
echo "Total projects: $TOTAL"
echo "Valid JSON: $VALID"
echo "High confidence (>=0.8): $HIGH_CONF"
echo "Missing sources (<2): $MISSING_SOURCES"
echo "Missing gaps: $MISSING_GAPS"
echo ""
echo "Constitutional Compliance: $(( VALID * 100 / TOTAL ))%"
