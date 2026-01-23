'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import for the new PrivacyTechGraph
const PrivacyTechGraph = dynamic(
  () => import('@/components/Visualizations/PrivacyTechGraph'),
  { ssr: false, loading: () => <div className="h-[600px] bg-[#0a0a0a] rounded-lg animate-pulse" /> }
);

export function HomepageGraph() {
  const [showGraph, setShowGraph] = useState(true);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-[#6c7086] uppercase tracking-wider">
          Privacy Technology Ecosystem
        </h2>
        <button
          onClick={() => setShowGraph(!showGraph)}
          className="text-xs text-[#6c7086] hover:text-[#94e2d5] transition-colors"
        >
          {showGraph ? 'hide graph' : 'show graph'}
        </button>
      </div>

      {/* Interactive Graph - now using the new PrivacyTechGraph with search built in */}
      {showGraph && (
        <div className="rounded-lg overflow-hidden">
          <PrivacyTechGraph width={800} height={550} />
        </div>
      )}
    </div>
  );
}
