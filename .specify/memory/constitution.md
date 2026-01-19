<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0
Modified principles: Renumbered I→II, II→III, III→IV, IV→V, V→VI
Added sections: Principle I - Data Integrity (ABSOLUTE)
Removed sections: N/A
Templates requiring updates: ✅ spec.md, ✅ plan.md
Follow-up TODOs: None
-->

# Web3Privacy Research Site Constitution

## Core Principles

### I. Data Integrity (ABSOLUTE - NON-NEGOTIABLE)
**ZERO tolerance for placeholder data, synthetic data, or fabricated content. EVER.**

This principle is SUPREME and overrides ALL other considerations.

**Non-negotiables:**
- NEVER generate placeholder text ("Lorem ipsum", "Example project", "TBD")
- NEVER create synthetic data to fill gaps
- NEVER fabricate statistics, dates, names, or any factual claims
- NEVER invent project descriptions, team members, or technical details
- If data is missing, it MUST be marked as "Data unavailable" or omitted entirely
- If data cannot be verified, it MUST be flagged with confidence level
- All claims MUST trace to primary sources

**What to do when data is missing:**
- Display: "Data not available" or empty state
- Log: Note the gap for future research
- NEVER: Invent, approximate, or "placeholder" the missing information

**Rationale:** This is a research site. Research integrity is everything. One fabricated data point destroys all credibility. The constitutional research methodology that built this dataset demanded zero fabrication - the presentation layer MUST uphold the same standard.

**Violation consequences:** Any code that generates placeholder or synthetic data MUST be rejected and reverted immediately. No exceptions. No "temporary" placeholders. No "we'll fix it later."

**Presentation integrity:**
- NEVER use hyperbolic language ("groundbreaking", "revolutionary", "definitive")
- NEVER make unverifiable claims about impact or importance
- Present findings honestly - include limitations and gaps
- Focus on what was learned, not self-congratulation
- Suggest strategies for further research rather than claiming completeness
- Confidence scores MUST be displayed where applicable
- Methodology MUST be transparent and accessible

---

### II. OLED-First Design
All visual elements MUST prioritize true black (#000000) backgrounds for OLED display optimization.

**Non-negotiables:**
- Background base MUST be `#000000`, never dark gray
- Surface colors MUST be neutral grays (#111, #1a1a, #252525), never purple-tinted
- Primary accent MUST be white (#ffffff) for maximum contrast
- Secondary accents use rotation: green (#a6e3a1), blue (#89b4fa), yellow (#f9e2af), cyan (#94e2d5), red (#f38ba8)
- No single accent color dominance - rotate based on context

**Rationale:** Web3Privacy.info uses this aesthetic. OLED displays save power with true black. High contrast improves readability.

### III. Content-First Hierarchy
Executive summary and project description MUST be the first content users see after the hero section.

**Non-negotiables:**
- Homepage order: Hero → Executive Summary → Project Description → Key Findings → Everything else
- Long-form content MUST have collapsible length toggles (brief/full/extended)
- Default view MUST be "brief" to reduce cognitive load
- Users MUST be able to expand without page navigation

**Rationale:** Research sites exist to communicate findings. Don't bury the lede.

### IV. Keyboard-First Interaction
All navigation and search MUST be accessible via keyboard without mouse.

**Non-negotiables:**
- Command palette (Cmd+K/Ctrl+K) MUST work from any page
- Arrow keys navigate results, Enter selects, Esc closes
- All interactive elements MUST have visible focus states
- Tab order MUST follow visual reading order

**Rationale:** Power users expect keyboard shortcuts. Accessibility requires keyboard navigation.

### V. Client-Side Performance
All search and filtering MUST happen client-side with zero network latency.

**Non-negotiables:**
- Search index MUST be pre-built and loaded on page init
- Fuzzy matching MUST update results as user types (<50ms)
- No search-as-you-type API calls
- Visualizations MUST use client-side data (already loaded)

**Rationale:** 40 projects is small enough for client-side search. Network latency kills UX.

### VI. Component Reusability
UI patterns MUST be extracted into reusable components, not duplicated.

**Non-negotiables:**
- LengthToggle component for all collapsible sections
- CommandPalette as a single global component
- Color variables defined once in CSS, referenced everywhere
- No inline color values that duplicate the palette

**Rationale:** Consistency prevents visual drift. Single source of truth for colors.

## Design Constraints

### Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS + CSS custom properties
- **Data Viz**: D3.js (already implemented)
- **Search**: Client-side fuzzy matching (fuse.js or custom fzf-style)
- **State**: React useState/useContext (no external state library needed)

### Forbidden Patterns
- Purple as primary accent color
- Gradient backgrounds (except subtle grid overlay)
- Server-side search API calls
- Hardcoded color values in components
- Nested ternaries for content length

### Required Patterns
- CSS custom properties for all colors
- Semantic HTML (nav, main, section, article)
- aria-labels on interactive elements
- data-testid on key components for testing

## Development Workflow

### Change Process
1. All changes MUST be reviewed against constitution principles
2. Color changes MUST update CSS variables, not component styles
3. New components MUST be extracted if pattern repeats 2+ times
4. Keyboard shortcuts MUST be documented in a central location

### Testing Gates
- Build MUST succeed without errors
- All pages MUST render without console errors
- Command palette MUST open from every page
- Focus states MUST be visible on all interactive elements

### Commit Discipline
- Commit after each phase completion
- Tag significant milestones: `design-v1.0`, `cmdk-v1.0`
- Commit messages reference constitution principles when relevant

## Governance

This constitution supersedes all ad-hoc design decisions. Amendments require:
1. Clear rationale for why current principle is insufficient
2. Documentation of the change
3. Update to LAST_AMENDED_DATE and version increment

**Compliance:** All PRs/changes MUST verify alignment with these principles. Violations require explicit justification in the PR description.

**Version**: 1.1.0 | **Ratified**: 2026-01-11 | **Last Amended**: 2026-01-11
