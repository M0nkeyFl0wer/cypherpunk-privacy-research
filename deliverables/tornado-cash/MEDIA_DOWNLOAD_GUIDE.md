# Tornado Cash Media Download Guide

**Last Updated**: 2025-10-07
**Constitutional Compliance**: Real data only, no fabrication

---

## Logo Downloads

### Official Logo Sources (Third-Party Repositories)

**CryptoLogos.cc**
- URL: https://cryptologos.cc/torn
- Formats: PNG, SVG
- Quality: High resolution
- License: Check site for usage terms

**Logotyp.us**
- URL: https://logotyp.us/logo/tornado-cash/
- Formats: SVG vector logo
- Includes: Brand colors
- Quality: Vector (scalable)

**CDNLogo.com**
- URL: https://cdnlogo.com/logo/tornado-cash_27691.html
- Formats: PNG, SVG, EPS, AI
- Size: 628 bytes (vector)
- Quality: Professional grade

### Download Commands

```bash
# Create media directory
mkdir -p /home/flower/web3privacy-research/deliverables/tornado-cash/media

# Download logo (manual - requires browser)
# Visit: https://cryptologos.cc/torn
# Click download button for PNG and SVG
# Save to: /home/flower/web3privacy-research/deliverables/tornado-cash/media/logo.png
# Save to: /home/flower/web3privacy-research/deliverables/tornado-cash/media/logo.svg
```

---

## Founder Photos

### Roman Storm

**Sources**:
1. **CoinDesk Trial Coverage**
   - URL: https://www.coindesk.com/policy/2025/07/14/right-to-code-tornado-cash-dev-roman-storm-s-money-laundering-trial-kicks-off-monday
   - Usually includes courtroom photos or headshots
   - Check article images

2. **Court Photography**
   - URL: https://www.coindesk.com/policy/2025/08/06/roman-storm-guilty-of-unlicensed-money-transmitting-conspiracy-in-partial-verdict
   - Trial coverage often includes defendant photos

3. **GitHub Profile**
   - Username: rstormsf (based on Twitter handle pattern)
   - May have profile photo

4. **Twitter/X**
   - Handle: @rstormsf
   - URL: https://x.com/rstormsf/status/1882100012513186283
   - Profile photo available

**Recommended Filename**: `/home/flower/web3privacy-research/deliverables/tornado-cash/media/roman-storm.jpg`

---

### Alexey Pertsev

**Sources**:
1. **DLNews Coverage**
   - URL: https://www.dlnews.com/articles/regulation/tornado-cash-dev-alexey-pertsev-guilty-of-money-laundering/
   - Dutch trial coverage with photos

2. **CoinDesk Articles**
   - URL: https://www.coindesk.com/policy/2024/05/14/tornado-cash-developer-alexey-pertsev-found-guilty-of-money-laundering
   - Conviction coverage with courtroom photos

3. **The Hacker News**
   - URL: https://thehackernews.com/2024/05/dutch-court-sentences-tornado-cash-co.html
   - Often includes news photos

4. **News Agency Photos**
   - Reuters, AP may have courtroom photos from Dutch trial
   - Search: "Alexey Pertsev court photo"

**Recommended Filename**: `/home/flower/web3privacy-research/deliverables/tornado-cash/media/alexey-pertsev.jpg`

---

### Roman Semenov

**Status**: At large, limited public photos available

**Sources**:
1. **GitHub Profile**
   - Search for username patterns similar to other founders
   - May have profile photo

2. **LinkedIn**
   - Search: "Roman Semenov Tornado Cash"
   - Professional profile may exist

3. **Chainalysis Blog**
   - URL: https://www.chainalysis.com/blog/ofac-sanctions-roman-semenov-tornado-cash/
   - May include photos

4. **Treasury Press Release**
   - URL: https://home.treasury.gov/news/press-releases/jy1702
   - Sometimes includes photos of sanctioned individuals

**Note**: Fewer photos available as he remains at large and has not appeared in court.

**Recommended Filename**: `/home/flower/web3privacy-research/deliverables/tornado-cash/media/roman-semenov.jpg`

---

## Manual Download Process

Since automated download of images from news sites requires browser access:

### Step 1: Visit Source URLs
Open each URL in a web browser

### Step 2: Locate Images
- Look for article header images
- Check photo galleries
- Right-click images to view full resolution

### Step 3: Download High-Resolution
- Right-click image → "Save Image As..."
- Choose highest resolution available
- Save to appropriate filename in media directory

### Step 4: Verify Quality
```bash
# Check image properties
file /home/flower/web3privacy-research/deliverables/tornado-cash/media/*.jpg
identify /home/flower/web3privacy-research/deliverables/tornado-cash/media/*.jpg

# Recommended minimum resolution: 800x600 pixels
```

---

## Legal Considerations

### Logo Usage
- Tornado Cash logo is copyrighted material
- Third-party repositories provide logos for informational purposes
- Verify usage rights for your specific use case
- Attribution may be required

### Founder Photos
- Court photography may be public domain (varies by jurisdiction)
- News photos may be copyrighted by photographers/agencies
- Fair use may apply for educational/research purposes
- Attribution recommended for all photos

### Recommended Attribution
```
Tornado Cash logo: via CryptoLogos.cc
Founder photos: [Source Publication Name], [Date]
Research data: Multiple sources (see tornado-cash-research.json)
```

---

## Verification Checklist

- [ ] Logo downloaded in PNG format
- [ ] Logo downloaded in SVG format (vector)
- [ ] Roman Storm photo obtained
- [ ] Alexey Pertsev photo obtained
- [ ] Roman Semenov photo obtained (if available)
- [ ] All images minimum 800x600 resolution
- [ ] Source attribution documented
- [ ] Files saved in correct directory
- [ ] Constitutional compliance verified (real photos only)

---

## Data Gaps Logged

As per constitutional requirements, the following gaps exist:

1. **High-resolution founder photos**: Not available via automated web search
   - Status: Requires manual browser download
   - Priority: High
   - Action: Visit news article URLs and download manually

2. **Roman Semenov photos**: Limited availability
   - Status: Subject remains at large, fewer public appearances
   - Priority: Medium
   - Action: Check LinkedIn, GitHub, older news articles

---

## Constitutional Notes

✅ **COMPLIANT**: All sources cited, no fabricated images
✅ **COMPLIANT**: Gaps clearly identified and logged
✅ **COMPLIANT**: Manual download instructions provided
❌ **GAP**: Automated download not possible via API

**Recommendation**: Complete manual downloads following this guide to fill media gaps.
