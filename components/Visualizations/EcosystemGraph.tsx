'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

interface EcosystemNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  category: string;
  ecosystem: string;
  language: string;
  postQuantum: boolean;
}

interface EcosystemEdge extends d3.SimulationLinkDatum<EcosystemNode> {
  source: string | EcosystemNode;
  target: string | EcosystemNode;
  relationship: string;
  detail: string;
}

interface EcosystemData {
  nodes: EcosystemNode[];
  edges: EcosystemEdge[];
  clusters: Record<string, { label: string; members: string[]; description: string }>;
}

interface Props {
  width?: number;
  height?: number;
  highlightCluster?: string | null;
}

export default function EcosystemGraph({ width = 900, height = 600, highlightCluster = null }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const [data, setData] = useState<EcosystemData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(highlightCluster);

  // Fetch ecosystem data
  useEffect(() => {
    fetch('/data/ecosystem-graph.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error('Failed to load ecosystem data:', err));
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    // Filter edges based on active filter
    let filteredEdges = data.edges;
    let filteredNodes = data.nodes;

    if (activeFilter) {
      const clusterMembers = data.clusters[activeFilter]?.members || [];
      filteredNodes = data.nodes.filter(n => clusterMembers.includes(n.id));
      filteredEdges = data.edges.filter(e => {
        const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
        const targetId = typeof e.target === 'string' ? e.target : e.target.id;
        return clusterMembers.includes(sourceId) && clusterMembers.includes(targetId);
      });
    }

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    // Color scales
    const relationshipColors: Record<string, string> = {
      'shared-crypto': '#f5a97f',    // Peach
      'shared-framework': '#c6a0f6', // Mauve
      'shared-language': '#8bd5ca',  // Teal
      'shared-property': '#f5c2e7',  // Pink
    };

    const ecosystemColors: Record<string, string> = {
      'standalone': '#89b4fa',  // Blue
      'cosmos': '#a6e3a1',      // Green
      'ethereum': '#fab387',    // Peach
      'monero': '#f38ba8',      // Red
      'cryptonote': '#cba6f7',  // Mauve
    };

    // Create simulation
    const simulation = d3.forceSimulation<EcosystemNode>(filteredNodes)
      .force('link', d3.forceLink<EcosystemNode, EcosystemEdge>(filteredEdges)
        .id(d => d.id)
        .distance(120)
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Draw edges
    const link = g.append('g')
      .selectAll('line')
      .data(filteredEdges)
      .join('line')
      .attr('stroke', d => relationshipColors[d.relationship] || '#6c7086')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.relationship === 'shared-property' ? '4,4' : 'none');

    // Edge labels
    const edgeLabel = g.append('g')
      .selectAll('text')
      .data(filteredEdges)
      .join('text')
      .attr('fill', '#6c7086')
      .attr('font-size', '8px')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .text(d => d.detail);

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .join('g')
      .call(d3.drag<SVGGElement, EcosystemNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
      );

    // Node circles
    node.append('circle')
      .attr('r', d => d.postQuantum ? 28 : 22)
      .attr('fill', d => ecosystemColors[d.ecosystem] || '#6c7086')
      .attr('stroke', d => d.postQuantum ? '#f5c2e7' : '#313244')
      .attr('stroke-width', d => d.postQuantum ? 3 : 2)
      .style('cursor', 'pointer');

    // Post-quantum indicator
    node.filter(d => d.postQuantum)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -32)
      .attr('fill', '#f5c2e7')
      .attr('font-size', '12px')
      .text('🔮');

    // Node labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 5)
      .attr('fill', '#1e1e2e')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text(d => d.label.length > 10 ? d.label.slice(0, 8) + '...' : d.label);

    // Tooltip
    const tooltip = d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', '#1e1e2e')
      .style('border', '1px solid #45475a')
      .style('border-radius', '8px')
      .style('padding', '12px')
      .style('color', '#cdd6f4')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000);

    node
      .on('mouseover', (event, d) => {
        const connections = filteredEdges.filter(e => {
          const s = typeof e.source === 'string' ? e.source : e.source.id;
          const t = typeof e.target === 'string' ? e.target : e.target.id;
          return s === d.id || t === d.id;
        });

        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${d.label}</div>
            <div style="color: #a6adc8; margin-bottom: 8px;">${d.category}</div>
            <div style="margin-bottom: 4px;">🌐 Ecosystem: <span style="color: ${ecosystemColors[d.ecosystem]}">${d.ecosystem}</span></div>
            <div style="margin-bottom: 4px;">💻 Language: ${d.language}</div>
            ${d.postQuantum ? '<div style="color: #f5c2e7; margin-bottom: 4px;">🔮 Post-Quantum Ready</div>' : ''}
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #45475a; font-size: 11px;">
              <strong>${connections.length} connections:</strong><br/>
              ${connections.slice(0, 4).map(c => `• ${c.detail} (${c.relationship.replace('shared-', '')})`).join('<br/>')}
              ${connections.length > 4 ? `<br/>... and ${connections.length - 4} more` : ''}
            </div>
            <div style="color: #89b4fa; margin-top: 8px; font-size: 10px;">Click for project details →</div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');
      })
      .on('mouseout', () => tooltip.style('opacity', 0))
      .on('click', (event, d) => {
        event.stopPropagation();
        router.push(`/projects/${d.id}`);
      });

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as EcosystemNode).x!)
        .attr('y1', d => (d.source as EcosystemNode).y!)
        .attr('x2', d => (d.target as EcosystemNode).x!)
        .attr('y2', d => (d.target as EcosystemNode).y!);

      edgeLabel
        .attr('x', d => ((d.source as EcosystemNode).x! + (d.target as EcosystemNode).x!) / 2)
        .attr('y', d => ((d.source as EcosystemNode).y! + (d.target as EcosystemNode).y!) / 2);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: EcosystemNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: EcosystemNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: EcosystemNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [data, width, height, activeFilter, router]);

  if (!data) {
    return <div className="text-[#6c7086]">Loading ecosystem data...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            activeFilter === null
              ? 'bg-[#89b4fa] text-[#1e1e2e]'
              : 'bg-[#313244] text-[#cdd6f4] hover:bg-[#45475a]'
          }`}
        >
          All Projects
        </button>
        {Object.entries(data.clusters).map(([key, cluster]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeFilter === key
                ? 'bg-[#89b4fa] text-[#1e1e2e]'
                : 'bg-[#313244] text-[#cdd6f4] hover:bg-[#45475a]'
            }`}
            title={cluster.description}
          >
            {cluster.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-[#a6adc8]">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#f5a97f]"></span> Shared Crypto
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#c6a0f6]"></span> Shared Framework
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#8bd5ca]"></span> Shared Language
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[#f5c2e7]">🔮</span> Post-Quantum Ready
        </div>
      </div>

      {/* Graph */}
      <svg ref={svgRef} className="bg-[#11111b] rounded-lg border border-[#313244]" />

      <p className="text-xs text-[#6c7086]">
        💡 Drag nodes to rearrange • Scroll to zoom • Hover for details • Click to explore project
      </p>
    </div>
  );
}
