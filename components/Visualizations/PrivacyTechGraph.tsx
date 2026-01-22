'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';
import { getProjectMetadata } from '@/lib/graphMetadata';

interface EcosystemNode {
  id: string;
  label: string;
  category: string;
  ecosystem?: string;
  language?: string;
  privacyTech: string[];
  postQuantum?: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  // Computed for display
  expansionDepth?: number; // How many clicks from initial view
}

interface EcosystemEdge {
  source: string | EcosystemNode;
  target: string | EcosystemNode;
  relationship: string;
  detail: string;
}

interface PrivacyTechLegendItem {
  label: string;
  color: string;
  description: string;
}

interface EcosystemData {
  nodes: EcosystemNode[];
  edges: EcosystemEdge[];
  clusters: Record<string, { label: string; members: string[]; description: string }>;
  privacyTechLegend: Record<string, PrivacyTechLegendItem>;
  metadata: {
    nodeCount: number;
    edgeCount: number;
    clusterCount: number;
  };
}

interface Props {
  width?: number;
  height?: number;
  defaultFilter?: string;
}

// Primary privacy tech determines node color
const TECH_COLORS: Record<string, string> = {
  'zk-snarks': '#94e2d5',
  'zk-starks': '#89b4fa',
  'ring-signatures': '#f9e2af',
  'bulletproofs': '#a6e3a1',
  'sgx-tee': '#f38ba8',
  'mixnet': '#cba6f7',
  'signal-protocol': '#fab387',
  'stealth-addresses': '#74c7ec',
  'tor': '#b4befe',
  'e2e-encryption': '#f5c2e7',
  'coinjoin': '#eba0ac',
  'vpn-tunneling': '#89dceb',
  'default': '#6c7086',
};

const CATEGORY_SHAPES: Record<string, string> = {
  'privacy-coin': 'circle',
  'messaging': 'hexagon',
  'mixer': 'diamond',
  'zk-rollup': 'square',
  'mixnet': 'triangle',
  'identity': 'pentagon',
  'wallet': 'circle',
  'vpn': 'hexagon',
  'default': 'circle',
};

