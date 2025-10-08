interface SearchFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  availableFilters: any;
  className?: string;
}

export default function SearchFilters({ filters, onFiltersChange, availableFilters, className }: SearchFiltersProps) {
  return (
    <div className={`bg-brand-bg-darker rounded-lg p-6 border border-brand-bg-active ${className}`}>
      <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Filters</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-brand-text-secondary mb-2">Categories</h4>
          <div className="space-y-2">
            {availableFilters.categories?.slice(0, 5).map((cat: string) => (
              <label key={cat} className="flex items-center gap-2 text-sm text-brand-text-secondary cursor-pointer hover:text-brand-text-primary">
                <input type="checkbox" className="rounded" />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-brand-text-secondary mb-2">Privacy Techniques</h4>
          <div className="space-y-2">
            {availableFilters.privacy_techniques?.slice(0, 5).map((tech: string) => (
              <label key={tech} className="flex items-center gap-2 text-sm text-brand-text-secondary cursor-pointer hover:text-brand-text-primary">
                <input type="checkbox" className="rounded" />
                <span>{tech}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
