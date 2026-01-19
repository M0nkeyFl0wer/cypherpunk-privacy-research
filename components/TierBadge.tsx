interface TierBadgeProps {
  tier: 'osint' | 'standard';
  size?: 'sm' | 'md' | 'lg';
}

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  if (tier === 'osint') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} rounded-full font-medium bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40`}>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
        OSINT Deep Dive
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-medium bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/40`}>
      Standard Research
    </span>
  );
}
