/**
 * Main Application Script for Web3 Privacy Research Portal
 * Initializes all components and handles overall UI functionality
 */

class PrivacyResearchApp {
    constructor() {
        this.isLoaded = false;
        this.currentView = 'grid'; // 'grid' or 'list'
        this.projectsGrid = null;
        this.modal = null;
        this.modalClose = null;
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Web3 Privacy Research Portal...');
        
        try {
            // Bind UI elements
            this.bindElements();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load project data
            await this.loadData();
            
            // Initialize search functionality
            this.initializeSearch();
            
            // Load URL parameters
            this.loadURLState();
            
            // Perform initial search/display
            this.performInitialDisplay();
            
            console.log('Application initialized successfully!');
            
        } catch (error) {
            console.error('Error initializing application:', error);
            this.showError('Failed to initialize the application. Please refresh and try again.');
        }
    }

    /**
     * Bind DOM elements
     */
    bindElements() {
        this.projectsGrid = document.getElementById('projects-grid');
        this.modal = document.getElementById('project-modal');
        this.modalClose = document.getElementById('modal-close');
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {

        // Modal close functionality
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (this.modal) {
            // Close modal when clicking outside
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });

            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('visible')) {
                    this.closeModal();
                }
            });
        }

        // Handle browser back/forward navigation
        window.addEventListener('popstate', () => {
            if (window.searchEngine) {
                window.searchEngine.loadFromURL();
                window.searchEngine.performSearch();
            }
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !this.isLoaded) {
                // Retry loading if page becomes visible and data isn't loaded
                this.loadData();
            }
        });
    }

    /**
     * Load project data
     */
    async loadData() {
        if (!window.dataAggregator) {
            throw new Error('DataAggregator not available');
        }

        console.log('Loading project data...');
        
        try {
            const projects = await window.dataAggregator.loadProjects();
            
            if (projects && projects.length > 0) {
                this.isLoaded = true;
                console.log(`Successfully loaded ${projects.length} projects`);
            } else {
                console.warn('No projects loaded, using fallback data');
            }
            
        } catch (error) {
            console.error('Error loading project data:', error);
            throw error;
        }
    }

    /**
     * Initialize search functionality
     */
    initializeSearch() {
        if (!window.searchEngine) {
            throw new Error('SearchEngine not available');
        }

        console.log('Initializing search functionality...');
        window.searchEngine.init();
    }

    /**
     * Load state from URL parameters
     */
    loadURLState() {
        if (window.searchEngine) {
            window.searchEngine.loadFromURL();
        }
    }

    /**
     * Perform initial display of projects
     */
    performInitialDisplay() {
        // Don't show projects initially - only show search prompt
        // Projects will appear when user searches
        if (window.searchEngine) {
            window.searchEngine.showSearchPrompt();
        }
    }


    /**
     * Close the project modal
     */
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('visible');
            document.body.style.overflow = '';
            
            // Return focus to the previously focused element or search input
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }

    /**
     * Show error message to user
     */
    showError(message) {
        console.error(message);
        
        // Create and show error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--accent-danger);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        errorDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; cursor: pointer; margin-left: auto;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(errorDiv);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);

        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show success message to user
     */
    showSuccess(message) {
        console.log(message);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--accent-secondary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        successDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; cursor: pointer; margin-left: auto;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(successDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }

    /**
     * Get application statistics
     */
    getStats() {
        if (!window.dataAggregator || !this.isLoaded) {
            return null;
        }

        const projects = window.dataAggregator.projects;
        const categories = window.dataAggregator.getCategories();
        const blockchains = window.dataAggregator.getBlockchains();
        const technologies = window.dataAggregator.getTechnologies();

        return {
            totalProjects: projects.length,
            totalCategories: categories.length,
            totalBlockchains: blockchains.length,
            totalTechnologies: technologies.length,
            averageConfidence: projects.reduce((sum, p) => sum + p.confidence, 0) / projects.length,
            averageCompleteness: projects.reduce((sum, p) => sum + p.completeness, 0) / projects.length,
            projectsWithGitHub: projects.filter(p => p.github).length,
            projectsWithWebsite: projects.filter(p => p.website).length
        };
    }
}

// Global app instance
window.privacyResearchApp = new PrivacyResearchApp();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.privacyResearchApp.init();
    });
} else {
    window.privacyResearchApp.init();
}

// Export for debugging
window.getAppStats = () => {
    return window.privacyResearchApp.getStats();
};

// Console welcome message
console.log(`
🔐 Web3 Privacy Research Portal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Welcome to the Web3 Privacy Research Portal!

This application provides comprehensive research on privacy-focused blockchain projects.

Available console commands:
• getAppStats() - Get application statistics
• window.dataAggregator.searchProjects('query', filters) - Search projects programmatically
• window.searchEngine.clearAllFilters() - Clear all search filters

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);