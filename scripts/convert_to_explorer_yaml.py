#!/usr/bin/env python3
"""
Convert our project data format to Web3Privacy Explorer YAML format
"""

import json
import yaml
from pathlib import Path
from datetime import datetime

def extract_from_readme(readme_path):
    """Extract data from README.md"""
    import re

    with open(readme_path, 'r', encoding='utf-8') as f:
        content = f.read()

    data = {}

    # Extract description (text after ## 📝 Description)
    desc_match = re.search(r'## 📝 Description\s*\n(.+?)(?:\n##|$)', content, re.DOTALL)
    if desc_match:
        data['description'] = desc_match.group(1).strip()

    # Extract website link
    website_match = re.search(r'\*\*Website\*\*:\s*(https?://\S+)', content)
    if website_match:
        data['website'] = website_match.group(1)

    # Extract GitHub link
    github_match = re.search(r'\*\*GitHub\*\*:\s*(https?://\S+)', content)
    if github_match:
        data['github'] = github_match.group(1)

    # Extract docs link
    docs_match = re.search(r'\*\*Documentation\*\*:\s*(https?://\S+)', content)
    if docs_match:
        data['documentation'] = docs_match.group(1)

    # Extract Twitter link
    twitter_match = re.search(r'\*\*Twitter\*\*:\s*(https?://\S+)', content)
    if twitter_match:
        data['twitter'] = twitter_match.group(1)

    # Extract Discord link
    discord_match = re.search(r'\*\*Discord\*\*:\s*(https?://\S+)', content)
    if discord_match:
        data['discord'] = discord_match.group(1)

    return data

def load_project_data(project_path):
    """Load all project data from our format"""
    data = {}

    # Load project_metadata.json
    metadata_file = project_path / "project_metadata.json"
    if metadata_file.exists():
        with open(metadata_file, 'r', encoding='utf-8') as f:
            data['metadata'] = json.load(f)
    else:
        return None

    # Load github_analysis.json for additional details
    github_file = project_path / "analysis" / "github_analysis.json"
    if github_file.exists():
        with open(github_file, 'r', encoding='utf-8') as f:
            data['github'] = json.load(f)

    # Load README.md to supplement missing data
    readme_file = project_path / "README.md"
    if readme_file.exists():
        data['readme'] = extract_from_readme(readme_file)

    return data

def map_category(our_category):
    """Map our categories to their categories"""
    # Their categories: defi, currency, infrastructure, wallets, computing-network,
    # layer-2, hardware, vpn, did, dao, bridge, messaging, browser, kyc, rpc, os

    category_map = {
        'privacy-wallet': 'wallets',
        'non-custodial-wallet': 'wallets',
        'multi-currency-wallet': 'wallets',
        'mobile-wallet': 'wallets',
        'desktop-wallet': 'wallets',
        'privacy-protocol': 'infrastructure',
        'zkp-technology': 'infrastructure',
        'defi': 'defi',
        'layer2': 'layer-2',
        'messaging': 'messaging',
        'browser': 'browser',
        'vpn': 'vpn',
    }

    return category_map.get(our_category, 'infrastructure')

def map_ecosystem(blockchain_platforms):
    """Map blockchain platforms to ecosystem"""
    ecosystem_map = {
        'Bitcoin': 'Ethereum',  # They use Ethereum as default
        'Ethereum': 'Ethereum',
        'Monero': 'Monero',
        'Litecoin': 'Litecoin',
        'Polygon': 'Polygon',
        'Arbitrum': 'Arbitrum',
        'Optimism': 'Optimism',
        'Base': 'Base',
        'zkSync': 'zkSync',
    }

    ecosystems = []
    for platform in blockchain_platforms:
        mapped = ecosystem_map.get(platform, platform)
        if mapped not in ecosystems:
            ecosystems.append(mapped)

    return ecosystems if ecosystems else ['Ethereum']

