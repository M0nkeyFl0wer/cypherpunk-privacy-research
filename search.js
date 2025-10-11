/**
 * Search and Filter Functionality for Web3 Privacy Research Portal
 */

class SearchEngine {
    constructor() {
        this.searchInput = null;
        this.searchClear = null;
        this.categoryFilter = null;
        this.blockchainFilter = null;
        this.techFilter = null;
        this.projectsGrid = null;
        this.noResults = null;
        this.searchPrompt = null;
        
        this.currentQuery = '';
        this.currentFilters = {
            category: '',
            blockchain: '',
            technology: ''
        };
        
        this.currentResults = [];
        this.debounceTimeout = null;
    }

    /**
     * Initialize search functionality
     */
    init() {
        this.bindElements();
        this.setupEventListeners();
        this.populateFilterDropdowns();
    }

    /**
     * Bind DOM elements
     */
    bindElements() {
        this.searchInput = document.getElementById('search-input');
        this.searchClear = document.getElementById('search-clear');
        this.categoryFilter = document.getElementById('category-filter');
        this.blockchainFilter = document.getElementById('blockchain-filter');
        this.techFilter = document.getElementById('tech-filter');
        this.projectsGrid = document.getElementById('projects-grid');
        this.noResults = document.getElementById('no-results');
        this.searchPrompt = document.getElementById('search-prompt');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });
            
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                }
            });
        }

        // Search clear button
        if (this.searchClear) {
            this.searchClear.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Filter dropdowns
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.performSearch();
            });
        }

        if (this.blockchainFilter) {
            this.blockchainFilter.addEventListener('change', (e) => {
                this.currentFilters.blockchain = e.target.value;
                this.performSearch();
            });
        }

        if (this.techFilter) {
            this.techFilter.addEventListener('change', (e) => {
                this.currentFilters.technology = e.target.value;
                this.performSearch();
            });
        }
    }

    /**
     * Handle search input with debouncing
     */
    handleSearchInput(value) {
        this.currentQuery = value;
        
        // Show/hide clear button
        if (this.searchClear) {
            if (value.trim()) {
                this.searchClear.style.display = 'block';
            } else {
                this.searchClear.style.display = 'none';
            }
        }

        // Debounce search to avoid too many requests
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        this.debounceTimeout = setTimeout(() => {
            this.performSearch();
        }, 300);
    }

    /**
     * Clear search input and filters
     */
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.focus();
        }
        
        if (this.searchClear) {
            this.searchClear.style.display = 'none';
        }
        
        this.currentQuery = '';
        this.showSearchPrompt();
    }

    /**
     * Show search prompt (initial state)
     */
    showSearchPrompt() {
        if (this.projectsGrid) {
            this.projectsGrid.style.display = 'none';
        }
        if (this.noResults) {
            this.noResults.style.display = 'none';
        }
        if (this.searchPrompt) {
            this.searchPrompt.style.display = 'block';
        }
    }

    /**
     * Clear all filters
     */
    clearAllFilters() {
        if (this.categoryFilter) this.categoryFilter.value = '';
        if (this.blockchainFilter) this.blockchainFilter.value = '';
        if (this.techFilter) this.techFilter.value = '';
        
        this.currentFilters = {
            category: '',
            blockchain: '',
            technology: ''
        };
        
        this.clearSearch();
    }

    /**
     * Populate filter dropdowns with options from loaded data
     */
    async populateFilterDropdowns() {
        if (!window.dataAggregator || !window.dataAggregator.projects.length) {
            return;
        }

        // Categories
        if (this.categoryFilter) {
            const categories = window.dataAggregator.getCategories();
            this.populateSelectOptions(this.categoryFilter, categories);
        }

        // Blockchains
        if (this.blockchainFilter) {
            const blockchains = window.dataAggregator.getBlockchains();
            this.populateSelectOptions(this.blockchainFilter, blockchains);
        }

        // Technologies
        if (this.techFilter) {
            const technologies = window.dataAggregator.getTechnologies();
            this.populateSelectOptions(this.techFilter, technologies);
        }
    }

    /**
     * Populate select element with options
     */
    populateSelectOptions(selectElement, options) {
        // Keep the first option (usually "All ...")
        const firstOption = selectElement.querySelector('option[value=""]');
        selectElement.innerHTML = '';
        
        if (firstOption) {
            selectElement.appendChild(firstOption);
        }

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
    }

    /**
     * Perform search and update results
     */
    performSearch() {
        if (!window.dataAggregator) {
            console.error('DataAggregator not available');
            return;
        }

        // If no search query or filters, show prompt
        if (!this.currentQuery.trim() && 
            !this.currentFilters.category && 
            !this.currentFilters.blockchain && 
            !this.currentFilters.technology) {
            this.showSearchPrompt();
            this.updateURL();
            return;
        }

        // Get search results
        this.currentResults = window.dataAggregator.searchProjects(
            this.currentQuery, 
            this.currentFilters
        );

        // Update UI
        this.displayProjects(this.currentResults);
        this.updateURL();
    }


    /**
     * Display projects in the grid
     */
    displayProjects(projects) {
        if (!this.projectsGrid) return;

        // Hide search prompt when showing results
        if (this.searchPrompt) {
            this.searchPrompt.style.display = 'none';
        }

        if (projects.length === 0) {
            this.projectsGrid.style.display = 'none';
            if (this.noResults) {
                this.noResults.style.display = 'block';
            }
            return;
        }

        this.projectsGrid.style.display = 'grid';
        if (this.noResults) {
            this.noResults.style.display = 'none';
        }

        // Clear existing content
        this.projectsGrid.innerHTML = '';

        // Create project cards
        projects.forEach(project => {
            const card = this.createProjectCard(project);
            this.projectsGrid.appendChild(card);
        });
    }

    /**
     * Create a project card element
     */
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('data-project-id', project.id);

        // Determine project folder path
        const projectPath = this.getProjectFolderPath(project);
        
        // Create card content
        card.innerHTML = `
            <div class="project-header">
                <h3 class="project-title">${this.escapeHtml(project.name || project.id || 'Unknown Project')}</h3>
                <div class="project-links">
                    ${project.website ? `<a href="${this.escapeHtml(project.website)}" class="project-link" target="_blank" rel="noopener" title="Website" onclick="event.stopPropagation()"><i class="fas fa-globe"></i></a>` : ''}
                    ${project.github ? `<a href="${this.escapeHtml(project.github)}" class="project-link" target="_blank" rel="noopener" title="GitHub" onclick="event.stopPropagation()"><i class="fab fa-github"></i></a>` : ''}
                    ${project.documentation ? `<a href="${this.escapeHtml(project.documentation)}" class="project-link" target="_blank" rel="noopener" title="Documentation" onclick="event.stopPropagation()"><i class="fas fa-book"></i></a>` : ''}
                    ${projectPath ? `<a href="${projectPath}" class="project-link" target="_blank" rel="noopener" title="Project Folder" onclick="event.stopPropagation()"><i class="fas fa-folder"></i></a>` : ''}
                </div>
            </div>

            ${project.tagline ? `<div class="project-tagline">${this.escapeHtml(project.tagline)}</div>` : ''}

            <div class="project-description">
                ${this.escapeHtml(project.description || 'No description available')}
            </div>

            <div class="project-meta">
                <div class="project-category">
                    ${this.escapeHtml(project.category || 'Privacy Protocol')}
                </div>
                
                <div class="project-tech">
                    ${(project.blockchain || []).slice(0, 2).map(chain => 
                        `<span class="tech-tag">${this.escapeHtml(chain)}</span>`
                    ).join('')}
                    ${(project.techStack || []).slice(0, 3).map(tech => 
                        `<span class="tech-tag">${this.escapeHtml(tech)}</span>`
                    ).join('')}
                    ${((project.blockchain || []).length + (project.techStack || []).length) > 5 ? 
                        `<span class="tech-tag">+${((project.blockchain || []).length + (project.techStack || []).length) - 5} more</span>` : ''}
                </div>
            </div>

            <div class="project-stats">
                <div class="stat-item">
                    <i class="fas fa-star"></i>
                    <span>${(project.githubStats && project.githubStats.stars) || 0}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-code-branch"></i>
                    <span>${(project.githubStats && project.githubStats.forks) || 0}</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-chart-bar"></i>
                    <span>${Math.round((project.confidence || 0) * 100)}% confidence</span>
                </div>
            </div>
        `;

        // Add click event for modal
        card.addEventListener('click', () => {
            this.showProjectModal(project);
        });

        // Add keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.showProjectModal(project);
            }
        });

        return card;
    }

    /**
     * Show detailed project information in modal
     */
    showProjectModal(project) {
        const modal = document.getElementById('project-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        if (!modal || !modalTitle || !modalBody) return;

        modalTitle.textContent = project.name;
        modalBody.innerHTML = this.createProjectModalContent(project);

        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';

        // Focus management
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.focus();
        }
    }

    /**
     * Create detailed project modal content
     */
    createProjectModalContent(project) {
        const founders = Array.isArray(project.founders) ? project.founders : [];
        const techStackDisplay = [...project.techStack, ...project.languages].slice(0, 10);
        
        return `
            <div class="project-modal-content">
                ${project.tagline ? `<p class="project-tagline" style="font-size: 1.125rem; color: var(--accent-secondary); margin-bottom: 1rem;">${this.escapeHtml(project.tagline)}</p>` : ''}
                
                <div class="project-description" style="margin-bottom: 2rem; line-height: 1.7;">
                    ${this.escapeHtml(project.description)}
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    <div>
                        <h4 style="color: var(--text-primary); margin-bottom: 1rem;">🔗 Links</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            ${project.website ? `<a href="${this.escapeHtml(project.website)}" target="_blank" rel="noopener" style="color: var(--accent-primary);">🌐 Website</a>` : ''}
                            ${project.github ? `<a href="${this.escapeHtml(project.github)}" target="_blank" rel="noopener" style="color: var(--accent-primary);">📱 GitHub</a>` : ''}
                            ${project.documentation ? `<a href="${this.escapeHtml(project.documentation)}" target="_blank" rel="noopener" style="color: var(--accent-primary);">📚 Documentation</a>` : ''}
                            ${project.application ? `<a href="${this.escapeHtml(project.application)}" target="_blank" rel="noopener" style="color: var(--accent-primary);">🚀 Application</a>` : ''}
                        </div>
                    </div>

                    <div>
                        <h4 style="color: var(--text-primary); margin-bottom: 1rem;">⛓️ Blockchain Support</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${project.blockchain.map(chain => 
                                `<span style="background: var(--bg-tertiary); color: var(--text-secondary); padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-size: 0.875rem;">${this.escapeHtml(chain)}</span>`
                            ).join('')}
                        </div>
                    </div>

                    <div>
                        <h4 style="color: var(--text-primary); margin-bottom: 1rem;">🛠️ Technology Stack</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${techStackDisplay.map(tech => 
                                `<span style="background: var(--bg-tertiary); color: var(--text-secondary); padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-size: 0.875rem;">${this.escapeHtml(tech)}</span>`
                            ).join('')}
                        </div>
                    </div>

                    <div>
                        <h4 style="color: var(--text-primary); margin-bottom: 1rem;">📊 GitHub Stats</h4>
                        <div style="display: flex; gap: 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.25rem; color: var(--text-secondary);">
                                <i class="fas fa-star"></i> ${project.githubStats.stars || 0}
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.25rem; color: var(--text-secondary);">
                                <i class="fas fa-code-branch"></i> ${project.githubStats.forks || 0}
                            </div>
                            ${project.githubStats.contributors ? `
                                <div style="display: flex; align-items: center; gap: 0.25rem; color: var(--text-secondary);">
                                    <i class="fas fa-users"></i> ${project.githubStats.contributors}
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    ${founders.length > 0 ? `
                        <div>
                            <h4 style="color: var(--text-primary); margin-bottom: 1rem;">👥 Founders</h4>
                            <div>
                                ${founders.map(founder => {
                                    if (typeof founder === 'string') {
                                        return `<div style="color: var(--text-secondary);">${this.escapeHtml(founder)}</div>`;
                                    } else if (founder.name) {
                                        return `<div style="color: var(--text-secondary);"><strong>${this.escapeHtml(founder.name)}</strong>${founder.role ? ` - ${this.escapeHtml(founder.role)}` : ''}</div>`;
                                    }
                                    return '';
                                }).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div>
                        <h4 style="color: var(--text-primary); margin-bottom: 1rem;">📈 Data Quality</h4>
                        <div style="color: var(--text-secondary);">
                            <div>Confidence: ${Math.round(project.confidence * 100)}%</div>
                            <div>Completeness: ${project.completeness}%</div>
                            ${project.researchDate ? `<div>Research Date: ${project.researchDate}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Update URL with current search state
     */
    updateURL() {
        const params = new URLSearchParams();
        
        if (this.currentQuery.trim()) {
            params.set('q', this.currentQuery);
        }
        
        if (this.currentFilters.category) {
            params.set('category', this.currentFilters.category);
        }
        
        if (this.currentFilters.blockchain) {
            params.set('blockchain', this.currentFilters.blockchain);
        }
        
        if (this.currentFilters.technology) {
            params.set('tech', this.currentFilters.technology);
        }

        const url = new URL(window.location);
        url.search = params.toString();
        
        // Update URL without triggering page reload
        window.history.replaceState({}, '', url);
    }

    /**
     * Load search state from URL parameters
     */
    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.get('q')) {
            this.currentQuery = params.get('q');
            if (this.searchInput) {
                this.searchInput.value = this.currentQuery;
            }
        }
        
        if (params.get('category')) {
            this.currentFilters.category = params.get('category');
            if (this.categoryFilter) {
                this.categoryFilter.value = this.currentFilters.category;
            }
        }
        
        if (params.get('blockchain')) {
            this.currentFilters.blockchain = params.get('blockchain');
            if (this.blockchainFilter) {
                this.blockchainFilter.value = this.currentFilters.blockchain;
            }
        }
        
        if (params.get('tech')) {
            this.currentFilters.technology = params.get('tech');
            if (this.techFilter) {
                this.techFilter.value = this.currentFilters.technology;
            }
        }
    }

    /**
     * Get project folder path based on project data
     */
    getProjectFolderPath(project) {
        // Try to determine category and project name from the data
        if (project.rawData && project.rawData.project_name) {
            // Check common category patterns
            const projectName = project.rawData.project_name;
            const categories = ['defi', 'layer2', 'infrastructure', 'wallets', 'identity', 'other', 'privacy-tools', 'storage', 'zkp'];
            
            for (const category of categories) {
                const path = `${category}/${projectName}`;
                // Return the path - GitHub will handle if it exists or not
                return path;
            }
        }
        return null;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        if (typeof text !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global instance
window.searchEngine = new SearchEngine();