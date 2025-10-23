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
  const verified = projectData.verified;
  const cr = projectData.constitutional;
  const meta = projectData.metadata;

  // Use verified data first (highest quality), then fallback
  // Support both monero schema (basic_information) and circom schema (tier_1_data)
  const name = verified?.basic_information?.name?.value ||
    verified?.tier_1_data?.project_name?.value ||
    verified?.project_name ||
    cr?.project_overview?.name ||
    meta?.project_name ||
    projectData.slug;

  const id = normalizeToId(name);

  // Get description (prefer verified, then constitutional, then README)
  let description = verified?.basic_information?.description?.value ||
    verified?.tier_1_data?.description?.value ||
    cr?.project_overview?.description ||
    meta?.description;

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
  const verified = projectData.verified;
  const cr = projectData.constitutional;
  const meta = projectData.metadata;

  // Try to infer from project type (multiple schema support)
  const projectType = verified?.basic_information?.type?.value ||     // monero schema
    verified?.tier_1_data?.category?.value ||                         // circom schema
    meta?.category ||
    cr?.project_overview?.category;

  if (projectType && typeof projectType === 'string') {
    const normalized = projectType.toLowerCase();

    if (normalized.includes('currency') || normalized.includes('coin')) {
      categories.add('currency');
    } else if (normalized.includes('wallet')) {
      categories.add('applications');
    } else if (normalized.includes('defi') || normalized.includes('financial')) {
      categories.add('defi');
    } else if (normalized.includes('infrastructure') || normalized.includes('layer') || normalized.includes('tool') || normalized.includes('compiler')) {
      categories.add('infrastructure');
    } else if (normalized.includes('identity')) {
      categories.add('applications');
    } else if (normalized.includes('messaging')) {
      categories.add('applications');
    }
  }

  // Add from metadata category mapping
  if (meta?.category && CATEGORY_MAP[meta.category]) {
    categories.add(CATEGORY_MAP[meta.category]);
  }

  // Map subcategories
  const subcategories = cr?.project_overview?.subcategories ||
    meta?.subcategories ||
    verified?.tier_1_data?.category?.sub_categories ||
    [];

  subcategories.forEach(sub => {
    if (typeof sub === 'string') {
      // Check if substring matches known categories
      const lowerSub = sub.toLowerCase();
      if (lowerSub.includes('privacy') || lowerSub.includes('privacy-tech')) {
        categories.add('infrastructure');
      }
      if (lowerSub.includes('zk') || lowerSub.includes('zero-knowledge')) {
        categories.add('infrastructure');
      }
      if (CATEGORY_MAP[sub]) {
        categories.add(CATEGORY_MAP[sub]);
      }
    }
  });

  // If no categories inferred, check key_features for hints
  if (categories.size === 0) {
    if (verified?.key_features) {
      const features = Object.keys(verified.key_features).map(k => k.toLowerCase()).join(' ');
      if (features.includes('privacy') || features.includes('untraceable')) {
        categories.add('currency');
      }
      if (features.includes('defi')) {
        categories.add('defi');
      }
    }
    if (verified?.tier_1_data?.description?.value) {
      const desc = verified.tier_1_data.description.value.toLowerCase();
      if (desc.includes('circuit') || desc.includes('zk-snark') || desc.includes('privacy') || desc.includes('compiler')) {
        categories.add('infrastructure');
      }
    }
  }

  return Array.from(categories).filter(Boolean);
}

/**
 * Extract ecosystem/blockchain platforms
 */
function mapEcosystem(projectData) {
  const ecosystems = new Set();
  const verified = projectData.verified;
  const cr = projectData.constitutional;

  // Try verified data first
  const blockchainType = verified?.technical_details?.blockchain_type ||
    cr?.technical_architecture?.blockchain_type;

  if (blockchainType && typeof blockchainType === 'string') {
    const normalized = blockchainType.toLowerCase();

    if (normalized.includes('ethereum')) ecosystems.add('ethereum');
    if (normalized.includes('polygon')) ecosystems.add('polygon');
    if (normalized.includes('optimism')) ecosystems.add('optimism');
    if (normalized.includes('arbitrum')) ecosystems.add('arbitrum');
    if (normalized.includes('zksync')) ecosystems.add('zksync');
    if (normalized.includes('starknet')) ecosystems.add('starknet');
    if (normalized.includes('solana')) ecosystems.add('solana');
    if (normalized.includes('layer 2') || normalized.includes('layer2')) ecosystems.add('ethereum');
  }

  return Array.from(ecosystems);
}

/**
 * Map links
 */
