#!/bin/bash
# Parallel Constitutional Research Batch Runner
# Runs on seshat with controlled parallelism

set -e

PROJECTS_FILE="$1"
MAX_PARALLEL="${2:-3}"
RESEARCH_DIR="/home/your-username/web3-research"
LOG_DIR="$RESEARCH_DIR/logs"
RESULTS_DIR="$RESEARCH_DIR/results"

mkdir -p "$LOG_DIR" "$RESULTS_DIR"

if [ -z "$PROJECTS_FILE" ] || [ ! -f "$PROJECTS_FILE" ]; then
    echo "Usage: $0 <projects-file> [max-parallel]"
    echo "Projects file should have one project name per line"
    exit 1
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BATCH_LOG="$LOG_DIR/batch_${TIMESTAMP}.log"

echo "Starting batch research at $(date)" | tee "$BATCH_LOG"
echo "Projects file: $PROJECTS_FILE" | tee -a "$BATCH_LOG"
echo "Max parallel: $MAX_PARALLEL" | tee -a "$BATCH_LOG"
echo "---" | tee -a "$BATCH_LOG"

# Count projects
TOTAL=$(wc -l < "$PROJECTS_FILE")
echo "Total projects: $TOTAL" | tee -a "$BATCH_LOG"

# Run with GNU parallel if available, otherwise xargs
if command -v parallel &> /dev/null; then
    cat "$PROJECTS_FILE" | parallel -j "$MAX_PARALLEL" --progress \
        "./research-runner.sh {} 2>&1 | tee -a $LOG_DIR/{}.log"
else
    cat "$PROJECTS_FILE" | xargs -P "$MAX_PARALLEL" -I {} bash -c \
        "./research-runner.sh {} 2>&1 | tee -a $LOG_DIR/{}.log"
fi

# Summary
COMPLETED=$(ls "$RESULTS_DIR" 2>/dev/null | wc -l)
echo "---" | tee -a "$BATCH_LOG"
echo "Batch complete at $(date)" | tee -a "$BATCH_LOG"
echo "Completed: $COMPLETED / $TOTAL" | tee -a "$BATCH_LOG"

# Validation summary
echo "---" | tee -a "$BATCH_LOG"
echo "Validation:" | tee -a "$BATCH_LOG"
for dir in "$RESULTS_DIR"/*/; do
    project=$(basename "$dir")
    latest=$(ls -t "$dir"/*.json 2>/dev/null | head -1)
    if [ -f "$latest" ]; then
        if jq -e '.overall_confidence' "$latest" > /dev/null 2>&1; then
            conf=$(jq -r '.overall_confidence' "$latest")
            echo "  $project: OK (confidence: $conf)" | tee -a "$BATCH_LOG"
        else
            echo "  $project: INVALID JSON" | tee -a "$BATCH_LOG"
        fi
    else
        echo "  $project: NO OUTPUT" | tee -a "$BATCH_LOG"
    fi
done
