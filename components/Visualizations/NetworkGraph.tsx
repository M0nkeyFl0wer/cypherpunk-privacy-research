interface NetworkGraphProps {
  projects: any[];
  width: number;
  height: number;
}

export default function NetworkGraph({ projects, width, height }: NetworkGraphProps) {
  return (
    <div style={{ width, height }} className="flex items-center justify-center">
      <p className="text-brand-text-muted">Network graph visualization (D3.js implementation pending)</p>
    </div>
  );
}
