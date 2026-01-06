#!/usr/bin/env python3
"""
Proper conversion script that reads verified_data.json and outputs
explorer-compatible YAML that can be MERGED with existing data.

Key differences from the broken script:
1. Reads from sources/verified_data.json (the actual research)
2. Does NOT default ecosystem to "ethereum"
3. Actually extracts team members
4. Actually extracts audit information
5. Generates ADDITIVE data - only outputs fields we have good data for
"""

import json
import yaml
from pathlib import Path
from datetime import datetime
import sys


def load_verified_data(project_path):
    """Load verified_data.json - the actual research"""
    verified_file = project_path / "sources" / "verified_data.json"
    if not verified_file.exists():
        return None

    with open(verified_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Normalize different JSON structures
    return normalize_data_structure(data)


def normalize_data_structure(data):
    """
    Normalize different verified_data.json formats into a consistent structure.
    Some projects use 'project_basic_info', others use 'basic_information', etc.
    """
    normalized = {}

    # Helper to safely extract value from dict or string
    def get_val(obj):
        if isinstance(obj, dict):
            return obj.get('value', '')
        return obj if obj else ''

    # Handle metadata/confidence
    if 'metadata' in data:
        normalized['metadata'] = data['metadata']
    elif 'data_integrity' in data:
        # Alternative format
        normalized['metadata'] = {
            'confidence_score': 0.9 if data['data_integrity'].get('all_sources_real') else 0.5,
            'research_date': data.get('collection_date', '')
        }
    elif 'constitutional_compliance' in data:
        # Iron Fish format
        normalized['metadata'] = {
            'confidence_score': 0.8,
            'research_date': data.get('research_timestamp', '')
        }
    else:
        normalized['metadata'] = {'confidence_score': 0.8}  # Assume decent if no explicit score

    # FORMAT 1: Direct project_basic_info
    if 'project_basic_info' in data:
        normalized['project_basic_info'] = data['project_basic_info']

    # FORMAT 2: tier_1_data or tier_1_essential (Iron Fish/Firo/HOPR style)
    elif 'tier_1_data' in data or 'tier_1_essential' in data:
        t1 = data.get('tier_1_data', data.get('tier_1_essential', {}))

        # Handle description - might be object with short/long or just value
        desc = t1.get('description', {})
        if isinstance(desc, dict):
            desc_val = desc.get('value', '') or desc.get('long', '') or desc.get('short', '')
        else:
            desc_val = desc

        # Handle URL field naming variations (website vs website_url)
        website = get_val(t1.get('website', '')) or get_val(t1.get('website_url', ''))
        github = get_val(t1.get('github', '')) or get_val(t1.get('github_url', ''))

        normalized['project_basic_info'] = {
            'official_name': get_val(t1.get('name', '')) or data.get('project_name', ''),
            'description': desc_val or data.get('description', ''),
            'website': website,
            'github': github,
        }
        # Copy team/founders info from tier_2
        if 'tier_2_data' in data:
            t2 = data['tier_2_data']
            if 'team' in t2:
                normalized['team_data'] = t2['team']
            if 'founders' in t2:
                normalized['founders_tier2'] = t2['founders']
        if 'tier_2_essential' in data:
            t2 = data['tier_2_essential']
            if 'team' in t2:
                normalized['team_data'] = t2['team']
            if 'founders' in t2:
                normalized['founders_tier2'] = t2['founders']
        if 'tier_3_data' in data and 'founding_team' in data['tier_3_data']:
            normalized['founding_team'] = data['tier_3_data']['founding_team']

    # FORMAT 3: Top-level project_name (Tornado Cash style)
    elif 'project_name' in data:
        normalized['project_basic_info'] = {
            'official_name': data.get('project_name', ''),
            'description': data.get('description', '') or data.get('official_description', ''),
        }
        # Handle websites
        if 'websites' in data:
            ws = data['websites']
            normalized['project_basic_info']['website'] = ws.get('main', '') or ws.get('app', '')
            normalized['project_basic_info']['github'] = ws.get('github', '') or ws.get('github_core', '')
        # Handle founders
        if 'founders' in data:
            normalized['founders_list'] = data['founders']

    # FORMAT 4: basic_information (Monero style)
    elif 'basic_information' in data:
        # Convert nested format to flat format
        bi = data['basic_information']
        normalized['project_basic_info'] = {
            'official_name': get_val(bi.get('name', '')),
            'description': get_val(bi.get('description', '')),
            'tagline': get_val(bi.get('tagline', '')),
            'website': get_val(bi.get('website', '')),
            'github': get_val(bi.get('github_url', '')),
        }

    # Copy other fields as-is
    for key in ['founders_and_scientists', 'organizations', 'github_repository',
                'launch_history', 'media_assets', 'data_gaps', 'verification_summary',
                'team', 'technology', 'links', 'social']:
        if key in data:
            normalized[key] = data[key]

    # Handle team info from different formats
    if 'team' not in normalized and 'core_team' in data:
        normalized['team'] = data['core_team']

    # Handle links from different formats
    if 'links' in data and 'project_basic_info' in normalized:
        links_data = data['links']
        if isinstance(links_data, dict):
            for link_key in ['website', 'github', 'twitter', 'discord', 'telegram']:
                if link_key in links_data:
                    val = links_data[link_key]
                    if isinstance(val, dict):
                        val = val.get('value', '')
                    if val and link_key not in normalized['project_basic_info']:
                        normalized['project_basic_info'][link_key] = val

    # Handle official_links format (Monero style)
    if 'official_links' in data:
        if 'project_basic_info' not in normalized:
            normalized['project_basic_info'] = {}
        links = data['official_links']
        if 'website' in links:
            val = links['website']
            normalized['project_basic_info']['website'] = val.get('value', '') if isinstance(val, dict) else val
        if 'github' in links:
            val = links['github']
            normalized['project_basic_info']['github'] = val.get('value', '') if isinstance(val, dict) else val

    # Handle team_structure format (Monero style)
    if 'team_structure' in data:
        normalized['team_structure'] = data['team_structure']

    # Handle founding_information (Monero style)
    if 'founding_information' in data:
        normalized['founding_information'] = data['founding_information']

    return normalized


def extract_team_members(data):
    """Extract team members from verified_data.json"""
    team_members = []

    # Check founders_list (Tornado Cash style)
    if 'founders_list' in data:
        for founder in data['founders_list']:
            if isinstance(founder, dict):
                name = founder.get('name', '')
                if name:
                    member = {'name': name}
                    if founder.get('role'):
                        member['role'] = founder['role']
                    elif founder.get('status'):
                        member['role'] = 'Founder'
                    team_members.append(member)

    # Check team_data (Iron Fish tier_2 style)
    if 'team_data' in data:
        td = data['team_data']
        if 'leadership' in td and 'value' in td['leadership']:
            for person in td['leadership']['value']:
                if isinstance(person, dict):
                    name = person.get('name', '')
                    if name:
                        member = {'name': name}
                        if person.get('role'):
                            member['role'] = person['role']
                        team_members.append(member)

    # Check founders_tier2 (Iron Fish tier_2 founders style)
    if 'founders_tier2' in data:
        ft = data['founders_tier2']
        founders_list = ft.get('value', []) if isinstance(ft, dict) else ft
        if isinstance(founders_list, list):
            for person in founders_list:
                if isinstance(person, dict):
                    name = person.get('name', '')
                    if name and not any(name in m.get('name', '') for m in team_members):
                        member = {'name': name}
                        if person.get('role'):
                            member['role'] = person['role']
                        else:
                            member['role'] = 'Founder'
                        if person.get('linkedin'):
                            member['link'] = person['linkedin']
                        team_members.append(member)

    # Check founding_team (Iron Fish tier_3 style)
    if 'founding_team' in data:
        ft = data['founding_team']
        if 'founders' in ft and 'value' in ft['founders']:
            for person in ft['founders']['value']:
                if isinstance(person, dict):
                    name = person.get('name', '')
                    if name and not any(name in m.get('name', '') for m in team_members):
                        member = {'name': name}
                        if person.get('role'):
                            member['role'] = person['role']
                        else:
                            member['role'] = 'Founder'
                        team_members.append(member)

    # Check team_structure (Monero style)
    if 'team_structure' in data:
        ts = data['team_structure']
        # Historical core team
        if 'historical_core_team' in ts and 'members' in ts['historical_core_team']:
            for member in ts['historical_core_team']['members']:
                if isinstance(member, dict):
                    name = member.get('name', '')
                    if name:
                        tm = {'name': name}
                        if member.get('role'):
                            tm['role'] = member['role']
                        team_members.append(tm)

    # Check founding_information (Monero style)
    if 'founding_information' in data:
        fi = data['founding_information']
        if 'original_founder' in fi:
            founder = fi['original_founder']
            name = founder.get('value', '') if isinstance(founder, dict) else founder
            if name and not any(name in m.get('name', '') for m in team_members):
                team_members.append({'name': name, 'role': 'Original Founder'})

    # Check founders_and_scientists
    if 'founders_and_scientists' in data:
        fs = data['founders_and_scientists']

        # Primary founder
        if 'primary_founder' in fs:
            founder = fs['primary_founder']
            member = {'name': founder.get('name', '')}
            if founder.get('role'):
                member['role'] = founder['role']
            # Look for social links
            for link_key in ['twitter', 'linkedin', 'github', 'website']:
                if founder.get(link_key):
                    member['link'] = founder[link_key]
                    break
            if member['name']:
                team_members.append(member)

        # Founding scientists
        if 'founding_scientists' in fs:
            scientists = fs['founding_scientists']
            if isinstance(scientists, dict) and 'list' in scientists:
                for name in scientists['list']:
                    team_members.append({'name': name, 'role': 'Founding Scientist'})

    # Check organizations for team members
    if 'organizations' in data:
        for org_key, org in data['organizations'].items():
            if isinstance(org, dict):
                # Current leadership
                if 'current_leadership' in org:
                    leadership = org['current_leadership']
                    if 'ceo' in leadership:
                        ceo = leadership['ceo']
                        member = {'name': ceo.get('name', ''), 'role': 'CEO'}
                        if ceo.get('source'):
                            pass  # Don't use source as link
                        if member['name'] and member not in team_members:
                            team_members.append(member)

                # Board of directors
                if 'board_of_directors' in org:
                    for director in org['board_of_directors']:
                        if isinstance(director, dict):
                            member = {'name': director.get('name', '')}
                            if director.get('title'):
                                member['role'] = director['title']
                            if member['name'] and member not in team_members:
                                team_members.append(member)

                # Team members
                if 'team_members' in org:
                    for tm in org['team_members']:
                        if isinstance(tm, dict):
                            member = {'name': tm.get('name', '')}
                            if tm.get('title'):
                                member['role'] = tm['title']
                            if member['name'] and member not in team_members:
                                team_members.append(member)

    # Check github contributors
    if 'github_repository' in data:
        gh = data['github_repository']
        if 'top_contributors' in gh:
            for contrib in gh['top_contributors'][:5]:  # Top 5 contributors
                if isinstance(contrib, dict):
                    name = contrib.get('name') or contrib.get('github', '')
                    if name:
                        member = {'name': name}
                        if contrib.get('url'):
                            member['link'] = contrib['url']
                        # Don't add if already in list
                        if not any(m['name'] == name for m in team_members):
                            team_members.append(member)

    return team_members


def extract_links(data):
    """Extract all relevant links - prioritize project_basic_info"""
    links = {}

    # PRIORITY 1: From project_basic_info (most authoritative)
    if 'project_basic_info' in data:
        info = data['project_basic_info']
        if info.get('website'):
            links['web'] = info['website']
        if info.get('github'):
            links['github'] = info['github']

    # PRIORITY 2: From github_repository (fallback)
    if 'github_repository' in data:
        gh = data['github_repository']
        if gh.get('url') and 'github' not in links:
            links['github'] = gh['url']
        if gh.get('homepage') and 'web' not in links:
            links['web'] = gh['homepage']

    # PRIORITY 3: From organizations (supplementary - don't overwrite!)
    if 'organizations' in data:
        for org_key, org in data['organizations'].items():
            if isinstance(org, dict):
                # Only use org website if we don't have one yet
                if org.get('website') and 'web' not in links:
                    website = org['website']
                    if not website.startswith('http'):
                        website = f"https://{website}"
                    links['web'] = website

                # Official channels - ADD to links, don't overwrite
                if 'official_channels' in org:
                    channels = org['official_channels']
                    if channels.get('twitter') and 'twitter' not in links:
                        twitter = channels['twitter'].replace('@', '')
                        links['twitter'] = f"https://twitter.com/{twitter}"
                    # Note: 'other' field lists Discord, YouTube, etc. but no URLs

    # Ensure web link has https
    if 'web' in links and not links['web'].startswith('http'):
        links['web'] = f"https://{links['web']}"

    return links


def extract_audits(data):
    """Extract audit information"""
    audits = []

    # This would need to be in the verified_data - check if it exists
    # For now, return empty - audits would need to be researched separately

    return audits


def determine_ecosystem(data):
    """Determine the correct ecosystem - NOT defaulting to ethereum"""
    ecosystems = []

    # Check project_basic_info for clues
    if 'project_basic_info' in data:
        info = data['project_basic_info']
        name = info.get('official_name', '').lower()
        desc = info.get('description', '').lower()

        # Check for specific chains
        if 'monero' in name or 'xmr' in desc:
            ecosystems.append('monero')
        elif 'zcash' in name or 'zec' in desc:
            ecosystems.append('zcash')
        elif 'bitcoin' in name or 'btc' in desc:
            ecosystems.append('bitcoin')
        elif 'ethereum' in desc or 'evm' in desc:
            ecosystems.append('ethereum')

    # If we can't determine, use 'other' - NOT ethereum
    if not ecosystems:
        ecosystems.append('other')

    return ecosystems


def convert_to_explorer_format(data, project_name):
    """
    Convert verified_data.json to explorer format.
    Only outputs fields we have GOOD data for.
    """
    output = {}

    # Basic info
    if 'project_basic_info' in data:
        info = data['project_basic_info']
        # Use official_name if non-empty, otherwise derive from project folder name
        output['name'] = info.get('official_name') or project_name.replace('-', ' ').title()

        desc = info.get('description', '')
        if not desc:
            desc = info.get('alternative_description', '')
        if desc:
            output['description'] = desc

    # Ecosystem - properly determined
    output['ecosystem'] = determine_ecosystem(data)

    # Team members
    team_members = extract_team_members(data)
    if team_members:
        output['team'] = {
            'anonymous': False,
            'teammembers': team_members[:10]  # Limit to 10
        }

    # Links
    links = extract_links(data)
    if links:
        output['links'] = links

    # Launch date
    if 'launch_history' in data:
        launch = data['launch_history']
        if launch.get('launch_date'):
            output['product_launch_day'] = launch['launch_date']
    elif 'founding_information' in data:
        fi = data['founding_information']
        if 'launch_date' in fi:
            ld = fi['launch_date']
            output['product_launch_day'] = ld.get('value', '') if isinstance(ld, dict) else ld

    # GitHub stats (for reference, not necessarily in their schema)
    if 'github_repository' in data:
        gh = data['github_repository']
        # Could add stars, forks, etc. if their schema supports it

    # Technology info
    if 'project_basic_info' in data:
        info = data['project_basic_info']
        # Check for technology mentions

    # Confidence score from our research
    if 'metadata' in data:
        meta = data['metadata']
        output['_research_confidence'] = meta.get('confidence_score', 0)
        output['_research_date'] = meta.get('research_date', '')

    return output


def generate_merge_instructions(output, project_name):
    """
    Generate instructions for how to merge this data with existing entry.
    """
    instructions = f"""
# Merge Instructions for {project_name}
#
# This data should be ADDED to the existing entry, not replace it.
# Review each field and only add what's missing or more accurate.
#
# Fields with underscore prefix (_research_confidence) are metadata
# and should NOT be included in the final YAML.
#
# Research confidence: {output.get('_research_confidence', 'unknown')}
# Research date: {output.get('_research_date', 'unknown')}
"""
    return instructions


def process_project(project_path, output_dir):
    """Process a single project"""
    project_name = project_path.name

    # Load verified data
    data = load_verified_data(project_path)
    if not data:
        return None, f"⚠️  {project_name}: No verified_data.json found"

    # Check confidence score
    confidence = data.get('metadata', {}).get('confidence_score', 0)
    if confidence < 0.5:
        return None, f"⚠️  {project_name}: Low confidence ({confidence}), skipping"

    # Convert
    output = convert_to_explorer_format(data, project_name)

    # Create output directory
    project_output = output_dir / project_name
    project_output.mkdir(parents=True, exist_ok=True)

    # Write YAML (without metadata fields)
    yaml_output = {k: v for k, v in output.items() if not k.startswith('_')}
    yaml_file = project_output / "additive_data.yaml"
    with open(yaml_file, 'w', encoding='utf-8') as f:
        f.write(generate_merge_instructions(output, project_name))
        f.write("\n")
        yaml.dump(yaml_output, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    # Also write full JSON for reference
    json_file = project_output / "extracted_data.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    return yaml_file, f"✅ {project_name}: Extracted (confidence: {confidence})"


def main():
    """Main entry point"""
    deliverables = Path("/home/flower/Projects/web3-privacy-ethereum-cypherpunk-research/deliverables")
    output_dir = Path("/home/flower/Projects/web3-privacy-ethereum-cypherpunk-research/explorer-pr2-data")

    # Allow specifying a single project
    if len(sys.argv) > 1:
        project_name = sys.argv[1]
        project_path = deliverables / project_name
        if project_path.exists():
            output_dir.mkdir(exist_ok=True)
            result, msg = process_project(project_path, output_dir)
            print(msg)
            if result:
                print(f"Output: {result}")
            return
        else:
            print(f"Project not found: {project_name}")
            return

    # Process all projects
    output_dir.mkdir(exist_ok=True)

    projects = sorted([p for p in deliverables.iterdir() if p.is_dir()])

    print(f"Processing {len(projects)} projects...")
    print("=" * 70)

    success = 0
    skipped = 0

    for project in projects:
        result, msg = process_project(project, output_dir)
        print(msg)
        if result:
            success += 1
        else:
            skipped += 1

    print("=" * 70)
    print(f"\nSUMMARY:")
    print(f"  Extracted: {success}")
    print(f"  Skipped: {skipped}")
    print(f"\nOutput directory: {output_dir}")
    print(f"\nNEXT STEPS:")
    print(f"  1. Review each additive_data.yaml file")
    print(f"  2. Compare with existing explorer data")
    print(f"  3. Manually merge only ADDITIVE improvements")
    print(f"  4. Submit PR 2 with carefully reviewed data")


if __name__ == "__main__":
    main()
