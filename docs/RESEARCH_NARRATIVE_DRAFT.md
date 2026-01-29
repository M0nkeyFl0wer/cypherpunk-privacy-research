# Research Narrative Draft

*For homepage "About This Research" expandable section*

---

## How This Research Was Done

This project researched privacy technology projects using autonomous "agent" swarms - not to generate data directly, but to coordinate tool use. The details about each project come from Python scripts, GitHub API calls, web scrapping, and blockchain explorers as well OSINT tools used via cli. The agents use predefined tools and validate results against a constitutional framework.

### The Evolution

We started with a proof of concept approaches - single agents doing research tasks with heavy validation checkpoints. This created bureaucratic overhead: spending significant tokens double-checking every data point, creating bottlenecks that slowed things down.

The breakthrough came from experimenting with concepts from anarcho-syndicalism and biomimicry. Instead of hierarchical control with constant verification, we tried stigmergic coordination - agents leaving "traces" (like ant pheromones) that guide subsequent agents without direct communication. This reduced coordination overhead dramatically while maintaining quality through the constitutional framework.

### What We Tried

**Different swarm sizes**: Small groups (4-6 agents) worked well for focused tasks. Larger swarms needed heterogeneous designs with specialized roles - some agents doing broad discovery, others doing deep dives, others validating. 

**Multiple models**: Claude for coordination and complex reasoning, Gemini for some web research tasks, local models running on a remote server for high-volume operations that didn't need frontier capabilities.

**The strict rule**: AI training data is never used as research source material. If Claude "knows" something about Tornado Cash from training, that doesn't count. Every fact must come from a live tool call - a web search, an API response, a document fetch. The agents facilitate and validate; they don't fabricate. Even with these control there were moments were issues were introduced by models. All it takes is one bad prompt or a confused new agent to take on a task and use the wrong source material or introduced hallucinations. So the fact checking scans run to validate information back to source material was a key part of this work. All results should be considered a wip and feedback/ updates related to project information that may be out of date or inaccurate would be much appreciated.

### The Constitutional Framework

A living document that evolved as we learned what went wrong:

1. **Truth Over Convenience** - "Unknown" beats invented data
2. **Source Everything** - No source = no claim
3. **Confidence Scoring** - Rate data quality 0.0-1.0
4. **Temporal Awareness** - Time stamp everything
5. **Primary Source Priority** - Official sources first
6. **Scope Boundaries** - Research what exists, not speculation
7. **Honest Gap Reporting** - Document what we couldn't find

### The Three-Phase Process

```
PHASE 1: BROAD SEARCH
├── Website search and fetch (real-time)
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
├── OSINT tools (infrastructure, team research using Shodan, Dehashed, Have I Been Pwned, Virus Total and other tools via Spiderfoot)
├── On-chain analysis (contract verification and chain of custody analysis, using coin geko and other cli tools)
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

### Lessons Learned (PR #1997)

In January 2025, we submitted research to web3privacy/explorer-data. The PR accidentally overwrote existing high-quality data with template placeholders. A Zcash community developer caught thankfully and helped us troubleshoot and roll it back. This failure drove the constitutional framework. It was easier to create a stand alone site to share this research as opposed to trying to fit it all in the existing explorer set up. We will submit another PR that adds links to additional research.

## Next Steps

It would be amazing if others took an interest in getting involved in doing more of this research with their own agents or methodologies. There are still hundreds of projects to research and details in need of fact checking and revision. 

We are also setting up a process for scheduled updating of the facts for each project. Any and all feedback is very much appreciated. Please don't hesitate to add comments or suggestions here: 

Updates or corrections can be added here: 

Thank you for your attention and interest in privacy technology. 

---

*Research conducted October 2025 - January 2026*
*Framework: Constitutional Research v3.0*
