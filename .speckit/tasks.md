# Tasks: Web3Privacy Design Overhaul

**Input**: Design documents from `.speckit/`
**Prerequisites**: plan.md (required), spec.md (required), constitution.md (required)
**Tests**: Not explicitly requested - focusing on implementation tasks

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)

## User Stories (Derived from Spec)

| Story | Priority | Description |
|-------|----------|-------------|
| US1 | P1 | OLED Color System - foundational styling |
| US2 | P2 | Command Palette (Cmd+K) - fuzzy search |
| US3 | P3 | Homepage Restructure + Length Toggles |
| US4 | P4 | Portal & Visualizations Cleanup |

---

## Phase 1: Setup

**Purpose**: Tag current state, verify build works

- [ ] T001 Create git tag `pre-design-overhaul` for rollback point
- [ ] T002 Run `npm run build` to verify current state builds without errors
- [ ] T003 Document current color values from `styles/globals.css` for reference

**Checkpoint**: Rollback point established, build verified

---

## Phase 2: Foundational (User Story 1 - OLED Color System) [P1]

**Goal**: Replace all purple-tinted colors with OLED-optimized neutral palette
**Constitution Check**: Principle II (OLED-First Design) - all colors must comply

**Independent Test**: Site renders with pure black background, no purple visible anywhere

### Implementation