function mapLinks(projectData) {
  const verified = projectData.verified;
  const cr = projectData.constitutional;
  const meta = projectData.metadata;
  const links = {};

  // Try verified official_links first (monero schema)
  if (verified?.official_links) {
    const ol = verified.official_links;

    if (ol.website?.value) {
      links.web = ol.website.value;
    }
    if (ol.github?.value) {
      links.github = ol.github.value;
    }
    if (ol.documentation?.value) {
      links.documentation = ol.documentation.value;
    }
    if (ol.blog?.value) {
      links.blog = ol.blog.value;
    }
    if (ol.twitter?.value) {
      links.twitter = ol.twitter.value;
    }
    if (ol.discord?.value) {
      links.discord = ol.discord.value;
    }
    if (ol.telegram?.value) {
      links.telegram = ol.telegram.value;
    }
    if (ol.whitepaper?.value) {
      links.whitepaper = ol.whitepaper.value;
    }
  }

  // Try alternative schema (circom schema with tier_1_data)
  if (!links.web && verified?.tier_1_data?.website_url?.value) {
    links.web = verified.tier_1_data.website_url.value;
  }
  if (!links.github && verified?.tier_1_data?.github_url?.value) {
    links.github = verified.tier_1_data.github_url.value;
  }

  // Fallback to constitutional/metadata if not in verified
  if (!links.web) {
    links.web = cr?.project_overview?.website || meta?.website;
  }
  if (!links.github) {
    links.github = meta?.github || cr?.project_overview?.github;
  }
  if (!links.documentation) {
    links.documentation = cr?.project_overview?.documentation || meta?.documentation;
  }

  // Extract from sources if still missing
  if (!links.twitter && cr?.sources) {
    cr.sources.forEach(source => {
      if (source.type === 'twitter' && source.url && !links.twitter) {
        const match = source.url.match(/twitter\.com\/([^\/\?]+)/);
        if (match) {
          links.twitter = match[1];
        }
      }
    });
  }

  // Remove empty links
  Object.keys(links).forEach(key => {
    if (!links[key]) delete links[key];
  });

  return links;
}

/**
 * Map team information
 */
function mapTeam(projectData) {
  const verified = projectData.verified;
  const cr = projectData.constitutional;

  const team = {
    anonymous: false,
    teammembers: []
  };

  // Try verified team structure first
  if (verified?.team_structure) {
    const ts = verified.team_structure;

    if (ts.anonymous !== undefined) {
      team.anonymous = ts.anonymous === true;
    }

    // Add members from verified
    if (ts.members && Array.isArray(ts.members)) {
      ts.members.forEach(member => {
        if (member.name && member.name !== 'Unknown') {
          team.teammembers.push({
            name: member.name,
            role: member.role || 'Team Member',
            link: member.github || member.linkedin || member.twitter || null
          });
        }
      });
    }

    // Add team size from verified
    if (ts.team_size || ts.members_count) {
      team.members_count = ts.team_size || ts.members_count;
    }
  }

  // Fallback to constitutional if no verified team data
  if (team.teammembers.length === 0 && cr?.team_and_governance) {
    const tg = cr.team_and_governance;
    team.anonymous = team.anonymous || tg.anonymous === true;

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

    if (tg.team_size && !team.members_count) {
      team.members_count = tg.team_size;
    }
  }

  // Set members_count if not already set
  if (!team.members_count && team.teammembers.length > 0) {
    team.members_count = team.teammembers.length;
  }

  return team.teammembers.length > 0 || team.anonymous ? team : null;
}

/**
 * Map technology and privacy features
 */
function mapTechnology(projectData) {
  const verified = projectData.verified;
  const cr = projectData.constitutional;
  const tech = {
    features: []
  };

  // Extract privacy features from verified key_features
  if (verified?.key_features) {
    Object.entries(verified.key_features).forEach(([featureName, featureData]) => {
      if (featureData?.value) {
        const description = featureData.value.toLowerCase();

        // Map common privacy techniques
        if (featureName.toLowerCase().includes('privacy') || description.includes('privacy')) {
          // Parse out specific techniques
          if (description.includes('ring signature')) tech.features.push('ring-signatures');
          if (description.includes('stealth address')) tech.features.push('stealth-addresses');
          if (description.includes('confidential')) tech.features.push('confidential-transactions');
          if (description.includes('mixing') || description.includes('coin mix')) tech.features.push('mixing');
          if (description.includes('zero-knowledge') || description.includes('zk-snark')) tech.features.push('zk-SNARKs');
          if (description.includes('zero knowledge') || description.includes('zk proof')) tech.features.push('zk-SNARKs');
          if (description.includes('untraceable') || description.includes('monero')) tech.features.push('ring-signatures');
        }
      }
    });
  }

  // Fallback to constitutional privacy techniques if no verified features
  if (tech.features.length === 0 && cr?.technical_architecture?.privacy_technology) {
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

  // Add stack (languages) - try verified first
  if (verified?.technical_details?.programming_languages) {
    const languages = verified.technical_details.programming_languages;
    if (Array.isArray(languages)) {
      tech.stack = languages.slice(0, 5); // Top 5 languages
    }
  } else if (cr?.technical_architecture?.language_breakdown) {
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
