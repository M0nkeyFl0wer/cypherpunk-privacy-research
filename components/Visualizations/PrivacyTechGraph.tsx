'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';
import { getProjectMetadata } from '@/lib/graphMetadata';

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
  metadata: { generated: string; version: string; description: string };
}

interface Props {
  width?: number;
  height?: number;
}

// Privacy technology descriptions from verified research (research-required/privacy-tech-tradeoffs.md)
const PRIVACY_TECH_INFO: Record<string, { name: string; description: string; tradeoff: string }> = {
  'zk-snarks': {
    name: 'zk-SNARKs',
    description: 'Zero-knowledge succinct proofs using elliptic curve cryptography',
    tradeoff: 'Requires trusted setup, not quantum resistant, but very compact proofs (~200 bytes)'
  },
  'zk-starks': {
    name: 'zk-STARKs',
    description: 'Scalable transparent proofs using hash-based cryptography',
    tradeoff: 'No trusted setup, quantum resistant, but 10-100x larger proofs than SNARKs'
  },
  'ring-signatures': {
    name: 'Ring Signatures',
    description: 'Signs with own key + decoys from blockchain, hiding the actual signer',
    tradeoff: 'Privacy depends on ring size; vulnerable to timing and chain analysis'
  },
  'stealth-addresses': {
    name: 'Stealth Addresses',
    description: 'One-time addresses generated for each payment using receiver public key',
    tradeoff: 'Only hides receiver, requires scanning all transactions to find funds'
  },
  'bulletproofs': {
    name: 'Bulletproofs',
    description: 'Short zero-knowledge proofs for range proofs, no trusted setup',
    tradeoff: 'Logarithmic proof size but slower verification than SNARKs'
  },
  'sgx-tee': {
    name: 'Intel SGX TEE',
    description: 'Hardware-isolated secure enclaves that process encrypted data',
    tradeoff: 'Requires trusting Intel; vulnerable to Spectre, Meltdown, side-channel attacks'
  },
  'mixnet': {
    name: 'Mixnet',
    description: 'Messages routed through multiple nodes that mix ordering and timing',
    tradeoff: 'Strong metadata protection but adds latency (seconds to minutes)'
  },
  'sphinx-packets': {
    name: 'Sphinx Packets',
    description: 'Layered encryption format for anonymous routing networks',
    tradeoff: 'Fixed packet size prevents traffic analysis but adds overhead'
  },
  'cover-traffic': {
    name: 'Cover Traffic',
    description: 'Fake messages sent to hide real traffic patterns',
    tradeoff: 'Improves privacy but increases bandwidth and costs'
  },
  'nullifiers': {
    name: 'Nullifiers',
    description: 'Unique markers that prevent double-spending without revealing identity',
    tradeoff: 'Core to private transactions; must be stored forever'
  },
  'merkle-tree': {
    name: 'Merkle Tree',
    description: 'Cryptographic data structure for efficient set membership proofs',
    tradeoff: 'Efficient verification but tree must grow with users'
  },
  'groth16': {
    name: 'Groth16',
    description: 'Most efficient SNARK proving system with smallest proofs',
    tradeoff: 'Requires circuit-specific trusted setup ceremony'
  },
  'plonk': {
    name: 'PLONK',
    description: 'Universal SNARK with updatable trusted setup',
    tradeoff: 'Larger proofs than Groth16 but universal setup'
  },
  'halo2': {
    name: 'Halo2',
    description: 'Recursive proof system with no trusted setup',
    tradeoff: 'More complex but eliminates trusted setup entirely'
  },
  'signal-protocol': {
    name: 'Signal Protocol',
    description: 'End-to-end encryption with forward secrecy and deniability',
    tradeoff: 'Gold standard for messaging but requires key management'
  },
  'double-ratchet': {
    name: 'Double Ratchet',
    description: 'Key derivation providing forward secrecy for each message',
    tradeoff: 'Excellent security properties but state management complexity'
  },
  'tor': {
    name: 'Tor Onion Routing',
    description: 'Three-hop encrypted routing through volunteer relays',
    tradeoff: 'Widely used but vulnerable to traffic correlation by global adversaries'
  },
  'coinjoin': {
    name: 'CoinJoin',
    description: 'Multiple users combine transactions to obscure ownership',
    tradeoff: 'Requires coordination; effectiveness depends on participant pool'
  },
  'atomic-swaps': {
    name: 'Atomic Swaps',
    description: 'Trustless exchange between different cryptocurrencies',
    tradeoff: 'No counterparty risk but requires both chains to support'
  },
  'e2e-encryption': {
    name: 'End-to-End Encryption',
    description: 'Only sender and receiver can read messages',
    tradeoff: 'Standard practice; security depends on key exchange method'
  },
  'circom': {
    name: 'Circom',
    description: 'Domain-specific language for writing zk circuits',
    tradeoff: 'Developer-friendly but circuit bugs can break soundness'
  },
  'ringct': {
    name: 'RingCT',
    description: 'Ring Confidential Transactions hiding amounts and senders',
    tradeoff: 'Combines ring signatures with Pedersen commitments'
  },
  'lelantus': {
    name: 'Lelantus',
    description: 'Burn-and-redeem privacy protocol without trusted setup',
    tradeoff: 'Larger anonymity sets than mixers but still limited'
  },
  'spark': {
    name: 'Spark Protocol',
    description: 'Evolution of Lelantus with full transaction graph privacy',
    tradeoff: 'Newer protocol, less battle-tested'
  },
  'sapling-protocol': {
    name: 'Sapling Protocol',
    description: 'Zcash shielded transaction protocol with improved efficiency',
    tradeoff: 'More efficient than Sprout but still requires trusted setup'
  },
  'cmix': {
    name: 'cMix',
    description: 'Precomputation-based mixnet for faster message mixing',
    tradeoff: 'Faster than traditional mixnets but complex setup'
  },
  'quantum-resistant': {
    name: 'Quantum Resistant',
    description: 'Cryptography designed to withstand quantum computer attacks',
    tradeoff: 'Future-proof but often larger keys and signatures'
  },
  'onion-routing': {
    name: 'Onion Routing',
    description: 'Layered encryption where each relay strips one layer',
    tradeoff: 'Provides anonymity but adds latency'
  },
  'vpn-tunneling': {
    name: 'VPN Tunneling',
    description: 'Encrypted tunnel hiding traffic from local observers',
    tradeoff: 'Hides traffic content but VPN provider sees everything'
  },
  'decentralized-network': {
    name: 'Decentralized Network',
    description: 'No central authority controlling the network',
    tradeoff: 'Censorship resistant but harder to coordinate'
  },
  'encrypted-contracts': {
    name: 'Encrypted Smart Contracts',
    description: 'Contract state and execution hidden from validators',
    tradeoff: 'Privacy for DeFi but limits composability'
  },
  'confidential-smart-contracts': {
    name: 'Confidential Contracts',
    description: 'Smart contracts with private inputs and state',
    tradeoff: 'Enables private computation but complex to build'
  },
  'anonymous-smart-contracts': {
    name: 'Anonymous Contracts',
    description: 'Smart contracts hiding user identities',
    tradeoff: 'Full privacy but regulatory challenges'
  },
  'recursive-proofs': {
    name: 'Recursive Proofs',
    description: 'Proofs that verify other proofs for scalability',
    tradeoff: 'Enables unbounded computation but complex'
  },
  'anonymous-credentials': {
    name: 'Anonymous Credentials',
    description: 'Prove attributes without revealing identity',
    tradeoff: 'Powerful for privacy-preserving authentication'
  },
  'private-defi': {
    name: 'Private DeFi',
    description: 'Decentralized finance with transaction privacy',
    tradeoff: 'Hides trading activity but complicates compliance'
  },
  'compliant-privacy': {
    name: 'Compliant Privacy',
    description: 'Privacy features with optional regulatory compliance',
    tradeoff: 'Balances privacy with legal requirements'
  },
  'cross-chain-privacy': {
    name: 'Cross-Chain Privacy',
    description: 'Privacy-preserving transfers between blockchains',
    tradeoff: 'Breaks linkage across chains but complex'
  },
  'private-mempool': {
    name: 'Private Mempool',
    description: 'Hidden pending transactions to prevent MEV',
    tradeoff: 'Prevents frontrunning but reduces transparency'
  }
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

export default function PrivacyTechGraph({ width = 1000, height = 700 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const simulationRef = useRef<d3.Simulation<ProjectNode, ProjectEdge> | null>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GraphData | null>(null);
  const [showWeb3Only, setShowWeb3Only] = useState<boolean | null>(null); // null = show all
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const draggedRef = useRef(false);
  const nodePositionsRef = useRef<Map<string, { x: number; y: number; fx: number | null; fy: number | null }>>(new Map());

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

  // Filter nodes based on current filters
  const getFilteredNodes = useCallback((nodes: ProjectNode[]): ProjectNode[] => {
    return nodes.filter(n => {
      if (showWeb3Only === true && !n.isWeb3) return false;
      if (showWeb3Only === false && n.isWeb3) return false;
      if (selectedCategory && n.category !== selectedCategory) return false;
      return true;
    });
  }, [showWeb3Only, selectedCategory]);

  // Get edges for filtered nodes
  const getFilteredEdges = useCallback((edges: ProjectEdge[], nodeIds: Set<string>): ProjectEdge[] => {
    return edges.filter(e => {
      const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
      const targetId = typeof e.target === 'string' ? e.target : e.target.id;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });
  }, []);

  // Render graph
  useEffect(() => {
    if (!svgRef.current || !data) return;

    const filteredNodes = getFilteredNodes(data.nodes);
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = getFilteredEdges(data.edges, nodeIds);

    if (filteredNodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Setup zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    zoomRef.current = zoom;
    svg.call(zoom);

    // Restore saved positions
    filteredNodes.forEach(node => {
      const saved = nodePositionsRef.current.get(node.id);
      if (saved) {
        node.x = saved.x;
        node.y = saved.y;
        node.fx = saved.fx;
        node.fy = saved.fy;
      }
    });

    // Create simulation
    const simulation = d3.forceSimulation<ProjectNode>(filteredNodes)
      .force('link', d3.forceLink<ProjectNode, any>(filteredEdges)
        .id(d => d.id)
        .distance(100)
        .strength(0.5)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35))
      .alpha(nodePositionsRef.current.size > 0 ? 0.1 : 0.5);

    simulationRef.current = simulation;

    // Draw edges - show ALL connections by default
    const link = g.append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(filteredEdges)
      .join('line')
      .attr('stroke', d => {
        if (d.relationship === 'shared-tech') return '#94e2d5';
        if (d.relationship === 'built-on' || d.relationship === 'implements') return '#fab387';
        if (d.relationship === 'toolchain') return '#89b4fa';
        if (d.relationship === 'successor') return '#f9e2af';
        return '#555';
      })
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', 1.5);

    // Edge labels
    const linkLabels = g.append('g')
      .attr('class', 'edge-labels')
      .selectAll('text')
      .data(filteredEdges)
      .join('text')
      .attr('fill', '#666')
      .attr('font-size', '9px')
      .attr('text-anchor', 'middle')
      .attr('opacity', 0)
      .text(d => d.detail);

    // Tooltip
    d3.selectAll('.graph-tooltip').remove();
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'graph-tooltip')
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
      .style('max-width', '320px');

    // Draw nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(filteredNodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Node circles - colored by category
    node.append('circle')
      .attr('r', 20)
      .attr('fill', d => data.categories[d.category]?.color || '#6c7086')
      .attr('stroke', d => PROJECTS_WITH_PAGES.has(d.id) ? '#fff' : '#333')
      .attr('stroke-width', d => PROJECTS_WITH_PAGES.has(d.id) ? 2 : 1)
      .attr('opacity', 0.9);

    // Labels
    node.append('text')
      .text(d => d.label.length > 10 ? d.label.slice(0, 9) + '..' : d.label)
      .attr('x', 0)
      .attr('y', 32)
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .attr('font-size', '10px')
      .attr('pointer-events', 'none');

    // Web3 indicator
    node.filter(d => !d.isWeb3)
      .append('text')
      .attr('x', 0)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1a1a1a')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('C'); // C for Cypherpunk/Classic

    // Drag behavior
    const drag = d3.drag<SVGGElement, ProjectNode>()
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
        // Save position for persistence
        if (d.x !== undefined && d.y !== undefined) {
          nodePositionsRef.current.set(d.id, {
            x: d.x,
            y: d.y,
            fx: d.fx ?? null,
            fy: d.fy ?? null
          });
        }
        setTimeout(() => { draggedRef.current = false; }, 100);
      });

    node.call(drag as any);

    // Interactions
    node
      .on('mouseover', function(event, d) {
        setHoveredNode(d.id);

        // Highlight connected edges
        link.attr('stroke-opacity', e => {
          const sourceId = typeof e.source === 'string' ? e.source : (e.source as ProjectNode).id;
          const targetId = typeof e.target === 'string' ? e.target : (e.target as ProjectNode).id;
          return (sourceId === d.id || targetId === d.id) ? 0.9 : 0.1;
        }).attr('stroke-width', e => {
          const sourceId = typeof e.source === 'string' ? e.source : (e.source as ProjectNode).id;
          const targetId = typeof e.target === 'string' ? e.target : (e.target as ProjectNode).id;
          return (sourceId === d.id || targetId === d.id) ? 3 : 1;
        }).attr('stroke', e => {
          const sourceId = typeof e.source === 'string' ? e.source : (e.source as ProjectNode).id;
          const targetId = typeof e.target === 'string' ? e.target : (e.target as ProjectNode).id;
          return (sourceId === d.id || targetId === d.id) ? '#94e2d5' : '#444';
        });

        // Show edge labels
        linkLabels.attr('opacity', e => {
          const sourceId = typeof e.source === 'string' ? e.source : (e.source as ProjectNode).id;
          const targetId = typeof e.target === 'string' ? e.target : (e.target as ProjectNode).id;
          return (sourceId === d.id || targetId === d.id) ? 1 : 0;
        });

        // Dim unconnected nodes
        node.select('circle').attr('opacity', n => {
          if (n.id === d.id) return 1;
          const isConnected = filteredEdges.some(e => {
            const sourceId = typeof e.source === 'string' ? e.source : (e.source as ProjectNode).id;
            const targetId = typeof e.target === 'string' ? e.target : (e.target as ProjectNode).id;
            return (sourceId === d.id && targetId === n.id) || (targetId === d.id && sourceId === n.id);
          });
          return isConnected ? 0.9 : 0.3;
        });

        // Build tooltip
        const categoryInfo = data.categories[d.category];
        const metadata = getProjectMetadata(d.id);
        const hasPage = PROJECTS_WITH_PAGES.has(d.id);

        let tooltipHtml = `
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: ${categoryInfo?.color || '#fff'}">${d.label}</div>
          <div style="font-size: 10px; color: #888; margin-bottom: 8px;">${categoryInfo?.label || d.category} ${d.isWeb3 ? '' : '• Traditional'}</div>
        `;

        if (metadata) {
          tooltipHtml += `<div style="color: #a6adc8; font-size: 11px; line-height: 1.4; margin-bottom: 8px;">${metadata.description}</div>`;
        }

        // Show privacy tech with descriptions
        const techDetails = d.privacyTech.slice(0, 3).map(t => {
          const info = PRIVACY_TECH_INFO[t];
          if (info) {
            return `<div style="margin-bottom: 6px; padding: 6px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid ${categoryInfo?.color || '#555'};">
              <div style="font-size: 10px; font-weight: 600; color: #a6adc8; margin-bottom: 2px;">${info.name}</div>
              <div style="font-size: 9px; color: #666; line-height: 1.3;">${info.description}</div>
            </div>`;
          }
          return `<span style="background: #333; padding: 2px 6px; border-radius: 4px; font-size: 9px; display: inline-block; margin: 2px;">${t}</span>`;
        }).join('');

        tooltipHtml += `
          <div style="margin-bottom: 6px;">
            <div style="font-size: 9px; color: #555; margin-bottom: 4px;">Privacy Tech:</div>
            ${techDetails}
            ${d.privacyTech.length > 3 ? `<div style="font-size: 9px; color: #444;">+${d.privacyTech.length - 3} more</div>` : ''}
          </div>
        `;

        tooltipHtml += `<div style="color: #555; font-size: 10px; border-top: 1px solid #252525; padding-top: 6px;">${hasPage ? '🔗 Click to open project' : 'Research in progress'}</div>`;

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
        link.attr('stroke-opacity', 0.4).attr('stroke-width', 1.5).attr('stroke', '#444');
        linkLabels.attr('opacity', 0);
        node.select('circle').attr('opacity', 0.9);
        tooltip.style('opacity', 0);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        if (draggedRef.current) return;

        // Click navigates to project page
        if (PROJECTS_WITH_PAGES.has(d.id)) {
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
  }, [data, showWeb3Only, selectedCategory, getFilteredNodes, getFilteredEdges, width, height, router]);

  // Reset view
  const resetView = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  }, []);

  // Unlock all nodes
  const unlockNodes = useCallback(() => {
    nodePositionsRef.current.clear();
    if (simulationRef.current) {
      data?.nodes.forEach(n => {
        n.fx = null;
        n.fy = null;
      });
      simulationRef.current.alpha(0.5).restart();
    }
  }, [data]);

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
        Failed to load graph
      </div>
    );
  }

  const filteredNodes = getFilteredNodes(data.nodes);
  const categories = Object.entries(data.categories);

  // Search filtering
  const searchMatches = searchQuery.length > 0
    ? filteredNodes.filter(n =>
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.privacyTech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  // Highlight selected project in graph
  const highlightProject = useCallback((projectId: string | null) => {
    setSelectedProject(projectId);
    if (!svgRef.current || !projectId) return;

    const svg = d3.select(svgRef.current);

    // Highlight selected node and connections
    svg.selectAll('.node circle')
      .attr('opacity', (d: any) => {
        if (!projectId) return 0.9;
        if (d.id === projectId) return 1;
        // Check if connected
        const isConnected = data?.edges.some(e => {
          const sourceId = typeof e.source === 'string' ? e.source : (e.source as ProjectNode).id;
          const targetId = typeof e.target === 'string' ? e.target : (e.target as ProjectNode).id;
          return (sourceId === projectId && targetId === d.id) || (targetId === projectId && sourceId === d.id);
        });
        return isConnected ? 0.9 : 0.2;
      })
      .attr('stroke-width', (d: any) => d.id === projectId ? 3 : (PROJECTS_WITH_PAGES.has(d.id) ? 2 : 1))
      .attr('stroke', (d: any) => d.id === projectId ? '#94e2d5' : (PROJECTS_WITH_PAGES.has(d.id) ? '#fff' : '#333'));

    svg.selectAll('.edges line')
      .attr('stroke-opacity', (d: any) => {
        const sourceId = typeof d.source === 'string' ? d.source : d.source.id;
        const targetId = typeof d.target === 'string' ? d.target : d.target.id;
        return (sourceId === projectId || targetId === projectId) ? 0.9 : 0.1;
      })
      .attr('stroke-width', (d: any) => {
        const sourceId = typeof d.source === 'string' ? d.source : d.source.id;
        const targetId = typeof d.target === 'string' ? d.target : d.target.id;
        return (sourceId === projectId || targetId === projectId) ? 3 : 1;
      });

    svg.selectAll('.edge-labels text')
      .attr('opacity', (d: any) => {
        const sourceId = typeof d.source === 'string' ? d.source : d.source.id;
        const targetId = typeof d.target === 'string' ? d.target : d.target.id;
        return (sourceId === projectId || targetId === projectId) ? 1 : 0;
      });
  }, [data]);

  const clearHighlight = useCallback(() => {
    setSelectedProject(null);
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('.node circle')
      .attr('opacity', 0.9)
      .attr('stroke-width', (d: any) => PROJECTS_WITH_PAGES.has(d.id) ? 2 : 1)
      .attr('stroke', (d: any) => PROJECTS_WITH_PAGES.has(d.id) ? '#fff' : '#333');
    svg.selectAll('.edges line').attr('stroke-opacity', 0.5).attr('stroke-width', 1.5);
    svg.selectAll('.edge-labels text').attr('opacity', 0);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or privacy tech..."
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-sm text-[#e0e0e0] placeholder-[#555] focus:border-[#94e2d5] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); clearHighlight(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888]"
              >
                ×
              </button>
            )}
          </div>
          {selectedProject && PROJECTS_WITH_PAGES.has(selectedProject) && (
            <button
              onClick={() => router.push(`/projects/${selectedProject}`)}
              className="px-4 py-2 bg-[#94e2d5] text-[#1a1a1a] rounded-lg text-sm font-medium hover:bg-[#a6e3a1] transition-colors flex items-center gap-2"
            >
              Open {data.nodes.find(n => n.id === selectedProject)?.label}
              <span>→</span>
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {searchMatches.length > 0 && (
          <div className="absolute z-50 top-full left-0 mt-1 w-full max-w-md bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl overflow-hidden">
            {searchMatches.map(node => (
              <button
                key={node.id}
                onClick={() => {
                  highlightProject(node.id);
                  setSearchQuery('');
                }}
                className={`w-full px-4 py-2 text-left hover:bg-[#252525] flex items-center justify-between ${
                  selectedProject === node.id ? 'bg-[#252525]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: data.categories[node.category]?.color || '#555' }}
                  />
                  <div>
                    <div className="text-sm text-[#e0e0e0]">{node.label}</div>
                    <div className="text-xs text-[#555]">
                      {data.categories[node.category]?.label}
                      {!node.isWeb3 && ' • Traditional'}
                    </div>
                  </div>
                </div>
                {PROJECTS_WITH_PAGES.has(node.id) && (
                  <span className="text-xs text-[#94e2d5]">Has page</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Graph */}
      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="bg-[#0a0a0a] rounded-lg border border-[#252525]"
        />
      </div>

      {/* Relationship legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs border-t border-[#252525] pt-3">
        <span className="text-[#555]">Connections:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#94e2d5]"></span>
          <span className="text-[#6c7086]">Shared Tech</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#fab387]"></span>
          <span className="text-[#6c7086]">Built On / Implements</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#89b4fa]"></span>
          <span className="text-[#6c7086]">Toolchain</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-[#f9e2af]"></span>
          <span className="text-[#6c7086]">Successor</span>
        </span>
      </div>

      {/* Help text */}
      <p className="text-xs text-[#444]">
        Drag nodes to arrange • Scroll to zoom • Click project to open details • Hover to see connections
      </p>
    </div>
  );
}
