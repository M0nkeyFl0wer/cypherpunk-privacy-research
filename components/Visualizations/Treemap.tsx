interface TreemapProps {
  projects: any[];
  width: number;
  height: number;
}

export default function Treemap({ projects, width, height }: TreemapProps) {
  return (
    <div style={{ width, height }} className="flex items-center justify-center">
      <p className="text-brand-text-muted">Treemap visualization (D3.js implementation pending)</p>
    </div>
  );
}
