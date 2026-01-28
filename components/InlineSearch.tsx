'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSearchIndex } from '@/lib/search/buildSearchIndex';
import type { SearchItem } from '@/lib/search/searchTypes';

interface FuzzyMatch {
  item: SearchItem;
  score: number;
  highlightedName: string;
}

function fuzzyMatch(query: string, text: string): { score: number; highlighted: string } | null {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  if (!query) return { score: 1, highlighted: text };

  let queryIdx = 0;
  let score = 0;
  let highlighted = '';
  let lastMatchIdx = -1;

  for (let i = 0; i < text.length; i++) {
    if (queryIdx < queryLower.length && textLower[i] === queryLower[queryIdx]) {
      if (lastMatchIdx === i - 1) {
        score += 2;
      } else {
        score += 1;
      }
      if (i === 0 || text[i - 1] === ' ' || text[i - 1] === '-' || text[i - 1] === '_') {
        score += 3;
      }
      highlighted += `<mark class="bg-[#94e2d5]/30 text-[#94e2d5]">${text[i]}</mark>`;
      lastMatchIdx = i;
      queryIdx++;
    } else {
      highlighted += text[i];
    }
  }

  if (queryIdx !== queryLower.length) return null;
  score += Math.max(0, 10 - text.length / 5);
  return { score, highlighted };
}

interface InlineSearchProps {
  onHighlight?: (projectIds: string[]) => void;
}

export function InlineSearch({ onHighlight }: InlineSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load search index
  useEffect(() => {
    fetchSearchIndex().then(setItems);
  }, []);

  // Fuzzy search results
  const results: FuzzyMatch[] = (() => {
    if (!query.trim()) return [];

    const matches: FuzzyMatch[] = [];
    for (const item of items) {
      const nameMatch = fuzzyMatch(query, item.name);
      if (nameMatch) {
        matches.push({ item, score: nameMatch.score, highlightedName: nameMatch.highlighted });
        continue;
      }
      if (item.description) {
        const descMatch = fuzzyMatch(query, item.description);
        if (descMatch) {
          matches.push({ item, score: descMatch.score * 0.5, highlightedName: item.name });
        }
      }
    }
    return matches.sort((a, b) => b.score - a.score).slice(0, 8);
  })();

  // Highlight matching projects in graph
  useEffect(() => {
    if (onHighlight) {
      const projectIds = results
        .filter(r => r.item.type === 'project')
        .map(r => r.item.id);
      onHighlight(projectIds);
    }
  }, [results, onHighlight]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].item.url);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setQuery('');
        inputRef.current?.blur();
        break;
    }
  }, [results, selectedIndex, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const showResults = isFocused && query.trim() && results.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6c7086]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search projects, categories... (Cmd+K)"
          className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-[#252525] rounded-lg text-[#e0e0e0] placeholder-[#6c7086] focus:outline-none focus:border-[#94e2d5] text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7086] hover:text-[#e0e0e0]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#111] border border-[#252525] rounded-lg shadow-xl overflow-hidden z-50">
          {results.map((result, idx) => (
            <button
              key={result.item.id}
              onClick={() => router.push(result.item.url)}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`w-full px-3 py-2 text-left flex items-center gap-3 transition-colors ${
                idx === selectedIndex ? 'bg-[#1a1a1a]' : 'hover:bg-[#0a0a0a]'
              }`}
            >
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                result.item.type === 'project' ? 'bg-[#94e2d5]/10 text-[#94e2d5]' :
                result.item.type === 'page' ? 'bg-[#89b4fa]/10 text-[#89b4fa]' :
                'bg-[#a6e3a1]/10 text-[#a6e3a1]'
              }`}>
                {result.item.type}
              </span>
              <span
                className="text-[#e0e0e0] text-sm"
                dangerouslySetInnerHTML={{ __html: result.highlightedName }}
              />
              {result.item.description && (
                <span className="text-[#6c7086] text-xs truncate ml-auto max-w-[200px]">
                  {result.item.description}
                </span>
              )}
            </button>
          ))}
          <div className="px-3 py-1.5 border-t border-[#252525] text-[#6c7086] text-xs flex gap-4">
            <span><kbd className="px-1 py-0.5 bg-[#0a0a0a] rounded border border-[#252525]">↑↓</kbd> navigate</span>
            <span><kbd className="px-1 py-0.5 bg-[#0a0a0a] rounded border border-[#252525]">↵</kbd> select</span>
            <span><kbd className="px-1 py-0.5 bg-[#0a0a0a] rounded border border-[#252525]">esc</kbd> clear</span>
          </div>
        </div>
      )}

      {isFocused && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#111] border border-[#252525] rounded-lg p-4 text-center text-[#6c7086] text-sm z-50">
          No results for "{query}"
        </div>
      )}
    </div>
  );
}
