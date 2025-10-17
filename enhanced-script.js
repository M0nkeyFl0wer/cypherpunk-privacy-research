// Enhanced Web3 Privacy Research Cross-Referencing System
// Project data storage
let projectsData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProjectData();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const feedbackForm = document.getElementById('feedbackForm');

    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
    if (feedbackForm) feedbackForm.addEventListener('submit', handleFeedbackSubmission);
}

// ENHANCED SEARCH WITH CROSS-REFERENCING
function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('searchResults');

    if (!query) {
        resultsContainer.innerHTML = '';
        return;
    }

    if (projectsData.length === 0) {
        resultsContainer.innerHTML = '<div class="loading">Loading project data...</div>';
        return;
    }

    // Enhanced search with natural language queries
    let results = [];
    const lowerQuery = query.toLowerCase();

    // CONNECTION QUERIES
    if (lowerQuery.includes('builds on') || lowerQuery.includes('uses')) {
        results = handleConnectionQueries(query);
    }
    // TECHNOLOGY STACK QUERIES  
    else if (lowerQuery.includes('rust') || lowerQuery.includes('solidity') || lowerQuery.includes('typescript')) {
        results = findByTechStack(query);
    }
    // PRIVACY TECHNIQUE QUERIES
    else if (lowerQuery.includes('zk') || lowerQuery.includes('zero-knowledge') || 
             lowerQuery.includes('mixing') || lowerQuery.includes('stealth')) {
        results = findByPrivacyTechnique(query);
    }
    // ECOSYSTEM QUERIES
    else if (lowerQuery.includes('ethereum') || lowerQuery.includes('solana') || 
             lowerQuery.includes('polygon') || lowerQuery.includes('arbitrum')) {
        results = findByEcosystem(query);
    }
    // SECURITY/AUDIT QUERIES
    else if (lowerQuery.includes('audit') || lowerQuery.includes('security') || 
             lowerQuery.includes('mainnet') || lowerQuery.includes('testnet')) {
        results = findBySecurityStatus(query);
    }
    // INTEGRATION QUERIES
    else if (lowerQuery.includes('wallet') || lowerQuery.includes('defi') || 
             lowerQuery.includes('cross-chain') || lowerQuery.includes('multi-chain')) {
        results = findByIntegration(query);
    }
    // REGULAR SEARCH
    else {
        results = performRegularSearch(query);
    }

    displayEnhancedSearchResults(results, query);
}

// Handle connection queries like "builds on aztec"
function handleConnectionQueries(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('aztec')) {
        return projectsData.filter(p => 
            p.ecosystem?.toLowerCase().includes('ethereum') ||
            (p.content || '').toLowerCase().includes('zk') ||
            p.supported_chains?.includes('ethereum') ||
            (p.description || '').toLowerCase().includes('aztec')
        );
    }
    
    if (lowerQuery.includes('ethereum')) {
        return projectsData.filter(p => 
            p.ecosystem?.toLowerCase().includes('ethereum') ||
            p.supported_chains?.includes('ethereum') ||
            (p.content || '').toLowerCase().includes('solidity')
        );
    }
    
    return [];
}

// Find projects by technology stack
function findByTechStack(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('rust')) {
        return projectsData.filter(p => 
            (p.content || '').toLowerCase().includes('rust') ||
            p.tech_stack?.includes('rust') ||
            ['monero', 'zcash', 'grin'].includes(p.id)
        );
    }
    
    if (lowerQuery.includes('solidity')) {
        return projectsData.filter(p => 
            (p.content || '').toLowerCase().includes('solidity') ||
            p.ecosystem === 'ethereum' ||
            p.supported_chains?.includes('ethereum')
        );
    }
    
    if (lowerQuery.includes('typescript') || lowerQuery.includes('javascript')) {
        return projectsData.filter(p => 
            (p.content || '').toLowerCase().includes('typescript') ||
            (p.content || '').toLowerCase().includes('javascript') ||
            (p.content || '').toLowerCase().includes('node')
        );
    }
    
    return [];
}

// Find projects by privacy technique
function findByPrivacyTechnique(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('zk') || lowerQuery.includes('zero-knowledge')) {
        return projectsData.filter(p => 
            (p.content || '').toLowerCase().includes('zk') ||
            (p.content || '').toLowerCase().includes('zero-knowledge') ||
            (p.content || '').toLowerCase().includes('snark') ||
            (p.content || '').toLowerCase().includes('stark') ||
            ['aztec', 'polygon-nightfall', 'zksync'].includes(p.id)
        );
    }
    
    if (lowerQuery.includes('mixing') || lowerQuery.includes('mixer')) {
        return projectsData.filter(p => 
            p.category === 'mixing' ||
            p.category === 'privacy_mixer' ||
            (p.content || '').toLowerCase().includes('mix') ||
            ['tornado-cash', 'cyclone-protocol'].includes(p.id)
        );
    }
    
    if (lowerQuery.includes('stealth')) {
        return projectsData.filter(p => 
            (p.content || '').toLowerCase().includes('stealth') ||
            (p.content || '').toLowerCase().includes('ring signature') ||
            ['monero', 'umbra-cash'].includes(p.id)
        );
    }
    
    return [];
}

