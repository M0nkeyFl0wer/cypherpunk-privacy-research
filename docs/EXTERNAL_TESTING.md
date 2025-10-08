# External Testing Guide

Welcome to the Web3 Privacy Ethereum Cypherpunks Research Platform testing!

## 🌐 Live Testing URL

**Production Site**: https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/

This site is automatically deployed whenever code is pushed to the repository. You're always testing the latest version!

---

## 📱 What to Test

### 1. Home Page
**URL**: https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/

**Test**:
- [ ] Page loads without errors
- [ ] Web3Privacy branding displays
- [ ] Navigation links work
- [ ] Responsive on mobile/tablet/desktop

---

### 2. Search & Discovery
**URL**: https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/search/

**Test**:
- [ ] Search bar accepts input
- [ ] Search results appear as you type
- [ ] Filters work (categories, tech stack, status)
- [ ] Project cards are clickable
- [ ] Results are relevant to search query
- [ ] No results message appears for gibberish queries

**Try These Searches**:
- "zk" or "zero knowledge"
- "mixer" or "mixing"
- "wallet"
- "ethereum"
- "privacy"

---

### 3. Interactive Visualizations
**URL**: https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/visualizations/

**Test Each Visualization**:

#### Bar Charts & Pie Charts
- [ ] Hover shows values
- [ ] Charts render correctly
- [ ] Data labels are readable

#### Network Graph (Force-Directed)
- [ ] Graph displays with colored nodes
- [ ] You can drag nodes around
- [ ] Nodes bounce back (physics simulation)
- [ ] Hover shows node labels
- [ ] Purple = Projects, Cyan = Tech, Green = Categories

#### Timeline
- [ ] Line chart displays historical data
- [ ] Hover on data points shows year + project count
- [ ] Projects list appears below when hovering
- [ ] Smooth animations work

#### Treemap
- [ ] Colored rectangles display
- [ ] Size represents project count per category
- [ ] Hover shows category details
- [ ] Project list appears below when hovering
- [ ] All categories visible

---

### 4. AI Chat Assistant
**URL**: https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/chat/

**Test**:
- [ ] Chat interface loads
- [ ] You can type messages
- [ ] AI responds to queries
- [ ] Relevant projects appear in results
- [ ] Project cards are clickable

**Try These Queries**:
- "Show me projects using zk-SNARKs"
- "What privacy wallets are active?"
- "Find mixing services"
- "Projects founded in 2020"
- "Which projects use Ethereum?"

---

### 5. Feedback Form
**URL**: https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/feedback/

**Test Each Feedback Type**:

#### Missing Project
- [ ] Form shows required fields
- [ ] Validation works (red errors for empty required fields)
- [ ] Submit button opens GitHub
- [ ] GitHub issue form is pre-filled with your data
- [ ] All your input appears in the GitHub form

#### Incorrect Data
- [ ] Project ID field works
- [ ] Field name input works
- [ ] Current/correct value fields work
- [ ] Evidence URLs textarea works
- [ ] Submit opens GitHub with pre-filled data

#### Update Needed
- [ ] Project ID field works
- [ ] "What changed" textarea works
- [ ] Evidence URLs work
- [ ] Submit opens GitHub correctly

#### Feature Request
- [ ] Feature description textarea works
- [ ] Character counter shows
- [ ] Submit opens GitHub

#### General Feedback
- [ ] Feedback textarea works
- [ ] Optional fields work
- [ ] Submit opens GitHub

**Security Test**:
- [ ] Honeypot field is hidden (inspect HTML to verify)
- [ ] Form doesn't submit if honeypot is filled

---

### 6. Project Detail Pages
**URL Pattern**: https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/project/{project-id}/

**Test Projects**:
- [ ] https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/project/aztec/
- [ ] https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/project/tornado-cash/
- [ ] https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/project/nym/

**Check**:
- [ ] Project name displays
- [ ] All metadata shows (category, status, founded year)
- [ ] Privacy techniques listed
- [ ] Tech stack listed
- [ ] Links to GitHub/website work
- [ ] "Back to search" link works
- [ ] Confidence score displays

---

## 🐛 Bug Reporting

### How to Report Issues

**Found a bug?** Please report it:

1. **Via Feedback Form** (easiest):
   - Go to: https://m0nkeyfl0wer.github.io/web3-privacy-ethereum-cypherpunk-research/feedback/
   - Select "General Feedback"
   - Describe the issue

