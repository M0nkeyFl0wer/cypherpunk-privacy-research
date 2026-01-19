interface SearchFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  availableFilters: any;
  className?: string;
}

export default function SearchFilters({ filters, onFiltersChange, availableFilters, className }: SearchFiltersProps) {
  return (
    <div className={`bg-[#111] rounded-lg p-6 border border-[#252525] ${className}`}>
      <h3 className="text-lg font-semibold text-[#e0e0e0] mb-4">Filters</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-[#a6adc8] mb-2">Categories</h4>
          <div className="space-y-2">
            {availableFilters.categories?.slice(0, 5).map((cat: string) => (
              <label key={cat} className="flex items-center gap-2 text-sm text-[#a6adc8] cursor-pointer hover:text-[#e0e0e0]">
                <input type="checkbox" className="rounded accent-[#94e2d5]" />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#a6adc8] mb-2">Privacy Techniques</h4>
          <div className="space-y-2">
            {availableFilters.privacy_techniques?.slice(0, 5).map((tech: string) => (
              <label key={tech} className="flex items-center gap-2 text-sm text-[#a6adc8] cursor-pointer hover:text-[#e0e0e0]">
                <input type="checkbox" className="rounded accent-[#94e2d5]" />
                <span>{tech}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
