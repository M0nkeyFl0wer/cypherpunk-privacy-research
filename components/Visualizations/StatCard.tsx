'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className = '',
}: StatCardProps) {
  return (
    <div className={`bg-brand-bg-darker border border-brand-bg-active rounded-lg p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-brand-text-secondary mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-brand-text-primary mb-2">
            {value}
          </p>
          {description && (
            <p className="text-xs text-brand-text-muted">
              {description}
            </p>
          )}
          {trend && (
            <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium ${
              trend.value >= 0 ? 'text-brand-accent-green' : 'text-brand-accent-red'
            }`}>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {trend.value >= 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
              </svg>
              <span>{Math.abs(trend.value)}% {trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand-bg-active rounded-lg text-brand-accent-purple">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
