#!/bin/bash

echo "project_name|file_count|size_kb|has_analysis|has_verified_data|decision|reason"

# Get all README files with "No description available"
grep -l "No description available" /home/flower/web3-privacy-ethereum-cypherpunk-research/Web3-Privacy-Ethereum-Cypherpunks-Report/deliverables/*/README.md 2>/dev/null | while read readme_path; do
    project_dir=$(dirname "$readme_path")
    project_name=$(basename "$project_dir")
    
    # Count all files in project
    file_count=$(find "$project_dir" -type f 2>/dev/null | wc -l)
    
    # Calculate total size in KB
    size_kb=$(du -s "$project_dir" 2>/dev/null | cut -f1)
    
    # Check for analysis folder with JSON files
    has_analysis="N"
    if [ -d "$project_dir/analysis" ]; then
        json_count=$(find "$project_dir/analysis" -name "*.json" -type f 2>/dev/null | wc -l)
        if [ "$json_count" -gt 0 ]; then
            has_analysis="Y"
        fi
    fi
    
    # Check for sources/verified_data.json with actual data (>5KB)
    has_verified_data="N"
    if [ -f "$project_dir/sources/verified_data.json" ]; then
        file_size=$(stat -c%s "$project_dir/sources/verified_data.json" 2>/dev/null || stat -f%z "$project_dir/sources/verified_data.json" 2>/dev/null)
        if [ -n "$file_size" ] && [ "$file_size" -gt 5120 ]; then
            has_verified_data="Y"
        fi
    fi
    
    # Determine decision
    decision="MOVE"
    reason="No substantive analysis data"
    if [ "$has_analysis" = "Y" ] || [ "$has_verified_data" = "Y" ]; then
        decision="KEEP"
        if [ "$has_analysis" = "Y" ] && [ "$has_verified_data" = "Y" ]; then
            reason="Has both analysis/ and verified_data.json"
        elif [ "$has_analysis" = "Y" ]; then
            reason="Has analysis/ with JSON files"
        else
            reason="Has verified_data.json (>5KB)"
        fi
    fi
    
    # Output in pipe-separated format
    echo "$project_name|$file_count|$size_kb|$has_analysis|$has_verified_data|$decision|$reason"
done | sort

