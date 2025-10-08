'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { searchProjects } from '@/lib/search/search';
import type { SearchableProject } from '@/lib/data/schema';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelect?: (project: SearchableProject) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  onSelect,
  placeholder = 'Search Web3 privacy projects...',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchableProject[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function (300ms)
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchProjects(searchQuery);
        setSuggestions(results.slice(0, 5)); // Top 5 matches
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    debouncedSearch(value);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (project: SearchableProject) => {
    setQuery(project.name);
    setShowSuggestions(false);
    if (onSelect) {
      onSelect(project);
    } else {
      onSearch(project.name);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight matching text in suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-indigo-100 text-indigo-900 font-semibold">
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            aria-label="Search projects"
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={showSuggestions}
            aria-activedescendant={
              selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
            }
          />

          {/* Search icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" aria-label="Loading"></div>
            </div>
          )}
        </div>

        {/* Autocomplete suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            id="search-suggestions"
            role="listbox"
            className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          >
            {suggestions.map((project, index) => (
              <li
                key={project.id}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                  index === selectedIndex
                    ? 'bg-indigo-50 text-indigo-900'
                    : 'hover:bg-gray-50'
                } ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
                onClick={() => handleSelectSuggestion(project)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {highlightMatch(project.name, query)}
                    </div>
                    {project.excerpt && (
                      <div className="mt-1 text-xs text-gray-600 line-clamp-2">
                        {highlightMatch(project.excerpt, query)}
                      </div>
                    )}
                  </div>

                  {/* Confidence badge */}
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        project.confidence >= 0.8
                          ? 'bg-green-100 text-green-800'
                          : project.confidence >= 0.5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                      aria-label={`Confidence: ${(project.confidence * 100).toFixed(0)}%`}
                    >
                      {(project.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isLoading && 'Searching...'}
        {!isLoading && showSuggestions && suggestions.length > 0 &&
          `${suggestions.length} ${suggestions.length === 1 ? 'result' : 'results'} found`}
        {!isLoading && query.trim().length >= 2 && suggestions.length === 0 &&
          'No results found'}
      </div>
    </div>
  );
}
