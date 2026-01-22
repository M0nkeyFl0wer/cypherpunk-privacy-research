import Link from 'next/link';

export default function ConstitutionPage() {
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
        <div className="mb-12">
          <div className="inline-block bg-[#94e2d5]/20 text-[#94e2d5] px-3 py-1 rounded-full text-sm font-medium mb-4">
            Version 3.0
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#e0e0e0] mb-6">
            Constitutional Research Framework
          </h1>
          <p className="text-xl text-[#6c7086]">
            The governing principles that ensure all research is verifiable, honest, and defensible.
          </p>
        </div>

        {/* Why Constitutional? */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Why &quot;Constitutional&quot;?</h2>
          <div className="bg-[#111] rounded-xl p-6 border border-[#252525]">
            <p className="text-[#a6adc8] mb-4">
              Like a constitution for a nation, these principles are <strong className="text-[#94e2d5]">inviolable</strong>.
              They cannot be broken regardless of convenience, time pressure, or the desire to appear more complete.
            </p>
            <p className="text-[#a6adc8]">
              This framework emerged from a failed PR submission where fabricated data and unverified claims
              damaged research credibility. These principles prevent that from happening again.
            </p>
          </div>
        </section>

        {/* The Seven Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-6">The Seven Articles</h2>

          <div className="space-y-4">
            {/* Article 1 */}
            <div className="bg-[#111] rounded-xl p-6 border border-[#f38ba8]/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#f38ba8]/20 flex items-center justify-center text-[#f38ba8] font-bold">1</span>
                <h3 className="text-lg font-bold text-[#f38ba8]">Truth Over Convenience</h3>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4 font-mono text-sm text-[#a6adc8]">
                <p>NEVER fabricate, infer, or assume data.</p>
                <p>If information cannot be verified, mark it as UNKNOWN.</p>
                <p className="text-[#94e2d5]">&quot;No data available&quot; is always preferable to invented data.</p>
              </div>
            </div>

            {/* Article 2 */}
            <div className="bg-[#111] rounded-xl p-6 border border-[#fab387]/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#fab387]/20 flex items-center justify-center text-[#fab387] font-bold">2</span>
                <h3 className="text-lg font-bold text-[#fab387]">Source Everything</h3>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4 font-mono text-sm text-[#a6adc8]">
                <p>Every claim must have a traceable source.</p>
                <p className="text-[#f38ba8]">No source = No claim.</p>
                <p>Sources must be specific (URL, document name, timestamp)</p>
                <p className="text-[#6c7086]">not vague (&quot;various sources&quot;).</p>
              </div>
            </div>

            {/* Article 3 */}
            <div className="bg-[#111] rounded-xl p-6 border border-[#f9e2af]/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#f9e2af]/20 flex items-center justify-center text-[#f9e2af] font-bold">3</span>
                <h3 className="text-lg font-bold text-[#f9e2af]">Confidence Scoring</h3>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4 text-sm text-[#a6adc8]">
                <p className="mb-2">All data points receive a confidence score from 0.0 to 1.0:</p>
                <div className="space-y-1 font-mono">
                  <div className="flex justify-between"><span className="text-[#a6e3a1]">1.0:</span> <span>Direct from official source, easily verifiable</span></div>
                  <div className="flex justify-between"><span className="text-[#94e2d5]">0.8-0.9:</span> <span>Multiple independent sources agree</span></div>
                  <div className="flex justify-between"><span className="text-[#89b4fa]">0.6-0.7:</span> <span>Single reliable source</span></div>
                  <div className="flex justify-between"><span className="text-[#f9e2af]">0.4-0.5:</span> <span>Secondary source or aged data</span></div>
                  <div className="flex justify-between"><span className="text-[#f38ba8]">0.0-0.3:</span> <span>Unverified or questionable</span></div>
                </div>
              </div>
            </div>

            {/* Article 4 */}
            <div className="bg-[#111] rounded-xl p-6 border border-[#a6e3a1]/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#a6e3a1]/20 flex items-center justify-center text-[#a6e3a1] font-bold">4</span>
                <h3 className="text-lg font-bold text-[#a6e3a1]">Temporal Awareness</h3>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4 font-mono text-sm text-[#a6adc8]">
                <p>All research is timestamped.</p>
                <p>Data older than 90 days should be flagged for review.</p>
                <p>Metrics (stars, TVL, users) require refresh dates.</p>
                <p>Historical data is labeled as historical.</p>
              </div>
            </div>

            {/* Article 5 */}
            <div className="bg-[#111] rounded-xl p-6 border border-[#94e2d5]/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#94e2d5]/20 flex items-center justify-center text-[#94e2d5] font-bold">5</span>
                <h3 className="text-lg font-bold text-[#94e2d5]">Primary Source Priority</h3>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4 text-sm text-[#a6adc8]">
                <p className="mb-2">Source hierarchy (highest to lowest reliability):</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li><span className="text-[#a6e3a1]">Tier 1:</span> Official website, GitHub, verified docs</li>
                  <li><span className="text-[#94e2d5]">Tier 2:</span> Official social media, press releases</li>
                  <li><span className="text-[#89b4fa]">Tier 3:</span> CoinGecko, DeFiLlama, aggregators</li>
                  <li><span className="text-[#f9e2af]">Tier 4:</span> News articles, third-party reviews</li>
                  <li><span className="text-[#f38ba8]">Tier 5:</span> Community wikis, forums</li>
                </ol>
              </div>
            </div>

            {/* Article 6 */}
            <div className="bg-[#111] rounded-xl p-6 border border-[#89b4fa]/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#89b4fa]/20 flex items-center justify-center text-[#89b4fa] font-bold">6</span>
                <h3 className="text-lg font-bold text-[#89b4fa]">Scope Boundaries</h3>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4 font-mono text-sm text-[#a6adc8]">
                <p>Research what exists, not what might exist.</p>
                <p className="text-[#f38ba8]">Do not speculate about future features.</p>
                <p className="text-[#f38ba8]">Do not assume unstated relationships.</p>
                <p className="text-[#f38ba8]">Do not extrapolate from incomplete data.</p>
              </div>
            </div>

            {/* Article 7 */}
            <div className="bg-[#111] rounded-xl p-6 border border-[#cba6f7]/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#cba6f7]/20 flex items-center justify-center text-[#cba6f7] font-bold">7</span>
                <h3 className="text-lg font-bold text-[#cba6f7]">Honest Gap Reporting</h3>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4 font-mono text-sm text-[#a6adc8]">
                <p>Document what you COULD NOT find.</p>
                <p className="text-[#94e2d5]">Missing data is valuable information.</p>
                <p>&quot;Team information not publicly disclosed&quot; tells the reader something important.</p>
                <p className="text-[#f38ba8]">Never hide gaps or pretend completeness.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Research Data Quality */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Understanding &quot;Research Data Quality&quot;</h2>
          <div className="bg-[#f9e2af]/10 rounded-xl p-6 border border-[#f9e2af]/30">
            <p className="text-[#a6adc8] mb-4">
              Every report includes a <strong className="text-[#f9e2af]">Research Data Quality</strong> score.
              This rates <em>our confidence in our own research</em>, not an assessment of the project itself.
            </p>

            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-[#a6e3a1] font-medium mb-2">What it measures:</h4>
                  <ul className="text-sm text-[#6c7086] space-y-1">
                    <li>Source diversity and quality</li>
                    <li>Data freshness</li>
                    <li>Cross-verification success</li>
                    <li>Gap completeness</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[#f38ba8] font-medium mb-2">What it does NOT measure:</h4>
                  <ul className="text-sm text-[#6c7086] space-y-1">
                    <li>Project quality</li>
                    <li>Security posture</li>
                    <li>Investment worthiness</li>
                    <li>Technical merit</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Gates */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Quality Gates</h2>
          <p className="text-[#6c7086] mb-4">Before any research is marked complete, it must pass these gates:</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#111] rounded-xl p-4 border border-[#252525]">
              <h4 className="font-medium text-[#a6e3a1] mb-2">Gate 1: No Fabrication</h4>
              <ul className="text-sm text-[#6c7086] space-y-1">
                <li>Every data point has a specific source</li>
                <li>No placeholder text remains</li>
                <li>&quot;Unknown&quot; used where unavailable</li>
              </ul>
            </div>
            <div className="bg-[#111] rounded-xl p-4 border border-[#252525]">
              <h4 className="font-medium text-[#89b4fa] mb-2">Gate 2: Confidence Verified</h4>
              <ul className="text-sm text-[#6c7086] space-y-1">
                <li>All scores are justified</li>
                <li>No 1.0 without official source</li>
                <li>Low-confidence items flagged</li>
              </ul>
            </div>
            <div className="bg-[#111] rounded-xl p-4 border border-[#252525]">
              <h4 className="font-medium text-[#f9e2af] mb-2">Gate 3: Temporal Integrity</h4>
              <ul className="text-sm text-[#6c7086] space-y-1">
                <li>Timestamps are accurate</li>
                <li>Refresh dates noted for metrics</li>
                <li>Historical vs current distinguished</li>
              </ul>
            </div>
            <div className="bg-[#111] rounded-xl p-4 border border-[#252525]">
              <h4 className="font-medium text-[#cba6f7] mb-2">Gate 4: Gap Honesty</h4>
              <ul className="text-sm text-[#6c7086] space-y-1">
                <li>Missing data documented</li>
                <li>Gaps explain WHY missing</li>
                <li>No false completeness</li>
              </ul>
            </div>
          </div>
        </section>

        {/* OSINT Methodology */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">OSINT Assessment Methodology</h2>
          <div className="bg-[#111] rounded-xl p-6 border border-[#252525]">
            <p className="text-[#a6adc8] mb-4">
              For projects receiving OPSEC/OSINT analysis, we use exclusively <strong className="text-[#94e2d5]">passive, non-invasive methods</strong>:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="font-medium text-[#94e2d5] mb-2">Data Sources Used</h4>
                <ul className="text-sm text-[#6c7086] space-y-1">
                  <li>Shodan - Infrastructure scanning</li>
                  <li>crt.sh - Certificate transparency</li>
                  <li>DNS resolution - Subdomain mapping</li>
                  <li>HTTP headers - Security configuration</li>
                  <li>GitHub API - Repository analysis</li>
                </ul>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <h4 className="font-medium text-[#f38ba8] mb-2">NOT Performed</h4>
                <ul className="text-sm text-[#6c7086] space-y-1">
                  <li>Active exploitation</li>
                  <li>Unauthorized access attempts</li>
                  <li>Social engineering</li>
                  <li>Penetration testing</li>
                  <li>Vulnerability exploitation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Version History */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Version History</h2>
          <div className="bg-[#111] rounded-xl p-6 border border-[#252525]">
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-[#94e2d5] font-mono w-12">v3.0</span>
                <span className="text-[#6c7086] w-24">2026-01</span>
                <span className="text-[#a6adc8]">Added OSINT methodology, clarified &quot;Research Data Quality&quot; scoring</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#89b4fa] font-mono w-12">v2.0</span>
                <span className="text-[#6c7086] w-24">2025-01</span>
                <span className="text-[#a6adc8]">Added confidence scoring, gap reporting requirements</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#6c7086] font-mono w-12">v1.0</span>
                <span className="text-[#6c7086] w-24">2024-12</span>
                <span className="text-[#a6adc8]">Initial framework following PR disaster</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 border-t border-[#252525]">
          <p className="text-[#6c7086] mb-6">
            See the framework in action
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/projects"
              className="bg-[#94e2d5] hover:bg-[#74c7ba] text-[#000] px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Research
            </Link>
            <Link
              href="/methodology"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
            >
              Methodology Details
            </Link>
            <a
              href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/blob/master/docs/CONSTITUTIONAL_RESEARCH_FRAMEWORK.md"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
            >
              Full Documentation
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
