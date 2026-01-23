'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

interface PrivacyTechGraphProps {
  width?: number;
  height?: number;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'project' | 'category' | 'l1' | 'l2' | 'use-case' | 'language';
  category?: string;
  color?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphEdge {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
  detail?: string;
}

interface NodeTypes {
  [key: string]: { shape: string; color: string; description: string };
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeTypes: NodeTypes;
}

// Projects with detail pages
const PROJECTS_WITH_PAGES = new Set([
  'bitchat', 'cake-wallet', 'circom', 'concordium', 'confer', 'darkfi', 'deeper-network',
  'elusiv', 'fileverse', 'findora', 'firo', 'fluidkey', 'hop-protocol', 'hopr', 'iden3',
  'incognito', 'iron-fish', 'layerzero', 'mask-network', 'meshtastic', 'miden', 'mobilecoin',
  'monero', 'mysterium-network', 'nym', 'oasis-network', 'orchid', 'oxen', 'privatepool',
  'protonmail', 'rotki', 'secret-network', 'semaphore', 'sentinel', 'sienna-network', 'signal',
  'snarkjs', 'starkex', 'suterusu', 'telegram', 'tornado-cash', 'wasabi-wallet',
  'webb-protocol', 'xx-network', 'zano', 'zcash', 'zeal', 'zk-money', 'zksync', 'zkvote',
  'briar', 'railgun', '0xbow', 'nocturne'
]);

// Get node color based on type
function getNodeColor(node: GraphNode, nodeTypes: NodeTypes): string {
  if (node.type === 'l1' || node.type === 'l2') {
    return node.color || '#627EEA';
  }
  return nodeTypes[node.type]?.color || '#6c7086';
}

// Get node size based on type
function getNodeSize(node: GraphNode): number {
  switch (node.type) {
    case 'project': return 12;
    case 'category': return 18;
    case 'l1': return 20;
    case 'l2': return 16;
    case 'use-case': return 16;
    case 'language': return 10;
    default: return 12;
  }
}

// Draw different shapes
function drawNodeShape(selection: any, node: GraphNode, nodeTypes: NodeTypes) {
  const size = getNodeSize(node);
  const color = getNodeColor(node, nodeTypes);

  selection.selectAll('*').remove();

  switch (node.type) {
    case 'category':
      // Hexagon
      const hexPoints = d3.range(6).map(i => {
        const angle = (i * 60 - 30) * Math.PI / 180;
        return [size * Math.cos(angle), size * Math.sin(angle)].join(',');
      }).join(' ');
      selection.append('polygon')
        .attr('points', hexPoints)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);
      break;

    case 'l1':
    case 'l2':
    case 'use-case':
      // Diamond/ETH shape
      const diamondSize = size;
      selection.append('polygon')
        .attr('points', `0,${-diamondSize} ${diamondSize * 0.7},0 0,${diamondSize} ${-diamondSize * 0.7},0`)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
      break;

    case 'language':
      // Square
      selection.append('rect')
        .attr('x', -size / 2)
        .attr('y', -size / 2)
        .attr('width', size)
        .attr('height', size)
        .attr('fill', color)
        .attr('stroke', '#444')
        .attr('stroke-width', 1)
        .attr('rx', 2);
      break;

    default:
      // Circle for projects
      selection.append('circle')
        .attr('r', size)
        .attr('fill', color)
        .attr('stroke', PROJECTS_WITH_PAGES.has(node.id) ? '#fff' : '#555')
        .attr('stroke-width', PROJECTS_WITH_PAGES.has(node.id) ? 2 : 1);
  }
}

