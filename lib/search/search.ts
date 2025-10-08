/**
 * Search Logic with Lunr.js (TASK-010)
 * Client-side search utilities for project discovery
 */

import lunr from 'lunr';
import type { SearchIndex, SearchableProject, SearchFilters } from '@/lib/data/schema';

export interface SearchResult extends SearchableProject {
  score: number; // Relevance score from Lunr
}

let cachedIndex: lunr.Index | null = null;
let cachedProjects: SearchableProject[] = [];

/**
 * Load search index from JSON
 */
export async function loadSearchIndex(): Promise<SearchIndex> {
  // Use basePath-aware path for GitHub Pages deployment
  const basePath = process.env.NODE_ENV === 'production' ? '/web3-privacy-ethereum-cypherpunk-research' : '';
  const response = await fetch(`${basePath}/data/search-index.json`);
  if (!response.ok) {
    throw new Error('Failed to load search index');
  }
  return response.json();
}

/**
 * Initialize Lunr index
 */
export async function initializeSearch(): Promise<void> {
  if (cachedIndex) return; // Already initialized
  
  const searchIndex = await loadSearchIndex();
  cachedProjects = searchIndex.projects;
  
  // Deserialize Lunr index
  cachedIndex = lunr.Index.load(JSON.parse(searchIndex.lunr_index));
}

/**
 * Search projects with query and filters
 * Returns max 20 results sorted by relevance
 */
export async function searchProjects(
  query: string,
  filters?: SearchFilters
): Promise<SearchResult[]> {
  // Initialize if needed
  if (!cachedIndex) {
    await initializeSearch();
  }
  
  let results: SearchResult[] = [];
  
  // Perform search if query provided
  if (query.trim()) {
    const searchResults = cachedIndex!.search(query);
    results = searchResults.map(result => {
      const project = cachedProjects.find(p => p.id === result.ref);
      return {
        ...project!,
        score: result.score,
      };
    });
  } else {
    // No query - return all projects
    results = cachedProjects.map(p => ({ ...p, score: 0 }));
  }
  
  // Apply filters
  if (filters) {
    results = applyFilters(results, filters);
  }
  
  // Sort by score (relevance) and limit to 20
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

/**
 * Apply filters to search results
 */
function applyFilters(
  results: SearchResult[],
  filters: SearchFilters
): SearchResult[] {
  let filtered = results;
  
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(p => 
      p.category && filters.categories!.includes(p.category)
    );
  }
  
  if (filters.tech_stacks && filters.tech_stacks.length > 0) {
    filtered = filtered.filter(p =>
      p.tech_stack?.some(tech => filters.tech_stacks!.includes(tech))
    );
  }
  
  if (filters.privacy_techniques && filters.privacy_techniques.length > 0) {
    filtered = filtered.filter(p =>
      p.privacy_techniques?.some(tech => filters.privacy_techniques!.includes(tech))
    );
  }
  
  if (filters.platforms && filters.platforms.length > 0) {
    filtered = filtered.filter(p =>
      p.platforms?.some(platform => filters.platforms!.includes(platform))
    );
  }
  
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(p =>
      p.status && filters.status!.includes(p.status)
    );
  }
  
  return filtered;
}

/**
 * Get available filter options
 */
export async function getFilterOptions(): Promise<{
  categories: string[];
  tech_stacks: string[];
  privacy_techniques: string[];
  platforms: string[];
}> {
  const searchIndex = await loadSearchIndex();
  return searchIndex.filters;
}

/**
 * Get search statistics
 */
export async function getSearchStats(): Promise<{
  total_projects: number;
  avg_confidence: number;
  avg_completeness: number;
  projects_by_category: Record<string, number>;
  projects_by_status: Record<string, number>;
}> {
  const searchIndex = await loadSearchIndex();
  return {
    total_projects: searchIndex.total_projects,
    avg_confidence: searchIndex.statistics?.avg_confidence || 0,
    avg_completeness: searchIndex.statistics?.avg_completeness || 0,
    projects_by_category: searchIndex.statistics?.projects_by_category || {},
    projects_by_status: searchIndex.statistics?.projects_by_status || {},
  };
}
