'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TierBadge } from '@/components/TierBadge';

interface Language {
  name: string;
  percentage: number;
}

interface Project {
  id: string;
  name: string;
  tier: 'osint' | 'standard';
  dataQuality: 'complete' | 'insufficient';
  stars: number;
  forks: number;
  description: string;
  website: string;
  github: string;
  primaryLanguage: string | null;
  languages: Language[];
  topics: string[];
  license: string | null;
  osintLines: number;
}

interface GraphData {
  projects: Project[];
  metadata: {
    osintProjects: string[];
    standardProjects: string[];
    insufficientDataProjects: string[];
    totalProjects: number;
    completeProjects: number;
  };
}

export default function ProjectsPage() {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/research-graph.json')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load projects:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#94e2d5] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#a6adc8]">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#000] flex items-center justify-center">
        <div className="text-[#f38ba8] text-xl">Failed to load project data</div>
      </div>
    );
  }

  const osintProjects = data.projects.filter(p => p.tier === 'osint' && p.dataQuality === 'complete').sort((a, b) => b.osintLines - a.osintLines);
  const standardProjects = data.projects.filter(p => p.tier === 'standard' && p.dataQuality === 'complete').sort((a, b) => b.stars - a.stars);
  const insufficientProjects = data.projects.filter(p => p.dataQuality === 'insufficient').sort((a, b) => b.stars - a.stars);

  return (
    <main className="min-h-screen bg-[#000]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <Link
          href="/"
          className="text-sm font-medium text-[#94e2d5] hover:text-white flex items-center gap-1 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-5xl font-bold text-[#e0e0e0] mb-4">
          Project Research
        </h1>
        <p className="text-xl text-[#6c7086] max-w-3xl">
          Comprehensive research on {data.metadata.completeProjects} Web3 privacy projects.
          {' '}{osintProjects.length} include deep OSINT analysis, {standardProjects.length} have standard research.
        </p>
      </div>

      {/* OSINT Deep Dives Section */}
      <section className="max-w-7xl mx-auto px-8 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold text-[#e0e0e0]">OSINT Deep Dives</h2>
          <TierBadge tier="osint" size="lg" />
        </div>
        <p className="text-[#6c7086] mb-8">
          Projects with comprehensive infrastructure analysis, subdomain mapping, and security research.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {osintProjects.map(project => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-[#111] rounded-xl p-6 border border-[#252525] hover:border-[#94e2d5] transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-[#e0e0e0] group-hover:text-[#94e2d5] transition-colors">
                  {project.name}
                </h3>
                <span className="text-xs text-[#94e2d5] bg-[#94e2d5]/10 px-2 py-1 rounded">
                  {project.osintLines.toLocaleString()} lines
                </span>
              </div>

              <p className="text-[#a6adc8] text-sm mb-4 line-clamp-2">
                {project.description || 'Privacy-focused Web3 project'}
              </p>

              <div className="flex items-center gap-4 text-sm text-[#6c7086] mb-3">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {project.stars.toLocaleString()}
                </span>
                {project.primaryLanguage && (
                  <span className="text-[#6c7086]">{project.primaryLanguage}</span>
                )}
              </div>

              {project.topics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.topics.slice(0, 2).map(topic => (
                    <span key={topic} className="text-xs bg-[#94e2d5]/10 text-[#94e2d5] px-2 py-0.5 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Standard Research Section */}
      <section className="max-w-7xl mx-auto px-8 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold text-[#e0e0e0]">Standard Research</h2>
          <TierBadge tier="standard" size="lg" />
        </div>
        <p className="text-[#6c7086] mb-8">
          Projects with GitHub code analysis, team verification, and security assessments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardProjects.map(project => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-[#111] rounded-xl p-6 border border-[#252525] hover:border-[#89b4fa] transition-all group"
            >
              <h3 className="text-lg font-bold text-[#e0e0e0] group-hover:text-[#89b4fa] transition-colors mb-2">
                {project.name}
              </h3>

              <p className="text-[#a6adc8] text-sm mb-4 line-clamp-2">
                {project.description || 'Privacy-focused Web3 project'}
              </p>

              <div className="flex items-center gap-4 text-sm text-[#6c7086] mb-3">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {project.stars.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {project.forks}
                </span>
                {project.primaryLanguage && (
                  <span>{project.primaryLanguage}</span>
                )}
              </div>

              {project.languages.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.languages.slice(0, 3).map(lang => (
                    <span key={lang.name} className="text-xs bg-[#1a1a1a] text-[#6c7086] px-2 py-0.5 rounded">
                      {lang.name}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Insufficient Data Section */}
      {insufficientProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-8 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-[#6c7086]">Insufficient Data</h2>
            <span className="text-xs bg-[#f9e2af]/20 text-[#f9e2af] px-2 py-1 rounded">
              {insufficientProjects.length} projects
            </span>
          </div>
          <p className="text-[#6c7086] text-sm mb-6">
            These projects have incomplete research data. We include them for transparency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {insufficientProjects.map(project => (
              <div
                key={project.id}
                className="bg-[#111]/30 rounded-lg p-4 border border-[#252525]/30 opacity-60"
              >
                <h3 className="text-sm font-medium text-[#6c7086] mb-1">{project.name}</h3>
                <div className="text-xs text-[#6c7086]">
                  {project.stars > 0 ? `${project.stars} stars` : 'No data'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-8 pb-16">
        <div className="bg-[#111] rounded-xl p-8 border border-[#252525] text-center">
          <h3 className="text-2xl font-bold text-[#e0e0e0] mb-4">Explore the Data</h3>
          <p className="text-[#6c7086] mb-6">
            View interactive visualizations and relationships between projects
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/portal"
              className="bg-[#94e2d5] hover:bg-[#74c7ba] text-[#000] px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Open Portal
            </Link>
            <Link
              href="/methodology"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
            >
              View Methodology
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