2. **Via GitHub Issues** (detailed):
   - Go to: https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/issues/new
   - Click "General Feedback"
   - Provide:
     - What you were doing
     - What you expected
     - What actually happened
     - Screenshots (if applicable)
     - Browser & device info

### What to Include in Bug Reports

```
**Description**: [Brief description]

**Steps to Reproduce**:
1. Go to [URL]
2. Click on [element]
3. See error

**Expected**: [What should happen]

**Actual**: [What actually happens]

**Browser**: Chrome 120 / Firefox 115 / Safari 17 / etc.
**Device**: Desktop / Mobile / Tablet
**OS**: Windows 11 / macOS 14 / Android 13 / iOS 17

**Screenshot**: [Attach if relevant]

**Console Errors**: [F12 > Console tab > Copy any red errors]
```

---

## 📊 Performance Testing

### Load Time Check
- [ ] Home page loads in < 3 seconds
- [ ] Visualizations page loads in < 5 seconds (D3.js charts take time)
- [ ] Search is responsive (< 1 second)
- [ ] Navigation is instant

### Mobile Testing
Test on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (any)

Check:
- [ ] Text is readable without zooming
- [ ] Buttons are tappable (not too small)
- [ ] Visualizations are scrollable
- [ ] Forms work on mobile keyboard

---

## 🔍 Browser Compatibility

### Minimum Browser Versions
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Known Issues
- **IE11**: Not supported (Next.js 14 requirement)
- **Safari < 14**: D3.js visualizations may have rendering issues

---

## 📈 What We're Looking For

### Critical Issues (Report Immediately)
- ❌ Site doesn't load
- ❌ JavaScript errors block functionality
- ❌ Data doesn't display
- ❌ Forms don't submit
- ❌ Links are broken

### Important Issues
- ⚠️ Slow loading (> 10 seconds)
- ⚠️ Visualizations don't render
- ⚠️ Search returns wrong results
- ⚠️ Mobile layout is broken
- ⚠️ Accessibility issues (keyboard navigation, screen readers)

### Nice to Have
- 💡 UI/UX improvements
- 💡 Feature suggestions
- 💡 Content corrections
- 💡 Performance optimizations

---

## 🎯 Testing Scenarios

### Scenario 1: Researcher Looking for Privacy Tools
1. Go to search page
2. Search "wallet privacy"
3. Apply filter: Category = "Wallet"
4. Click on a project
5. Read project details
6. Follow link to project website

**Success Criteria**: Found relevant wallet projects with accurate data

---

### Scenario 2: Developer Exploring Tech Stacks
1. Go to visualizations page
2. Scroll to "Technology Stack" bar chart
3. Identify most popular tech
4. Go to search page
5. Filter by that tech stack
6. Verify results match

**Success Criteria**: Visualizations and search are consistent

---

### Scenario 3: Contributor Reporting Missing Data
1. Go to feedback page
2. Select "Missing Project"
3. Fill out form for a real privacy project not in database
4. Submit form
5. Verify GitHub opens
6. Complete submission on GitHub

**Success Criteria**: GitHub issue created with correct template and data

---

### Scenario 4: AI-Assisted Discovery
1. Go to chat page
2. Ask: "What are the best privacy mixers?"
3. Review AI response
4. Click on a suggested project
5. Navigate back to chat
6. Ask follow-up question

**Success Criteria**: AI provides relevant projects and maintains conversation

---

## 🔄 Deployment Status

### How to Know You're Testing Latest Version

1. **Check GitHub Actions**:
   - Go to: https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/actions
   - Look for green checkmark ✅ on latest workflow
   - Click to see deployment time

2. **Check Site Footer**:
   - Look for "© 2025 Web3Privacy Now Research"
   - Note: Footer may include build timestamp (to be added)

3. **Manual Refresh**:
   - Hard refresh your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - This clears cache and loads fresh version

---

## 📞 Contact & Questions

- **Maintainer**: @M0nkeyFl0wer
- **Repository**: https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research
- **Issues**: https://github.com/M0nkeyFl0wer/web3-privacy-ethereum-cypherpunk-research/issues

---

## 🎉 Thank You!

Your testing helps make this research platform better for everyone. Every bug report, suggestion, and piece of feedback is valuable!

**Happy Testing!** 🚀
