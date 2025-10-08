/**
 * Zod Runtime Validators (TASK-007)
 * Runtime validation schemas for constitutional compliance
 */

import { z } from 'zod';

// Project category enum
export const ProjectCategorySchema = z.enum([
  'mixing',
  'zero-knowledge',
  'secure-computation',
  'anonymous-messaging',
  'privacy-infrastructure',
  'privacy-wallet',
  'layer2-privacy',
  'other',
]);

// Privacy technique enum
export const PrivacyTechniqueSchema = z.enum([
  'zk-SNARKs',
  'zk-STARKs',
  'ring-signatures',
  'stealth-addresses',
  'coin-mixing',
  'secure-multi-party-computation',
  'trusted-execution-environment',
  'other',
]);

// Data source validation (constitutional requirement)
export const DataSourceSchema = z.object({
  type: z.enum(['web3privacy-api', 'github-api', 'website', 'manual', 'other']),
  url: z.string().url(),
  retrieved_at: z.string().datetime(),
  confidence: z.number().min(0).max(1),
});

// Project data schema with constitutional requirements
export const ProjectDataSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  confidence: z.number().min(0).max(1), // REQUIRED
  sources: z.array(DataSourceSchema).min(1), // REQUIRED
  description: z.string().optional(),
  website: z.string().url().optional(),
  github: z.string().url().optional(),
  category: ProjectCategorySchema.optional(),
  tech_stack: z.array(z.string()).optional(),
  privacy_techniques: z.array(PrivacyTechniqueSchema).optional(),
  status: z.enum(['active', 'inactive', 'deprecated', 'in-development', 'mainnet', 'testnet', 'unknown']).optional(),
  missing_fields: z.array(z.string()).optional(),
});

// Search index schema
export const SearchIndexSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  generated_at: z.string().datetime(),
  total_projects: z.number().int().min(0),
  projects: z.array(z.any()),
  lunr_index: z.string(),
  filters: z.object({
    categories: z.array(z.string()),
    tech_stacks: z.array(z.string()),
    privacy_techniques: z.array(z.string()),
    platforms: z.array(z.string()),
  }),
});

// Chat request schema
export const ChatRequestSchema = z.object({
  query: z.string().min(3).max(500),
  conversation_history: z.array(z.any()).max(10).optional(),
  max_projects: z.number().int().min(1).max(20).default(10).optional(),
});

// Feedback submission schema
export const FeedbackSubmissionSchema = z.object({
  feedback_type: z.enum(['missing-project', 'incorrect-data', 'update-needed', 'feature-request', 'general-feedback']),
  project_id: z.string().optional(),
  issue_description: z.string().min(10),
  submitted_at: z.string().datetime(),
  honeypot_value: z.string().max(0).optional(),
});

// Synthetic data patterns for constitutional validation
export const SYNTHETIC_DATA_PATTERNS = [
  /lorem ipsum/i,
  /example\.com/,
  /@project\.com/,
  /\[Author Name\]/,
  /TODO:/i,
  /PLACEHOLDER/i,
];

// Constitutional compliance validator
export function validateConstitutionalCompliance(data: unknown): {
  valid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  try {
    const parsed = ProjectDataSchema.parse(data);
    
    if (parsed.confidence === undefined) {
      violations.push('Missing confidence score');
    }
    
    if (!parsed.sources || parsed.sources.length === 0) {
      violations.push('No data sources provided');
    }
    
    const stringFields = JSON.stringify(data);
    for (const pattern of SYNTHETIC_DATA_PATTERNS) {
      if (pattern.test(stringFields)) {
        violations.push('Synthetic data pattern detected: ' + pattern.source);
      }
    }
    
    return { valid: violations.length === 0, violations };
  } catch (error) {
    return { valid: false, violations: ['Validation failed'] };
  }
}
