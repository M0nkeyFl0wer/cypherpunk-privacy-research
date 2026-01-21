'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

interface ProjectMiniGraphProps {
  projectId: string;
  width?: number;
  height?: number;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'project' | 'language' | 'topic' | 'license' | 'contributor';
  size: number;
  tier?: 'osint' | 'standard';
  expanded?: boolean;
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

const NODE_COLORS: Record<string, string> = {
  project: '#94e2d5',
  language: '#89b4fa',
  topic: '#a6e3a1',
  license: '#f9e2af',
  contributor: '#cba6f7',
};

export default function ProjectMiniGraph({ projectId, width = 400, height = 400 }: ProjectMiniGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullData, setFullData] = useState<FullGraphData | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([projectId]));
  const [visibleNodes, setVisibleNodes] = useState<GraphNode[]>([]);
  const [visibleLinks, setVisibleLinks] = useState<GraphLink[]>([]);
  const simulationRef = useRef<d3.Simulation<GraphNode, undefined> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Load full graph data once
  useEffect(() => {
    fetch('/data/research-graph.json')
      .then(res => res.json())
      .then(data => {
        setFullData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load graph:', err);
        setError('Failed to load graph data');
        setLoading(false);
      });
  }, []);

  // Calculate visible nodes based on expanded nodes
  useEffect(() => {
    if (!fullData) return;

    const nodeMap = new Map<string, any>();
    fullData.nodes.forEach(n => nodeMap.set(n.id, n));

    const visibleNodeIds = new Set<string>();
    const linksToShow: GraphLink[] = [];

    // For each expanded node, add it and its direct connections
    expandedNodes.forEach(nodeId => {
      visibleNodeIds.add(nodeId);

      // Find all links connected to this node
      fullData.links.forEach((l: any) => {
        if (l.source === nodeId || l.target === nodeId) {
          visibleNodeIds.add(l.source);
          visibleNodeIds.add(l.target);
        }
      });
    });

    // Now collect links that connect visible nodes
    fullData.links.forEach((l: any) => {
      if (visibleNodeIds.has(l.source) && visibleNodeIds.has(l.target)) {
        linksToShow.push({ ...l });
      }
    });

    // Build node array (exclude contributors for cleaner view unless expanded)
    const nodes: GraphNode[] = [];
    visibleNodeIds.forEach(id => {
      const nodeData = nodeMap.get(id);
      if (nodeData && nodeData.type !== 'contributor') {
        nodes.push({
          ...nodeData,
          size: nodeData.type === 'project' ? (expandedNodes.has(id) ? 28 : 20) : 14,
          expanded: expandedNodes.has(id),
        });
      }
    });

    // Filter links to only include ones where both nodes exist
    const nodeIdSet = new Set(nodes.map(n => n.id));
    const validLinks = linksToShow.filter(l =>
      nodeIdSet.has(l.source as string) && nodeIdSet.has(l.target as string)
    );

    setVisibleNodes(nodes);
    setVisibleLinks(validLinks);
  }, [fullData, expandedNodes]);

  // Handle node expansion (single click) with smooth zoom
  const handleNodeExpand = useCallback((node: GraphNode) => {
    if (node.id === projectId) return; // Don't collapse the main project

    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        // Already expanded - collapse it
        next.delete(node.id);
      } else {
        // Expand it and zoom smoothly
        next.add(node.id);

        // Smooth zoom to the expanded node
        if (svgRef.current && zoomRef.current && node.x !== undefined && node.y !== undefined) {
          const svg = d3.select(svgRef.current);
          const transform = d3.zoomIdentity
            .translate(width / 2 - node.x * 1.3, height / 2 - node.y * 1.3)
            .scale(1.3);
          svg.transition()
            .duration(400)
            .ease(d3.easeCubicInOut)
            .call(zoomRef.current.transform, transform);
        }
      }
      return next;
    });
  }, [projectId, width, height]);

  // Handle navigation (double click)
  const handleNavigate = useCallback((node: GraphNode) => {
    if (node.type === 'project' && node.id !== projectId) {
      router.push(`/projects/${node.id}`);
    } else if (node.type !== 'project') {
      router.push(`/portal?focus=${node.id}&type=${node.type}`);
    }
  }, [router, projectId]);

  // Render the graph
  useEffect(() => {
    if (!svgRef.current || visibleNodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Setup zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);
    zoomRef.current = zoom;

    // Center initial view
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2 - 200, height / 2 - 200).scale(1));

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(visibleNodes)
      .force('link', d3.forceLink<GraphNode, any>(visibleLinks)
        .id(d => d.id)
        .distance(80)
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as GraphNode).size + 15))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    simulationRef.current = simulation;

    // Draw links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(visibleLinks)
      .join('line')
      .attr('stroke', d => {
        if (d.type === 'uses_language') return '#89b4fa';
        if (d.type === 'tagged_with') return '#a6e3a1';
        if (d.type === 'licensed_under') return '#f9e2af';
        if (d.type === 'contributed_to') return '#cba6f7';
        return '#333';
      })
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', 2);

    // Tooltip
    d3.selectAll('.mini-graph-tooltip').remove();
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'mini-graph-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(17, 17, 17, 0.95)')
      .style('border', '1px solid #333')
      .style('border-radius', '8px')
      .style('padding', '10px 14px')
      .style('color', '#e0e0e0')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000)
      .style('max-width', '200px');

    // Draw nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(visibleNodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Add shapes based on node type
    node.each(function(d) {
      const el = d3.select(this);
      const size = d.size;
      const isCenter = d.id === projectId;
      const isExpanded = d.expanded;

      if (d.type === 'project') {
        el.append('circle')
          .attr('r', size)
          .attr('fill', isCenter ? '#b8e8e0' : (d.tier === 'osint' ? '#a8d8d0' : NODE_COLORS.project))
          .attr('stroke', isExpanded ? '#fff' : '#74b8b0')
          .attr('stroke-width', isCenter ? 4 : (isExpanded ? 3 : 2));

        // Add expand indicator for non-center projects
        if (!isCenter && !isExpanded) {
          el.append('circle')
            .attr('r', 5)
            .attr('cx', size * 0.7)
            .attr('cy', -size * 0.7)
            .attr('fill', '#333')
            .attr('stroke', '#666')
            .attr('stroke-width', 1);
          el.append('text')
            .attr('x', size * 0.7)
            .attr('y', -size * 0.7 + 3)
            .attr('text-anchor', 'middle')
            .attr('fill', '#aaa')
            .attr('font-size', '8px')
            .text('+');
        }
      } else if (d.type === 'language') {
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
        const diamondPoints = `0,${-size} ${size},0 0,${size} ${-size},0`;
        el.append('polygon')
          .attr('points', diamondPoints)
          .attr('fill', NODE_COLORS.topic)
          .attr('stroke', isExpanded ? '#fff' : '#8dc48d')
          .attr('stroke-width', isExpanded ? 3 : 2);
      } else if (d.type === 'license') {
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
      .text(d => d.name.length > 12 ? d.name.slice(0, 10) + '..' : d.name)
      .attr('x', 0)
      .attr('y', d => d.size + 16)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.id === projectId ? '#fff' : '#a6adc8')
      .attr('font-size', d => d.type === 'project' ? '12px' : '10px')
      .attr('font-weight', d => d.id === projectId ? '600' : '400')
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

    // Click handling with timestamp-based double-click detection
    node
      .on('mouseover', function(event, d) {
        const isExpanded = expandedNodes.has(d.id);
        let hint = '';
        if (d.id === projectId) {
          hint = 'Current project (center)';
        } else if (d.type === 'project') {
          hint = isExpanded
            ? 'Click to collapse • Double-click to open'
            : 'Click to expand connections • Double-click to open';
        } else {
          hint = isExpanded
            ? 'Click to collapse • Double-click to explore'
            : 'Click to expand • Double-click to explore';
        }

        tooltip
          .html(`
            <div style="font-weight: 600; margin-bottom: 4px;">${d.name}</div>
            <div style="color: ${NODE_COLORS[d.type]}; font-size: 10px; text-transform: uppercase; margin-bottom: 4px;">${d.type}</div>
            <div style="color: #888; font-size: 10px;">${hint}</div>
          `)
          .style('opacity', 1)
          .style('left', (event.pageX + 12) + 'px')
          .style('top', (event.pageY - 12) + 'px');

        d3.select(this).select('circle, polygon, rect')
          .transition()
          .duration(150)
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
        const isCenter = d.id === projectId;
        d3.select(this).select('circle, polygon, rect')
          .transition()
          .duration(150)
          .attr('stroke-width', isCenter ? 4 : (isExpanded ? 3 : 2));
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        // Single click - expand/collapse connections
        handleNodeExpand(d);
      })
      .on('dblclick', function(event, d) {
        event.stopPropagation();
        event.preventDefault();
        // Double click - navigate to project/page
        handleNavigate(d);
      });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x || 0)
        .attr('y1', d => (d.source as GraphNode).y || 0)
        .attr('x2', d => (d.target as GraphNode).x || 0)
        .attr('y2', d => (d.target as GraphNode).y || 0);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Cleanup
    return () => {
      tooltip.remove();
      simulation.stop();
    };
  }, [visibleNodes, visibleLinks, projectId, width, height, expandedNodes, handleNodeExpand, handleNavigate]);

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
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] rounded-lg">
          <div className="animate-spin w-8 h-8 border-2 border-[#94e2d5] border-t-transparent rounded-full"></div>
        </div>
      )}
      <svg
        ref={svgRef}
        className="bg-[#0a0a0a] rounded-lg border border-[#252525]"
        width={width}
        height={height}
        style={{ opacity: loading ? 0.3 : 1 }}
      />

      {/* Stats bar with SVG legend */}
      <div className="flex items-center justify-between mt-3 text-xs text-[#6c7086]">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="-7 -7 14 14">
              <circle r="5" fill="#94e2d5" stroke="#74b8b0" strokeWidth="1"/>
            </svg>
            project
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="-7 -7 14 14">
              <polygon points="0,-5 4.3,-2.5 4.3,2.5 0,5 -4.3,2.5 -4.3,-2.5" fill="#89b4fa" stroke="#7aa2d8" strokeWidth="1"/>
            </svg>
            language
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="-7 -7 14 14">
              <polygon points="0,-5 5,0 0,5 -5,0" fill="#a6e3a1" stroke="#8dc48d" strokeWidth="1"/>
            </svg>
            topic
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="-7 -7 14 14">
              <rect x="-4" y="-4" width="8" height="8" fill="#f9e2af" stroke="#d8c58d" strokeWidth="1"/>
            </svg>
            license
          </span>
        </div>
        <div className="text-[#555]">
          {visibleNodes.length} nodes • {visibleLinks.length} links
        </div>
      </div>

      {/* Reset button */}
      {expandedNodes.size > 1 && (
        <button
          onClick={() => setExpandedNodes(new Set([projectId]))}
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-[#1a1a1a] hover:bg-[#252525] text-[#a6adc8] rounded border border-[#333] transition-colors"
        >
          Reset view
        </button>
      )}
    </div>
  );
}
