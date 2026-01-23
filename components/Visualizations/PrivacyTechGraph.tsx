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
  isChain?: boolean; // L1/L2 chain node
  parent?: string; // Parent chain (e.g., L2s have "ethereum" as parent)
  securityRisk?: 'low' | 'medium' | 'high'; // For bridges
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

// Projects that have detail pages (used to determine if clickable)
const PROJECTS_WITH_PAGES = new Set([
  'bitchat', 'cake-wallet', 'circom', 'concordium', 'confer', 'darkfi', 'deeper-network',
  'elusiv', 'fileverse', 'findora', 'firo', 'fluidkey', 'hop-protocol', 'hopr', 'iden3',
  'incognito', 'iron-fish', 'layerzero', 'mask-network', 'meshtastic', 'miden', 'mobilecoin',
  'monero', 'mysterium-network', 'nym', 'oasis-network', 'orchid', 'oxen', 'privatepool',
  'protonmail', 'rotki', 'secret-network', 'semaphore', 'sentinel', 'sienna-network', 'signal',
  'snarkjs', 'starkex', 'suterusu', 'telegram', 'tornado-cash', 'typhoon-network', 'wasabi-wallet',
  'webb-protocol', 'xx-network', 'zano', 'zcash', 'zeal', 'zk-money', 'zksync', 'zkvote'
]);

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

// Chain/ecosystem colors
const CHAIN_COLORS: Record<string, string> = {
  'ethereum': '#627eea',
  'arbitrum': '#28a0f0',
  'optimism': '#ff0420',
  'zksync-era': '#8c8dfc',
  'scroll': '#ffeeda',
  'polygon-zkevm': '#8247e5',
  'starknet': '#ec796b',
  'base': '#0052ff',
  'taiko': '#e81899',
  'linea': '#121212',
};

// Bridge security colors
const SECURITY_COLORS: Record<string, string> = {
  'low': '#a6e3a1',
  'medium': '#f9e2af',
  'high': '#f38ba8',
};

