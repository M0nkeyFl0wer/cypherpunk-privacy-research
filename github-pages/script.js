// Project data - will be loaded from deliverables
let projectsData = [];

// Initialize the page - removed to avoid duplicate

// Setup event listeners
function setupEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const feedbackForm = document.getElementById('feedbackForm');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Real-time search as user types
    searchInput.addEventListener('input', debounce(performSearch, 300));

    feedbackForm.addEventListener('submit', handleFeedbackSubmission);
}

// Load project data from deliverables
async function loadProjectData() {
    try {
        // First, let's try to get the list of projects from deliverables directory
        const projects = await scanDeliverables();
        projectsData = projects;
        console.log(`Loaded ${projectsData.length} projects`);
    } catch (error) {
        console.error('Error loading project data:', error);
        // Show error message to user
        document.getElementById('searchResults').innerHTML = 
            '<div class="loading">Error loading project data. Please check the deliverables folder.</div>';
    }
}

// Scan deliverables directory for projects
async function scanDeliverables() {
    const projects = [];
    
    // List of known project directories (you can expand this)
    const knownProjects = [
        '0xbow', 'aleo', 'aztec', 'beam', 'circom', 'darkfi', 'firo', 'grin',
        'hopr', 'iron-fish', 'monero', 'nym', 'penumbra', 'railgun', 'tornado-cash',
        'zcash', 'zksync', 'polygon-nightfall', 'aztec-protocol', 'manta-network',
        'phala-network', 'secret-network', 'oasis-network', 'orchid', 'mysterium-network'
    ];

    for (const projectName of knownProjects) {
        try {
            const project = await loadProjectInfo(projectName);
            if (project) {
                projects.push(project);
            }
        } catch (error) {
            console.warn(`Could not load project ${projectName}:`, error);
        }
    }

    return projects;
}

// Load individual project info
async function loadProjectInfo(projectName) {
    try {
        const project = {
            id: projectName,
            name: projectName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            category: 'Privacy',
            hasReadme: false,
            hasCard: false,
            github: null,
            website: null,
            confidence: 0,
            completeness: 0,
            blockchain: null,
            status: 'unknown'
        };

        // Load README
        try {
            const readmeResponse = await fetch(`deliverables/${projectName}/README.md`);
            if (readmeResponse.ok) {
                const readmeContent = await readmeResponse.text();
                project.content = readmeContent;
                project.description = extractDescription(readmeContent);
                project.hasReadme = true;
            }
        } catch (e) {}

        // Load Card
        try {
            const cardResponse = await fetch(`deliverables/${projectName}/CARD.md`);
            if (cardResponse.ok) {
                const cardContent = await cardResponse.text();
                project.cardContent = cardContent;
                project.hasCard = true;
                
                // Extract data from card
                const cardData = parseCardContent(cardContent);
                Object.assign(project, cardData);
            }
        } catch (e) {}

        // Load metadata
        try {
            const metadataResponse = await fetch(`deliverables/${projectName}/project_metadata.json`);
            if (metadataResponse.ok) {
                const metadata = await metadataResponse.json();
                Object.assign(project, metadata);
            }
        } catch (e) {}

        // Load constitutional research data
        try {
            const researchResponse = await fetch(`deliverables/${projectName}/constitutional_research.json`);
            if (researchResponse.ok) {
                const researchData = await researchResponse.json();
                
                // Extract useful data
                if (researchData.metadata) {
                    project.confidence = researchData.metadata.confidence_score || project.confidence;
                    project.completeness = researchData.metadata.completeness || project.completeness;
                }
                if (researchData.website) {
                    project.website = researchData.website;
                }
                if (researchData.on_chain_analysis?.on_chain_metrics?.deployment_network) {
                    project.blockchain = researchData.on_chain_analysis.on_chain_metrics.deployment_network;
                }
                
                project.researchData = researchData;
            }
        } catch (e) {}

        // If we have no description, use project name
        if (!project.description) {
            project.description = `Privacy-focused Web3 project: ${project.name}`;
        }

        return project;
    } catch (error) {
        console.warn(`Error loading ${projectName}:`, error);
    }
    return null;
}

