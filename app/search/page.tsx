'use client';

import { useState, useEffect, useCallback } from 'react';
import SearchBar from '@/components/Search/SearchBar';
import SearchResults from '@/components/Search/SearchResults';
import SearchFilters from '@/components/Search/SearchFilters';
import { searchProjects, getFilterOptions } from '@/lib/search/search';
import type { SearchFilters as Filters, SearchableProject } from '@/lib/data/schema';
import type { SearchResult } from '@/lib/search/search';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    tech_stacks: [],
    privacy_techniques: [],
    platforms: [],
    status: [],
  });
  const [availableFilters, setAvailableFilters] = useState({
    categories: [] as string[],
    tech_stacks: [] as string[],
    privacy_techniques: [] as string[],
    platforms: [] as string[],
  });

  // Load available filter options on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const options = await getFilterOptions();
        setAvailableFilters(options);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };

    loadFilters();
  }, []);

  // Perform search whenever query or filters change
  const performSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const searchResults = await searchProjects(query, filters);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters]);

  // Trigger search on query/filter change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [performSearch]);

  // Handle search from SearchBar
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  // Handle project selection from SearchBar autocomplete
  const handleSelectProject = (project: SearchableProject) => {
    // Navigate to project detail page
    window.location.href = `/project/${project.id}`;
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-[#000]">
      {/* Header - Web3Privacy Now Branded */}
      <header className="bg-[#111] border-b border-[#252525] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#e0e0e0] flex items-center gap-3">
                <img src="/brand/logo-white.svg" alt="Web3Privacy Now" className="h-10 w-auto" />
                Web3 Privacy Projects
              </h1>
              <p className="mt-1 text-sm text-[#a6adc8]">
                Comprehensive research on Ethereum-based privacy technologies
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-4">
              <a
                href="/"
                className="text-sm font-medium text-[#a6adc8] hover:text-[#89b4fa] transition-colors"
              >
                Home
              </a>
              <a
                href="/portal"
                className="text-sm font-medium text-[#a6adc8] hover:text-[#94e2d5] transition-colors"
              >
                Graph Explorer
              </a>
              <a
                href="/methodology"
                className="text-sm font-medium text-[#a6adc8] hover:text-[#a6e3a1] transition-colors"
              >
                Methodology
              </a>
            </nav>
          </div>

          {/* Search bar */}
          <SearchBar
            onSearch={handleSearch}
            onSelect={handleSelectProject}
            placeholder="Search projects by name, technology, privacy technique..."
          />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters sidebar */}
          <aside className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              availableFilters={availableFilters}
              className="sticky top-32"
            />
          </aside>

          {/* Search results */}
          <div className="lg:col-span-3 mt-6 lg:mt-0">
            <SearchResults
              results={results}
              query={query}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Footer - Web3Privacy Now Branded */}
      <footer className="bg-[#111] border-t border-[#252525] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#6c7086]">
              © 2025 Web3Privacy Now Research. All data verified per constitutional requirements.
            </p>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#a6adc8] hover:text-[#89b4fa] transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                GitHub Repository
              </a>

              <a
                href="/feedback"
                className="text-sm text-[#a6adc8] hover:text-[#a6e3a1] transition-colors"
              >
                Submit Feedback
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
