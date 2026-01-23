import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';

// Helper to check if a report has substantive content vs just "not found" text
function isEmptyReport(content: string): boolean {
  const emptyMarkers = [
    'not publicly available',
    'No public security audit',
    'No public bug bounty',
    'information not publicly available',
    'No audit reports found',
    'Research needed',
    'Data unavailable',
  ];

  // Check if the report is mostly "not found" messages
  const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('*Research'));
  const emptyLines = lines.filter(l => emptyMarkers.some(m => l.toLowerCase().includes(m.toLowerCase())));

  // If more than 50% of content lines are "not found" markers, consider it empty
  return lines.length < 5 || (emptyLines.length / lines.length) > 0.3;
}

// Dynamic import for client-side visualization
const ProjectMiniGraph = dynamic(
  () => import('@/components/Visualizations/ProjectMiniGraph'),
  { ssr: false, loading: () => <div className="h-[300px] bg-[#111] rounded-lg animate-pulse" /> }
);

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
  repoAnalysis: string | null;
  team: string | null;
  security: string | null;
  osintSummary: string | null;
  readme: string | null;
  metadata: any;
  githubAnalysis: any;
  logo: string; // Path to logo image
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
  const [repoAnalysis, team, security, readme, osintSummary] = await Promise.all([
    readFile(path.join(base, 'reports', 'CODE_REVIEW.md')),
    readFile(path.join(base, 'reports', 'TEAM.md')),
    readFile(path.join(base, 'reports', 'SECURITY.md')),
    readFile(path.join(base, 'README.md')),
    readFile(path.join(base, 'reports', 'opsec_vulnerability_assessment.md')),
  ]);

  // Load JSON data
  const [metadata, githubAnalysis] = await Promise.all([
    readJson(path.join(base, 'project_metadata.json')),
    readJson(path.join(base, 'analysis', 'github_analysis.json')),
  ]);

  // Find logo - check various naming patterns
  const slugUnderscore = slug.replace(/-/g, '_');
  const logoPatterns = [
    `${slug}-logo.png`,
    `${slug}-logo.svg`,
    `${slug}_logo.png`,
    `${slugUnderscore}_logo.png`,
    `${slug}-github-avatar.png`,
    `${slugUnderscore}-github-avatar.png`,
    // Special cases for specific projects
    ...(slug === 'cake-wallet' ? ['cake_logo.png'] : []),
    ...(slug === 'darkfi' ? ['darkfi-github-avatar.png'] : []),
    ...(slug === 'mysterium-network' ? ['mysterium-github-avatar.png', 'myst-token-logo.png'] : []),
    ...(slug === 'hopr' ? ['hopr_logo.png'] : []),
    ...(slug === 'fluidkey' ? ['fluidkey_logo_github.png'] : []),
    ...(slug === 'iron-fish' ? ['logo.svg'] : []),
    ...(slug === 'sienna-network' ? ['sienna-logo.svg'] : []),
    ...(slug === 'snarkjs' ? ['circom-favicon.png'] : []),
    ...(slug === 'zk-money' ? ['aztec-logo.png'] : []),
    ...(slug === 'starkex' ? ['starkware-logo.svg'] : []),
    ...(slug === 'zeal' ? ['logo_icon.svg'] : []),
  ];

  let logo = '/media/default-project.svg';
  const mediaDir = path.join(process.cwd(), 'public', 'media');

  for (const pattern of logoPatterns) {
    try {
      await fs.access(path.join(mediaDir, pattern));
      logo = `/media/${pattern}`;
      break;
    } catch {
      // File doesn't exist, try next pattern
    }
  }

  return {
    name: metadata?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: githubAnalysis?.repository?.description || metadata?.description || '',
    github: githubAnalysis?.repository?.html_url || metadata?.github_url || '',
    website: metadata?.website || '',
    tier,
    repoAnalysis,
    team,
    security,
    osintSummary,
    readme,
    metadata,
    githubAnalysis,
    logo,
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
          <Link href="/projects" className="text-[#94e2d5] hover:underline mt-4 inline-block">
            ← Back
          </Link>
        </div>
      </main>
    );
  }

  const stats = project.githubAnalysis?.repository;

  return (
    <main className="min-h-screen bg-[#000]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <Link href="/projects" className="text-[#a6adc8] hover:text-[#94e2d5] text-sm mb-6 inline-block">
          ← projects
        </Link>

        <div className="flex items-start gap-4 mb-6">
          {/* Project Logo */}
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.logo}
              alt={`${project.name} logo`}
              className="w-24 h-24 rounded-xl object-contain bg-[#111] p-3 border border-[#252525]"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-[#e0e0e0]">{project.name}</h1>
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                project.tier === 'osint'
                  ? 'bg-[#94e2d5]/20 text-[#94e2d5]'
                  : 'bg-[#89b4fa]/20 text-[#89b4fa]'
              }`}>
                {project.tier === 'osint' ? 'OSINT Deep Dive' : 'Standard'}
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
        <div className="space-y-4">
          {project.readme && (
            <ReportSection
              title="README"
              content={project.readme}
              defaultOpen
              color="#94e2d5"
            />
          )}

          {project.osintSummary && (
            <ReportSection
              title="OSINT Assessment"
              content={project.osintSummary}
              color="#f9e2af"
            />
          )}

          {project.repoAnalysis && (
            <ReportSection
              title="Repository Analysis"
              content={project.repoAnalysis}
              color="#89b4fa"
              methodology="Analysis performed using cargo audit, semgrep, and direct code inspection on cloned repositories."
            />
          )}

          {project.team && !isEmptyReport(project.team) && (
            <ReportSection
              title="Team Research"
              content={project.team}
              color="#a6e3a1"
            />
          )}

          {project.security && !isEmptyReport(project.security) && (
            <ReportSection
              title="Security Analysis"
              content={project.security}
              color="#f38ba8"
            />
          )}
        </div>

        {/* Explore Related Projects - Graph at bottom for navigation */}
        <div className="mt-12 pt-8 border-t border-[#252525]">
          <h2 className="text-lg font-medium text-[#e0e0e0] mb-2">Explore Related Projects</h2>
          <p className="text-sm text-[#6c7086] mb-4">
            Click nodes to explore connections. Drag to reposition.
          </p>
          <ProjectMiniGraph projectId={slug} height={400} />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[#252525] text-center">
          <a href="https://web3privacy.info" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 text-[#6c7086] hover:text-[#94e2d5] transition-colors text-sm">
            <span>Community research for Web3Privacy</span>
          </a>
        </div>
      </div>
    </main>
  );
}

// Map report filenames to section IDs and display names
const reportSectionMap: Record<string, { id: string; name: string }> = {
  'TEAM.md': { id: 'team-research', name: 'Team Research' },
  'SECURITY.md': { id: 'security-analysis', name: 'Security Analysis' },
  'CODE_REVIEW.md': { id: 'repository-analysis', name: 'Repository Analysis' },
  'opsec_vulnerability_assessment.md': { id: 'osint-assessment', name: 'OSINT Assessment' },
  'TECHNICAL.md': { id: 'technical-analysis', name: 'Technical Analysis' },
  'RESEARCH_SUMMARY.md': { id: 'research-summary', name: 'Research Summary' },
};

function ReportSection({ title, content, defaultOpen = false, color = '#94e2d5', methodology }: {
  title: string;
  content: string;
  defaultOpen?: boolean;
  color?: string;
  methodology?: string;
}) {
  // Generate section ID from title
  const sectionId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  // Transform image URLs to use local /media/ path
  let transformedContent = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, url) => {
      // Extract just the filename from any URL
      const filename = url.split('/').pop();
      if (filename && (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.svg'))) {
        // Use local media path
        return `![${alt}](/media/${filename})`;
      }
      return match;
    }
  );

  // Transform report links to section anchors
  // Matches [text](reports/filename.md) or [filename.md](reports/filename.md)
  transformedContent = transformedContent.replace(
    /\[([^\]]+)\]\(reports\/([^)]+\.md)\)/g,
    (match, linkText, filename) => {
      const section = reportSectionMap[filename];
      if (section) {
        return `[${section.name}](#${section.id})`;
      }
      // Fallback: just show as "see below" text without broken link
      return `**${linkText.replace('.md', '')}** *(see below)*`;
    }
  );

  return (
    <details id={sectionId} open={defaultOpen} className="group border border-[#252525] rounded-lg overflow-hidden scroll-mt-4">
      <summary className="flex items-center justify-between px-4 py-3 bg-[#111] cursor-pointer hover:bg-[#1a1a1a] transition-colors list-none">
        <span className="font-medium" style={{ color }}>{title}</span>
        <span className="text-[#6c7086] group-open:rotate-180 transition-transform text-sm">▼</span>
      </summary>
      <div className="p-4 bg-[#0a0a0a]">
        {methodology && (
          <div className="mb-4 pb-3 border-b border-[#252525]">
            <Link href="/methodology" className="text-xs text-[#6c7086] hover:text-[#94e2d5] transition-colors flex items-center gap-2">
              <span className="text-[#89b4fa]">⚙</span>
              <span>{methodology}</span>
              <span className="text-[#89b4fa]">→ methodology</span>
            </Link>
          </div>
        )}
        <div className="prose prose-invert prose-sm max-w-none prose-headings:text-[#e0e0e0] prose-p:text-[#a6adc8] prose-strong:text-[#e0e0e0] prose-code:text-[#94e2d5] prose-a:text-[#89b4fa]">
          <ReactMarkdown
            components={{
              img: ({ src, alt }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={alt || ''}
                  className="max-w-[400px] h-auto rounded-lg my-4"
                />
              ),
            }}
          >
            {transformedContent}
          </ReactMarkdown>
        </div>
      </div>
    </details>
  );
}
