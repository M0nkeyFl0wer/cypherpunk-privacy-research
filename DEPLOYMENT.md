# Deployment Guide - GitHub Pages Auto-Deploy

## 🚀 Automatic Deployment Setup

This site automatically deploys to GitHub Pages whenever you push code. Here's how it works:

### Architecture

```
┌─────────────────┐
│  Push to GitHub │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ GitHub Actions      │
│ (deploy-github-     │
│  pages.yml)         │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ 1. Install deps     │
│ 2. Generate data    │
│ 3. Build Next.js    │
│ 4. Upload artifact  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Deploy to GitHub    │
│ Pages               │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ 🌐 Live at:         │
│ m0nkeyfl0wer.github │
│ .io/web3-privacy... │
└─────────────────────┘
```

---

## 📋 One-Time Setup (Required)

### Step 1: Enable GitHub Pages

1. Go to your repository settings:
   ```
   https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/settings/pages
   ```

2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - Click "Save"

3. That's it! The workflow will handle the rest.

### Step 2: Verify Workflow Permissions

1. Go to Actions settings:
   ```
   https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/settings/actions
   ```

2. Scroll to "Workflow permissions"

3. Select:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"

4. Click "Save"

---

## 🔄 How Auto-Deploy Works

### Triggers

The site automatically rebuilds and deploys when:

1. **Push to branches**:
   - `main`
   - `003-refactor`
   - `004-interactive-github-pages`

2. **Manual trigger**:
   - Go to Actions tab → "Deploy to GitHub Pages" → "Run workflow"

3. **Daily schedule** (optional):
   - Rebuilds every day at 2 AM UTC
   - Ensures data stays fresh even if no code changes

### What Happens During Deployment

```bash
# 1. Install dependencies
npm ci

# 2. Generate fresh project data
npm run generate:data
# → Reads all project_metadata.json files
# → Creates public/data/projects-index.json

# 3. Build static site
npm run build
# → Next.js generates 92 static HTML pages
# → Output: out/ directory

# 4. Deploy to GitHub Pages
# → Uploads out/ directory
# → Site goes live at: https://m0nkeyfl0wer.github.io/...
```

---

## 🎯 Using Auto-Deploy

### Workflow 1: Normal Development

```bash
# 1. Make changes locally
vim some-file.tsx

# 2. Test locally (optional but recommended)
npm run build
npx serve out/

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin 004-interactive-github-pages

# 4. GitHub automatically deploys!
# Watch progress at: https://github.com/.../actions
```

### Workflow 2: Adding New Project Data

```bash
# 1. Add new project directory
mkdir new-project
echo '{"name": "New Project", ...}' > new-project/project_metadata.json

# 2. Commit and push
git add new-project/
git commit -m "Add new project: New Project"
git push

# 3. Auto-deploy runs:
#    - generate-project-index.js picks up new project
#    - Build includes new project
#    - Site updates automatically
```

### Workflow 3: Manual Deployment

If you need to force a rebuild:

```bash
# Option 1: GitHub UI
# 1. Go to: https://github.com/.../actions
# 2. Click "Deploy to GitHub Pages" workflow
# 3. Click "Run workflow" button
# 4. Select branch and click "Run workflow"

# Option 2: Git push (empty commit)
git commit --allow-empty -m "Trigger deployment"
git push
```

---

## 🔍 Monitoring Deployments

### Check Deployment Status

**Option 1: GitHub Actions Tab**
```
https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/actions
```

Look for:
- ✅ Green checkmark = Success
- 🟡 Yellow dot = In progress
- ❌ Red X = Failed

**Option 2: Use Check Script**
```bash
cd /home/flower/web3-privacy-ethereum-cypherpunk-research
./scripts/check-deployment-status.sh
```

**Option 3: Check Live Site**
```bash
curl -I https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/
# Should return: HTTP/2 200
```

### Deployment Timeline

Typical deployment takes **3-5 minutes**:

- ⏱️ 1-2 min: Install dependencies & build
- ⏱️ 1-2 min: Upload artifact
- ⏱️ 0-1 min: Deploy to Pages

