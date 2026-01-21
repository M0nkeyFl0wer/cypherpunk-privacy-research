'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as d3 from 'd3';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'project' | 'language' | 'topic' | 'license' | 'contributor';
  size: number;
  tier?: 'osint' | 'standard';
  expanded?: boolean;
  connectionCount?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
}

interface FullGraphData {
  nodes: any[];
  links: any[];
}

interface Props {
  width?: number;
  height?: number;
  initialFocus?: string;
}

const NODE_COLORS: Record<string, string> = {
  project: '#94e2d5',
  language: '#89b4fa',
  topic: '#a6e3a1',
  license: '#f9e2af',
  contributor: '#cba6f7',
};

export default function EcosystemGraph({ width = 900, height = 600, initialFocus }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [fullData, setFullData] = useState<FullGraphData | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [visibleNodes, setVisibleNodes] = useState<GraphNode[]>([]);
  const [visibleLinks, setVisibleLinks] = useState<GraphLink[]>([]);

  const focusNode = searchParams.get('focus') || initialFocus;

  // Load graph data
  useEffect(() => {
    fetch('/data/research-graph.json')
      .then(res => res.json())
      .then(data => {
        setFullData(data);
        setLoading(false);
        if (focusNode) {
          setExpandedNodes(new Set([focusNode]));
        }
      })
      .catch(err => {
        console.error('Failed to load graph data:', err);
        setLoading(false);
      });
  }, [focusNode]);

  // Calculate visible nodes - always show all projects, expand shows connections
  useEffect(() => {
    if (!fullData) return;

    const nodeMap = new Map<string, any>();
    fullData.nodes.forEach(n => nodeMap.set(n.id, n));

    // Count connections for each project
    const connectionCounts = new Map<string, number>();
    fullData.links.forEach((l: any) => {
      connectionCounts.set(l.source, (connectionCounts.get(l.source) || 0) + 1);
      connectionCounts.set(l.target, (connectionCounts.get(l.target) || 0) + 1);
    });

    const visibleNodeIds = new Set<string>();
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // Always include all projects
    fullData.nodes.forEach((n: any) => {
      if (n.type === 'project') {
        visibleNodeIds.add(n.id);
      }
    });

    // Add connections for expanded nodes
    expandedNodes.forEach(nodeId => {
      fullData.links.forEach((l: any) => {
        if (l.source === nodeId || l.target === nodeId) {
          visibleNodeIds.add(l.source);
          visibleNodeIds.add(l.target);
        }
      });
    });

    // Build nodes array
    visibleNodeIds.forEach(id => {
      const nodeData = nodeMap.get(id);
      if (nodeData && nodeData.type !== 'contributor') {
        const isExpanded = expandedNodes.has(id);
        const connCount = connectionCounts.get(id) || 0;
        nodes.push({
          ...nodeData,
          size: nodeData.type === 'project'
            ? (isExpanded ? 32 : (nodeData.tier === 'osint' ? 26 : 22))
            : 14,
          expanded: isExpanded,
          connectionCount: connCount,
        });
      }
    });

    // Build links - only show links connected to expanded nodes
    const nodeIdSet = new Set(nodes.map(n => n.id));
    fullData.links.forEach((l: any) => {
      if (nodeIdSet.has(l.source) && nodeIdSet.has(l.target)) {
        // Only show link if at least one end is expanded
        const sourceExpanded = expandedNodes.has(l.source);
        const targetExpanded = expandedNodes.has(l.target);
        if (sourceExpanded || targetExpanded) {
          links.push({ ...l });
        }
      }
    });

    setVisibleNodes(nodes);
    setVisibleLinks(links);
  }, [fullData, expandedNodes]);

  // Handle node expansion with smooth zoom
  const handleNodeExpand = useCallback((node: GraphNode, event: MouseEvent) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);

        // Smooth zoom to the expanded node
        if (svgRef.current && zoomRef.current && node.x && node.y) {
          const svg = d3.select(svgRef.current);
          const transform = d3.zoomIdentity
            .translate(width / 2 - node.x * 1.5, height / 2 - node.y * 1.5)
            .scale(1.5);

          svg.transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .call(zoomRef.current.transform, transform);
        }
      }
      return next;
    });
  }, [width, height]);

  // Handle navigation
  const handleNavigate = useCallback((node: GraphNode) => {
    if (node.type === 'project') {
      router.push(`/projects/${node.id}`);
    }
  }, [router]);

  // Render graph
  useEffect(() => {
    if (!svgRef.current || visibleNodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Setup zoom with ref for external access
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    zoomRef.current = zoom;
    svg.call(zoom);

    // Create simulation with adjusted forces
    const simulation = d3.forceSimulation<GraphNode>(visibleNodes)
      .force('link', d3.forceLink<GraphNode, any>(visibleLinks)
        .id(d => d.id)
        .distance(d => {
          // Longer distance for expanded nodes
          const source = d.source as GraphNode;
          const target = d.target as GraphNode;
          return (source.expanded || target.expanded) ? 120 : 80;
        })
        .strength(0.3)
      )
      .force('charge', d3.forceManyBody()
        .strength(d => (d as GraphNode).expanded ? -400 : -150)
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as GraphNode).size + 15))
      .force('x', d3.forceX(width / 2).strength(0.02))
      .force('y', d3.forceY(height / 2).strength(0.02));

    // Draw links with animation
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(visibleLinks)
      .join('line')
      .attr('stroke', d => {
        if (d.type === 'uses_language') return '#89b4fa';
        if (d.type === 'tagged_with') return '#a6e3a1';
        if (d.type === 'licensed_under') return '#f9e2af';
        return '#444';
      })
      .attr('stroke-opacity', 0)
      .attr('stroke-width', 2)
      .transition()
      .duration(300)
      .attr('stroke-opacity', 0.6);

    // Tooltip
    d3.selectAll('.ecosystem-tooltip').remove();
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'ecosystem-tooltip')
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
      .style('max-width', '250px');

    // Draw nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(visibleNodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Add shapes
    node.each(function(d) {
      const el = d3.select(this);
      const size = d.size;
      const isExpanded = d.expanded;

      if (d.type === 'project') {
        el.append('circle')
          .attr('r', size)
          .attr('fill', d.tier === 'osint' ? '#b8e8e0' : NODE_COLORS.project)
          .attr('stroke', isExpanded ? '#fff' : '#74b8b0')
          .attr('stroke-width', isExpanded ? 4 : 2)
          .attr('opacity', 0.9);

        // Connection count badge
        if (d.connectionCount && d.connectionCount > 0 && !isExpanded) {
          el.append('circle')
            .attr('r', 8)
            .attr('cx', size * 0.7)
            .attr('cy', -size * 0.7)
            .attr('fill', '#333')
            .attr('stroke', '#555')
            .attr('stroke-width', 1);
          el.append('text')
            .attr('x', size * 0.7)
            .attr('y', -size * 0.7 + 3)
            .attr('text-anchor', 'middle')
            .attr('fill', '#aaa')
            .attr('font-size', '9px')
            .text(d.connectionCount > 9 ? '9+' : d.connectionCount);
        }
      } else if (d.type === 'language') {
        // Hexagon for language
        const hexPoints = Array.from({ length: 6 }, (_, i) => {
          const angle = (i * 60 - 30) * Math.PI / 180;
          return `${Math.cos(angle) * size},${Math.sin(angle) * size}`;
        }).join(' ');
        el.append('polygon')
          .attr('points', hexPoints)
          .attr('fill', NODE_COLORS.language)
          .attr('stroke', isExpanded ? '#fff' : '#7aa2d8')
          .attr('stroke-width', isExpanded ? 3 : 2);
      } else if (d.type === 'topic') {
        // Diamond for topic
        const diamondPoints = `0,${-size} ${size},0 0,${size} ${-size},0`;
        el.append('polygon')
          .attr('points', diamondPoints)
          .attr('fill', NODE_COLORS.topic)
          .attr('stroke', isExpanded ? '#fff' : '#8dc48d')
          .attr('stroke-width', isExpanded ? 3 : 2);
      } else if (d.type === 'license') {
        // Square for license
        el.append('rect')
          .attr('x', -size)
          .attr('y', -size)
          .attr('width', size * 2)
          .attr('height', size * 2)
          .attr('fill', NODE_COLORS.license)
          .attr('stroke', isExpanded ? '#fff' : '#d8c58d')
          .attr('stroke-width', isExpanded ? 3 : 2);
      }
    });

    // Labels
    node.append('text')
      .text(d => d.name.length > 14 ? d.name.slice(0, 12) + '..' : d.name)
      .attr('x', 0)
      .attr('y', d => d.size + 16)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.expanded ? '#fff' : '#888')
      .attr('font-size', d => d.type === 'project' ? '11px' : '9px')
      .attr('font-weight', d => d.expanded ? '600' : '400')
      .attr('pointer-events', 'none');

    // Drag behavior
    const drag = d3.drag<SVGGElement, GraphNode>()
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
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    // Interaction handlers
    let clickTimeout: NodeJS.Timeout | null = null;
    let lastClickTime = 0;

    node
      .on('mouseover', function(event, d) {
        const isExpanded = expandedNodes.has(d.id);
        let hint = '';
        if (d.type === 'project') {
          hint = isExpanded
            ? 'Click to collapse • Double-click for details'
            : `Click to expand ${d.connectionCount || 0} connections • Double-click for details`;
        } else {
          hint = 'Shows related projects';
        }

        tooltip
          .html(`
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${d.name}</div>
            <div style="color: ${NODE_COLORS[d.type]}; font-size: 10px; text-transform: uppercase; margin-bottom: 6px;">${d.type}</div>
            ${d.tier ? `<div style="color: #94e2d5; font-size: 10px; margin-bottom: 4px;">✦ ${d.tier === 'osint' ? 'OSINT Deep Dive' : 'Standard'}</div>` : ''}
            <div style="color: #555; font-size: 10px; margin-top: 6px;">${hint}</div>
          `)
          .style('opacity', 1)
          .style('left', (event.pageX + 12) + 'px')
          .style('top', (event.pageY - 12) + 'px');

        d3.select(this).select('circle, polygon, rect')
          .transition()
          .duration(100)
          .attr('stroke-width', 4);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 12) + 'px')
          .style('top', (event.pageY - 12) + 'px');
      })
      .on('mouseout', function(event, d) {
        tooltip.style('opacity', 0);
        const isExpanded = expandedNodes.has(d.id);
        d3.select(this).select('circle, polygon, rect')
          .transition()
          .duration(100)
          .attr('stroke-width', isExpanded ? 4 : 2);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        const now = Date.now();

        if (now - lastClickTime < 300) {
          // Double click - navigate
          if (clickTimeout) clearTimeout(clickTimeout);
          clickTimeout = null;
          if (d.type === 'project') {
            handleNavigate(d);
          }
        } else {
          // Single click - expand after delay
          clickTimeout = setTimeout(() => {
            handleNodeExpand(d, event);
            clickTimeout = null;
          }, 300);
        }
        lastClickTime = now;
      });

    // Simulation tick
    simulation.on('tick', () => {
      g.selectAll('.links line')
        .attr('x1', (d: any) => d.source.x || 0)
        .attr('y1', (d: any) => d.source.y || 0)
        .attr('x2', (d: any) => d.target.x || 0)
        .attr('y2', (d: any) => d.target.y || 0);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      tooltip.remove();
      simulation.stop();
    };
  }, [visibleNodes, visibleLinks, width, height, expandedNodes, handleNodeExpand, handleNavigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-[#0a0a0a] rounded-lg">
        <div className="animate-spin w-8 h-8 border-2 border-[#94e2d5] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-[#6c7086]">
          {expandedNodes.size === 0
            ? 'Click any project to explore connections'
            : `${expandedNodes.size} expanded • ${visibleLinks.length} connections shown`
          }
        </div>
        {expandedNodes.size > 0 && (
          <button
            onClick={() => {
              setExpandedNodes(new Set());
              // Reset zoom
              if (svgRef.current && zoomRef.current) {
                d3.select(svgRef.current)
                  .transition()
                  .duration(500)
                  .call(zoomRef.current.transform, d3.zoomIdentity);
              }
            }}
            className="px-3 py-1.5 text-xs bg-[#1a1a1a] hover:bg-[#252525] text-[#a6adc8] rounded border border-[#333] transition-colors"
          >
            Reset View
          </button>
        )}
      </div>

      {/* Legend with proper shapes */}
      <div className="flex items-center gap-6 text-xs text-[#6c7086]">
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="-8 -8 16 16">
            <circle r="6" fill="#94e2d5" stroke="#74b8b0" strokeWidth="1.5"/>
          </svg>
          project
        </span>
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="-8 -8 16 16">
            <polygon points="0,-6 5.2,-3 5.2,3 0,6 -5.2,3 -5.2,-3" fill="#89b4fa" stroke="#7aa2d8" strokeWidth="1.5"/>
          </svg>
          language
        </span>
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="-8 -8 16 16">
            <polygon points="0,-6 6,0 0,6 -6,0" fill="#a6e3a1" stroke="#8dc48d" strokeWidth="1.5"/>
          </svg>
          topic
        </span>
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="-8 -8 16 16">
            <rect x="-5" y="-5" width="10" height="10" fill="#f9e2af" stroke="#d8c58d" strokeWidth="1.5"/>
          </svg>
          license
        </span>
      </div>

      {/* Graph */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-[#0a0a0a] rounded-lg border border-[#252525]"
      />

      {/* Help */}
      <p className="text-xs text-[#444]">
        Drag to pan • Scroll to zoom • Click to expand • Double-click projects for details
      </p>
    </div>
  );
}
