'use client';

import { useCommandPaletteContext } from './CommandPaletteProvider';

export function SearchButton() {
  const { open } = useCommandPaletteContext();

  return (
    <button
      onClick={open}
      className="fixed top-4 right-4 z-40 sm:hidden p-2 bg-[#111] border border-[#252525] rounded-lg text-[#6c7086] hover:text-[#e0e0e0] hover:border-[#94e2d5] transition-colors"
      aria-label="Open search"
    >
      <svg
        className="w-5 h-5"
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
    </button>
  );
}
