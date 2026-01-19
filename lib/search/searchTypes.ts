export type SearchItemType = 'project' | 'technique' | 'category' | 'tech' | 'location' | 'page';

export interface SearchItem {
  id: string;
  type: SearchItemType;
  name: string;
  description?: string;
  url: string;
  filterParam?: string; // For filtering on projects page
  icon: string;
}

// Type icons mapping
export const TYPE_ICONS: Record<SearchItemType, string> = {
  project: '🔒',
  technique: '🛡️',
  category: '📁',
  tech: '💻',
  location: '📍',
  page: '📄',
};

// Type labels for display
export const TYPE_LABELS: Record<SearchItemType, string> = {
  project: 'Project',
  technique: 'Technique',
  category: 'Category',
  tech: 'Technology',
  location: 'Location',
  page: 'Page',
};
