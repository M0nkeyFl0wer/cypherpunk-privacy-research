'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelect?: (project: any) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full px-5 py-4 pl-12 bg-brand-bg-active border border-brand-bg-hover rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent-purple"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </form>
  );
}
