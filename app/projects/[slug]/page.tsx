import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

// Generate static params for all projects
export async function generateStaticParams() {
  const deliverables = path.join(process.cwd(), 'deliverables');
  const dirs = await fs.readdir(deliverables);
  const projects = dirs.filter(async (d) => {
    const stat = await fs.stat(path.join(deliverables, d));
    return stat.isDirectory() && d !== 'incognito';
  });
  return projects.map(slug => ({ slug }));
}

interface ProjectData {
  name: string;
  description: string;
  github: string;
  website: string;
  tier: 'osint' | 'standard';
  codeReview: string | null;
  team: string | null;
  security: string | null;
  osint: string | null;
  readme: string | null;
  metadata: any;
  githubAnalysis: any;
}

async function getProjectData(slug: string): Promise<ProjectData | null> {
  const base = path.join(process.cwd(), 'deliverables', slug);

  try {
    await fs.access(base);
  } catch {
    return null;
  }

  // Read all available files
  const readFile = async (filePath: string): Promise<string | null> => {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch {
      return null;
    }
  };

  const readJson = async (filePath: string): Promise<any> => {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  };

  // Check for OSINT projects
  const osintProjects = ['mysterium-network', 'mask-network', 'zano', 'hopr', 'semaphore', 'sienna-network', 'suterusu', 'tornado-cash'];
  const tier = osintProjects.includes(slug) ? 'osint' : 'standard';

  // Load reports
  const [codeReview, team, security, readme] = await Promise.all([
    readFile(path.join(base, 'reports', 'CODE_REVIEW.md')),
    readFile(path.join(base, 'reports', 'TEAM.md')),
    readFile(path.join(base, 'reports', 'SECURITY.md')),
    readFile(path.join(base, 'README.md')),
  ]);

  // Load JSON data
  const [metadata, githubAnalysis] = await Promise.all([
    readJson(path.join(base, 'project_metadata.json')),
    readJson(path.join(base, 'analysis', 'github_analysis.json')),
  ]);

  // OSINT data
  let osint = null;
  if (tier === 'osint') {
    const osintJson = await readJson(path.join(base, 'analysis', 'osint_data.json'));
    if (osintJson) {
      osint = JSON.stringify(osintJson, null, 2);
    }
  }

  return {
    name: metadata?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: githubAnalysis?.repository?.description || metadata?.description || '',
    github: githubAnalysis?.repository?.html_url || metadata?.github_url || '',
    website: metadata?.website || '',
    tier,
    codeReview,
    team,
    security,
    osint,
    readme,
    metadata,
    githubAnalysis,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const project = await getProjectData(slug);

  if (!project) {
    return (
      <main className="min-h-screen bg-[#000] p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#f38ba8]">Project not found: {slug}</p>
          <Link href="/projects" className="text-[#cba6f7] hover:underline mt-4 inline-block">
            ← Back
          </Link>
        </div>
      </main>
    );
  }

  const stats = project.githubAnalysis?.repository;
  const explorerUrl = `https://github.com/web3privacy/explorer-data/tree/main/src/projects/${slug}`;

  return (
    <main className="min-h-screen bg-[#000]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <Link href="/projects" className="text-[#a6adc8] hover:text-[#cba6f7] text-sm mb-6 inline-block">
          ← projects
        </Link>

        <div className="flex items-start gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-[#cdd6f4]">{project.name}</h1>
              <span className={project.tier === 'osint' ? 'badge-osint' : 'badge-standard'}>
                {project.tier}
              </span>
            </div>
            {project.description && (
              <p className="text-[#a6adc8] text-sm">{project.description}</p>
            )}
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-4 mb-8 text-sm">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
               className="text-[#89b4fa] hover:underline">github</a>
          )}
          {project.website && (
            <a href={project.website} target="_blank" rel="noopener noreferrer"
               className="text-[#94e2d5] hover:underline">website</a>
          )}
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer"
             className="text-[#cba6f7] hover:underline">w3p explorer</a>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="text-center">
              <div className="text-xl font-bold text-[#f9e2af]">{stats.stargazers_count?.toLocaleString() || 0}</div>
              <div className="text-xs text-[#6c7086]">stars</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#89b4fa]">{stats.forks_count?.toLocaleString() || 0}</div>
              <div className="text-xs text-[#6c7086]">forks</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#a6e3a1]">{stats.open_issues_count?.toLocaleString() || 0}</div>
              <div className="text-xs text-[#6c7086]">issues</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-[#fab387]">{stats.size ? Math.round(stats.size / 1024) + 'MB' : '-'}</div>
              <div className="text-xs text-[#6c7086]">size</div>
            </div>
          </div>
        )}

        {/* Reports */}
        <div className="space-y-6">
          {project.codeReview && (
            <ReportSection title="CODE_REVIEW.md" content={project.codeReview} defaultOpen />
          )}

          {project.team && (
            <ReportSection title="TEAM.md" content={project.team} />
          )}

          {project.security && (
            <ReportSection title="SECURITY.md" content={project.security} />
          )}

          {project.osint && (
            <ReportSection title="OSINT_DATA.json" content={project.osint} isCode />
          )}

          {project.readme && (
            <ReportSection title="README.md" content={project.readme} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[#313244] text-center">
          <a href="https://web3privacy.info" target="_blank" rel="noopener noreferrer"
             className="w3p-badge">
            <img src="/images/w3p-logo.svg" alt="Web3Privacy" className="h-4" />
            <span>Community research for Web3Privacy</span>
          </a>
        </div>
      </div>
    </main>
  );
}

function ReportSection({ title, content, defaultOpen = false, isCode = false }: {
  title: string;
  content: string;
  defaultOpen?: boolean;
  isCode?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="accordion-trigger list-none cursor-pointer">
        <span className="text-[#cdd6f4] font-medium">{title}</span>
        <span className="text-[#6c7086] group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <div className="accordion-content">
        {isCode ? (
          <pre className="text-xs overflow-x-auto text-[#a6adc8]">{content}</pre>
        ) : (
          <div className="prose text-sm">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </details>
  );
}
