'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { SearchInput } from './SearchInput';
import { ResultsList } from './ResultsList';
import { EmptyState } from './EmptyState';
import { useFuzzySearch } from './useFuzzySearch';
import type { SearchItem } from '@/lib/search/searchTypes';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: SearchItem[];
}

export function CommandPalette({ isOpen, onClose, items }: CommandPaletteProps) {
  const router = useRouter();
  const { query, setQuery, results, clearQuery } = useFuzzySearch(items);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      clearQuery();
      setSelectedIndex(0);
    }
  }, [isOpen, clearQuery]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex].item);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      onClose();
      router.push(item.url);
    },
    [onClose, router]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!mounted || !isOpen) return null;

  const showEmptyState = query.trim() && results.length === 0;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="w-full max-w-xl bg-[#000] border border-[#252525] rounded-lg shadow-2xl overflow-hidden">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search projects, techniques, pages..."
        />

        {showEmptyState ? (
          <EmptyState query={query} onClose={onClose} />
        ) : (
          <ResultsList
            results={results}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
          />
        )}

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-[#252525] text-[#6c7086] text-xs flex justify-between">
          <span>
            <kbd className="px-1 py-0.5 bg-[#1a1a1a] rounded border border-[#252525] mr-1">↑↓</kbd>
            navigate
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-[#1a1a1a] rounded border border-[#252525] mr-1">↵</kbd>
            select
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-[#1a1a1a] rounded border border-[#252525] mr-1">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Re-export hook for convenience
export { useCommandPalette } from './useCommandPalette';
