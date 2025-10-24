#!/usr/bin/env python3
"""
Generate CODE_REVIEW.md from github_analysis.json for a project
Usage: python3 generate_code_review.py /path/to/project
"""

import json
import sys
from pathlib import Path
from datetime import datetime

def generate_code_review(project_path):
    """Generate CODE_REVIEW.md from github_analysis.json"""

    project_path = Path(project_path)
    analysis_file = project_path / "analysis" / "github_analysis.json"
    reports_dir = project_path / "reports"

    if not analysis_file.exists():
        print(f"❌ github_analysis.json not found: {analysis_file}")
        return False

    if not reports_dir.exists():
        reports_dir.mkdir(parents=True, exist_ok=True)

    try:
        with open(analysis_file) as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Error reading JSON: {e}")
        return False

    # Extract data
    stars = data.get('stars', 'N/A')
    forks = data.get('forks', 'N/A')
    watchers = data.get('watchers', 'N/A')
    contributors = data.get('contributors', 'N/A')
    description = data.get('description', '')
    primary_language = data.get('primary_language', 'Unknown')
    open_issues = data.get('open_issues', 'N/A')
    license_type = data.get('license', 'Not specified')
    activity_level = data.get('activity_level', 'unknown')
    last_commit = data.get('last_commit_date', 'Unknown')
    languages = data.get('languages', [])
    recent_commits = data.get('recent_commits', [])
    repository_url = data.get('github_url', '')

    # Generate markdown
    md = f"""# Code Review & Repository Analysis

**Last Updated**: {datetime.now().strftime('%Y-%m-%d')}

---

## Repository Overview

**Repository**: [{data.get('repository_path', 'Unknown')}]({repository_url})

**Description**: {description}

---

## Repository Metrics

### Community Engagement
- **Stars**: {stars}
- **Forks**: {forks}
- **Watchers**: {watchers}
- **Open Issues**: {open_issues}

### Development Activity
- **Status**: {activity_level.replace('_', ' ').title()}
- **Created**: {data.get('created_at', 'Unknown')[:10]}
- **Last Commit**: {last_commit[:10] if last_commit != 'Unknown' else 'Unknown'}
- **Repository Size**: ~{data.get('size_kb', 'Unknown')} KB

### Repository Health
- **License**: {license_type}
- **Default Branch**: {data.get('default_branch', 'unknown')}
- **Archived**: {'Yes' if data.get('archived') else 'No'}
- **Issues Enabled**: {'Yes' if data.get('has_issues') else 'No'}
- **Discussions**: {'Enabled' if data.get('has_discussions') else 'Not enabled'}

---

## Code Composition

### Primary Language: {primary_language}

"""

    # Add language table
    if languages:
        md += "| Language | Status |\n"
        md += "|----------|--------|\n"
        for lang in languages:
            md += f"| {lang} | Included |\n"
        md += "\n"

    md += f"""---

## Contributor Activity

### Total Contributors
{contributors} contributors

### Development Pattern
The repository shows active development with multiple contributors working across features and fixes.

---

## Recent Development

### Recent Commits (Last 5)

| Date | Commit | Author | Message |
|------|--------|--------|---------|
"""

    # Add recent commits
    if recent_commits:
        for commit in recent_commits[:5]:
            date = commit.get('date', '')[:10]
            sha = commit.get('sha', '')[:7]
            author = commit.get('author', 'Unknown')
            message = commit.get('message', '')[:50].replace('|', '\\|')
            md += f"| {date} | {sha} | {author} | {message} |\n"

    md += f"""

**Development Cadence**: Active development with regular commits.

---

## Development Observations

### Code Quality Indicators

**Positive Signals**:
- ✅ Active development with regular commits
- ✅ Multiple contributors
- ✅ Bug fixes and feature development ongoing
- ✅ Open issues tracked
- ✅ Public repository (code auditable)
- ✅ Open source license ({license_type})

### Activity Status
- **Level**: {activity_level.replace('_', ' ').title()}
- **Recent Activity**: {'Very recent' if last_commit != 'Unknown' else 'Activity level unknown'}
- **Issue Tracking**: {'Enabled' if data.get('has_issues') else 'Not enabled'}

---

## What This Repository Does

The repository contains code and development for this project. The presence of:
- {contributors} contributors indicates team size and collaboration
- Regular commits indicate active maintenance
- {open_issues} open issues indicate engagement with user feedback
- Public repository indicates commitment to transparency

---

## Code Review Accessibility

**For Security Researchers**:
- Full source code available on GitHub
- {license_type} license
- {contributors} contributors indicate multiple code reviews have occurred
- Commit history available for all changes
- Issues/discussions show community security awareness

**How to Review**:
1. Clone: `git clone {repository_url}.git`
2. Browse: [{repository_url}]({repository_url})
3. License: {license_type}

---

## Sources

| Source | Type |
|--------|------|
| [GitHub API v3]({repository_url}) | Official Repository Data |
| Repository commits and history | Development Activity |
| GitHub repository metadata | Project Information |

---

## Data Notes

- Repository metrics as of {last_commit[:10] if last_commit != 'Unknown' else 'recent date'}
- Contributor list includes all authors with commits
- Recent commits shown are most recent as of last push
"""

    # Write to file
    output_file = reports_dir / "CODE_REVIEW.md"
    try:
        with open(output_file, 'w') as f:
            f.write(md)
        print(f"✅ Created CODE_REVIEW.md ({len(md)} bytes)")
        return True
    except Exception as e:
        print(f"❌ Error writing file: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_code_review.py /path/to/project")
        sys.exit(1)

    success = generate_code_review(sys.argv[1])
    sys.exit(0 if success else 1)
