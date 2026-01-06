# Scripts

Automation scripts for Web3 privacy project research and processing.

## Main Scripts

### Data Processing

**convert_to_explorer_yaml.py**
- Converts project metadata to Web3Privacy Explorer YAML format
- Generates index.yaml files for each project
- Usage: `python3 convert_to_explorer_yaml.py`

**fix_readme_descriptions.py**
- Extracts real descriptions from github_analysis.json
- Replaces generic placeholder text in README files
- Usage: `python3 fix_readme_descriptions.py`

**integrate_images.py**
- Adds project logos to README files
- Uses GitHub raw URLs for live web display
- Usage: `python3 integrate_images.py`

### Report Generation

**generate_code_review.py**
- Generates CODE_REVIEW.md from GitHub analysis data
- Includes repository metrics, languages, activity stats
- Usage: `python3 generate_code_review.py <project-path>`

**generate_yaml_export.py**
- Generates comprehensive YAML exports
- Creates projects_export.yaml and projects_list.yaml
- Usage: `python3 generate_yaml_export.py`

### Batch Processing

**process_project.sh**
- Processes a single project through the research pipeline
- Runs all analysis and report generation
- Usage: `./process_project.sh <project-name>`

**process_batch.sh**
- Orchestrates batch processing of multiple projects
- Manages parallel agent execution
- Usage: `./process_batch.sh`

## Utilities

Located in `utilities/` subdirectory:

**analyze-overlap.js** - Analyze project overlap and categorization
**enrich-network-data.js** - Enrich network data for projects
**find-best-projects.js** - Identify high-quality projects
**generate-project-index.js** - Generate project index files
**json-to-yaml.js** - Convert JSON to YAML format
**security-audit.sh** - Run security audits on projects
**sync-cards-from-deliverables.sh** - Sync project cards with deliverables

## Development

All scripts follow the "constitutional research" methodology:
- Multi-source verification
- No intentional fabrication
- Honest gap reporting
- Confidence scoring

See main [README.md](../README.md) for methodology details.
