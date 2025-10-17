# Bash Commands Reference

**Purpose**: Quick reference for all commands used in Web3Privacy data contribution project
**Date**: 2025-10-15

---

## Navigation & Project Structure

### View project directory structure
```bash
# See main directories
ls -la /home/flower/web3-privacy-ethereum-cypherpunk-research/

# Count total projects
ls /home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables | wc -l

# See project directories
ls deliverables/
```

### Check specific project files
```bash
# View all files in a project
ls -la deliverables/aztec-network/

# Check what analysis files exist
ls deliverables/aztec-network/analysis/

# Check what reports exist
ls deliverables/aztec-network/reports/
```

---

## Data Analysis Commands

### Run overlap analysis
```bash
# Navigate to project root
cd /home/flower/web3-privacy-ethereum-cypherpunk-research

# Run the analysis script
node scripts/analyze-overlap.js

# View results
cat analysis-output/overlap-analysis.json | jq '.'

# Count overlaps
cat analysis-output/overlap-analysis.json | jq '.overlap.count'

# See only-in-ours count
cat analysis-output/overlap-analysis.json | jq '.only_ours.count'
```

### Check project data
```bash
# View constitutional research for a project
cat deliverables/aztec-network/constitutional_research.json | jq '.' | less

# View project metadata
cat deliverables/aztec-network/project_metadata.json | jq '.'

# Check GitHub analysis
cat deliverables/aztec-network/analysis/github_analysis.json | jq '.'

# See team data
cat deliverables/aztec-network/sources/aztec-network_team_data.json | jq '.'
```

### Search across all projects
```bash
# Find all projects with specific privacy technique
grep -r "ZK-SNARKs" deliverables/*/constitutional_research.json

# Find projects with high confidence
jq 'select(.confidence > 0.8)' deliverables/*/project_metadata.json

# Count projects by category
find deliverables -name "project_metadata.json" -exec jq -r '.category' {} \; | sort | uniq -c
```

---

## Git Operations

### Check current status
```bash
# See what files changed
git status

# See short status
git status --short

# Count changed files
git status --short | wc -l

# See recent commits
git log --oneline -10
```

### View uncommitted changes
```bash
# See what's been deleted
git status --short | grep "^ D" | head -20

# See what's been modified
git status --short | grep "^ M"

# See what's been added
git status --short | grep "^A"
```

### Commit changes (when ready)
```bash
# Add specific files
git add TASK_LIST.md CONVERSION_SPEC.md PR_STRATEGY.md

# Add all documentation
git add *.md

# Commit with message
git commit -m "Add comprehensive PR strategy and conversion spec docs"

# Push to GitHub
git push origin master
```

---

## Transformation Pipeline (Once Built)

### Run full transformation
```bash
# Transform all projects
node scripts/transform-to-yaml.js

# Transform with progress output
node scripts/transform-to-yaml.js --verbose

# Resume from checkpoint
node scripts/transform-to-yaml.js --resume
```

### Transform specific categories
```bash
# Only enrichment projects (37 projects)
node scripts/transform-to-yaml.js --category=enrichment

# Only new projects (80 projects)
node scripts/transform-to-yaml.js --category=new-projects

# Test mode (5 sample projects)
node scripts/transform-to-yaml.js --test
```

### Transform individual projects
```bash
# Single project by slug
node scripts/transform-to-yaml.js --project=aztec-network

# Multiple specific projects
node scripts/transform-to-yaml.js --projects=aztec-network,railgun,tornado-cash
```

---

## Quality Assurance Commands

### Check output files
```bash
# Count transformed files
ls output/enrichment/*/index.yaml | wc -l
ls output/new-projects/*/index.yaml | wc -l

# View a transformed YAML
cat output/enrichment/aztec-network/index.yaml

# Check YAML syntax
node -e "require('js-yaml').load(require('fs').readFileSync('output/enrichment/aztec-network/index.yaml', 'utf8'))"
```

### Validate URLs
```bash
# Check if URL is accessible
curl -I https://aztec.network

# Check all URLs in a project
jq -r '.constitutional_research.project_overview.website' deliverables/aztec-network/constitutional_research.json | xargs curl -I
```

