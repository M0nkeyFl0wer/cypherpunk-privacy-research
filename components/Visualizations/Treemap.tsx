'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

interface TreemapProps {
  projects: any[];
  width?: number;
  height?: number;
}

interface TreemapNode {
  name: string;
  value: number;
  category?: string;
  children?: TreemapNode[];
  project?: any; // Full project for tooltip
}

interface TreemapRectNode extends d3.HierarchyRectangularNode<TreemapNode> {
  data: TreemapNode;
}

export default function Treemap({ projects, width = 1000, height = 600 }: TreemapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!svgRef.current || projects.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Group projects by category
    const categoryGroups = d3.group(projects, d => d.category || 'Uncategorized');

    // Create hierarchical data structure
    const data: TreemapNode = {
      name: 'Web3 Privacy Projects',
      value: 0,
      children: Array.from(categoryGroups, ([category, categoryProjects]) => ({
        name: category,
        value: 0,
        category: category,
        children: categoryProjects.map(p => ({
          name: p.name,
          value: Math.max(
            1,
            (p.techStack?.length || 0) +
            (p.privacyTechniques?.length || 0) +
            (p.completeness || 0)
          ),
          category: category,
          project: p, // Store full project for tooltip
        })),
      })),
    };

    // Create hierarchy
    const root = d3.hierarchy<TreemapNode>(data)
      .sum(d => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create treemap layout
    const treemapLayout = d3.treemap<TreemapNode>()
      .size([width, height])
      .paddingOuter(3)
      .paddingTop(19)
      .paddingInner(2)
      .round(true);

    treemapLayout(root);

    // Set up SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif;');

    // Color scale
    const categories = [...new Set(projects.map(p => p.category || 'Uncategorized'))];
    const colorScale = d3.scaleOrdinal<string>()
      .domain(categories)
      .range(d3.schemeTableau10);

    // Create groups for each node
    const leaf = svg.selectAll('g')
      .data(root.leaves() as TreemapRectNode[])
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    // Add rectangles
    leaf.append('rect')
      .attr('id', (d, i) => `rect-${i}`)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => {
        const category = d.data.category || d.parent?.data.name || 'unknown';
        return colorScale(category);
      })
      .attr('fill-opacity', 0.7)
      .attr('stroke', '#1a202c')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Add labels
    leaf.append('text')
      .attr('x', 4)
      .attr('y', 12)
      .text(d => d.data.name)
      .attr('fill', '#ffffff')
      .attr('font-size', d => {
        const area = (d.x1 - d.x0) * (d.y1 - d.y0);
        if (area > 5000) return '12px';
        if (area > 2000) return '10px';
        if (area > 500) return '8px';
        return '0px'; // Hide text for very small boxes
      })
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .each(function(d) {
        const text = d3.select(this);
        const width = d.x1 - d.x0 - 8;
        const textLength = text.node()?.getComputedTextLength() || 0;

        if (textLength > width) {
          // Truncate text that's too long
          let textContent = d.data.name;
          while (textLength > width && textContent.length > 0) {
            textContent = textContent.slice(0, -1);
            text.text(textContent + '...');
            const newLength = text.node()?.getComputedTextLength() || 0;
            if (newLength <= width) break;
          }
        }
      });

    // Add category labels
    svg.selectAll('g.category')
      .data((root.children as TreemapRectNode[]) || [])
      .join('g')
      .attr('class', 'category')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .append('text')
      .attr('x', 4)
      .attr('y', 13)
      .text(d => `${d.data.name} (${d.children?.length || 0})`)
      .attr('fill', '#cbd5e0')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none');

    // Add tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'treemap-tooltip')
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

    // Add interactivity
    leaf
      .on('mouseover', function(event, d) {
        d3.select(this).select('rect')
          .transition()
          .duration(200)
          .attr('fill-opacity', 1)
          .attr('stroke-width', 3);

        const p = d.data.project;

        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${d.data.name}</div>
            <div style="color: #a0aec0; font-size: 10px; margin-bottom: 8px;">
              ${d.data.category || 'Uncategorized'}
            </div>
            ${p?.description ? `
              <div style="margin-bottom: 8px; color: #cbd5e0; font-size: 11px; max-width: 300px;">
                ${p.description.slice(0, 150)}${p.description.length > 150 ? '...' : ''}
              </div>
            ` : ''}
            ${p?.website ? `
              <div style="margin-bottom: 4px; font-size: 10px;">
                🌐 <a href="${p.website}" target="_blank" style="color: #94e2d5;">${new URL(p.website).hostname}</a>
              </div>
            ` : ''}
            ${p?.github ? `
              <div style="margin-bottom: 4px; font-size: 10px;">
                💻 <a href="${p.github}" target="_blank" style="color: #94e2d5;">${p.github.replace('https://github.com/', '')}</a>
              </div>
            ` : ''}
            ${p?.techStack?.length > 0 ? `
              <div style="margin-bottom: 4px; font-size: 10px;">
                <strong>Tech:</strong> ${p.techStack.slice(0, 4).join(', ')}${p.techStack.length > 4 ? '...' : ''}
              </div>
            ` : ''}
            ${p?.privacyTechniques?.length > 0 ? `
              <div style="margin-bottom: 4px; font-size: 10px;">
                <strong>Privacy:</strong> ${p.privacyTechniques.slice(0, 4).join(', ')}${p.privacyTechniques.length > 4 ? '...' : ''}
              </div>
            ` : ''}
            ${p?.completeness ? `
              <div style="margin-bottom: 4px; font-size: 10px;">
                <strong>Completeness:</strong> ${p.completeness}%
              </div>
            ` : ''}
            <div style="color: #718096; font-size: 10px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #4a5568;">
              Box: ${(d.x1 - d.x0).toFixed(0)} × ${(d.y1 - d.y0).toFixed(0)}px •
              <span style="color: #94e2d5; font-weight: bold;">Click for full details →</span>
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
      .on('mouseout', function() {
        d3.select(this).select('rect')
          .transition()
          .duration(200)
          .attr('fill-opacity', 0.7)
          .attr('stroke-width', 2);

        tooltip.style('opacity', 0);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        if (d.data.project) {
          router.push(`/project/${d.data.project.slug}`);
        }
      });

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [projects, width, height, selectedCategory]);

  return (
    <div className="relative">
      <div className="mb-4 text-sm text-[#6c7086]">
        <p>📦 Box size = Project importance (tech stack + privacy features + completeness)</p>
        <p className="mt-1">💡 Hover for details • Click to filter by category</p>
        {selectedCategory && (
          <p className="mt-2 text-[#94e2d5]">
            Filtered: {selectedCategory}
            <button
              onClick={() => setSelectedCategory(null)}
              className="ml-2 text-xs underline hover:text-white"
            >
              Clear filter
            </button>
          </p>
        )}
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
