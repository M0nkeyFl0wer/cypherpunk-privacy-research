/**
 * TypeScript Data Schemas (TASK-007)
 * Generated from JSON Schema contracts in /specs/004-interactive-github-pages/contracts/
 * 
 * Constitutional Requirements:
 * - All data must have confidence scores (0.0-1.0)
 * - Sources array required for verification
 * - Missing fields must be reported, not fabricated
 */

/**
 * Project category types
 */
export type ProjectCategory =
  | 'mixing'
  | 'zero-knowledge'
  | 'secure-computation'
  | 'anonymous-messaging'
  | 'privacy-infrastructure'
  | 'privacy-wallet'
  | 'layer2-privacy'
  | 'other';

/**
 * Privacy techniques
 */
export type PrivacyTechnique =
  | 'zk-SNARKs'
  | 'zk-STARKs'
  | 'ring-signatures'
  | 'stealth-addresses'
  | 'coin-mixing'
  | 'secure-multi-party-computation'
  | 'trusted-execution-environment'
  | 'other';

/**
 * Blockchain platforms
 */
export type BlockchainPlatform =
  | 'ethereum'
  | 'polygon'
  | 'optimism'
  | 'arbitrum'
  | 'zksync'
  | 'starknet'
  | 'other';

/**
 * Project development status
 */
export type ProjectStatus =
  | 'active'
  | 'inactive'
  | 'deprecated'
  | 'in-development'
  | 'mainnet'
  | 'testnet'
  | 'unknown';

/**
 * Project maturity level
 */
export type MaturityLevel =
  | 'experimental'
  | 'beta'
  | 'production'
  | 'mature'
  | 'unknown';

/**
 * Data source types
 */
export type SourceType =
  | 'web3privacy-api'
  | 'github-api'
  | 'website'
  | 'manual'
  | 'other';

/**
 * Data source with confidence scoring
 * CONSTITUTIONAL REQUIREMENT: Multi-source verification (Article I Section 1.2)
 */
export interface DataSource {
  type: SourceType;
  url: string;
  retrieved_at: string; // ISO 8601 date-time
  confidence: number; // 0.0-1.0
}

/**
 * Data quality metrics
 */
export interface DataQuality {
  completeness?: number; // 0.0-1.0 percentage of fields filled
  accuracy?: number; // 0.0-1.0 confidence in accuracy
  freshness?: number; // 0.0-1.0 how recent is the data
  verification_count?: number; // Number of sources verified
}

/**
 * Team member information
 */
export interface TeamMember {
  name?: string;
  role?: string;
  github?: string;
  twitter?: string;
}

/**
 * Contact information
 */
export interface Contacts {
  email?: string;
  discord?: string;
  telegram?: string;
}

/**
 * Social media links
 */
export interface SocialLinks {
  twitter?: string;
  discord?: string;
  telegram?: string;
  medium?: string;
  mirror?: string;
}

/**
 * Complete Project Data Schema
 * CONSTITUTIONAL REQUIREMENTS:
 * - confidence: REQUIRED (0.0-1.0)
 * - sources: REQUIRED (min 1 source)
 * - missing_fields: REQUIRED (gap reporting)
 */
export interface ProjectData {
  // Core identifiers
  id: string; // Unique identifier (lowercase, hyphenated)
  name: string; // Project display name
  slug?: string; // URL-friendly name
  
  // Basic info
  description?: string;
  website?: string;
  github?: string;
  documentation?: string;
  
  // Classification
  category?: ProjectCategory;
  subcategories?: ProjectCategory[];
  tech_stack?: string[];
  privacy_techniques?: PrivacyTechnique[];
  blockchain_platforms?: BlockchainPlatform[];
  
  // Status
  status?: ProjectStatus;
  maturity_level?: MaturityLevel;
  last_update?: string; // ISO 8601 date-time
  launch_date?: string; // ISO 8601 date
  
  // Constitutional compliance (REQUIRED)
  confidence: number; // 0.0-1.0 REQUIRED per CONSTITUTION.md Article I
  data_quality?: DataQuality;
  missing_fields?: string[]; // REQUIRED for gap reporting (Article IV)
  sources: DataSource[]; // REQUIRED min 1 source (Article I Section 1.2)
  verified?: boolean;
  
  // File paths
  readme_path?: string;
  card_path?: string;
  metadata_files?: string[];
  
  // Optional detailed info
  team?: TeamMember[];
  contacts?: Contacts;
  social_links?: SocialLinks;
  investors?: string[];
  
  // Computed fields
  search_index_excerpt?: string; // First 500 chars
  related_projects?: string[]; // Project IDs with shared tech
}

/**
 * Lightweight project data for search results
 * Used in search index to minimize bundle size
 */
export interface SearchableProject {
  id: string;
  name: string;
  description?: string;
  tech_stack?: string[];
  privacy_techniques?: string[];
  category?: ProjectCategory;
  confidence: number; // REQUIRED
  excerpt?: string; // First 500 chars
  card_summary?: string;
  readme_path: string;
  card_path?: string;
  status?: ProjectStatus;
  maturity_level?: MaturityLevel;
  platforms?: string[];
  missing_fields?: string[]; // Gap reporting
}

