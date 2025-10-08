#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const lunr = require('lunr');

class SearchIndexBuilder {
  constructor() {
    this.projects = [];
    this.filters = { categories: new Set(), tech_stacks: new Set(), privacy_techniques: new Set(), platforms: new Set() };
    this.statistics = { total_confidence: 0, total_completeness: 0, projects_by_category: {}, projects_by_status: {} };
  }

  async build() {
    const startTime = Date.now();
    console.log('🔨 Building Search Index\n' + '='.repeat(50));
    
    const projectDirs = this.getProjectDirectories();
    console.log(`Found ${projectDirs.length} project directories\n`);
    
    for (const projectDir of projectDirs) {
      this.processProject(projectDir);
    }
    
    console.log(`Processed ${this.projects.length} projects`);
    console.log('Building Lunr.js search index...');
    
    const lunrIndex = this.buildLunrIndex();
    
    const searchIndex = {
      version: '1.0.0',
      generated_at: new Date().toISOString(),
      total_projects: this.projects.length,
      projects: this.projects,
      lunr_index: JSON.stringify(lunrIndex),
      filters: {
        categories: Array.from(this.filters.categories).sort(),
        tech_stacks: Array.from(this.filters.tech_stacks).sort(),
        privacy_techniques: Array.from(this.filters.privacy_techniques).sort(),
        platforms: Array.from(this.filters.platforms).sort(),
      },
      statistics: this.calculateStatistics(),
    };
    
    const outputPath = path.join(__dirname, '..', 'public', 'search-index.json');
    fs.writeFileSync(outputPath, JSON.stringify(searchIndex), 'utf8');
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const fileSize = (fs.statSync(outputPath).size / 1024).toFixed(1);
    
    console.log(`\n✅ Search index built!`);
    console.log(`   Duration: ${duration}s | Size: ${fileSize} KB | Projects: ${this.projects.length}\n`);
    return true;
  }

  getProjectDirectories() {
    const rootDir = path.join(__dirname, '..');
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });
    return entries
      .filter(e => e.isDirectory())
      .filter(e => !['node_modules', '.git', '.next', 'out', 'app', 'components', 'lib', 'public', 'scripts', 'styles', 'tests', '.github'].includes(e.name))
      .map(e => path.join(rootDir, e.name));
  }

  processProject(projectDir) {
    const projectId = path.basename(projectDir);
    try {
      const metadataPath = path.join(projectDir, 'project_metadata.json');
      if (!fs.existsSync(metadataPath)) return;
      
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      
      let excerpt = '';
      const readmePath = path.join(projectDir, 'README.md');
      if (fs.existsSync(readmePath)) {
        excerpt = fs.readFileSync(readmePath, 'utf8').substring(0, 500).replace(/\n/g, ' ').trim();
      }
      
      const project = {
        id: projectId,
        name: metadata.name || projectId,
        description: metadata.description || '',
        tech_stack: metadata.tech_stack || [],
        privacy_techniques: metadata.privacy_techniques || [],
        category: metadata.category || 'other',
        confidence: metadata.confidence || 0,
        excerpt,
        readme_path: `/${projectId}/README.md`,
        status: metadata.status || 'unknown',
        maturity_level: metadata.maturity_level || 'unknown',
        platforms: metadata.blockchain_platforms || [],
      };
      
      this.projects.push(project);
      
      if (project.category) this.filters.categories.add(project.category);
      project.tech_stack.forEach(t => this.filters.tech_stacks.add(t));
      project.privacy_techniques.forEach(t => this.filters.privacy_techniques.add(t));
      project.platforms.forEach(p => this.filters.platforms.add(p));
      
      this.statistics.total_confidence += project.confidence;
      this.statistics.projects_by_category[project.category] = (this.statistics.projects_by_category[project.category] || 0) + 1;
      this.statistics.projects_by_status[project.status] = (this.statistics.projects_by_status[project.status] || 0) + 1;
    } catch (error) {
      console.warn(`  ⚠️  Failed to process ${projectId}`);
    }
  }

  buildLunrIndex() {
    const projects = this.projects; // Capture in closure
    return lunr(function () {
      this.ref('id');
      this.field('name', { boost: 10 });
      this.field('description', { boost: 5 });
      this.field('excerpt', { boost: 3 });
      this.field('tech_stack', { boost: 2 });
      this.field('privacy_techniques', { boost: 2 });
      this.field('category');
      
      projects.forEach(project => {
        this.add({
          id: project.id,
          name: project.name,
          description: project.description,
          excerpt: project.excerpt,
          tech_stack: (project.tech_stack || []).join(' '),
          privacy_techniques: (project.privacy_techniques || []).join(' '),
          category: project.category,
        });
      });
    });
  }

  calculateStatistics() {
    const count = this.projects.length;
    return {
      avg_confidence: count > 0 ? this.statistics.total_confidence / count : 0,
      avg_completeness: 0.7,
      projects_by_category: this.statistics.projects_by_category,
      projects_by_status: this.statistics.projects_by_status,
    };
  }
}

const builder = new SearchIndexBuilder();
builder.build().catch(error => { console.error('Fatal error:', error); process.exit(1); });
