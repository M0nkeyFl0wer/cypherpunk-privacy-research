#!/usr/bin/env python3
"""
Fix README.md descriptions by extracting real descriptions from github_analysis.json
"""

import json
import re
from pathlib import Path

def fix_readme_description(project_path):
    """Extract real description from github_analysis.json and update README.md"""

    project_name = project_path.name
    readme_file = project_path / "README.md"
    github_analysis = project_path / "analysis" / "github_analysis.json"

    if not readme_file.exists():
        return f"⚠️  {project_name}: No README.md"

    if not github_analysis.exists():
        return f"⚠️  {project_name}: No github_analysis.json"

    # Read README
    with open(readme_file, 'r', encoding='utf-8') as f:
        readme_content = f.read()

    # Check if it has generic description
    generic_text = "Privacy technology project focused on Web3 security and anonymity."
    if generic_text not in readme_content:
        return f"✅ {project_name}: Already has real description"

    # Read github_analysis.json
    try:
        with open(github_analysis, 'r', encoding='utf-8') as f:
            github_data = json.load(f)
    except Exception as e:
        return f"❌ {project_name}: Error reading github_analysis.json - {e}"

    # Extract description
    description = github_data.get('description', '')

    if not description or description == "null" or len(description) < 10:
        return f"⚠️  {project_name}: No description in github_analysis.json"

    # Replace generic text with real description
    new_readme = readme_content.replace(generic_text, description)

    # Write back
    with open(readme_file, 'w', encoding='utf-8') as f:
        f.write(new_readme)

    return f"✅ {project_name}: Updated description ({len(description)} chars)"

def main():
    deliverables = Path("/home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables")

    projects = sorted([p for p in deliverables.iterdir() if p.is_dir()])

    print(f"Fixing README descriptions for {len(projects)} projects...")
    print("=" * 70)

    updated_count = 0
    skipped_count = 0
    error_count = 0

    for project in projects:
        result = fix_readme_description(project)
        print(result)

        if result.startswith("✅") and "Updated" in result:
            updated_count += 1
        elif result.startswith("✅"):
            skipped_count += 1
        else:
            error_count += 1

    print("=" * 70)
    print(f"\nSUMMARY:")
    print(f"  Updated: {updated_count}")
    print(f"  Already OK: {skipped_count}")
    print(f"  Errors/Warnings: {error_count}")
    print(f"  Total: {len(projects)}")

if __name__ == "__main__":
    main()
