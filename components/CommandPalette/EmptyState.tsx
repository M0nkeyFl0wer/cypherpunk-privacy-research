'use client';

import Link from 'next/link';

interface EmptyStateProps {
  query: string;
  onClose: () => void;
}

export function EmptyState({ query, onClose }: EmptyStateProps) {
  const links = [
    { href: '/projects', label: 'Projects' },
    { href: '/visualizations', label: 'Visualizations' },
    { href: '/methodology', label: 'Methodology' },
  ];

  return (
    <div className="px-4 py-8 text-center">
      <p className="text-[#6c7086] mb-4">
        No results found for &ldquo;<span className="text-[#e0e0e0]">{query}</span>&rdquo;
      </p>

      <p className="text-[#6c7086] text-sm mb-3">Browse:</p>

      <div className="flex justify-center gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="text-sm px-3 py-1.5 bg-[#1a1a1a] text-[#94e2d5] rounded hover:bg-[#252525] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
