'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'project' | 'language' | 'topic' | 'license' | 'contributor';
  size: number;
  tier?: 'osint' | 'standard';
  stars?: number;
  count?: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
  weight?: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface ObsidianGraphProps {
  width?: number;
  height?: number;
  initialFilter?: string[];
  initialZoom?: number;
  projectsOnly?: boolean; // Start with only projects visible
}

const NODE_COLORS: Record<string, string> = {
  project: '#94e2d5',      // Cyan for projects (OLED-first)
  language: '#89b4fa',     // Blue for languages
  topic: '#a6e3a1',        // Green for topics
  license: '#f9e2af',      // Yellow for licenses
  contributor: '#f38ba8',  // Red/pink for contributors
};

const NODE_SHAPES: Record<string, string> = {
  project: 'circle',
  language: 'hexagon',
  topic: 'diamond',
  license: 'square',
  contributor: 'circle',
};

export default function ObsidianGraph({ width = 1000, height = 700, initialFilter, initialZoom = 1, projectsOnly = false }: ObsidianGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(projectsOnly ? ['project'] : (initialFilter || ['project', 'language', 'topic']))
  );
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [focusedNode, setFocusedNode] = useState<GraphNode | null>(null); // For sub-graph view

  // Load data
  useEffect(() => {
    fetch('/data/research-graph.json')
      .then(res => res.json())
      .then(graphData => {
        setData({
          nodes: graphData.nodes,
          links: graphData.links,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load graph data:', err);
        setLoading(false);
      });
  }, []);

  // Render graph
  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Filter nodes and links based on active filters AND focused node
    let filteredNodes: GraphNode[];
    let filteredLinks: GraphLink[];

    if (focusedNode) {
      // Sub-graph mode: show only the focused node and its direct connections
      const connectedProjectIds = new Set<string>();
      data.links.forEach(l => {
        const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
        const targetId = typeof l.target === 'string' ? l.target : l.target.id;
        if (sourceId === focusedNode.id) connectedProjectIds.add(targetId);
        if (targetId === focusedNode.id) connectedProjectIds.add(sourceId);
      });
      connectedProjectIds.add(focusedNode.id);

      filteredNodes = data.nodes.filter(n => connectedProjectIds.has(n.id));
      filteredLinks = data.links.filter(l => {
        const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
        const targetId = typeof l.target === 'string' ? l.target : l.target.id;
        return connectedProjectIds.has(sourceId) && connectedProjectIds.has(targetId);
      });
    } else {
      // Normal mode: filter by type
      filteredNodes = data.nodes.filter(n => activeFilters.has(n.type));
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredLinks = data.links.filter(l => {
        const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
        const targetId = typeof l.target === 'string' ? l.target : l.target.id;
        return nodeIds.has(sourceId) && nodeIds.has(targetId);
      });
    }

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Add gradient definitions for OSINT projects
    const defs = svg.append('defs');

    const osintGradient = defs.append('radialGradient')
      .attr('id', 'osint-gradient');
    osintGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#b8e8e0');
    osintGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#94e2d5');

    // Container for zoom
    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Apply initial zoom - center and scale appropriately
    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(initialZoom)
      .translate(-width / 2, -height / 2);
    svg.call(zoom.transform, initialTransform);

    // Create simulation
    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(filteredLinks)
        .id(d => d.id)
        .distance(d => {
          // Shorter distances for language/topic connections
          const linkType = (d as any).type;
          if (linkType === 'uses_language' || linkType === 'tagged_with') return 60;
          return 100;
        })
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody()
        .strength(d => {
          // Projects attract more strongly
          if ((d as GraphNode).type === 'project') return -200;
          return -80;
        })
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius(d => (d as GraphNode).size + 5)
      )
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Draw links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(filteredLinks)
      .join('line')
      .attr('stroke', d => {
        const type = (d as any).type;
        if (type === 'uses_language') return '#89b4fa';
        if (type === 'tagged_with') return '#a6e3a1';
        if (type === 'licensed_under') return '#f9e2af';
        if (type === 'contributes_to') return '#f38ba8';
        return '#252525';
      })
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 1);

    // Draw nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(filteredNodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer') // All nodes are clickable now
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
      );

    // Add shapes based on type
    node.each(function(d) {
      const el = d3.select(this);
      const size = d.size || 10;

      if (d.type === 'project') {
        // Circle for projects
        el.append('circle')
          .attr('r', size)
          .attr('fill', d.tier === 'osint' ? 'url(#osint-gradient)' : NODE_COLORS.project)
          .attr('stroke', d.tier === 'osint' ? '#b8e8e0' : '#74b8b0')
          .attr('stroke-width', d.tier === 'osint' ? 3 : 1.5);
      } else if (d.type === 'language') {
        // Hexagon for languages
        const hexPoints = Array.from({ length: 6 }, (_, i) => {
          const angle = (i * 60 - 30) * Math.PI / 180;
          return `${Math.cos(angle) * size},${Math.sin(angle) * size}`;
        }).join(' ');
        el.append('polygon')
          .attr('points', hexPoints)
          .attr('fill', NODE_COLORS.language)
          .attr('stroke', '#7aa2d8')
          .attr('stroke-width', 1.5);
      } else if (d.type === 'topic') {
        // Diamond for topics
        const diamondPoints = `0,${-size} ${size},0 0,${size} ${-size},0`;
        el.append('polygon')
          .attr('points', diamondPoints)
          .attr('fill', NODE_COLORS.topic)
          .attr('stroke', '#8dc48d')
          .attr('stroke-width', 1.5);
      } else if (d.type === 'license') {
        // Square for licenses
        el.append('rect')
          .attr('x', -size)
          .attr('y', -size)
          .attr('width', size * 2)
          .attr('height', size * 2)
          .attr('fill', NODE_COLORS.license)
          .attr('stroke', '#d8c58d')
          .attr('stroke-width', 1.5);
      } else if (d.type === 'contributor') {
        // Small circle for contributors
        el.append('circle')
          .attr('r', size)
          .attr('fill', NODE_COLORS.contributor)
          .attr('stroke', '#d07890')
          .attr('stroke-width', 1);
      }
    });

    // Add labels for larger nodes
    node.filter(d => d.size >= 8 || d.type === 'project')
      .append('text')
      .text(d => d.name.length > 12 ? d.name.slice(0, 10) + '...' : d.name)
      .attr('x', 0)
      .attr('y', d => (d.size || 10) + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', '#a6adc8')
      .attr('font-size', d => d.type === 'project' ? '10px' : '8px')
      .attr('pointer-events', 'none');

    // Tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'obsidian-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(17, 17, 17, 0.95)')
      .style('border', '1px solid #252525')
      .style('border-radius', '8px')
      .style('padding', '12px')
      .style('color', '#e0e0e0')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000)
      .style('max-width', '300px')
      .style('box-shadow', '0 10px 25px rgba(0,0,0,0.5)');

    // Interactions
    node
      .on('mouseover', function(event, d) {
        setHoveredNode(d.id);

        // Highlight connected links
        link.attr('stroke-opacity', l => {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          return (sourceId === d.id || targetId === d.id) ? 0.8 : 0.1;
        }).attr('stroke-width', l => {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          return (sourceId === d.id || targetId === d.id) ? 2 : 1;
        });

        // Dim unconnected nodes
        const connectedIds = new Set([d.id]);
        filteredLinks.forEach(l => {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          if (sourceId === d.id) connectedIds.add(targetId);
          if (targetId === d.id) connectedIds.add(sourceId);
        });

        node.style('opacity', n => connectedIds.has(n.id) ? 1 : 0.3);

        // Show tooltip
        let content = `<div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${d.name}</div>`;
        content += `<div style="color: ${NODE_COLORS[d.type]}; font-size: 10px; text-transform: uppercase; margin-bottom: 8px;">${d.type}</div>`;

        if (d.type === 'project' && d.tier === 'osint') {
          content += `<div style="color: #94e2d5; font-size: 11px; margin-bottom: 4px;">OSINT Deep Dive</div>`;
        }
        if (d.stars) {
          content += `<div style="font-size: 11px;">Stars: ${d.stars.toLocaleString()}</div>`;
        }
        if (d.count) {
          content += `<div style="font-size: 11px;">Used by: ${d.count} projects</div>`;
        }

        const connectionCount = filteredLinks.filter(l => {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          return sourceId === d.id || targetId === d.id;
        }).length;

        content += `<div style="color: #6c7086; font-size: 10px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #252525;">${connectionCount} connections</div>`;

        // Show appropriate action hint based on context
        if (focusedNode && focusedNode.id === d.id) {
          // This is the currently focused node
          if (d.type === 'project') {
            content += `<div style="color: #94e2d5; font-size: 10px; margin-top: 4px;">Click again for full details →</div>`;
          } else {
            content += `<div style="color: #6c7086; font-size: 10px; margin-top: 4px; font-style: italic;">Currently viewing this ${d.type}</div>`;
          }
        } else if (d.type === 'project') {
          content += `<div style="color: #89b4fa; font-size: 10px; margin-top: 4px;">Click to explore connections</div>`;
        } else {
          content += `<div style="color: #89b4fa; font-size: 10px; margin-top: 4px;">Click to see related projects →</div>`;
        }

        tooltip
          .html(content)
          .style('opacity', 1)
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        setHoveredNode(null);
        link.attr('stroke-opacity', 0.3).attr('stroke-width', 1);
        node.style('opacity', 1);
        tooltip.style('opacity', 0);
      })
      .on('click', function(event, d) {
        if (focusedNode && focusedNode.id === d.id) {
          // Second click on focused node: navigate to project page (if project)
          if (d.type === 'project') {
            router.push(`/projects/${d.id}`);
          }
        } else {
          // First click on any node: enter sub-graph focus mode
          setFocusedNode(d);
        }
      });

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [data, activeFilters, width, height, router, focusedNode]);

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-[#94e2d5] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Focus Mode Header */}
      {focusedNode && (
        <div className="mb-4 p-4 bg-[#111] rounded-lg border border-[#252525]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: NODE_COLORS[focusedNode.type] }}
              />
              <div>
                <div className="text-[#e0e0e0] font-medium">{focusedNode.name}</div>
                <div className="text-xs text-[#6c7086]">
                  {focusedNode.type === 'project'
                    ? 'Explore this project\'s tech stack and connections'
                    : `Showing all projects using this ${focusedNode.type}`
                  }
                </div>
              </div>
            </div>
            <button
              onClick={() => setFocusedNode(null)}
              className="px-4 py-2 bg-[#252525] hover:bg-[#303030] text-[#e0e0e0] rounded-lg text-sm transition-colors"
            >
              ← Back to full graph
            </button>
          </div>
          {/* Action hints */}
          <div className="flex items-center gap-4 text-xs text-[#6c7086] pt-3 border-t border-[#252525]">
            {focusedNode.type === 'project' ? (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#94e2d5]">●</span>
                  Click the project again for full details
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#89b4fa]">●</span>
                  Click a language/topic to discover similar projects
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#94e2d5]">●</span>
                  Click any project to explore its connections
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#a6e3a1]">●</span>
                  Click another {focusedNode.type} to switch focus
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Legend & Filters - hide when focused */}
      {!focusedNode && (
        <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-[#111]/50 rounded-lg">
          <span className="text-sm text-[#6c7086]">Show:</span>
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                activeFilters.has(type)
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-[#111]/50 text-[#6c7086] opacity-50'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{type}s</span>
            </button>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="text-xs text-[#6c7086] mb-2 flex items-center gap-4">
        <span>Scroll to zoom</span>
        <span>•</span>
        <span>Drag to rearrange</span>
        <span>•</span>
        <span>Click to explore connections</span>
        <span>•</span>
        <span>Click again for full details</span>
      </div>

      {/* Graph */}
      <svg
        ref={svgRef}
        className="bg-[#111]/50 rounded-xl border border-[#252525]"
        style={{ width: '100%', height }}
      />

      {/* Stats */}
      {data && (
        <div className="mt-4 flex items-center gap-6 text-sm text-[#6c7086]">
          <span>
            {data.nodes.filter(n => activeFilters.has(n.type)).length} nodes
          </span>
          <span>
            {data.links.filter(l => {
              const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
              const targetId = typeof l.target === 'string' ? l.target : l.target.id;
              const nodeIds = new Set(data.nodes.filter(n => activeFilters.has(n.type)).map(n => n.id));
              return nodeIds.has(sourceId) && nodeIds.has(targetId);
            }).length} connections
          </span>
        </div>
      )}
    </div>
  );
}
