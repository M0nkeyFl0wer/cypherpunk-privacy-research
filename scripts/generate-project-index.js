#!/usr/bin/env node
/**
 * Generate Project Index for Static Site (Build-Time Script)
 *
 * Creates public/data/projects-index.json with all project summaries
 * This runs at build time, so the client-side code doesn't need fs access
 */

const fs = require('fs');
const path = require('path');

function getProjectDirectories() {
  const rootDir = process.cwd();
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  return entries
    .filter(entry => {
      if (!entry.isDirectory()) return false;
      if (entry.name.startsWith('.')) return false;
      if (['node_modules', 'out', 'app', 'lib', 'components', 'public', 'styles', 'tests', 'scripts', 'batch', 'projects', 'opsec-summaries', 'website', 'Web3-Privacy-Ethereum-Cypherpunks-Report'].includes(entry.name)) return false;

      const metadataPath = path.join(rootDir, entry.name, 'project_metadata.json');
      return fs.existsSync(metadataPath);
    })
    .map(entry => entry.name);
}

function loadConstitutionalResearch(projectId) {
  try {
    const filePath = path.join(process.cwd(), projectId, 'constitutional_research.json');
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    return null;
  }
}

function loadProjectMetadata(projectId) {
  try {
    const filePath = path.join(process.cwd(), projectId, 'project_metadata.json');
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    return null;
  }
}

function extractProjectSummary(projectId) {
  const constResearch = loadConstitutionalResearch(projectId);
  const metadata = loadProjectMetadata(projectId);

  if (!constResearch && !metadata) return null;

  const overview = constResearch?.project_overview || {};
  const techInfo = constResearch?.technical_infrastructure || {};
  const privacyInfo = constResearch?.privacy_implementation || {};

  return {
    id: projectId,
    name: overview.official_name || metadata?.project_name || projectId,
    category: metadata?.category || overview.category || 'unknown',
    status: metadata?.status || overview.current_status || 'unknown',
    confidence: constResearch?.confidence_score?.overall || 0,
    founded: overview.founded,
    location: overview.location,
    privacyTechniques: privacyInfo?.techniques || [],
    techStack: techInfo?.tech_stack || [],
    website: overview.website || metadata?.website,
    github: metadata?.github || overview.github,
  };
}

function aggregateStats(projects) {
  const stats = {
    totalProjects: projects.length,
    averageConfidence: 0,
    constitutionalCompliance: 0,
    statusDistribution: {},
    privacyTechniques: {},
    techStacks: {},
    foundedYears: {},
    locations: {},
    categories: {},
  };

  let totalConfidence = 0;
  let compliantCount = 0;

  projects.forEach(project => {
    totalConfidence += project.confidence;
    if (project.confidence >= 0.7) compliantCount++;

    const status = project.status || 'unknown';
    stats.statusDistribution[status] = (stats.statusDistribution[status] || 0) + 1;

    project.privacyTechniques.forEach(technique => {
      if (technique) {
        stats.privacyTechniques[technique] = (stats.privacyTechniques[technique] || 0) + 1;
      }
    });

    project.techStack.forEach(tech => {
      if (tech) {
        stats.techStacks[tech] = (stats.techStacks[tech] || 0) + 1;
      }
    });

    if (project.founded) {
      const year = project.founded.toString();
      stats.foundedYears[year] = (stats.foundedYears[year] || 0) + 1;
    }

    if (project.location) {
      stats.locations[project.location] = (stats.locations[project.location] || 0) + 1;
    }

    const category = project.category || 'unknown';
    stats.categories[category] = (stats.categories[category] || 0) + 1;
  });

  stats.averageConfidence = projects.length > 0 ? totalConfidence / projects.length : 0;
  stats.constitutionalCompliance = projects.length > 0 ? (compliantCount / projects.length) * 100 : 0;

  return stats;
}

// Main execution
console.log('📊 Generating project index...');

const projectDirs = getProjectDirectories();
console.log(`Found ${projectDirs.length} project directories`);

const projects = projectDirs
  .map(extractProjectSummary)
  .filter(Boolean);

console.log(`Successfully processed ${projects.length} projects`);

const stats = aggregateStats(projects);
console.log(`Average confidence: ${(stats.averageConfidence * 100).toFixed(1)}%`);

const output = {
  generated_at: new Date().toISOString(),
  projects,
  stats,
};

// Ensure public/data directory exists
const dataDir = path.join(process.cwd(), 'public', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write to public/data/projects-index.json
const outputPath = path.join(dataDir, 'projects-index.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`✅ Project index generated: ${outputPath}`);
console.log(`   ${projects.length} projects, ${Object.keys(stats.categories).length} categories`);
