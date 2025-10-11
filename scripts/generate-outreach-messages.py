#!/usr/bin/env python3
import json
from pathlib import Path
import csv

base_dir = Path("/home/flower/Ethereum-Cypherpunk-Research")
contacts_file = base_dir / "OUTREACH_CONTACTS.json"
output_dir = base_dir / "outreach-messages"
output_dir.mkdir(exist_ok=True)

with open(contacts_file) as f:
    contacts = json.load(f)

priority_projects = [c for c in contacts if c['has_research_notes']]

print(f"📧 Generating messages for {len(contacts)} projects ({len(priority_projects)} priority)")

# Generate GitHub issues
github_issues = []
for contact in priority_projects:
    project = contact['project']
    category = contact['category']
    github = contact['github']
    
    if github:
        org_name = github.rstrip('/').split('/')[-1]
        message = f"""[@{org_name}] Please verify research data

Hi @{org_name}, we've included **{project}** in our privacy research:
https://github.com/M0nkeyFl0wer/ethereum-cypherpunk-research/tree/main/{category}/{project}/

We're missing blockchain metrics. See: {category}/{project}/reports/RESEARCH_NOTES.md

Can you help add contract addresses or verify our findings?
"""
        github_issues.append({'project': project, 'org': org_name, 'message': message})

with open(output_dir / 'github-issues.md', 'w') as f:
    f.write(f"# GitHub Issues ({len(github_issues)})\n\n")
    for i, issue in enumerate(github_issues, 1):
        f.write(f"## {i}. {issue['project']}\n\n{issue['message']}\n---\n\n")

# Generate tracking CSV
with open(output_dir / 'outreach-tracking.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['project', 'category', 'website', 'github', 'needs_update', 'contacted', 'responded'])
    writer.writeheader()
    for c in contacts:
        writer.writerow({
            'project': c['project'],
            'category': c['category'],
            'website': c['website'] or '',
            'github': c['github'] or '',
            'needs_update': 'YES' if c['has_research_notes'] else 'NO',
            'contacted': '',
            'responded': ''
        })

print(f"✅ Created: github-issues.md ({len(github_issues)} issues)")
print(f"✅ Created: outreach-tracking.csv")
