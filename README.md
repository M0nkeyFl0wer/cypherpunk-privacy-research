# Ethereum Cypherpunk Research

A draft of ongoing comprehensive research on **Etherum privacy projects** - protocols, tools, and infrastructure enabling confidential transactions and anonymous interactions.

## 📊 Dataset Overview

- **Current Total Projects**: 76 privacy-focused projects

## 🔍 What's Included

Each project includes: (some work still underway, this is an open source project pleaese suggest edits and addidtions)
- Detailed technical description
- GitHub repository links (where available)
- Code analysis (languages, LOC, contracts)
- Team information
- Security assessments
- OSINT data

## 🔄 Research Methodology

<details>
<summary>Click to view research pipeline flow diagram</summary>

```
┌─────────────────────────────────────────────────────────────────┐
│                     INITIAL DISCOVERY PHASE                      │
│                                                                   │
│  Web Search → Web Fetch → API Calls (GitHub, Etherscan, etc.)   │
│           ↓                                                       │
│     Project Identification & Basic Metadata                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  TECHNICAL ANALYSIS PHASE                        │
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐     │
│  │  Onchain    │  │ Code Review  │  │  OPSEC Analysis    │     │
│  │  Activity   │  │ (AI Agents)  │  │  (Security Audit)  │     │
│  └─────────────┘  └──────────────┘  └────────────────────┘     │
│         ↓                 ↓                    ↓                 │
│         └─────────────────┴────────────────────┘                │
│                           ↓                                      │
│                   Findings & Insights                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     DEEP DIVE PHASE                              │
│                                                                   │
│  Pivoting on Findings:                                           │
│  • Additional Web Search & Web Fetch                             │
│  • Screenshot & Web Page Manipulation (Debug Tools)              │
│  • Website Testing & Interaction Analysis                        │
│  • AI Agent Code Reviews                                         │
│  • AI-Generated Summary Descriptions                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  DATA PROCESSING & OUTPUTS                       │
│                                                                   │
│  Python Scripts → Data Visualizations → JSON/MD Reports          │
│                           ↓                                      │
│                    Built in VS Codium                            │
│                           ↓                                      │
│                    Pushed to GitHub                              │
└─────────────────────────────────────────────────────────────────┘

*Special thanks to Seshat server for handling data-intensive tasks*
```

</details>

## 📁 Repository Structure

```
├── {project-name}/
│   ├── constitutional_research.json    # Core project data
│   ├── README.md                       # Full summary
│   ├── CARD.md                        # Quick reference
│   ├── analysis/                      # Technical analysis
│   ├── reports/                       # Research reports
│   └── sources/                       # Raw data sources
```

## 🚀 Featured Projects

Privacy protocols, ZK solutions, mixers, private messaging, confidential computing, and more.

## 📄 Reports

- [Production Ready Report](PRODUCTION_READY_REPORT.md) - Current status
- [Session Summary](SESSION_COMPLETE_SUMMARY.md) - Research methodology

## 🎯 Use Cases

- Privacy project discovery
- Technical due diligence
- Ecosystem research
- Developer tools analysis

## 🛠️ Tools & Technologies

- **Development**: VS Codium
- **AI Agents**: Code review, analysis, summarization
- **Data Processing**: Python scripts, visualization libraries
- **APIs**: GitHub, Etherscan, Web3Privacy, OSINT tools
- **Infrastructure**: Seshat server for compute-intensive tasks
- **Debugging**: Screenshot tools, web page manipulation
- **Version Control**: Git → GitHub

## 📜 License

Research data compiled from public sources. Individual projects have their own licenses.

---

*Research compiled October 2025*
