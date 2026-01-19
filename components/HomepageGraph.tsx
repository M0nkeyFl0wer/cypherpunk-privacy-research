'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import for the graph
const ObsidianGraph = dynamic(
  () => import('@/components/Visualizations/ObsidianGraph'),
  { ssr: false, loading: () => <div className="h-[500px] bg-[#111] rounded-lg animate-pulse" /> }
);

interface Project {
  id: string;
  name: string;
  type: string;
  tier?: string;
  description?: string;
  stars?: number;
}

export function HomepageGraph() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [showGraph, setShowGraph] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Load projects for search
  useEffect(() => {
    fetch('/data/research-graph.json')
      .then(res => res.json())
      .then(data => {
        const projects = data.nodes.filter((n: Project) => n.type === 'project');
        setAllProjects(projects);
      })
      .catch(console.error);
  }, []);

  // Filter projects based on search
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allProjects
      .filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [searchQuery, allProjects]);

  useEffect(() => {
    setSearchResults(filteredResults);
    setSelectedIndex(0);
  }, [filteredResults]);

  // Keyboard navigation for fzf-like behavior
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault();
      router.push(`/projects/${searchResults[selectedIndex].id}`);
    } else if (e.key === 'Escape') {
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-6">
      {/* fzf-style Search Bar */}
      <div className="relative">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#111] border border-[#252525] rounded-lg focus-within:border-[#94e2d5] transition-colors">
          <span className="text-[#94e2d5]">&gt;</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects... (↑↓ to navigate, Enter to select)"
            className="flex-1 bg-transparent text-[#e0e0e0] placeholder-[#6c7086] outline-none font-mono text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#6c7086] hover:text-[#e0e0e0] transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-[#252525] rounded-lg overflow-hidden z-50 shadow-xl">
            {searchResults.map((project, index) => (
              <button
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${
                  index === selectedIndex
                    ? 'bg-[#1a1a1a] text-[#e0e0e0]'
                    : 'text-[#a6adc8] hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    project.tier === 'osint' ? 'bg-[#94e2d5]' : 'bg-[#89b4fa]'
                  }`} />
                  <span className="font-mono text-sm">{project.name}</span>
                </div>
                {project.stars && (
                  <span className="text-xs text-[#6c7086]">{project.stars.toLocaleString()} ★</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Toggle Graph */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-[#6c7086] uppercase tracking-wider">
          Project Connections
        </h2>
        <button
          onClick={() => setShowGraph(!showGraph)}
          className="text-xs text-[#6c7086] hover:text-[#94e2d5] transition-colors"
        >
          {showGraph ? 'hide graph' : 'show graph'}
        </button>
      </div>

      {/* Interactive Graph */}
      {showGraph && (
        <div className="rounded-lg overflow-hidden border border-[#252525]">
          <ObsidianGraph
            width={800}
            height={450}
            projectsOnly={true}
            initialZoom={0.85}
          />
        </div>
      )}

      {/* Quick Stats */}
      <div className="flex items-center gap-6 text-xs text-[#6c7086]">
        <span>{allProjects.length} projects</span>
        <span>•</span>
        <span>Click project to explore its connections</span>
        <span>•</span>
        <span>Click again for full details</span>
      </div>
    </div>
  );
}
