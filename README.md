# Cypherpunk Privacy Tools Research Experiment

An open research project exploring privacy technology using autonomous agent swarms, constitutional frameworks, and rigorous source verification.

**Live Site:** [cypherpunk-research.benwest.io](https://cypherpunk-research.benwest.io)

---

## What This Is

This project researches privacy technology projects using autonomous "agent" swarms — not to generate data directly, but to coordinate tool use. The details about each project come from Python scripts, GitHub API calls, web scraping, blockchain explorers, and OSINT tools used via CLI. The agents use predefined tools and validate results against a constitutional framework.

### The Strict Rule

**AI training data is never used as research source material.** If Claude "knows" something about a project from training, that doesn't count. Every fact must come from a live tool call — a web search, an API response, a document fetch. The agents facilitate and validate; they don't fabricate.

---

## Research Methodology

### The Evolution

We started with proof of concept approaches — single agents doing research tasks with heavy validation checkpoints. This created bureaucratic overhead: spending significant tokens double-checking every data point, creating bottlenecks.

The breakthrough came from experimenting with concepts from **anarcho-syndicalism and biomimicry**. Instead of hierarchical control with constant verification, we tried **stigmergic coordination** — agents leaving "traces" (like ant pheromones) that guide subsequent agents without direct communication. This reduced coordination overhead while maintaining quality through the constitutional framework.

### What We Tried

- **Different swarm sizes:** Small groups (4-6 agents) worked well for focused tasks. Larger swarms needed heterogeneous designs with specialized roles.
- **Multiple models:** Claude for coordination and complex reasoning, Gemini for some web research, local models for high-volume operations.
- **Three-phase process:** Broad Search → Deep Dives → Report Generation

### The Constitutional Framework

A living document that evolved as we learned what went wrong:

1. **Truth Over Convenience** — "Unknown" beats invented data
2. **Source Everything** — No source = no claim
3. **Confidence Scoring** — Rate data quality 0.0-1.0
4. **Temporal Awareness** — Timestamp everything
5. **Primary Source Priority** — Official sources first
6. **Scope Boundaries** — Research what exists, not speculation
7. **Honest Gap Reporting** — Document what we couldn't find

---

## Repository Structure

```
├── app/                    # Next.js application
├── components/             # React components (graph visualizations, search)
├── deliverables/           # Project research data
│   └── [project-name]/
│       ├── README.md
│       ├── sources/
│       │   └── verified_data.json    # Structured data with confidence scores
│       └── reports/
│           ├── CODE_REVIEW.md        # Actual code analysis
│           ├── TEAM.md
│           ├── SECURITY.md
│           └── TECHNICAL.md
├── public/data/            # Generated search index and project data
├── scripts/                # Data generation scripts
└── docs/                   # Research documentation
```

### What's in a Code Review

Not just repository descriptions — actual analysis:
- Smart contract architecture
- Cryptographic implementations
- Circuit/zkSNARK analysis where applicable
- Security audit findings
- Code quality assessments

---

## Projects Covered

**Web3 Privacy:** Zcash, Monero, Tornado Cash, Railgun, Secret Network, Nym, DarkFi, Iron Fish, and more.

**Traditional Cypherpunk Tools:** Tor Project, Tails, I2P, GnuPG, Briar, YubiKey — because privacy didn't start with blockchain.

---

## Lessons Learned

In January 2025, we submitted PR #1997 to web3privacy/explorer-data. The PR accidentally overwrote existing high-quality data with template placeholders. A Zcash community developer caught it and helped us roll it back.

This mistake lead to a renewed effort to find the best way to share this work. It was easier to create a standalone site as opposed to trying to fit it all in the existing explorer setup. We will submit another PR to explorer that adds links to this additional research after sharing this site to those in the community for feedback. Thanks.

---

## Contributing

This is a work in progress. All results should be considered experimental. Feedback, corrections, and contributions are welcome.

- **Found an error?** Open an issue or PR
- **Want to add a project?** Follow the deliverables structure
- **Methodology questions?** Check the live site's methodology section

---

## Links

- **Live Site:** [cypherpunk-research.benwest.io](https://cypherpunk-research.benwest.io)
- **Web3Privacy Explorer:** [explorer.web3privacy.info](https://explorer.web3privacy.info)

---

*Research conducted October 2025 – January 2026*
*Framework: Constitutional Research v3.0*
