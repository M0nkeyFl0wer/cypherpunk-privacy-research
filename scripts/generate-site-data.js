// Generate site data from verified_data.json research files
// Reads from deliverables/*/sources/verified_data.json
// Outputs public/data/search-index.json and public/data/projects.json

const fs = require('fs');
const path = require('path');
const lunr = require('lunr');

const ROOT_DIR = path.join(__dirname, '..');
const DELIVERABLES_DIR = path.join(ROOT_DIR, 'deliverables');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'data');

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

console.log('🔍 Scanning deliverables for verified research data...\n');

/**
 * Safely extract value from various JSON structures
 */
function getValue(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number') return obj;
  if (typeof obj === 'object') {
    return obj.value || obj.long || obj.short || obj.primary_url || '';
  }
  return '';
}

/**
 * Flatten nested objects that have {value, confidence, ...} structure
 */
function flattenMetrics(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const flattened = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object') {
      if ('value' in val) {
        // Extract just the value
        flattened[key] = val.value;
      } else if (Array.isArray(val)) {
        flattened[key] = val.map(item => flattenMetrics(item));
      } else {
        // Recursively flatten nested objects
        flattened[key] = flattenMetrics(val);
      }
    } else {
      flattened[key] = val;
    }
  }
  return flattened;
}

/**
 * Normalize different verified_data.json formats
 */
