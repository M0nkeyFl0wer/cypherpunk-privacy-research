# Privacy Tech Graph Implementation Plan

*Comprehensive plan for interactive graph visualization*

---

## Current State (v1.0)

### What's Implemented

| Feature | Status | Component |
|---------|--------|-----------|
| Full graph view (48 nodes) | Done | PrivacyTechGraph |
| Privacy tech color coding | Done | PrivacyTechGraph |
| Click to expand connections | Done | PrivacyTechGraph |
| Technology highlighting | Done | PrivacyTechGraph |
| Drag nodes | Done | D3 drag behavior |
| Pan/zoom | Done | D3 zoom behavior |
| Double-click navigation | Done | PrivacyTechGraph |
| Post-quantum badges | Done | PrivacyTechGraph |

### Data Structure

```
ecosystem-graph.json
├── nodes (48 projects)
│   ├── id, label, category
│   ├── privacyTech[] (array of technologies)
│   ├── ecosystem (cryptonote, ethereum, cosmos, etc.)
│   └── postQuantum (boolean)
├── edges (35 shared-tech connections)
│   ├── source, target
│   ├── relationship (shared-tech, built-on, toolchain)
│   └── detail (description)
├── clusters (10 technology families)
└── privacyTechLegend (colors)
```

---

## Phase 2: Enhanced Interactions

### 2.1 Smooth Zoom to Expanded Node

**Current**: Zoom jumps when expanding
**Target**: Smooth animated zoom centered on expanded node

```typescript
// After expanding a node, smoothly zoom to show it and its connections
const expandedBounds = getExpandedNodeBounds(node, connectedNodes);
svg.transition()
  .duration(750)
  .ease(d3.easeCubicInOut)
  .call(zoom.transform, calculateFitTransform(expandedBounds));
```

### 2.2 Multi-Select Expansion

**Current**: Single node expansion
**Target**: Select multiple nodes to see all their connections

```typescript
// Shift+click to add to selection
// Show union of all selected node connections
const selectedNodes = new Set(['monero', 'zcash', 'signal']);
const visibleEdges = edges.filter(e =>
  selectedNodes.has(e.source) || selectedNodes.has(e.target)
);
```

### 2.3 Connection Path Highlighting

**Current**: Direct connections only
**Target**: Show paths between distant nodes

```typescript
// Click two nodes to see shortest path between them
// Useful for "how is Signal related to Zcash?"
const path = findShortestPath(nodeA, nodeB, edges);
highlightPath(path);
```

---

## Phase 3: Clustered Layout

### 3.1 Technology Family Clusters

Group nodes by their primary privacy technology:

```
┌─────────────────────────────────────────────────────────────┐
│                      PRIVACY TECH GRAPH                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐       ┌─────────────────┐             │
│  │  ZK-SNARK       │       │  Ring Signature  │             │
│  │  Cluster        │──────▶│  Cluster         │             │
│  │                 │       │                  │             │
│  │  ○ Zcash        │       │  ○ Monero        │             │
│  │  ○ Tornado      │       │  ○ Oxen          │             │
│  │  ○ Semaphore    │       │  ○ Zano          │             │
│  └─────────────────┘       └─────────────────┘             │
│           │                        │                        │
│           ▼                        ▼                        │
│  ┌─────────────────┐       ┌─────────────────┐             │
│  │  Mixnet         │       │  TEE             │             │
│  │  Cluster        │       │  Cluster         │             │
│  │                 │       │                  │             │
│  │  ○ Nym          │◀─────▶│  ○ Secret        │             │
│  │  ○ HOPR         │       │  ○ Oasis         │             │
│  │  ○ xx Network   │       │  ○ MobileCoin    │             │
│  └─────────────────┘       └─────────────────┘             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Implementation**:
```typescript
// Use D3 force with cluster attractors
simulation.force('cluster', forceCluster()
  .centers(clusterCenters)
  .strength(0.3)
);