export default function PrivacyTechGraph({ width = 1000, height = 700, defaultFilter }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EcosystemData | null>(null);
  const [highlightedTech, setHighlightedTech] = useState<string | null>(defaultFilter || null);
  const [focusedEcosystem, setFocusedEcosystem] = useState<string | null>(null); // Chain/ecosystem filter
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const draggedRef = useRef(false); // Track if drag occurred to prevent click
  const expandedNodesRef = useRef<Set<string>>(new Set()); // Ref for click handler closure

  // Keep ref in sync with state for click handler closure
  useEffect(() => {
    expandedNodesRef.current = expandedNodes;
  }, [expandedNodes]);

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
    // Chain nodes get chain colors
    if (node.isChain && CHAIN_COLORS[node.id]) {
      return CHAIN_COLORS[node.id];
    }
    // Bridge nodes with security risk
    if (node.category === 'bridge' && node.securityRisk) {
      return SECURITY_COLORS[node.securityRisk] || TECH_COLORS.default;
    }
    if (!node.privacyTech || node.privacyTech.length === 0) return TECH_COLORS.default;
    const primaryTech = node.privacyTech[0];
    return TECH_COLORS[primaryTech] || TECH_COLORS.default;
  }, []);

  // Check if node is in focused ecosystem (chain or its L2s/projects)
  const isInFocusedEcosystem = useCallback((node: EcosystemNode): boolean => {
    if (!focusedEcosystem) return true; // No filter = show all

    // Direct match (the focused chain itself)
    if (node.id === focusedEcosystem) return true;

    // L2 of the focused chain
    if (node.parent === focusedEcosystem) return true;

    // Project on the focused ecosystem
    if (node.ecosystem === focusedEcosystem) return true;
    if (node.ecosystem === 'ethereum-l2' && focusedEcosystem === 'ethereum') return true;

    // Projects on L2s when Ethereum is focused
    if (focusedEcosystem === 'ethereum') {
      // Include all L2 projects
      if (node.ecosystem === 'ethereum-l2') return true;
      // Include projects that have ethereum parent chain
      const parentChain = data?.nodes.find(n => n.id === node.parent);
      if (parentChain?.parent === 'ethereum' || parentChain?.ecosystem === 'ethereum-l2') return true;
    }

    return false;
  }, [focusedEcosystem, data]);

  // Check if a node should be highlighted (matches tech filter, ecosystem filter, or is expanded)
  const isNodeHighlighted = useCallback((node: EcosystemNode): boolean => {
    if (expandedNodes.has(node.id)) return true;
    if (focusedEcosystem && isInFocusedEcosystem(node)) return true;
    if (!highlightedTech) return false;
    return node.privacyTech?.includes(highlightedTech) || false;
  }, [highlightedTech, expandedNodes, focusedEcosystem, isInFocusedEcosystem]);

  // Check if a node is connected to an expanded node
  const isConnectedToExpanded = useCallback((nodeId: string, edges: EcosystemEdge[]): boolean => {
    return edges.some(e => {
      const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
      const targetId = typeof e.target === 'string' ? e.target : e.target.id;
      return (expandedNodes.has(sourceId) && targetId === nodeId) ||
             (expandedNodes.has(targetId) && sourceId === nodeId);
    });
  }, [expandedNodes]);

  // Get visible edges (only show edges for expanded nodes, highlighted tech, or focused ecosystem)
  const getVisibleEdges = useCallback((edges: EcosystemEdge[]): EcosystemEdge[] => {
    if (expandedNodes.size === 0 && !highlightedTech && !focusedEcosystem) return [];

    return edges.filter(e => {
      const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
      const targetId = typeof e.target === 'string' ? e.target : e.target.id;

      // Show edge if either end is expanded
      if (expandedNodes.has(sourceId) || expandedNodes.has(targetId)) return true;

      // Show edge if both ends are in focused ecosystem
      if (focusedEcosystem) {
        const sourceNode = data?.nodes.find(n => n.id === sourceId);
        const targetNode = data?.nodes.find(n => n.id === targetId);
        if (sourceNode && targetNode && isInFocusedEcosystem(sourceNode) && isInFocusedEcosystem(targetNode)) {
          return true;
        }
      }

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
  }, [expandedNodes, highlightedTech, focusedEcosystem, data, isInFocusedEcosystem]);

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
    svg.call(zoom)
      .on('dblclick.zoom', null); // Disable double-click zoom so our node dblclick works

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
    // Chain nodes get hexagon shape via path
    node.filter(d => d.isChain === true)
      .append('path')
      .attr('d', d => {
        const size = expandedNodes.has(d.id) ? 32 : 28;
        // Hexagon path
        const a = size * 0.866; // cos(30)
        const b = size * 0.5;   // sin(30)
        return `M0,${-size} L${a},${-b} L${a},${b} L0,${size} L${-a},${b} L${-a},${-b} Z`;
      })
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', d => {
        if (expandedNodes.has(d.id)) return '#fff';
        if (focusedEcosystem === d.id) return '#fff';
        return '#333';
      })
      .attr('stroke-width', d => {
        if (expandedNodes.has(d.id) || focusedEcosystem === d.id) return 3;
        return 2;
      })
      .attr('opacity', d => {
        if (expandedNodes.has(d.id)) return 1;
        if (focusedEcosystem && !isInFocusedEcosystem(d)) return 0.2;
        if (focusedEcosystem && isInFocusedEcosystem(d)) return 1;
        return 0.9;
      });

    // Regular project nodes get circles
    node.filter(d => d.isChain !== true)
      .append('circle')
      .attr('r', d => {
        if (expandedNodes.has(d.id)) return 26;
        if (d.postQuantum) return 22;
        if (d.category === 'bridge') return 20; // Bridges slightly larger
        return 18;
      })
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', d => {
        if (expandedNodes.has(d.id)) return '#fff';
        if (d.postQuantum) return '#f9e2af';
        if (d.category === 'bridge' && d.securityRisk === 'high') return '#f38ba8';
        if (highlightedTech && d.privacyTech?.includes(highlightedTech)) return getNodeColor(d);
        return '#333';
      })
      .attr('stroke-width', d => {
        if (expandedNodes.has(d.id)) return 4;
        if (d.postQuantum) return 3;
        if (d.category === 'bridge') return 2.5;
        if (highlightedTech && d.privacyTech?.includes(highlightedTech)) return 3;
        return 1.5;
      })
      .attr('opacity', d => {
        // Full opacity for expanded, highlighted, or connected nodes
        if (expandedNodes.has(d.id)) return 1;
        if (focusedEcosystem && !isInFocusedEcosystem(d)) return 0.15;
        if (focusedEcosystem && isInFocusedEcosystem(d)) return 0.95;
        if (highlightedTech && d.privacyTech?.includes(highlightedTech)) return 0.95;
        if (isConnectedToExpanded(d.id, data.edges)) return 0.85;
        // Dim others when something is active
        if (expandedNodes.size > 0 || highlightedTech) return 0.3;
        return 0.85;
      });

    // Clickable indicator - subtle outer ring for nodes with project pages
    node.filter(d => PROJECTS_WITH_PAGES.has(d.id) && !d.isChain)
      .append('circle')
      .attr('r', d => {
        if (expandedNodes.has(d.id)) return 30;
        if (d.postQuantum) return 26;
        return 22;
      })
      .attr('fill', 'none')
      .attr('stroke', '#94e2d5')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.4)
      .attr('class', 'clickable-indicator');

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
        // Keep node where it was dragged (don't reset fx/fy)
        // This allows users to arrange the graph as they like
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

        // Build rich tooltip with project metadata
        const metadata = getProjectMetadata(d.id);
        const isExpanded = expandedNodes.has(d.id);

        let tooltipHtml = `
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: ${getNodeColor(d)}">${d.label}</div>
          <div style="font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 8px;">${d.category}</div>
        `;

        // Add project description if available
        if (metadata) {
          tooltipHtml += `<div style="color: #a6adc8; font-size: 11px; line-height: 1.5; margin-bottom: 8px; border-top: 1px solid #333; padding-top: 8px;">${metadata.description}</div>`;

          if (metadata.highlights && metadata.highlights.length > 0) {
            tooltipHtml += `<ul style="margin: 0 0 8px 0; padding-left: 14px; color: #888; font-size: 10px; line-height: 1.6;">`;
            metadata.highlights.forEach(h => {
              tooltipHtml += `<li style="color: #6c7086;">${h}</li>`;
            });
            tooltipHtml += `</ul>`;
          }
        }

        tooltipHtml += `
          <div style="margin-bottom: 8px;">
            <div style="font-size: 10px; color: #666; margin-bottom: 4px;">Privacy Technologies:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${d.privacyTech.map(t => `<span style="background: ${TECH_COLORS[t] || '#444'}; color: #1a1a1a; padding: 2px 6px; border-radius: 4px; font-size: 9px;">${t}</span>`).join('')}
            </div>
          </div>
          ${d.postQuantum ? '<div style="color: #f9e2af; font-size: 10px; margin-bottom: 6px;">⚛ Quantum Resistant</div>' : ''}
        `;

        // Dynamic hint based on state and whether project has a page
        const hasPage = PROJECTS_WITH_PAGES.has(d.id);
        let hint: string;
        if (d.isChain) {
          hint = 'Click to filter ecosystem';
        } else if (isExpanded && hasPage) {
          hint = '🔗 Click again to open project page';
        } else if (isExpanded && !hasPage) {
          hint = 'Research in progress - page coming soon';
        } else {
          hint = 'Click to expand connections';
        }
        tooltipHtml += `<div style="color: #555; font-size: 10px; margin-top: 8px; border-top: 1px solid #252525; padding-top: 6px;">${hint}</div>`;

        tooltip
          .html(tooltipHtml)
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

        // Skip if this was a drag
        if (draggedRef.current) return;

        // Chain nodes toggle ecosystem focus
        if (d.isChain) {
          if (focusedEcosystem === d.id) {
            // Already focused on this chain - clear focus
            setFocusedEcosystem(null);
          } else {
            // Focus on this chain's ecosystem
            setFocusedEcosystem(d.id);
            setHighlightedTech(null); // Clear tech filter when focusing ecosystem
          }
          return;
        }

        // Use ref to get CURRENT expanded state (avoids stale closure)
        const isCurrentlyExpanded = expandedNodesRef.current.has(d.id);

        console.log(`Click on ${d.id}: isExpanded=${isCurrentlyExpanded}, hasPage=${PROJECTS_WITH_PAGES.has(d.id)}`);

        if (isCurrentlyExpanded) {
          // Already expanded - navigate to project page (only if it exists)
          if (PROJECTS_WITH_PAGES.has(d.id)) {
            console.log(`Navigating to /projects/${d.id}`);
            router.push(`/projects/${d.id}`);
          } else {
            console.log(`No page for ${d.id} - research in progress`);
          }
        } else {
          // First click - expand to show connections
          console.log(`Expanding ${d.id}`);
          setExpandedNodes(prev => {
            const next = new Set(prev);
            next.add(d.id);
            return next;
          });
          setFocusedNode(d.id);

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
      })
      .on('dblclick', function(event, d) {
        event.stopPropagation();
        event.preventDefault();
        // Double-click navigates if project page exists
        if (PROJECTS_WITH_PAGES.has(d.id)) {
          router.push(`/projects/${d.id}`);
        }
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
  }, [data, highlightedTech, expandedNodes, focusedEcosystem, getVisibleEdges, getNodeColor, isConnectedToExpanded, isInFocusedEcosystem, width, height, router]);

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

  // Get chain nodes for filter buttons
  const chainNodes = data.nodes.filter(n => n.isChain);
  const bridgeCount = data.nodes.filter(n => n.category === 'bridge' || n.category === 'native-bridge').length;

  return (
    <div className="space-y-4">
      {/* Ecosystem/Chain filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-[#6c7086]">Focus ecosystem:</span>
        <button
          onClick={() => setFocusedEcosystem(null)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            !focusedEcosystem
              ? 'bg-[#94e2d5] text-[#1a1a1a]'
              : 'bg-[#1a1a1a] text-[#888] hover:bg-[#252525]'
          }`}
        >
          All Networks
        </button>
        {chainNodes.filter(n => n.category === 'layer1' || n.id === 'ethereum').slice(0, 1).map(chain => (
          <button
            key={chain.id}
            onClick={() => setFocusedEcosystem(focusedEcosystem === chain.id ? null : chain.id)}
            className={`px-3 py-1 text-xs rounded-full transition-colors flex items-center gap-1.5 ${
              focusedEcosystem === chain.id
                ? 'text-[#1a1a1a]'
                : 'bg-[#1a1a1a] text-[#888] hover:bg-[#252525]'
            }`}
            style={focusedEcosystem === chain.id ? { backgroundColor: CHAIN_COLORS[chain.id] || '#94e2d5' } : {}}
          >
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: CHAIN_COLORS[chain.id] }} />
            {chain.label}
          </button>
        ))}
        <span className="text-[#444] mx-1">|</span>
        <span className="text-xs text-[#555]">L2s:</span>
        {chainNodes.filter(n => n.category?.includes('l2')).slice(0, 6).map(chain => (
          <button
            key={chain.id}
            onClick={() => setFocusedEcosystem(focusedEcosystem === chain.id ? null : chain.id)}
            className={`px-2 py-0.5 text-[10px] rounded-full transition-colors flex items-center gap-1 ${
              focusedEcosystem === chain.id
                ? 'text-[#1a1a1a]'
                : 'bg-[#1a1a1a] text-[#666] hover:bg-[#252525]'
            }`}
            style={focusedEcosystem === chain.id ? { backgroundColor: CHAIN_COLORS[chain.id] || '#94e2d5' } : {}}
          >
            <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: CHAIN_COLORS[chain.id] }} />
            {chain.label}
          </button>
        ))}
        <span className="text-[10px] text-[#f9e2af] ml-2">
          {bridgeCount} bridges
        </span>
      </div>

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
          {focusedEcosystem && ` • Viewing ${chainNodes.find(c => c.id === focusedEcosystem)?.label || focusedEcosystem} ecosystem`}
        </span>
        <div className="flex gap-2">
          {focusedEcosystem && (
            <button
              onClick={() => setFocusedEcosystem(null)}
              className="px-3 py-1.5 text-xs bg-[#627eea]/20 hover:bg-[#627eea]/30 text-[#627eea] rounded border border-[#627eea]/30 transition-colors"
            >
              Clear Ecosystem Filter
            </button>
          )}
          {expandedNodes.size > 0 && (
            <button
              onClick={() => {
                setExpandedNodes(new Set());
                setFocusedNode(null);
              }}
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

      {/* Graph container with floating labels */}
      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="bg-[#0a0a0a] rounded-lg border border-[#252525]"
        />

        {/* Category labels - floating overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {(() => {
            const categories = [...new Set(data.nodes.map(n => n.category))];
            const categoryColors: Record<string, string> = {
              'privacy-coin': '#94e2d5',
              'messaging': '#fab387',
              'mixer': '#eba0ac',
              'zk-rollup': '#89b4fa',
              'mixnet': '#cba6f7',
              'identity': '#f9e2af',
              'wallet': '#a6e3a1',
              'vpn': '#89dceb',
              'default': '#6c7086',
            };
            return categories.slice(0, 8).map(cat => {
              const count = data.nodes.filter(n => n.category === cat).length;
              return (
                <span
                  key={cat}
                  className="flex items-center gap-1.5 text-[10px] bg-[#0a0a0a]/80 px-2 py-0.5 rounded"
                >
                  <span
                    className="w-2 h-2 rounded-sm"
                    style={{ backgroundColor: categoryColors[cat] || categoryColors.default }}
                  />
                  <span style={{ color: categoryColors[cat] || categoryColors.default }}>
                    {cat} ({count})
                  </span>
                </span>
              );
            });
          })()}
        </div>

        {/* Focused node indicator */}
        {focusedNode && (
          <div className="absolute top-3 right-3 px-2 py-1 text-xs bg-[#94e2d5]/20 text-[#94e2d5] rounded border border-[#94e2d5]/30">
            Selected: {data.nodes.find(n => n.id === focusedNode)?.label || focusedNode}
          </div>
        )}
      </div>

      {/* Help text */}
      <p className="text-xs text-[#444]">
        Drag to pan • Scroll to zoom • Click once to expand • Click expanded node to open project
      </p>
    </div>
  );
}
