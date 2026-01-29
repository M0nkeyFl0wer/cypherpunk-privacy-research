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
        <div className="text-[#a6adc8]">
          <ul className="space-y-2 list-none">
            <li className="flex items-start gap-2">
              <span className="text-[#94e2d5] mt-1">•</span>
              <span>Research conducted using autonomous agent swarms — not to generate data, but to coordinate tool use</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#94e2d5] mt-1">•</span>
              <span>Data sourced from Python scripts, GitHub API, web scraping, blockchain explorers, and OSINT tools</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#94e2d5] mt-1">•</span>
              <span>Constitutional framework ensures &quot;Unknown&quot; beats invented data — every fact traces to a live tool call</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#94e2d5] mt-1">•</span>
              <span>Three-phase process: Broad Search → Deep Dives → Report Generation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#94e2d5] mt-1">•</span>
              <span>All results are work-in-progress — feedback and corrections welcome</span>
            </li>
          </ul>
        </div>
      </div>

      {/* About This Research */}
      <div className="max-w-5xl mx-auto px-6 py-8 border-t border-[#252525]">
        <h2 className="text-lg font-medium text-[#e0e0e0] tracking-wider mb-4">HOW THIS RESEARCH WAS DONE</h2>
        <div className="text-[#a6adc8] space-y-4">
          <p>
            This project researched privacy technology projects using autonomous &quot;agent&quot; swarms — not to
            generate data directly, but to coordinate tool use. The details about each project come from
            Python scripts, GitHub API calls, web scraping, and blockchain explorers as well as OSINT tools
            used via CLI. The agents use predefined tools and validate results against a constitutional framework.
          </p>
          <button
            onClick={() => setMethodologyOpen(!methodologyOpen)}
            className="inline-flex items-center gap-1 text-[#94e2d5] hover:underline text-sm"
          >
            {methodologyOpen ? 'hide' : 'view'} full methodology
            <span aria-hidden="true" className={`transition-transform ${methodologyOpen ? 'rotate-90' : ''}`}>→</span>
          </button>
        </div>

        {/* Expandable Methodology Section */}
        {methodologyOpen && (
          <div className="mt-8 space-y-8 border-l-2 border-[#252525] pl-6">
            {/* The Evolution */}
            <div>
              <h3 className="text-base font-medium text-[#e0e0e0] mb-3">The Evolution</h3>
              <p className="text-[#a6adc8] mb-3">
                We started with proof of concept approaches — single agents doing research tasks with heavy
                validation checkpoints. This created bureaucratic overhead: spending significant tokens
                double-checking every data point, creating bottlenecks that slowed things down.
              </p>
              <p className="text-[#a6adc8]">
                The breakthrough came from experimenting with concepts from anarcho-syndicalism and biomimicry.
                Instead of hierarchical control with constant verification, we tried stigmergic coordination —
                agents leaving &quot;traces&quot; (like ant pheromones) that guide subsequent agents without direct
                communication. This reduced coordination overhead dramatically while maintaining quality through
                the constitutional framework.
              </p>
            </div>

            {/* What We Tried */}
            <div>
              <h3 className="text-base font-medium text-[#e0e0e0] mb-3">What We Tried</h3>
              <div className="space-y-3 text-[#a6adc8]">
                <p>
                  <strong className="text-[#94e2d5]">Different swarm sizes:</strong> Small groups (4-6 agents)
                  worked well for focused tasks. Larger swarms needed heterogeneous designs with specialized
                  roles — some agents doing broad discovery, others doing deep dives, others validating.
                </p>
                <p>
                  <strong className="text-[#94e2d5]">Multiple models:</strong> Claude for coordination and
                  complex reasoning, Gemini for some web research tasks, local models running on a remote
                  server for high-volume operations that didn&apos;t need frontier capabilities.
                </p>
                <p>
                  <strong className="text-[#94e2d5]">The strict rule:</strong> AI training data is never used
                  as research source material. If Claude &quot;knows&quot; something about Tornado Cash from training,
                  that doesn&apos;t count. Every fact must come from a live tool call — a web search, an API response,
                  a document fetch. The agents facilitate and validate; they don&apos;t fabricate.
                </p>
                <p className="text-[#6c7086] text-sm">
                  Even with these controls there were moments where issues were introduced by models. All it
                  takes is one bad prompt or a confused new agent to take on a task and use the wrong source
                  material or introduce hallucinations. So the fact-checking scans run to validate information
                  back to source material was a key part of this work. All results should be considered a WIP
                  and feedback/updates related to project information that may be out of date or inaccurate
                  would be much appreciated.
                </p>
              </div>
            </div>

            {/* Constitutional Framework */}
            <div>
              <h3 className="text-base font-medium text-[#e0e0e0] mb-3">The Constitutional Framework</h3>
              <p className="text-[#a6adc8] mb-4">
                A living document that evolved as we learned what went wrong:
              </p>
              <div className="space-y-3">
                <div className="bg-[#111] rounded-lg p-4 border border-[#f38ba8]/30">
                  <span className="text-[#f38ba8] font-medium">1. Truth Over Convenience</span>
                  <p className="text-sm text-[#6c7086] mt-1">&quot;Unknown&quot; beats invented data</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#fab387]/30">
                  <span className="text-[#fab387] font-medium">2. Source Everything</span>
                  <p className="text-sm text-[#6c7086] mt-1">No source = no claim</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#f9e2af]/30">
                  <span className="text-[#f9e2af] font-medium">3. Confidence Scoring</span>
                  <p className="text-sm text-[#6c7086] mt-1">Rate data quality 0.0-1.0</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#a6e3a1]/30">
                  <span className="text-[#a6e3a1] font-medium">4. Temporal Awareness</span>
                  <p className="text-sm text-[#6c7086] mt-1">Time stamp everything</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#94e2d5]/30">
                  <span className="text-[#94e2d5] font-medium">5. Primary Source Priority</span>
                  <p className="text-sm text-[#6c7086] mt-1">Official sources first</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#89b4fa]/30">
                  <span className="text-[#89b4fa] font-medium">6. Scope Boundaries</span>
                  <p className="text-sm text-[#6c7086] mt-1">Research what exists, not speculation</p>
                </div>
                <div className="bg-[#111] rounded-lg p-4 border border-[#cba6f7]/30">
                  <span className="text-[#cba6f7] font-medium">7. Honest Gap Reporting</span>
                  <p className="text-sm text-[#6c7086] mt-1">Document what we couldn&apos;t find</p>
                </div>
              </div>
            </div>

            {/* Three-Phase Process */}
            <div>
              <h3 className="text-base font-medium text-[#e0e0e0] mb-3">The Three-Phase Process</h3>
              <div className="bg-[#111] rounded-lg p-4 font-mono text-sm text-[#a6adc8] overflow-x-auto">
                <pre>{`PHASE 1: BROAD SEARCH
├── Website search and fetch (real-time)
├── GitHub API calls (live data)
├── Social media checks
└── News aggregators
         │
         ▼
    verified_data (with confidence scores)
         │
         ▼
PHASE 2: DEEP DIVES
├── Code review (commit history, languages, contributors)
├── OSINT tools (infrastructure, team research)
├── On-chain analysis (contract verification)
└── Security audit verification
         │
         ▼
    analysis/ (structured JSON)
         │
         ▼
PHASE 3: REPORT GENERATION
├── CODE_REVIEW.md
├── TEAM.md
├── SECURITY.md
└── TECHNICAL.md`}</pre>
              </div>
            </div>

            {/* Lessons Learned */}
            <div>
              <h3 className="text-base font-medium text-[#e0e0e0] mb-3">Lessons Learned (PR #1997)</h3>
              <p className="text-[#a6adc8] mb-3">
                In January 2025, we submitted research to web3privacy/explorer-data. The PR accidentally
                overwrote existing high-quality data with template placeholders. A Zcash community developer
                caught it and helped us troubleshoot and roll it back.
              </p>
              <p className="text-[#a6adc8]">
                This mistake lead to a renewed effort to find the best way to share this work. It was easier
                to create a standalone site as opposed to trying to fit it all in the existing explorer setup.
                We will submit another PR to explorer that adds links to this additional research after sharing
                this site to those in the community for feedback. Thanks.
              </p>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="text-base font-medium text-[#e0e0e0] mb-3">Next Steps</h3>
              <p className="text-[#a6adc8] mb-3">
                It would be amazing if others took an interest in getting involved in doing more of this
                research with their own agents or methodologies. There are still hundreds of projects to
                research and details in need of fact checking and revision.
              </p>
              <p className="text-[#a6adc8]">
                We are also setting up a process for scheduled updating of the facts for each project.
                Any and all feedback is very much appreciated.
              </p>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-[#252525] text-sm text-[#6c7086]">
              <p>Research conducted October 2025 – January 2026</p>
              <p>Framework: Constitutional Research v3.0</p>
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
          <a href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research"
             target="_blank" rel="noopener noreferrer" className="hover:text-[#94e2d5]">source</a>
        </div>
      </footer>
    </main>
  );
}
