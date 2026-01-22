'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import to avoid SSR issues with D3
const PrivacyTechGraph = dynamic(
  () => import('@/components/Visualizations/PrivacyTechGraph'),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-[600px] bg-[#0a0a0a] rounded-lg">
      <div className="animate-spin w-8 h-8 border-2 border-[#94e2d5] border-t-transparent rounded-full"></div>
    </div>
  )}
);

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#cdd6f4]">
      {/* Header */}
      <header className="border-b border-[#252525] py-6">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="text-[#94e2d5] hover:underline text-sm mb-4 inline-block">
            &larr; Back to Research
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Technology Ecosystem</h1>
          <p className="text-[#a6adc8]">
            Explore relationships between 48 privacy projects based on shared cryptographic technologies.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Graph */}
        <div className="bg-[#0f0f0f] border border-[#252525] rounded-lg p-4">
          <PrivacyTechGraph width={1200} height={700} />
        </div>

        {/* Legend explanation */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] border border-[#252525] rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Node Colors</h3>
            <p className="text-sm text-[#888]">
              Each project is colored by its primary privacy technology. Click the legend
              items above to highlight all projects using that technology.
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#252525] rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Connections</h3>
            <p className="text-sm text-[#888]">
              Lines show "shared-tech" relationships - projects using the same cryptographic
              approach. Click any project to reveal its connections.
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#252525] rounded-lg p-4">
            <h3 className="font-semibold text-white mb-2">Interaction</h3>
            <p className="text-sm text-[#888]">
              <strong>Click</strong> to expand connections. <strong>Double-click</strong> for
              project details. <strong>Drag</strong> nodes to rearrange. <strong>Scroll</strong> to zoom.
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/how-it-works"
            className="px-4 py-2 bg-[#1a1a1a] border border-[#252525] rounded-lg text-sm text-[#94e2d5] hover:bg-[#252525] transition-colors"
          >
            How Privacy Tech Works &rarr;
          </Link>
          <Link
            href="/constitution"
            className="px-4 py-2 bg-[#1a1a1a] border border-[#252525] rounded-lg text-sm text-[#a6adc8] hover:bg-[#252525] transition-colors"
          >
            Research Methodology &rarr;
          </Link>
          <Link
            href="/projects"
            className="px-4 py-2 bg-[#1a1a1a] border border-[#252525] rounded-lg text-sm text-[#a6adc8] hover:bg-[#252525] transition-colors"
          >
            All Projects &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
