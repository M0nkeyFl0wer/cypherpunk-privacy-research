interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="bg-brand-bg-darker rounded-lg p-6 border border-brand-bg-active">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-brand-text-secondary">{title}</h3>
        {icon && <div className="text-brand-accent-purple">{icon}</div>}
      </div>

      <p className="text-3xl font-bold text-brand-text-primary mb-2">{value}</p>

      {description && (
        <p className="text-xs text-brand-text-muted">{description}</p>
      )}
    </div>
  );
}
