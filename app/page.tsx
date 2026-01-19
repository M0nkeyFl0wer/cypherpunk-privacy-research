import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import { HomepageContent } from '@/components/HomepageContent';

async function getStats() {
  const deliverables = path.join(process.cwd(), 'deliverables');

  let dirs: string[] = [];
  try {
    dirs = await fs.readdir(deliverables);
  } catch {
    // Deliverables directory may not exist in all environments
    return {
      projects: [],
      osintCount: 8,
      totalStars: 0,
      totalContributors: 0,
      languageCount: 0,
    };
  }

  const osintProjects = ['mysterium-network', 'mask-network', 'zano', 'hopr', 'semaphore', 'sienna-network', 'suterusu', 'tornado-cash'];

  let totalStars = 0;
  let totalContributors = 0;
  let languages = new Set<string>();
  const projects: Array<{slug: string; name: string; tier: string; stars: number}> = [];

  for (const slug of dirs) {
    if (slug === 'incognito') continue;
    const stat = await fs.stat(path.join(deliverables, slug));
    if (!stat.isDirectory()) continue;

    let name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    let stars = 0;

    try {
      const analysis = await fs.readFile(path.join(deliverables, slug, 'analysis', 'github_analysis.json'), 'utf8');
      const data = JSON.parse(analysis);
      stars = data.repository?.stargazers_count || 0;
      totalStars += stars;
      if (data.contributors) totalContributors += data.contributors.length;
      if (data.languages) {
        Object.keys(data.languages).forEach(l => languages.add(l));
      }
    } catch {}

    projects.push({
      slug,
      name,
      tier: osintProjects.includes(slug) ? 'osint' : 'standard',
      stars,
    });
  }

  return {
    projects: projects.sort((a, b) => b.stars - a.stars),
    osintCount: osintProjects.length,
    totalStars,
    totalContributors,
    languageCount: languages.size,
  };
}

export default async function Home() {
  const { projects, osintCount, totalStars, languageCount } = await getStats();
  const osint = projects.filter(p => p.tier === 'osint');
  const standard = projects.filter(p => p.tier === 'standard');

  return (
    <main className="min-h-screen bg-[#000]">
      {/* Hero with W3P branding */}
      <div className="border-b border-[#252525]">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-6">
            <img src="/images/w3p-logo.svg" alt="Web3Privacy" className="h-8 opacity-60" />
            <span className="text-[#6c7086] text-sm">community research</span>
          </div>

          <h1 className="text-4xl font-bold text-[#e0e0e0] mb-4 leading-tight">
            Web3 Privacy<br />
            <span className="text-[#ffffff]">Cypherpunk Research Report</span>
          </h1>

          <p className="text-[#a6adc8] text-lg mb-8 max-w-2xl leading-relaxed">
            Independent research on {projects.length || 40} privacy-focused Web3 projects.
            All data verified against primary sources using constitutional methodology.
            Zero synthetic data, zero fabrication.
          </p>

          <div className="flex gap-6 text-sm">
            <Link href="/methodology" className="text-[#89b4fa] hover:underline">methodology →</Link>
            <Link href="/lessons" className="text-[#89b4fa] hover:underline">lessons learned →</Link>
          </div>
        </div>
      </div>

      {/* Main content with collapsible sections */}
      <HomepageContent
        projectCount={projects.length || 40}
        osintCount={osintCount}
        totalStars={totalStars}
        languageCount={languageCount}
        osintProjects={osint}
        standardProjects={standard}
      />

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/w3p-logo.svg" alt="Web3Privacy" className="h-5 opacity-40" />
            <span className="text-[#6c7086] text-xs">community research for web3privacy</span>
          </div>
          <div className="text-[#6c7086] text-xs">
            <a href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research"
               target="_blank" rel="noopener noreferrer" className="hover:text-[#ffffff]">source</a>
            <span className="mx-2">·</span>
            <span>jan 2025</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