export default function PrivacyTechGraph({ width = 900, height = 600 }: PrivacyTechGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const nodePositionsRef = useRef<Map<string, { x: number; y: number; fx: number | null; fy: number | null }>>(new Map());
  const draggedRef = useRef(false);
  const simulationRef = useRef<d3.Simulation<GraphNode, undefined> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Load data
  useEffect(() => {
    fetch('/data/ecosystem-graph.json')
      .then(res => res.json())
      .then((graphData: GraphData) => {
        setData(graphData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load graph:', err);
        setLoading(false);
      });
  }, []);

  // Render graph
  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);
    zoomRef.current = zoom;

    // Restore positions
    const nodes = data.nodes.map(n => {
      const saved = nodePositionsRef.current.get(n.id);
      return saved ? { ...n, ...saved } : { ...n };
    });

    const edges = data.edges.map(e => ({ ...e }));

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(edges)
        .id(d => d.id)
        .distance(d => {
          const edge = d as unknown as GraphEdge;
          if (edge.type === 'belongs-to') return 60;
          if (edge.type === 'deployed-on') return 80;
          return 100;
        })
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(25));

    simulationRef.current = simulation;

    // Draw edges
    const link = g.append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', d => {
        if (d.type === 'belongs-to') return '#444';
        if (d.type === 'deployed-on') return '#627EEA';
        if (d.type === 'enables') return '#a6e3a1';
        if (d.type === 'built-with') return '#6c7086';
        if (d.type === 'shared-tech') return '#94e2d5';
        return '#333';
      })
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

    // Tooltip
    d3.selectAll('.graph-tooltip').remove();
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'graph-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(10, 10, 10, 0.95)')
      .style('border', '1px solid #333')
      .style('border-radius', '8px')
      .style('padding', '12px')
      .style('color', '#e0e0e0')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 9999)
      .style('max-width', '280px');

    // Draw nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', d => d.type === 'project' && PROJECTS_WITH_PAGES.has(d.id) ? 'pointer' : 'grab');

    // Draw shapes
    node.each(function(d) {
      drawNodeShape(d3.select(this), d, data.nodeTypes);
    });

    // Labels
    node.append('text')
      .text(d => d.label.length > 12 ? d.label.slice(0, 11) + '..' : d.label)
      .attr('x', 0)
      .attr('y', d => getNodeSize(d) + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.type === 'project' ? '#e0e0e0' : '#888')
      .attr('font-size', d => d.type === 'project' ? '10px' : '9px')
      .attr('pointer-events', 'none');

    // Drag
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        draggedRef.current = false;
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        draggedRef.current = true;
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        // Keep pinned
        nodePositionsRef.current.set(d.id, {
          x: d.x!,
          y: d.y!,
          fx: d.fx ?? null,
          fy: d.fy ?? null
        });
        setTimeout(() => { draggedRef.current = false; }, 50);
      });

    node.call(drag as any);

    // Interactions
    node
      .on('mouseover', function(event, d) {
        // Highlight connections
        link.attr('stroke-opacity', e => {
          const sourceId = typeof e.source === 'string' ? e.source : (e.source as GraphNode).id;
          const targetId = typeof e.target === 'string' ? e.target : (e.target as GraphNode).id;
          return (sourceId === d.id || targetId === d.id) ? 0.9 : 0.1;
        }).attr('stroke-width', e => {
          const sourceId = typeof e.source === 'string' ? e.source : (e.source as GraphNode).id;
          const targetId = typeof e.target === 'string' ? e.target : (e.target as GraphNode).id;
          return (sourceId === d.id || targetId === d.id) ? 3 : 1;
        });

        // Build tooltip
        const hasPage = d.type === 'project' && PROJECTS_WITH_PAGES.has(d.id);
        const typeLabel = data.nodeTypes[d.type]?.description || d.type;

        let html = `<div style="font-weight: 600; font-size: 14px; color: ${getNodeColor(d, data.nodeTypes)}">${d.label}</div>`;
        html += `<div style="font-size: 10px; color: #666; margin-bottom: 8px;">${typeLabel}</div>`;

        // Show connections
        const connections = edges.filter(e => {
          const sourceId = typeof e.source === 'string' ? e.source : (e.source as GraphNode).id;
          const targetId = typeof e.target === 'string' ? e.target : (e.target as GraphNode).id;
          return sourceId === d.id || targetId === d.id;
        });

        if (connections.length > 0) {
          html += `<div style="font-size: 10px; color: #888;">${connections.length} connections</div>`;
        }

        if (hasPage) {
          html += `<div style="font-size: 10px; color: #94e2d5; margin-top: 6px;">Click to open project →</div>`;
        }

        tooltip
          .html(html)
          .style('opacity', 1)
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 15) + 'px');
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 15) + 'px');
      })
      .on('mouseout', function() {
        link.attr('stroke-opacity', 0.4).attr('stroke-width', 1.5);
        tooltip.style('opacity', 0);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        event.preventDefault();

        if (draggedRef.current) return;

        if (d.type === 'project' && PROJECTS_WITH_PAGES.has(d.id)) {
          window.location.href = `/projects/${d.id}/`;
        }
      });

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x || 0)
        .attr('y1', d => (d.source as GraphNode).y || 0)
        .attr('x2', d => (d.target as GraphNode).x || 0)
        .attr('y2', d => (d.target as GraphNode).y || 0);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      tooltip.remove();
      simulation.stop();
    };
  }, [data, width, height]);

  // Reset
  const resetView = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  }, []);

  // Unlock all
  const unlockNodes = useCallback(() => {
    nodePositionsRef.current.clear();
    if (simulationRef.current && data) {
      data.nodes.forEach(n => {
        (n as any).fx = null;
        (n as any).fy = null;
      });
      simulationRef.current.alpha(0.5).restart();
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-[#0a0a0a] rounded-lg" style={{ height }}>
        <div className="animate-spin w-8 h-8 border-2 border-[#94e2d5] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-3">
      {/* Graph */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-[#0a0a0a] rounded-lg border border-[#252525]"
      />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#888]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#f9e2af]"></span>
          Projects
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#fab387]" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></span>
          Categories
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#627EEA]" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></span>
          Chains
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#a6e3a1]" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></span>
          Use Cases
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#6c7086] rounded-sm"></span>
          Languages
        </span>
        <div className="ml-auto flex gap-2">
          <button onClick={unlockNodes} className="px-2 py-1 bg-[#1a1a1a] hover:bg-[#252525] rounded text-[#888]">
            Unlock
          </button>
          <button onClick={resetView} className="px-2 py-1 bg-[#1a1a1a] hover:bg-[#252525] rounded text-[#888]">
            Reset
          </button>
        </div>
      </div>

      <p className="text-xs text-[#555]">
        Drag to arrange • Scroll to zoom • Click project to open • Hover for connections
      </p>
    </div>
  );
}
