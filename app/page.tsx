'use client';

import { useState } from 'react';
import { HomepageGraph } from '@/components/HomepageGraph';
import { InlineSearch } from '@/components/InlineSearch';

export default function Home() {
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#000]">
      {/* Header */}
      <div className="border-b border-[#252525]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-[#e0e0e0] mb-2">
            Cypherpunk toolkit research experiment
            <span className="text-[#6c7086] text-sm font-normal ml-3">wip</span>
          </h1>
          <p className="text-[#a6adc8]">
            An independent open research project for cypherpunk tools. A contribution to the web3privacy community.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="max-w-md">
          <InlineSearch />
        </div>
      </div>

      {/* Graph */}
      <div className="max-w-5xl mx-auto px-6 py-4">
        <HomepageGraph />
      </div>

      {/* Executive Summary */}
      <div className="max-w-5xl mx-auto px-6 py-8 border-t border-[#252525]">
        <h2 className="text-lg font-medium text-[#e0e0e0] tracking-wider mb-4">EXECUTIVE SUMMARY</h2>
        <div className="text-[#a6adc8] space-y-4">
          <p>
            Independent research covering 50 Web3 privacy projects with verified data. 8 projects
            received comprehensive OSINT deep dives. All findings trace to primary sources — zero
            fabrication, zero synthetic data.
          </p>
        </div>
      </div>

      {/* About This Research */}
      <div className="max-w-5xl mx-auto px-6 py-8 border-t border-[#252525]">
        <h2 className="text-lg font-medium text-[#e0e0e0] tracking-wider mb-4">ABOUT THIS RESEARCH</h2>
        <div className="text-[#a6adc8] space-y-4">
          <p>
            Web3Privacy community research analyzing privacy-focused blockchain projects. Conducted
            using constitutional methodology that prohibits fabrication and requires primary source
            verification for all claims.
          </p>
          <button
            onClick={() => setMethodologyOpen(!methodologyOpen)}
            className="inline-flex items-center gap-1 text-[#94e2d5] hover:underline text-sm"
          >
            {methodologyOpen ? 'hide' : 'view'} research methodology
            <span aria-hidden="true" className={`transition-transform ${methodologyOpen ? 'rotate-90' : ''}`}>→</span>
          </button>
        </div>

        {/* Expandable Methodology Section */}
        {methodologyOpen && (
          <div className="mt-8 space-y-8 border-l-2 border-[#252525] pl-6">
            {/* Origin Story - from Postmortem */}
            <div>
              <h3 className="text-base font-medium text-[#e0e0e0] mb-3">Why This Site Exists</h3>
              <p className="text-[#a6adc8] mb-3">
                In January 2025, we submitted PR #1997 to the web3privacy/explorer-data repository with research
                data for 129 privacy projects. The PR accidentally overwrote existing high-quality project data
                with template/placeholder data. Projects like Zcash and Tornado Cash lost their carefully curated
                descriptions and were replaced with generic content.
              </p>
              <p className="text-[#a6adc8] mb-3">
                A developer from the Zcash community caught this before merge. This was a valuable catch that
                prevented bad data from being merged - but it revealed a deeper problem: no framework existed
                to prevent this from happening again.
              </p>
              <p className="text-[#a6adc8]">
                This site serves as both documentation and demonstration of the research methodology that
                emerged from that failure. PR #2060 restored the damaged data with verified research.
              </p>
            </div>

            {/* Constitutional Framework */}
            <div>
              <h3 className="text-base font-medium text-[#e0e0e0] mb-3">Constitutional Framework</h3>
              <p className="text-[#a6adc8] mb-4">
                Like a constitution for a nation, these principles are <strong className="text-[#94e2d5]">inviolable</strong>.
                They cannot be broken regardless of convenience, time pressure, or the desire to appear more complete.
              </p>

              <div className="space-y-3">
                <div className="bg-[#111] rounded-lg p-4 border border-[#f38ba8]/30">
                  <span className="text-[#f38ba8] font-medium">1. Truth Over Convenience</span>
                  <p className="text-sm text-[#6c7086] mt-1">NEVER fabricate, infer, or assume. &quot;No data available&quot; is always preferable to invented data.</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#fab387]/30">
                  <span className="text-[#fab387] font-medium">2. Source Everything</span>
                  <p className="text-sm text-[#6c7086] mt-1">Every claim must have a traceable source. No source = No claim.</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#f9e2af]/30">
                  <span className="text-[#f9e2af] font-medium">3. Confidence Scoring</span>
                  <p className="text-sm text-[#6c7086] mt-1">All data points receive a 0.0-1.0 confidence score based on source quality.</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#a6e3a1]/30">
                  <span className="text-[#a6e3a1] font-medium">4. Temporal Awareness</span>
                  <p className="text-sm text-[#6c7086] mt-1">All research is timestamped. Data older than 90 days flagged for review.</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#94e2d5]/30">
                  <span className="text-[#94e2d5] font-medium">5. Primary Source Priority</span>
                  <p className="text-sm text-[#6c7086] mt-1">Official sources over aggregators. GitHub over news articles.</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#89b4fa]/30">
                  <span className="text-[#89b4fa] font-medium">6. Scope Boundaries</span>
                  <p className="text-sm text-[#6c7086] mt-1">Research what exists, not what might exist. No speculation.</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#cba6f7]/30">
                  <span className="text-[#cba6f7] font-medium">7. Honest Gap Reporting</span>
                  <p className="text-sm text-[#6c7086] mt-1">Document what you COULD NOT find. Missing data is valuable information.</p>
                </div>
              </div>
            </div>

            {/* Full Postmortem Link */}
            <div className="pt-4 border-t border-[#252525]">
              <a href="/postmortem" className="inline-flex items-center gap-1 text-[#94e2d5] hover:underline text-sm">
                read full postmortem <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-[#252525]">
        <div className="flex items-center justify-between text-xs text-[#6c7086]">
          <a href="https://explorer.web3privacy.info" target="_blank" rel="noopener noreferrer" className="hover:text-[#94e2d5]">
            web3privacy explorer
          </a>
          <a href="https://github.com/benwestdev/web3-privacy-ethereum-cypherpunk-research"
             target="_blank" rel="noopener noreferrer" className="hover:text-[#94e2d5]">source</a>
        </div>
      </footer>
    </main>
  );
}