def convert_to_explorer_format(project_data, project_name):
    """Convert our format to Web3Privacy Explorer YAML format"""

    metadata = project_data.get('metadata', {})
    github = project_data.get('github', {})
    readme = project_data.get('readme', {})

    # Helper function to get data from metadata or README fallback
    def get_field(field_name, default=''):
        # Try metadata first
        value = metadata.get(field_name, '')
        # If empty or missing, try README
        if not value and field_name in readme:
            value = readme[field_name]
        # If still empty, try github
        if not value and field_name in github:
            value = github[field_name]
        return value or default

    # Start building the YAML structure
    explorer_data = {}

    # Basic data
    name = get_field('name', project_name)
    if not name or name == project_name:
        # Capitalize project name
        name = project_name.replace('-', ' ').title()
    explorer_data['name'] = name

    # Categories - map from our category to theirs
    category = metadata.get('category', 'privacy-wallet')
    explorer_data['categories'] = [map_category(category)]

    # Ecosystem
    blockchain_platforms = metadata.get('blockchain_platforms', ['Ethereum'])
    explorer_data['ecosystem'] = map_ecosystem(blockchain_platforms)

    # Usecases - determine from our subcategories
    subcategories = metadata.get('subcategories', [])
    usecases = []
    if 'non-custodial-wallet' in subcategories:
        usecases.append('Wallet')
    if category == 'defi':
        usecases.append('DeFi')
    if 'privacy-protocol' in str(category):
        usecases.append('Privacy')
    if not usecases:
        usecases = ['Privacy']
    explorer_data['usecases'] = usecases

    # Description - prioritize README description
    description = get_field('description', '')
    # Truncate if too long
    if len(description) > 200:
        description = description[:197] + '...'
    explorer_data['description'] = description

    # Product launch day
    launch_date = metadata.get('launch_date', '')
    if launch_date:
        explorer_data['product_launch_day'] = launch_date

    # Team
    team_data = metadata.get('team', [])
    team_section = {'anonymous': len(team_data) == 0}

    if team_data:
        teammembers = []
        for member in team_data:
            member_entry = {'name': member.get('name', '')}
            # Add link if available (prefer LinkedIn, then Twitter, then GitHub)
            if member.get('linkedin'):
                member_entry['link'] = member['linkedin']
            elif member.get('twitter'):
                member_entry['link'] = member['twitter']
            elif member.get('github'):
                member_entry['link'] = member['github']

            if member.get('role'):
                member_entry['role'] = member['role']

            teammembers.append(member_entry)

        team_section['teammembers'] = teammembers

    explorer_data['team'] = team_section

    # Links - use get_field helper
    links = {}
    website = get_field('website')
    if website:
        links['web'] = website

    github_url = get_field('github')
    if not github_url and github.get('html_url'):
        github_url = github['html_url']
    if github_url:
        links['github'] = github_url

    docs = get_field('documentation')
    if docs:
        links['docs'] = docs

    # Social links - try both metadata and README
    twitter = get_field('twitter')
    if not twitter:
        social = metadata.get('social_links', {})
        twitter = social.get('twitter', '')
    if twitter:
        links['twitter'] = twitter

    discord = get_field('discord')
    if not discord:
        social = metadata.get('social_links', {})
        discord = social.get('discord', '')
    if discord:
        links['discord'] = discord

    social = metadata.get('social_links', {})
    if social.get('telegram'):
        links['telegram'] = social['telegram']
    if social.get('medium'):
        links['blog'] = social['medium']
    if social.get('mirror'):
        if not links.get('blog'):
            links['blog'] = social['mirror']

    explorer_data['links'] = links

    # Project status
    status = metadata.get('status', 'active')
    maturity = metadata.get('maturity_level', 'mvp')

    version_map = {
        'prototype': 'Testnet',
        'mvp': 'MVP',
        'beta': 'Alpha',
        'mature': 'Mainnet',
        'active': 'Mainnet',
    }

    project_status = {
        'version': version_map.get(maturity, 'Mainnet')
    }
    explorer_data['project_status'] = project_status

    # Sunset
    explorer_data['sunset'] = status in ['abandoned', 'deprecated', 'sunset']

    # Blockchain features
    repo_data = metadata.get('repository', {})
    blockchain_features = {
        'opensource': True,  # All our projects are open source
        'asset_custody_type': 'non-custody',  # Default for privacy projects
    }

    # Check if upgradable (look for governance in description or features)
    desc_lower = description.lower()
    if 'dao' in desc_lower or 'governance' in desc_lower:
        blockchain_features['upgradability'] = {'enabled': True}

    explorer_data['blockchain_features'] = blockchain_features

    # Privacy features
    privacy_policy_section = {}
    if 'privacy_policy' in str(metadata.get('privacy_techniques', [])).lower():
        privacy_policy_section['defined'] = True

    if privacy_policy_section:
        explorer_data['privacy_policy'] = privacy_policy_section

    # Default privacy
    privacy_techs = metadata.get('privacy_techniques', [])
    explorer_data['default_privacy'] = len(privacy_techs) > 0

    # Traceability
    traceability = {'kyc': False}  # Privacy projects typically don't require KYC
    explorer_data['tracebility'] = traceability  # Note: they spell it "tracebility"

    # Technology
    tech_stack = metadata.get('tech_stack', [])
    if privacy_techs:
        technology = {'type': ', '.join(privacy_techs[:3])}  # First 3 privacy techniques
        explorer_data['technology'] = technology

    # Storage
    if 'decentralized' in desc_lower or 'ipfs' in desc_lower:
        explorer_data['storage'] = {'decentralized': True}

    # License
    license_name = repo_data.get('license', github.get('license', ''))
    if license_name:
        explorer_data['licences'] = license_name

    return explorer_data

