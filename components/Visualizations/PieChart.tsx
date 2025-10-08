'use client';

import { useMemo } from 'react';

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  description?: string;
  className?: string;
}

const COLORS = [
  '#bf00ff', // purple
  '#00bfff', // blue
  '#00ff00', // green
  '#ff00bf', // pink
  '#ffff00', // yellow
  '#ff0000', // red
];

export default function PieChart({
  data,
  title,
  description,
  className = '',
}: PieChartProps) {
  const chartData = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return data.map((item, index) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      return {
        ...item,
        percentage,
        color: COLORS[index % COLORS.length],
        startAngle,
        endAngle: currentAngle,
      };
    });
  }, [data]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

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

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Simple bar representation (easier than SVG pie) */}
        <div className="flex-1 w-full">
          <div className="flex items-center h-8 rounded-full overflow-hidden bg-brand-bg-active">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="h-full transition-all duration-500 hover:opacity-80"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.name}: ${item.value} (${item.percentage.toFixed(1)}%)`}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-shrink-0 space-y-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-brand-text-primary font-medium min-w-[120px]">
                {item.name}
              </span>
              <span className="text-brand-text-secondary">
                {item.value} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-brand-bg-active text-center">
        <p className="text-sm text-brand-text-muted">
          Total: <span className="font-semibold text-brand-text-primary">{total}</span>
        </p>
      </div>
    </div>
  );
}
