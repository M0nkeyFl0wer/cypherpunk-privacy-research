const fs = require('fs');
const projects = JSON.parse(fs.readFileSync('public/data/projects.json', 'utf8'));

// Sort by completeness and filter for those with rich data
const richProjects = projects
  .filter(p => p.completeness >= 50)
  .sort((a, b) => {
    if (b.completeness > a.completeness) return 1;
    if (b.completeness < a.completeness) return -1;
    return (b.privacyTechniques?.length || 0) - (a.privacyTechniques?.length || 0);
  })
  .reverse();

console.log('Top 15 Most Complete Projects:');
console.log('');
richProjects.slice(0, 15).forEach((p, i) => {
  const privTech = p.privacyTechniques?.length || 0;
  const techStack = p.techStack?.length || 0;
  const slug = p.slug;
  console.log((i+1) + '. ' + p.name.padEnd(25) + ' | ' + p.completeness + '% | Privacy: ' + privTech + ' | Stack: ' + techStack + ' | ' + slug);
});

// Also get all projects sorted
console.log('\n\nAll projects with 50%+ completeness:');
console.log('Slugs: ' + richProjects.map(p => p.slug).join(' '));
