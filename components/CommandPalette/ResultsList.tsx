'use client';

import { ResultItem } from './ResultItem';
import type { SearchItem } from '@/lib/search/searchTypes';

interface FuzzyMatch {
  item: SearchItem;
  score: number;
  highlightedName: string;
}

interface ResultsListProps {
  results: FuzzyMatch[];
  selectedIndex: number;
  onSelect: (item: SearchItem) => void;
}

export function ResultsList({ results, selectedIndex, onSelect }: ResultsListProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div
      className="max-h-[400px] overflow-y-auto"
      role="listbox"
      aria-label="Search results"
    >
      {results.map((result, index) => (
        <ResultItem
          key={`${result.item.type}-${result.item.id}`}
          item={result.item}
          highlightedName={result.highlightedName}
          isSelected={index === selectedIndex}
          onClick={() => onSelect(result.item)}
        />
      ))}
    </div>
  );
}
