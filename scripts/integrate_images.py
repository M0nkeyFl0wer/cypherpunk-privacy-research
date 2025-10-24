#!/usr/bin/env python3
"""
Integrate media files into markdown with proper GitHub URLs
"""

import re
from pathlib import Path

GITHUB_REPO = "M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research"
GITHUB_BRANCH = "master"  # or "main" - check with git
BASE_URL = f"https://raw.githubusercontent.com/{GITHUB_REPO}/{GITHUB_BRANCH}"

def integrate_images_for_project(project_path):
    """Add images to README.md for a project"""

    project_name = project_path.name
    readme_file = project_path / "README.md"
    media_dir = project_path / "media"

    if not readme_file.exists():
        return f"⚠️  {project_name}: No README.md"

    if not media_dir.exists() or not list(media_dir.iterdir()):
        return f"⏭️  {project_name}: No media files"

    # Read README
    with open(readme_file, 'r', encoding='utf-8') as f:
        readme_content = f.read()

    # Get all media files
    media_files = sorted(media_dir.glob("*"))
    image_files = [f for f in media_files if f.suffix.lower() in ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif']]

    if not image_files:
        return f"⏭️  {project_name}: No image files in media/"

    # Check if images already integrated
    if "![" in readme_content and "media/" in readme_content:
        return f"✅ {project_name}: Images already integrated"

    # Find logo file (priority order)
    logo_file = None
    logo_patterns = ['logo.png', 'logo.svg', 'icon.png', '_logo', '_icon']

    for pattern in logo_patterns:
        for img in image_files:
            if pattern in img.name.lower():
                logo_file = img
                break
        if logo_file:
            break

    if not logo_file:
        logo_file = image_files[0]  # Use first image as fallback

    # Create image markdown
    relative_path = f"deliverables/{project_name}/media/{logo_file.name}"
    image_url = f"{BASE_URL}/{relative_path}"
    image_markdown = f"\n![{project_name} logo]({image_url})\n"

    # Insert after project title (first line starting with #)
    lines = readme_content.split('\n')
    new_lines = []
    inserted = False

    for i, line in enumerate(lines):
        new_lines.append(line)
        # Insert after first header
        if not inserted and line.startswith('# '):
            new_lines.append(image_markdown)
            inserted = True

    if not inserted:
        # No header found, insert at beginning
        new_lines.insert(0, image_markdown)

    new_readme = '\n'.join(new_lines)

    # Write back
    with open(readme_file, 'w', encoding='utf-8') as f:
        f.write(new_readme)

    return f"✅ {project_name}: Added image {logo_file.name} ({len(image_files)} total media files)"

def main():
    deliverables = Path("/home/flower/web3-privacy-ethereum-cypherpunk-research/deliverables")

    projects = sorted([p for p in deliverables.iterdir() if p.is_dir()])

    print(f"Integrating images for {len(projects)} projects...")
    print(f"GitHub URL: {BASE_URL}")
    print("=" * 70)

    added_count = 0
    skipped_count = 0
    no_media_count = 0

    for project in projects:
        result = integrate_images_for_project(project)
        print(result)

        if result.startswith("✅") and "Added" in result:
            added_count += 1
        elif result.startswith("✅"):
            skipped_count += 1
        elif result.startswith("⏭️"):
            no_media_count += 1

    print("=" * 70)
    print(f"\nSUMMARY:")
    print(f"  Images Added: {added_count}")
    print(f"  Already Integrated: {skipped_count}")
    print(f"  No Media Files: {no_media_count}")
    print(f"  Total: {len(projects)}")

if __name__ == "__main__":
    main()
