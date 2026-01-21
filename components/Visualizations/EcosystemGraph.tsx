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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [fullData, setFullData] = useState<FullGraphData | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [visibleNodes, setVisibleNodes] = useState<GraphNode[]>([]);
  const [visibleLinks, setVisibleLinks] = useState<GraphLink[]>([]);
  const [viewMode, setViewMode] = useState<'projects' | 'explore'>('projects');

  // Get focus from URL params
  const focusNode = searchParams.get('focus') || initialFocus;

  // Load graph data
  useEffect(() => {
    fetch('/data/research-graph.json')
      .then(res => res.json())
      .then(data => {
        setFullData(data);
        setLoading(false);

        // If there's a focus node, start with that expanded
        if (focusNode) {
          setExpandedNodes(new Set([focusNode]));
          setViewMode('explore');
        }
      })
      .catch(err => {
        console.error('Failed to load graph data:', err);
        setLoading(false);
      });
  }, [focusNode]);

  // Calculate visible nodes based on view mode and expanded nodes
  useEffect(() => {
    if (!fullData) return;

    const nodeMap = new Map<string, any>();
    fullData.nodes.forEach(n => nodeMap.set(n.id, n));

    let nodes: GraphNode[] = [];
    let links: GraphLink[] = [];

    if (viewMode === 'projects') {
      // Show all projects overview (no links, just project nodes)
      nodes = fullData.nodes
        .filter((n: any) => n.type === 'project')
        .map((n: any) => ({
          ...n,
          size: n.tier === 'osint' ? 28 : 22,
          expanded: false,
        }));
      links = [];
    } else {
      // Explore mode - show expanded nodes and their connections
      const visibleNodeIds = new Set<string>();

      // If no nodes expanded, show a starting set of projects
      if (expandedNodes.size === 0) {
        // Show first 8 projects as starting points
        const projectNodes = fullData.nodes.filter((n: any) => n.type === 'project').slice(0, 8);
        projectNodes.forEach((n: any) => visibleNodeIds.add(n.id));
      } else {
        // Add all expanded nodes and their direct connections
        expandedNodes.forEach(nodeId => {
          visibleNodeIds.add(nodeId);
          fullData.links.forEach((l: any) => {
            if (l.source === nodeId || l.target === nodeId) {
              visibleNodeIds.add(l.source);
              visibleNodeIds.add(l.target);
            }
          });
        });
      }

      // Build node array (exclude contributors for cleaner view)
      visibleNodeIds.forEach(id => {
        const nodeData = nodeMap.get(id);
        if (nodeData && nodeData.type !== 'contributor') {
          nodes.push({
            ...nodeData,
            size: nodeData.type === 'project' ? (expandedNodes.has(id) ? 30 : 22) : 16,
            expanded: expandedNodes.has(id),
          });
        }
      });

      // Build links array
      const nodeIdSet = new Set(nodes.map(n => n.id));
      fullData.links.forEach((l: any) => {
        if (nodeIdSet.has(l.source) && nodeIdSet.has(l.target)) {
          links.push({ ...l });
        }
      });
    }

    setVisibleNodes(nodes);
    setVisibleLinks(links);
  }, [fullData, expandedNodes, viewMode]);

  // Handle node expansion
  const handleNodeExpand = useCallback((node: GraphNode) => {
    if (viewMode === 'projects') {
      // Switch to explore mode with this node
      setViewMode('explore');
      setExpandedNodes(new Set([node.id]));
    } else {
      // Toggle expansion
      setExpandedNodes(prev => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
    }
  }, [viewMode]);

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

    // Setup zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(visibleNodes)
      .force('link', d3.forceLink<GraphNode, any>(visibleLinks)
        .id(d => d.id)
        .distance(viewMode === 'projects' ? 80 : 100)
        .strength(viewMode === 'projects' ? 0.1 : 0.4)
      )
      .force('charge', d3.forceManyBody().strength(viewMode === 'projects' ? -100 : -250))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as GraphNode).size + 20))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03));

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
    d3.selectAll('.ecosystem-tooltip').remove();
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'ecosystem-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(17, 17, 17, 0.95)')
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

    // Add shapes based on node type
    node.each(function(d) {
      const el = d3.select(this);
      const size = d.size;
      const isExpanded = d.expanded;

      if (d.type === 'project') {
        el.append('circle')
          .attr('r', size)
          .attr('fill', d.tier === 'osint' ? '#b8e8e0' : NODE_COLORS.project)
          .attr('stroke', isExpanded ? '#fff' : '#74b8b0')
          .attr('stroke-width', isExpanded ? 4 : 2);

        // Add expand indicator
        if (!isExpanded && viewMode === 'explore') {
          el.append('circle')
            .attr('r', 6)
            .attr('cx', size * 0.7)
            .attr('cy', -size * 0.7)
            .attr('fill', '#222')
            .attr('stroke', '#666')
            .attr('stroke-width', 1);
          el.append('text')
            .attr('x', size * 0.7)
            .attr('y', -size * 0.7 + 4)
            .attr('text-anchor', 'middle')
            .attr('fill', '#aaa')
            .attr('font-size', '10px')
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
      .text(d => d.name.length > 14 ? d.name.slice(0, 12) + '..' : d.name)
      .attr('x', 0)
      .attr('y', d => d.size + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.expanded ? '#fff' : '#a6adc8')
      .attr('font-size', d => d.type === 'project' ? '12px' : '10px')
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

    // Click handling with double-click detection
    let clickTimer: NodeJS.Timeout | null = null;

    node
      .on('mouseover', function(event, d) {
        const isExpanded = expandedNodes.has(d.id);
        let hint = '';
        if (viewMode === 'projects') {
          hint = 'Click to explore connections • Double-click for details';
        } else if (d.type === 'project') {
          hint = isExpanded
            ? 'Click to collapse • Double-click for details'
            : 'Click to expand • Double-click for details';
        } else {
          hint = isExpanded
            ? 'Click to collapse connections'
            : 'Click to show related projects';
        }

        tooltip
          .html(`
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${d.name}</div>
            <div style="color: ${NODE_COLORS[d.type]}; font-size: 10px; text-transform: uppercase; margin-bottom: 8px;">${d.type}</div>
            ${d.tier ? `<div style="color: #94e2d5; font-size: 10px; margin-bottom: 4px;">✦ ${d.tier === 'osint' ? 'OSINT Deep Dive' : 'Standard Research'}</div>` : ''}
            <div style="color: #666; font-size: 10px; margin-top: 8px;">${hint}</div>
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
        d3.select(this).select('circle, polygon, rect')
          .transition()
          .duration(150)
          .attr('stroke-width', isExpanded ? 4 : 2);
      })
      .on('click', function(event, d) {
        event.stopPropagation();

        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
          // Double click - navigate
          if (d.type === 'project') {
            handleNavigate(d);
          }
        } else {
          clickTimer = setTimeout(() => {
            clickTimer = null;
            // Single click - expand/collapse
            handleNodeExpand(d);
          }, 250);
        }
      });

    // Update positions
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
  }, [visibleNodes, visibleLinks, viewMode, width, height, expandedNodes, handleNodeExpand, handleNavigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-[#0a0a0a] rounded-lg">
        <div className="animate-spin w-8 h-8 border-2 border-[#94e2d5] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View mode toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setViewMode('projects');
              setExpandedNodes(new Set());
            }}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              viewMode === 'projects'
                ? 'bg-[#94e2d5] text-[#0a0a0a] font-medium'
                : 'bg-[#1a1a1a] text-[#a6adc8] hover:bg-[#252525]'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => {
              if (viewMode === 'projects') {
                setViewMode('explore');
                // Start with a few random projects expanded
                const projects = fullData?.nodes.filter((n: any) => n.type === 'project').slice(0, 3) || [];
                setExpandedNodes(new Set(projects.map((p: any) => p.id)));
              }
            }}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              viewMode === 'explore'
                ? 'bg-[#94e2d5] text-[#0a0a0a] font-medium'
                : 'bg-[#1a1a1a] text-[#a6adc8] hover:bg-[#252525]'
            }`}
          >
            Explore Connections
          </button>
        </div>

        {viewMode === 'explore' && expandedNodes.size > 0 && (
          <button
            onClick={() => setExpandedNodes(new Set())}
            className="px-3 py-1.5 text-xs bg-[#1a1a1a] hover:bg-[#252525] text-[#a6adc8] rounded border border-[#333] transition-colors"
          >
            Reset View
          </button>
        )}
      </div>

      {/* Stats and Legend */}
      <div className="flex items-center justify-between text-xs text-[#6c7086]">
        <div className="flex gap-4">
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
        <div className="text-[#444]">
          {visibleNodes.length} nodes • {visibleLinks.length} connections
        </div>
      </div>

      {/* Graph */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-[#0a0a0a] rounded-lg border border-[#252525]"
      />

      {/* Help text */}
      <p className="text-xs text-[#555]">
        {viewMode === 'projects'
          ? '💡 Click any project to explore its connections'
          : '💡 Click to expand/collapse • Double-click projects to view details • Drag to rearrange • Scroll to zoom'
        }
      </p>
    </div>
  );
}