function normalizeProject(data, projectId) {
  const normalized = {
    id: projectId,
    slug: projectId,
    confidence: 0.8,
    researchDate: '',
  };

  // Extract confidence/metadata
  if (data.metadata) {
    normalized.confidence = data.metadata.confidence_score || 0.8;
    normalized.researchDate = data.metadata.research_date || '';
  } else if (data.data_integrity) {
    normalized.confidence = data.data_integrity.all_sources_real ? 0.9 : 0.5;
    normalized.researchDate = data.collection_date || '';
  } else if (data.constitutional_compliance) {
    normalized.confidence = 0.8;
    normalized.researchDate = data.research_timestamp || data.data_collection_date || '';
  }

  // Extract basic info based on format
  if (data.project_basic_info) {
    // Zcash format
    const info = data.project_basic_info;
    normalized.name = info.official_name || projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    normalized.description = info.description || info.alternative_description || '';
    normalized.website = info.website || '';
    normalized.github = info.github || '';
  } else if (data.tier_1_data || data.tier_1_essential) {
    // Iron Fish / Firo / HOPR format
    const t1 = data.tier_1_data || data.tier_1_essential;
    normalized.name = getValue(t1.name) || data.project_name || projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const desc = t1.description || {};
    normalized.description = getValue(desc) || data.description || '';
    normalized.website = getValue(t1.website) || getValue(t1.website_url) || '';
    normalized.github = getValue(t1.github) || getValue(t1.github_url) || '';
  } else if (data.project_name) {
    // Tornado Cash format
    normalized.name = data.project_name;
    normalized.description = data.description || data.official_description || '';
    if (data.websites) {
      normalized.website = data.websites.main || data.websites.app || '';
      normalized.github = data.websites.github || data.websites.github_core || '';
    }
  } else if (data.basic_information) {
    // Monero format
    const bi = data.basic_information;
    normalized.name = getValue(bi.name) || projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    normalized.description = getValue(bi.description) || '';
  }

  // Fallback for name
  if (!normalized.name) {
    normalized.name = projectId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Extract team members
  normalized.team = extractTeam(data);

  // Extract technology info
  normalized.technology = extractTechnology(data);

  // Extract links
  if (data.official_links) {
    normalized.website = normalized.website || getValue(data.official_links.website);
    normalized.github = normalized.github || getValue(data.official_links.github);
  }

  // Determine ecosystem
  normalized.ecosystem = determineEcosystem(normalized.name, normalized.description);

  // Category (derive from data if available)
  normalized.category = data.category || data.subcategory || 'Privacy Infrastructure';

  // Legal/status info (if available)
  if (data.status) {
    normalized.status = data.status;
  }
  if (data.legal_history) {
    normalized.legalHistory = data.legal_history;
  }

  // Contracts (if available)
  if (data.contracts && data.contracts.length > 0) {
    normalized.contracts = data.contracts;
  }

  // Milestones (if available)
  if (data.milestones && data.milestones.length > 0) {
    normalized.milestones = data.milestones;
  }

  // Metrics (if available) - flatten nested {value, ...} objects
  if (data.metrics) {
    normalized.metrics = flattenMetrics(data.metrics);
  }

  // Market data (if available) - flatten nested {value, ...} objects
  if (data.market_data) {
    normalized.marketData = flattenMetrics(data.market_data);
  }

  // GitHub metrics (if available) - flatten nested {value, ...} objects
  if (data.github_metrics) {
    normalized.githubMetrics = flattenMetrics(data.github_metrics);
  }

  return normalized;
}

/**
 * Extract team members from various formats
 */
function extractTeam(data) {
  const team = [];

  // Tornado Cash format - founders array
  if (data.founders && Array.isArray(data.founders)) {
    data.founders.forEach(f => {
      if (f.name) {
        team.push({
          name: f.name,
          role: f.role || 'Founder',
          status: f.status || null,
        });
      }
    });
  }

  // Zcash format - founders_and_scientists
  if (data.founders_and_scientists) {
    const fs = data.founders_and_scientists;
    if (fs.primary_founder && fs.primary_founder.name) {
      team.push({
        name: fs.primary_founder.name,
        role: fs.primary_founder.role || 'Founder',
      });
    }
    if (fs.founding_scientists && fs.founding_scientists.list) {
      fs.founding_scientists.list.forEach(name => {
        team.push({ name, role: 'Founding Scientist' });
      });
    }
  }

  // Zcash format - organizations
  if (data.organizations) {
    Object.values(data.organizations).forEach(org => {
      if (org.current_leadership) {
        if (org.current_leadership.ceo && org.current_leadership.ceo.name) {
          team.push({
            name: org.current_leadership.ceo.name,
            role: 'CEO',
          });
        }
      }
      if (org.board_of_directors) {
        org.board_of_directors.forEach(d => {
          if (d.name) {
            team.push({
              name: d.name,
              role: d.title || 'Board Member',
            });
          }
        });
      }
    });
  }

  // Monero format - team_structure
  if (data.team_structure) {
    const ts = data.team_structure;
    if (ts.historical_core_team && ts.historical_core_team.members) {
      ts.historical_core_team.members.forEach(m => {
        if (m.name) {
          team.push({
            name: m.name,
            role: m.role || 'Core Team',
          });
        }
      });
    }
  }

  // Iron Fish format - tier_2_data.founders
  if (data.tier_2_data && data.tier_2_data.founders) {
    const founders = data.tier_2_data.founders.value || data.tier_2_data.founders;
    if (Array.isArray(founders)) {
      founders.forEach(f => {
        if (f.name) {
          team.push({
            name: f.name,
            role: f.role || 'Founder',
            linkedin: f.linkedin || null,
          });
        }
      });
    }
  }

  // Founding info (Monero)
  if (data.founding_information && data.founding_information.original_founder) {
    const name = getValue(data.founding_information.original_founder);
    if (name && !team.find(t => t.name.includes(name.split(' ')[0]))) {
      team.push({ name, role: 'Original Founder' });
    }
  }

  return team.slice(0, 15); // Limit to 15 members
}

/**
 * Extract technology information
 */
function extractTechnology(data) {
  const tech = {
    privacyTechniques: [],
    techStack: [],
    platforms: [],
  };

  // Direct technology field
  if (data.technology) {
    if (data.technology.privacy_mechanism) {
      tech.privacyTechniques.push(data.technology.privacy_mechanism);
    }
    if (data.technology.type) {
      tech.techStack.push(data.technology.type);
    }
    if (data.technology.supported_chains) {
      tech.platforms = data.technology.supported_chains;
    }
  }

  // Technical details
  if (data.technical_details) {
    const td = data.technical_details;
    if (td.privacy_features) {
      Object.keys(td.privacy_features).forEach(k => {
        if (td.privacy_features[k].value === true) {
          tech.privacyTechniques.push(k.replace(/_/g, ' '));
        }
      });
    }
  }

  // Key features (Monero)
  if (data.key_features) {
    Object.keys(data.key_features).forEach(k => {
      const val = getValue(data.key_features[k]);
      if (val && k !== 'open_source') {
        tech.privacyTechniques.push(val.split('.')[0]); // First sentence
      }
    });
  }

  return tech;
}

/**
 * Determine ecosystem from name/description
 */
function determineEcosystem(name, description) {
  const text = `${name} ${description}`.toLowerCase();

  if (text.includes('monero') || text.includes('xmr')) return 'monero';
  if (text.includes('zcash') || text.includes('zec')) return 'zcash';
  if (text.includes('bitcoin') || text.includes('btc')) return 'bitcoin';
  if (text.includes('ethereum') || text.includes('evm') || text.includes('erc')) return 'ethereum';

  return 'multichain';
}

// Process all deliverables
const projects = [];
const projectDirs = fs.readdirSync(DELIVERABLES_DIR).filter(name => {
  const fullPath = path.join(DELIVERABLES_DIR, name);
  return fs.statSync(fullPath).isDirectory();
});

console.log(`Found ${projectDirs.length} project directories\n`);

for (const projectId of projectDirs) {
  const verifiedDataPath = path.join(DELIVERABLES_DIR, projectId, 'sources', 'verified_data.json');

  if (!fs.existsSync(verifiedDataPath)) {
    console.log(`⚠️  ${projectId}: No verified_data.json`);
    continue;
  }

  try {
    const rawData = fs.readFileSync(verifiedDataPath, 'utf8');
    const data = JSON.parse(rawData);
    const normalized = normalizeProject(data, projectId);

    // Skip low confidence
    if (normalized.confidence < 0.5) {
      console.log(`⚠️  ${projectId}: Low confidence (${normalized.confidence}), skipping`);
      continue;
    }

    projects.push(normalized);
    console.log(`✅ ${projectId}: ${normalized.name} (confidence: ${normalized.confidence})`);
  } catch (e) {
    console.log(`❌ ${projectId}: Parse error - ${e.message}`);
  }
}

console.log(`\n📊 Processed ${projects.length} projects with valid research data\n`);

// Build Lunr search index
console.log('🔍 Building search index...');

const searchableProjects = projects.map(p => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  description: p.description || '',
  category: p.category,
  ecosystem: p.ecosystem,
  confidence: p.confidence,
  website: p.website,
  github: p.github,
  team: p.team,
  privacy_techniques: p.technology?.privacyTechniques || [],
  tech_stack: p.technology?.techStack || [],
  platforms: p.technology?.platforms || [],
  hasTeam: p.team && p.team.length > 0,
  hasContracts: p.contracts && p.contracts.length > 0,
  hasMilestones: p.milestones && p.milestones.length > 0,
}));

