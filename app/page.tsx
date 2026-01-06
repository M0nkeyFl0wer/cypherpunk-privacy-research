import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-8 py-24 text-center">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-6">
            Web3 Privacy Research
          </h1>
          <p className="text-3xl text-gray-300 mb-4">
            Ethereum Cypherpunks Edition
          </p>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Comprehensive verified research on 40 Web3 privacy projects with detailed data including
            team members, contracts, milestones, and metrics. Explore the full depth of privacy research.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/search"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              🔍 Search Projects
            </Link>
            <Link
              href="/visualizations"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all border border-white/20"
            >
              📊 View Visualizations
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 text-center">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">40</div>
            <div className="text-gray-400">Verified Projects</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 text-center">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">8</div>
            <div className="text-gray-400">With Team Data</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/30 text-center">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">5</div>
            <div className="text-gray-400">Ecosystems</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30 text-center">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-2">80%</div>
            <div className="text-gray-400">Avg Confidence</div>
          </div>
        </div>

        {/* Features Grid */}
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Explore the Research</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Search Card */}
          <Link
            href="/search"
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-purple-500/30 hover:border-purple-500 transition-all group hover:shadow-xl hover:shadow-purple-500/20"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
              Smart Search
            </h3>
            <p className="text-gray-400 mb-4">
              AI-powered search across all project data. Find projects by technology, category, or privacy technique.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• Search by tech stack (Rust, Arbitrum, etc.)</li>
              <li>• Filter by privacy technique</li>
              <li>• Bring your own Claude API key</li>
            </ul>
          </Link>

          {/* Visualizations Card */}
          <Link
            href="/visualizations"
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-blue-500/30 hover:border-blue-500 transition-all group hover:shadow-xl hover:shadow-blue-500/20"
          >
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
              Interactive Visualizations
            </h3>
            <p className="text-gray-400 mb-4">
              Explore projects through three interactive D3.js visualizations with rich tooltips.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• Network Graph - Project relationships</li>
              <li>• Treemap - Technology categories</li>
              <li>• Timeline - Development history</li>
            </ul>
          </Link>

          {/* Chat Card */}
          <Link
            href="/chat"
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-green-500/30 hover:border-green-500 transition-all group hover:shadow-xl hover:shadow-green-500/20"
          >
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
              AI Chat Assistant
            </h3>
            <p className="text-gray-400 mb-4">
              Ask questions about privacy projects and get AI-powered answers from research data.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• Natural language queries</li>
              <li>• Data retrieval only (no analysis)</li>
              <li>• Direct quotes and citations</li>
            </ul>
          </Link>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Feedback Card */}
          <Link
            href="/feedback"
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30 hover:border-pink-500 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                  Submit Feedback
                </h3>
                <p className="text-gray-400">
                  Help improve this research by submitting corrections, updates, or suggesting new projects.
                </p>
              </div>
            </div>
          </Link>

          {/* GitHub Card */}
          <a
            href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/30 hover:border-cyan-500 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">📁</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  View on GitHub
                </h3>
                <p className="text-gray-400">
                  Access all research data, project reports, and source code on GitHub.
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* Postmortem Section */}
        <div className="mb-16">
          <Link
            href="/postmortem"
            className="block bg-gradient-to-r from-yellow-900/30 to-orange-900/30 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-500 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">📋</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  Postmortem: Lessons Learned
                </h3>
                <p className="text-gray-400">
                  Read about the PR disaster that led to this research site - what went wrong with the web3privacy explorer contribution,
                  why the schema is limited, and how we&apos;re proposing to improve it.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-lg rounded-xl p-8 border border-purple-500/30 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Why This Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">✅</div>
              <h4 className="text-lg font-semibold text-white mb-2">100% Real Data</h4>
              <p className="text-sm text-gray-400">Zero synthetic data, placeholder text, or fabricated information</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="text-lg font-semibold text-white mb-2">Privacy Focused</h4>
              <p className="text-sm text-gray-400">Comprehensive analysis of Web3 privacy technologies and protocols</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📚</div>
              <h4 className="text-lg font-semibold text-white mb-2">Living Research</h4>
              <p className="text-sm text-gray-400">Actively maintained with community contributions and updates</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm space-y-2">
          <p>
            Research data updated October 2025 • Constitutional compliance enforced
          </p>
          <p>
            Powered by Next.js 14 • D3.js • Claude AI • Deployed on GitHub Pages
          </p>
        </div>
      </div>
    </main>
  );
}
