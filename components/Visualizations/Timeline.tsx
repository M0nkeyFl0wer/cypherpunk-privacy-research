'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';

interface TimelineProps {
  projects: any[];
  width?: number;
  height?: number;
}

interface TimelineEvent {
  name: string;
  year: number;
  category: string;
  techStack: string[];
  privacyTechniques: string[];
  project: any; // Full project for tooltip
}

export default function Timeline({ projects, width = 1000, height = 400 }: TimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!svgRef.current || projects.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Filter projects with founding year and prepare timeline data
    const timelineData: TimelineEvent[] = projects
      .filter(p => p.foundedYear && p.foundedYear > 1900 && p.foundedYear < 2030)
      .map(p => ({
        name: p.name,
        year: p.foundedYear,
        category: p.category || 'Uncategorized',
        techStack: p.techStack || [],
        privacyTechniques: p.privacyTechniques || [],
        project: p, // Store full project for tooltip
      }))
      .sort((a, b) => a.year - b.year);

    if (timelineData.length === 0) {
      return;
    }

    // Set up margins
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Set up SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Group by year
    const yearGroups = d3.group(timelineData, d => d.year);
    const yearData = Array.from(yearGroups, ([year, events]) => ({
      year,
      count: events.length,
      events,
    }));

    // Scales
    const xScale = d3.scaleLinear()
      .domain([
        d3.min(yearData, d => d.year)! - 1,
        d3.max(yearData, d => d.year)! + 1,
      ])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(yearData, d => d.count)!])
      .range([innerHeight, 0])
      .nice();

    // Color scale
    const categories = [...new Set(timelineData.map(d => d.category))];
    const colorScale = d3.scaleOrdinal<string>()
      .domain(categories)
      .range(d3.schemeTableau10);

    // X axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d => d.toString())
        .ticks(Math.min(yearData.length, 15))
      )
      .selectAll('text')
      .attr('fill', '#cbd5e0')
      .style('text-anchor', 'middle');

    g.select('.x-axis path, .x-axis line')
      .attr('stroke', '#4a5568');

    // Y axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .attr('fill', '#cbd5e0');

    g.select('.y-axis path, .y-axis line')
      .attr('stroke', '#4a5568');

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
      )
      .select('.domain')
      .remove();

    // Area chart
    const area = d3.area<{year: number; count: number}>()
      .x(d => xScale(d.year))
      .y0(innerHeight)
      .y1(d => yScale(d.count))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(yearData)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area as any)
      .attr('opacity', 0.3);

    // Add gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#94e2d5')
      .attr('stop-opacity', 0.8);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#94e2d5')
      .attr('stop-opacity', 0.1);

    // Line chart
    const line = d3.line<{year: number; count: number}>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.count))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(yearData)
      .attr('fill', 'none')
      .attr('stroke', '#94e2d5')
      .attr('stroke-width', 3)
      .attr('d', line as any);

    // Add dots for each year
    const dots = g.selectAll('.dot')
      .data(yearData)
      .join('g')
      .attr('class', 'dot')
      .attr('transform', d => `translate(${xScale(d.year)},${yScale(d.count)})`);

    dots.append('circle')
      .attr('r', 5)
      .attr('fill', '#94e2d5')
      .attr('stroke', '#1a202c')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Add tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'timeline-tooltip')
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
      .style('max-width', '300px');

    dots
      .on('mouseover', function(event, d) {
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', 8)
          .attr('stroke-width', 3);

        const categoryCount = d3.rollup(
          d.events,
          v => v.length,
          d => d.category
        );

        const topProjects = d.events.slice(0, 5);

        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">
              ${d.year} - ${d.count} Project${d.count > 1 ? 's' : ''} Launched
            </div>
            ${categoryCount.size > 0 ? `
              <div style="margin-bottom: 8px; font-size: 11px;">
                <strong>Categories:</strong><br/>
                ${Array.from(categoryCount, ([cat, count]) =>
                  `<span style="color: ${colorScale(cat)};">●</span> ${cat}: ${count}`
                ).join('<br/>')}
              </div>
            ` : ''}
            ${topProjects.length > 0 ? `
              <div style="margin-bottom: 8px;">
                <strong style="font-size: 11px;">Projects:</strong>
                ${topProjects.map(e => `
                  <div style="margin-top: 4px; padding: 4px; background: #2d3748; border-radius: 4px;">
                    <div style="font-weight: bold; font-size: 11px; color: #94e2d5; margin-bottom: 2px;">${e.name}</div>
                    ${e.project?.description ? `
                      <div style="font-size: 9px; color: #cbd5e0; margin-bottom: 2px;">
                        ${e.project.description.slice(0, 80)}${e.project.description.length > 80 ? '...' : ''}
                      </div>
                    ` : ''}
                    ${e.techStack?.length > 0 ? `
                      <div style="font-size: 9px; color: #a0aec0;">
                        🔧 ${e.techStack.slice(0, 3).join(', ')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
                ${d.events.length > 5 ? `
                  <div style="font-size: 10px; color: #718096; margin-top: 4px;">
                    +${d.events.length - 5} more projects
                  </div>
                ` : ''}
              </div>
            ` : ''}
            <div style="color: #718096; font-size: 10px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #4a5568;">
              <span style="color: #94e2d5; font-weight: bold;">Click dot to view year • Click project names below →</span>
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
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', 5)
          .attr('stroke-width', 2);

        tooltip.style('opacity', 0);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        // If only one project, navigate to it directly
        if (d.events.length === 1 && d.events[0].project) {
          router.push(`/project/${d.events[0].project.slug}`);
        }
        // For multiple projects, the tooltip shows clickable project names
        // Users can click individual project cards in the tooltip
      });

    // Labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#cbd5e0')
      .attr('font-size', '12px')
      .text('Year Founded');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#cbd5e0')
      .attr('font-size', '12px')
      .text('Number of Projects');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e2e8f0')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Web3 Privacy Projects Over Time');

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [projects, width, height]);

  return (
    <div className="relative">
      <div className="mb-4 text-sm text-[#6c7086]">
        <p>📅 Timeline shows when privacy projects were founded</p>
        <p className="mt-1">💡 Hover over dots for details • Peak years show privacy innovation waves</p>
      </div>
      <svg ref={svgRef} className="bg-[#111] rounded-lg" />
      {projects.filter(p => p.foundedYear && p.foundedYear > 1900).length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[#6c7086]">No timeline data available</p>
        </div>
      )}
    </div>
  );
}