/**
 * Search index structure
 * Generated at build time by build-search-index.js
 */
export interface SearchIndex {
  version: string; // Semantic versioning
  generated_at: string; // ISO 8601 timestamp
  total_projects: number;
  projects: SearchableProject[];
  lunr_index: string; // Serialized Lunr.js index (base64)
  filters: {
    categories: string[];
    tech_stacks: string[];
    privacy_techniques: string[];
    platforms: string[];
  };
  statistics?: {
    avg_confidence?: number;
    avg_completeness?: number;
    projects_by_category?: Record<string, number>;
    projects_by_status?: Record<string, number>;
  };
}

/**
 * Chat message types
 */
export type ChatRole = 'user' | 'assistant';

/**
 * Source citation for AI responses
 * CONSTITUTIONAL REQUIREMENT: All quotes must be cited (CC-005)
 */
export interface SourceCitation {
  project_id: string;
  file_path: string;
  section?: string;
  quote: string; // EXACT quoted text (no paraphrasing)
  line_numbers?: [number, number]; // [start, end]
}

/**
 * Chat message
 */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string; // ISO 8601
  sources?: SourceCitation[]; // For assistant messages
  is_quote_only?: boolean; // Constitutional compliance check
  retrieved_projects?: string[];
  contains_inference?: boolean; // Violation flag
  contains_paraphrasing?: boolean; // Violation flag
}

/**
 * Chat request to API
 */
export interface ChatRequest {
  query: string; // 3-500 chars
  conversation_history?: ChatMessage[]; // Max 10 for performance
  max_projects?: number; // 1-20, default 10
}

/**
 * Validation results for constitutional compliance
 */
export interface ValidationResult {
  is_constitutional: boolean;
  contains_inference: boolean; // false = good
  contains_paraphrasing: boolean; // false = good
  all_quotes_cited: boolean; // true = good
  violations?: string[];
}

/**
 * Chat API response
 */
export interface ChatResponse {
  answer: string; // MUST be quote-only per CC-005
  sources: SourceCitation[]; // REQUIRED for all quotes
  validation: ValidationResult;
  retrieved_projects: string[];
  cache_hit?: boolean;
  error?: string;
}

/**
 * Feedback form types
 */
export type FeedbackType =
  | 'missing-project'
  | 'incorrect-data'
  | 'update-needed'
  | 'feature-request'
  | 'general-feedback';

/**
 * Missing project submission data
 */
export interface MissingProjectData {
  name: string;
  website: string; // URI format
  github?: string; // GitHub URL
  description: string; // Min 20 chars
  privacy_tech: string[]; // Min 1 item
  relevance_justification: string; // Min 30 chars
}

/**
 * Incorrect data correction
 */
export interface IncorrectDataCorrection {
  field_name: string;
  current_value: string;
  correct_value: string;
  evidence_urls: string[]; // Min 1 URL
}

/**
 * Update needed information
 */
export interface UpdateNeededInfo {
  what_changed: string; // Min 20 chars
  evidence_urls: string[]; // Min 1 URL
}

/**
 * Feedback form submission
 */
export interface FeedbackSubmission {
  feedback_type: FeedbackType;
  project_id?: string; // For existing projects
  project_name?: string;
  issue_description: string; // Min 10 chars, REQUIRED
  
  // Conditional fields based on feedback_type
  missing_project_data?: MissingProjectData;
  incorrect_data?: IncorrectDataCorrection;
  update_needed?: UpdateNeededInfo;
  
  // Optional
  evidence_urls?: string[];
  contact_email?: string; // For follow-up
  
  // System fields
  submitted_at: string; // ISO 8601
  user_agent?: string; // For spam detection
  honeypot_value?: string; // MUST be empty (spam detection)
  
  // Response fields (set after processing)
  github_issue_url?: string;
  github_issue_number?: number;
}

/**
 * Visualization data structures
 */

/**
 * Network graph node
 */
export interface NetworkNode {
  id: string;
  name: string;
  category: ProjectCategory;
  confidence: number;
  tech_stack: string[];
  privacy_techniques: string[];
}

/**
 * Network graph edge
 */
export interface NetworkEdge {
  source: string; // Project ID
  target: string; // Project ID
  weight: number; // Number of shared technologies
  shared_tech: string[];
}

/**
 * Time-series data point
 */
export interface TimeSeriesPoint {
  date: string; // ISO 8601 date
  project_id: string;
  project_name: string;
  category: ProjectCategory;
}

/**
 * Category distribution
 */
export interface CategoryDistribution {
  category: string;
  count: number;
  percentage: number;
}

/**
 * Visualization data bundle
 */
export interface VisualizationData {
  network: {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
  };
  timeline: TimeSeriesPoint[];
  categories: CategoryDistribution[];
  generated_at: string; // ISO 8601
}
