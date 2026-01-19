interface PieChartProps {
  data: { name: string; value: number }[];
  title: string;
  description?: string;
}

// OLED-first color rotation
const colors = ['#94e2d5', '#89b4fa', '#a6e3a1', '#f9e2af', '#f38ba8', '#cba6f7', '#fab387', '#74c7ec'];

export default function PieChart({ data, title, description }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-[#111] rounded-lg p-6 border border-[#252525]">
      <h3 className="text-lg font-semibold text-[#e0e0e0] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#a6adc8] mb-4">{description}</p>}

      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={item.name} className="flex items-center justify-between p-2 rounded hover:bg-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-[#a6adc8]">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#e0e0e0]">{item.value}</span>
                <span className="text-xs text-[#6c7086]">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
