'use client';

import { useState, useEffect } from 'react';
import type { SearchFilters as Filters } from '@/lib/data/schema';

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  availableFilters: {
    categories: string[];
    tech_stacks: string[];
    privacy_techniques: string[];
    platforms: string[];
  };
  className?: string;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  availableFilters,
  className = '',
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.categories && filters.categories.length > 0) count += filters.categories.length;
    if (filters.tech_stacks && filters.tech_stacks.length > 0) count += filters.tech_stacks.length;
    if (filters.privacy_techniques && filters.privacy_techniques.length > 0)
      count += filters.privacy_techniques.length;
    if (filters.platforms && filters.platforms.length > 0) count += filters.platforms.length;
    if (filters.status && filters.status.length > 0) count += filters.status.length;
    setActiveFilterCount(count);
  }, [filters]);

  // Toggle category filter
  const toggleCategory = (category: string) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    onFiltersChange({ ...filters, categories: updated });
  };

  // Toggle tech stack filter
  const toggleTechStack = (tech: string) => {
    const current = filters.tech_stacks || [];
    const updated = current.includes(tech)
      ? current.filter(t => t !== tech)
      : [...current, tech];
    onFiltersChange({ ...filters, tech_stacks: updated });
  };

  // Toggle privacy technique filter
  const togglePrivacyTechnique = (technique: string) => {
    const current = filters.privacy_techniques || [];
    const updated = current.includes(technique)
      ? current.filter(t => t !== technique)
      : [...current, technique];
    onFiltersChange({ ...filters, privacy_techniques: updated });
  };

  // Toggle platform filter
  const togglePlatform = (platform: string) => {
    const current = filters.platforms || [];
    const updated = current.includes(platform)
      ? current.filter(p => p !== platform)
      : [...current, platform];
    onFiltersChange({ ...filters, platforms: updated });
  };

  // Toggle status filter
  const toggleStatus = (status: string) => {
    const current = filters.status || [];
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    onFiltersChange({ ...filters, status: updated });
  };

  // Clear all filters
  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      tech_stacks: [],
      privacy_techniques: [],
      platforms: [],
      status: [],
    });
  };

  // Filter section component
  const FilterSection = ({
    title,
    options,
    selected,
    onToggle,
  }: {
    title: string;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (options.length === 0) return null;

    return (
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left py-2"
          aria-expanded={isOpen}
        >
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
            {options.map(option => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => onToggle(option)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 flex-1">{option}</span>
                <span className="text-xs text-gray-500">
                  {/* Could show count here if we had it */}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-indigo-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filters panel */}
      <div
        className={`
          bg-white border border-gray-200 rounded-lg p-6 space-y-4
          ${isExpanded ? 'block' : 'hidden lg:block'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Filter sections */}
        <div className="space-y-4">
          <FilterSection
            title="Category"
            options={availableFilters.categories}
            selected={filters.categories || []}
            onToggle={toggleCategory}
          />

          <FilterSection
            title="Tech Stack"
            options={availableFilters.tech_stacks}
            selected={filters.tech_stacks || []}
            onToggle={toggleTechStack}
          />

          <FilterSection
            title="Privacy Techniques"
            options={availableFilters.privacy_techniques}
            selected={filters.privacy_techniques || []}
            onToggle={togglePrivacyTechnique}
          />

          <FilterSection
            title="Blockchain Platform"
            options={availableFilters.platforms}
            selected={filters.platforms || []}
            onToggle={togglePlatform}
          />

          <FilterSection
            title="Status"
            options={['active', 'inactive', 'in-development', 'mainnet', 'testnet', 'deprecated', 'unknown']}
            selected={filters.status || []}
            onToggle={toggleStatus}
          />
        </div>
      </div>

      {/* Active filters display (mobile) */}
      {activeFilterCount > 0 && (
        <div className="lg:hidden mt-4 flex flex-wrap gap-2">
          {(filters.categories || []).map(cat => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
            >
              {cat}
              <button
                onClick={() => toggleCategory(cat)}
                className="ml-1 hover:text-indigo-900"
                aria-label={`Remove ${cat} filter`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
          {(filters.tech_stacks || []).map(tech => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
            >
              {tech}
              <button
                onClick={() => toggleTechStack(tech)}
                className="ml-1 hover:text-green-900"
                aria-label={`Remove ${tech} filter`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
