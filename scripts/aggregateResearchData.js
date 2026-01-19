// Aggregate research data from deliverables for Obsidian-style graph visualization
// Reads from deliverables/*/analysis/*.json
// Outputs public/data/research-graph.json

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DELIVERABLES_DIR = path.join(ROOT_DIR, 'deliverables');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'data');

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

console.log('🔍 Aggregating research data for graph visualization...\n');

// Track all unique values for graph nodes (REAL DATA ONLY)
const languages = new Map();      // language -> { count, projects[] }
const topics = new Map();         // github topic -> { count, projects[] }
const licenses = new Map();       // license -> { count, projects[] }
const contributors = new Map();   // contributor username -> { contributions, projects[] }
const years = new Map();          // creation year -> { count, projects[] }

const projects = [];
const links = [];

// OSINT threshold - projects with more than this many lines in osint_data.json are "deep research"
const OSINT_THRESHOLD = 100;

/**
 * Read JSON file safely
 */
function readJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (e) {
    console.log(`  ⚠️  Failed to parse: ${path.basename(filePath)}`);
  }
  return null;
}

/**
 * Count lines in a file
 */
function countLines(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8').split('\n').length;
    }
  } catch (e) {}
  return 0;
}

/**
 * Normalize a string for use as node ID
 */
function normalizeId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Add to tracking map with project reference
 */
function trackValue(map, value, projectId) {
  if (!value) return;
  const existing = map.get(value) || { count: 0, projects: [] };
  existing.count++;
  existing.projects.push(projectId);
  map.set(value, existing);
}

// Process each deliverable
const projectDirs = fs.readdirSync(DELIVERABLES_DIR).filter(name => {
  const fullPath = path.join(DELIVERABLES_DIR, name);
  return fs.statSync(fullPath).isDirectory() && name !== 'incognito'; // Exclude incomplete
});

console.log(`Found ${projectDirs.length} project directories\n`);

for (const projectId of projectDirs) {
  const projectPath = path.join(DELIVERABLES_DIR, projectId);
  const analysisPath = path.join(projectPath, 'analysis');

  console.log(`Processing: ${projectId}`);

  // Read GitHub analysis (PRIMARY SOURCE OF REAL DATA)
  const githubData = readJSON(path.join(analysisPath, 'github_analysis.json'));

  // Check for OSINT data
  const osintPath = path.join(analysisPath, 'osint_data.json');
  const osintLines = countLines(osintPath);
  const osintData = osintLines > OSINT_THRESHOLD ? readJSON(osintPath) : null;

  // Read constitutional research for fallback info
  const constData = readJSON(path.join(projectPath, 'constitutional_research.json'));

  // Determine tier
  const hasOsint = osintLines > OSINT_THRESHOLD;
  const tier = hasOsint ? 'osint' : 'standard';

  if (hasOsint) {
    console.log(`  ✨ OSINT Deep Dive (${osintLines} lines)`);
  }

  // Extract creation year
  const createdAt = githubData?.created_at;
  const createdYear = createdAt ? createdAt.substring(0, 4) : null;

  // Build project node with REAL DATA
  const project = {
    id: projectId,
    name: githubData?.repo_name || constData?.project_name || projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    type: 'project',
    tier,
    osintLines: hasOsint ? osintLines : 0,
    // GitHub metrics (REAL)
    stars: githubData?.stars || 0,
    forks: githubData?.forks || 0,
    contributors: githubData?.contributors || 0,
    openIssues: githubData?.open_issues || 0,
    primaryLanguage: githubData?.primary_language || null,
    description: githubData?.description || constData?.description || '',
    website: githubData?.homepage || '',
    github: githubData?.github_url || '',
    createdAt: createdAt || null,
    createdYear: createdYear,
    // Real categorization data
    topics: githubData?.topics || [],
    license: githubData?.license || null,
    languages: [],
    topContributors: [],
    // OSINT data if available
    osint: hasOsint ? {
      domain: osintData?.osint_sources?.shodan?.domain || null,
      subdomainCount: osintData?.osint_sources?.shodan?.subdomains?.length || 0,
      tags: osintData?.osint_sources?.shodan?.tags || [],
    } : null,
  };

  // Extract languages from GitHub (REAL DATA)
  // Handle both formats: array of strings OR array of objects with {name, percentage, bytes}
  if (githubData?.languages && githubData.languages.length > 0) {
    githubData.languages.forEach((lang, idx) => {
      let langName, langPercentage, langBytes;

      if (typeof lang === 'string') {
        // Simple string format - assign decreasing weight by position
        langName = lang;
        langPercentage = Math.max(1, 100 - (idx * 15)); // Primary lang gets most weight
        langBytes = 0;
      } else if (typeof lang === 'object' && lang.name) {
        // Object format with {name, percentage, bytes}
        langName = lang.name;
        langPercentage = lang.percentage || 1;
        langBytes = lang.bytes || 0;
        // Skip very small percentages
        if (langPercentage < 1) return;
      } else {
        return;
      }

      const langId = normalizeId(langName);
      project.languages.push({
        name: langName,
        percentage: langPercentage,
        bytes: langBytes,
      });
      trackValue(languages, langName, projectId);

      // Create link
      links.push({
        source: projectId,
        target: `lang-${langId}`,
        type: 'uses_language',
        weight: langPercentage,
      });
    });
  }

  // Extract GitHub topics (REAL DATA)
  if (githubData?.topics) {
    githubData.topics.forEach(topic => {
      trackValue(topics, topic, projectId);
      links.push({
        source: projectId,
        target: `topic-${normalizeId(topic)}`,
        type: 'tagged_with',
      });
    });
  }

  // Extract license (REAL DATA)
  if (githubData?.license) {
    trackValue(licenses, githubData.license, projectId);
    links.push({
      source: projectId,
      target: `license-${normalizeId(githubData.license)}`,
      type: 'licensed_under',
    });
  }

  // Extract top contributors (REAL DATA)
  if (githubData?.top_contributors) {
    githubData.top_contributors.slice(0, 5).forEach(contrib => {
      project.topContributors.push({
        username: contrib.username,
        contributions: contrib.contributions,
        avatar: contrib.avatar_url,
      });

      // Track cross-project contributors
      const existing = contributors.get(contrib.username) || {
        contributions: 0,
        projects: [],
        avatar: contrib.avatar_url,
      };
      existing.contributions += contrib.contributions;
      if (!existing.projects.includes(projectId)) {
        existing.projects.push(projectId);
      }
      contributors.set(contrib.username, existing);
    });
  }

  // Track creation year
  if (createdYear) {
    trackValue(years, createdYear, projectId);
  }

  projects.push(project);
}