- [ ] T004 [US1] Update CSS variables in `styles/globals.css` - replace surface colors (#1e1e2e → #111111, #313244 → #1a1a1a, #45475a → #252525)
- [ ] T005 [US1] Update CSS variables in `styles/globals.css` - replace accent mauve (#cba6f7) with white (#ffffff)
- [ ] T006 [US1] Add rotation accent variables in `styles/globals.css` (--accent-green, --accent-blue, --accent-yellow, --accent-cyan, --accent-red)
- [ ] T007 [US1] Update selection highlight in `styles/globals.css` from mauve to cyan
- [ ] T008 [US1] Update link hover states in `styles/globals.css` from mauve to white
- [ ] T009 [P] [US1] Update `tailwind.config.js` - replace accent-purple with accent-white
- [ ] T010 [P] [US1] Update `tailwind.config.js` - add rotation accent utilities
- [ ] T011 [US1] Remove purple-hover/active variants from `tailwind.config.js`

**Checkpoint**: All color variables updated. Run build to verify no broken references.

---

## Phase 3: User Story 2 - Command Palette (Cmd+K) [P2]

**Goal**: Global fuzzy search accessible from anywhere via keyboard shortcut
**Constitution Check**: Principle IV (Keyboard-First), Principle V (Client-Side Performance)

**Independent Test**: Press Cmd+K on any page, type project name, see results, navigate with arrows, press Enter to go

### Core Components

- [ ] T012 [US2] Create `components/CommandPalette/useCommandPalette.ts` - keyboard shortcut hook (Cmd+K / Ctrl+K)
- [ ] T013 [US2] Create `components/CommandPalette/useFuzzySearch.ts` - fuzzy matching with character highlighting
- [ ] T014 [P] [US2] Create `components/CommandPalette/SearchInput.tsx` - input field with search icon
- [ ] T015 [P] [US2] Create `components/CommandPalette/ResultItem.tsx` - individual result with icon, name, type badge, highlight
- [ ] T016 [US2] Create `components/CommandPalette/ResultsList.tsx` - scrollable results container (max 8-10 visible)
- [ ] T017 [US2] Create `components/CommandPalette/EmptyState.tsx` - "No results" + fallback navigation links
- [ ] T018 [US2] Create `components/CommandPalette/index.tsx` - main modal with portal, backdrop blur, focus trap

### Search Index

- [ ] T019 [US2] Create `lib/search/searchTypes.ts` - SearchItem interface (id, type, name, description, url, icon)
- [ ] T020 [US2] Create `lib/search/buildSearchIndex.ts` - extract projects, techniques, categories, tech, locations, pages from existing data
- [ ] T021 [US2] Update `public/data/search-index.json` with extended search items (or generate at build time)

### Integration

- [ ] T022 [US2] Create `components/CommandPalette/CommandPaletteProvider.tsx` - context provider for open/close state
- [ ] T023 [US2] Update `app/layout.tsx` - wrap with CommandPaletteProvider, render CommandPalette modal
- [ ] T024 [US2] Add search icon button to header for mobile access in `app/layout.tsx`
- [ ] T025 [US2] Add "Press ⌘K to search" hint in footer of `app/layout.tsx`

**Checkpoint**: Cmd+K works from any page. Fuzzy search finds projects. Empty state shows fallback.

---

## Phase 4: User Story 3 - Homepage Restructure [P3]

**Goal**: Executive summary first, collapsible length toggles, content-first hierarchy
**Constitution Check**: Principle III (Content-First Hierarchy), Principle I (Data Integrity - NO placeholder content)

**Independent Test**: Homepage loads with Executive Summary visible immediately after hero. Length toggle cycles through brief/full/extended.

### Length Toggle Component

- [ ] T026 [US3] Create `components/LengthToggle.tsx` - dropdown with brief/full/extended modes, OLED styling
- [ ] T027 [US3] Create `components/CollapsibleSection.tsx` - wrapper that takes content for each mode, renders LengthToggle

### Homepage Restructure

- [ ] T028 [US3] Update `app/page.tsx` - move Executive Summary section immediately after Hero
- [ ] T029 [US3] Update `app/page.tsx` - create Project Description section with REAL content (Constitution I: NO placeholders)
- [ ] T030 [US3] Update `app/page.tsx` - wrap Executive Summary in CollapsibleSection with brief/full/extended content
- [ ] T031 [US3] Update `app/page.tsx` - wrap Project Description in CollapsibleSection
- [ ] T032 [US3] Update `app/page.tsx` - move Key Findings stats grid below Project Description
- [ ] T033 [US3] Update `app/page.tsx` - update all hardcoded purple colors to use CSS variables
- [ ] T034 [US3] Update `app/page.tsx` - ensure all accent colors use rotation (green for stats, blue for links, etc.)

**Checkpoint**: Homepage shows content in correct order. Length toggles work. No purple visible.

---

## Phase 5: User Story 4 - Portal & Visualizations Cleanup [P4]

**Goal**: Remove purple gradients, apply OLED styling consistently
**Constitution Check**: Principle II (OLED-First Design)

**Independent Test**: Portal page has pure black background. Visualizations page has no purple accents.

### Portal Page

- [ ] T035 [P] [US4] Update `app/portal/page.tsx` - replace gradient background with `bg-[#000]`
- [ ] T036 [P] [US4] Update `app/portal/page.tsx` - replace purple card borders with neutral gray / white on hover
- [ ] T037 [P] [US4] Update `app/portal/page.tsx` - replace purple accent text with white or rotation colors
- [ ] T038 [P] [US4] Update `app/portal/page.tsx` - replace purple button with neutral styling
- [ ] T039 [US4] Update `app/portal/page.tsx` - update quick stats to use rotation colors (green/blue/yellow/cyan)

### Visualizations Page

- [ ] T040 [P] [US4] Update `app/visualizations/page.tsx` - replace `brand-accent-purple` with rotation accents
- [ ] T041 [P] [US4] Update `app/visualizations/page.tsx` - update section icons to rotate through accents
- [ ] T042 [P] [US4] Update `app/visualizations/page.tsx` - update loading spinner to neutral white

**Checkpoint**: Portal and Visualizations pages have consistent OLED styling. No purple visible.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, cleanup, documentation

- [ ] T043 Verify all pages render without console errors
- [ ] T044 Test Cmd+K command palette opens from: Homepage, /projects, /projects/[slug], /visualizations, /portal, /methodology, /lessons
- [ ] T045 Test keyboard navigation in command palette (arrows, Enter, Esc)
- [ ] T046 Test mobile search icon in header opens modal
- [ ] T047 Test length toggles on homepage (brief/full/extended)
- [ ] T048 Visual audit: verify no purple accents remain on any page
- [ ] T049 Run `npm run build` to verify production build succeeds
- [ ] T050 Create git commit with all changes

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Colors/US1) → Phase 3-5 can proceed in parallel
                                       ↓
                                Phase 3 (Cmd+K/US2)
                                Phase 4 (Homepage/US3) - needs LengthToggle from Phase 3
                                Phase 5 (Portal+Viz/US4)
                                       ↓
                                Phase 6 (Polish)
```

### User Story Dependencies

- **US1 (Colors)**: No dependencies - MUST complete first (foundational)
- **US2 (Cmd+K)**: Depends on US1 (needs color variables)
- **US3 (Homepage)**: Depends on US1 (needs color variables)
- **US4 (Portal/Viz)**: Depends on US1 (needs color variables)

### Parallel Opportunities

After Phase 2 (US1) completes:
- US2, US3, US4 can proceed in parallel if desired
- Within US2: T014+T015 can run in parallel (different components)
- Within US4: T035-T038 can run in parallel, T040-T042 can run in parallel

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1: Setup
2. Complete Phase 2: US1 (Colors) - **foundation**
3. Complete Phase 3: US2 (Cmd+K) - **highest value feature**
4. **STOP and VALIDATE**: Test Cmd+K works, colors correct
5. Continue with US3 (Homepage), US4 (Polish)

### Task Count Summary

| Phase | Story | Tasks | Parallel |
|-------|-------|-------|----------|
| 1 | Setup | 3 | 0 |
| 2 | US1 | 8 | 2 |
| 3 | US2 | 14 | 2 |
| 4 | US3 | 9 | 0 |
| 5 | US4 | 8 | 6 |
| 6 | Polish | 8 | 0 |
| **Total** | | **50** | **10** |

---

## Constitution Compliance Notes

- **Principle I (Data Integrity)**: T029 MUST use real content for Project Description - NO placeholders
- **Principle II (OLED-First)**: All color tasks enforce #000 base, neutral grays
- **Principle III (Content-First)**: T028-T032 enforce correct section order
- **Principle IV (Keyboard-First)**: T012-T025 implement full keyboard navigation
- **Principle V (Client-Side)**: T019-T021 build client-side search index
- **Principle VI (Reusability)**: LengthToggle, CollapsibleSection, CommandPalette are reusable
