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
        <div className="animate-spin w-12 h-12 border-4 border-[#94e2d5] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[#a6adc8]">Searching...</p>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-[#6c7086] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[#a6adc8]">No projects found matching "{query}"</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[#a6adc8]">
        Found {results.length} project{results.length !== 1 ? 's' : ''}
        {query && ` matching "${query}"`}
      </p>

      <div className="grid gap-4">
        {results.map((result: any) => (
          <a
            key={result.slug}
            href={`/project/${result.slug}`}
            className="block p-6 bg-[#111] border border-[#252525] rounded-lg hover:border-[#94e2d5] transition-colors"
          >
            <h3 className="text-xl font-semibold text-[#e0e0e0] mb-2">{result.name}</h3>
            <p className="text-[#a6adc8] text-sm mb-3">{result.description}</p>
            <div className="flex flex-wrap gap-2">
              {result.category && (
                <span className="px-2 py-1 text-xs rounded bg-[#94e2d5]/20 text-[#94e2d5]">
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