// Build all nodes
const nodes = [];

// Add project nodes
projects.forEach(p => {
  nodes.push({
    id: p.id,
    name: p.name,
    type: 'project',
    tier: p.tier,
    size: Math.log(p.stars + 1) * 3 + 10,
    stars: p.stars,
    forks: p.forks,
    contributors: p.contributors,
    description: p.description,
    website: p.website,
    github: p.github,
    osintLines: p.osintLines,
    createdYear: p.createdYear,
    license: p.license,
    topicCount: p.topics.length,
  });
});

// Add language nodes (REAL)
languages.forEach((data, name) => {
  nodes.push({
    id: `lang-${normalizeId(name)}`,
    name,
    type: 'language',
    size: Math.log(data.count + 1) * 6 + 8,
    count: data.count,
    projects: data.projects,
  });
});

// Add topic nodes (REAL)
topics.forEach((data, name) => {
  nodes.push({
    id: `topic-${normalizeId(name)}`,
    name,
    type: 'topic',
    size: Math.log(data.count + 1) * 5 + 6,
    count: data.count,
    projects: data.projects,
  });
});

// Add license nodes (REAL)
licenses.forEach((data, name) => {
  nodes.push({
    id: `license-${normalizeId(name)}`,
    name,
    type: 'license',
    size: Math.log(data.count + 1) * 5 + 8,
    count: data.count,
    projects: data.projects,
  });
});

// Find multi-project contributors for network visualization
const multiProjectContributors = [];
contributors.forEach((data, username) => {
  if (data.projects.length >= 2) {
    multiProjectContributors.push({
      username,
      projects: data.projects,
      totalContributions: data.contributions,
      avatar: data.avatar,
    });

    // Add contributor node
    nodes.push({
      id: `contrib-${normalizeId(username)}`,
      name: username,
      type: 'contributor',
      size: Math.log(data.contributions + 1) * 2 + 5,
      contributions: data.contributions,
      projectCount: data.projects.length,
      avatar: data.avatar,
    });

    // Add links from contributor to their projects
    data.projects.forEach(projId => {
      links.push({
        source: `contrib-${normalizeId(username)}`,
        target: projId,
        type: 'contributes_to',
      });
    });
  }
});

// Flag projects with insufficient data
const INSUFFICIENT_DATA_PROJECTS = ['fileverse', 'starkex', 'typhoon-network', 'zk-money'];

projects.forEach(p => {
  p.dataQuality = INSUFFICIENT_DATA_PROJECTS.includes(p.id) ? 'insufficient' : 'complete';
});