def generate_yaml_for_project(project_path, output_dir):
    """Generate explorer-format YAML for a single project"""

    project_name = project_path.name

    # Load project data
    project_data = load_project_data(project_path)
    if not project_data:
        return None, f"⚠️  {project_name}: No project_metadata.json found"

    # Convert to explorer format
    explorer_data = convert_to_explorer_format(project_data, project_name)

    # Create output directory for this project
    project_output_dir = output_dir / project_name
    project_output_dir.mkdir(parents=True, exist_ok=True)

    # Write YAML file
    yaml_file = project_output_dir / "index.yaml"
    with open(yaml_file, 'w', encoding='utf-8') as f:
        yaml.dump(explorer_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    # Copy logo if exists
    logo_found = False
    media_dir = project_path / "media"
    if media_dir.exists():
        # Look for logo files
        logo_patterns = ['logo.png', 'logo.svg', 'icon.png', '*logo*.png', '*icon*.png']
        for pattern in logo_patterns:
            logo_files = list(media_dir.glob(pattern))
            if logo_files:
                logo_file = logo_files[0]
                # Copy to output directory as logo.png
                import shutil
                shutil.copy(logo_file, project_output_dir / "logo.png")
                logo_found = True
                break

    logo_status = "with logo" if logo_found else "no logo"
    return yaml_file, f"✅ {project_name}: Generated YAML ({logo_status})"

def main():
    deliverables = Path("/home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables")
    output_dir = Path("/home/flower/web3-privacy-ethereum-cypherpunk-research/explorer-export")

    # Create output directory
    output_dir.mkdir(exist_ok=True)

    projects = sorted([p for p in deliverables.iterdir() if p.is_dir()])

    print(f"Converting {len(projects)} projects to Web3Privacy Explorer format...")
    print("=" * 70)

    success_count = 0
    error_count = 0

    for project in projects:
        yaml_file, result = generate_yaml_for_project(project, output_dir)
        print(result)

        if result.startswith("✅"):
            success_count += 1
        else:
            error_count += 1

    print("=" * 70)
    print(f"\nSUMMARY:")
    print(f"  Successfully converted: {success_count}")
    print(f"  Errors/Warnings: {error_count}")
    print(f"  Total: {len(projects)}")
    print(f"\nOutput directory: {output_dir}")
    print(f"\nNext steps:")
    print(f"  1. Review generated YAML files in {output_dir}")
    print(f"  2. Fork web3privacy/explorer-data repository")
    print(f"  3. Copy projects to src/projects/ directory")
    print(f"  4. Create pull request")

if __name__ == "__main__":
    main()
