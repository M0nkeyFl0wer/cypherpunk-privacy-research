'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ProjectMiniGraphProps {
  projectId: string;
  width?: number;
  height?: number;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'project' | 'language' | 'topic' | 'license';
  size: number;
  tier?: 'osint' | 'standard';
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
}

const NODE_COLORS: Record<string, string> = {
  project: '#94e2d5',
  language: '#89b4fa',
  topic: '#a6e3a1',
  license: '#f9e2af',
};

export default function ProjectMiniGraph({ projectId, width = 400, height = 300 }: ProjectMiniGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Fetch the full graph data and extract this project's subgraph
    fetch('/data/research-graph.json')
      .then(res => res.json())
      .then(data => {
        // Find the project node
        const projectNode = data.nodes.find((n: any) => n.id === projectId && n.type === 'project');
        if (!projectNode) {
          setError('Project not found in graph');
          setLoading(false);
          return;
        }

        // Find all links connected to this project
        const connectedLinks = data.links.filter((l: any) =>
          l.source === projectId || l.target === projectId
        );

        // Get connected node IDs
        const connectedIds = new Set<string>([projectId]);
        connectedLinks.forEach((l: any) => {
          connectedIds.add(l.source);
          connectedIds.add(l.target);
        });

        // Filter nodes to only connected ones (excluding contributors for cleaner view)
        const filteredNodes: GraphNode[] = data.nodes
          .filter((n: any) => connectedIds.has(n.id) && n.type !== 'contributor')
          .map((n: any) => ({
            ...n,
            size: n.type === 'project' ? 25 : 12,
          }));

        const filteredLinks = connectedLinks.filter((l: any) => {
          const sourceNode = filteredNodes.find(n => n.id === l.source);
          const targetNode = filteredNodes.find(n => n.id === l.target);
          return sourceNode && targetNode;
        });

        renderGraph(filteredNodes, filteredLinks);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load graph:', err);
        setError('Failed to load graph data');
        setLoading(false);
      });
  }, [projectId, width, height]);

  const renderGraph = (nodes: GraphNode[], links: GraphLink[]) => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g');

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, any>(links)
        .id(d => d.id)
        .distance(60)
        .strength(0.7)
      )
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as GraphNode).size + 8));

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => {
        if (d.type === 'uses_language') return '#89b4fa';
        if (d.type === 'tagged_with') return '#a6e3a1';
        if (d.type === 'licensed_under') return '#f9e2af';
        return '#252525';
      })
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node');

    // Add shapes
    node.each(function(d) {
      const el = d3.select(this);
      const size = d.size;

      if (d.type === 'project') {
        el.append('circle')
          .attr('r', size)
          .attr('fill', d.tier === 'osint' ? '#b8e8e0' : NODE_COLORS.project)
          .attr('stroke', '#74b8b0')
          .attr('stroke-width', 2);
      } else if (d.type === 'language') {
        const hexPoints = Array.from({ length: 6 }, (_, i) => {
          const angle = (i * 60 - 30) * Math.PI / 180;
          return `${Math.cos(angle) * size},${Math.sin(angle) * size}`;
        }).join(' ');
        el.append('polygon')
          .attr('points', hexPoints)
          .attr('fill', NODE_COLORS.language)
          .attr('stroke', '#7aa2d8')
          .attr('stroke-width', 1);
      } else if (d.type === 'topic') {
        const diamondPoints = `0,${-size} ${size},0 0,${size} ${-size},0`;
        el.append('polygon')
          .attr('points', diamondPoints)
          .attr('fill', NODE_COLORS.topic)
          .attr('stroke', '#8dc48d')
          .attr('stroke-width', 1);
      } else if (d.type === 'license') {
        el.append('rect')
          .attr('x', -size)
          .attr('y', -size)
          .attr('width', size * 2)
          .attr('height', size * 2)
          .attr('fill', NODE_COLORS.license)
          .attr('stroke', '#d8c58d')
          .attr('stroke-width', 1);
      }
    });

    // Labels
    node.append('text')
      .text(d => d.name.length > 10 ? d.name.slice(0, 8) + '..' : d.name)
      .attr('x', 0)
      .attr('y', d => d.size + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#a6adc8')
      .attr('font-size', d => d.type === 'project' ? '11px' : '9px')
      .attr('pointer-events', 'none');

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  };

  if (error) {
    return (
      <div className="text-center py-8 text-[#6c7086] text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-[#94e2d5] border-t-transparent rounded-full"></div>
        </div>
      )}
      <svg
        ref={svgRef}
        className="bg-[#0a0a0a] rounded-lg"
        style={{ width: '100%', height, opacity: loading ? 0.3 : 1 }}
      />
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#6c7086]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#94e2d5]"></span> project
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#89b4fa]" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></span> language
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#a6e3a1]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></span> topic
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#f9e2af]"></span> license
        </span>
      </div>
    </div>
  );
}
