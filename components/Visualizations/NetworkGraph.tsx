'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface NetworkGraphProps {
  projects: any[];
  width?: number;
  height?: number;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  techStack: string[];
  privacyTechniques: string[];
  size: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  strength: number;
}

export default function NetworkGraph({ projects, width = 1000, height = 600 }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || projects.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create nodes from projects
    const nodes: Node[] = projects
      .filter(p => p.techStack?.length > 0 || p.privacyTechniques?.length > 0)
      .slice(0, 50) // Limit to 50 nodes for performance
      .map(p => ({
        id: p.slug,
        name: p.name,
        category: p.category || 'unknown',
        techStack: p.techStack || [],
        privacyTechniques: p.privacyTechniques || [],
        size: (p.techStack?.length || 0) + (p.privacyTechniques?.length || 0),
      }));

    // Create links based on shared technologies/techniques
    const links: Link[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const shared = [
          ...nodes[i].techStack.filter(t => nodes[j].techStack.includes(t)),
          ...nodes[i].privacyTechniques.filter(t => nodes[j].privacyTechniques.includes(t)),
        ];

        if (shared.length > 0) {
          links.push({
            source: nodes[i].id,
            target: nodes[j].id,
            strength: shared.length,
          });
        }
      }
    }

    // Set up SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    // Add zoom behavior
    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Color scale by category
    const categories = [...new Set(nodes.map(n => n.category))];
    const colorScale = d3.scaleOrdinal<string>()
      .domain(categories)
      .range(d3.schemeCategory10);

    // Create force simulation
    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links)
        .id(d => d.id)
        .distance(d => 100 / d.strength)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as Node).size * 3 + 5));

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#4a5568')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', d => Math.sqrt(d.strength));

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
      );

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => Math.max(5, d.size * 2))
      .attr('fill', d => colorScale(d.category))
      .attr('stroke', '#1a202c')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Add labels to nodes
    node.append('text')
      .text(d => d.name)
      .attr('x', 0)
      .attr('y', d => Math.max(5, d.size * 2) + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', '#cbd5e0')
      .attr('font-size', '10px')
      .attr('pointer-events', 'none');

    // Add tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'network-tooltip')
      .style('position', 'absolute')
      .style('background', '#1a202c')
      .style('border', '1px solid #4a5568')
      .style('border-radius', '8px')
      .style('padding', '12px')
      .style('color', '#e2e8f0')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000);

    node
      .on('mouseover', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', Math.max(5, d.size * 2) * 1.5)
          .attr('stroke-width', 3);

        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: bold; margin-bottom: 4px;">${d.name}</div>
            <div style="color: #a0aec0; font-size: 10px; margin-bottom: 8px;">${d.category}</div>
            ${d.techStack.length > 0 ? `
              <div style="margin-bottom: 4px;">
                <strong>Tech:</strong> ${d.techStack.slice(0, 3).join(', ')}
              </div>
            ` : ''}
            ${d.privacyTechniques.length > 0 ? `
              <div>
                <strong>Privacy:</strong> ${d.privacyTechniques.slice(0, 3).join(', ')}
              </div>
            ` : ''}
            <div style="color: #718096; font-size: 10px; margin-top: 8px;">
              Connections: ${links.filter(l =>
                (l.source as Node).id === d.id || (l.target as Node).id === d.id
              ).length}
            </div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', Math.max(5, d.size * 2))
          .attr('stroke-width', 2);

        tooltip.style('opacity', 0);
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [projects, width, height]);

  return (
    <div className="relative">
      <div className="mb-4 text-sm text-brand-text-muted">
        <p>🔵 Nodes = Projects • 🔗 Links = Shared Technologies/Techniques</p>
        <p className="mt-1">💡 Drag nodes to rearrange • Scroll to zoom • Hover for details</p>
      </div>
      <svg ref={svgRef} className="bg-brand-bg-darker rounded-lg" />
      {projects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-brand-text-muted">No project data available</p>
        </div>
      )}
    </div>
  );
}
