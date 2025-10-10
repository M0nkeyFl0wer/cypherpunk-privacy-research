#!/bin/bash
# Manta Network Research - Quick Reference Commands
# Generated: 2025-10-08

echo "=== Manta Network Research Quick Reference ==="
echo ""

# View JSON results
echo "View JSON results:"
echo "  cat /home/flower/web3privacy-research/deliverables/manta-network/research_result.json | jq ."
echo ""

# View summary
echo "View summary:"
echo "  cat /home/flower/web3privacy-research/deliverables/manta-network/research_summary.md"
echo ""

# Validate JSON
echo "Validate JSON:"
echo "  python3 -m json.tool /home/flower/web3privacy-research/deliverables/manta-network/research_result.json > /dev/null && echo 'Valid' || echo 'Invalid'"
echo ""

# Extract specific fields
echo "Extract GitHub URL:"
echo "  cat research_result.json | jq -r '.github_data.primary_repository'"
echo ""

echo "Extract tech stack:"
echo "  cat research_result.json | jq '.tech_stack.primary_languages'"
echo ""

echo "Extract privacy techniques:"
echo "  cat research_result.json | jq '.privacy_techniques.specific_protocols'"
echo ""

# Search research
echo "Search for specific terms:"
echo "  grep -i 'groth16' research_result.json"
echo "  grep -i 'substrate' research_result.json"
echo "  grep -i 'zk-snark' research_result.json"
echo ""

# View file sizes
echo "File sizes:"
ls -lh /home/flower/web3privacy-research/deliverables/manta-network/research_*

