#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load current search index
const searchIndexPath = path.join(__dirname, '../public/data/search-index.json');
const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

console.log(`Processing ${searchIndex.projects.length} projects...`);

// Enrich each project with network and language data
searchIndex.projects = searchIndex.projects.map(project => {
    const projectDir = path.join(__dirname, '..', project.id);

    // Extract blockchain network
    let blockchain_network = 'unknown';
    const contractsPath = path.join(projectDir, 'analysis/smart_contracts.json');
    if (fs.existsSync(contractsPath)) {
        try {
            const contracts = JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
            if (contracts.contracts && contracts.contracts.length > 0) {
                const networks = [...new Set(contracts.contracts.map(c => c.network).filter(Boolean))];
                blockchain_network = networks.length === 1 ? networks[0] :
                                   networks.length > 1 ? 'multi-chain' : 'unknown';
            }
        } catch (e) {
            console.error(`Error reading contracts for ${project.id}:`, e.message);
        }
    }

    // Extract primary language
    let primary_language = 'unknown';
    const githubPath = path.join(projectDir, 'analysis/github_analysis.json');
    if (fs.existsSync(githubPath)) {
        try {
            const github = JSON.parse(fs.readFileSync(githubPath, 'utf8'));
            if (github.languages && github.languages.length > 0) {
                // Get the language with highest percentage
                const topLang = github.languages[0].name.toLowerCase();
                primary_language = topLang;
            }
        } catch (e) {
            console.error(`Error reading github data for ${project.id}:`, e.message);
        }
    }

    // Extract logo and value proposition
    let logo = null;
    let value_proposition = null;
    const metadataPath = path.join(projectDir, 'project_metadata.json');
    if (fs.existsSync(metadataPath)) {
        try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            logo = metadata.logo || null;
            value_proposition = metadata.value_proposition || metadata.description?.substring(0, 150) || null;
        } catch (e) {
            console.error(`Error reading metadata for ${project.id}:`, e.message);
        }
    }

    console.log(`${project.id}: ${blockchain_network} / ${primary_language}`);

    return {
        ...project,
        blockchain_network,
        primary_language,
        logo,
        value_proposition
    };
});

// Save enriched data
fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex, null, 2));
console.log(`\n✅ Enriched ${searchIndex.projects.length} projects with network and language data`);

// Summary
const networks = {};
const languages = {};
searchIndex.projects.forEach(p => {
    networks[p.blockchain_network] = (networks[p.blockchain_network] || 0) + 1;
    languages[p.primary_language] = (languages[p.primary_language] || 0) + 1;
});

console.log('\n📊 Network Distribution:');
Object.entries(networks).sort((a, b) => b[1] - a[1]).forEach(([net, count]) => {
    console.log(`  ${net}: ${count}`);
});

console.log('\n💻 Language Distribution:');
Object.entries(languages).sort((a, b) => b[1] - a[1]).forEach(([lang, count]) => {
    console.log(`  ${lang}: ${count}`);
});
