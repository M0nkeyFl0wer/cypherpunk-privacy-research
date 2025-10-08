# Web3 Privacy Ethereum Cypherpunks Research

> 🌐 **[View Live Site](https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/)**

Comprehensive research on **114 Web3 privacy projects** with 100% real data and zero fabrication. This interactive research platform provides rich visualizations, smart search, and AI-powered exploration of privacy technologies in the Web3 ecosystem.

![Project Stats](https://img.shields.io/badge/Projects-114-purple)
![Cards](https://img.shields.io/badge/Cards-85-blue)
![Reports](https://img.shields.io/badge/Reports-113-green)
![Completeness](https://img.shields.io/badge/Completeness-30%25-orange)

## ✨ Features

### 📊 Interactive Visualizations
Three D3.js-powered visualizations with rich, interactive tooltips:

- **[Network Graph](https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/visualizations)** - Force-directed graph showing project relationships through shared technologies
  - Drag nodes to rearrange
  - Zoom and pan for exploration
  - Hover for comprehensive project details
  - Click to navigate to full reports

- **[Treemap](https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/visualizations)** - Hierarchical visualization grouped by category
  - Box size = project importance (tech + privacy + completeness)
  - Hover for project descriptions, links, and tech stack
  - Click to view full project details

- **[Timeline](https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/visualizations)** - Area chart showing project launches over time
  - Interactive year dots with project cards
  - Category breakdown for each year
  - Shows privacy innovation waves

### 🔍 Smart Search
**[Search across 114 projects](https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/search)** by:
- Project name
- Category (DeFi, Infrastructure, Wallets, etc.)
- Technology stack
- Privacy techniques
- Real-time filtering

### 💬 AI Chat Interface
**[Ask questions about privacy projects](https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/chat)** using your own Claude API key:
- Bring Your Own Key (BYOK) - your key, your control
- Secure client-side processing
- Context-aware responses about Web3 privacy
- No data sent to our servers

### 📝 Comprehensive Project Reports
Each project includes:
- Full README with detailed analysis
- Glancable project card
- Tech stack and privacy techniques
- GitHub and website links
- Constitutional research data

## 🎯 Research Status

This is an **active research project** documenting Web3 privacy technologies:

✅ **114 Projects Identified** - Comprehensive privacy project catalog
⋯ **Technical Details In Progress** - Tech stacks and implementations being researched
✅ **Verified Information Only** - No placeholder or synthetic data
⋯ **Continuously Updated** - New findings added as research progresses

## 📂 Project Categories

| Category | Count | Examples |
|----------|-------|----------|
| DeFi | 12 | Railgun, Panther Protocol, Firn Protocol |
| Infrastructure | 8 | Nym, Secret Network, Penumbra |
| Wallets | 10 | Brume Wallet, Railway Wallet, Frame |
| Computing | 9 | Phala Network, iExec, Nillion |
| Messaging | 5 | Session, Status, Zion |
| Layer 2 | 7 | Polygon Nightfall, Scroll, Taiko |
| Identity (DID) | 6 | Polygon ID, Litentry, Sismo |
| Other | 57 | Various privacy infrastructure |

## 🚀 Quick Start

Visit the live site: **[m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research](https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/)**

Or explore specific features:
- 📊 [Visualizations](https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/visualizations)
- 🔍 [Search](https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/search)
- 💬 [AI Chat](https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/chat)

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research.git
cd web3-privacy-ethereum-cypherpunk-research

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── page.tsx           # Homepage
│   ├── visualizations/    # D3.js visualizations
│   ├── search/            # Search interface
│   ├── chat/              # AI chat interface
│   └── project/[id]/      # Individual project pages
├── components/            # React components
│   └── Visualizations/    # D3.js visualization components
├── lib/                   # Utilities and helpers
├── public/                # Static assets
│   └── data/              # Generated project data
├── scripts/               # Build and sync scripts
└── [project-folders]/     # Individual project data
```

## 📊 Data Pipeline

1. **Source Data**: Projects stored in `/deliverables/` in main research repo
2. **Sync Script**: `./scripts/sync-cards-from-deliverables.sh` copies cards and metadata
3. **Index Generation**: `scripts/generate-project-index.js` creates `projects.json`
4. **Build**: Next.js generates static site with all visualizations
5. **Deploy**: GitHub Actions automatically deploys to GitHub Pages

### Syncing Latest Data

```bash
# Sync cards from deliverables folder
./scripts/sync-cards-from-deliverables.sh

# Rebuild site
npm run build

# Commit and push (triggers auto-deploy)
git add -A
git commit -m "Update project data"
git push
```

## 🔒 Security Features

- **Client-side API Keys**: Your Claude API key never leaves your browser
- **No Server**: Static site hosted on GitHub Pages
- **HTTPS Enforced**: Secure connections only
- **Content Security Policy**: XSS protection enabled
- **Rate Limiting**: Client-side rate limits for API calls

See [docs/SECURITY.md](docs/SECURITY.md) for detailed security documentation.

## 🤝 Contributing

Contributions welcome! To add or update project data:

1. Fork the main research repository
2. Update project data in `/deliverables/[project-name]/`
3. Ensure data follows constitutional requirements (see CONSTITUTION.md)
4. Submit pull request
5. Data will be synced to GitHub Pages automatically

## 📚 Documentation

- **[Security Documentation](docs/SECURITY.md)** - Security features and best practices
- **[Seshat Security](docs/SESHAT_SECURITY.md)** - Remote compute security (if applicable)
- **[Constitution](CONSTITUTION.md)** - Data integrity requirements (in main repo)

## 🛣️ Roadmap

- [x] Interactive D3.js visualizations
- [x] Smart search functionality
- [x] AI chat interface (BYOK)
- [x] Project cards and detailed reports
- [x] Automated data sync pipeline
- [x] GitHub Pages deployment
- [ ] Direct card.md rendering in visualization tooltips
- [ ] Advanced filtering (by tech stack, privacy technique)
- [ ] Export visualization data
- [ ] Project comparison tool
- [ ] Timeline filters and zoom

## 📄 License

This project is part of the Web3Privacy research initiative. See main repository for licensing details.

## 🙏 Acknowledgments

- Built with [Next.js 14](https://nextjs.org/)
- Visualizations powered by [D3.js](https://d3js.org/)
- AI chat via [Claude API](https://www.anthropic.com/claude)
- Research methodology: SPARC (Specification, Pseudocode, Architecture, Refinement, Completion)

## 📞 Contact

For questions about the research or this platform:
- Open an issue in this repository
- Visit the main [Web3Privacy Research](https://github.com/web3privacy) organization

---

**🌐 [View Live Site →](https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/)**

*Generated with Claude Code • 100% Real Data • Zero Fabrication*
