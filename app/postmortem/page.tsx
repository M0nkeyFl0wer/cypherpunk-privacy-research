import Link from 'next/link';

export default function PostmortemPage() {
  return (
    <div className="min-h-screen bg-[#000]">
      {/* Header */}
      <header className="bg-[#111] border-b border-[#252525]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="text-sm font-medium text-[#94e2d5] hover:text-[#f38ba8] flex items-center gap-1 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-[#e0e0e0]">
            Postmortem: Web3Privacy Explorer PR Disaster
          </h1>
          <p className="mt-2 text-lg text-[#a6adc8]">
            What went wrong, what we learned, and why this research site exists
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="prose prose-invert max-w-none">
          {/* Timeline */}
          <section className="bg-[#111] rounded-lg border border-[#252525] p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">The Timeline</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32 text-sm text-[#94e2d5] font-mono">Dec 2024</div>
                <div>
                  <h3 className="text-lg font-semibold text-[#e0e0e0]">Research Project Begins</h3>
                  <p className="text-[#a6adc8] mt-1">
                    Started building a comprehensive privacy project research database with verified data,
                    team information, contract addresses, milestones, metrics, and legal history.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32 text-sm text-[#89b4fa] font-mono">Jan 2025</div>
                <div>
                  <h3 className="text-lg font-semibold text-[#e0e0e0]">PR #1997 Submitted</h3>
                  <p className="text-[#a6adc8] mt-1">
                    Submitted a pull request to web3privacy/explorer-data repository with research data
                    for 129 privacy projects. The intention was to add new projects with verified research.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32 text-sm text-[#f38ba8] font-mono">The Problem</div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f38ba8]">Data Corruption</h3>
                  <p className="text-[#a6adc8] mt-1">
                    The PR accidentally overwrote existing high-quality project data with template/placeholder
                    data. Projects like Zcash, Tornado Cash, and others lost their carefully curated descriptions
                    and were replaced with generic AI-generated content.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32 text-sm text-[#f9e2af] font-mono">Community</div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f9e2af]">Called Out by Zcash Developer</h3>
                  <p className="text-[#a6adc8] mt-1">
                    A developer from the Zcash community reviewed the PR and pointed out that the changes
                    would damage existing data quality. This was a valuable catch that prevented the bad
                    data from being merged.
                  </p>
                  <div className="mt-3 p-4 bg-[#252525] rounded border-l-4 border-[#f9e2af]">
                    <p className="text-sm text-[#6c7086] italic">
                      &quot;This PR would overwrite our carefully maintained project descriptions with
                      template text. Please review the diff carefully.&quot;
                    </p>
                    <p className="text-xs text-[#6c7086] mt-2">- Community feedback on PR #1997</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32 text-sm text-[#a6e3a1] font-mono">Resolution</div>
                <div>
                  <h3 className="text-lg font-semibold text-[#a6e3a1]">PR #2060 - Restoration</h3>
                  <p className="text-[#a6adc8] mt-1">
                    Created a new PR to restore the damaged project data with verified research from
                    our comprehensive database. This site serves as documentation and demonstration
                    of the research methodology.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What Went Wrong */}
          <section className="bg-[#111] rounded-lg border border-[#252525] p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">What Went Wrong</h2>

            <ul className="space-y-3 text-[#a6adc8]">
              <li className="flex gap-3">
                <span className="text-[#f38ba8]">1.</span>
                <span>
                  <strong className="text-[#e0e0e0]">Incomplete diff review</strong> -
                  The PR contained changes to existing files that weren&apos;t carefully reviewed before submission.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f38ba8]">2.</span>
                <span>
                  <strong className="text-[#e0e0e0]">Template data mixed with research</strong> -
                  Placeholder templates were accidentally included alongside verified research data.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f38ba8]">3.</span>
                <span>
                  <strong className="text-[#e0e0e0]">Limited explorer schema</strong> -
                  The web3privacy explorer schema only accepts basic fields (name, description, team, links).
                  All our detailed research (contracts, milestones, metrics, legal history) had nowhere to go.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f38ba8]">4.</span>
                <span>
                  <strong className="text-[#e0e0e0]">No staging/preview</strong> -
                  Changes were submitted directly without a preview environment to catch issues.
                </span>
              </li>
            </ul>
          </section>

          {/* Lessons Learned */}
          <section className="bg-[#111] rounded-lg border border-[#252525] p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Lessons Learned</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-[#252525] rounded-lg">
                <h3 className="text-lg font-semibold text-[#a6e3a1] mb-2">Do</h3>
                <ul className="space-y-2 text-sm text-[#a6adc8]">
                  <li>Review every file in a PR diff, especially modified files</li>
                  <li>Test on a staging environment first</li>
                  <li>Add only NEW projects, never modify existing ones without explicit intent</li>
                  <li>Document research methodology and sources</li>
                  <li>Keep detailed research in a separate, linked resource</li>
                </ul>
              </div>

              <div className="p-4 bg-[#252525] rounded-lg">
                <h3 className="text-lg font-semibold text-[#f38ba8] mb-2">Don&apos;t</h3>
                <ul className="space-y-2 text-sm text-[#a6adc8]">
                  <li>Submit large PRs without thorough review</li>
                  <li>Mix template/placeholder data with real data</li>
                  <li>Assume AI-generated content is accurate</li>
                  <li>Ignore community feedback</li>
                  <li>Rush contributions to meet arbitrary deadlines</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Why This Site Exists */}
          <section className="bg-[#111] rounded-lg border border-[#252525] p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Why This Research Site Exists</h2>

            <p className="text-[#a6adc8] mb-4">
              This site serves multiple purposes:
            </p>

            <ol className="space-y-4 text-[#a6adc8]">
              <li>
                <strong className="text-[#e0e0e0]">1. Extended Data Demonstration</strong>
                <p className="mt-1">
                  Shows the full depth of research data that the explorer schema cannot accommodate.
                  Each project page includes contracts, milestones, metrics, and legal history that
                  would be lost in a basic YAML entry.
                </p>
              </li>
              <li>
                <strong className="text-[#e0e0e0]">2. Schema Extension Proposal</strong>
                <p className="mt-1">
                  Demonstrates the value of adding fields like <code className="text-[#94e2d5]">research_url</code>,
                  <code className="text-[#94e2d5]">contracts</code>, <code className="text-[#94e2d5]">milestones</code>,
                  and <code className="text-[#94e2d5]">metrics</code> to the explorer schema.
                </p>
              </li>
              <li>
                <strong className="text-[#e0e0e0]">3. Transparency</strong>
                <p className="mt-1">
                  This postmortem acknowledges the mistake and documents what was learned.
                  Open source is about learning in public.
                </p>
              </li>
              <li>
                <strong className="text-[#e0e0e0]">4. Research Archive</strong>
                <p className="mt-1">
                  Preserves {`40`} verified project research files with confidence scores, sources,
                  and detailed analysis that took months to compile.
                </p>
              </li>
            </ol>
          </section>

          {/* Relevant GitHub Issues */}
          <section className="bg-[#111] rounded-lg border border-[#252525] p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Related GitHub Issues</h2>

            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/web3privacy/explorer-data/issues/1947"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#89b4fa] hover:text-[#94e2d5] transition-colors"
                >
                  #1947 - LLM data crawler for automatic project research
                </a>
                <p className="text-sm text-[#6c7086] mt-1">
                  Discusses automated research tooling similar to what we built
                </p>
              </li>
              <li>
                <a
                  href="https://github.com/web3privacy/explorer-data/issues/1940"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#89b4fa] hover:text-[#94e2d5] transition-colors"
                >
                  #1940 - Add TVL for privacy projects
                </a>
                <p className="text-sm text-[#6c7086] mt-1">
                  Proposes adding metrics fields to the schema
                </p>
              </li>
              <li>
                <a
                  href="https://github.com/web3privacy/explorer-data/issues/1939"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#89b4fa] hover:text-[#94e2d5] transition-colors"
                >
                  #1939 - Add TVL for individual projects
                </a>
                <p className="text-sm text-[#6c7086] mt-1">
                  Related discussion on project-level metrics
                </p>
              </li>
            </ul>
          </section>

          {/* Call to Action */}
          <section className="bg-[#94e2d5]/10 rounded-lg border border-[#94e2d5]/30 p-6">
            <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Explore the Research</h2>
            <p className="text-[#a6adc8] mb-4">
              Browse our verified research data for 40 privacy projects, including detailed information
              that goes beyond basic descriptions.
            </p>
            <div className="flex gap-4">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#000] bg-[#94e2d5] rounded-lg hover:bg-[#74c7ba] transition-colors"
              >
                Search Projects
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#e0e0e0] bg-[#111] border border-[#252525] rounded-lg hover:border-[#89b4fa] transition-colors"
              >
                View Graph
              </Link>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
