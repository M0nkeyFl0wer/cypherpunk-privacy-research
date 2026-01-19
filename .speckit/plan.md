# Implementation Plan: Web3Privacy Design Overhaul

## Phase 1: Color System Overhaul

### Task 1.1: Update CSS Variables
**File**: `styles/globals.css`

Changes:
- Replace `--ctp-mauve: #cba6f7` references with neutral white or rotation accents
- Update surface colors from purple-tinted to pure grays
- Keep OLED black base
- Add CSS custom properties for accent rotation

```css
:root {
  /* OLED Base - keep */
  --ctp-base: #000000;
  --ctp-mantle: #080808;
  --ctp-crust: #040404;

  /* Surfaces - neutralize */
  --ctp-surface0: #111111;  /* was #1e1e2e */
  --ctp-surface1: #1a1a1a;  /* was #313244 */
  --ctp-surface2: #252525;  /* was #45475a */

  /* Accents - rotation */
  --accent-primary: #ffffff;
  --accent-green: #a6e3a1;
  --accent-blue: #89b4fa;
  --accent-yellow: #f9e2af;
  --accent-red: #f38ba8;
  --accent-cyan: #94e2d5;
}
```

### Task 1.2: Update Tailwind Config
**File**: `tailwind.config.js`

Changes:
- Replace `accent-purple` with `accent-white`
- Add rotation accent utilities
- Remove purple-hover/active variants

---

## Phase 2: Create Reusable Components

### Task 2.1: Create LengthToggle Component
**File**: `components/LengthToggle.tsx` (new)

A dropdown/toggle component for content length:
- Three states: brief, full, extended
- Minimal styling matching OLED theme
- Keyboard accessible

### Task 2.2: Create CollapsibleSection Component
**File**: `components/CollapsibleSection.tsx` (new)

Wrapper component that:
- Takes brief/full/extended content as props
- Renders LengthToggle
- Shows appropriate content based on selection
- Smooth expand/collapse animation

### Task 2.3: Create CommandPalette Component
**File**: `components/CommandPalette/index.tsx` (new)

FZF-style global search modal:

```tsx
// Component structure
components/CommandPalette/
├── index.tsx           // Main modal component
├── SearchInput.tsx     // Input with icon
├── ResultsList.tsx     // Scrollable results
├── ResultItem.tsx      // Individual result with highlighting
├── useCommandPalette.ts // Hook for keyboard shortcuts
└── useFuzzySearch.ts   // Fuzzy matching logic
```

**index.tsx** - Main component:
- Portal to render at body level
- Backdrop with blur effect
- Centered modal container
- Keyboard event handling (Esc to close)
- Focus trap inside modal

**useCommandPalette.ts** - Global keyboard hook:
```tsx
// Listens for Cmd+K / Ctrl+K globally
// Returns { isOpen, open, close, toggle }
// Registered at app layout level
```

**useFuzzySearch.ts** - Fuzzy matching:
```tsx
// Uses fzf-style algorithm (fuzzaldrin-plus or custom)
// Highlights matched characters
// Returns sorted results with scores
```

### Task 2.4: Build Search Index
**File**: `lib/search/buildIndex.ts` (new)

Extend existing `/public/data/search-index.json` to include:
- Projects (already exists)
- Privacy techniques (extract from projects)
- Categories (extract unique values)
- Tech stack (extract unique values)
- Locations (extract unique values)
- Static pages (hardcoded list)

Result type:
```tsx
interface SearchItem {
  id: string;
  type: 'project' | 'technique' | 'category' | 'tech' | 'location' | 'page';
  name: string;
  description?: string;
  url: string;       // Where to navigate
  filterParam?: string; // Optional query param for filtering
  icon: string;      // Emoji or icon name
}
```

### Task 2.5: Register CommandPalette in Layout
**File**: `app/layout.tsx`

- Import CommandPalette
- Add CommandPaletteProvider wrapper
- Render CommandPalette modal (portaled)
- Add visual hint in footer: "Press ⌘K to search"

---

## Phase 3: Homepage Restructure

### Task 3.1: Reorder Sections in page.tsx
**File**: `app/page.tsx`

New order:
1. Hero (keep, update colors)
2. Executive Summary (move up, add CollapsibleSection)
3. Project Description (new section)
4. Key Findings (move down)
5. OSINT Deep Dives
6. Standard Research
7. Explore Tools

### Task 3.2: Add Collapsible Content
**File**: `app/page.tsx`

Wrap Executive Summary in CollapsibleSection with:
- **Brief**: First paragraph only
- **Full**: All current content
- **Extended**: Add methodology reference and data sources

### Task 3.3: Create Project Description Section
**File**: `app/page.tsx`

New section explaining:
- What this research is
- How it was conducted
- Who it's for
- Constitutional methodology reference

---

## Phase 4: Portal Page Cleanup

### Task 4.1: Remove Purple Gradients
**File**: `app/portal/page.tsx`

Changes:
- Background: `from-gray-900 via-purple-900 to-gray-900` → `bg-[#000]`
- Card borders: `border-purple-500` → `border-gray-700` or white on hover
- Accent text: `text-purple-400` → `text-white` or rotation colors
- Button: `bg-purple-600` → `bg-white text-black` or neutral

### Task 4.2: Update Color Scheme
- Graph background: Keep dark
- Feature cards: Use rotation accents for different cards
- Quick stats: Use green/blue/yellow/cyan instead of purple/blue/green/pink

---

## Phase 5: Visualizations Page Polish

### Task 5.1: Update Accent Colors
**File**: `app/visualizations/page.tsx`

Changes:
- Section icons: Rotate through accents (green, blue, yellow, cyan)
- Remove any `brand-accent-purple` references
- Loading spinner: neutral white

---

## Phase 6: Global Cleanup

### Task 6.1: Update Selection Highlight
**File**: `styles/globals.css`

Change selection from mauve to cyan or white.

### Task 6.2: Update Link Hover States
**File**: `styles/globals.css`

Links hover: white or cyan instead of mauve.

### Task 6.3: Test All Pages
- Homepage
- /projects
- /projects/[slug]
- /visualizations
- /portal
- /methodology
- /lessons

---

## Implementation Order

```
1. Phase 1 (Colors) - Foundation must be solid first
2. Phase 2 (Components) - Build reusable pieces including CommandPalette
3. Phase 3 (Homepage) - Most visible impact
4. Phase 4 (Portal) - Secondary page
5. Phase 5 (Visualizations) - Polish
6. Phase 6 (Cleanup) - Final sweep
```

## Rollback Strategy
- Commit after each phase
- Tag current state before starting: `git tag pre-design-overhaul`
- Can revert individual phases if needed

## Testing Checklist
- [ ] No purple accents visible (except intentional rotation)
- [ ] Executive summary appears immediately after hero
- [ ] Length toggles work on all sections
- [ ] Portal page is pure black background
- [ ] All visualizations render correctly
- [ ] No broken links or missing styles
- [ ] Mobile responsive (basic)
- [ ] Build succeeds without errors
- [ ] Cmd+K opens command palette from any page
- [ ] Fuzzy search finds projects by partial name
- [ ] Arrow keys navigate results, Enter selects
- [ ] Esc closes the palette
- [ ] Search results include projects, techniques, categories, pages
- [ ] Matched characters are highlighted in results
- [ ] Navigation works for all result types
