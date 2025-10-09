import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import type { ProjectData } from '@/lib/data/schema';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

// Get all project IDs for static generation
export async function generateStaticParams() {
  const rootDir = path.join(process.cwd());
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  const projectIds = entries
    .filter(entry => entry.isDirectory())
    .filter(entry => !['node_modules', '.git', '.next', 'out', 'app', 'components', 'lib', 'public', 'scripts', 'styles', 'tests', '.github'].includes(entry.name))
    .filter(entry => {
      const metadataPath = path.join(rootDir, entry.name, 'project_metadata.json');
      return fs.existsSync(metadataPath);
    })
    .map(entry => ({ id: entry.name }));

  return projectIds;
}

// Load project data
async function getProjectData(id: string): Promise<{
  metadata: ProjectData;
  readme: string | null;
  card: string | null;
}> {
  const projectDir = path.join(process.cwd(), id);

  // Check if project exists
  if (!fs.existsSync(projectDir)) {
    return { metadata: null as any, readme: null, card: null };
  }

  // Load metadata
  const metadataPath = path.join(projectDir, 'project_metadata.json');
  if (!fs.existsSync(metadataPath)) {
    return { metadata: null as any, readme: null, card: null };
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8')) as ProjectData;

  // Load README
  let readme: string | null = null;
  const readmePath = path.join(projectDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    readme = fs.readFileSync(readmePath, 'utf8');
  }

  // Load card
  let card: string | null = null;
  const cardPath = path.join(projectDir, 'CARD.md');
  if (fs.existsSync(cardPath)) {
    card = fs.readFileSync(cardPath, 'utf8');
  }

  return { metadata, readme, card };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = params;
  const { metadata, readme, card } = await getProjectData(id);

  if (!metadata) {
    notFound();
  }

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

  const badge = getConfidenceBadge(metadata.confidence);

  return (
    <div className="min-h-screen bg-brand-bg-dark">
      {/* Header - Web3Privacy Now Branded */}
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
                {metadata.name}
              </h1>

              {metadata.description && (
                <p className="text-lg text-brand-text-secondary mb-4">
                  {metadata.description}
                </p>
              )}

              {/* Metadata badges */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Confidence badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${badge.bg} ${badge.text} ring-1 ring-inset ${badge.ring}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {(metadata.confidence * 100).toFixed(0)}% {badge.label}
                </span>

                {/* Category badge */}
                {metadata.category && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {metadata.category}
                  </span>
                )}

                {/* Status badge */}
                {metadata.status && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {metadata.status}
                  </span>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-col gap-2">
              {(typeof metadata.website === 'string' ? metadata.website : (metadata.website as any)?.primary_url) && (
                <a
                  href={typeof metadata.website === 'string' ? metadata.website : (metadata.website as any)?.primary_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-accent-purple rounded-lg hover:bg-brand-accent-pink transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Visit Website
                </a>
              )}

              {metadata.github && (
                <a
                  href={metadata.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-text-primary bg-brand-bg-darker border border-brand-bg-active rounded-lg hover:border-brand-accent-blue transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  View on GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-8">
            {/* README content */}
            {readme && (
              <section className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
                <h2 className="text-2xl font-bold text-brand-text-primary mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-brand-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Full Research Report
                </h2>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-brand-text-secondary leading-relaxed">
                    {readme}
                  </pre>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Quick summary card */}
            {card && (
              <div className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
                <h2 className="text-lg font-bold text-brand-text-primary mb-3">Quick Summary</h2>
                <div className="prose prose-sm prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-brand-text-secondary">
                    {card}
                  </pre>
                </div>
              </div>
            )}

            {/* Technical details */}
            <div className="bg-brand-bg-darker rounded-lg shadow-sm border border-brand-bg-active p-6">
              <h2 className="text-lg font-bold text-brand-text-primary mb-4">Technical Details</h2>

              {/* Tech stack */}
              {metadata.tech_stack && metadata.tech_stack.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {metadata.tech_stack.map((tech: any, idx: number) => {
                      // Handle both strings and complex objects
                      const techName = typeof tech === 'string' ? tech : (tech.name || tech.technology || 'Unknown');
                      const techKey = typeof tech === 'string' ? tech : `tech-${idx}`;
                      return (
                        <span
                          key={techKey}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {techName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Privacy techniques */}
              {metadata.privacy_techniques && metadata.privacy_techniques.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Privacy Techniques</h3>
                  <div className="flex flex-wrap gap-2">
                    {metadata.privacy_techniques.map((technique: any, idx: number) => {
                      // Handle both strings and complex objects
                      const techniqueName = typeof technique === 'string' ? technique : (technique.technique || technique.name || 'Unknown');
                      const techniqueKey = typeof technique === 'string' ? technique : `technique-${idx}`;
                      return (
                        <span
                          key={techniqueKey}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {techniqueName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Blockchain platforms */}
              {metadata.blockchain_platforms && metadata.blockchain_platforms.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Blockchain Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {metadata.blockchain_platforms.map(platform => (
                      <span
                        key={platform}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Team members */}
              {metadata.team && metadata.team.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Team</h3>
                  <ul className="space-y-2">
                    {metadata.team.map((member, idx) => (
                      <li key={idx} className="text-sm">
                        <div className="font-medium text-gray-900">{member.name || 'Unknown'}</div>
                        {member.role && <div className="text-xs text-gray-600">{member.role}</div>}
                        {(member.github || member.twitter) && (
                          <div className="flex gap-2 mt-1">
                            {member.github && (
                              <a
                                href={member.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-600 hover:text-indigo-700"
                              >
                                GitHub
                              </a>
                            )}
                            {member.twitter && (
                              <a
                                href={member.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-600 hover:text-indigo-700"
                              >
                                Twitter
                              </a>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Data sources */}
            {metadata.sources && metadata.sources.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Data Sources
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  All data verified per constitutional requirements
                </p>
                <ul className="space-y-3">
                  {metadata.sources.map((source, idx) => {
                    const sourceUrl = typeof source.url === 'string' ? source.url : (source.url as any)?.primary_url || 'N/A';
                    return (
                      <li key={idx} className="text-sm">
                        <div className="flex items-start gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {source.type}
                          </span>
                          {sourceUrl !== 'N/A' ? (
                            <a
                              href={sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-700 break-all"
                            >
                              {sourceUrl}
                            </a>
                          ) : (
                            <span className="text-gray-500">No URL available</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Missing fields warning */}
            {metadata.missing_fields && metadata.missing_fields.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Incomplete Data
                </h3>
                <p className="text-xs text-yellow-800 mb-2">
                  The following fields are missing:
                </p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  {metadata.missing_fields.map(field => (
                    <li key={field}>• {field}</li>
                  ))}
                </ul>
                <Link
                  href="/feedback"
                  className="mt-3 inline-block text-xs font-medium text-yellow-900 hover:text-yellow-800 underline"
                >
                  Help us complete this data →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