export default function PrivacyTechGraph({ width = 1000, height = 700, defaultFilter }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EcosystemData | null>(null);
  const [highlightedTech, setHighlightedTech] = useState<string | null>(defaultFilter || null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const draggedRef = useRef(false); // Track if drag occurred to prevent click

  // Load graph data
  useEffect(() => {
    fetch('/data/ecosystem-graph.json')
      .then(res => res.json())
      .then((graphData: EcosystemData) => {
        setData(graphData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load privacy tech graph:', err);
        setLoading(false);
      });
  }, []);

  // Get primary privacy tech color for a node
  const getNodeColor = useCallback((node: EcosystemNode): string => {
    if (!node.privacyTech || node.privacyTech.length === 0) return TECH_COLORS.default;
    const primaryTech = node.privacyTech[0];
    return TECH_COLORS[primaryTech] || TECH_COLORS.default;
  }, []);

  // Check if a node should be highlighted (matches tech filter or is expanded)
  const isNodeHighlighted = useCallback((node: EcosystemNode): boolean => {
    if (expandedNodes.has(node.id)) return true;
    if (!highlightedTech) return false;
    return node.privacyTech?.includes(highlightedTech) || false;
  }, [highlightedTech, expandedNodes]);

  // Check if a node is connected to an expanded node
  const isConnectedToExpanded = useCallback((nodeId: string, edges: EcosystemEdge[]): boolean => {
    return edges.some(e => {
      const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
      const targetId = typeof e.target === 'string' ? e.target : e.target.id;
      return (expandedNodes.has(sourceId) && targetId === nodeId) ||
             (expandedNodes.has(targetId) && sourceId === nodeId);
    });
  }, [expandedNodes]);

  // Get visible edges (only show edges for expanded nodes or highlighted tech)
  const getVisibleEdges = useCallback((edges: EcosystemEdge[]): EcosystemEdge[] => {
    if (expandedNodes.size === 0 && !highlightedTech) return [];

    return edges.filter(e => {
      const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
      const targetId = typeof e.target === 'string' ? e.target : e.target.id;

      // Show edge if either end is expanded
      if (expandedNodes.has(sourceId) || expandedNodes.has(targetId)) return true;

      // Show edge if both ends match the highlighted tech
      if (highlightedTech) {
        const sourceNode = data?.nodes.find(n => n.id === sourceId);
        const targetNode = data?.nodes.find(n => n.id === targetId);
        if (sourceNode?.privacyTech?.includes(highlightedTech) &&
            targetNode?.privacyTech?.includes(highlightedTech)) {
          return true;
        }
      }

      return false;
    });
  }, [expandedNodes, highlightedTech, data]);

  // Render graph
  useEffect(() => {
    if (!svgRef.current || !data) return;

    const nodes = data.nodes;
    const visibleEdges = getVisibleEdges(data.edges);
    if (nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Setup zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    zoomRef.current = zoom;
    svg.call(zoom);

    // Create simulation - use all edges for positioning, but only show visible ones
    const simulation = d3.forceSimulation<EcosystemNode>(nodes)
      .force('link', d3.forceLink<EcosystemNode, any>(data.edges)
        .id(d => d.id)
        .distance(d => {
          // Expanded nodes have more space
          const source = d.source as EcosystemNode;
          const target = d.target as EcosystemNode;
          const sourceExpanded = expandedNodes.has(typeof source === 'string' ? source : source.id);
          const targetExpanded = expandedNodes.has(typeof target === 'string' ? target : target.id);
          return (sourceExpanded || targetExpanded) ? 140 : 80;
        })
        .strength(0.3)
      )
      .force('charge', d3.forceManyBody().strength(d =>
        expandedNodes.has((d as EcosystemNode).id) ? -400 : -120
      ))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d =>
        expandedNodes.has((d as EcosystemNode).id) ? 45 : 30
      ))
      .force('x', d3.forceX(width / 2).strength(0.02))
      .force('y', d3.forceY(height / 2).strength(0.02));

    // Draw edges (only visible ones)
    const link = g.append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(visibleEdges)
      .join('line')
      .attr('stroke', d => {
        // Color by relationship type
        if (d.relationship === 'shared-tech') return '#94e2d5';
        if (d.relationship === 'built-on') return '#fab387';
        if (d.relationship === 'toolchain') return '#89b4fa';
        return '#444';
      })
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Edge labels (on hover)
    const linkLabels = g.append('g')
      .attr('class', 'edge-labels')
      .selectAll('text')
      .data(visibleEdges)
      .join('text')
      .attr('fill', '#888')
      .attr('font-size', '9px')
      .attr('text-anchor', 'middle')
      .attr('opacity', 0)
      .text(d => d.detail);

    // Tooltip
    d3.selectAll('.privacy-tech-tooltip').remove();
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'privacy-tech-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(10, 10, 10, 0.95)')
      .style('border', '1px solid #333')
      .style('border-radius', '8px')
      .style('padding', '12px 16px')
      .style('color', '#e0e0e0')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000)
      .style('max-width', '300px');

    // Draw nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Add circles for nodes with expanded/highlighted states
    node.append('circle')
      .attr('r', d => {
        if (expandedNodes.has(d.id)) return 26;
        if (d.postQuantum) return 22;
        return 18;
      })
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', d => {
        if (expandedNodes.has(d.id)) return '#fff';
        if (d.postQuantum) return '#f9e2af';
        if (highlightedTech && d.privacyTech?.includes(highlightedTech)) return getNodeColor(d);
        return '#333';
      })
      .attr('stroke-width', d => {
        if (expandedNodes.has(d.id)) return 4;
        if (d.postQuantum) return 3;
        if (highlightedTech && d.privacyTech?.includes(highlightedTech)) return 3;
        return 1.5;
      })
      .attr('opacity', d => {
        // Full opacity for expanded, highlighted, or connected nodes
        if (expandedNodes.has(d.id)) return 1;
        if (highlightedTech && d.privacyTech?.includes(highlightedTech)) return 0.95;
        if (isConnectedToExpanded(d.id, data.edges)) return 0.85;
        // Dim others when something is active
        if (expandedNodes.size > 0 || highlightedTech) return 0.3;
        return 0.85;
      });

    // Post-quantum indicator
    node.filter(d => d.postQuantum === true)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#1a1a1a')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text('PQ');

    // Labels
    node.append('text')
      .text(d => d.label.length > 12 ? d.label.slice(0, 10) + '..' : d.label)
      .attr('x', 0)
      .attr('y', d => (d.postQuantum ? 22 : 18) + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .attr('font-size', '10px')
      .attr('pointer-events', 'none');

    // Drag behavior - track when dragging to prevent click firing
    const drag = d3.drag<SVGGElement, EcosystemNode>()
      .on('start', (event, d) => {
        draggedRef.current = false;
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        draggedRef.current = true; // Mark as dragged
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        // Reset after a short delay to allow click to check
        setTimeout(() => { draggedRef.current = false; }, 100);
      });

    node.call(drag as any);

    // Interactions
    node
      .on('mouseover', function(event, d) {
        setHoveredNode(d.id);

        // Highlight connected edges
        link.attr('stroke-opacity', e => {
          const sourceId = typeof e.source === 'string' ? e.source : (e.source as EcosystemNode).id;
          const targetId = typeof e.target === 'string' ? e.target : (e.target as EcosystemNode).id;
          return (sourceId === d.id || targetId === d.id) ? 0.8 : 0.1;
        }).attr('stroke-width', e => {
          const sourceId = typeof e.source === 'string' ? e.source : (e.source as EcosystemNode).id;
          const targetId = typeof e.target === 'string' ? e.target : (e.target as EcosystemNode).id;
          return (sourceId === d.id || targetId === d.id) ? 3 : 1;
        });

        // Show edge labels for connected edges
        linkLabels.attr('opacity', e => {
          const sourceId = typeof e.source === 'string' ? e.source : (e.source as EcosystemNode).id;
          const targetId = typeof e.target === 'string' ? e.target : (e.target as EcosystemNode).id;
          return (sourceId === d.id || targetId === d.id) ? 1 : 0;
        });

        // Dim unconnected nodes
        node.select('circle').attr('opacity', n => {
          if (n.id === d.id) return 1;
          const isConnected = visibleEdges.some((e: EcosystemEdge) => {
            const sourceId = typeof e.source === 'string' ? e.source : (e.source as EcosystemNode).id;
            const targetId = typeof e.target === 'string' ? e.target : (e.target as EcosystemNode).id;
            return (sourceId === d.id && targetId === n.id) || (targetId === d.id && sourceId === n.id);
          });
          return isConnected ? 0.9 : 0.3;
        });

        tooltip
          .html(`
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px; color: ${getNodeColor(d)}">${d.label}</div>
            <div style="font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 8px;">${d.category}</div>
            <div style="margin-bottom: 8px;">
              <div style="font-size: 10px; color: #666; margin-bottom: 4px;">Privacy Technologies:</div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${d.privacyTech.map(t => `<span style="background: ${TECH_COLORS[t] || '#444'}; color: #1a1a1a; padding: 2px 6px; border-radius: 4px; font-size: 9px;">${t}</span>`).join('')}
              </div>
            </div>
            ${d.postQuantum ? '<div style="color: #f9e2af; font-size: 10px;">Quantum Resistant</div>' : ''}
            <div style="color: #555; font-size: 10px; margin-top: 8px;">Double-click for project details</div>
          `)
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
        setHoveredNode(null);
        link.attr('stroke-opacity', 0.4).attr('stroke-width', 1.5);
        linkLabels.attr('opacity', 0);
        node.select('circle').attr('opacity', 0.9);
        tooltip.style('opacity', 0);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        // Single click: expand/collapse node to show connections
        setExpandedNodes(prev => {
          const next = new Set(prev);
          if (next.has(d.id)) {
            next.delete(d.id);
          } else {
            next.add(d.id);
            // Zoom to the expanded node
            if (svgRef.current && zoomRef.current && d.x && d.y) {
              const svg = d3.select(svgRef.current);
              const transform = d3.zoomIdentity
                .translate(width / 2 - d.x * 1.5, height / 2 - d.y * 1.5)
                .scale(1.5);
              svg.transition()
                .duration(500)
                .ease(d3.easeCubicInOut)
                .call(zoomRef.current.transform, transform);
            }
          }
          return next;
        });
      })
      .on('dblclick', function(event, d) {
        event.stopPropagation();
        event.preventDefault();
        router.push(`/projects/${d.id}`);
      });

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as EcosystemNode).x || 0)
        .attr('y1', d => (d.source as EcosystemNode).y || 0)
        .attr('x2', d => (d.target as EcosystemNode).x || 0)
        .attr('y2', d => (d.target as EcosystemNode).y || 0);

      linkLabels
        .attr('x', d => (((d.source as EcosystemNode).x || 0) + ((d.target as EcosystemNode).x || 0)) / 2)
        .attr('y', d => (((d.source as EcosystemNode).y || 0) + ((d.target as EcosystemNode).y || 0)) / 2);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      tooltip.remove();
      simulation.stop();
    };
  }, [data, highlightedTech, expandedNodes, getVisibleEdges, getNodeColor, isConnectedToExpanded, width, height, router]);

  // Reset zoom
  const resetZoom = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-[#0a0a0a] rounded-lg">
        <div className="animate-spin w-8 h-8 border-2 border-[#94e2d5] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-[#0a0a0a] rounded-lg text-[#f38ba8]">
        Failed to load privacy technology graph
      </div>
    );
  }

  // Get unique privacy technologies for filter
  const allTechnologies = [...new Set(data.nodes.flatMap(n => n.privacyTech || []))].sort();
  const visibleEdges = getVisibleEdges(data.edges);
  const highlightedCount = highlightedTech
    ? data.nodes.filter(n => n.privacyTech?.includes(highlightedTech)).length
    : 0;

  return (
    <div className="space-y-4">
      {/* Highlight controls */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-[#6c7086]">Highlight technology:</span>
        <button
          onClick={() => setHighlightedTech(null)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            !highlightedTech
              ? 'bg-[#94e2d5] text-[#1a1a1a]'
              : 'bg-[#1a1a1a] text-[#888] hover:bg-[#252525]'
          }`}
        >
          None
        </button>
        {allTechnologies.slice(0, 10).map(tech => {
          const count = data.nodes.filter(n => n.privacyTech?.includes(tech)).length;
          return (
            <button
              key={tech}
              onClick={() => setHighlightedTech(highlightedTech === tech ? null : tech)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                highlightedTech === tech
                  ? 'text-[#1a1a1a]'
                  : 'bg-[#1a1a1a] text-[#888] hover:bg-[#252525]'
              }`}
              style={highlightedTech === tech ? { backgroundColor: TECH_COLORS[tech] || '#94e2d5' } : {}}
            >
              {tech} ({count})
            </button>
          );
        })}
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between text-sm text-[#6c7086]">
        <span>
          {data.nodes.length} projects • {visibleEdges.length} connections shown
          {expandedNodes.size > 0 && ` • ${expandedNodes.size} expanded`}
          {highlightedTech && ` • ${highlightedCount} using ${highlightedTech}`}
        </span>
        <div className="flex gap-2">
          {expandedNodes.size > 0 && (
            <button
              onClick={() => setExpandedNodes(new Set())}
              className="px-3 py-1.5 text-xs bg-[#1a1a1a] hover:bg-[#252525] text-[#a6adc8] rounded border border-[#333] transition-colors"
            >
              Collapse All
            </button>
          )}
          <button
            onClick={resetZoom}
            className="px-3 py-1.5 text-xs bg-[#1a1a1a] hover:bg-[#252525] text-[#a6adc8] rounded border border-[#333] transition-colors"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* Privacy Tech Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        {Object.entries(TECH_COLORS).slice(0, 8).map(([tech, color]) => (
          <span
            key={tech}
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
            onClick={() => setHighlightedTech(highlightedTech === tech ? null : tech)}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className={highlightedTech === tech ? 'text-white' : 'text-[#6c7086]'}>
              {tech}
            </span>
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-[#f9e2af] bg-transparent" />
          <span className="text-[#f9e2af]">PQ = Post-Quantum</span>
        </span>
      </div>

      {/* Graph */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-[#0a0a0a] rounded-lg border border-[#252525]"
      />

      {/* Help text */}
      <p className="text-xs text-[#444]">
        Drag to pan • Scroll to zoom • Click to expand connections • Double-click for project details
      </p>
    </div>
  );
}
