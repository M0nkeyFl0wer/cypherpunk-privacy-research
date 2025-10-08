import Link from 'react-markdown';

interface SearchResultsProps {
  results: any[];
  query: string;
  isLoading?: boolean;
}

export default function SearchResults({ results, query, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-brand-accent-purple border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-brand-text-secondary">Searching...</p>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-brand-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-brand-text-secondary">No projects found matching "{query}"</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-brand-text-secondary">
        Found {results.length} project{results.length !== 1 ? 's' : ''}
        {query && ` matching "${query}"`}
      </p>

      <div className="grid gap-4">
        {results.map((result: any) => (
          <a
            key={result.slug}
            href={`/project/${result.slug}`}
            className="block p-6 bg-brand-bg-darker border border-brand-bg-active rounded-lg hover:border-brand-accent-purple transition-colors"
          >
            <h3 className="text-xl font-semibold text-brand-text-primary mb-2">{result.name}</h3>
            <p className="text-brand-text-secondary text-sm mb-3">{result.description}</p>
            <div className="flex flex-wrap gap-2">
              {result.category && (
                <span className="px-2 py-1 text-xs rounded bg-brand-accent-purple/20 text-brand-accent-purple">
                  {result.category}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
