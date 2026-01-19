'use client';

import { TYPE_LABELS } from '@/lib/search/searchTypes';
import type { SearchItem } from '@/lib/search/searchTypes';

interface ResultItemProps {
  item: SearchItem;
  highlightedName: string;
  isSelected: boolean;
  onClick: () => void;
}

export function ResultItem({ item, highlightedName, isSelected, onClick }: ResultItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
        isSelected
          ? 'bg-[#1a1a1a] border-l-2 border-[#94e2d5]'
          : 'hover:bg-[#111] border-l-2 border-transparent'
      }`}
      role="option"
      aria-selected={isSelected}
    >
      {/* Icon */}
      <span className="text-lg flex-shrink-0" aria-hidden="true">
        {item.icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name with highlighting */}
        <div
          className="text-[#e0e0e0] truncate [&>mark]:bg-transparent [&>mark]:text-[#94e2d5] [&>mark]:font-semibold"
          dangerouslySetInnerHTML={{ __html: highlightedName }}
        />

        {/* Description preview */}
        {item.description && (
          <div className="text-[#6c7086] text-sm truncate mt-0.5">
            {item.description.slice(0, 60)}
            {item.description.length > 60 ? '...' : ''}
          </div>
        )}
      </div>

      {/* Type badge */}
      <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-[#1a1a1a] text-[#6c7086] rounded">
        {TYPE_LABELS[item.type]}
      </span>
    </button>
  );
}
