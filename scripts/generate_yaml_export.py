#!/usr/bin/env python3
"""
Generate YAML export files for Web3Privacy Explorer submission
Aggregates all 43 projects with their metadata and reports
"""

import json
import yaml
from pathlib import Path
from datetime import datetime

def get_all_projects():
    """Get list of all project directories"""
    deliverables = Path("/home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables")
    return sorted([p.name for p in deliverables.iterdir() if p.is_dir()])

def extract_project_data(project_name):
    """Extract data from project directory"""
    base = Path(f"/home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables/{project_name}")

    project_data = {
        "id": project_name,
        "name": project_name.replace("-", " ").title(),
        "slug": project_name,
        "status": "active",
        "verified": True,
        "last_update": datetime.now().strftime("%Y-%m-%d"),
        "reports": {}
    }

    # Check for project_metadata.json
    metadata_file = base / "project_metadata.json"
    if metadata_file.exists():
        with open(metadata_file) as f:
            metadata = json.load(f)
            project_data.update({
                "name": metadata.get("name", project_data["name"]),
                "description": metadata.get("description", ""),
                "website": metadata.get("website", ""),
                "github": metadata.get("github", ""),
                "category": metadata.get("category", "privacy-technology"),
                "tech_stack": metadata.get("tech_stack", []),
                "privacy_techniques": metadata.get("privacy_techniques", []),
                "blockchain_platforms": metadata.get("blockchain_platforms", [])
            })

            # Repository stats
            if "repository" in metadata:
                project_data["repository"] = metadata["repository"]
    else:
        # Try to extract from README.md
        readme_file = base / "README.md"
        if readme_file.exists():
            with open(readme_file) as f:
                content = f.read()
                # Extract website
                if "**Website**:" in content:
                    for line in content.split('\n'):
                        if "**Website**:" in line and "http" in line:
                            website = line.split("http")[1].split()[0]
                            project_data["website"] = "http" + website.rstrip(')')

    # Check for reports (exclude ATTEMPTED files - they represent research attempts with no data found)
    reports_dir = base / "reports"
    if reports_dir.exists():
        for report in ["TEAM.md", "SECURITY.md", "TECHNICAL.md", "technical_analysis.md",
                      "CODE_REVIEW.md", "opsec_vulnerability_assessment.md"]:
            report_file = reports_dir / report
            if report_file.exists():
                # Use simplified key names
                key = report.replace(".md", "").replace("_", "-").lower()
                project_data["reports"][key] = f"{project_name}/reports/{report}"

        # Note: blockchain_metrics_ATTEMPTED.md and other *_ATTEMPTED.md files are NOT included
        # These represent research attempts where no data was found, per Constitutional Research v2.0.0

    return project_data

def generate_master_yaml():
    """Generate master YAML file with all projects"""
    projects = get_all_projects()

    output = {
        "version": "1.0",
        "generated_at": datetime.now().isoformat(),
        "total_projects": len(projects),
        "source": "Web3 Privacy Ethereum Cypherpunk Research",
        "projects": []
    }

    for project_name in projects:
        try:
            project_data = extract_project_data(project_name)
            output["projects"].append(project_data)
            print(f"✅ Processed: {project_name}")
        except Exception as e:
            print(f"⚠️  Error processing {project_name}: {e}")

    return output

def generate_simple_list_yaml():
    """Generate simple project list YAML"""
    projects = get_all_projects()

    output = {
        "web3_privacy_projects": []
    }

    for project_name in projects:
        base = Path(f"/home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables/{project_name}")

        # Basic info
        item = {
            "id": project_name,
            "path": f"deliverables/{project_name}",
            "reports": []
        }

        # List available reports
        reports_dir = base / "reports"
        if reports_dir.exists():
            for report_file in sorted(reports_dir.glob("*.md")):
                item["reports"].append(report_file.name)

        output["web3_privacy_projects"].append(item)

    return output

if __name__ == "__main__":
    print("Generating YAML exports...")
    print("=" * 60)

    # Generate master YAML
    print("\n1. Generating master projects YAML...")
    master_data = generate_master_yaml()

    output_file = Path("/home/flower/web3-privacy-ethereum-cypherpunk-research/projects_export.yaml")
    with open(output_file, 'w') as f:
        yaml.dump(master_data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)

    print(f"\n✅ Master YAML: {output_file}")
    print(f"   Total projects: {master_data['total_projects']}")

    # Generate simple list
    print("\n2. Generating simple project list YAML...")
    simple_data = generate_simple_list_yaml()

    simple_file = Path("/home/flower/web3-privacy-ethereum-cypherpunk-research/projects_list.yaml")
    with open(simple_file, 'w') as f:
        yaml.dump(simple_data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)

    print(f"✅ Simple list: {simple_file}")
    print(f"   Total projects: {len(simple_data['web3_privacy_projects'])}")

    print("\n" + "=" * 60)
    print("YAML export generation complete!")
