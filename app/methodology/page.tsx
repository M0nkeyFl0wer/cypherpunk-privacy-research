import Link from 'next/link';

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#000]">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Navigation */}
        <Link
          href="/"
          className="text-sm font-medium text-[#94e2d5] hover:text-white flex items-center gap-1 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#e0e0e0] mb-12">
          Research Methodology
        </h1>

        {/* Constitutional Research Framework */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#94e2d5]/20 flex items-center justify-center text-[#94e2d5]">1</span>
            Constitutional Research Framework
          </h2>
          <div className="bg-[#111] rounded-xl p-6 border border-[#252525]">
            <p className="text-[#a6adc8] mb-6">
              Every project is researched using a structured approach that prioritizes verification over volume.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="font-medium text-[#94e2d5] mb-2">Verification First</h4>
                <p className="text-sm text-[#6c7086]">Every data point must have a traceable source. No fabricated or assumed data.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="font-medium text-[#94e2d5] mb-2">Primary Sources</h4>
                <p className="text-sm text-[#6c7086]">Official websites, GitHub repositories, and whitepapers before secondary sources.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="font-medium text-[#94e2d5] mb-2">Confidence Scoring</h4>
                <p className="text-sm text-[#6c7086]">Each field rated 0.0-1.0 for reliability based on source quality.</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="font-medium text-[#94e2d5] mb-2">Temporal Awareness</h4>
                <p className="text-sm text-[#6c7086]">Data includes collection timestamps for freshness tracking.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Collection Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#89b4fa]/20 flex items-center justify-center text-[#89b4fa]">2</span>
            Data Collection Process
          </h2>
          <div className="bg-[#111] rounded-xl p-6 border border-[#252525]">
            <div className="space-y-6">
              {/* Phase 1 */}
              <div className="border-l-2 border-[#89b4fa] pl-4">
                <h4 className="font-medium text-[#89b4fa] mb-2">Phase 1: Initial Discovery</h4>
                <ul className="text-sm text-[#6c7086] space-y-1">
                  <li>Official website crawl</li>
                  <li>GitHub repository analysis</li>
                  <li>CoinGecko/CoinMarketCap verification</li>
                  <li>Social media presence check</li>
                </ul>
              </div>

              {/* Phase 2 */}
              <div className="border-l-2 border-[#94e2d5] pl-4">
                <h4 className="font-medium text-[#94e2d5] mb-2">Phase 2: Deep Research</h4>
                <ul className="text-sm text-[#6c7086] space-y-1">
                  <li>Whitepaper and documentation review</li>
                  <li>Team member verification (LinkedIn, Twitter, public bios)</li>
                  <li>Funding history (Crunchbase, press releases)</li>
                  <li>Smart contract verification (block explorers)</li>
                  <li>News and media coverage analysis</li>
                </ul>
              </div>

              {/* Phase 3 */}
              <div className="border-l-2 border-[#a6e3a1] pl-4">
                <h4 className="font-medium text-[#a6e3a1] mb-2">Phase 3: Validation</h4>
                <ul className="text-sm text-[#6c7086] space-y-1">
                  <li>Cross-reference multiple sources</li>
                  <li>Flag unverifiable claims</li>
                  <li>Assign confidence scores</li>
                  <li>Document all source URLs</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Source Hierarchy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#a6e3a1]/20 flex items-center justify-center text-[#a6e3a1]">3</span>
            Source Hierarchy
          </h2>
          <div className="bg-[#111] rounded-xl p-6 border border-[#252525]">
            <p className="text-[#a6adc8] mb-4">
              Sources are ranked by reliability, affecting confidence scores:
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-[#a6e3a1]/10 rounded-lg border border-[#a6e3a1]/30">
                <span className="text-[#a6e3a1] font-bold w-16">Tier 1</span>
                <span className="text-[#a6adc8] flex-1">Official website, GitHub, verified docs</span>
                <span className="text-[#a6e3a1] text-sm">+0.2</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-[#89b4fa]/10 rounded-lg border border-[#89b4fa]/30">
                <span className="text-[#89b4fa] font-bold w-16">Tier 2</span>
                <span className="text-[#a6adc8] flex-1">Official social media, press releases</span>
                <span className="text-[#89b4fa] text-sm">+0.1</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-[#1a1a1a] rounded-lg border border-[#252525]">
                <span className="text-[#6c7086] font-bold w-16">Tier 3</span>
                <span className="text-[#a6adc8] flex-1">CoinGecko, DeFiLlama, established aggregators</span>
                <span className="text-[#6c7086] text-sm">+0.0</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-[#f9e2af]/10 rounded-lg border border-[#f9e2af]/30">
                <span className="text-[#f9e2af] font-bold w-16">Tier 4</span>
                <span className="text-[#a6adc8] flex-1">News articles, third-party reviews</span>
                <span className="text-[#f9e2af] text-sm">-0.1</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-[#f38ba8]/10 rounded-lg border border-[#f38ba8]/30">
                <span className="text-[#f38ba8] font-bold w-16">Tier 5</span>
                <span className="text-[#a6adc8] flex-1">Community wikis, forums</span>
                <span className="text-[#f38ba8] text-sm">-0.2</span>
              </div>
            </div>
          </div>
        </section>

        {/* OSINT Deep Dives */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#94e2d5]/20 flex items-center justify-center text-[#94e2d5]">4</span>
            OSINT Deep Dives
          </h2>
          <div className="bg-[#94e2d5]/10 rounded-xl p-6 border border-[#94e2d5]/30">
            <p className="text-[#a6adc8] mb-4">
              Eight projects received comprehensive OSINT analysis including:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#111] rounded-lg p-4 border border-[#94e2d5]/20">
                <h4 className="font-medium text-[#94e2d5] mb-2">Infrastructure Analysis</h4>
                <p className="text-sm text-[#6c7086]">Shodan scans, service fingerprinting, hosting provider identification</p>
              </div>
              <div className="bg-[#111] rounded-lg p-4 border border-[#94e2d5]/20">
                <h4 className="font-medium text-[#94e2d5] mb-2">Subdomain Mapping</h4>
                <p className="text-sm text-[#6c7086]">DNS enumeration, certificate transparency logs, subdomain discovery</p>
              </div>
              <div className="bg-[#111] rounded-lg p-4 border border-[#94e2d5]/20">
                <h4 className="font-medium text-[#94e2d5] mb-2">Security Research</h4>
                <p className="text-sm text-[#6c7086]">Open ports, exposed services, security header analysis</p>
              </div>
              <div className="bg-[#111] rounded-lg p-4 border border-[#94e2d5]/20">
                <h4 className="font-medium text-[#94e2d5] mb-2">Network Topology</h4>
                <p className="text-sm text-[#6c7086]">CDN usage, geographic distribution, infrastructure providers</p>
              </div>
            </div>

            <div className="text-sm text-[#6c7086]">
              <strong className="text-[#94e2d5]">OSINT Projects:</strong> Mysterium Network, Mask Network, Zano, HOPR, Semaphore, Sienna Network, Suterusu, Tornado Cash
            </div>
          </div>
        </section>

        {/* Verification Rules */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#f9e2af]/20 flex items-center justify-center text-[#f9e2af]">5</span>
            Verification Rules
          </h2>
          <div className="bg-[#111] rounded-xl p-6 border border-[#252525]">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#a6e3a1] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-[#e0e0e0]">Names</strong>
                  <p className="text-sm text-[#6c7086]">Must match official branding exactly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#a6e3a1] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-[#e0e0e0]">Team Members</strong>
                  <p className="text-sm text-[#6c7086]">Require public profile link OR multiple independent sources</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#a6e3a1] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-[#e0e0e0]">Contract Addresses</strong>
                  <p className="text-sm text-[#6c7086]">Verified via block explorer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#a6e3a1] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-[#e0e0e0]">Metrics</strong>
                  <p className="text-sm text-[#6c7086]">Include collection timestamp, refresh required if &gt;30 days old</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#a6e3a1] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-[#e0e0e0]">Descriptions</strong>
                  <p className="text-sm text-[#6c7086]">Sourced from official materials, not AI-generated</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Structure */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#89b4fa]/20 flex items-center justify-center text-[#89b4fa]">6</span>
            Data Structure
          </h2>
          <div className="bg-[#111] rounded-xl p-6 border border-[#252525]">
            <p className="text-[#a6adc8] mb-4">
              Each project deliverable follows this structure:
            </p>

            <div className="bg-[#1a1a1a] rounded-lg p-4 font-mono text-sm text-[#a6adc8] overflow-x-auto">
              <pre>{`deliverables/{project-id}/
├── README.md                    # Project overview
├── CARD.md                      # Quick summary card
├── constitutional_research.json # Methodology metadata
├── project_metadata.json        # Basic project info
├── sources/
│   └── verified_data.json       # Primary research data
├── reports/
│   ├── TEAM.md                  # Team & leadership
│   ├── SECURITY.md              # Security assessment
│   ├── CODE_REVIEW.md           # Code analysis
│   └── news_report.md           # Recent developments
└── analysis/
    ├── github_analysis.json     # GitHub metrics
    └── osint_data.json          # OSINT (if applicable)`}</pre>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 border-t border-[#252525]">
          <p className="text-[#6c7086] mb-6">
            Ready to explore the research?
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/projects"
              className="bg-[#94e2d5] hover:bg-[#74c7ba] text-[#000] px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Projects
            </Link>
            <Link
              href="/how-it-works"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
            >
              How It Works
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
