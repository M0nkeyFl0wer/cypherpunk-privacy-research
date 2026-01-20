import { SearchItem, TYPE_ICONS } from './searchTypes';

interface ProjectData {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category?: string;
  ecosystem?: string;
  privacy_techniques?: string[];
  tech_stack?: string[];
}

interface SearchIndexData {
  projects: ProjectData[];
}

// Static pages to include in search
const STATIC_PAGES: SearchItem[] = [
  {
    id: 'page-projects',
    type: 'page',
    name: 'Projects',
    description: 'Browse all privacy projects',
    url: '/projects',
    icon: TYPE_ICONS.page,
  },
  {
    id: 'page-portal',
    type: 'page',
    name: 'Research Portal',
    description: 'Interactive knowledge graph',
    url: '/portal',
    icon: TYPE_ICONS.page,
  },
  {
    id: 'page-methodology',
    type: 'page',
    name: 'Methodology',
    description: 'Research methodology and approach',
    url: '/methodology',
    icon: TYPE_ICONS.page,
  },
  {
    id: 'page-lessons',
    type: 'page',
    name: 'Lessons Learned',
    description: 'Key insights from the research',
    url: '/lessons',
    icon: TYPE_ICONS.page,
  },
];

// Known privacy techniques
const PRIVACY_TECHNIQUES = [
  'Zero-Knowledge Proofs',
  'zk-SNARKs',
  'zk-STARKs',
  'Ring Signatures',
  'Mixnets',
  'Stealth Addresses',
  'Confidential Transactions',
  'MPC (Multi-Party Computation)',
  'Homomorphic Encryption',
  'TEE (Trusted Execution Environment)',
];

// Known categories
const CATEGORIES = [
  'Privacy Infrastructure',
  'Wallet',
  'DeFi',
  'Identity',
  'Messaging',
  'Storage',
  'VPN/Network',
];

export function buildSearchIndex(data: SearchIndexData): SearchItem[] {
  const items: SearchItem[] = [];
  const seenCategories = new Set<string>();
  const seenTechniques = new Set<string>();

  // Add projects
  for (const project of data.projects) {
    items.push({
      id: project.id,
      type: 'project',
      name: project.name,
      description: project.description || undefined,
      url: `/projects/${project.slug}`,
      icon: TYPE_ICONS.project,
    });

    // Track categories
    if (project.category) {
      seenCategories.add(project.category);
    }

    // Track techniques
    if (project.privacy_techniques) {
      project.privacy_techniques.forEach((t) => seenTechniques.add(t));
    }
  }

  // Add categories (use seen + known)
  const allCategories = new Set([...seenCategories, ...CATEGORIES]);
  for (const category of allCategories) {
    items.push({
      id: `category-${category.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'category',
      name: category,
      url: `/projects?category=${encodeURIComponent(category)}`,
      filterParam: category,
      icon: TYPE_ICONS.category,
    });
  }

  // Add privacy techniques (use seen + known)
  const allTechniques = new Set([...seenTechniques, ...PRIVACY_TECHNIQUES]);
  for (const technique of allTechniques) {
    items.push({
      id: `technique-${technique.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'technique',
      name: technique,
      url: `/projects?technique=${encodeURIComponent(technique)}`,
      filterParam: technique,
      icon: TYPE_ICONS.technique,
    });
  }

  // Add static pages
  items.push(...STATIC_PAGES);

  return items;
}

// Fetch and build index (for client-side use)
export async function fetchSearchIndex(): Promise<SearchItem[]> {
  try {
    const res = await fetch('/data/search-index.json');
    const data: SearchIndexData = await res.json();
    return buildSearchIndex(data);
  } catch (error) {
    console.error('Failed to load search index:', error);
    // Return just static pages as fallback
    return STATIC_PAGES;
  }
}
