interface PieChartProps {
  data: { name: string; value: number }[];
  title: string;
  description?: string;
}

export default function PieChart({ data, title, description }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-brand-bg-darker rounded-lg p-6 border border-brand-bg-active">
      <h3 className="text-lg font-semibold text-brand-text-primary mb-2">{title}</h3>
      {description && <p className="text-sm text-brand-text-secondary mb-4">{description}</p>}

      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between p-2 rounded hover:bg-brand-bg-active">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `hsl(${(index * 360) / data.length}, 70%, 60%)` }}
                />
                <span className="text-sm text-brand-text-secondary">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-brand-text-primary">{item.value}</span>
                <span className="text-xs text-brand-text-muted">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