// Find projects by ecosystem
function findByEcosystem(query) {
    const lowerQuery = query.toLowerCase();
    const ecosystem = lowerQuery.includes('ethereum') ? 'ethereum' :
                     lowerQuery.includes('solana') ? 'solana' :
                     lowerQuery.includes('polygon') ? 'polygon' : '';
    
    return projectsData.filter(p => 
        p.ecosystem?.toLowerCase().includes(ecosystem) ||
        p.supported_chains?.some(chain => chain.toLowerCase().includes(ecosystem)) ||
        p.blockchain?.toLowerCase().includes(ecosystem)
    );
}

// Find projects by security/audit status
function findBySecurityStatus(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('audit')) {
        return projectsData.filter(p => 
            p.audits && p.audits.length > 0 ||
            (p.content || '').toLowerCase().includes('audit')
        );
    }
    
    if (lowerQuery.includes('mainnet')) {
        return projectsData.filter(p => 
            p.mainnet_status?.includes('mainnet') ||
            p.is_mainnet === true
        );
    }
    
    if (lowerQuery.includes('testnet')) {
        return projectsData.filter(p => 
            p.mainnet_status?.includes('testnet') ||
            p.is_mainnet === false
        );
    }
    
    return [];
}

// Find projects by integration type
function findByIntegration(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('wallet')) {
        return projectsData.filter(p => 
            p.category === 'wallet' ||
            (p.content || '').toLowerCase().includes('wallet')
        );
    }
    
    if (lowerQuery.includes('defi')) {
        return projectsData.filter(p => 
            p.category === 'defi' ||
            (p.content || '').toLowerCase().includes('defi') ||
            (p.content || '').toLowerCase().includes('uniswap') ||
            (p.content || '').toLowerCase().includes('compound')
        );
    }
    
    if (lowerQuery.includes('cross-chain') || lowerQuery.includes('multi-chain')) {
        return projectsData.filter(p => 
            p.supported_chains && p.supported_chains.length > 1
        );
    }
    
    return [];
}

// Regular search fallback
function performRegularSearch(query) {
    return projectsData.filter(project => {
        const searchText = [
            project.name,
            project.description,
            project.category,
            project.content || '',
            project.ecosystem || '',
            project.blockchain || '',
            project.supported_chains?.join(' ') || '',
            project.id
        ].join(' ').toLowerCase();

        return searchText.includes(query.toLowerCase());
    });
}

// ENHANCED RELATIONSHIP MAPPING
function getEnhancedProjectRelationships(project) {
    const relationships = [];
    
    // 1. ECOSYSTEM & BLOCKCHAIN CONNECTIONS
    const ecosystemConnections = findEcosystemConnections(project);
    relationships.push(...ecosystemConnections);
    
    // 2. TECHNOLOGY STACK ANALYSIS
    const techConnections = findTechStackConnections(project);
    relationships.push(...techConnections);
    
    // 3. PRIVACY TECHNIQUE CLUSTERING
    const privacyConnections = findPrivacyTechniqueConnections(project);
    relationships.push(...privacyConnections);
    
    // 4. CODEBASE DEPENDENCIES
    const codebaseConnections = findCodebaseDependencies(project);
    relationships.push(...codebaseConnections);
    
    // 5. AUDIT & SECURITY RELATIONSHIPS
    const securityConnections = findSecurityRelationships(project);
    relationships.push(...securityConnections);
    
    // 6. INTEGRATION & COMPATIBILITY
    const integrationConnections = findIntegrationMappings(project);
    relationships.push(...integrationConnections);
    
    return relationships.slice(0, 6); // Show top 6 relationships
}

function findEcosystemConnections(project) {
    const connections = [];
    
    if (project.ecosystem) {
        const ecosystemProjects = projectsData.filter(p => 
            p.id !== project.id && p.ecosystem === project.ecosystem
        );
        
        if (ecosystemProjects.length > 0) {
            connections.push({
                type: 'ecosystem',
                label: `${project.ecosystem} Ecosystem`,
                count: ecosystemProjects.length,
                color: '#667eea',
                projects: ecosystemProjects.slice(0, 3).map(p => p.name)
            });
        }
    }
    
    return connections;
}

