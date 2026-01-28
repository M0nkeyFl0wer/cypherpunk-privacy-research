'use client';

import Link from 'next/link';
import { CollapsibleSection } from './CollapsibleSection';
import { HomepageGraph } from './HomepageGraph';

interface Project {
  slug: string;
  name: string;
  tier: string;
  stars: number;
}

interface HomepageContentProps {
  projectCount: number;
  osintCount: number;
  totalStars: number;
  languageCount: number;
  osintProjects: Project[];
  standardProjects: Project[];
}

export function HomepageContent({
  projectCount,
  osintCount,
  totalStars,
  languageCount,
  osintProjects,
  standardProjects,
}: HomepageContentProps) {
  return (
    <>
      {/* Interactive Graph & Search - Primary navigation */}
      <div className="border-b border-[#252525]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <HomepageGraph />
        </div>
      </div>

      {/* Executive Summary - NOW FIRST after Hero (Constitution III) */}
      <div className="border-b border-[#252525]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <CollapsibleSection
            title="Executive Summary"
            titleClassName="text-sm font-medium text-[#6c7086] uppercase tracking-wider"
            summary={
              <p className="text-[#bac2de]">
                Independent research covering {projectCount} Web3 privacy projects with verified data.
                {osintCount} projects received comprehensive OSINT deep dives. All findings trace to
                primary sources — zero fabrication, zero synthetic data.
              </p>
            }
            full={
              <div className="prose text-[#bac2de] space-y-4">
                <p>
                  This research covers the technical infrastructure, team composition, and security posture
                  of {projectCount} Web3 privacy projects. Each project underwent standardized analysis
                  including GitHub repository metrics, code composition breakdown, and contributor mapping.
                </p>

                <p>
                  <strong className="text-[#e0e0e0]">{osintCount} projects received OSINT deep dives</strong> —
                  comprehensive infrastructure analysis including Shodan reconnaissance, subdomain enumeration,
                  DNS mapping, and security research. These projects are: {osintProjects.map(p => p.name).join(', ')}.
                </p>

                <p>
                  <strong className="text-[#e0e0e0]">Constitutional compliance</strong> was enforced throughout.
                  Every claim traces to a primary source. No synthetic data, placeholder text, or fabricated
                  information appears in this research. When data was unavailable, it was marked as such
                  rather than invented.
                </p>

                <div className="mt-6 p-4 bg-[#111] rounded border border-[#252525]">
                  <h4 className="text-[#e0e0e0] font-medium mb-2">Methodology Notes</h4>
                  <ul className="text-sm space-y-1 text-[#a6adc8]">
                    <li>• Primary sources verified via GitHub API, official websites, corporate registries</li>
                    <li>• OSINT conducted using Shodan, Censys, DNS enumeration tools</li>
                    <li>• Confidence scores assigned based on source quality and recency</li>
                    <li>• Missing data explicitly marked rather than estimated</li>
                  </ul>
                </div>
              </div>
            }
          />

          <div className="mt-6">
            <Link href="/projects" className="text-[#94e2d5] hover:underline text-sm">
              view all project details →
            </Link>
          </div>
        </div>
      </div>

      {/* Project Description - NEW SECTION (Constitution III) */}
      <div className="border-b border-[#252525]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <CollapsibleSection
            title="About This Research"
            titleClassName="text-sm font-medium text-[#6c7086] uppercase tracking-wider"
            summary={
              <p className="text-[#bac2de]">
                Web3Privacy community research analyzing privacy-focused blockchain projects.
                Conducted using constitutional methodology that prohibits fabrication and requires
                primary source verification for all claims.
              </p>
            }
            full={
              <div className="prose text-[#bac2de] space-y-4">
                <p>
                  <strong className="text-[#e0e0e0]">What this is:</strong> A systematic analysis of
                  privacy-preserving Web3 infrastructure, wallets, protocols, and tools. The research
                  examines technical implementations, team structures, funding sources, and security postures.
                </p>

                <p>
                  <strong className="text-[#e0e0e0]">How it was conducted:</strong> Each project was analyzed
                  using standardized templates covering GitHub metrics, team identification, infrastructure
                  mapping, and privacy technique classification. OSINT deep dives added Shodan reconnaissance,
                  subdomain enumeration, and security analysis for select projects.
                </p>

                <p>
                  <strong className="text-[#e0e0e0]">Who it&apos;s for:</strong> Developers evaluating privacy tools,
                  researchers studying the Web3 privacy ecosystem, security professionals assessing project
                  maturity, and community members seeking verified information about privacy projects.
                </p>

                <div className="mt-6 p-4 bg-[#111] rounded border border-[#252525]">
                  <h4 className="text-[#e0e0e0] font-medium mb-2">Constitutional Methodology</h4>
                  <p className="text-sm text-[#a6adc8] mb-3">
                    This research follows strict data integrity principles:
                  </p>
                  <ul className="text-sm space-y-1 text-[#a6adc8]">
                    <li>• <strong>Zero fabrication</strong> — no placeholder or synthetic data</li>
                    <li>• <strong>Primary sources</strong> — all claims traceable to original sources</li>
                    <li>• <strong>Explicit gaps</strong> — missing data marked, not invented</li>
                    <li>• <strong>Confidence scoring</strong> — reliability of sources assessed</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <Link href="/methodology" className="text-[#89b4fa] hover:underline text-sm">
                    read full methodology →
                  </Link>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* OSINT Deep Dives */}
      <div className="border-b border-[#252525]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-sm font-medium text-[#94e2d5] uppercase tracking-wider mb-6">
            OSINT Deep Dives
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {osintProjects.map(p => (
              <Link key={p.slug} href={`/projects/${p.slug}`}
                    className="flex items-center justify-between p-4 border border-[#252525] rounded hover:border-[#94e2d5] transition-colors">
                <span className="text-[#e0e0e0]">{p.name}</span>
                <span className="text-[#6c7086] text-sm">{p.stars.toLocaleString()} ★</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Standard Research */}
      <div className="border-b border-[#252525]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-sm font-medium text-[#89b4fa] uppercase tracking-wider mb-6">
            Standard Research ({standardProjects.length} projects)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {standardProjects.map(p => (
              <Link key={p.slug} href={`/projects/${p.slug}`}
                    className="flex items-center justify-between py-2 px-3 rounded hover:bg-[#111] transition-colors text-sm">
                <span className="text-[#a6adc8]">{p.name}</span>
                <span className="text-[#6c7086]">{p.stars.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="border-b border-[#252525]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-sm font-medium text-[#6c7086] uppercase tracking-wider mb-6">Explore</h2>

          <div className="flex gap-4">
            <Link href="/portal"
                  className="flex-1 p-4 border border-[#252525] rounded hover:border-[#94e2d5] transition-colors">
              <div className="text-[#94e2d5] mb-1">network graph</div>
              <div className="text-[#6c7086] text-sm">explore project relationships</div>
            </Link>
            <Link href="/methodology"
                  className="flex-1 p-4 border border-[#252525] rounded hover:border-[#89b4fa] transition-colors">
              <div className="text-[#89b4fa] mb-1">methodology</div>
              <div className="text-[#6c7086] text-sm">research approach & sources</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
