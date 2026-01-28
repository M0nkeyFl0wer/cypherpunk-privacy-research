'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCommandPaletteContext } from '@/components/CommandPalette/CommandPaletteProvider';

// Dynamically import the graph to avoid SSR issues with D3
const ObsidianGraph = dynamic(
  () => import('@/components/Visualizations/ObsidianGraph'),
  { ssr: false, loading: () => <div className="h-[600px] bg-[#111] rounded-xl animate-pulse" /> }
);

export default function PortalPage() {
  const [showGraph, setShowGraph] = useState(true);
  const { open: openSearch } = useCommandPaletteContext();

  const handleSearchFocus = () => {
    // Open the command palette when user focuses search bar
    openSearch();
  };

  return (
    <main className="min-h-screen bg-[#000]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <Link
          href="/"
          className="text-sm font-medium text-[#94e2d5] hover:text-white flex items-center gap-1 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Research Portal
          </h1>
          <p className="text-xl text-[#6c7086] max-w-2xl mx-auto">
            Explore relationships between projects, languages, and topics in an interactive network graph.
          </p>
        </div>

        {/* Search Bar - Opens Command Palette */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              readOnly
              onFocus={handleSearchFocus}
              onClick={handleSearchFocus}
              placeholder="Search projects, techniques, pages... (⌘K)"
              className="w-full px-6 py-4 pr-14 bg-[#111] border border-[#252525] rounded-xl text-[#e0e0e0] placeholder-[#6c7086] focus:outline-none focus:border-[#94e2d5] focus:ring-1 focus:ring-[#94e2d5] text-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={handleSearchFocus}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1a1a1a] hover:bg-[#252525] border border-[#252525] hover:border-[#94e2d5] rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-[#94e2d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <div className="text-center mt-3 text-xs text-[#6c7086]">
            Press <kbd className="px-1.5 py-0.5 bg-[#1a1a1a] rounded border border-[#252525] mx-1">⌘K</kbd> or click to search
          </div>
        </div>

        {/* Graph Toggle */}
        <div className="flex items-center justify-center mb-8">
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="text-sm text-[#94e2d5] hover:text-white transition-colors"
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
            href="/methodology"
            className="bg-[#111] rounded-xl p-6 border border-[#252525] hover:border-[#89b4fa] transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#89b4fa]/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#89b4fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#e0e0e0] group-hover:text-[#89b4fa] transition-colors mb-2">
              Methodology
            </h3>
            <p className="text-[#6c7086] text-sm">
              Research approach, data sources, and constitutional verification process.
            </p>
          </Link>

          <Link
            href="/search"
            className="bg-[#111] rounded-xl p-6 border border-[#252525] hover:border-[#94e2d5] transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#94e2d5]/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#94e2d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#e0e0e0] group-hover:text-[#94e2d5] transition-colors mb-2">
              Classic Search
            </h3>
            <p className="text-[#6c7086] text-sm">
              Filter and search projects by name, technology, ecosystem, and more.
            </p>
          </Link>

          <Link
            href="/projects"
            className="bg-[#111] rounded-xl p-6 border border-[#252525] hover:border-[#a6e3a1] transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#a6e3a1]/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#a6e3a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#e0e0e0] group-hover:text-[#a6e3a1] transition-colors mb-2">
              Browse Projects
            </h3>
            <p className="text-[#6c7086] text-sm">
              Browse all 40 verified projects with OSINT deep dives and standard research.
            </p>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="bg-[#111] rounded-xl p-6 border border-[#252525]">
          <h3 className="text-lg font-semibold text-[#e0e0e0] mb-4 text-center">Data Available</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#94e2d5]">40</div>
              <div className="text-xs text-[#6c7086]">Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#89b4fa]">48</div>
              <div className="text-xs text-[#6c7086]">Languages</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#a6e3a1]">111</div>
              <div className="text-xs text-[#6c7086]">Topics</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#f9e2af]">390</div>
              <div className="text-xs text-[#6c7086]">Relationships</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
