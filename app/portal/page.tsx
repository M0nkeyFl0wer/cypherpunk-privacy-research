'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the graph to avoid SSR issues with D3
const ObsidianGraph = dynamic(
  () => import('@/components/Visualizations/ObsidianGraph'),
  { ssr: false, loading: () => <div className="h-[600px] bg-gray-900/50 rounded-xl animate-pulse" /> }
);

export default function PortalPage() {
  const [query, setQuery] = useState('');
  const [showGraph, setShowGraph] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement AI search with Ollama
    console.log('Search query:', query);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <Link
          href="/"
          className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            Research Portal
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore relationships between projects, languages, and topics in an interactive network graph.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about privacy projects... (e.g., &quot;Which projects use zk-SNARKs?&quot;)"
              className="w-full px-6 py-4 pr-14 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <button
              type="button"
              onClick={() => setQuery('Which projects use zk-SNARKs?')}
              className="text-sm px-3 py-1 bg-gray-800/50 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-gray-300 transition-colors"
            >
              zk-SNARKs projects
            </button>
            <button
              type="button"
              onClick={() => setQuery('Compare OSINT projects by subdomain count')}
              className="text-sm px-3 py-1 bg-gray-800/50 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-gray-300 transition-colors"
            >
              Compare OSINT projects
            </button>
            <button
              type="button"
              onClick={() => setQuery('Show projects written in Rust')}
              className="text-sm px-3 py-1 bg-gray-800/50 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-gray-300 transition-colors"
            >
              Rust projects
            </button>
          </div>
        </form>

        {/* AI Coming Soon + Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-sm text-gray-500">AI search coming soon</span>
          <span className="text-gray-600">•</span>
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            {showGraph ? 'Hide Graph' : 'Show Graph'}
          </button>
        </div>

        {/* Network Graph */}
        {showGraph && (
          <div className="mb-12">
            <ObsidianGraph width={1200} height={600} />
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/visualizations"
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 hover:border-blue-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
              Network Graph
            </h3>
            <p className="text-gray-400 text-sm">
              Explore relationships between projects, languages, and topics in an interactive D3 graph.
            </p>
          </Link>

          <Link
            href="/search"
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-purple-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors mb-2">
              Classic Search
            </h3>
            <p className="text-gray-400 text-sm">
              Filter and search projects by name, technology, ecosystem, and more.
            </p>
          </Link>

          <Link
            href="/projects"
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/30 hover:border-green-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors mb-2">
              Browse Projects
            </h3>
            <p className="text-gray-400 text-sm">
              Browse all 40 verified projects with OSINT deep dives and standard research.
            </p>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Data Available</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">40</div>
              <div className="text-xs text-gray-400">Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">48</div>
              <div className="text-xs text-gray-400">Languages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">111</div>
              <div className="text-xs text-gray-400">Topics</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-400">390</div>
              <div className="text-xs text-gray-400">Relationships</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