const idx = lunr(function() {
  this.ref('id');
  this.field('name', { boost: 10 });
  this.field('description', { boost: 5 });
  this.field('category', { boost: 3 });
  this.field('ecosystem', { boost: 2 });

  searchableProjects.forEach(p => {
    this.add({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      ecosystem: p.ecosystem,
    });
  });
});

// Collect filter options
const categories = [...new Set(projects.map(p => p.category).filter(Boolean))].sort();
const ecosystems = [...new Set(projects.map(p => p.ecosystem).filter(Boolean))].sort();
const privacyTechniques = [...new Set(projects.flatMap(p => p.technology?.privacyTechniques || []))].sort();

// Build search index output
const searchIndex = {
  projects: searchableProjects,
  lunr_index: JSON.stringify(idx),
  filters: {
    categories,
    ecosystems,
    privacy_techniques: privacyTechniques,
    platforms: [],
  },
  statistics: {
    total_projects: projects.length,
    avg_confidence: Math.round(projects.reduce((sum, p) => sum + p.confidence, 0) / projects.length * 100) / 100,
    projects_by_ecosystem: ecosystems.reduce((acc, e) => {
      acc[e] = projects.filter(p => p.ecosystem === e).length;
      return acc;
    }, {}),
    projects_with_team: projects.filter(p => p.team && p.team.length > 0).length,
  },
  total_projects: projects.length,
  generated_at: new Date().toISOString(),
};

// Write outputs
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'search-index.json'),
  JSON.stringify(searchIndex, null, 2)
);
console.log(`✅ Generated search-index.json`);

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'projects.json'),
  JSON.stringify(projects, null, 2)
);
console.log(`✅ Generated projects.json with full research data`);

// Summary
console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Total projects: ${projects.length}`);
console.log(`Average confidence: ${searchIndex.statistics.avg_confidence}`);
console.log(`Projects with team data: ${searchIndex.statistics.projects_with_team}`);
console.log(`Ecosystems: ${ecosystems.join(', ')}`);
console.log(`Categories: ${categories.slice(0, 5).join(', ')}...`);
console.log('='.repeat(60));
