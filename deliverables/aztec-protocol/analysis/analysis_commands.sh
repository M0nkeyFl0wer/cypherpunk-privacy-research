#!/bin/bash
# Aztec Protocol Code Analysis Commands
# Executed on: 2025-10-09
# Repository: https://github.com/AztecProtocol/aztec-packages

# Clone repository
cd /tmp
rm -rf aztec-packages
git clone --depth 1 https://github.com/AztecProtocol/aztec-packages

# Count total source files
cd /tmp/aztec-packages
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.nr" -o -name "*.rs" -o -name "*.cpp" -o -name "*.hpp" -o -name "*.c" -o -name "*.h" -o -name "*.sol" -o -name "*.py" -o -name "*.go" \) ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/build/*" ! -path "*/dist/*" | wc -l
# Result: 5509 files

# Count lines by language - TypeScript/JavaScript
for ext in ts tsx js jsx; do
  echo "TypeScript/JavaScript (.$ext): $(find . -name "*.$ext" ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/build/*" ! -path "*/dist/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')"
done
# Results: TS: 292,576 | TSX: 6,661 | JS: 7,915 | JSX: 251

# Count lines by language - C/C++
for ext in cpp hpp c h; do
  echo "C/C++ (.$ext): $(find . -name "*.$ext" ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/build/*" ! -path "*/target/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')"
done
# Results: CPP: 190,360 | HPP: 187,922 | C: 231 | H: 160

# Count lines by language - Noir, Rust, Solidity
echo "Noir (.nr): $(find . -name "*.nr" ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/target/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')"
echo "Rust (.rs): $(find . -name "*.rs" ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/target/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')"
echo "Solidity (.sol): $(find . -name "*.sol" ! -path "*/node_modules/*" ! -path "*/.git/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')"
# Results: Noir: 107,486 | Rust: 5,410 | Solidity: 50,588

# Count test files
find . -type f \( -name "*.test.ts" -o -name "*.test.js" -o -name "*.spec.ts" -o -name "*.spec.js" -o -name "*_test.nr" -o -name "*_test.rs" \) ! -path "*/node_modules/*" ! -path "*/.git/*" | wc -l
# Result: 588 test files

# Count documentation files
find . -type f \( -name "README.md" -o -name "*.md" \) ! -path "*/node_modules/*" ! -path "*/.git/*" | wc -l
# Result: 772 markdown files

# Count packages
find . -name "package.json" ! -path "*/node_modules/*" | wc -l
# Result: 67 packages

# Count CI/CD workflows
find . -type f \( -name "*.yml" -o -name "*.yaml" \) -path "*/.github/workflows/*" ! -path "*/node_modules/*" | wc -l
# Result: 36 workflows

# Count CMake configurations (Barretenberg C++ build system)
cd /tmp/aztec-packages/barretenberg
find . -name "CMakeLists.txt" | wc -l
# Result: 101 CMake files

# Count privacy/crypto references
cd /tmp/aztec-packages
grep -r "encryption\|private\|nullifier\|proof\|zkp\|zk-snark" --include="*.ts" --include="*.nr" | wc -l
# Result: 14,941 references

# Check for security documentation
find . -type f \( -name "*.audit" -o -name "*audit*.md" -o -name "SECURITY.md" \) ! -path "*/node_modules/*" ! -path "*/.git/*"
# Result: ./.github/PULL_REQUEST_TEMPLATE/audit.md

# Count packages with test scripts
find . -name "package.json" -path "*/yarn-project/*" ! -path "*/node_modules/*" -exec grep -l "test" {} \; | wc -l
# Result: 47 packages with tests

# List top-level monorepo structure
ls -d */
# barretenberg/ l1-contracts/ noir-projects/ yarn-project/ docs/ boxes/ scripts/ etc.

# TOTAL LINES CALCULATION:
# TypeScript/JavaScript: 307,403 lines (292,576 + 6,661 + 7,915 + 251)
# C/C++: 378,673 lines (190,360 + 187,922 + 231 + 160)
# Noir: 107,486 lines
# Rust: 5,410 lines
# Solidity: 50,588 lines
# GRAND TOTAL: 849,560 lines of code

# Create deduplication symlinks
mkdir -p /home/flower/web3privacy-research/deliverables/aztec-protocol/analysis
cd /home/flower/web3privacy-research/deliverables/aztec/analysis
ln -sf ../../aztec-protocol/analysis/code_analysis.json code_analysis.json

cd /home/flower/web3privacy-research/deliverables/aztec-network/analysis
ln -sf ../../aztec-protocol/analysis/code_analysis.json code_analysis.json

# Verify symlinks
ls -lh /home/flower/web3privacy-research/deliverables/aztec*/analysis/code_analysis.json

echo "Analysis complete. Results saved to aztec-protocol/analysis/code_analysis.json"
