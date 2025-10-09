const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'data', 'projects.json');
const OUTPUT_SEARCH = path.join(ROOT_DIR, 'public', 'data', 'search-index.json');

// Directories to exclude (not project directories)
const EXCLUDE_DIRS = [
  'node_modules', 'public', 'app', 'components', 'lib', 'styles',
  '.git', '.next', 'out', 'scripts', 'batch', '.claude-flow', '.hive-mind',
  'Web3-Privacy-Ethereum-Cypherpunks-Report', 'semaphoreconstitutional_research.json',
  '--target'
];

console.log('🔍 Scanning for project directories...');

// Get all project directories
const PROJECT_DIRS = fs.readdirSync(ROOT_DIR).filter(name => {
  const fullPath = path.join(ROOT_DIR, name);
  try {
    const stat = fs.statSync(fullPath);
    return stat.isDirectory() &&
           !name.startsWith('.') &&
           !EXCLUDE_DIRS.includes(name);
  } catch (e) {
    return false;
  }
});

console.log(`📂 Found ${PROJECT_DIRS.length} potential project directories`);

const projects = [];
const searchIndex = [];

for (const projectName of PROJECT_DIRS) {
  const projectPath = path.join(ROOT_DIR, projectName);

  // Check for project metadata
  const metadataPath = path.join(projectPath, 'project_metadata.json');
  const readmePath = path.join(projectPath, 'README.md');
  const cardPath = path.join(projectPath, 'card.md');

  let metadata = null;
  let hasReadme = fs.existsSync(readmePath);
  let hasCard = fs.existsSync(cardPath);

  if (fs.existsSync(metadataPath)) {
    try {
      const content = fs.readFileSync(metadataPath, 'utf8');
      metadata = JSON.parse(content);
    } catch (e) {
      console.warn(`⚠️  Failed to parse metadata for ${projectName}:`, e.message);
    }
  }

  // Build project summary
  // Normalize privacy_techniques and tech_stack to always be string arrays
  const normalizeArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => {
      if (typeof item === 'string') return item;
      // Extract name from complex objects
      return item.technique || item.name || item.technology || 'Unknown';
    });
  };

  const project = {
    slug: projectName,
    name: metadata?.name || projectName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    category: metadata?.category || 'Uncategorized',
    website: metadata?.website || null,
    description: metadata?.description || 'Privacy-focused Web3 project',
    privacyTechniques: normalizeArray(metadata?.privacy_techniques),
    techStack: normalizeArray(metadata?.tech_stack),
    hasReadme,
    hasCard,
    completeness: calculateCompleteness(metadata, hasReadme, hasCard),
  };

  projects.push(project);

  // Add to search index
  searchIndex.push({
    slug: projectName,
    name: project.name,
    category: project.category,
    description: project.description,
    searchableText: [
      project.name,
      project.category,
      project.description,
      ...(Array.isArray(project.privacyTechniques) ? project.privacyTechniques : []),
      ...(Array.isArray(project.techStack) ? project.techStack : []),
    ].join(' ').toLowerCase(),
  });
}

function calculateCompleteness(metadata, hasReadme, hasCard) {
  if (!metadata) return 0;

  let score = 0;
  let total = 10;

  if (metadata.name) score++;
  if (metadata.description) score++;
  if (metadata.website) score++;
  if (metadata.category) score++;
  if (metadata.privacy_techniques?.length > 0) score++;
  if (metadata.tech_stack?.length > 0) score++;
  if (metadata.github_url) score++;
  if (hasReadme) score++;
  if (hasCard) score++;
  if (metadata.team?.length > 0) score++;

  return Math.round((score / total) * 100);
}

// Ensure output directories exist
const publicDataDir = path.join(ROOT_DIR, 'public', 'data');
fs.mkdirSync(publicDataDir, { recursive: true });

// Write projects.json
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2));
console.log(`✅ Generated ${OUTPUT_FILE} with ${projects.length} projects`);

// Write search-index.json
fs.writeFileSync(OUTPUT_SEARCH, JSON.stringify(searchIndex, null, 2));
console.log(`✅ Generated ${OUTPUT_SEARCH} with ${searchIndex.length} entries`);

// Generate stats
const stats = {
  totalProjects: projects.length,
  withReadme: projects.filter(p => p.hasReadme).length,
  withCard: projects.filter(p => p.hasCard).length,
  avgCompleteness: Math.round(projects.reduce((sum, p) => sum + p.completeness, 0) / projects.length),
  categories: [...new Set(projects.map(p => p.category))].sort(),
};

console.log('\n📊 Project Statistics:');
console.log(`   Total Projects: ${stats.totalProjects}`);
console.log(`   With README: ${stats.withReadme}`);
console.log(`   With Card: ${stats.withCard}`);
console.log(`   Avg Completeness: ${stats.avgCompleteness}%`);
console.log(`   Categories: ${stats.categories.join(', ')}`);
console.log('');
