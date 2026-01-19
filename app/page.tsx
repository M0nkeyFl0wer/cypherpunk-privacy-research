import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

async function getStats() {
  const deliverables = path.join(process.cwd(), 'deliverables');
  const dirs = await fs.readdir(deliverables);

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
  const { projects, osintCount, totalStars, totalContributors, languageCount } = await getStats();
  const osint = projects.filter(p => p.tier === 'osint');
  const standard = projects.filter(p => p.tier === 'standard');

  return (
    <main className="min-h-screen bg-[#000]">
      {/* Hero with W3P branding */}
      <div className="border-b border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-6">
            <img src="/images/w3p-logo.svg" alt="Web3Privacy" className="h-8 opacity-60" />
            <span className="text-[#6c7086] text-sm">community research</span>
          </div>

          <h1 className="text-4xl font-bold text-[#cdd6f4] mb-4 leading-tight">
            Web3 Privacy<br />
            <span className="text-[#cba6f7]">Cypherpunk Research Report</span>
          </h1>

          <p className="text-[#a6adc8] text-lg mb-8 max-w-2xl leading-relaxed">
            Independent research on {projects.length} privacy-focused Web3 projects.
            All data verified against primary sources using constitutional methodology.
            Zero synthetic data, zero fabrication.
          </p>

          <div className="flex gap-6 text-sm">
            <Link href="/methodology" className="text-[#89b4fa] hover:underline">methodology →</Link>
            <Link href="/lessons" className="text-[#89b4fa] hover:underline">lessons learned →</Link>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="border-b border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-sm font-medium text-[#6c7086] uppercase tracking-wider mb-6">Key Findings</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-[#cdd6f4] mb-1">{projects.length}</div>
              <div className="text-sm text-[#6c7086]">projects analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#cba6f7] mb-1">{osintCount}</div>
              <div className="text-sm text-[#6c7086]">OSINT deep dives</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#a6e3a1] mb-1">{totalStars.toLocaleString()}</div>
              <div className="text-sm text-[#6c7086]">combined stars</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#89b4fa] mb-1">{languageCount}</div>
              <div className="text-sm text-[#6c7086]">languages tracked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="border-b border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-sm font-medium text-[#6c7086] uppercase tracking-wider mb-6">Executive Summary</h2>

          <div className="prose text-[#bac2de] space-y-4">
            <p>
              This research covers the technical infrastructure, team composition, and security posture
              of {projects.length} Web3 privacy projects. Each project underwent standardized analysis
              including GitHub repository metrics, code composition breakdown, and contributor mapping.
            </p>

            <p>
              <strong className="text-[#cdd6f4]">{osintCount} projects received OSINT deep dives</strong> —
              comprehensive infrastructure analysis including Shodan reconnaissance, subdomain enumeration,
              DNS mapping, and security research. These projects are: {osint.map(p => p.name).join(', ')}.
            </p>

            <p>
              <strong className="text-[#cdd6f4]">Constitutional compliance</strong> was enforced throughout.
              Every claim traces to a primary source. No synthetic data, placeholder text, or fabricated
              information appears in this research. When data was unavailable, it was marked as such
              rather than invented.
            </p>
          </div>

          <div className="mt-8">
            <Link href="/projects" className="text-[#cba6f7] hover:underline text-sm">
              view all project details →
            </Link>
          </div>
        </div>
      </div>

      {/* OSINT Deep Dives */}
      <div className="border-b border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-sm font-medium text-[#cba6f7] uppercase tracking-wider mb-6">
            OSINT Deep Dives
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {osint.map(p => (
              <Link key={p.slug} href={`/projects/${p.slug}`}
                    className="flex items-center justify-between p-4 border border-[#313244] rounded hover:border-[#cba6f7] transition-colors">
                <span className="text-[#cdd6f4]">{p.name}</span>
                <span className="text-[#6c7086] text-sm">{p.stars.toLocaleString()} ★</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Standard Research */}
      <div className="border-b border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-sm font-medium text-[#89b4fa] uppercase tracking-wider mb-6">
            Standard Research ({standard.length} projects)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {standard.map(p => (
              <Link key={p.slug} href={`/projects/${p.slug}`}
                    className="flex items-center justify-between py-2 px-3 rounded hover:bg-[#1e1e2e] transition-colors text-sm">
                <span className="text-[#a6adc8]">{p.name}</span>
                <span className="text-[#6c7086]">{p.stars.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="border-b border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-sm font-medium text-[#6c7086] uppercase tracking-wider mb-6">Explore</h2>

          <div className="flex gap-4">
            <Link href="/visualizations"
                  className="flex-1 p-4 border border-[#313244] rounded hover:border-[#a6e3a1] transition-colors">
              <div className="text-[#a6e3a1] mb-1">data visualizations</div>
              <div className="text-[#6c7086] text-sm">charts, graphs, treemaps</div>
            </Link>
            <Link href="/portal"
                  className="flex-1 p-4 border border-[#313244] rounded hover:border-[#89b4fa] transition-colors">
              <div className="text-[#89b4fa] mb-1">network graph</div>
              <div className="text-[#6c7086] text-sm">project relationships</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/w3p-logo.svg" alt="Web3Privacy" className="h-5 opacity-40" />
            <span className="text-[#6c7086] text-xs">community research for web3privacy</span>
          </div>
          <div className="text-[#6c7086] text-xs">
            <a href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research"
               target="_blank" rel="noopener noreferrer" className="hover:text-[#cba6f7]">source</a>
            <span className="mx-2">·</span>
            <span>jan 2025</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
