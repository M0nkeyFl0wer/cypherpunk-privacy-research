import Link from 'next/link';

export default function LessonsPage() {
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
        <h1 className="text-4xl md:text-5xl font-bold text-[#e0e0e0] mb-6">
          Lessons Learned
        </h1>
        <p className="text-xl text-[#6c7086] mb-12">
          How a well-intentioned PR almost damaged the Web3Privacy Explorer, and what we learned.
        </p>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-6">The Timeline</h2>
          <div className="space-y-6">
            <div className="relative pl-8 border-l-2 border-[#94e2d5]/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#94e2d5]"></div>
              <div className="text-sm text-[#94e2d5] font-mono mb-1">December 2024</div>
              <h3 className="text-lg font-semibold text-[#e0e0e0]">Research Project Begins</h3>
              <p className="text-[#6c7086] mt-1">
                Started building a comprehensive privacy project research database with verified data,
                team information, contract addresses, milestones, and metrics.
              </p>
            </div>

            <div className="relative pl-8 border-l-2 border-[#89b4fa]/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#89b4fa]"></div>
              <div className="text-sm text-[#89b4fa] font-mono mb-1">January 2025</div>
              <h3 className="text-lg font-semibold text-[#e0e0e0]">PR #1997 Submitted</h3>
              <p className="text-[#6c7086] mt-1">
                Submitted a pull request to web3privacy/explorer-data with research data for 129 projects.
                The intention was to add new projects with verified research.
              </p>
            </div>

            <div className="relative pl-8 border-l-2 border-[#f38ba8]/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#f38ba8]"></div>
              <div className="text-sm text-[#f38ba8] font-mono mb-1">The Problem</div>
              <h3 className="text-lg font-semibold text-[#f38ba8]">Data Corruption Discovered</h3>
              <p className="text-[#6c7086] mt-1">
                The PR accidentally overwrote existing high-quality project data with template/placeholder
                data. Projects like Zcash lost their carefully curated descriptions.
              </p>
            </div>

            <div className="relative pl-8 border-l-2 border-[#f9e2af]/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#f9e2af]"></div>
              <div className="text-sm text-[#f9e2af] font-mono mb-1">Community Response</div>
              <h3 className="text-lg font-semibold text-[#f9e2af]">Called Out by Zcash Developer</h3>
              <p className="text-[#6c7086] mt-1">
                A community developer reviewed the PR and pointed out the damage. This was a valuable
                catch that prevented the bad data from being merged.
              </p>
              <div className="mt-3 p-4 bg-[#f9e2af]/10 rounded border-l-4 border-[#f9e2af]">
                <p className="text-sm text-[#a6adc8] italic">
                  &quot;This PR would overwrite our carefully maintained project descriptions with
                  template text. Please review the diff carefully.&quot;
                </p>
                <p className="text-xs text-[#6c7086] mt-2">- Community feedback on PR #1997</p>
              </div>
            </div>

            <div className="relative pl-8 border-l-2 border-[#a6e3a1]/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-[#a6e3a1]"></div>
              <div className="text-sm text-[#a6e3a1] font-mono mb-1">Resolution</div>
              <h3 className="text-lg font-semibold text-[#a6e3a1]">PR #2060 - Corrected Submission</h3>
              <p className="text-[#6c7086] mt-1">
                Created a new PR with properly validated data. This research site was built to
                demonstrate the full depth of our research methodology.
              </p>
            </div>
          </div>
        </section>

        {/* What Went Wrong */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#f38ba8]/20 flex items-center justify-center text-[#f38ba8]">!</span>
            What Went Wrong
          </h2>
          <div className="bg-[#f38ba8]/10 rounded-xl p-6 border border-[#f38ba8]/30">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-[#f38ba8] font-bold">1.</span>
                <div>
                  <strong className="text-[#e0e0e0]">Bulk Submission</strong>
                  <p className="text-[#6c7086] text-sm">129 projects in one PR made thorough review impossible</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#f38ba8] font-bold">2.</span>
                <div>
                  <strong className="text-[#e0e0e0]">Mixed Data Quality</strong>
                  <p className="text-[#6c7086] text-sm">Verified research was mixed with empty templates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#f38ba8] font-bold">3.</span>
                <div>
                  <strong className="text-[#e0e0e0]">No Staging Environment</strong>
                  <p className="text-[#6c7086] text-sm">No way to preview changes before submitting</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#f38ba8] font-bold">4.</span>
                <div>
                  <strong className="text-[#e0e0e0]">Schema Mismatch</strong>
                  <p className="text-[#6c7086] text-sm">Deep research had no place in the limited explorer schema</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#f38ba8] font-bold">5.</span>
                <div>
                  <strong className="text-[#e0e0e0]">Time Pressure</strong>
                  <p className="text-[#6c7086] text-sm">Rushed to submit without proper validation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">The Do&apos;s and Don&apos;ts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Do's */}
            <div className="bg-[#a6e3a1]/10 rounded-xl p-6 border border-[#a6e3a1]/30">
              <h3 className="text-lg font-bold text-[#a6e3a1] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Do
              </h3>
              <ul className="space-y-3 text-sm text-[#a6adc8]">
                <li className="flex items-start gap-2">
                  <span className="text-[#a6e3a1] mt-1">•</span>
                  Review every file in a PR diff, especially modified files
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#a6e3a1] mt-1">•</span>
                  Test on a staging environment first
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#a6e3a1] mt-1">•</span>
                  Add only NEW projects, never modify existing without explicit intent
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#a6e3a1] mt-1">•</span>
                  Submit small, focused PRs (10-20 projects max)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#a6e3a1] mt-1">•</span>
                  Document research methodology and sources
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#a6e3a1] mt-1">•</span>
                  Use <code className="text-[#a6e3a1] bg-[#a6e3a1]/20 px-1 rounded">git diff --name-status</code> to verify changes
                </li>
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-[#f38ba8]/10 rounded-xl p-6 border border-[#f38ba8]/30">
              <h3 className="text-lg font-bold text-[#f38ba8] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Don&apos;t
              </h3>
              <ul className="space-y-3 text-sm text-[#a6adc8]">
                <li className="flex items-start gap-2">
                  <span className="text-[#f38ba8] mt-1">•</span>
                  Submit large PRs without thorough review
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f38ba8] mt-1">•</span>
                  Mix template/placeholder data with real data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f38ba8] mt-1">•</span>
                  Assume AI-generated content is accurate
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f38ba8] mt-1">•</span>
                  Ignore community feedback
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f38ba8] mt-1">•</span>
                  Rush contributions to meet arbitrary deadlines
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f38ba8] mt-1">•</span>
                  Overwrite existing data without reading it first
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#89b4fa]/20 flex items-center justify-center text-[#89b4fa]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
            Key Takeaways
          </h2>
          <div className="bg-[#111] rounded-xl p-6 border border-[#252525]">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-[#94e2d5] mb-2">Constitutional Research Works</h4>
                <p className="text-sm text-[#6c7086]">
                  Verified data with sources is defensible. Confidence scores help prioritize.
                  When our methodology was questioned, we could point to evidence.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-[#94e2d5] mb-2">Schema Limitations Are Real</h4>
                <p className="text-sm text-[#6c7086]">
                  The explorer schema is minimal by design. Deep research needs separate hosting.
                  This site exists because our research didn&apos;t fit their format.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-[#94e2d5] mb-2">Community Feedback Is Valuable</h4>
                <p className="text-sm text-[#6c7086]">
                  Maintainers catch things you miss. Public review improves quality.
                  The Zcash developer&apos;s feedback saved us from a bigger mistake.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-[#94e2d5] mb-2">Partial Data Is Okay</h4>
                <p className="text-sm text-[#6c7086]">
                  Better to have 40 high-quality entries than 129 mixed-quality ones.
                  Mark incomplete research clearly. Don&apos;t pad with fabricated data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Site Exists */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Why This Site Exists</h2>
          <div className="bg-[#94e2d5]/10 rounded-xl p-6 border border-[#94e2d5]/30">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#94e2d5]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#94e2d5] font-bold">1</span>
                </div>
                <div>
                  <strong className="text-[#e0e0e0]">Extended Data Demonstration</strong>
                  <p className="text-[#6c7086] text-sm mt-1">
                    Shows the full depth of research that the explorer schema cannot accommodate.
                    Contracts, milestones, metrics, and OSINT findings all live here.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#94e2d5]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#94e2d5] font-bold">2</span>
                </div>
                <div>
                  <strong className="text-[#e0e0e0]">Schema Extension Proposal</strong>
                  <p className="text-[#6c7086] text-sm mt-1">
                    Demonstrates the value of adding fields like contracts, milestones, and metrics
                    to the explorer schema.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#94e2d5]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#94e2d5] font-bold">3</span>
                </div>
                <div>
                  <strong className="text-[#e0e0e0]">Transparency</strong>
                  <p className="text-[#6c7086] text-sm mt-1">
                    This page acknowledges the mistake and documents what we learned.
                    Open source is about learning in public.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#94e2d5]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#94e2d5] font-bold">4</span>
                </div>
                <div>
                  <strong className="text-[#e0e0e0]">Research Archive</strong>
                  <p className="text-[#6c7086] text-sm mt-1">
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
          <h2 className="text-2xl font-bold text-[#e0e0e0] mb-4">Related GitHub Issues</h2>
          <div className="bg-[#111] rounded-xl p-6 border border-[#252525]">
            <div className="space-y-4">
              <a
                href="https://github.com/web3privacy/explorer-data/issues/1947"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] transition-colors"
              >
                <div className="text-[#89b4fa] font-medium">#1947 - LLM data crawler</div>
                <p className="text-sm text-[#6c7086] mt-1">Discusses automated research tooling</p>
              </a>
              <a
                href="https://github.com/web3privacy/explorer-data/issues/1940"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] transition-colors"
              >
                <div className="text-[#89b4fa] font-medium">#1940 - Add TVL for privacy projects</div>
                <p className="text-sm text-[#6c7086] mt-1">Proposes adding metrics fields to the schema</p>
              </a>
              <a
                href="https://github.com/web3privacy/explorer-data/issues/1939"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] transition-colors"
              >
                <div className="text-[#89b4fa] font-medium">#1939 - Add TVL for individual projects</div>
                <p className="text-sm text-[#6c7086] mt-1">Related discussion on project-level metrics</p>
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 border-t border-[#252525]">
          <p className="text-[#6c7086] mb-6">
            Ready to explore our verified research?
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/projects"
              className="bg-[#94e2d5] hover:bg-[#74c7ba] text-[#000] px-6 py-3 rounded-lg font-medium transition-colors"
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
