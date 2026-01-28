#!/usr/bin/env node
/**
 * Fix Data Pipeline Script
 * Pulls verified research data from verified_data.json into display files
 */

const fs = require('fs');
const path = require('path');

const DELIVERABLES_DIR = path.join(__dirname, '..', 'deliverables');

// Projects to process
const projects = fs.readdirSync(DELIVERABLES_DIR).filter(f => {
  const stat = fs.statSync(path.join(DELIVERABLES_DIR, f));
  return stat.isDirectory();
});

console.log(`Found ${projects.length} projects\n`);

const results = {
  fixed: [],
  noVerifiedData: [],
  alreadyHasData: [],
  errors: []
};

for (const project of projects) {
  const projectDir = path.join(DELIVERABLES_DIR, project);
  const verifiedDataPath = path.join(projectDir, 'sources', 'verified_data.json');
  const metadataPath = path.join(projectDir, 'project_metadata.json');
  const teamMdPath = path.join(projectDir, 'reports', 'TEAM.md');

  // Check if verified_data.json exists
  if (!fs.existsSync(verifiedDataPath)) {
    results.noVerifiedData.push(project);
    continue;
  }

  try {
    const verifiedData = JSON.parse(fs.readFileSync(verifiedDataPath, 'utf8'));
    const metadata = fs.existsSync(metadataPath)
      ? JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
      : {};

    // Check if already has data
    if (metadata.team && metadata.team.length > 0) {
      results.alreadyHasData.push(project);
      continue;
    }

    // Extract data from verified_data.json
    const tier1 = verifiedData.tier_1_essential_data || {};
    const tier2 = verifiedData.tier_2_core_data || {};
    const tier3 = verifiedData.tier_3_extended_data || {};

    // Build team array
    const team = [];
    if (tier2.founders) {
      const founders = tier2.founders;
      if (founders.primary_founder) {
        const f = founders.primary_founder;
        team.push({
          name: f.name || f.full_name,
          role: f.role || 'Founder',
          github: f.github || f.github_url,
          linkedin: f.linkedin,
          background: f.background,
          verified: true,
          sources: f.sources ? f.sources.slice(0, 3) : []
        });
      }
      if (founders.co_founders) {
        for (const cf of founders.co_founders) {
          team.push({
            name: cf.name,
            role: cf.role || 'Co-founder',
            github: cf.github,
            linkedin: cf.linkedin,
            background: cf.background,
            verified: !!cf.verified,
            sources: cf.sources ? cf.sources.slice(0, 3) : []
          });
        }
      }
    }

    // Add team from tier3
    if (tier3.team && tier3.team.verified_core_team) {
      for (const member of tier3.team.verified_core_team) {
        // Skip if already added as founder
        if (team.find(t => t.name === member.name || t.github === member.username)) continue;
        team.push({
          name: member.name || member.username,
          role: member.role || 'Core Team',
          github: member.username,
          background: member.background,
          contributions: member.contributions,
          verified: true
        });
      }
    }

    // Update metadata
    const updatedMetadata = {
      ...metadata,
      name: metadata.name || (tier1.name?.value) || project,
      description: tier1.description?.value || metadata.description || '',
      website: tier1.website_url?.value || metadata.website || '',
      github: tier1.github_url?.value || metadata.github || '',
      documentation: tier3.documentation?.main_docs?.url || metadata.documentation || '',
      category: tier1.category?.value || metadata.category || 'other',
      status: tier2.status?.value || metadata.status || 'unknown',
      team: team,
      social_links: {
        twitter: tier3.social_links?.twitter?.url || metadata.social_links?.twitter || '',
        discord: tier3.social_links?.discord?.url || metadata.social_links?.discord || '',
        telegram: tier3.social_links?.telegram?.url || metadata.social_links?.telegram || '',
        medium: metadata.social_links?.medium || '',
        mirror: metadata.social_links?.mirror || '',
        blog: tier3.social_links?.blog?.url || ''
      },
      last_update: new Date().toISOString().split('T')[0],
      confidence: verifiedData.data_quality_assessment?.overall_confidence || 0.8
    };

    // Add legal entity if available
    if (verifiedData.legal_entity) {
      updatedMetadata.legal_entity = {
        name: verifiedData.legal_entity.name,
        registration: verifiedData.legal_entity.registration_number,
        location: verifiedData.legal_entity.registered_address,
        founded: verifiedData.legal_entity.incorporation_date
      };
    }

    // Write updated metadata
    fs.writeFileSync(metadataPath, JSON.stringify(updatedMetadata, null, 2));

    // Generate TEAM.md
    let teamMd = `# Team & Leadership\n\n`;
    teamMd += `*Research Date: ${verifiedData.research_metadata?.research_date?.split('T')[0] || 'Unknown'} | Updated: ${new Date().toISOString().split('T')[0]}*\n\n`;
    teamMd += `---\n\n`;

    if (verifiedData.legal_entity) {
      teamMd += `## Company\n\n`;
      teamMd += `**${verifiedData.legal_entity.name}**\n`;
      if (verifiedData.legal_entity.registration_number) {
        teamMd += `- Registration: ${verifiedData.legal_entity.registration_number}\n`;
      }
      if (verifiedData.legal_entity.registered_address) {
        teamMd += `- Address: ${verifiedData.legal_entity.registered_address}\n`;
      }
      if (verifiedData.legal_entity.incorporation_date) {
        teamMd += `- Founded: ${verifiedData.legal_entity.incorporation_date}\n`;
      }
      teamMd += `\n---\n\n`;
    }

    if (team.length > 0) {
      teamMd += `## Core Team\n\n`;
      teamMd += `| Name | Role | GitHub | Verified |\n`;
      teamMd += `|------|------|--------|----------|\n`;
      for (const member of team) {
        const gh = member.github ? `[@${member.github.replace('https://github.com/', '')}](https://github.com/${member.github.replace('https://github.com/', '')})` : '-';
        teamMd += `| **${member.name}** | ${member.role} | ${gh} | ${member.verified ? '✅' : '⚠️'} |\n`;
      }
      teamMd += `\n`;

      // Add founder profiles
      const founders = team.filter(t => t.role?.toLowerCase().includes('founder') || t.background);
      if (founders.length > 0) {
        teamMd += `---\n\n## Founder Profiles\n\n`;
        for (const founder of founders) {
          teamMd += `### ${founder.name}\n\n`;
          teamMd += `- **Role:** ${founder.role}\n`;
          if (founder.github) teamMd += `- **GitHub:** [${founder.github}](https://github.com/${founder.github.replace('https://github.com/', '')})\n`;
          if (founder.linkedin) teamMd += `- **LinkedIn:** [Profile](${founder.linkedin})\n`;
          if (founder.background) teamMd += `- **Background:** ${founder.background}\n`;
          teamMd += `\n`;
        }
      }
    } else {
      teamMd += `## Core Team\n\n`;
      teamMd += `⚠️ **Team information requires additional research**\n\n`;
      teamMd += `Verified data exists but team details not yet extracted.\n`;
    }

    teamMd += `---\n\n## Verification\n\n`;
    teamMd += `Data sourced from verified_data.json with constitutional research methodology.\n`;
    teamMd += `Confidence: **${Math.round((verifiedData.data_quality_assessment?.overall_confidence || 0.8) * 100)}%**\n`;

    // Ensure reports dir exists
    const reportsDir = path.join(projectDir, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(teamMdPath, teamMd);

    results.fixed.push(project);
    console.log(`✅ Fixed: ${project}`);

  } catch (err) {
    results.errors.push({ project, error: err.message });
    console.log(`❌ Error: ${project} - ${err.message}`);
  }
}

console.log('\n========== SUMMARY ==========\n');
console.log(`✅ Fixed: ${results.fixed.length} projects`);
console.log(`📦 Already had data: ${results.alreadyHasData.length} projects`);
console.log(`⚠️ No verified_data.json: ${results.noVerifiedData.length} projects`);
console.log(`❌ Errors: ${results.errors.length} projects`);

if (results.noVerifiedData.length > 0) {
  console.log('\n--- Projects WITHOUT verified_data.json (need research) ---');
  results.noVerifiedData.forEach(p => console.log(`  - ${p}`));
}

if (results.errors.length > 0) {
  console.log('\n--- Errors ---');
  results.errors.forEach(e => console.log(`  - ${e.project}: ${e.error}`));
}