function findTechStackConnections(project) {
    const connections = [];
    const content = (project.content || '' + project.description || '').toLowerCase();
    
    // Rust ecosystem
    if (content.includes('rust')) {
        const rustProjects = projectsData.filter(p => 
            p.id !== project.id && (p.content || '').toLowerCase().includes('rust')
        );
        if (rustProjects.length > 0) {
            connections.push({
                type: 'tech',
                label: 'Rust Codebase',
                count: rustProjects.length,
                color: '#f59e0b',
                projects: rustProjects.slice(0, 3).map(p => p.name)
            });
        }
    }
    
    // Solidity/EVM
    if (content.includes('solidity') || project.ecosystem === 'ethereum') {
        const solidityProjects = projectsData.filter(p => 
            p.id !== project.id && 
            ((p.content || '').toLowerCase().includes('solidity') || p.ecosystem === 'ethereum')
        );
        if (solidityProjects.length > 0) {
            connections.push({
                type: 'tech',
                label: 'Solidity/EVM',
                count: solidityProjects.length,
                color: '#10b981',
                projects: solidityProjects.slice(0, 3).map(p => p.name)
            });
        }
    }
    
    return connections;
}

function findPrivacyTechniqueConnections(project) {
    const connections = [];
    const content = (project.content || '' + project.description || '').toLowerCase();
    
    // Zero-Knowledge
    if (content.includes('zk') || content.includes('zero-knowledge')) {
        const zkProjects = projectsData.filter(p => 
            p.id !== project.id && 
            ((p.content || '').toLowerCase().includes('zk') || 
             (p.content || '').toLowerCase().includes('zero-knowledge'))
        );
        if (zkProjects.length > 0) {
            connections.push({
                type: 'privacy',
                label: 'Zero-Knowledge',
                count: zkProjects.length,
                color: '#8b5cf6',
                projects: zkProjects.slice(0, 3).map(p => p.name)
            });
        }
    }
    
    // Mixing
    if (content.includes('mix') || project.category === 'mixing') {
        const mixProjects = projectsData.filter(p => 
            p.id !== project.id && 
            ((p.content || '').toLowerCase().includes('mix') || p.category === 'mixing')
        );
        if (mixProjects.length > 0) {
            connections.push({
                type: 'privacy',
                label: 'Mixing Protocol',
                count: mixProjects.length,
                color: '#ec4899',
                projects: mixProjects.slice(0, 3).map(p => p.name)
            });
        }
    }
    
    return connections;
}

function findCodebaseDependencies(project) {
    const connections = [];
    const content = (project.content || '' + project.description || '').toLowerCase();
    
    // Layer 2 family
    if (project.category === 'layer2' || content.includes('rollup')) {
        const l2Projects = projectsData.filter(p => 
            p.id !== project.id && 
            (p.category === 'layer2' || (p.content || '').toLowerCase().includes('rollup'))
        );
        if (l2Projects.length > 0) {
            connections.push({
                type: 'dependency',
                label: 'Layer 2 Family',
                count: l2Projects.length,
                color: '#06b6d4',
                projects: l2Projects.slice(0, 3).map(p => p.name)
            });
        }
    }
    
    return connections;
}

function findSecurityRelationships(project) {
    const connections = [];
    
    // Mainnet status
    if (project.mainnet_status && project.mainnet_status !== 'unknown') {
        const sameStatusProjects = projectsData.filter(p => 
            p.id !== project.id && p.mainnet_status === project.mainnet_status
        );
        if (sameStatusProjects.length > 0) {
            connections.push({
                type: 'security',
                label: `${project.mainnet_status}`,
                count: sameStatusProjects.length,
                color: '#84cc16',
                projects: sameStatusProjects.slice(0, 3).map(p => p.name)
            });
        }
    }
    
    return connections;
}

function findIntegrationMappings(project) {
    const connections = [];
    
    // Multi-chain support
    if (project.supported_chains && project.supported_chains.length > 1) {
        const crossChainProjects = projectsData.filter(p => 
            p.id !== project.id && p.supported_chains && p.supported_chains.length > 1
        );
        if (crossChainProjects.length > 0) {
            connections.push({
                type: 'integration',
                label: 'Multi-Chain',
                count: crossChainProjects.length,
                color: '#f97316',
                projects: crossChainProjects.slice(0, 3).map(p => p.name)
            });
        }
    }
    
    return connections;
}

