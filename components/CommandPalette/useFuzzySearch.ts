'use client';

import { useState, useMemo, useCallback } from 'react';
import type { SearchItem } from '@/lib/search/searchTypes';

interface FuzzyMatch {
  item: SearchItem;
  score: number;
  highlightedName: string;
}

// Simple fuzzy matching algorithm (fzf-style)
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
      // Consecutive matches score higher
      if (lastMatchIdx === i - 1) {
        score += 2;
      } else {
        score += 1;
      }
      // Word boundary bonus
      if (i === 0 || text[i - 1] === ' ' || text[i - 1] === '-' || text[i - 1] === '_') {
        score += 3;
      }
      highlighted += `<mark>${text[i]}</mark>`;
      lastMatchIdx = i;
      queryIdx++;
    } else {
      highlighted += text[i];
    }
  }

  // All query characters must match
  if (queryIdx !== queryLower.length) return null;

  // Bonus for shorter strings (more relevant)
  score += Math.max(0, 10 - text.length / 5);

  return { score, highlighted };
}

export function useFuzzySearch(items: SearchItem[]) {
  const [query, setQuery] = useState('');

  const results = useMemo((): FuzzyMatch[] => {
    if (!query.trim()) {
      // Show all items sorted by type priority when no query
      return items.slice(0, 10).map((item) => ({
        item,
        score: 0,
        highlightedName: item.name,
      }));
    }

    const matches: FuzzyMatch[] = [];

    for (const item of items) {
      // Match against name
      const nameMatch = fuzzyMatch(query, item.name);
      if (nameMatch) {
        matches.push({
          item,
          score: nameMatch.score,
          highlightedName: nameMatch.highlighted,
        });
        continue;
      }

      // Match against description if name doesn't match
      if (item.description) {
        const descMatch = fuzzyMatch(query, item.description);
        if (descMatch) {
          matches.push({
            item,
            score: descMatch.score * 0.5, // Lower priority for description matches
            highlightedName: item.name,
          });
        }
      }
    }

    // Sort by score descending, limit to 10
    return matches.sort((a, b) => b.score - a.score).slice(0, 10);
  }, [items, query]);

  const clearQuery = useCallback(() => setQuery(''), []);

  return { query, setQuery, results, clearQuery };
}