### Find issues
```bash
# Find projects with low completeness
jq 'select(.completeness < 50)' deliverables/*/project_metadata.json

# Find projects with low confidence
jq 'select(.confidence < 0.6)' deliverables/*/project_metadata.json

# Find projects missing GitHub
jq 'select(.github == null or .github == "")' deliverables/*/project_metadata.json
```

---

## Testing Commands (Once Built)

### Run tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- scripts/__tests__/fieldMapper.test.js

# Run in watch mode (during development)
npm test -- --watch
```

### Manual testing
```bash
# Test on one project
node scripts/transform-to-yaml.js --project=aztec-network --verbose

# Compare input vs output
diff <(jq '.' deliverables/aztec-network/constitutional_research.json) \
     <(cat output/enrichment/aztec-network/comparison.md)
```

---

## Report Generation

### Generate reports
```bash
# Generate all reports
node scripts/generateReports.js

# View transformation summary
cat reports/transformation-summary.md

# View in JSON format
cat reports/transformation-summary.json | jq '.'

# Check error log
cat output/errors/errors.json | jq '.'
```

### Statistics
```bash
# Count successful transformations
jq '.results[] | select(.status == "success")' reports/transformation-summary.json | wc -l

# Count errors
jq '.results[] | select(.status == "error")' reports/transformation-summary.json | wc -l

# Average confidence score
jq '[.results[].confidence] | add / length' reports/transformation-summary.json
```

---

## File Searching & Exploration

### Find specific files
```bash
# Find all JSON files
find deliverables -name "*.json" | wc -l

# Find all project metadata files
find deliverables -name "project_metadata.json"

# Find all READMEs
find deliverables -name "README.md"

# Find projects with specific file
find deliverables -name "smart_contracts.json"
```

### Search file contents
```bash
# Search for term across all files
grep -r "zero-knowledge" deliverables/

# Search in JSON files only
grep -r "ZK-SNARKs" deliverables/*/constitutional_research.json

# Count occurrences
grep -r "ZK-SNARKs" deliverables/ | wc -l

# Case insensitive search
grep -ri "privacy" deliverables/*/README.md | head -10
```

---

## Data Quality Checks

### Check for synthetic data
```bash
# Find "lorem ipsum"
grep -r "lorem ipsum" deliverables/ -i

# Find "TODO"
grep -r "TODO:" deliverables/

# Find placeholder emails
grep -r "example\.com" deliverables/ -E

# Find test data
grep -r "@test\.com" deliverables/
```

### Check data completeness
```bash
# Projects with team data
find deliverables -name "*team_data.json" | wc -l

# Projects with GitHub analysis
find deliverables -name "github_analysis.json" | wc -l

# Projects with smart contracts
find deliverables -name "smart_contracts.json" | wc -l

# Projects with audit data
grep -l "audits" deliverables/*/constitutional_research.json | wc -l
```

---

## URL Validation

### Check individual URLs
```bash
# Check website returns 200
curl -I https://aztec.network 2>&1 | head -1

# Check with timeout
curl -I --max-time 5 https://aztec.network

# Follow redirects
curl -IL https://aztec.network 2>&1 | grep "HTTP"
```

### Batch URL checking
```bash
# Extract all website URLs
jq -r '.constitutional_research.project_overview.website' deliverables/*/constitutional_research.json 2>/dev/null | sort -u

# Check status of multiple URLs (create file first)
while read url; do
  status=$(curl -I "$url" 2>&1 | head -1 | awk '{print $2}')
  echo "$status - $url"
done < urls.txt
```

---

## Performance & Monitoring

### Check system resources
```bash
# Check CPU usage
top -bn1 | head -20

# Check memory usage
free -h

# Check disk space
df -h

# Monitor process
watch -n 1 'ps aux | grep node'
```

### Performance profiling
```bash
# Time a command
time node scripts/analyze-overlap.js

# Profile with node
node --prof scripts/transform-to-yaml.js

# Check file sizes
du -sh deliverables/
du -sh output/
```

---

## Backup & Safety

### Create backups
```bash
# Backup deliverables directory
tar -czf deliverables-backup-$(date +%Y%m%d).tar.gz deliverables/