// Build output
const osintProjects = projects.filter(p => p.tier === 'osint' && p.dataQuality === 'complete').map(p => p.id);
const standardProjects = projects.filter(p => p.tier === 'standard' && p.dataQuality === 'complete').map(p => p.id);
const insufficientDataProjects = projects.filter(p => p.dataQuality === 'insufficient').map(p => p.id);

// Calculate timeline data
const timelineData = [];
years.forEach((data, year) => {
  timelineData.push({
    year: parseInt(year),
    count: data.count,
    projects: data.projects,
  });
});
timelineData.sort((a, b) => a.year - b.year);

const output = {
  nodes,
  links,
  projects: projects.map(p => ({
    id: p.id,
    name: p.name,
    tier: p.tier,
    stars: p.stars,
    forks: p.forks,
    contributors: p.contributors,
    openIssues: p.openIssues,
    description: p.description,
    website: p.website,
    github: p.github,
    primaryLanguage: p.primaryLanguage,
    languages: p.languages,
    topics: p.topics,
    license: p.license,
    createdAt: p.createdAt,
    createdYear: p.createdYear,
    topContributors: p.topContributors,
    osintLines: p.osintLines,
    osint: p.osint,
    dataQuality: p.dataQuality,
  })),
  metadata: {
    osintProjects,
    standardProjects,
    insufficientDataProjects,
    totalProjects: projects.length,
    completeProjects: osintProjects.length + standardProjects.length,
    osintCount: osintProjects.length,
    standardCount: standardProjects.length,
    insufficientCount: insufficientDataProjects.length,
    nodeStats: {
      languages: languages.size,
      topics: topics.size,
      licenses: licenses.size,
      multiProjectContributors: multiProjectContributors.length,
    },
    totalStars: projects.reduce((sum, p) => sum + p.stars, 0),
    totalContributors: projects.reduce((sum, p) => sum + p.contributors, 0),
    generatedAt: new Date().toISOString(),
  },
  // Aggregated data for visualizations
  aggregations: {
    byLanguage: Array.from(languages.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      projects: data.projects,
    })).sort((a, b) => b.count - a.count),

    byTopic: Array.from(topics.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      projects: data.projects,
    })).sort((a, b) => b.count - a.count),

    byLicense: Array.from(licenses.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      projects: data.projects,
    })).sort((a, b) => b.count - a.count),

    byYear: timelineData,

    multiProjectContributors: multiProjectContributors.sort((a, b) => b.projects.length - a.projects.length),

    topByStars: projects
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 15)
      .map(p => ({ id: p.id, name: p.name, stars: p.stars, tier: p.tier })),
  },
  // Filter options for UI
  filters: {
    languages: Array.from(languages.keys()).sort(),
    topics: Array.from(topics.keys()).sort(),
    licenses: Array.from(licenses.keys()).sort(),
    years: timelineData.map(t => t.year),
    tiers: ['osint', 'standard'],
  },
};

// Write output
const outputPath = path.join(OUTPUT_DIR, 'research-graph.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log('\n' + '='.repeat(60));
console.log('RESEARCH GRAPH SUMMARY (REAL DATA ONLY)');
console.log('='.repeat(60));
console.log(`Total projects: ${projects.length}`);
console.log(`  OSINT Deep Dives: ${osintProjects.length} (${osintProjects.join(', ')})`);
console.log(`  Standard Research: ${standardProjects.length}`);
console.log(`  Insufficient Data: ${insufficientDataProjects.length} (${insufficientDataProjects.join(', ')})`);
console.log(`\nGitHub Metrics:`);
console.log(`  Total Stars: ${output.metadata.totalStars.toLocaleString()}`);
console.log(`  Total Contributors: ${output.metadata.totalContributors.toLocaleString()}`);
console.log(`\nGraph Nodes (REAL DATA):`);
console.log(`  Languages: ${languages.size}`);
console.log(`  Topics: ${topics.size}`);
console.log(`  Licenses: ${licenses.size}`);
console.log(`  Multi-project Contributors: ${multiProjectContributors.length}`);
console.log(`  Total Nodes: ${nodes.length}`);
console.log(`  Total Links: ${links.length}`);
console.log(`\nTop Languages:`);
Array.from(languages.entries())
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 5)
  .forEach(([name, data]) => console.log(`  ${name}: ${data.count} projects`));
console.log(`\nTop Topics:`);
Array.from(topics.entries())
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 5)
  .forEach(([name, data]) => console.log(`  ${name}: ${data.count} projects`));
console.log(`\nTimeline:`);
timelineData.forEach(t => console.log(`  ${t.year}: ${t.count} projects`));
console.log(`\n✅ Generated: ${outputPath}`);
console.log('='.repeat(60));
