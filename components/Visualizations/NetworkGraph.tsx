'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  project: any; // Full project object for tooltip
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  strength: number;
}

export default function NetworkGraph({ projects, width = 1000, height = 600 }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!svgRef.current || projects.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create nodes from projects (show all projects, not just ones with tech data)
    const nodes: Node[] = projects
      .slice(0, 80) // Limit to 80 nodes for performance
      .map(p => ({
        id: p.slug,
        name: p.name,
        category: p.category || 'Uncategorized',
        techStack: p.techStack || [],
        privacyTechniques: p.privacyTechniques || [],
        size: Math.max(3, (p.techStack?.length || 0) + (p.privacyTechniques?.length || 0)),
        project: p, // Store full project for tooltip
      }));

    // Create links based on shared category (connect projects in same category)
    const links: Link[] = [];
    const categoryGroups = d3.group(nodes, d => d.category);

    categoryGroups.forEach((groupNodes, category) => {
      // Connect projects within the same category (limit connections for performance)
      for (let i = 0; i < Math.min(groupNodes.length, 6); i++) {
        for (let j = i + 1; j < Math.min(groupNodes.length, 6); j++) {
          links.push({
            source: groupNodes[i].id,
            target: groupNodes[j].id,
            strength: 1,
          });
        }
      }
    });

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

    // Create force simulation with adjusted forces for category clustering
    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links)
        .id(d => d.id)
        .distance(80)
      )
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as Node).size * 3 + 8));

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#4a5568')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', 1);

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
      .attr('r', d => Math.max(6, d.size * 2.5))
      .attr('fill', d => colorScale(d.category))
      .attr('stroke', '#1a202c')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Add labels to nodes (show for larger nodes)
    node.append('text')
      .text(d => d.name.length > 15 ? d.name.slice(0, 12) + '...' : d.name)
      .attr('x', 0)
      .attr('y', d => Math.max(6, d.size * 2.5) + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#cbd5e0')
      .attr('font-size', '9px')
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
      .style('z-index', 1000)
      .style('max-width', '350px');

    node
      .on('mouseover', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', Math.max(6, d.size * 2.5) * 1.4)
          .attr('stroke-width', 3);

        const p = d.project;
        const hasRealDescription = p.description && p.description !== 'Privacy-focused Web3 project';

        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${d.name}</div>
            <div style="color: #a0aec0; font-size: 10px; margin-bottom: 8px;">${d.category}</div>
            ${hasRealDescription ? `
              <div style="margin-bottom: 8px; color: #cbd5e0; font-size: 11px;">
                ${p.description.slice(0, 200)}${p.description.length > 200 ? '...' : ''}
              </div>
            ` : '<div style="margin-bottom: 8px; color: #718096; font-size: 11px; font-style: italic;">Technical details being researched...</div>'}
            ${p.website ? `
              <div style="margin-bottom: 4px; font-size: 10px;">
                🌐 <a href="${p.website}" target="_blank" style="color: #94e2d5;">${new URL(p.website).hostname}</a>
              </div>
            ` : ''}
            ${p.github ? `
              <div style="margin-bottom: 4px; font-size: 10px;">
                💻 <a href="${p.github}" target="_blank" style="color: #94e2d5;">${p.github.replace('https://github.com/', '')}</a>
              </div>
            ` : ''}
            ${d.techStack.length > 0 ? `
              <div style="margin-bottom: 4px; font-size: 10px;">
                <strong>Tech:</strong> ${d.techStack.slice(0, 4).join(', ')}${d.techStack.length > 4 ? '...' : ''}
              </div>
            ` : ''}
            ${d.privacyTechniques.length > 0 ? `
              <div style="margin-bottom: 4px; font-size: 10px;">
                <strong>Privacy:</strong> ${d.privacyTechniques.slice(0, 4).join(', ')}${d.privacyTechniques.length > 4 ? '...' : ''}
              </div>
            ` : ''}
            <div style="color: #718096; font-size: 10px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #4a5568;">
              ${links.filter(l => (l.source as Node).id === d.id || (l.target as Node).id === d.id).length} connections •
              <span style="color: #94e2d5; font-weight: bold;">Click for details →</span>
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
          .attr('r', Math.max(6, d.size * 2.5))
          .attr('stroke-width', 2);

        tooltip.style('opacity', 0);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        router.push(`/project/${d.id}`);
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
      <div className="mb-4 text-sm text-[#6c7086]">
        <p>🔵 Nodes = Projects • 🔗 Links = Category Connections</p>
        <p className="mt-1">💡 Drag nodes to rearrange • Scroll to zoom • Hover for details • Click to explore</p>
      </div>
      <svg ref={svgRef} className="bg-[#111] rounded-lg" />
      {projects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[#6c7086]">No project data available</p>
        </div>
      )}
    </div>
  );
}
