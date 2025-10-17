/**
 * Field Mapper Module
 * Core transformation logic from our JSON → Web3Privacy YAML
 *
 * Maps:
 * - Identity fields (id, name, description)
 * - Categories and ecosystems
 * - Privacy techniques
 * - Team data
 * - Technology and features
 * - Funding and audits
 * - Links and resources
 * - Constitutional metadata (proposed)
 */

/**
 * Privacy technique mapping table
 * Maps our detailed techniques to their standard features
 */
const PRIVACY_TECHNIQUE_MAP = {
  'Zero-Knowledge Proofs (ZK-SNARKs)': 'zk-SNARKs',
  'ZK-SNARKs': 'zk-SNARKs',
  'Zero-Knowledge Proofs (ZK-STARKs)': 'zk-STARKs',
  'ZK-STARKs': 'zk-STARKs',
  'PLONK Proof System': 'PLONK',
  'PLONK': 'PLONK',
  'Ring Signatures': 'ring-signatures',
  'Stealth Addresses': 'stealth-addresses',
  'Coin Mixing': 'mixing',
  'Tor Network Integration': 'tor',
  'Tor Integration': 'tor',
  'Homomorphic Encryption': 'FHE',
  'Fully Homomorphic Encryption': 'FHE',
  'Multi-Party Computation': 'MPC',
  'Secure Multi-Party Computation': 'MPC',
  'Trusted Execution Environment': 'TEE',
  'TEE': 'TEE',
  'Private Transactions': 'private-transactions',
  'Encrypted Messaging': 'encrypted-messaging',
  'Private State': 'private-state',
  'ZK Rollup': 'zk-rollup',
  'zkRollup': 'zk-rollup',
  'Confidential Transactions': 'confidential-transactions'
};

/**
 * Category mapping table
 */
const CATEGORY_MAP = {
  'defi': 'defi',
  'wallet': 'applications',
  'currency': 'currency',
  'infrastructure': 'infrastructure',
  'computing': 'infrastructure',
  'messaging': 'applications',
  'bridges': 'infrastructure',
  'layer2-privacy': 'infrastructure',
  'identity': 'applications',
  'other': null
};

/**
 * Normalize project name to ID (slug)
 */
