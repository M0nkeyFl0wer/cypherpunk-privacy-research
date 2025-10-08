'use client';

interface QuickActionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export default function QuickActions({ suggestions, onSelect }: QuickActionsProps) {
  return (
    <div className="bg-brand-bg-darker border border-brand-bg-active rounded-lg p-6">
      <h3 className="text-sm font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-brand-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="text-left px-4 py-3 bg-brand-bg-dark border border-brand-bg-active text-brand-text-secondary text-sm rounded-lg hover:border-brand-accent-purple hover:text-brand-text-primary transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
