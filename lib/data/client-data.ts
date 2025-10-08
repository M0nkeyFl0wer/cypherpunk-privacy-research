/**
 * Client-Side Data Access (No Filesystem Operations)
 *
 * This module provides runtime access to pre-generated project data
 * All data is loaded from static JSON files generated at build time
 */

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

export interface ProjectIndex {
  generated_at: string;
  projects: ProjectSummary[];
  stats: ProjectStats;
}

let cachedData: ProjectIndex | null = null;

/**
 * Load project index from static JSON (client-side safe)
 */
export async function loadProjectIndex(): Promise<ProjectIndex> {
  if (cachedData) return cachedData;

  try {
    // Use basePath-aware path for GitHub Pages deployment
    const basePath = process.env.NODE_ENV === 'production' ? '/web3-privacy-ethereum-cypherpunk-research' : '';
    const response = await fetch(`${basePath}/data/projects.json`);
    if (!response.ok) {
      throw new Error(`Failed to load project index: ${response.statusText}`);
    }
    const data: ProjectIndex = await response.json();
    cachedData = data;
    return data;
  } catch (error) {
    console.error('Error loading project index:', error);
    // Return empty data structure as fallback
    return {
      generated_at: new Date().toISOString(),
      projects: [],
      stats: {
        totalProjects: 0,
        averageConfidence: 0,
        constitutionalCompliance: 0,
        statusDistribution: {},
        privacyTechniques: {},
        techStacks: {},
        foundedYears: {},
        locations: {},
        categories: {},
      },
    };
  }
}

/**
 * Get all project summaries
 */
export async function getAllProjectSummaries(): Promise<ProjectSummary[]> {
  const data = await loadProjectIndex();
  return data.projects;
}

/**
 * Get project statistics
 */
export async function getProjectStats(): Promise<ProjectStats> {
  const data = await loadProjectIndex();
  return data.stats;
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