// Extract description from README content
function extractDescription(content) {
    const lines = content.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line && !line.startsWith('#') && !line.startsWith('![') && line.length > 20) {
            return line.substring(0, 150) + (line.length > 150 ? '...' : '');
        }
    }
    return 'Web3 privacy project';
}

// Parse card content to extract metadata
function parseCardContent(cardContent) {
    const cardData = {};
    
    // Extract GitHub URL
    const githubMatch = cardContent.match(/(?:🔍\s*\*\*GitHub\*\*|GitHub)\s*[:|]\s*([^\n|]+)/i);
    if (githubMatch) {
        cardData.github = githubMatch[1].trim();
    }
    
    // Extract website
    const websiteMatch = cardContent.match(/(?:🌐\s*\*\*Website\*\*|Website)\s*[:|]\s*([^\n|]+)/i);
    if (websiteMatch) {
        cardData.website = websiteMatch[1].trim();
    }
    
    // Extract blockchain
    const blockchainMatch = cardContent.match(/(?:🔗\s*\*\*Blockchain\*\*|Blockchain)\s*[:|]\s*([^\n|]+)/i);
    if (blockchainMatch) {
        cardData.blockchain = blockchainMatch[1].trim();
    }
    
    // Extract research quality/confidence
    const qualityMatch = cardContent.match(/(?:📊\s*\*\*Research Quality\*\*|Research Quality)\s*[:|]\s*([0-9.]+)/i);
    if (qualityMatch) {
        cardData.confidence = parseFloat(qualityMatch[1]);
    }
    
    // Extract category from second line if it's not a header
    const lines = cardContent.split('\n');
    if (lines.length > 1) {
        const secondLine = lines[1].trim();
        if (secondLine && !secondLine.startsWith('#') && !secondLine.startsWith('<')) {
            cardData.category = secondLine.replace(/\*\*/g, '');
        }
    }
    
    return cardData;
}

// Open project details
function openProject(projectId) {
    // Open the actual GitHub README
    const githubUrl = `https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/blob/main/deliverables/${projectId}/README.md`;
    window.open(githubUrl, '_blank');
}


