'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/Visualizations/StatCard';
import BarChart from '@/components/Visualizations/BarChart';
import PieChart from '@/components/Visualizations/PieChart';
import NetworkGraph from '@/components/Visualizations/NetworkGraph';
import Timeline from '@/components/Visualizations/Timeline';
import Treemap from '@/components/Visualizations/Treemap';
import { getAllProjectSummaries, getProjectStats, getTopN, type ProjectStats, type ProjectSummary } from '@/lib/data/client-data';

export default function VisualizationsPage() {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);

  useEffect(() => {
    async function loadData() {
      const [statsData, projectsData] = await Promise.all([
        getProjectStats(),
        getAllProjectSummaries()
      ]);
      setStats(statsData);
      setProjects(projectsData);
    }
    loadData();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#000] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#94e2d5] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#a6adc8]">Loading visualizations...</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const privacyTechniquesData = getTopN(stats.privacyTechniques, 12).map(item => ({
    name: item.name,
    value: item.count,
  }));

  const techStackData = getTopN(stats.techStacks, 12).map(item => ({
    name: item.name,
    value: item.count,
  }));

  const statusData = Object.entries(stats.statusDistribution).map(([name, count]) => ({
    name,
    value: count,
  }));

  const categoryData = getTopN(stats.categories, 8).map(item => ({
    name: item.name,
    value: item.count,
  }));

  const foundedYearsData = Object.entries(stats.foundedYears)
    .map(([year, count]) => ({ name: year, value: count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const locationsData = getTopN(stats.locations, 10).map(item => ({
    name: item.name,
    value: item.count,
  }));

  // Confidence distribution buckets
  const confidenceBuckets = {
    'High (≥80%)': 0,
    'Medium (50-79%)': 0,
    'Low (20-49%)': 0,
    'Very Low (<20%)': 0,
  };

  projects.forEach(p => {
    const conf = p.confidence * 100;
    if (conf >= 80) confidenceBuckets['High (≥80%)']++;
    else if (conf >= 50) confidenceBuckets['Medium (50-79%)']++;
    else if (conf >= 20) confidenceBuckets['Low (20-49%)']++;
    else confidenceBuckets['Very Low (<20%)']++;
  });

  const confidenceData = Object.entries(confidenceBuckets).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="min-h-screen bg-[#000]">
      {/* Header */}
      <header className="bg-[#111] border-b border-[#252525] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#e0e0e0] flex items-center gap-3">
                <img src="/images/w3p-logo.svg" alt="Web3Privacy Now" className="h-10 w-auto opacity-60" />
                Data Visualizations
              </h1>
              <p className="mt-1 text-sm text-[#a6adc8]">
                Interactive analysis of {stats.totalProjects} Web3 privacy projects
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-[#a6adc8] hover:text-[#89b4fa] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium text-[#a6adc8] hover:text-[#94e2d5] transition-colors"
              >
                Search
              </Link>
              <Link
                href="/chat"
                className="text-sm font-medium text-[#a6adc8] hover:text-[#a6e3a1] transition-colors"
              >
                AI Assistant
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#94e2d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Overview Statistics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              description="Web3 privacy projects analyzed"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />

            <StatCard
              title="Average Confidence"
              value={`${(stats.averageConfidence * 100).toFixed(1)}%`}
              description="Data quality score across all projects"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <StatCard
              title="Constitutional Compliance"
              value={`${stats.constitutionalCompliance.toFixed(1)}%`}
              description="Projects meeting quality standards (≥70% confidence)"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />

            <StatCard
              title="Privacy Categories"
              value={Object.keys(stats.categories).length}
              description="Unique privacy solution categories"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Privacy Techniques & Tech Stack */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#89b4fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Technology Analysis
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              data={privacyTechniquesData}
              title="Privacy Techniques"
              description="Most common privacy technologies used"
              color="cyan"
              maxBars={12}
            />

            <BarChart
              data={techStackData}
              title="Technology Stack"
              description="Popular frameworks and languages"
              color="blue"
              maxBars={12}
            />
          </div>
        </section>

        {/* Project Status & Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#a6e3a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Project Distribution
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChart
              data={statusData}
              title="Project Status"
              description="Current development status of projects"
            />

            <PieChart
              data={categoryData}
              title="Project Categories"
              description="Distribution by privacy solution type"
            />
          </div>
        </section>

        {/* Confidence & Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#f9e2af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Quality & Timeline Metrics
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              data={confidenceData}
              title="Data Confidence Distribution"
              description="Research quality by confidence score"
              color="green"
            />

            <BarChart
              data={foundedYearsData}
              title="Projects by Year Founded"
              description="When privacy projects were established"
              color="red"
            />
          </div>
        </section>

        {/* Geographic Distribution */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#f38ba8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Geographic Distribution
          </h2>

          <BarChart
            data={locationsData}
            title="Projects by Location"
            description="Where privacy teams are based"
            color="yellow"
            maxBars={10}
          />
        </section>

        {/* Network Graph - Relationships */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#94e2d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Project Network
          </h2>

          <div className="bg-[#111] rounded-lg p-6 border border-[#252525]">
            <NetworkGraph projects={projects} width={800} height={600} />
          </div>
        </section>

        {/* Timeline Visualization */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#89b4fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historical Timeline
          </h2>

          <div className="bg-[#111] rounded-lg p-6 border border-[#252525]">
            <Timeline projects={projects} width={800} height={400} />
          </div>
        </section>

        {/* Treemap - Hierarchical View */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#a6e3a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 12a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
            </svg>
            Category Hierarchy
          </h2>

          <div className="bg-[#111] rounded-lg p-6 border border-[#252525]">
            <Treemap projects={projects} width={800} height={600} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#111] border-t border-[#252525] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#6c7086]">
              © 2025 Web3Privacy Now Research. All visualizations based on constitutionally verified data.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#a6adc8] hover:text-[#89b4fa] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub Repository
              </Link>

              <Link
                href="/feedback"
                className="text-sm text-[#a6adc8] hover:text-[#a6e3a1] transition-colors"
              >
                Submit Feedback
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
