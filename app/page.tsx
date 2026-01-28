import { HomepageGraph } from '@/components/HomepageGraph';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#000]">
      {/* Header */}
      <div className="border-b border-[#252525]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-[#e0e0e0] mb-2">
            Cypherpunk toolkit research
            <span className="text-[#6c7086] text-sm font-normal ml-3">wip</span>
          </h1>
        </div>
      </div>

      {/* Graph */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <HomepageGraph />
      </div>

      {/* How it works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-8 border-t border-[#252525]">
        <h2 className="text-lg font-medium text-[#e0e0e0] mb-4">How it works</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-[#111] rounded-lg p-4 border border-[#252525]">
            <div className="text-[#94e2d5] font-medium mb-1">Click to explore</div>
            <p className="text-[#6c7086]">Click any project node to view detailed research, team info, and security analysis.</p>
          </div>
          <div className="bg-[#111] rounded-lg p-4 border border-[#252525]">
            <div className="text-[#89b4fa] font-medium mb-1">Connections</div>
            <p className="text-[#6c7086]">Hover nodes to see relationships. Projects connect via shared tech, chains, and categories.</p>
          </div>
          <div className="bg-[#111] rounded-lg p-4 border border-[#252525]">
            <div className="text-[#a6e3a1] font-medium mb-1">Verified research</div>
            <p className="text-[#6c7086]">49 projects with multi-source verification. No fabricated data, honest gap reporting.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-[#252525]">
        <p className="text-sm text-[#a6adc8] mb-4">
          An independent open research project for cypherpunk tools. A contribution to the <a href="https://web3privacy.info" target="_blank" rel="noopener noreferrer" className="text-[#94e2d5] hover:underline">web3privacy</a> community.
        </p>
        <div className="flex items-center justify-between text-xs text-[#6c7086]">
          <a href="https://explorer.web3privacy.info" target="_blank" rel="noopener noreferrer" className="hover:text-[#94e2d5]">
            web3privacy explorer
          </a>
          <a href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research"
             target="_blank" rel="noopener noreferrer" className="hover:text-[#94e2d5]">source</a>
        </div>
      </footer>
    </main>
  );
}
