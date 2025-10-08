# Testing Guide - Interactive GitHub Pages

## 🚀 Quick Start (Local Development)

### 1. Start Development Server

```bash
cd /home/flower/web3-privacy-ethereum-cypherpunk-research
npm run dev
```

The site will be available at: **http://localhost:3000**

### 2. Pages to Test

| Page | URL | What to Test |
|------|-----|--------------|
| **Home** | http://localhost:3000 | Landing page |
| **Search** | http://localhost:3000/search | Search bar, filters, results |
| **Visualizations** | http://localhost:3000/visualizations | All charts (bar, pie, network, timeline, treemap) |
| **AI Chat** | http://localhost:3000/chat | Query processing, project results |
| **Feedback** | http://localhost:3000/feedback | Form validation, GitHub redirect |
| **Project Detail** | http://localhost:3000/project/aztec | Individual project pages |

### 3. Test Production Build (Recommended)

```bash
# Build the static site
npm run build

# Preview the production build
npm run start
# OR serve the output directory
npx serve out/
```

Production build creates static HTML in the `out/` directory.

---

## 📊 Data Update Workflow

### How Data Updates Work

**The site does NOT auto-update. It uses a build-time data generation pattern:**

1. **Data Source**: Project data lives in `/home/flower/web3-privacy-ethereum-cypherpunk-research/` (each project has its own directory)
2. **Build-Time Generation**: `scripts/generate-project-index.js` runs BEFORE every build
3. **Static Output**: Data is compiled into `public/data/projects-index.json`
4. **Client-Side Loading**: React components fetch this static JSON file

### When You Add/Update Project Data

**IMPORTANT**: After adding or updating project data, you MUST rebuild:

```bash
# Regenerate data + rebuild
npm run build

# OR just regenerate data (for dev server)
npm run generate:data
npm run dev
```

### Automatic Rebuild Triggers

The `prebuild` script automatically regenerates data:

```json
{
  "scripts": {
    "prebuild": "npm run generate:data",
    "build": "next build",
    "generate:data": "node scripts/generate-project-index.js"
  }
}
```

**This means**:
- ✅ `npm run build` → Auto-generates fresh data
- ❌ `npm run dev` → Uses existing data (manual `npm run generate:data` needed)

---

## 🔄 GitHub Pages Deployment

### Automated Deployment (Recommended)

When you push to GitHub, set up GitHub Actions to auto-deploy:

**`.github/workflows/deploy.yml`** (needs to be created):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, 003-refactor]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Manual Deployment

```bash
# 1. Build the site
npm run build

# 2. The `out/` directory contains your static site
# 3. Push to gh-pages branch or configure GitHub Pages in repo settings
```

---

## 🧪 Interactive Features to Test

### 1. Search Page
- Type queries: "zk", "mixer", "wallet"
- Apply filters: categories, tech stacks, status
- Click project cards → should navigate to detail page

### 2. Visualizations
- **Bar Charts**: Hover to see values
- **Pie Charts**: Click segments
- **Network Graph**:
  - Drag nodes around (physics simulation)
  - Hover nodes to see labels
- **Timeline**:
  - Hover data points to see year + projects
  - Smooth line animation
- **Treemap**:
  - Hover categories to see projects
  - Different sizes for different category counts

### 3. AI Chat
- Ask: "Show me projects using zk-SNARKs"
- Ask: "What privacy projects were founded in 2020?"
- Ask: "Find mixing services"
- Results should show relevant projects with links

### 4. Feedback Form
- Fill out each feedback type
- Test validation (required fields)
- Submit → Should open GitHub with pre-filled data
- Check honeypot field is hidden

### 5. Project Detail Pages
- Navigate to `/project/aztec` (or any project ID)
- Check all data displays correctly
- Links to GitHub, website work

---

## 📝 Data Freshness Strategy

### Option 1: Manual Rebuild (Current)
```bash
# When you update project data
npm run build
# Then deploy
```

### Option 2: Scheduled Rebuilds (Recommended)
Add to GitHub Actions workflow:

```yaml
on:
  schedule:
    # Rebuild every day at midnight
    - cron: '0 0 * * *'
  workflow_dispatch: # Manual trigger
```

### Option 3: Webhook Rebuild
Trigger rebuild when data repository updates:

```yaml
on:
  repository_dispatch:
    types: [data-updated]
```

---

## 🐛 Common Issues & Solutions

### Issue: "Data not updating in dev server"
**Solution**: Run `npm run generate:data` then restart dev server

### Issue: "Network graph not showing"
**Solution**: Check browser console for D3 errors, ensure projects have `founded` year

### Issue: "Search returns no results"
**Solution**:
1. Check `public/data/projects-index.json` exists
2. Verify data has `name`, `category`, `techStack` fields
3. Run `npm run generate:data`

### Issue: "Feedback form doesn't open GitHub"
**Solution**:
1. Check popup blocker
2. Verify GitHub URL in browser console
3. Test issue templates at: https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/issues/new/choose

### Issue: "Build fails with D3 type errors"
**Solution**: Already fixed with type assertions, but if issues persist:
```bash
npm install --save-dev @types/d3@latest
```

---

## 📈 Performance Testing

### Check Bundle Size
```bash
npm run build
# Look at the Route table for size info
```

### Lighthouse Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit on production build
npm run build
npx serve out/
lighthouse http://localhost:3000 --view
```

---

## 🔍 Data Validation

### Check Generated Data
```bash
# View the generated index
cat public/data/projects-index.json | jq '.stats'

# Count projects
cat public/data/projects-index.json | jq '.projects | length'

# Check average confidence
cat public/data/projects-index.json | jq '.stats.averageConfidence'
```

### Validate Project Data
```bash
# Run constitutional validator
npm run validate
# (if implemented in scripts/)
```

---

## 🚀 Quick Test Commands

```bash
# Full test cycle
npm run build && npx serve out/

# Dev with fresh data
npm run generate:data && npm run dev

# Check for errors
npm run lint
npm run type-check

# View production URLs (after deploy)
echo "https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/"
```

---

## 📦 Next Steps

1. ✅ Test locally: `npm run dev`
2. ✅ Test production build: `npm run build && npx serve out/`
3. ⏳ Set up GitHub Actions for auto-deploy
4. ⏳ Configure scheduled rebuilds for data freshness
5. ⏳ Add E2E tests with Playwright

---

**Questions?** Check:
- Build errors: `npm run build 2>&1 | tee build.log`
- Runtime errors: Browser DevTools Console (F12)
- Data issues: `cat public/data/projects-index.json | jq`
