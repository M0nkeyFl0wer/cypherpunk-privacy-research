'use client';

import { HomepageGraph } from '@/components/HomepageGraph';
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { InlineSearch } from '@/components/InlineSearch';
import Link from 'next/link';

export default function Home() {
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
        <CollapsibleSection
          title="EXECUTIVE SUMMARY"
          titleClassName="tracking-wider text-lg"
          summary={
            <div className="text-[#a6adc8] space-y-4">
              <p>
                Independent research covering 50 Web3 privacy projects with verified data. 8 projects
                received comprehensive OSINT deep dives. All findings trace to primary sources — zero
                fabrication, zero synthetic data.
              </p>
              <Link href="/projects" className="inline-flex items-center gap-1 text-[#94e2d5] hover:underline text-sm">
                view all project details <span aria-hidden="true">→</span>
              </Link>
            </div>
          }
          full={
            <div className="text-[#a6adc8] space-y-4">
              <p>
                Independent research covering 50 Web3 privacy projects with verified data. 8 projects
                received comprehensive OSINT deep dives. All findings trace to primary sources — zero
                fabrication, zero synthetic data.
              </p>
              <p>
                Projects span privacy protocols, zero-knowledge systems, mixers, private DeFi, encrypted
                messaging, and identity solutions. Each project evaluated on team verification, code
                availability, security audits, and privacy guarantees.
              </p>
              <p>
                Research methodology emphasizes constitutional constraints: no fabrication, honest gap
                reporting when information unavailable, multi-source verification for all claims.
              </p>
              <h3 className="text-[#e0e0e0] font-medium pt-2">Coverage Breakdown</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>8 OSINT deep dives with team verification, funding analysis, security review</li>
                <li>42 standard research profiles with verified project data</li>
                <li>Cross-referenced against Web3Privacy Explorer database</li>
                <li>Primary sources: GitHub, LinkedIn, corporate registries, audit reports</li>
              </ul>
              <Link href="/projects" className="inline-flex items-center gap-1 text-[#94e2d5] hover:underline text-sm">
                view all project details <span aria-hidden="true">→</span>
              </Link>
            </div>
          }
        />
      </div>

      {/* About This Research */}
      <div className="max-w-5xl mx-auto px-6 py-8 border-t border-[#252525]">
        <CollapsibleSection
          title="ABOUT THIS RESEARCH"
          titleClassName="tracking-wider text-lg"
          summary={
            <p className="text-[#a6adc8]">
              Web3Privacy community research analyzing privacy-focused blockchain projects. Conducted
              using constitutional methodology that prohibits fabrication and requires primary source
              verification for all claims.
            </p>
          }
          full={
            <div className="text-[#a6adc8] space-y-4">
              <p>
                Web3Privacy community research analyzing privacy-focused blockchain projects. Conducted
                using constitutional methodology that prohibits fabrication and requires primary source
                verification for all claims.
              </p>
              <p>
                This research contributes to the broader Web3Privacy ecosystem, complementing the
                Web3Privacy Explorer with in-depth OSINT analysis. Projects were selected based on
                relevance to Ethereum ecosystem and privacy technology.
              </p>
              <p>
                All data points are either verified against primary sources or explicitly marked as
                unverified. When information is unavailable, we report the gap rather than speculate.
              </p>
              <h3 className="text-[#e0e0e0] font-medium pt-2">Methodology Principles</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Zero fabrication — all claims traceable to sources</li>
                <li>Honest gap reporting — unknown data marked as such</li>
                <li>Multi-source verification — cross-reference all claims</li>
                <li>Primary sources preferred — GitHub, LinkedIn, registries, audits</li>
                <li>Constitutional constraints — methodology documented and followed</li>
              </ul>
            </div>
          }
        />
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