// DISPLAY ENHANCED SEARCH RESULTS
function displayEnhancedSearchResults(results, query) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="loading">
                No projects found for "${query}". Try queries like:<br>
                • "rust projects" • "zk protocols" • "builds on ethereum"<br>
                • "wallet integrations" • "mainnet projects" • "mixing protocols"
            </div>
        `;
        return;
    }
    
    const resultsHtml = results.map(project => {
        const relationships = getEnhancedProjectRelationships(project);
        const projectLogo = getProjectLogo(project.id);
        
        return `
        <div class="project-card enhanced" onclick="openProject('${project.id}')">
            <div class="project-header">
                ${projectLogo ? `<img src="${projectLogo}" alt="${project.name} logo" class="project-logo" onerror="this.style.display='none'">` : ''}
                <div class="project-info">
                    <div class="project-title">${project.name}</div>
                    <div class="project-description">${project.description || 'Privacy-focused Web3 project'}</div>
                </div>
            </div>
            
            <div class="project-details">
                ${project.website ? `<div class="detail-item">🌐 <a href="${project.website}" target="_blank" onclick="event.stopPropagation()">${project.website}</a></div>` : ''}
                ${project.github ? `<div class="detail-item">📱 <a href="${project.github}" target="_blank" onclick="event.stopPropagation()">${project.github}</a></div>` : ''}
                ${project.ecosystem ? `<div class="detail-item">⛓️ ${project.ecosystem}</div>` : ''}
            </div>
            
            ${relationships.length ? `<div class="enhanced-relationships">
                <div class="relationship-title">🔗 Connected Projects:</div>
                <div class="relationship-tags">
                    ${relationships.map(rel => `
                        <span class="relationship-tag ${rel.type}" style="background: ${rel.color || '#667eea'}" 
                              title="${rel.projects?.join(', ') || ''}"
                              onclick="event.stopPropagation(); searchRelated('${rel.label}')">
                            ${rel.label} (${rel.count})
                        </span>
                    `).join('')}
                </div>
            </div>` : ''}
            
            <div class="project-meta">
                <span class="meta-item">${project.category || 'Privacy'}</span>
                ${project.mainnet_status ? `<span class="meta-item">${project.mainnet_status}</span>` : ''}
                <span class="meta-item">🔗 Click for details</span>
            </div>
        </div>
        `;
    }).join('');
    
    resultsContainer.innerHTML = `
        <div class="search-summary">
            Found ${results.length} project${results.length === 1 ? '' : 's'} for "${query}"
        </div>
        ${resultsHtml}
    `;
}

// UTILITY FUNCTIONS
function searchRelated(relationshipLabel) {
    document.getElementById('searchInput').value = relationshipLabel.toLowerCase();
    performSearch();
}

function getProjectLogo(projectId) {
    return `deliverables/${projectId}/media/logo.svg`;
}

function openProject(projectId) {
    const githubUrl = `https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/blob/main/deliverables/${projectId}/README.md`;
    window.open(githubUrl, '_blank');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Load project data (placeholder - you'll implement based on your data structure)
async function loadProjectData() {
    // This will be implemented once you have your clean data ready
    console.log('Loading project data...');
    
    // Fallback sample data for testing
    projectsData = [
        {
            id: 'aztec',
            name: 'Aztec Protocol',
            description: 'Privacy-first zkRollup on Ethereum using zero-knowledge proofs',
            category: 'layer2',
            ecosystem: 'ethereum',
            content: 'aztec zero-knowledge zk rollup ethereum solidity',
            mainnet_status: 'testnet',
            supported_chains: ['ethereum']
        },
        {
            id: 'tornado-cash',
            name: 'Tornado Cash',
            description: 'Decentralized mixing protocol for Ethereum',
            category: 'mixing',
            ecosystem: 'ethereum',
            content: 'tornado mixing mixer ethereum privacy',
            mainnet_status: 'mainnet',
            supported_chains: ['ethereum']
        },
        {
            id: 'monero',
            name: 'Monero',
            description: 'Private cryptocurrency using ring signatures',
            category: 'currency',
            content: 'monero privacy ring signatures stealth addresses rust',
            mainnet_status: 'mainnet'
        }
    ];
}

// Feedback form handler (simplified)
function handleFeedbackSubmission(e) {
    e.preventDefault();
    
    const feedbackType = document.getElementById('feedbackType').value;
    const projectName = document.getElementById('projectName').value;
    const description = document.getElementById('description').value;
    const evidence = document.getElementById('evidence').value;
    
    const title = `${feedbackType}: ${projectName}`;
    const body = `**Description:**\n${description}\n\n**Evidence:**\n${evidence}`;
    
    const githubUrl = `https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
    window.open(githubUrl, '_blank');
    
    // Show success message
    const form = document.getElementById('feedbackForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = '✅ Feedback submitted! Complete submission on GitHub.';
    form.insertBefore(successDiv, form.firstChild);
    form.reset();
    
    setTimeout(() => successDiv.remove(), 10000);
}