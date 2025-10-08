/**
 * Data Aggregation for Visualization Statistics
 * Processes all project data to extract visualization metrics
 */

import fs from 'fs';
import path from 'path';

export interface ProjectStats {
  totalProjects: number;
  averageConfidence: number;
  constitutionalCompliance: number;
  statusDistribution: Record<string, number>;
  privacyTechniques: Record<string, number>;
  techStacks: Record<string, number>;
  foundedYears: Record<string, number>;
  locations: Record<string, number>;
  categories: Record<string, number>;
}

export interface ProjectSummary {
  id: string;
  name: string;
  category: string;
  status: string;
  confidence: number;
  founded?: number;
  location?: string;
  privacyTechniques: string[];
  techStack: string[];
  website?: string;
  github?: string;
}

/**
 * Get all project directories from the repository root
 */
export function getProjectDirectories(): string[] {
  const rootDir = process.cwd();

  // Get all directories that contain project_metadata.json
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  return entries
    .filter(entry => {
      if (!entry.isDirectory()) return false;
      if (entry.name.startsWith('.')) return false;
      if (['node_modules', 'out', 'app', 'lib', 'components', 'public', 'styles', 'tests', 'scripts', 'batch', 'projects', 'opsec-summaries', 'website', 'Web3-Privacy-Ethereum-Cypherpunks-Report'].includes(entry.name)) return false;

      // Check if directory has project_metadata.json
      const metadataPath = path.join(rootDir, entry.name, 'project_metadata.json');
      return fs.existsSync(metadataPath);
    })
    .map(entry => entry.name);
}

/**
 * Load constitutional research data for a project
 */
export function loadConstitutionalResearch(projectId: string): any | null {
  try {
    const filePath = path.join(process.cwd(), projectId, 'constitutional_research.json');
    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading constitutional research for ${projectId}:`, error);
    return null;
  }
}

/**
 * Load project metadata
 */
export function loadProjectMetadata(projectId: string): any | null {
  try {
    const filePath = path.join(process.cwd(), projectId, 'project_metadata.json');
    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading metadata for ${projectId}:`, error);
    return null;
  }
}

/**
 * Extract project summary for visualization
 */
export function extractProjectSummary(projectId: string): ProjectSummary | null {
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

/**
 * Aggregate all project statistics
 */
export function aggregateProjectStats(): ProjectStats {
  const projects = getProjectDirectories();
  const summaries = projects
    .map(extractProjectSummary)
    .filter(Boolean) as ProjectSummary[];

  const stats: ProjectStats = {
    totalProjects: summaries.length,
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

  summaries.forEach(project => {
    // Confidence
    totalConfidence += project.confidence;
    if (project.confidence >= 0.7) compliantCount++;

    // Status distribution
    const status = project.status || 'unknown';
    stats.statusDistribution[status] = (stats.statusDistribution[status] || 0) + 1;

    // Privacy techniques
    project.privacyTechniques.forEach(technique => {
      if (technique) {
        stats.privacyTechniques[technique] = (stats.privacyTechniques[technique] || 0) + 1;
      }
    });

    // Tech stacks
    project.techStack.forEach(tech => {
      if (tech) {
        stats.techStacks[tech] = (stats.techStacks[tech] || 0) + 1;
      }
    });

    // Founded years
    if (project.founded) {
      const year = project.founded.toString();
      stats.foundedYears[year] = (stats.foundedYears[year] || 0) + 1;
    }

    // Locations
    if (project.location) {
      stats.locations[project.location] = (stats.locations[project.location] || 0) + 1;
    }

    // Categories
    const category = project.category || 'unknown';
    stats.categories[category] = (stats.categories[category] || 0) + 1;
  });

  stats.averageConfidence = summaries.length > 0 ? totalConfidence / summaries.length : 0;
  stats.constitutionalCompliance = summaries.length > 0 ? (compliantCount / summaries.length) * 100 : 0;

  return stats;
}

/**
 * Get all project summaries for detailed visualizations
 */
export function getAllProjectSummaries(): ProjectSummary[] {
  const projects = getProjectDirectories();
  return projects
    .map(extractProjectSummary)
    .filter(Boolean) as ProjectSummary[];
}

/**
 * Get top N items from a distribution
 */
export function getTopN<T extends Record<string, number>>(
  distribution: T,
  n: number = 10
): Array<{ name: string; count: number }> {
  return Object.entries(distribution)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}