// Display search results
function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('searchResults');

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="loading">
                No projects found for "${query}". Try searching for terms like "privacy", "zk", "mixing", "ethereum", "monero", or specific project names.
            </div>
        `;
        return;
    }

    const resultsHtml = results.map(project => {
        const projectLogo = getProjectLogo(project.id);
        const cleanDescription = project.description || 'Privacy-focused Web3 project';
        const relationships = getProjectRelationships(project);
        
        return `
        <div class="project-card" onclick="openProject('${project.id}')">
            <div class="project-header">
                ${projectLogo ? `<img src="${projectLogo}" alt="${project.name} logo" class="project-logo">` : ''}
                <div class="project-info">
                    <div class="project-title">${project.name}</div>
                    <div class="project-description">${cleanDescription}</div>
                </div>
            </div>
            <div class="project-details">
                ${project.website ? `<div class="detail-item">🌐 <a href="${project.website}" target="_blank" onclick="event.stopPropagation()">${project.website}</a></div>` : ''}
                ${project.github ? `<div class="detail-item">📱 <a href="${project.github}" target="_blank" onclick="event.stopPropagation()">${project.github}</a></div>` : ''}
                ${project.ecosystem ? `<div class="detail-item">⛓️ ${project.ecosystem}</div>` : ''}
                ${project.supported_chains && project.supported_chains.length ? `<div class="detail-item">🔗 ${project.supported_chains.join(', ')}</div>` : ''}
            </div>
            ${relationships.length ? `<div class="project-relationships">
                ${relationships.map(rel => `<span class="relationship-tag">${rel}</span>`).join('')}
            </div>` : ''}
            <div class="project-meta">
                <span class="meta-item">${project.category || 'Privacy'}</span>
                ${project.mainnet_status ? `<span class="meta-item">${project.mainnet_status}</span>` : ''}
                <span class="meta-item">🔗 Click to view details</span>
            </div>
        </div>
        `;
    }).join('');

    resultsContainer.innerHTML = `
        <div style="margin-bottom: 20px; color: #cccccc;">
            Found ${results.length} project${results.length === 1 ? '' : 's'} matching "${query}"
        </div>
        ${resultsHtml}
    `;
}

// Handle feedback form submission
function handleFeedbackSubmission(e) {
    e.preventDefault();

    const feedbackType = document.getElementById('feedbackType').value;
    const projectName = document.getElementById('projectName').value;
    const description = document.getElementById('description').value;
    const evidence = document.getElementById('evidence').value;

    // Create GitHub issue title and body
    const title = `${getFeedbackTypeLabel(feedbackType)}${projectName ? `: ${projectName}` : ''}`;
    const body = createIssueBody(feedbackType, projectName, description, evidence);

    // Create GitHub issue URL
    const githubUrl = createGitHubIssueUrl(title, body);

    // Open GitHub issue in new tab
    window.open(githubUrl, '_blank');

    // Show success message
    showSuccessMessage();
}

// Get feedback type label
function getFeedbackTypeLabel(type) {
    const labels = {
        'missing-project': 'Missing Project',
        'incorrect-data': 'Data Correction',
        'update-needed': 'Update Request',
        'general-feedback': 'Feedback'
    };
    return labels[type] || 'Feedback';
}

// Create GitHub issue body
function createIssueBody(type, projectName, description, evidence) {
    let body = `## ${getFeedbackTypeLabel(type)}\n\n`;
    
    if (projectName) {
        body += `**Project:** ${projectName}\n\n`;
    }

    body += `**Description:**\n${description}\n\n`;

    if (evidence) {
        body += `**Supporting Evidence:**\n${evidence}\n\n`;
    }

    body += `---\n*Submitted via Web3 Privacy Research feedback form*`;

    return body;
}

