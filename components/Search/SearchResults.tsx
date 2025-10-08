'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { SearchableProject } from '@/lib/data/schema';

interface SearchResultsProps {
  results: SearchableProject[];
  query: string;
  isLoading?: boolean;
  className?: string;
}

const RESULTS_PER_PAGE = 12;

export default function SearchResults({
  results,
  query,
  isLoading = false,
  className = '',
}: SearchResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'relevance' | 'name' | 'confidence'>('relevance');

  // Sort results
  const sortedResults = useMemo(() => {
    const sorted = [...results];

    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'confidence':
        return sorted.sort((a, b) => b.confidence - a.confidence);
      case 'relevance':
      default:
        return sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
    }
  }, [results, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedResults.length / RESULTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const paginatedResults = sortedResults.slice(startIndex, endIndex);

  // Reset to page 1 when results change
  useMemo(() => {
    setCurrentPage(1);
  }, [results]);

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim() || !text) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 font-medium">
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // Get confidence badge color
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) {
      return { bg: 'bg-green-100', text: 'text-green-800', label: 'High' };
    } else if (confidence >= 0.5) {
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' };
    } else {
      return { bg: 'bg-red-100', text: 'text-red-800', label: 'Low' };
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-16 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Searching projects...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
        <p className="text-gray-600 mb-4">
          No results for &quot;{query}&quot;. Try different keywords or check filters.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Results header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="text-sm text-gray-700">
          Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
          <span className="font-semibold">{Math.min(endIndex, sortedResults.length)}</span> of{' '}
          <span className="font-semibold">{sortedResults.length}</span>{' '}
          {sortedResults.length === 1 ? 'result' : 'results'}
          {query && (
            <>
              {' '}for &quot;<span className="font-semibold">{query}</span>&quot;
            </>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-sm text-gray-700 font-medium">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="relevance">Relevance</option>
            <option value="name">Name (A-Z)</option>
            <option value="confidence">Confidence</option>
          </select>
        </div>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedResults.map(project => {
          const badge = getConfidenceBadge(project.confidence);

          return (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="group block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Project name */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {highlightMatch(project.name, query)}
                  </h3>

                  {/* Confidence badge */}
                  <span
                    className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                    aria-label={`Confidence: ${(project.confidence * 100).toFixed(0)}%`}
                    title={`Data confidence: ${badge.label}`}
                  >
                    {(project.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Project excerpt */}
                {project.excerpt && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {highlightMatch(project.excerpt, query)}
                  </p>
                )}

                {/* Project metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    {project.id}
                  </span>

                  <span className="text-indigo-600 group-hover:text-indigo-700 font-medium">
                    View details →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          {/* Previous button */}
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              // Show first, last, current, and adjacent pages
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              // Show ellipsis
              const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
              const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

              if (showEllipsisBefore || showEllipsisAfter) {
                return (
                  <span key={page} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }

              if (!showPage) return null;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Page {currentPage} of {totalPages}. Showing {paginatedResults.length}{' '}
        {paginatedResults.length === 1 ? 'result' : 'results'}.
      </div>
    </div>
  );
}
