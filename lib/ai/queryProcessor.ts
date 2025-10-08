/**
 * AI Query Processor
 * Processes natural language queries about Web3 privacy projects
 */

import { getAllProjectSummaries, type ProjectSummary } from '@/lib/data/client-data';

export interface QueryResult {
  type: 'projects' | 'stats' | 'recommendation' | 'general';
  message: string;
  projects?: ProjectSummary[];
  data?: any;
}

/**
 * Process natural language query
 */
export async function processQuery(query: string): Promise<QueryResult> {
  const lowerQuery = query.toLowerCase();
  const projects = await getAllProjectSummaries();

  // Search by privacy technique
  if (lowerQuery.includes('zero knowledge') || lowerQuery.includes('zk') || lowerQuery.includes('zkp')) {
    const filtered = projects.filter(p =>
      p.privacyTechniques.some(t => t.toLowerCase().includes('zero') || t.toLowerCase().includes('zk'))
    );
    return {
      type: 'projects',
      message: `Found ${filtered.length} projects using Zero-Knowledge Proofs:`,
      projects: filtered.slice(0, 10),
    };
  }

  if (lowerQuery.includes('mixing') || lowerQuery.includes('mixer') || lowerQuery.includes('tumbler')) {
    const filtered = projects.filter(p =>
      p.privacyTechniques.some(t => t.toLowerCase().includes('mix'))
    );
    return {
      type: 'projects',
      message: `Found ${filtered.length} projects using mixing/tumbling:`,
      projects: filtered.slice(0, 10),
    };
  }

  if (lowerQuery.includes('encryption') || lowerQuery.includes('encrypted')) {
    const filtered = projects.filter(p =>
      p.privacyTechniques.some(t => t.toLowerCase().includes('encrypt'))
    );
    return {
      type: 'projects',
      message: `Found ${filtered.length} projects using encryption:`,
      projects: filtered.slice(0, 10),
    };
  }

  // Search by tech stack
  if (lowerQuery.includes('rust')) {
    const filtered = projects.filter(p =>
      p.techStack.some(t => t.toLowerCase().includes('rust'))
    );
    return {
      type: 'projects',
      message: `Found ${filtered.length} projects built with Rust:`,
      projects: filtered.slice(0, 10),
    };
  }

  if (lowerQuery.includes('solidity') || lowerQuery.includes('ethereum')) {
    const filtered = projects.filter(p =>
      p.techStack.some(t => t.toLowerCase().includes('solidity')) ||
      p.name.toLowerCase().includes('ethereum')
    );
    return {
      type: 'projects',
      message: `Found ${filtered.length} Ethereum/Solidity projects:`,
      projects: filtered.slice(0, 10),
    };
  }

  // Search by status
  if (lowerQuery.includes('active') || lowerQuery.includes('mainnet')) {
    const filtered = projects.filter(p =>
      p.status.toLowerCase().includes('active') || p.status.toLowerCase().includes('mainnet')
    );
    return {
      type: 'projects',
      message: `Found ${filtered.length} active projects:`,
      projects: filtered.slice(0, 10),
    };
  }

  // Search by name
  if (lowerQuery.includes('aztec')) {
    const filtered = projects.filter(p => p.name.toLowerCase().includes('aztec'));
    return {
      type: 'projects',
      message: 'Aztec Protocol - Privacy-first L2 on Ethereum:',
      projects: filtered,
    };
  }

  if (lowerQuery.includes('tornado')) {
    const filtered = projects.filter(p => p.name.toLowerCase().includes('tornado'));
    return {
      type: 'projects',
      message: 'Tornado Cash - Ethereum privacy solution:',
      projects: filtered,
    };
  }

  if (lowerQuery.includes('zcash')) {
    const filtered = projects.filter(p => p.name.toLowerCase().includes('zcash'));
    return {
      type: 'projects',
      message: 'Zcash - Privacy-focused cryptocurrency:',
      projects: filtered,
    };
  }

  if (lowerQuery.includes('monero')) {
    const filtered = projects.filter(p => p.name.toLowerCase().includes('monero'));
    return {
      type: 'projects',
      message: 'Monero - Privacy by default cryptocurrency:',
      projects: filtered,
    };
  }

  // Statistics queries
  if (lowerQuery.includes('how many') || lowerQuery.includes('total')) {
    return {
      type: 'stats',
      message: `There are **${projects.length} Web3 privacy projects** in the database, covering zero-knowledge proofs, mixing services, encrypted communications, and more.`,
      data: { total: projects.length },
    };
  }

  if (lowerQuery.includes('best') || lowerQuery.includes('top') || lowerQuery.includes('highest quality')) {
    const sorted = [...projects].sort((a, b) => b.confidence - a.confidence).slice(0, 5);
    return {
      type: 'recommendation',
      message: 'Top 5 projects by research quality (confidence score):',
      projects: sorted,
    };
  }

  if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest')) {
    const highQuality = projects.filter(p => p.confidence >= 0.7).slice(0, 5);
    return {
      type: 'recommendation',
      message: 'Recommended high-quality privacy projects (≥70% confidence):',
      projects: highQuality,
    };
  }

  // Category search
  if (lowerQuery.includes('defi') || lowerQuery.includes('finance')) {
    const filtered = projects.filter(p => p.category.toLowerCase().includes('defi'));
    return {
      type: 'projects',
      message: `Found ${filtered.length} privacy-focused DeFi projects:`,
      projects: filtered.slice(0, 10),
    };
  }

  if (lowerQuery.includes('wallet')) {
    const filtered = projects.filter(p =>
      p.category.toLowerCase().includes('wallet') || p.name.toLowerCase().includes('wallet')
    );
    return {
      type: 'projects',
      message: `Found ${filtered.length} privacy wallet projects:`,
      projects: filtered.slice(0, 10),
    };
  }

  // Default: show recent or popular projects
  return {
    type: 'general',
    message: `I can help you explore ${projects.length} Web3 privacy projects. Try asking:\n\n- "Show me Zero-Knowledge projects"\n- "Which projects use Rust?"\n- "What are the top projects?"\n- "Find active projects"\n- "Show me privacy wallets"`,
    projects: projects.slice(0, 5),
  };
}

/**
 * Generate example queries
 */
export function getExampleQueries(): string[] {
  return [
    'Show me Zero-Knowledge projects',
    'Which projects use Rust?',
    'What are the top privacy projects?',
    'Find active mainnet projects',
    'Show me privacy wallets',
    'Projects using encryption',
    'Tell me about Aztec',
    'How many projects are there?',
    'Recommend some projects',
  ];
}
