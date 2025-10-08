interface BarChartProps {
  data: { name: string; value: number }[];
  title: string;
  description?: string;
  color?: string;
  maxBars?: number;
}

export default function BarChart({ data, title, description, maxBars = 10 }: BarChartProps) {
  const displayData = data.slice(0, maxBars);
  const maxValue = Math.max(...displayData.map(d => d.value));

  return (
    <div className="bg-brand-bg-darker rounded-lg p-6 border border-brand-bg-active">
      <h3 className="text-lg font-semibold text-brand-text-primary mb-2">{title}</h3>
      {description && <p className="text-sm text-brand-text-secondary mb-4">{description}</p>}

      <div className="space-y-3">
        {displayData.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-brand-text-secondary">{item.name}</span>
              <span className="text-brand-text-primary font-medium">{item.value}</span>
            </div>
            <div className="h-2 bg-brand-bg-active rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-accent-purple rounded-full transition-all"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
