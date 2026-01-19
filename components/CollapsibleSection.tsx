'use client';

import { useState, ReactNode } from 'react';
import { LengthToggle, LengthMode } from './LengthToggle';

interface CollapsibleSectionProps {
  title: string;
  brief: ReactNode;
  full: ReactNode;
  extended?: ReactNode;
  defaultMode?: LengthMode;
  className?: string;
  titleClassName?: string;
}

export function CollapsibleSection({
  title,
  brief,
  full,
  extended,
  defaultMode = 'brief',
  className = '',
  titleClassName = '',
}: CollapsibleSectionProps) {
  const [mode, setMode] = useState<LengthMode>(defaultMode);

  // If no extended content, fall back to full
  const content = mode === 'extended' && !extended ? full :
                  mode === 'full' ? full :
                  mode === 'brief' ? brief : extended;

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
