#!/usr/bin/env node
/**
 * Overlap Analysis Script
 * Compares projects in our repository with Web3Privacy Explorer
 *
 * Generates:
 * - List of projects in both repositories (candidates for enrichment)
 * - Projects only in ours (candidates for new additions)
 * - Projects only in theirs (gaps we could fill)
 */

const fs = require('fs');
const path = require('path');

// Load our projects data
const ourProjectsPath = path.join(__dirname, '../public/data/projects.json');
const ourProjects = JSON.parse(fs.readFileSync(ourProjectsPath, 'utf8'));

console.log('📊 Web3Privacy Data Overlap Analysis\n');
console.log('=' .repeat(60));
console.log(`Our projects: ${ourProjects.length}`);
console.log(`Their projects (estimated from explorer): 745`);
console.log('=' .repeat(60));
console.log();

// Web3Privacy project list (from their explorer)
// This is a subset - would need to fetch full list from their repo
const theirProjects = [
  'monero', 'zcash', 'firo', 'grin', 'beam',
  'samourai-wallet', 'wasabi-wallet', 'brave-wallet', 'cake-wallet',
  'aztec', 'zk-email', 'semaphore', 'noir',
  'mullvad-vpn', 'protonvpn', 'mysterium', 'orchid',
  'session', 'status', 'jami', 'waku',
  'brightid', 'holonym', 'iden3', 'cheqd',
  'railgun', 'tornado-cash', 'secret-network', 'nym',
  'polygon-id', 'polygon-nightfall', 'manta-network',
  'penumbra', 'phala-network', 'scroll', 'taiko',
  'litentry', 'sismo', 'mask-network', 'panther-protocol',
  'darkfi', 'elusiv', 'firn-protocol', 'brume-wallet',
  'railway-wallet', 'frame', 'ten', 'nillion'
];

// Normalize project names for comparison
function normalizeProjectName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Create normalized lookup for our projects
const ourProjectsNormalized = new Map();
ourProjects.forEach(project => {
  const normalized = normalizeProjectName(project.name);
  ourProjectsNormalized.set(normalized, project);
});

// Categorize projects
const inBoth = [];
const onlyInOurs = [];
const onlyInTheirs = [];

// Check which of their projects we have
theirProjects.forEach(theirProject => {
  const normalized = normalizeProjectName(theirProject);
  if (ourProjectsNormalized.has(normalized)) {
    const ourProject = ourProjectsNormalized.get(normalized);
    inBoth.push({
      name: ourProject.name,
      slug: ourProject.slug,
      theirSlug: theirProject,
      completeness: ourProject.completeness,
      hasDetailedData: ourProject.privacyTechniques?.length > 0 || ourProject.techStack?.length > 0
    });
  } else {
    onlyInTheirs.push(theirProject);
  }
});

// Find projects only in ours
ourProjects.forEach(ourProject => {
  const normalized = normalizeProjectName(ourProject.name);
  if (!theirProjects.map(p => normalizeProjectName(p)).includes(normalized)) {
    onlyInOurs.push({
      name: ourProject.name,
      slug: ourProject.slug,
      category: ourProject.category,
      completeness: ourProject.completeness,
      privacyTechniques: ourProject.privacyTechniques?.length || 0,
      techStack: ourProject.techStack?.length || 0
    });
  }
});

// Print results
console.log('✅ PROJECTS IN BOTH REPOSITORIES (Enrichment Candidates)');
console.log('=' .repeat(60));
console.log(`Total: ${inBoth.length} projects\n`);

// Sort by completeness descending
inBoth.sort((a, b) => b.completeness - a.completeness);

console.log('Top candidates for enrichment PR (highest quality data):\n');
inBoth.slice(0, 15).forEach((project, idx) => {
  const quality = project.hasDetailedData ? '✨ Rich data' : '⚠️  Basic data';
  console.log(`${idx + 1}. ${project.name.padEnd(25)} | Completeness: ${project.completeness}% | ${quality}`);
});

console.log('\n');
console.log('🆕 PROJECTS ONLY IN OUR REPOSITORY (New Addition Candidates)');
console.log('=' .repeat(60));
console.log(`Total: ${onlyInOurs.length} projects\n`);

// Sort by completeness descending
onlyInOurs.sort((a, b) => b.completeness - a.completeness);

console.log('Top candidates for new project PR (highest quality data):\n');
onlyInOurs.slice(0, 20).forEach((project, idx) => {
  const quality = project.privacyTechniques > 5 ? '✨' : project.privacyTechniques > 0 ? '📝' : '⚠️ ';
  console.log(`${idx + 1}. ${project.name.padEnd(25)} | Cat: ${project.category.padEnd(15)} | ${quality} ${project.privacyTechniques} privacy tech`);
});

console.log('\n');
console.log('📋 PROJECTS ONLY IN THEIR REPOSITORY (Gaps We Could Fill)');
console.log('=' .repeat(60));
console.log(`Total: ${onlyInTheirs.length} projects (estimated from sample)\n`);
console.log('Sample projects to research:');
onlyInTheirs.slice(0, 15).forEach((project, idx) => {
  console.log(`${idx + 1}. ${project}`);
});

console.log('\n');
console.log('=' .repeat(60));
console.log('📈 SUMMARY STATISTICS');
console.log('=' .repeat(60));
console.log(`Projects we can enrich: ${inBoth.length}`);
console.log(`Projects we can add: ${onlyInOurs.length}`);
console.log(`Research gaps to fill: ${onlyInTheirs.length}+`);
console.log(`Estimated total coverage after merge: ${ourProjects.length + onlyInTheirs.length}+ projects`);

// Generate JSON output for further processing
const analysisResult = {
  timestamp: new Date().toISOString(),
  our_total: ourProjects.length,
  their_estimated: 745,
  overlap: {
    count: inBoth.length,
    projects: inBoth
  },
  only_ours: {
    count: onlyInOurs.length,
    projects: onlyInOurs
  },
  only_theirs: {
    count: onlyInTheirs.length,
    projects: onlyInTheirs.map(slug => ({ slug }))
  }
};

const outputPath = path.join(__dirname, '../analysis-output/overlap-analysis.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(analysisResult, null, 2));

console.log(`\n✅ Detailed analysis saved to: analysis-output/overlap-analysis.json`);