// Each tech family has a gravitational center
const clusterCenters = {
  'zk-snarks': { x: width * 0.25, y: height * 0.3 },
  'ring-signatures': { x: width * 0.75, y: height * 0.3 },
  'mixnet': { x: width * 0.25, y: height * 0.7 },
  'sgx-tee': { x: width * 0.75, y: height * 0.7 },
};
```

### 3.2 Ecosystem Layers

Alternative view: Layer by ecosystem (Ethereum, Cosmos, Standalone)

```
┌─────────────────────────────────────────────────────────────┐
│  ETHEREUM LAYER                                             │
│  ○ Tornado  ○ zkSync  ○ Semaphore  ○ Miden                 │
├─────────────────────────────────────────────────────────────┤
│  COSMOS LAYER                                               │
│  ○ Nym  ○ Secret Network  ○ Sentinel                       │
├─────────────────────────────────────────────────────────────┤
│  STANDALONE LAYER                                           │
│  ○ Monero  ○ Zcash  ○ Signal  ○ Iron Fish                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 4: 3D Visualization (Future)

### 4.1 Three.js or React Three Fiber

**Why 3D**:
- More dimensions for showing relationships
- Z-axis for time, maturity, or trust level
- Immersive exploration of complex networks
- WebXR potential for VR/AR viewing

**Tech Stack Options**:

| Library | Pros | Cons |
|---------|------|------|
| Three.js | Full control, performant | More code |
| React Three Fiber | React integration | Abstraction overhead |
| Force Graph 3D | Built for graphs | Less customizable |

### 4.2 3D Layout Ideas

```
                    ▲ Z-axis: Time/Maturity
                    │
                    │     ○ Signal (2014)
                    │
                    │  ○ Monero (2014)    ○ Zcash (2016)
                    │
                    │        ○ Tornado (2019)
                    │
                    │  ○ zkSync (2020)  ○ Nym (2021)
                    │
    ────────────────┼────────────────────────▶ X-axis: Privacy Tech
    Ring Sigs      │                          ZK Proofs
                    │
                    │
                    ▼ Y-axis: Ecosystem
                 Standalone → ETH → Cosmos
```

### 4.3 Implementation Roadmap

1. **Prototype**: Basic 3D force graph with Force Graph 3D library
2. **Interaction**: Camera controls, node selection in 3D
3. **Data mapping**: Decide which dimensions map to X/Y/Z
4. **Performance**: LOD (level of detail) for large graphs
5. **WebXR**: Optional VR mode for immersive exploration

---

## Phase 5: Contributor Social Graph (Deferred)

### Current Data Gap

Only 26/48 projects have contributor data. To implement:

1. Fetch contributors for remaining 22 projects via GitHub API
2. Cross-reference usernames across all projects
3. Add contributor nodes only where cross-project overlap exists

### Contributor Node Visualization

```
                  ○ kobigurk (ZK researcher)
                 /|\
                / | \
               /  |  \
              ○   ○   ○
          Semaphore  zkVote  Aztec
```

**Status**: Deferred until contributor data coverage is complete

---

## Implementation Priority

| Phase | Priority | Effort | Impact |
|-------|----------|--------|--------|
| 2.1 Smooth zoom | High | Low | UX polish |
| 2.2 Multi-select | Medium | Medium | Power users |
| 2.3 Path finding | Medium | Medium | Discovery |
| 3.1 Tech clusters | High | Medium | Core visualization |
| 3.2 Ecosystem layers | Medium | Low | Alternative view |
| 4.x 3D visualization | Low | High | Future wow factor |
| 5.x Contributor graph | Low | High | Needs data work |

---

## Color Gradient System

For metrics visualization (positive/negative indicators):

```typescript
// Privacy strength gradient
const privacyGradient = {
  100: '#a6e3a1', // Strong privacy (green)
  80: '#94e2d5',  // Good privacy (teal)
  60: '#f9e2af',  // Moderate (yellow)
  40: '#fab387',  // Weak (orange)
  20: '#f38ba8',  // Poor (red)
  0: '#6c7086',   // Unknown (gray)
};

// Usage
function getPrivacyColor(score: number): string {
  const thresholds = [100, 80, 60, 40, 20, 0];
  for (const t of thresholds) {
    if (score >= t) return privacyGradient[t];
  }
  return privacyGradient[0];
}
```

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `PrivacyTechGraph.tsx` | Enhance | Add phases 2.1-2.3 |
| `ClusteredGraph.tsx` | Create | Phase 3 cluster view |
| `Graph3D.tsx` | Create | Phase 4 3D view |
| `ecosystem-graph.json` | Enhance | Add contributor nodes when ready |
| `app/ecosystem/page.tsx` | Enhance | View toggle between 2D/3D |

---

*Last updated: 2026-01-22*
*Version: 1.0*
