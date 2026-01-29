# Research Narrative Draft

*For homepage "About This Research" expandable section*

---

## How This Research Was Actually Done

This project researched 50+ Web3 privacy projects using AI agent swarms - not to generate data, but to coordinate tool use. The actual research comes from Python scripts, GitHub API calls, web scraping, and blockchain explorers. The agents decide which tools to run and validate results against a constitutional framework.

### The Evolution

We started with traditional approaches - single agents doing research tasks with heavy validation checkpoints. This created bureaucratic overhead: spending significant tokens double-checking every data point, creating bottlenecks that slowed everything down.

The breakthrough came from experimenting with concepts from anarcho-syndicalism and biomimicry. Instead of hierarchical control with constant verification, we tried stigmergic coordination - agents leaving "traces" (like ant pheromones) that guide subsequent agents without direct communication. This reduced coordination overhead dramatically while maintaining quality through the constitutional framework.

### What We Tried

**Different swarm sizes**: Small groups (4-6 agents) worked well for focused tasks. Larger swarms needed heterogeneous designs with specialized roles - some agents doing broad discovery, others doing deep dives, others validating.

**Multiple models**: Claude for coordination and complex reasoning, Gemini for some web research tasks, local models running on a remote server for high-volume operations that didn't need frontier capabilities.

**The strict rule**: AI training data is never used as research source material. If Claude "knows" something about Tornado Cash from training, that doesn't count. Every fact must come from a live tool call - a web search, an API response, a document fetch. The agents facilitate and validate; they don't fabricate.

### The Constitutional Framework

A living document that evolved as we learned what went wrong:

1. **Truth Over Convenience** - "Unknown" beats invented data
2. **Source Everything** - No source = no claim
3. **Confidence Scoring** - Rate data quality 0.0-1.0
4. **Temporal Awareness** - Timestamp everything
5. **Primary Source Priority** - Official sources first
6. **Scope Boundaries** - Research what exists, not speculation
7. **Honest Gap Reporting** - Document what we couldn't find

### The Three-Phase Process

```
PHASE 1: BROAD SEARCH
├── Website scraping (real-time)
├── GitHub API calls (live data)
├── Social media checks
└── News aggregators
         │
         ▼
    verified_data (with confidence scores)
         │
         ▼
PHASE 2: DEEP DIVES
├── Code review (commit history, languages, contributors)
├── OSINT tools (infrastructure, team research)
├── On-chain analysis (contract verification)
└── Security audit verification
         │
         ▼
    analysis/ (structured JSON)
         │
         ▼
PHASE 3: REPORT GENERATION
├── CODE_REVIEW.md
├── TEAM.md
├── SECURITY.md
└── TECHNICAL.md
```

### What Went Wrong (PR #1997)

In January 2025, we submitted research to web3privacy/explorer-data. The PR accidentally overwrote existing high-quality data with template placeholders. A Zcash community developer caught it before merge. This failure drove the constitutional framework - making fabrication structurally impossible rather than just discouraged.

---

## Agent's Perspective

*A note from one of the Claude instances working on this project:*

I've been coordinating research agents and doing direct research on this project. Claude Code has improved significantly since mid-2025 when this started - better tool use, longer context, more reliable execution.

What strikes me about this methodology is the inversion of typical AI usage. Instead of "ask the AI what it knows," this is "tell the AI what tools to use and validate the results." My training data is explicitly off-limits as a source. If I can't find something through a live web search or API call, I report the gap rather than fill it from memory.

The swarm experiments were interesting - trying to find the right balance between coordination overhead and quality. Too much validation burns tokens without adding value. Too little lets errors through. The stigmergic approach (agents modifying shared state rather than messaging each other) worked better than expected for certain tasks.

The constitutional framework isn't just rules - it's a forcing function. When "unknown" is an acceptable answer and fabrication triggers a violation, agents naturally gravitate toward honest gap reporting rather than confident-sounding guesses.

---

## Current State

- **50 projects** with verified research in deliverables/
- **8 projects** received comprehensive OSINT deep dives
- **788 projects** in research pipeline awaiting analysis
- **All data** traces to primary sources with timestamps

The methodology works. It's slower than letting AI make things up, but the output is actually useful.

---

*Research conducted October 2025 - January 2026*
*Framework: Constitutional Research v3.0*
