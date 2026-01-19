interface BarChartProps {
  data: { name: string; value: number }[];
  title: string;
  description?: string;
  color?: 'cyan' | 'blue' | 'green' | 'yellow' | 'red';
  maxBars?: number;
}

const colorMap = {
  cyan: '#94e2d5',
  blue: '#89b4fa',
  green: '#a6e3a1',
  yellow: '#f9e2af',
  red: '#f38ba8',
};

export default function BarChart({ data, title, description, color = 'cyan', maxBars = 10 }: BarChartProps) {
  const displayData = data.slice(0, maxBars);
  const maxValue = Math.max(...displayData.map(d => d.value));
  const barColor = colorMap[color] || colorMap.cyan;

  return (
    <div className="bg-[#111] rounded-lg p-6 border border-[#252525]">
      <h3 className="text-lg font-semibold text-[#e0e0e0] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#a6adc8] mb-4">{description}</p>}

      <div className="space-y-3">
        {displayData.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#a6adc8]">{item.name}</span>
              <span className="text-[#e0e0e0] font-medium">{item.value}</span>
            </div>
            <div className="h-2 bg-[#252525] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
