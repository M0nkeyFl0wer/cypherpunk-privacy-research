/**
 * Data Aggregation Script for Web3 Privacy Research Portal
 * Collects and processes project data from constitutional_research.json files
 */

class DataAggregator {
    constructor() {
        this.projects = [];
        this.categories = new Set();
        this.blockchains = new Set();
        this.technologies = new Set();
        this.isLoading = false;
    }

    /**
     * Load all project data
     */
    async loadProjects() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            // First, get the list of all project directories
            const projectDirs = await this.getProjectDirectories();
            
            // Load data for each project
            const projectPromises = projectDirs.map(dir => this.loadProjectData(dir));
            const projectResults = await Promise.all(projectPromises);
            
            // Filter out failed loads and process successful ones
            this.projects = projectResults
                .filter(project => project !== null)
                .map(project => this.processProjectData(project));

            // Extract unique values for filters
            this.extractFilterOptions();

            console.log(`Loaded ${this.projects.length} projects successfully`);
            
        } catch (error) {
            console.error('Error loading projects:', error);
            this.projects = this.getFallbackProjects();
        } finally {
            this.isLoading = false;
        }

        return this.projects;
    }

    /**
     * Get list of project paths by scanning for constitutional_research.json files
     */
    async getProjectDirectories() {
        // Updated structure with category-based organization
        return [
            // DeFi Privacy Projects
            'defi/0xbow',
            'defi/alephim',
            'defi/beam',
            'defi/chainport',
            'defi/hopr',
            'defi/iexec',
            'defi/inco',
            'defi/mask',
            'defi/penumbra',
            'defi/privatepool',
            'defi/starkex',
            'defi/zcash',
            'defi/zkp2p',
            
            // Identity & Privacy Tools
            'identity/circom',
            'identity/dark-forest',
            'identity/elusiv',
            'identity/iron-fish',
            
            // Infrastructure
            'infrastructure/darkfi',
            'infrastructure/grin',
            'infrastructure/incognito',
            'infrastructure/labyrinth',
            'infrastructure/light-protocol',
            'infrastructure/litentry',
            'infrastructure/manta-network',
            'infrastructure/mask-network',
            'infrastructure/mina-protocol',
            'infrastructure/nillion',
            'infrastructure/nym',
            'infrastructure/oasis-network',
            'infrastructure/rotki',
            'infrastructure/scroll',
            'infrastructure/semaphore',
            'infrastructure/sentinel',
            'infrastructure/sismo',
            'infrastructure/snapshot-x',
            'infrastructure/tornado-cash',
            'infrastructure/umbra-cash',
            'infrastructure/veramo',
            'infrastructure/zkvote',
            
            // Layer 2 Solutions
            'layer2/aztec-network',
            'layer2/aztec-protocol',
            'layer2/pse--privacy---scaling-explorations-',
            'layer2/starknet',
            'layer2/taiko',
            'layer2/ten',
            'layer2/zecrey',
            'layer2/zksync',
            
            // Other Projects
            'other/aleo',
            'other/anoma',
            'other/concordium',
            'other/fluidkey',
            'other/iden3',
            'other/mobilecoin',
            'other/monero',
            'other/orchid',
            'other/pirate-chain',
            'other/railgun',
            'other/suterusu',
            'other/zano',
            
            // Privacy Tools
            'privacy-tools/firo',
            
            // Storage
            'storage/fileverse',
            
            // Wallets
            'wallets/arpa',
            'wallets/brume-wallet',
            'wallets/cake-wallet',
            'wallets/edge-wallet',
            'wallets/frame',
            'wallets/oxen',
            'wallets/railway',
            'wallets/railway-wallet',
            'wallets/wasabi-wallet',
            'wallets/zeal',
            'wallets/zion',
            'wallets/zkbob',
            
            // ZKP Projects
            'zkp/findora'
        ];
    }

    /**
     * Load project data from constitutional_research.json file
     */
    async loadProjectData(projectDir) {
        try {
            const response = await fetch(`${projectDir}/constitutional_research.json`);
            if (!response.ok) {
                console.warn(`Failed to load data for ${projectDir}: ${response.status}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.warn(`Error loading ${projectDir}:`, error);
            return null;
        }
    }

    /**
     * Process and normalize project data
     */
    processProjectData(rawProject) {
        const project = {
            id: rawProject.project_name || 'unknown',
            name: this.extractValue(rawProject.basic_information?.name) || rawProject.project_name || 'Unknown',
            description: this.extractValue(rawProject.basic_information?.description) || rawProject.description || 'No description available',
            category: this.extractValue(rawProject.basic_information?.category) || 'Privacy Protocol',
            tagline: this.extractValue(rawProject.basic_information?.tagline) || '',
            
            // Online presence
            website: this.extractValue(rawProject.online_presence?.website) || rawProject.website || null,
            github: rawProject.online_presence?.github?.url || rawProject.github_url || rawProject.github_repository || null,
            documentation: this.extractValue(rawProject.online_presence?.documentation) || null,
            application: this.extractValue(rawProject.online_presence?.application_url) || null,
            
            // Social media
            twitter: rawProject.online_presence?.social_media?.twitter?.value || null,
            discord: rawProject.online_presence?.social_media?.discord?.value || null,
            telegram: rawProject.online_presence?.social_media?.telegram?.value || null,
            
            // Technical details
            blockchain: this.extractBlockchains(rawProject.technical_details?.blockchain_support),
            supportedAssets: this.extractSupportedAssets(rawProject.technical_details?.supported_assets),
            techStack: this.extractTechStack(rawProject),
            languages: this.extractLanguages(rawProject),
            
            // GitHub statistics
            githubStats: this.extractGithubStats(rawProject),
            
            // Team and funding
            team: this.extractTeam(rawProject),
            founders: this.extractFounders(rawProject),
            funding: this.extractFunding(rawProject),
            
            // Privacy features
            privacyFeatures: this.extractPrivacyFeatures(rawProject),
            
            // Metadata
            confidence: rawProject.data_quality_assessment?.overall_confidence || 0,
            completeness: rawProject.data_quality_assessment?.completeness_percentage || 0,
            researchDate: rawProject.research_metadata?.research_date || null,
            
            // Raw data for detailed view
            rawData: rawProject
        };

        return project;
    }

    /**
     * Extract value from confidence-based object structure
     */
    extractValue(obj) {
        if (!obj) return null;
        if (typeof obj === 'string') return obj;
        return obj.value || null;
    }

    /**
     * Extract blockchain information
     */
    extractBlockchains(blockchainSupport) {
        if (!blockchainSupport) return ['Unknown'];
        
        const blockchains = [];
        if (blockchainSupport.primary?.value) {
            blockchains.push(blockchainSupport.primary.value);
        }
        if (blockchainSupport.secondary?.value) {
            blockchains.push(blockchainSupport.secondary.value);
        }
        
        return blockchains.length > 0 ? blockchains : ['Unknown'];
    }

    /**
     * Extract supported assets
     */
    extractSupportedAssets(supportedAssets) {
        if (!supportedAssets) return [];
        
        const assets = [];
        if (supportedAssets.native?.value) {
            assets.push(supportedAssets.native.value);
        }
        if (supportedAssets.erc20?.value && Array.isArray(supportedAssets.erc20.value)) {
            assets.push(...supportedAssets.erc20.value);
        }
        
        return assets;
    }

    /**
     * Extract technology stack
     */
    extractTechStack(project) {
        const techStack = new Set();
        
        // From technical details
        if (project.technical_details?.tech_stack?.privacy_tech?.value) {
            techStack.add(project.technical_details.tech_stack.privacy_tech.value);
        }
        
        // From privacy techniques
        if (project.privacy?.techniques) {
            project.privacy.techniques.forEach(tech => techStack.add(tech));
        }
        
        // From technical information
        if (project.technical_information?.tech_stack) {
            if (Array.isArray(project.technical_information.tech_stack)) {
                project.technical_information.tech_stack.forEach(tech => {
                    if (typeof tech === 'string') {
                        techStack.add(tech);
                    }
                });
            }
        }
        
        return Array.from(techStack);
    }

    /**
     * Extract programming languages
     */
    extractLanguages(project) {
        const languages = [];
        
        // From tech stack languages
        if (project.technical_details?.tech_stack?.languages?.value) {
            const langData = project.technical_details.tech_stack.languages.value;
            if (typeof langData === 'object') {
                languages.push(...Object.keys(langData));
            }
        }
        
        // From GitHub language data
        if (project.technical_stack?.programming_languages) {
            languages.push(...Object.keys(project.technical_stack.programming_languages));
        }
        
        return [...new Set(languages)];
    }

    /**
     * Extract GitHub statistics
     */
    extractGithubStats(project) {
        const githubStats = {
            stars: 0,
            forks: 0,
            watchers: 0,
            language: null,
            lastUpdate: null
        };
        
        // From online presence
        if (project.online_presence?.github?.metrics) {
            const metrics = project.online_presence.github.metrics;
            githubStats.stars = metrics.stars || 0;
            githubStats.forks = metrics.forks || 0;
            githubStats.contributors = metrics.contributors || 0;
            githubStats.lastUpdate = metrics.last_update || null;
        }
        
        // From technical stack
        if (project.technical_stack?.github_statistics) {
            const stats = project.technical_stack.github_statistics;
            githubStats.stars = stats.stars || githubStats.stars;
            githubStats.forks = stats.forks || githubStats.forks;
            githubStats.watchers = stats.watchers || githubStats.watchers;
            githubStats.language = stats.language || githubStats.language;
        }
        
        return githubStats;
    }

    /**
     * Extract team information
     */
    extractTeam(project) {
        if (project.team_information) {
            return project.team_information;
        }
        if (project.team) {
            return project.team;
        }
        return null;
    }

    /**
     * Extract founders information
     */
    extractFounders(project) {
        if (project.team_and_organization?.founders) {
            return project.team_and_organization.founders;
        }
        if (project.founders && Array.isArray(project.founders)) {
            return project.founders;
        }
        return [];
    }

    /**
     * Extract funding information
     */
    extractFunding(project) {
        if (project.funding?.investors || project.funding_and_business?.investors) {
            return {
                investors: project.funding?.investors || project.funding_and_business?.investors,
                rounds: project.funding?.funding_rounds || project.funding_and_business?.funding_rounds
            };
        }
        return null;
    }

    /**
     * Extract privacy features
     */
    extractPrivacyFeatures(project) {
        if (project.privacy_features) {
            return {
                coreMechanism: project.privacy_features.core_mechanism?.value || null,
                keyFeatures: project.privacy_features.key_features || [],
                complianceApproach: project.privacy_features.compliance_approach?.value || null
            };
        }
        return null;
    }

    /**
     * Extract filter options from loaded projects
     */
    extractFilterOptions() {
        this.categories.clear();
        this.blockchains.clear();
        this.technologies.clear();

        this.projects.forEach(project => {
            // Categories
            if (project.category) {
                this.categories.add(project.category);
            }
            
            // Blockchains
            project.blockchain.forEach(blockchain => {
                if (blockchain && blockchain !== 'Unknown') {
                    this.blockchains.add(blockchain);
                }
            });
            
            // Technologies
            project.techStack.forEach(tech => {
                if (tech) {
                    this.technologies.add(tech);
                }
            });
            
            // Languages as technologies
            project.languages.forEach(lang => {
                if (lang) {
                    this.technologies.add(lang);
                }
            });
        });
    }

    /**
     * Get unique categories for filter dropdown
     */
    getCategories() {
        return Array.from(this.categories).sort();
    }

    /**
     * Get unique blockchains for filter dropdown
     */
    getBlockchains() {
        return Array.from(this.blockchains).sort();
    }

    /**
     * Get unique technologies for filter dropdown
     */
    getTechnologies() {
        return Array.from(this.technologies).sort();
    }

    /**
     * Search projects based on query and filters
     */
    searchProjects(query = '', filters = {}) {
        let results = [...this.projects];
        
        // Apply text search
        if (query.trim()) {
            const searchTerm = query.toLowerCase().trim();
            results = results.filter(project => {
                return (
                    project.name.toLowerCase().includes(searchTerm) ||
                    project.description.toLowerCase().includes(searchTerm) ||
                    project.category.toLowerCase().includes(searchTerm) ||
                    project.techStack.some(tech => tech.toLowerCase().includes(searchTerm)) ||
                    project.languages.some(lang => lang.toLowerCase().includes(searchTerm)) ||
                    project.blockchain.some(chain => chain.toLowerCase().includes(searchTerm)) ||
                    (project.tagline && project.tagline.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        // Apply category filter
        if (filters.category) {
            results = results.filter(project => 
                project.category === filters.category
            );
        }
        
        // Apply blockchain filter
        if (filters.blockchain) {
            results = results.filter(project => 
                project.blockchain.includes(filters.blockchain)
            );
        }
        
        // Apply technology filter
        if (filters.technology) {
            results = results.filter(project => 
                project.techStack.includes(filters.technology) ||
                project.languages.includes(filters.technology)
            );
        }
        
        return results;
    }

    /**
     * Get fallback project data if loading fails
     */
    getFallbackProjects() {
        return [
            {
                id: 'sample-project',
                name: 'Sample Privacy Project',
                description: 'This is a sample project shown when data loading fails. Please check the console for errors.',
                category: 'Privacy Protocol',
                website: null,
                github: null,
                blockchain: ['Ethereum'],
                techStack: ['Zero-Knowledge Proofs'],
                languages: ['TypeScript'],
                githubStats: { stars: 0, forks: 0 },
                confidence: 0.5,
                completeness: 0
            }
        ];
    }
}

// Create global instance
window.dataAggregator = new DataAggregator();