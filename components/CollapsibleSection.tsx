'use client';

import { useState, ReactNode } from 'react';
import { LengthToggle, LengthMode } from './LengthToggle';

interface CollapsibleSectionProps {
  title: string;
  summary: ReactNode;
  full: ReactNode;
  defaultMode?: LengthMode;
  className?: string;
  titleClassName?: string;
}

export function CollapsibleSection({
  title,
  summary,
  full,
  defaultMode = 'summary',
  className = '',
  titleClassName = '',
}: CollapsibleSectionProps) {
  const [mode, setMode] = useState<LengthMode>(defaultMode);

  const content = mode === 'full' ? full : summary;

  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className={`text-xl font-semibold text-[#e0e0e0] ${titleClassName}`}>
          {title}
        </h2>
        <LengthToggle mode={mode} onChange={setMode} />
      </div>

      <div className="transition-all duration-300 ease-in-out">
        {content}
      </div>
    </section>
  );
}