function normalizeToId(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Map identity fields
 */
function mapIdentity(projectData) {
  const cr = projectData.constitutional;
  const meta = projectData.metadata;

  const name = cr?.project_overview?.name || meta?.project_name || projectData.slug;
  const id = normalizeToId(name);

  // Get description (prefer constitutional, fallback to README excerpt)
  let description = cr?.project_overview?.description;

  if (!description && projectData.readme) {
    // Extract first paragraph from README (up to 200 chars)
    const lines = projectData.readme.split('\n');
    for (const line of lines) {
      const cleaned = line.trim();
      if (cleaned.length > 50 && !cleaned.startsWith('#')) {
        description = cleaned.substring(0, 200);
        break;
      }
    }
  }

  return {
    id,
    name,
    description: description || `Privacy-focused project: ${name}`
  };
}

/**
 * Map categories
 */
function mapCategories(projectData) {
  const categories = new Set();
  const cr = projectData.constitutional;
  const meta = projectData.metadata;

  // Map primary category
  const primaryCategory = meta?.category || cr?.project_overview?.category;
  if (primaryCategory && CATEGORY_MAP[primaryCategory]) {
    categories.add(CATEGORY_MAP[primaryCategory]);
  }

  // Map subcategories
  const subcategories = cr?.project_overview?.subcategories || meta?.subcategories || [];
  subcategories.forEach(sub => {
    if (CATEGORY_MAP[sub]) {
      categories.add(CATEGORY_MAP[sub]);
    }
  });

  return Array.from(categories).filter(Boolean);
}

/**
 * Extract ecosystem/blockchain platforms
 */
function mapEcosystem(projectData) {
  const ecosystems = new Set();
  const cr = projectData.constitutional;

  const blockchainType = cr?.technical_architecture?.blockchain_type;
  if (blockchainType) {
    const normalized = blockchainType.toLowerCase();

    if (normalized.includes('ethereum')) ecosystems.add('ethereum');
    if (normalized.includes('polygon')) ecosystems.add('polygon');
    if (normalized.includes('optimism')) ecosystems.add('optimism');
    if (normalized.includes('arbitrum')) ecosystems.add('arbitrum');
    if (normalized.includes('zksync')) ecosystems.add('zksync');
    if (normalized.includes('starknet')) ecosystems.add('starknet');
    if (normalized.includes('solana')) ecosystems.add('solana');
  }

  return Array.from(ecosystems);
}

/**
 * Map links
 */
function mapLinks(projectData) {
  const cr = projectData.constitutional;
  const meta = projectData.metadata;
  const links = {};

  // Website
  if (cr?.project_overview?.website) {
    links.web = cr.project_overview.website;
  }

  // GitHub
  if (meta?.github) {
    links.github = meta.github;
  } else if (cr?.project_overview?.github) {
    links.github = cr.project_overview.github;
  }

  // Documentation
  if (cr?.project_overview?.documentation) {
    links.docs = cr.project_overview.documentation;
  }

  // Extract social links from sources
  if (cr?.sources) {
    cr.sources.forEach(source => {
      if (source.type === 'twitter' && source.url) {
        // Extract Twitter handle
        const match = source.url.match(/twitter\.com\/([^\/\?]+)/);
        if (match) {
          links.twitter = match[1];
        }
      }
    });
  }

  return links;
}

/**
 * Map team information
 */
function mapTeam(projectData) {
  const cr = projectData.constitutional;

  if (!cr?.team_and_governance) {
    return null;
  }

  const tg = cr.team_and_governance;
  const team = {
    anonymous: tg.anonymous === true,
    teammembers: []
  };

  // Add founders
  if (tg.founders && Array.isArray(tg.founders)) {
    tg.founders.forEach(founder => {
      if (founder.name && founder.name !== 'Unknown') {
        team.teammembers.push({
          name: founder.name,
          role: founder.role || 'Founder',
          link: founder.github || founder.linkedin || founder.twitter || null
        });
      }
    });
  }

  // Add team size if available
  if (tg.team_size) {
    team.members_count = tg.team_size;
  } else if (team.teammembers.length > 0) {
    team.members_count = team.teammembers.length;
  }

  return team.teammembers.length > 0 || team.anonymous ? team : null;
}

/**
 * Map technology and privacy features
 */
function mapTechnology(projectData) {
  const cr = projectData.constitutional;
  const tech = {
    features: []
  };

  // Map privacy techniques
  if (cr?.technical_architecture?.privacy_technology) {
    const techniques = cr.technical_architecture.privacy_technology;

    techniques.forEach(technique => {
      // Try exact match
      if (PRIVACY_TECHNIQUE_MAP[technique]) {
        tech.features.push(PRIVACY_TECHNIQUE_MAP[technique]);
      } else {
        // Try fuzzy match
        for (const [key, value] of Object.entries(PRIVACY_TECHNIQUE_MAP)) {
          if (technique.toLowerCase().includes(key.toLowerCase()) ||
              key.toLowerCase().includes(technique.toLowerCase())) {
            tech.features.push(value);
            break;
          }
        }
      }
    });
  }

  // Remove duplicates
  tech.features = [...new Set(tech.features)];

  // Add technology type
  if (cr?.technical_architecture?.technology_type) {
    tech.type = cr.technical_architecture.technology_type;
  } else if (tech.features.includes('zk-SNARKs') || tech.features.includes('zk-STARKs')) {
    tech.type = 'Zero-knowledge proof system';
  }

  // Add stack (languages)
  if (cr?.technical_architecture?.language_breakdown) {
    const languages = Object.keys(cr.technical_architecture.language_breakdown);
    tech.stack = languages.slice(0, 5); // Top 5 languages
  }

  return tech;
}

/**
 * Map blockchain features
 */
function mapBlockchainFeatures(projectData) {
  const cr = projectData.constitutional;
  const features = {};

  // Open source
  if (projectData.github?.public !== undefined) {
    features.opensource = projectData.github.public === true;
  }

  // EVM compatible
  if (cr?.technical_architecture?.evm_compatible !== undefined) {
    features.evm_compatible = cr.technical_architecture.evm_compatible;
  }

  // Asset custody type
  const privacyText = JSON.stringify(cr?.privacy_and_compliance || {}).toLowerCase();
  if (privacyText.includes('non-custodial') || privacyText.includes('self-custody')) {
    features.asset_custody_type = 'non-custodial';
  } else if (privacyText.includes('hybrid')) {
    features.asset_custody_type = 'hybrid';
  } else if (privacyText.includes('custodial')) {
    features.asset_custody_type = 'custodial';
  }

  return Object.keys(features).length > 0 ? features : null;
}

/**
 * Map tokens
 */
function mapTokens(projectData) {
  const cr = projectData.constitutional;

  if (!cr?.token_economics?.native_token) {
    return null;
  }

  const token = {
    name: cr.token_economics.native_token,
    symbol: cr.token_economics.token_symbol || null
  };

  // Add contract address if available
  if (projectData.contracts && Array.isArray(projectData.contracts)) {
    const tokenContract = projectData.contracts.find(c => c.is_token);
    if (tokenContract?.contract_address) {
      token.contract_address = tokenContract.contract_address;
    }
  }

  return token;
}

/**
 * Map funding
 */
function mapFunding(projectData) {
  const cr = projectData.constitutional;
  const funding = [];

  if (cr?.funding_and_investment?.funding_rounds) {
    cr.funding_and_investment.funding_rounds.forEach(round => {
      funding.push({
        name: `${round.round_type || 'Funding'} - ${round.amount || 'Undisclosed'}`,
        type: (round.round_type || 'unknown').toLowerCase().replace(/\s+/g, '-'),
        value: round.amount || null,
        time: round.date || round.year || null,
        link: round.announcement_url || round.source_url || null
      });
    });
  }

  return funding.length > 0 ? funding : null;
}

/**
 * Map audits
 */
function mapAudits(projectData) {
  const cr = projectData.constitutional;
  const audits = [];

  if (cr?.audits_and_security) {
    cr.audits_and_security.forEach(audit => {
      if (audit.audit_status === 'Completed') {
        audits.push({
          name: audit.auditor || extractAuditorFromUrl(audit.report_url),
          company: audit.auditor || null,
          link: audit.report_url || null,
          time: audit.audit_date || null
        });
      }
    });
  }

  return audits.length > 0 ? audits : null;
}

/**
 * Extract auditor name from URL
 */
function extractAuditorFromUrl(url) {
  if (!url) return 'Unknown Auditor';

  const auditors = [
    'Trail of Bits', 'ConsenSys Diligence', 'OpenZeppelin',
    'CertiK', 'PeckShield', 'Quantstamp', 'Hacken',
    'Sigma Prime', 'Runtime Verification'
  ];

  const normalized = url.toLowerCase();
  for (const auditor of auditors) {
    if (normalized.includes(auditor.toLowerCase().replace(' ', '-')) ||
        normalized.includes(auditor.toLowerCase().replace(' ', ''))) {
      return auditor;
    }
  }

  return 'Security Audit';
}

/**
 * Map project status
 */
function mapProjectStatus(projectData) {
  const meta = projectData.metadata;
  const cr = projectData.constitutional;

  const status = meta?.status || cr?.project_overview?.status;
  const maturity = meta?.maturity_level || cr?.technical_architecture?.maturity_level;

  const mapped = {};

  // Version/status
  if (status === 'deprecated' || maturity === 'sunset') {
    mapped.version = 'Sunset';
    mapped.sunset = true;
  } else if (status === 'mainnet' || status === 'active' || maturity === 'production') {
    mapped.version = 'Mainnet';
    mapped.mainnet = true;
  } else if (status === 'testnet' || maturity === 'beta') {
    mapped.version = 'Testnet';
    mapped.testnet = true;
  } else if (status === 'in-development' || maturity === 'alpha') {
    mapped.version = 'Alpha';
  } else if (maturity === 'experimental') {
    mapped.version = 'MVP';
  }

  // Launch date
  if (cr?.project_overview?.launch_date) {
    mapped.launched = cr.project_overview.launch_date;
  }

  return Object.keys(mapped).length > 0 ? mapped : null;
}

/**
 * Build constitutional metadata (proposed new section)
 */
function mapConstitutionalMetadata(projectData) {
  const cr = projectData.constitutional;
  const meta = projectData.metadata;

  const quality = {
    confidence: projectData.confidence || 0.7,
    completeness: (projectData.completeness || 50) / 100, // Convert to 0-1 scale
    verification_date: meta?.last_update || new Date().toISOString().split('T')[0]
  };

  // Add sources
  if (cr?.sources && cr.sources.length > 0) {
    quality.sources = cr.sources.slice(0, 5).map(source => ({
      type: source.type || 'unknown',
      url: source.url,
      verified: source.confidence >= 0.8
    }));
  }

  // Add missing fields
  if (meta?.missing_fields && meta.missing_fields.length > 0) {
    quality.missing_fields = meta.missing_fields;
  }

  return quality;
}

/**
 * Main transformation function
 * @param {object} projectData - Loaded project data
 * @returns {object} Mapped YAML-ready object
 */
function transformProject(projectData) {
  const mapped = {};

  // Core identity
  const identity = mapIdentity(projectData);
  Object.assign(mapped, identity);

  // Categories
  const categories = mapCategories(projectData);
  if (categories.length > 0) {
    mapped.categories = categories;
  }

  // Ecosystem
  const ecosystem = mapEcosystem(projectData);
  if (ecosystem.length > 0) {
    mapped.ecosystem = ecosystem;
  }

  // Links
  const links = mapLinks(projectData);
  if (Object.keys(links).length > 0) {
    mapped.links = links;
  }

  // Team
  const team = mapTeam(projectData);
  if (team) {
    mapped.team = team;
  }

  // Technology
  const technology = mapTechnology(projectData);
  if (technology.features.length > 0 || technology.type || technology.stack) {
    mapped.technology = technology;
  }

  // Blockchain features
  const blockchainFeatures = mapBlockchainFeatures(projectData);
  if (blockchainFeatures) {
    mapped.blockchain_features = blockchainFeatures;
  }

  // Tokens
  const tokens = mapTokens(projectData);
  if (tokens) {
    mapped.tokens = [tokens];
    mapped.have_token = true;
  }

  // Funding
  const funding = mapFunding(projectData);
  if (funding) {
    mapped.funding = funding;
  }

  // Audits
  const audits = mapAudits(projectData);
  if (audits) {
    mapped.audits = audits;
  }

  // Project status
  const projectStatus = mapProjectStatus(projectData);
  if (projectStatus) {
    mapped.project_status = projectStatus;
  }

  // Constitutional metadata (proposed)
  mapped.data_quality = mapConstitutionalMetadata(projectData);

  return mapped;
}

// Export functions
module.exports = {
  transformProject,
  mapIdentity,
  mapCategories,
  mapLinks,
  mapTeam,
  mapTechnology,
  mapFunding,
  mapAudits,
  normalizeToId,
  PRIVACY_TECHNIQUE_MAP,
  CATEGORY_MAP
};
