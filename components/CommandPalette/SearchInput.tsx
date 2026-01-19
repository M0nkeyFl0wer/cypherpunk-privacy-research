'use client';

import { useRef, useEffect } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when mounted
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative">
      {/* Search icon */}
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6c7086]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#111] border-b border-[#252525] px-12 py-4 text-[#e0e0e0] placeholder-[#6c7086] focus:outline-none focus:border-[#94e2d5] transition-colors"
        aria-label="Search"
      />

      {/* Keyboard hint */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6c7086] text-xs">
        <kbd className="px-1.5 py-0.5 bg-[#1a1a1a] rounded border border-[#252525]">esc</kbd>
      </div>
    </div>
  );
}
