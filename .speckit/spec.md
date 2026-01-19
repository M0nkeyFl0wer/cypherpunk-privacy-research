# Feature Specification: Web3Privacy Design Overhaul

## Overview
Transform the cypherpunk research site to match Web3Privacy.info's OLED minimalist aesthetic while prioritizing the executive summary and project description as the primary content.

## Current State Analysis

### Existing Design Issues
1. **Purple accent overload** - Catppuccin mauve (`#cba6f7`) used everywhere
2. **Homepage layout** - Key findings shown before executive summary
3. **Portal page** - Uses purple gradients (`from-gray-900 via-purple-900`) that clash with OLED look
4. **No content length controls** - Users can't toggle between brief/full versions

### Data Viz Status: WORKING
- `/app/visualizations/page.tsx` - Full implementation with:
  - StatCard, BarChart, PieChart, NetworkGraph, Timeline, Treemap components
  - Client-side data loading from `lib/data/client-data`
  - All charts render with proper theming

### Chatbot/AI Status: PARTIALLY CONFIGURED
- `lib/ai/secureOllamaClient.ts` - Security layer implemented:
  - SSH tunnel to Seshat (`scripts/start-ollama-tunnel.sh`)
  - Rate limiting, query validation, blocked operations
  - Streaming response support
- **Status**: Infrastructure ready, UI shows "AI search coming soon"
- **Blocker**: Need to wire up the chat interface to the Ollama client

## Design Requirements

### 1. Color Palette Overhaul
**Remove purple dominance. Adopt Web3Privacy neutral + accent rotation.**

| Element | Current | Target |
|---------|---------|--------|
| Background | `#000000` (good) | Keep `#000000` |
| Surface | `#1e1e2e` (purple tint) | `#111111` (pure dark gray) |
| Primary accent | `#cba6f7` (mauve) | `#ffffff` (white) |
| Secondary accents | (none) | Rotation: `#a6e3a1` (green), `#89b4fa` (blue), `#f9e2af` (yellow), `#f38ba8` (red) |
| Text | `#cdd6f4` | Keep or slightly cooler `#e0e0e0` |
| Muted text | `#6c7086` | Keep |

### 2. Homepage Restructure
**Executive summary and project description FIRST.**

New section order:
1. **Hero** - W3P branding + research title (keep, tweak colors)
2. **Executive Summary** - Move UP with length toggle (brief/full/extended)
3. **Project Description** - New section explaining the research mission
4. **Key Findings** - Stats grid (move down)
5. **OSINT Deep Dives** - Keep
6. **Standard Research** - Keep
7. **Explore Tools** - Visualizations, network graph, portal

### 3. Collapsible Content Sections
**Dropdown menus for content length.**

Each major section gets 3 modes:
- **Brief** (default) - 2-3 sentences
- **Full** - Complete content as now
- **Extended** - Additional context, methodology notes

Implementation: Accordion pattern with toggle buttons.

### 4. Portal/Graph Page Fixes
- Remove purple gradient background → pure black
- Keep the ObsidianGraph functional
- Update card borders to neutral colors

### 5. Art Integration
Use existing project logos from `/public/images/projects/`:
- Display logos in project cards
- Consider a visual grid/mosaic of project logos
- W3P logo already in place - keep prominent

### 6. FZF-Style Command Palette (Cmd+K)
**Global fuzzy search modal accessible from anywhere.**

Behavior:
- `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux) opens modal
- Real-time fuzzy matching as user types
- Keyboard navigation: `↑/↓` to move, `Enter` to select, `Esc` to close
- Matched characters highlighted in results
- Fast - no server round trips, all client-side

Search scope (everything):
- **Projects** - Name, description, slug
- **Privacy Techniques** - zk-SNARKs, mixnets, ring signatures, etc.
- **Categories** - Wallets, DeFi, Infrastructure, etc.
- **Tech Stack** - Rust, TypeScript, Solidity, etc.
- **Locations** - Switzerland, USA, Remote, etc.
- **Pages** - Methodology, Lessons, Visualizations, Portal

Result types with icons:
- 🔒 Project → navigates to `/projects/[slug]`
- 🛡️ Privacy Technique → filters projects page
- 📁 Category → filters projects page
- 💻 Technology → filters projects page
- 📍 Location → filters projects page
- 📄 Page → navigates to page

UI Design:
- Centered modal with backdrop blur
- Search input at top with icon
- Results list below (max 8-10 visible, scrollable)
- Result item shows: icon, name, type badge, preview text
- Subtle border, OLED black background
- Smooth fade-in animation

Data source:
- Build search index from existing `/public/data/search-index.json`
- Or generate at build time from project data

## Non-Goals (Out of Scope)
- Full AI chatbot implementation (infrastructure ready, UI integration later)
- Adding new visualizations
- Changing the underlying data or research content
- Mobile-first redesign (desktop is primary)

## Technical Approach

### Files to Modify
1. `styles/globals.css` - CSS variables, remove purple bias
2. `tailwind.config.js` - Update brand colors
3. `app/page.tsx` - Restructure, add length toggles
4. `app/portal/page.tsx` - Remove purple gradients
5. `app/visualizations/page.tsx` - Update accent colors
6. Create `components/LengthToggle.tsx` - Reusable dropdown component

### New Component: LengthToggle
```tsx
interface LengthToggleProps {
  mode: 'brief' | 'full' | 'extended';
  onChange: (mode: 'brief' | 'full' | 'extended') => void;
}
```

## Edge Cases & Error States

### Empty Search Results
When Cmd+K search has no matches:
- Display "No results found for '[query]'"
- Show fallback navigation: "Browse: Projects | Visualizations | Methodology"
- Do NOT auto-close or show stale results

## Clarifications

### Session 2026-01-11
- Q: Empty search state behavior? → A: Show "No results" + fallback navigation to browse pages
- Q: Length toggle persistence? → A: Session only - resets to "brief" on page refresh
- Q: Mobile command palette access? → A: Search icon in header opens same modal

## Success Criteria
1. No purple accents remain (unless intentionally used as one of rotation colors)
2. Homepage shows executive summary immediately after hero
3. All major sections have working length toggles
4. Portal page is pure OLED black background
5. Site visually aligns with Web3Privacy.info aesthetic
6. All existing functionality preserved (viz, search, routing)

## References
- Web3Privacy.info - Target aesthetic
- Current W3P logo: `/public/images/w3p-logo.svg`
- Project logos: `/public/images/projects/*.{png,svg}`
