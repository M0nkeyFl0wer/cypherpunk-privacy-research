#!/bin/bash
# BATCH 2 AUDIT COMMANDS - Reference for learning

# List all Batch 2 projects
echo "=== Batch 2 Projects ==="
ls -d /home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables/{findora,firo,fluidkey,hopr,iden3,incognito,iron-fish}

# Check README files for all projects
echo ""
echo "=== README files ==="
for project in findora firo fluidkey hopr iden3 incognito iron-fish; do
  echo "--- $project ---"
  head -10 /home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables/$project/README.md
done

# Check for CODE_REVIEW files
echo ""
echo "=== CODE_REVIEW files ==="
for project in findora firo fluidkey hopr iden3 incognito iron-fish; do
  if [ -f "/home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables/$project/reports/CODE_REVIEW.md" ]; then
    echo "✅ $project has CODE_REVIEW.md"
  else
    echo "❌ $project MISSING CODE_REVIEW.md"
  fi
done

# Check for github_analysis.json files
echo ""
echo "=== github_analysis.json files ==="
for project in findora firo fluidkey hopr iden3 incognito iron-fish; do
  if [ -f "/home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables/$project/analysis/github_analysis.json" ]; then
    stars=$(grep '"stars"' /home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables/$project/analysis/github_analysis.json)
    echo "✅ $project: $stars"
  else
    echo "❌ $project MISSING github_analysis.json"
  fi
done

# Check for smart contract research
echo ""
echo "=== Smart Contract Research ==="
for project in findora firo fluidkey hopr iden3 incognito iron-fish; do
  if [ -f "/home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables/$project/analysis/smart_contracts.json" ]; then
    echo "✅ $project has smart_contracts.json"
  elif [ -f "/home/folder/web3-privacy-ethereum-cypherpunk-research/deliverables/$project/reports/blockchain_metrics_ATTEMPTED.md" ]; then
    echo "✅ $project has blockchain_metrics_ATTEMPTED.md"
  else
    echo "❌ $project MISSING smart contract research"
  fi
done

# File size check for large reports
echo ""
echo "=== Large Report Files ==="
find /home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables/{findora,firo,fluidkey,hopr,iden3,incognito,iron-fish}/reports/ -type f -size +10k -exec ls -lh {} \; | awk '{print $9, $5}'

# Count total files per project
echo ""
echo "=== Total Files Per Project ==="
for project in findora firo fluidkey hopr iden3 incognito iron-fish; do
  count=$(find /home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables/$project -type f | wc -l)
  echo "$project: $count files"
done

# View audit reports
echo ""
echo "=== View Audit Reports ==="
echo "Full report: cat /home/flower/web3-privacy-ethereum-cypherpunk-research/BATCH_2_AUDIT_REPORT.md"
echo "Quick summary: cat /home/flower/web3-privacy-ethereum-cypherpunk-research/BATCH_2_QUICK_SUMMARY.md"
echo "Verification: cat /home/flower/web3-privacy-ethereum-cypherpunk-research/BATCH_2_VERIFICATION.txt"