# Backup to specific location
cp -r deliverables /path/to/backup/deliverables-$(date +%Y%m%d)

# Verify backup
tar -tzf deliverables-backup-*.tar.gz | head -20
```

### Restore from backup
```bash
# Extract backup
tar -xzf deliverables-backup-20251015.tar.gz

# Restore specific project
tar -xzf deliverables-backup-*.tar.gz deliverables/aztec-network/
```

---

## Cleanup Commands

### Clean generated files
```bash
# Remove output directory
rm -rf output/

# Remove analysis output
rm -rf analysis-output/

# Remove reports
rm -rf reports/

# Clean node modules (if needed)
rm -rf node_modules/
npm install
```

### Clean git status
```bash
# Remove untracked files (BE CAREFUL!)
git clean -n  # Dry run first
git clean -f  # Actually remove

# Reset uncommitted changes (BE CAREFUL!)
git checkout -- .

# Unstage all changes
git reset HEAD .
```

---

## Useful Combinations

### Project summary
```bash
# Show project info in one command
echo "=== AZTEC NETWORK ===" && \
cat deliverables/aztec-network/project_metadata.json | jq '{name, category, status, completeness, confidence}' && \
cat deliverables/aztec-network/CARD.md | head -20
```

### Quick stats
```bash
# Show key statistics
echo "Total projects: $(ls deliverables | wc -l)" && \
echo "JSON files: $(find deliverables -name '*.json' | wc -l)" && \
echo "With team data: $(find deliverables -name '*team_data.json' | wc -l)" && \
echo "With GitHub analysis: $(find deliverables -name 'github_analysis.json' | wc -l)"
```

### Find high-quality projects
```bash
# Projects with 70%+ completeness
find deliverables -name "project_metadata.json" -exec sh -c 'jq -r "select(.completeness >= 70) | .project_name" "$1" 2>/dev/null' _ {} \;
```

---

## Package Management

### Install dependencies
```bash
# Install from package.json
npm install

# Install specific package
npm install js-yaml --save
npm install jest --save-dev

# Update packages
npm update

# Check for outdated packages
npm outdated
```

### Run npm scripts (once defined)
```bash
# Run transformation
npm run transform

# Run tests
npm test

# Generate reports
npm run reports

# Build project
npm run build
```

---

## Helpful Aliases (Add to ~/.bashrc)

```bash
# Add these to your ~/.bashrc file
alias web3-cd='cd /home/flower/web3-privacy-ethereum-cypherpunk-research'
alias web3-ls='ls /home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables'
alias web3-status='git status --short | wc -l && echo "files changed"'
alias web3-analyze='node scripts/analyze-overlap.js'
alias web3-transform='node scripts/transform-to-yaml.js'

# Reload bash config
source ~/.bashrc
```

---

## Emergency Recovery

### If transformation crashes
```bash
# Check checkpoint file
cat output/.checkpoint.json | jq '.'

# Resume from checkpoint
node scripts/transform-to-yaml.js --resume

# Check error log
cat output/errors/errors.json | jq '.errors[]' | tail -20
```

### If git is messy
```bash
# Create a safety branch
git branch safety-backup-$(date +%Y%m%d)

# Check what would be affected
git status --short | wc -l

# Commit everything to safety branch
git checkout safety-backup-*
git add .
git commit -m "Safety backup before cleanup"

# Go back to master
git checkout master
```

---

## Learning Commands

### Understand JSON structure
```bash
# Pretty print JSON
cat deliverables/aztec-network/constitutional_research.json | jq '.' | less

# Show only keys (structure)
cat deliverables/aztec-network/constitutional_research.json | jq 'keys'

# Navigate nested keys
cat deliverables/aztec-network/constitutional_research.json | jq '.project_overview | keys'

# Count array items
cat deliverables/aztec-network/constitutional_research.json | jq '.technical_architecture.privacy_technology | length'
```

### Understand command output
```bash
# Show command with explanation
man jq          # Manual for jq
man find        # Manual for find
man grep        # Manual for grep

# Get quick help
jq --help
git --help
npm --help
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-15
**Owner**: Flower (@flower)

**Note**: This file will be updated as we build more scripts and discover useful command combinations.
