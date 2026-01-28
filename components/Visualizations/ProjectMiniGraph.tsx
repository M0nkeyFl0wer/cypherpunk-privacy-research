'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

interface ProjectMiniGraphProps {
  projectId: string;
  width?: number;
  height?: number;
}

interface ProjectNode {
  id: string;
  label: string;
  type: string;
  category: string;
  isWeb3: boolean;
  privacyTech: string[];
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface ProjectEdge {
  source: string | ProjectNode;
  target: string | ProjectNode;
  relationship: string;
  detail: string;
}

interface CategoryInfo {
  label: string;
  color: string;
  description: string;
}

interface GraphData {
  nodes: ProjectNode[];
  edges: ProjectEdge[];
  categories: Record<string, CategoryInfo>;
}

// Default category colors
const CATEGORY_COLORS: Record<string, string> = {
  'privacy-coin': '#f9e2af',
  'messaging': '#89b4fa',
  'email': '#cba6f7',
  'wallet': '#a6e3a1',
  'network-privacy': '#94e2d5',
  'privacy-defi': '#fab387',
  'privacy-infra': '#f38ba8',
  'bridge': '#74c7ec',
  'zk-toolkit': '#b4befe',
  'identity': '#eba0ac',
};

// Projects that have detail pages
const PROJECTS_WITH_PAGES = new Set([
  'bitchat', 'cake-wallet', 'circom', 'concordium', 'confer', 'darkfi', 'deeper-network',
  'elusiv', 'fileverse', 'findora', 'firo', 'fluidkey', 'hop-protocol', 'hopr', 'iden3',
  'incognito', 'iron-fish', 'layerzero', 'mask-network', 'meshtastic', 'miden', 'mobilecoin',
  'monero', 'mysterium-network', 'nym', 'oasis-network', 'orchid', 'oxen', 'privatepool',
  'protonmail', 'rotki', 'secret-network', 'semaphore', 'sentinel', 'sienna-network', 'signal',
  'snarkjs', 'starkex', 'suterusu', 'telegram', 'tornado-cash', 'wasabi-wallet',
  'webb-protocol', 'xx-network', 'zano', 'zcash', 'zeal', 'zk-money', 'zksync', 'zkvote'
]);

export default function ProjectMiniGraph({ projectId, width = 400, height = 300 }: ProjectMiniGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GraphData | null>(null);

  // Load graph data
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

  // Filter to show only the current project and its direct connections
  const getConnectedData = useCallback((graphData: GraphData) => {
    const connectedIds = new Set<string>([projectId]);

    // Find all directly connected nodes
    graphData.edges.forEach(edge => {
      const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
      const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
      if (sourceId === projectId) connectedIds.add(targetId);
      if (targetId === projectId) connectedIds.add(sourceId);
    });

    const nodes = graphData.nodes.filter(n => connectedIds.has(n.id));
    const edges = graphData.edges.filter(e => {
      const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
      const targetId = typeof e.target === 'string' ? e.target : e.target.id;
      return connectedIds.has(sourceId) && connectedIds.has(targetId);
    });

    return { nodes, edges };
  }, [projectId]);

  // Render graph
  useEffect(() => {
    if (!svgRef.current || !data) return;

    const { nodes, edges } = getConnectedData(data);

    if (nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Setup zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Center the view
    const centerNode = nodes.find(n => n.id === projectId);
    if (centerNode) {
      centerNode.fx = width / 2;
      centerNode.fy = height / 2;
    }

    // Create simulation
    const simulation = d3.forceSimulation<ProjectNode>(nodes)
      .force('link', d3.forceLink<ProjectNode, any>(edges)
        .id(d => d.id)
        .distance(80)
        .strength(0.7)
      )
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Draw edges
    const link = g.append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', d => {
        if (d.relationship === 'shared-tech') return '#94e2d5';
        if (d.relationship === 'built-on' || d.relationship === 'implements') return '#fab387';
        if (d.relationship === 'toolchain') return '#89b4fa';
        return '#444';
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Edge labels
    const linkLabels = g.append('g')
      .attr('class', 'edge-labels')
      .selectAll('text')
      .data(edges)
      .join('text')
      .attr('fill', '#666')
      .attr('font-size', '8px')
      .attr('text-anchor', 'middle')
      .text(d => d.detail);

    // Tooltip
    d3.selectAll('.mini-graph-tooltip').remove();
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'mini-graph-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(10, 10, 10, 0.95)')
      .style('border', '1px solid #333')
      .style('border-radius', '6px')
      .style('padding', '8px 12px')
      .style('color', '#e0e0e0')
      .style('font-size', '11px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000)
      .style('max-width', '220px');

    // Draw nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', d => PROJECTS_WITH_PAGES.has(d.id) && d.id !== projectId ? 'pointer' : 'default');

    // Node circles
    node.append('circle')
      .attr('r', d => d.id === projectId ? 22 : 16)
      .attr('fill', d => CATEGORY_COLORS[d.category] || '#6c7086')
      .attr('stroke', d => d.id === projectId ? '#fff' : (PROJECTS_WITH_PAGES.has(d.id) ? '#888' : '#333'))
      .attr('stroke-width', d => d.id === projectId ? 3 : 1.5)
      .attr('opacity', d => d.id === projectId ? 1 : 0.85);

    // Labels
    node.append('text')
      .text(d => d.label.length > 8 ? d.label.slice(0, 7) + '..' : d.label)
      .attr('x', 0)
      .attr('y', d => (d.id === projectId ? 22 : 16) + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.id === projectId ? '#fff' : '#888')
      .attr('font-size', d => d.id === projectId ? '10px' : '9px')
      .attr('font-weight', d => d.id === projectId ? '600' : '400')
      .attr('pointer-events', 'none');

    // Drag for center node
    const drag = d3.drag<SVGGElement, ProjectNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        if (d.id !== projectId) {
          d.fx = null;
          d.fy = null;
        }
      });

    node.call(drag as any);

    // Interactions
    node
      .on('mouseover', function(event, d) {
        const categoryInfo = data.categories[d.category];
        const isCenter = d.id === projectId;
        const hasPage = PROJECTS_WITH_PAGES.has(d.id);

        let tooltipHtml = `
          <div style="font-weight: 600; color: ${categoryInfo?.color || '#fff'}">${d.label}</div>
          <div style="font-size: 9px; color: #666; margin-bottom: 4px;">${categoryInfo?.label || d.category}</div>
        `;

        if (d.privacyTech.length > 0) {
          tooltipHtml += `<div style="font-size: 9px; color: #888;">${d.privacyTech.slice(0, 3).join(', ')}</div>`;
        }

        if (!isCenter && hasPage) {
          tooltipHtml += `<div style="font-size: 9px; color: #94e2d5; margin-top: 4px;">Click to view →</div>`;
        }

        tooltip
          .html(tooltipHtml)
          .style('opacity', 1)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        if (d.id !== projectId && PROJECTS_WITH_PAGES.has(d.id)) {
          router.push(`/projects/${d.id}`);
        }
      });

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as ProjectNode).x || 0)
        .attr('y1', d => (d.source as ProjectNode).y || 0)
        .attr('x2', d => (d.target as ProjectNode).x || 0)
        .attr('y2', d => (d.target as ProjectNode).y || 0);

      linkLabels
        .attr('x', d => (((d.source as ProjectNode).x || 0) + ((d.target as ProjectNode).x || 0)) / 2)
        .attr('y', d => (((d.source as ProjectNode).y || 0) + ((d.target as ProjectNode).y || 0)) / 2);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      tooltip.remove();
      simulation.stop();
    };
  }, [data, projectId, getConnectedData, width, height, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-[#0a0a0a] rounded-lg" style={{ height }}>
        <div className="animate-spin w-6 h-6 border-2 border-[#94e2d5] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { nodes, edges } = getConnectedData(data);
  const centerNode = data.nodes.find(n => n.id === projectId);

  if (nodes.length <= 1) {
    return (
      <div className="text-center py-6 text-[#6c7086] text-sm bg-[#0a0a0a] rounded-lg border border-[#252525]">
        No connections found in ecosystem graph
      </div>
    );
  }

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-[#0a0a0a] rounded-lg border border-[#252525]"
      />

      {/* Stats */}
      <div className="flex items-center justify-between mt-2 text-xs text-[#555]">
        <span>{nodes.length - 1} connected projects</span>
        <span>{edges.length} relationships</span>
      </div>
    </div>
  );
}
