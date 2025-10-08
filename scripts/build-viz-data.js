#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

class VizDataBuilder {
  constructor() {
    this.projects = [];
  }

  async build() {
    console.log('📊 Building Visualization Data\n' + '='.repeat(50));
    
    const projectDirs = this.getProjectDirectories();
    console.log(`Found ${projectDirs.length} project directories\n`);
    
    for (const projectDir of projectDirs) {
      this.loadProject(projectDir);
    }
    
    console.log(`Loaded ${this.projects.length} projects`);
    
    const vizData = {
      network: this.buildNetworkGraph(),
      timeline: this.buildTimeline(),
      categories: this.buildCategoryDistribution(),
      generated_at: new Date().toISOString(),
    };
    
    const outputPath = path.join(__dirname, '..', 'public', 'viz-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(vizData), 'utf8');
    
    const fileSize = (fs.statSync(outputPath).size / 1024).toFixed(1);
    console.log(`\n✅ Visualization data built!`);
    console.log(`   Size: ${fileSize} KB | Projects: ${this.projects.length}\n`);
    return true;
  }

  getProjectDirectories() {
    const rootDir = path.join(__dirname, '..');
    return fs.readdirSync(rootDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .filter(e => !['node_modules', '.git', '.next', 'out', 'app', 'components', 'lib', 'public', 'scripts', 'styles', 'tests', '.github'].includes(e.name))
      .map(e => path.join(rootDir, e.name));
  }

  loadProject(projectDir) {
    const projectId = path.basename(projectDir);
    try {
      const metadataPath = path.join(projectDir, 'project_metadata.json');
      if (!fs.existsSync(metadataPath)) return;
      
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      this.projects.push({
        id: projectId,
        name: metadata.name || projectId,
        category: metadata.category || 'other',
        tech_stack: metadata.tech_stack || [],
        privacy_techniques: metadata.privacy_techniques || [],
        confidence: metadata.confidence || 0,
        launch_date: metadata.launch_date || null,
      });
    } catch (error) {
      // Skip invalid projects
    }
  }

  buildNetworkGraph() {
    const nodes = this.projects.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      confidence: p.confidence,
      tech_stack: p.tech_stack,
      privacy_techniques: p.privacy_techniques,
    }));
    
    const edges = [];
    for (let i = 0; i < this.projects.length; i++) {
      for (let j = i + 1; j < this.projects.length; j++) {
        const p1 = this.projects[i];
        const p2 = this.projects[j];
        const sharedTech = p1.tech_stack.filter(t => p2.tech_stack.includes(t));
        const sharedPrivacy = p1.privacy_techniques.filter(t => p2.privacy_techniques.includes(t));
        const shared = [...sharedTech, ...sharedPrivacy];
        
        if (shared.length > 0) {
          edges.push({
            source: p1.id,
            target: p2.id,
            weight: shared.length,
            shared_tech: shared,
          });
        }
      }
    }
    
    return { nodes, edges };
  }

  buildTimeline() {
    return this.projects
      .filter(p => p.launch_date)
      .map(p => ({
        date: p.launch_date,
        project_id: p.id,
        project_name: p.name,
        category: p.category,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  buildCategoryDistribution() {
    const counts = {};
    this.projects.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    
    const total = this.projects.length;
    return Object.entries(counts).map(([category, count]) => ({
      category,
      count,
      percentage: (count / total * 100).toFixed(1),
    }));
  }
}

const builder = new VizDataBuilder();
builder.build().catch(error => { console.error('Fatal error:', error); process.exit(1); });
