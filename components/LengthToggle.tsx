'use client';

export type LengthMode = 'summary' | 'full';

interface LengthToggleProps {
  mode: LengthMode;
  onChange: (mode: LengthMode) => void;
  className?: string;
}

const MODE_LABELS: Record<LengthMode, string> = {
  summary: 'Summary',
  full: 'Full',
};

export function LengthToggle({ mode, onChange, className = '' }: LengthToggleProps) {
  const modes: LengthMode[] = ['summary', 'full'];

  return (
    <div className={`inline-flex gap-1 p-1 bg-[#111] rounded-lg border border-[#252525] ${className}`}>
      {modes.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            mode === m
              ? 'bg-[#1a1a1a] text-[#e0e0e0] border border-[#94e2d5]'
              : 'text-[#6c7086] hover:text-[#e0e0e0] border border-transparent'
          }`}
          aria-pressed={mode === m}
        >
          {MODE_LABELS[m]}
        </button>
      ))}
    </div>
  );
}
