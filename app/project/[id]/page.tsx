import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

interface ProjectData {
  id: string;
  slug: string;
  name: string;
  description?: string;
  website?: string;
  github?: string;
  confidence: number;
  researchDate?: string;
  category?: string;
  ecosystem?: string;
  status?: string;
  team?: Array<{
    name: string;
    role?: string;
    linkedin?: string;
    status?: string;
  }>;
  technology?: {
    privacyTechniques?: string[];
    techStack?: string[];
    platforms?: string[];
  };
  contracts?: any[];
  milestones?: any[];
  metrics?: any;
  marketData?: any;
  githubMetrics?: any;
  legalHistory?: any;
}

interface ProjectPageProps {
  params: {
    id: string;
  };
}

// Load all projects from generated JSON
function loadProjects(): ProjectData[] {
  const projectsPath = path.join(process.cwd(), 'public', 'data', 'projects.json');
  if (!fs.existsSync(projectsPath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
}

// Get all project IDs for static generation
export async function generateStaticParams() {
  const projects = loadProjects();
  return projects.map(p => ({ id: p.id }));
}

// Load single project data
async function getProjectData(id: string): Promise<ProjectData | null> {
  const projects = loadProjects();
  return projects.find(p => p.id === id) || null;
}

// Load markdown report file if it exists
function loadReport(id: string, filename: string): string | null {
  const reportPath = path.join(process.cwd(), 'deliverables', id, 'reports', filename);
  if (fs.existsSync(reportPath)) {
    return fs.readFileSync(reportPath, 'utf8');
  }
  return null;
}

// Load README from deliverables
function loadReadme(id: string): string | null {
  const readmePath = path.join(process.cwd(), 'deliverables', id, 'README.md');
  if (fs.existsSync(readmePath)) {
    return fs.readFileSync(readmePath, 'utf8');
  }
  return null;
}

// Load CARD.md summary
function loadCard(id: string): string | null {
  const cardPath = path.join(process.cwd(), 'deliverables', id, 'CARD.md');
  if (fs.existsSync(cardPath)) {
    return fs.readFileSync(cardPath, 'utf8');
  }
  return null;
}

// Check which reports exist for a project
function getAvailableReports(id: string): string[] {
  const reportsDir = path.join(process.cwd(), 'deliverables', id, 'reports');
  if (!fs.existsSync(reportsDir)) {
    return [];
  }
  return fs.readdirSync(reportsDir).filter(f => f.endsWith('.md'));
}

// Simple markdown section renderer (strips headers, formats content)
function MarkdownSection({ content, title }: { content: string; title: string }) {
  // Remove the first header line if it matches the title pattern
  const lines = content.split('\n');
  let startIdx = 0;
  if (lines[0]?.startsWith('#')) {
    startIdx = 1;
  }
  // Skip empty lines after header
  while (startIdx < lines.length && lines[startIdx].trim() === '') {
    startIdx++;
  }
  const cleanContent = lines.slice(startIdx).join('\n');

  return (
    <section className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6 mb-6">
      <h2 className="text-xl font-bold text-brand-text-primary mb-4 flex items-center gap-2">
        {title}
      </h2>
      <div className="prose prose-invert prose-sm max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-sm text-brand-text-secondary leading-relaxed bg-transparent p-0 m-0">
          {cleanContent}
        </pre>
      </div>
    </section>
  );
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = params;
  const project = await getProjectData(id);

  if (!project) {
    notFound();
  }

  // Load all report files
  const readme = loadReadme(id);
  const card = loadCard(id);
  const teamReport = loadReport(id, 'TEAM.md');
  const securityReport = loadReport(id, 'SECURITY.md');
  const technicalReport = loadReport(id, 'technical_analysis.md');
  const codeReview = loadReport(id, 'CODE_REVIEW.md');
  const opsecReport = loadReport(id, 'opsec_vulnerability_assessment.md');
  const newsReport = loadReport(id, 'news_report.md');
  const availableReports = getAvailableReports(id);

  // Get confidence badge styling
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return { bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-600/20', label: 'High Confidence' };
    } else if (confidence >= 0.5) {
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-600/20', label: 'Medium Confidence' };
    } else {
      return { bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-600/20', label: 'Low Confidence' };
    }
  };

  const badge = getConfidenceBadge(project.confidence);

  return (
    <div className="min-h-screen bg-brand-bg-dark">
      {/* Header */}
      <header className="bg-brand-bg-darker border-b border-brand-bg-active">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/search"
              className="text-sm font-medium text-brand-accent-purple hover:text-brand-accent-pink flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Search
            </Link>
          </div>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-brand-text-primary mb-3">
                {project.name}
              </h1>

              {project.description && (
                <p className="text-lg text-brand-text-secondary mb-4">
                  {project.description}
                </p>
              )}

              {/* Metadata badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${badge.bg} ${badge.text} ring-1 ring-inset ${badge.ring}`}
                >
                  {(project.confidence * 100).toFixed(0)}% {badge.label}
                </span>

                {project.ecosystem && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {project.ecosystem}
                  </span>
                )}

                {project.category && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {project.category}
                  </span>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-col gap-2">
              {project.website && (
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-accent-purple rounded-lg hover:bg-brand-accent-pink transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Website
                </a>
              )}

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-text-primary bg-brand-bg-darker border border-brand-bg-active rounded-lg hover:border-brand-accent-blue transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area - Templated Sections */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Summary Card */}
            {card && (
              <MarkdownSection content={card} title="Quick Summary (CARD.md)" />
            )}

            {/* Team Section */}
            {teamReport && (
              <MarkdownSection content={teamReport} title="Team & Leadership" />
            )}

            {/* Technical Analysis */}
            {technicalReport && (
              <MarkdownSection content={technicalReport} title="Technical Analysis" />
            )}

            {/* Security Assessment */}
            {securityReport && (
              <MarkdownSection content={securityReport} title="Security Assessment" />
            )}

            {/* Code Review */}
            {codeReview && (
              <MarkdownSection content={codeReview} title="Code Review" />
            )}

            {/* OPSEC Vulnerability Assessment */}
            {opsecReport && (
              <MarkdownSection content={opsecReport} title="OPSEC Vulnerability Assessment" />
            )}

            {/* News & Updates */}
            {newsReport && (
              <MarkdownSection content={newsReport} title="News & Updates" />
            )}

            {/* Legal History (from JSON data) */}
            {project.legalHistory && (
              <section className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
                <h2 className="text-xl font-bold text-brand-text-primary mb-4">Legal History</h2>
                {project.legalHistory.status && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Status: {project.legalHistory.status}
                    </span>
                  </div>
                )}
                {project.legalHistory.key_events && (
                  <div className="space-y-4">
                    {project.legalHistory.key_events.map((event: any, idx: number) => (
                      <div key={idx} className="border-l-2 border-brand-accent-purple pl-4">
                        <div className="text-sm text-brand-text-muted">{event.date}</div>
                        <div className="font-medium text-brand-text-primary">{event.event}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Milestones (from JSON data) */}
            {project.milestones && project.milestones.length > 0 && (
              <section className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
                <h2 className="text-xl font-bold text-brand-text-primary mb-4">Project Milestones</h2>
                <div className="space-y-4">
                  {project.milestones.map((milestone: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-24 text-sm text-brand-accent-purple font-mono">
                        {milestone.date || milestone.year}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-brand-text-primary">{milestone.event || milestone.title}</div>
                        {milestone.description && (
                          <div className="text-sm text-brand-text-secondary mt-1">{milestone.description}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Smart Contracts (from JSON data) */}
            {project.contracts && project.contracts.length > 0 && (
              <section className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
                <h2 className="text-xl font-bold text-brand-text-primary mb-4">Smart Contracts</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-brand-text-muted text-left">
                        <th className="pr-4 py-2">Network</th>
                        <th className="pr-4 py-2">Name</th>
                        <th className="py-2">Address</th>
                      </tr>
                    </thead>
                    <tbody className="text-brand-text-secondary">
                      {project.contracts.map((contract: any, idx: number) => (
                        <tr key={idx} className="border-t border-brand-bg-active">
                          <td className="pr-4 py-2">{contract.network || contract.chain}</td>
                          <td className="pr-4 py-2">{contract.name || contract.type}</td>
                          <td className="py-2 font-mono text-xs break-all">{contract.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Full README (if no other reports available) */}
            {readme && !teamReport && !technicalReport && !securityReport && (
              <MarkdownSection content={readme} title="Project Overview (README.md)" />
            )}

            {/* Available Reports Index */}
            {availableReports.length > 0 && (
              <section className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
                <h2 className="text-xl font-bold text-brand-text-primary mb-4">Available Reports</h2>
                <ul className="space-y-2 text-sm">
                  {availableReports.map(report => (
                    <li key={report} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-brand-text-secondary font-mono">{report}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Research Metadata */}
            <div className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
              <h3 className="text-lg font-bold text-brand-text-primary mb-4">Research Info</h3>
              <dl className="space-y-3 text-sm">
                {project.researchDate && (
                  <div>
                    <dt className="text-brand-text-muted">Research Date</dt>
                    <dd className="text-brand-text-primary font-medium">{project.researchDate}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-brand-text-muted">Confidence Score</dt>
                  <dd className="text-brand-text-primary font-medium">{(project.confidence * 100).toFixed(0)}%</dd>
                </div>
                <div>
                  <dt className="text-brand-text-muted">Reports Available</dt>
                  <dd className="text-brand-text-primary font-medium">{availableReports.length}</dd>
                </div>
              </dl>
            </div>

            {/* Team from JSON (if no TEAM.md) */}
            {project.team && project.team.length > 0 && !teamReport && (
              <div className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
                <h3 className="text-lg font-bold text-brand-text-primary mb-4">Team</h3>
                <ul className="space-y-3">
                  {project.team.map((member, idx) => (
                    <li key={idx} className="text-sm">
                      <div className="font-medium text-brand-text-primary">{member.name}</div>
                      {member.role && <div className="text-xs text-brand-text-muted">{member.role}</div>}
                      {member.status && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                          {member.status}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technology */}
            {project.technology && (project.technology.privacyTechniques?.length || project.technology.techStack?.length || project.technology.platforms?.length) && (
              <div className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
                <h3 className="text-lg font-bold text-brand-text-primary mb-4">Technology</h3>

                {project.technology.privacyTechniques && project.technology.privacyTechniques.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-brand-text-muted mb-2">Privacy Techniques</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technology.privacyTechniques.slice(0, 5).map((tech, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {tech.length > 40 ? tech.slice(0, 40) + '...' : tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.technology.techStack && project.technology.techStack.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-brand-text-muted mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technology.techStack.map((tech, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.technology.platforms && project.technology.platforms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-brand-text-muted mb-2">Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technology.platforms.map((platform, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Market Data */}
            {project.marketData && Object.keys(project.marketData).length > 0 && (
              <div className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
                <h3 className="text-lg font-bold text-brand-text-primary mb-4">Market Data</h3>
                <dl className="space-y-2 text-sm">
                  {project.marketData.current_price_usd && (
                    <div className="flex justify-between">
                      <dt className="text-brand-text-muted">Price</dt>
                      <dd className="text-brand-text-primary font-medium">${project.marketData.current_price_usd.toLocaleString()}</dd>
                    </div>
                  )}
                  {project.marketData.market_cap_usd && (
                    <div className="flex justify-between">
                      <dt className="text-brand-text-muted">Market Cap</dt>
                      <dd className="text-brand-text-primary font-medium">${(project.marketData.market_cap_usd / 1e9).toFixed(2)}B</dd>
                    </div>
                  )}
                  {project.marketData.market_cap_rank && (
                    <div className="flex justify-between">
                      <dt className="text-brand-text-muted">Rank</dt>
                      <dd className="text-brand-text-primary font-medium">#{project.marketData.market_cap_rank}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* GitHub Metrics */}
            {project.githubMetrics && (
              <div className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
                <h3 className="text-lg font-bold text-brand-text-primary mb-4">GitHub Activity</h3>
                <dl className="space-y-2 text-sm">
                  {project.githubMetrics.stars && (
                    <div className="flex justify-between">
                      <dt className="text-brand-text-muted">Stars</dt>
                      <dd className="text-brand-text-primary font-medium">{project.githubMetrics.stars.toLocaleString()}</dd>
                    </div>
                  )}
                  {project.githubMetrics.forks && (
                    <div className="flex justify-between">
                      <dt className="text-brand-text-muted">Forks</dt>
                      <dd className="text-brand-text-primary font-medium">{project.githubMetrics.forks.toLocaleString()}</dd>
                    </div>
                  )}
                  {project.githubMetrics.contributors && (
                    <div className="flex justify-between">
                      <dt className="text-brand-text-muted">Contributors</dt>
                      <dd className="text-brand-text-primary font-medium">{project.githubMetrics.contributors}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
