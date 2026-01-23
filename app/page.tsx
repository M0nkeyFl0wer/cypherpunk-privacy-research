import Link from 'next/link';
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
          <div className="flex gap-4 text-sm">
            <Link href="/methodology" className="text-[#6c7086] hover:text-[#94e2d5]">methodology</Link>
            <Link href="/how-it-works" className="text-[#6c7086] hover:text-[#94e2d5]">how it works</Link>
            <Link href="/ecosystem" className="text-[#6c7086] hover:text-[#94e2d5]">full graph</Link>
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <HomepageGraph />
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-[#252525]">
        <div className="flex items-center justify-between text-xs text-[#6c7086]">
          <span>community research</span>
          <a href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research"
             target="_blank" rel="noopener noreferrer" className="hover:text-[#94e2d5]">source</a>
        </div>
      </footer>
    </main>
  );
}
