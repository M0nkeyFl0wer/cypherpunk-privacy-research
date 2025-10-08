'use client';

import { useMemo } from 'react';

interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  description?: string;
  color?: 'purple' | 'blue' | 'green' | 'pink' | 'yellow';
  maxBars?: number;
  className?: string;
}

export default function BarChart({
  data,
  title,
  description,
  color = 'purple',
  maxBars = 10,
  className = '',
}: BarChartProps) {
  const colorClasses = {
    purple: 'bg-brand-accent-purple',
    blue: 'bg-brand-accent-blue',
    green: 'bg-brand-accent-green',
    pink: 'bg-brand-accent-pink',
    yellow: 'bg-brand-accent-yellow',
  };

  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, maxBars);
    const maxValue = Math.max(...sorted.map(d => d.value));

    return sorted.map(item => ({
      ...item,
      percentage: maxValue > 0 ? (item.value / maxValue) * 100 : 0,
    }));
  }, [data, maxBars]);

  return (
    <div className={`bg-brand-bg-darker border border-brand-bg-active rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-brand-text-primary mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-brand-text-secondary">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-brand-text-primary truncate max-w-[200px]" title={item.name}>
                {item.name}
              </span>
              <span className="text-brand-text-secondary ml-2 flex-shrink-0">
                {item.value}
              </span>
            </div>
            <div className="w-full bg-brand-bg-active rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${colorClasses[color]} transition-all duration-500`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {data.length > maxBars && (
        <p className="text-xs text-brand-text-muted mt-4 text-center">
          Showing top {maxBars} of {data.length} items
        </p>
      )}
    </div>
  );
}
