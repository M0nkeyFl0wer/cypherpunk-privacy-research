interface QuickActionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export default function QuickActions({ suggestions, onSelect }: QuickActionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-brand-text-primary">💡 Quick Questions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="text-left p-4 rounded-lg bg-brand-bg-darker border border-brand-bg-active
                     hover:border-brand-accent-purple hover:bg-brand-bg-active
                     transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent-purple/10
                            group-hover:bg-brand-accent-purple/20 flex items-center justify-center
                            transition-colors">
                <svg className="w-4 h-4 text-brand-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <p className="text-sm text-brand-text-secondary group-hover:text-brand-text-primary
                          transition-colors flex-1">
                {suggestion}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