### Build Logs

To see detailed logs:

1. Go to Actions tab
2. Click on latest workflow run
3. Click on "build" job
4. Expand steps to see output

---

## 🐛 Troubleshooting

### Issue: Deployment Fails with "Build Error"

**Check**:
```bash
# Test build locally first
cd /home/flower/web3-privacy-ethereum-cypherpunk-research
npm run build

# If it fails locally, fix the errors first
# Then commit and push the fixes
```

### Issue: Site Shows 404 Page

**Solutions**:
1. Check GitHub Pages settings → Source should be "GitHub Actions"
2. Wait 5 minutes for propagation
3. Hard refresh browser: `Ctrl+Shift+R`
4. Check if workflow completed successfully

### Issue: Old Data Showing

**Solutions**:
```bash
# Force rebuild with fresh data
git commit --allow-empty -m "Regenerate data"
git push

# Or manually run workflow from Actions tab
```

### Issue: "Permission Denied" Error

**Fix**:
1. Go to: Settings → Actions → General
2. Under "Workflow permissions"
3. Select "Read and write permissions"
4. Re-run failed workflow

### Issue: Site Loads But Assets Missing

**Fix**: This is a basePath issue. Check `next.config.js`:
```javascript
basePath: '/web3-privacy-ethereum-cypherpunk-research',
assetPrefix: '/web3-privacy-ethereum-cypherpunk-research/',
```

---

## 📊 Deployment Features

### Automatic Data Refresh

The workflow includes a scheduled rebuild:
```yaml
schedule:
  - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

**Disable if not needed**:
Remove the `schedule:` section from `.github/workflows/deploy-github-pages.yml`

### Build Verification

The workflow checks:
- ✅ Dependencies install correctly
- ✅ Data generation succeeds
- ✅ Build completes without errors
- ✅ Output directory exists
- ✅ Required files present

### Deployment Notifications

After successful deployment, a comment is added to the commit with:
- 🌐 Live site URL
- 📦 Build statistics
- ⏰ Deployment timestamp

---

## 🔐 Security

### Secrets & Environment Variables

**Current setup**: No secrets required!
- Site is purely static (no API keys in build)
- GitHub Actions handles authentication automatically

**If you add API integrations**:
```bash
# 1. Add secret in GitHub:
Settings → Secrets and variables → Actions → New repository secret

# 2. Use in workflow:
env:
  API_KEY: ${{ secrets.MY_API_KEY }}
```

### Branch Protection

**Recommended**: Protect main branch
1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require status checks (deploy workflow must pass)
   - ✅ Require pull request reviews

---

## 🌍 CDN & Performance

### GitHub Pages CDN

Your site is served through:
- 🌐 Global CDN (Fastly)
- 🔒 HTTPS enabled by default
- 🚀 Automatic caching

### Cache Control

To force fresh content:
```bash
# Users can hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Or wait for cache to expire (~10 minutes)
```

---

## 📈 Analytics (Optional)

### Add Google Analytics

1. Get GA tracking ID
2. Add to `app/layout.tsx`:
```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
```

### Add Plausible Analytics

1. Add script to `app/layout.tsx`:
```tsx
<Script
  defer
  data-domain="m0nkeyfl0wer.github.io"
  src="https://plausible.io/js/script.js"
/>
```

---

## 🎓 External Tester Instructions

**Share this with testers**:

```
🌐 Live Site:
https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/

📖 Testing Guide:
https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/blob/main/docs/EXTERNAL_TESTING.md

🐛 Report Issues:
https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/issues/new/choose

📊 Check Deployment Status:
https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/actions

The site updates automatically whenever code is pushed. You're always testing the latest version!
```

---

## 🚀 Quick Reference

```bash
# Check if deployment is working
./scripts/check-deployment-status.sh

# Test build locally before pushing
npm run build && npx serve out/

# Force rebuild (empty commit)
git commit --allow-empty -m "Rebuild" && git push

# Watch deployment live
# → Go to GitHub Actions tab in browser

# Site URL
echo "https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/"
```

---

**Everything is now automated! Just push code and the site updates.** 🎉
