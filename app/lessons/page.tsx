import Link from 'next/link';

export default function LessonsPage() {
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
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 mb-6">
          Lessons Learned
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          How a well-intentioned PR almost damaged the Web3Privacy Explorer, and what we learned.
        </p>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">The Timeline</h2>
          <div className="space-y-6">
            <div className="relative pl-8 border-l-2 border-purple-500/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-500"></div>
              <div className="text-sm text-purple-400 font-mono mb-1">December 2024</div>
              <h3 className="text-lg font-semibold text-white">Research Project Begins</h3>
              <p className="text-gray-400 mt-1">
                Started building a comprehensive privacy project research database with verified data,
                team information, contract addresses, milestones, and metrics.
              </p>
            </div>

            <div className="relative pl-8 border-l-2 border-blue-500/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
              <div className="text-sm text-blue-400 font-mono mb-1">January 2025</div>
              <h3 className="text-lg font-semibold text-white">PR #1997 Submitted</h3>
              <p className="text-gray-400 mt-1">
                Submitted a pull request to web3privacy/explorer-data with research data for 129 projects.
                The intention was to add new projects with verified research.
              </p>
            </div>

            <div className="relative pl-8 border-l-2 border-red-500/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-red-500"></div>
              <div className="text-sm text-red-400 font-mono mb-1">The Problem</div>
              <h3 className="text-lg font-semibold text-red-400">Data Corruption Discovered</h3>
              <p className="text-gray-400 mt-1">
                The PR accidentally overwrote existing high-quality project data with template/placeholder
                data. Projects like Zcash lost their carefully curated descriptions.
              </p>
            </div>

            <div className="relative pl-8 border-l-2 border-yellow-500/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-yellow-500"></div>
              <div className="text-sm text-yellow-400 font-mono mb-1">Community Response</div>
              <h3 className="text-lg font-semibold text-yellow-400">Called Out by Zcash Developer</h3>
              <p className="text-gray-400 mt-1">
                A community developer reviewed the PR and pointed out the damage. This was a valuable
                catch that prevented the bad data from being merged.
              </p>
              <div className="mt-3 p-4 bg-yellow-900/20 rounded border-l-4 border-yellow-400">
                <p className="text-sm text-gray-300 italic">
                  &quot;This PR would overwrite our carefully maintained project descriptions with
                  template text. Please review the diff carefully.&quot;
                </p>
                <p className="text-xs text-gray-500 mt-2">- Community feedback on PR #1997</p>
              </div>
            </div>

            <div className="relative pl-8 border-l-2 border-green-500/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500"></div>
              <div className="text-sm text-green-400 font-mono mb-1">Resolution</div>
              <h3 className="text-lg font-semibold text-green-400">PR #2060 - Corrected Submission</h3>
              <p className="text-gray-400 mt-1">
                Created a new PR with properly validated data. This research site was built to
                demonstrate the full depth of our research methodology.
              </p>
            </div>
          </div>
        </section>

        {/* What Went Wrong */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">!</span>
            What Went Wrong
          </h2>
          <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold">1.</span>
                <div>
                  <strong className="text-white">Bulk Submission</strong>
                  <p className="text-gray-400 text-sm">129 projects in one PR made thorough review impossible</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold">2.</span>
                <div>
                  <strong className="text-white">Mixed Data Quality</strong>
                  <p className="text-gray-400 text-sm">Verified research was mixed with empty templates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold">3.</span>
                <div>
                  <strong className="text-white">No Staging Environment</strong>
                  <p className="text-gray-400 text-sm">No way to preview changes before submitting</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold">4.</span>
                <div>
                  <strong className="text-white">Schema Mismatch</strong>
                  <p className="text-gray-400 text-sm">Deep research had no place in the limited explorer schema</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold">5.</span>
                <div>
                  <strong className="text-white">Time Pressure</strong>
                  <p className="text-gray-400 text-sm">Rushed to submit without proper validation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">The Do&apos;s and Don&apos;ts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Do's */}
            <div className="bg-green-900/20 rounded-xl p-6 border border-green-500/30">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Do
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  Review every file in a PR diff, especially modified files
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  Test on a staging environment first
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  Add only NEW projects, never modify existing without explicit intent
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  Submit small, focused PRs (10-20 projects max)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  Document research methodology and sources
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  Use <code className="text-green-300 bg-green-900/30 px-1 rounded">git diff --name-status</code> to verify changes
                </li>
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
              <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Don&apos;t
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Submit large PRs without thorough review
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Mix template/placeholder data with real data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Assume AI-generated content is accurate
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Ignore community feedback
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Rush contributions to meet arbitrary deadlines
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Overwrite existing data without reading it first
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
            Key Takeaways
          </h2>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Constitutional Research Works</h4>
                <p className="text-sm text-gray-400">
                  Verified data with sources is defensible. Confidence scores help prioritize.
                  When our methodology was questioned, we could point to evidence.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Schema Limitations Are Real</h4>
                <p className="text-sm text-gray-400">
                  The explorer schema is minimal by design. Deep research needs separate hosting.
                  This site exists because our research didn&apos;t fit their format.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Community Feedback Is Valuable</h4>
                <p className="text-sm text-gray-400">
                  Maintainers catch things you miss. Public review improves quality.
                  The Zcash developer&apos;s feedback saved us from a bigger mistake.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Partial Data Is Okay</h4>
                <p className="text-sm text-gray-400">
                  Better to have 40 high-quality entries than 129 mixed-quality ones.
                  Mark incomplete research clearly. Don&apos;t pad with fabricated data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Site Exists */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Why This Site Exists</h2>
          <div className="bg-purple-900/20 rounded-xl p-6 border border-purple-500/30">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">1</span>
                </div>
                <div>
                  <strong className="text-white">Extended Data Demonstration</strong>
                  <p className="text-gray-400 text-sm mt-1">
                    Shows the full depth of research that the explorer schema cannot accommodate.
                    Contracts, milestones, metrics, and OSINT findings all live here.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <div>
                  <strong className="text-white">Schema Extension Proposal</strong>
                  <p className="text-gray-400 text-sm mt-1">
                    Demonstrates the value of adding fields like contracts, milestones, and metrics
                    to the explorer schema.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <strong className="text-white">Transparency</strong>
                  <p className="text-gray-400 text-sm mt-1">
                    This page acknowledges the mistake and documents what we learned.
                    Open source is about learning in public.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">4</span>
                </div>
                <div>
                  <strong className="text-white">Research Archive</strong>
                  <p className="text-gray-400 text-sm mt-1">
                    Preserves 40 verified project research files with confidence scores,
                    sources, and detailed analysis that took months to compile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related GitHub Issues */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Related GitHub Issues</h2>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <div className="space-y-4">
              <a
                href="https://github.com/web3privacy/explorer-data/issues/1947"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
              >
                <div className="text-blue-400 font-medium">#1947 - LLM data crawler</div>
                <p className="text-sm text-gray-400 mt-1">Discusses automated research tooling</p>
              </a>
              <a
                href="https://github.com/web3privacy/explorer-data/issues/1940"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
              >
                <div className="text-blue-400 font-medium">#1940 - Add TVL for privacy projects</div>
                <p className="text-sm text-gray-400 mt-1">Proposes adding metrics fields to the schema</p>
              </a>
              <a
                href="https://github.com/web3privacy/explorer-data/issues/1939"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
              >
                <div className="text-blue-400 font-medium">#1939 - Add TVL for individual projects</div>
                <p className="text-sm text-gray-400 mt-1">Related discussion on project-level metrics</p>
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 border-t border-gray-700/50">
          <p className="text-gray-400 mb-6">
            Ready to explore our verified research?
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/projects"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Projects
            </Link>
            <Link
              href="/methodology"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/20"
            >
              Research Methodology
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
