import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-accent-purple to-brand-accent-blue py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h1 className="text-5xl font-bold text-white mb-6">
            Web3 Privacy Ethereum Cypherpunks Research
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl">
            Comprehensive research on 114 Web3 privacy projects with 100% real data and zero fabrication.
            Explore interactive visualizations, search through detailed research, and chat with AI about privacy technologies.
          </p>
          <div className="flex gap-4">
            <Link
              href="/visualizations"
              className="bg-white text-brand-accent-purple px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Visualizations
            </Link>
            <Link
              href="/search"
              className="bg-brand-accent-purple/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-accent-purple/30 transition-colors border border-white/20"
            >
              Search Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-brand-bg-darker rounded-lg p-6 border border-brand-border">
            <div className="text-4xl font-bold text-brand-accent-purple mb-2">114</div>
            <div className="text-brand-text-muted">Privacy Projects</div>
          </div>
          <div className="bg-brand-bg-darker rounded-lg p-6 border border-brand-border">
            <div className="text-4xl font-bold text-brand-accent-blue mb-2">85</div>
            <div className="text-brand-text-muted">Project Cards</div>
          </div>
          <div className="bg-brand-bg-darker rounded-lg p-6 border border-brand-border">
            <div className="text-4xl font-bold text-brand-accent-green mb-2">113</div>
            <div className="text-brand-text-muted">Full Reports</div>
          </div>
          <div className="bg-brand-bg-darker rounded-lg p-6 border border-brand-border">
            <div className="text-4xl font-bold text-brand-accent-purple mb-2">30%</div>
            <div className="text-brand-text-muted">Avg Completeness</div>
          </div>
        </div>

        {/* Features Section */}
        <h2 className="text-3xl font-bold text-brand-text mb-8">Explore the Research</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Visualizations Card */}
          <Link
            href="/visualizations"
            className="bg-brand-bg-darker rounded-lg p-6 border border-brand-border hover:border-brand-accent-purple transition-colors group"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-brand-text mb-3 group-hover:text-brand-accent-purple">
              Interactive Visualizations
            </h3>
            <p className="text-brand-text-muted mb-4">
              Explore projects through three interactive D3.js visualizations: Network Graph, Treemap, and Timeline.
            </p>
            <ul className="text-sm text-brand-text-muted space-y-1">
              <li>• Hover for rich project details</li>
              <li>• Click to navigate to full reports</li>
              <li>• Discover project relationships</li>
            </ul>
          </Link>

          {/* Search Card */}
          <Link
            href="/search"
            className="bg-brand-bg-darker rounded-lg p-6 border border-brand-border hover:border-brand-accent-blue transition-colors group"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-brand-text mb-3 group-hover:text-brand-accent-blue">
              Smart Search
            </h3>
            <p className="text-brand-text-muted mb-4">
              Search across 114 projects by name, category, technology stack, or privacy techniques.
            </p>
            <ul className="text-sm text-brand-text-muted space-y-1">
              <li>• Full-text search</li>
              <li>• Filter by category</li>
              <li>• Real-time results</li>
            </ul>
          </Link>

          {/* Chat Card */}
          <Link
            href="/chat"
            className="bg-brand-bg-darker rounded-lg p-6 border border-brand-border hover:border-brand-accent-green transition-colors group"
          >
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-brand-text mb-3 group-hover:text-brand-accent-green">
              AI Chat Interface
            </h3>
            <p className="text-brand-text-muted mb-4">
              Ask questions about Web3 privacy projects using your own Claude API key (BYOK).
            </p>
            <ul className="text-sm text-brand-text-muted space-y-1">
              <li>• Secure client-side processing</li>
              <li>• Your API key, your control</li>
              <li>• Context-aware responses</li>
            </ul>
          </Link>
        </div>

        {/* Research Quality Section */}
        <div className="bg-brand-accent-purple/10 rounded-lg p-8 border border-brand-accent-purple/20 mb-16">
          <h2 className="text-2xl font-bold text-brand-text mb-4">
            🎯 Research in Progress
          </h2>
          <p className="text-brand-text-muted mb-4">
            This is an active research project documenting Web3 privacy technologies. Data collection is ongoing:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-brand-text-muted">
            <li className="flex items-start">
              <span className="text-brand-accent-green mr-2">✓</span>
              114 privacy projects identified
            </li>
            <li className="flex items-start">
              <span className="text-brand-accent-yellow mr-2">⋯</span>
              Technical details being researched
            </li>
            <li className="flex items-start">
              <span className="text-brand-accent-green mr-2">✓</span>
              Only verified information included
            </li>
            <li className="flex items-start">
              <span className="text-brand-accent-yellow mr-2">⋯</span>
              Data updated as research progresses
            </li>
          </ul>
        </div>

        {/* Project Categories */}
        <h2 className="text-2xl font-bold text-brand-text mb-6">Project Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'DeFi', count: 12 },
            { name: 'Infrastructure', count: 8 },
            { name: 'Wallets', count: 10 },
            { name: 'Computing', count: 9 },
            { name: 'Messaging', count: 5 },
            { name: 'Layer 2', count: 7 },
            { name: 'Identity (DID)', count: 6 },
            { name: 'Other', count: 57 },
          ].map((cat) => (
            <div key={cat.name} className="bg-brand-bg-darker rounded-lg p-4 border border-brand-border">
              <div className="text-lg font-bold text-brand-text">{cat.name}</div>
              <div className="text-brand-text-muted">{cat.count} projects</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-brand-bg-darker border-t border-brand-border py-12">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-2xl font-bold text-brand-text mb-4">
            Start Exploring Privacy Projects
          </h2>
          <p className="text-brand-text-muted mb-6">
            Discover the landscape of Web3 privacy technologies through data-driven research.
          </p>
          <Link
            href="/visualizations"
            className="inline-block bg-brand-accent-purple text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-accent-purple-hover transition-colors"
          >
            View Visualizations →
          </Link>
        </div>
      </div>
    </main>
  );
}