// Create GitHub issue URL
function createGitHubIssueUrl(title, body) {
    const repoUrl = 'https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research';
    const issueUrl = `${repoUrl}/issues/new`;
    
    const params = new URLSearchParams({
        title: title,
        body: body,
        labels: 'feedback'
    });

    return `${issueUrl}?${params.toString()}`;
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('feedbackForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        ✅ <strong>Feedback submitted!</strong><br>
        A new GitHub issue has opened in another tab. Please complete the submission there.
    `;

    form.insertBefore(successDiv, form.firstChild);

    // Reset form
    form.reset();

    // Remove success message after 10 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 10000);
}

// Debounce function for search
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

// Add some sample data if deliverables can't be loaded
if (typeof window !== 'undefined') {
    window.fallbackProjectData = [
        {
            id: 'tornado-cash',
            name: 'Tornado Cash',
            description: 'A fully decentralized non-custodial protocol allowing private transactions on Ethereum.',
            category: 'Mixing',
            hasReadme: true
        },
        {
            id: 'zcash',
            name: 'Zcash',
            description: 'A privacy-focused cryptocurrency using zero-knowledge proofs to enable shielded transactions.',
            category: 'Currency',
            hasReadme: true
        },
        {
            id: 'monero',
            name: 'Monero',
            description: 'A private, secure, and untraceable cryptocurrency using ring signatures and stealth addresses.',
            category: 'Currency',
            hasReadme: true
        },
        {
            id: 'aztec',
            name: 'Aztec Protocol',
            description: 'A privacy-first zkRollup on Ethereum, making programmable privacy accessible.',
            category: 'Layer 2',
            hasReadme: true
        }
    ];
}

// Render markdown content with images and links
function renderMarkdownCard(content) {
    if (!content) return '';
    
    // Limit content length for cards
    let cardContent = content.substring(0, 500);
    
    // Convert markdown images
    cardContent = cardContent.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="card-image">');
    
    // Convert markdown links
    cardContent = cardContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" onclick="event.stopPropagation()">$1</a>');
    
    // Convert headers
    cardContent = cardContent.replace(/^### (.+)/gm, '<h4>$1</h4>');
    cardContent = cardContent.replace(/^## (.+)/gm, '<h3>$1</h3>');
    cardContent = cardContent.replace(/^# (.+)/gm, '<h2>$1</h2>');
    
    // Convert bold and italic
    cardContent = cardContent.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    cardContent = cardContent.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Convert line breaks
    cardContent = cardContent.replace(/\n/g, '<br>');
    
    // Convert tables (basic)
    cardContent = cardContent.replace(/\|([^\n]+)\|/g, '<div class="table-row">$1</div>');
    
    return cardContent;
}

// Get project relationships based on ecosystem, tech stack, etc.
function getProjectRelationships(project) {
    const relationships = [];
    
    if (project.ecosystem) {
        const ecosystemProjects = projectsData.filter(p => 
            p.id !== project.id && 
            (p.ecosystem === project.ecosystem || 
             p.supported_chains?.includes(project.ecosystem?.toLowerCase()) ||
             p.blockchain === project.ecosystem?.toLowerCase())
        );
        
        if (ecosystemProjects.length > 0) {
            relationships.push(`${project.ecosystem} Ecosystem (${ecosystemProjects.length} projects)`);
        }
    }
    
    if (project.supported_chains) {
        project.supported_chains.forEach(chain => {
            const chainProjects = projectsData.filter(p => 
                p.id !== project.id && 
                (p.supported_chains?.includes(chain) || 
                 p.ecosystem?.toLowerCase() === chain ||
                 p.blockchain?.toLowerCase() === chain)
            );
            
            if (chainProjects.length > 0) {
                relationships.push(`${chain.toUpperCase()} (${chainProjects.length} projects)`);
            }
        });
    }
    
    if (project.category) {
        const categoryProjects = projectsData.filter(p => 
            p.id !== project.id && p.category === project.category
        );
        
        if (categoryProjects.length > 0) {
            relationships.push(`${project.category.toUpperCase()} category (${categoryProjects.length} projects)`);
        }
    }
    
    // Check for ZK/Privacy techniques
    if (project.description?.toLowerCase().includes('zk') || project.name.toLowerCase().includes('aztec')) {
        const zkProjects = projectsData.filter(p => 
            p.id !== project.id && 
            (p.description?.toLowerCase().includes('zk') || 
             p.description?.toLowerCase().includes('zero-knowledge') ||
             p.name.toLowerCase().includes('aztec'))
        );
        
        if (zkProjects.length > 0) {
            relationships.push(`Zero-Knowledge (${zkProjects.length} projects)`);
        }
    }
    
    return relationships.slice(0, 3); // Limit to 3 relationships
}


// Get project logo path
function getProjectLogo(projectId) {
    // Common logo file names and paths
    const possibleLogos = [
        `deliverables/${projectId}/media/logo.svg`,
        `deliverables/${projectId}/media/logo.png`,
        `deliverables/${projectId}/media/${projectId}-logo.svg`,
        `deliverables/${projectId}/media/${projectId}-logo.png`,
        `deliverables/${projectId}/images/logo.svg`,
        `deliverables/${projectId}/images/logo.png`
    ];
    
    // For now, return the most likely path
    // In a real implementation, you'd check if the file exists
    return `deliverables/${projectId}/media/logo.svg`;
}

// Simple search without enhanced features
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

    // Regular search
    const results = projectsData.filter(project => {
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

    displaySearchResults(results, query);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProjectData();
    setupEventListeners();
});

// Use fallback data if main loading fails
setTimeout(() => {
    if (projectsData.length === 0 && window.fallbackProjectData) {
        console.log('Using fallback project data');
        projectsData = window.fallbackProjectData;
    }
}, 2000);
