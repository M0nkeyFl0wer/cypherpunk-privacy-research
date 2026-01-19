import Link from 'next/link';

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Navigation */}
        <Link
          href="/"
          className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-6">
          Research Methodology
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          How we verified 40 privacy-focused Web3 projects with traceable, defensible data.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
            <div className="text-3xl font-bold text-purple-400">959</div>
            <div className="text-sm text-gray-400">Projects Scoped</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
            <div className="text-3xl font-bold text-green-400">40</div>
            <div className="text-sm text-gray-400">Fully Analyzed</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
            <div className="text-3xl font-bold text-blue-400">8</div>
            <div className="text-sm text-gray-400">OSINT Deep Dives</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
            <div className="text-3xl font-bold text-yellow-400">788</div>
            <div className="text-sm text-gray-400">Awaiting Research</div>
          </div>
        </div>

        {/* Constitutional Research Framework */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">1</span>
            Constitutional Research Framework
          </h2>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <p className="text-gray-300 mb-6">
              Every project is researched using a structured approach that prioritizes verification over volume.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="font-medium text-purple-300 mb-2">Verification First</h4>
                <p className="text-sm text-gray-400">Every data point must have a traceable source. No fabricated or assumed data.</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="font-medium text-purple-300 mb-2">Primary Sources</h4>
                <p className="text-sm text-gray-400">Official websites, GitHub repositories, and whitepapers before secondary sources.</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="font-medium text-purple-300 mb-2">Confidence Scoring</h4>
                <p className="text-sm text-gray-400">Each field rated 0.0-1.0 for reliability based on source quality.</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="font-medium text-purple-300 mb-2">Temporal Awareness</h4>
                <p className="text-sm text-gray-400">Data includes collection timestamps for freshness tracking.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Collection Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">2</span>
            Data Collection Process
          </h2>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="space-y-6">
              {/* Phase 1 */}
              <div className="border-l-2 border-blue-500 pl-4">
                <h4 className="font-medium text-blue-300 mb-2">Phase 1: Initial Discovery</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>Official website crawl</li>
                  <li>GitHub repository analysis</li>
                  <li>CoinGecko/CoinMarketCap verification</li>
                  <li>Social media presence check</li>
                </ul>
              </div>

              {/* Phase 2 */}
              <div className="border-l-2 border-purple-500 pl-4">
                <h4 className="font-medium text-purple-300 mb-2">Phase 2: Deep Research</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>Whitepaper and documentation review</li>
                  <li>Team member verification (LinkedIn, Twitter, public bios)</li>
                  <li>Funding history (Crunchbase, press releases)</li>
                  <li>Smart contract verification (block explorers)</li>
                  <li>News and media coverage analysis</li>
                </ul>
              </div>

              {/* Phase 3 */}
              <div className="border-l-2 border-green-500 pl-4">
                <h4 className="font-medium text-green-300 mb-2">Phase 3: Validation</h4>
                <ul className="text-sm text-gray-400 space-y-1">
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
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">3</span>
            Source Hierarchy
          </h2>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <p className="text-gray-300 mb-4">
              Sources are ranked by reliability, affecting confidence scores:
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                <span className="text-green-400 font-bold w-16">Tier 1</span>
                <span className="text-gray-300 flex-1">Official website, GitHub, verified docs</span>
                <span className="text-green-400 text-sm">+0.2</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <span className="text-blue-400 font-bold w-16">Tier 2</span>
                <span className="text-gray-300 flex-1">Official social media, press releases</span>
                <span className="text-blue-400 text-sm">+0.1</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <span className="text-gray-400 font-bold w-16">Tier 3</span>
                <span className="text-gray-300 flex-1">CoinGecko, DeFiLlama, established aggregators</span>
                <span className="text-gray-400 text-sm">+0.0</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                <span className="text-yellow-400 font-bold w-16">Tier 4</span>
                <span className="text-gray-300 flex-1">News articles, third-party reviews</span>
                <span className="text-yellow-400 text-sm">-0.1</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
                <span className="text-red-400 font-bold w-16">Tier 5</span>
                <span className="text-gray-300 flex-1">Community wikis, forums</span>
                <span className="text-red-400 text-sm">-0.2</span>
              </div>
            </div>
          </div>
        </section>

        {/* OSINT Deep Dives */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">4</span>
            OSINT Deep Dives
          </h2>
          <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/30">
            <p className="text-gray-300 mb-4">
              Eight projects received comprehensive OSINT analysis including:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                <h4 className="font-medium text-purple-300 mb-2">Infrastructure Analysis</h4>
                <p className="text-sm text-gray-400">Shodan scans, service fingerprinting, hosting provider identification</p>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                <h4 className="font-medium text-purple-300 mb-2">Subdomain Mapping</h4>
                <p className="text-sm text-gray-400">DNS enumeration, certificate transparency logs, subdomain discovery</p>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                <h4 className="font-medium text-purple-300 mb-2">Security Research</h4>
                <p className="text-sm text-gray-400">Open ports, exposed services, security header analysis</p>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/20">
                <h4 className="font-medium text-purple-300 mb-2">Network Topology</h4>
                <p className="text-sm text-gray-400">CDN usage, geographic distribution, infrastructure providers</p>
              </div>
            </div>

            <div className="text-sm text-gray-400">
              <strong className="text-purple-300">OSINT Projects:</strong> Mysterium Network, Mask Network, Zano, HOPR, Semaphore, Sienna Network, Suterusu, Tornado Cash
            </div>
          </div>
        </section>

        {/* Verification Rules */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">5</span>
            Verification Rules
          </h2>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-white">Names</strong>
                  <p className="text-sm text-gray-400">Must match official branding exactly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-white">Team Members</strong>
                  <p className="text-sm text-gray-400">Require public profile link OR multiple independent sources</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-white">Contract Addresses</strong>
                  <p className="text-sm text-gray-400">Verified via block explorer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-white">Metrics</strong>
                  <p className="text-sm text-gray-400">Include collection timestamp, refresh required if &gt;30 days old</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-white">Descriptions</strong>
                  <p className="text-sm text-gray-400">Sourced from official materials, not AI-generated</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Structure */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">6</span>
            Data Structure
          </h2>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <p className="text-gray-300 mb-4">
              Each project deliverable follows this structure:
            </p>

            <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
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
        <section className="text-center py-8 border-t border-gray-700/50">
          <p className="text-gray-400 mb-6">
            Ready to explore the research?
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/projects"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Projects
            </Link>
            <Link
              href="/lessons"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
            >
              Lessons Learned
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
