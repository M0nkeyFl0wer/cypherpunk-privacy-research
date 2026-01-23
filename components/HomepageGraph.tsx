'use client';

import dynamic from 'next/dynamic';

// Dynamic import for the PrivacyTechGraph
const PrivacyTechGraph = dynamic(
  () => import('@/components/Visualizations/PrivacyTechGraph'),
  { ssr: false, loading: () => <div className="h-[550px] bg-[#0a0a0a] rounded-lg animate-pulse" /> }
);

export function HomepageGraph() {
  return (
    <div className="rounded-lg overflow-hidden">
      <PrivacyTechGraph width={900} height={550} />
    </div>
  );
}
