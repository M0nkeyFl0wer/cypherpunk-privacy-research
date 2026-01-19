interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="bg-[#111] rounded-lg p-6 border border-[#252525]">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-[#a6adc8]">{title}</h3>
        {icon && <div className="text-[#94e2d5]">{icon}</div>}
      </div>

      <p className="text-3xl font-bold text-[#e0e0e0] mb-2">{value}</p>

      {description && (
        <p className="text-xs text-[#6c7086]">{description}</p>
      )}
    </div>
  );
}
