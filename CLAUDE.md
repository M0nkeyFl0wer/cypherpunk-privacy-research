# Web3 Privacy Cypherpunk Research - Project Config

## Deployment

**Live Site:** https://cypherpunk-research.benwest.io

### Build & Deploy

```bash
# Build static export
npm run build

# Deploy to Dreamhost
rsync -avz --delete out/ dreamhost:~/cypherpunk-research.benwest.io/
```

### Deployment Details
- **Type:** Static export (Next.js `output: 'export'`)
- **Host:** Dreamhost (via SSH alias `dreamhost`)
- **Remote Path:** `~/cypherpunk-research.benwest.io/`
- **Local Build:** `out/` directory after `npm run build`

### Pre-Deploy Checklist
1. Test locally at http://localhost:3000
2. Run `npm run build` - verify no errors
3. Deploy with rsync command above

## Tech Stack
- Next.js 14 (static export)
- React 18
- D3.js (visualizations)
- Tailwind CSS

## Key Files
- `next.config.js` - Export config, security headers
- `components/Visualizations/PrivacyTechGraph.tsx` - Main graph
- `app/projects/[slug]/page.tsx` - Project detail pages
- `deliverables/` - Project research data (40 projects)
