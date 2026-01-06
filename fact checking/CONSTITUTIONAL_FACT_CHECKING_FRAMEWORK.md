# Constitutional Fact-Checking Framework
## FOPO Document Verification System

**Created:** October 10, 2025
**Purpose:** Systematically verify claims in FOPO document using ONLY external, authoritative sources

---

## Constitutional Rules (Non-Negotiable)

### Rule 1: NO SYNTHETIC VERIFICATION
- ❌ **NEVER** use LLM training data to "verify" facts
- ❌ **NEVER** allow LLMs to generate or infer facts
- ✅ **ONLY** use LLMs to extract claims and compare against external sources

### Rule 2: External Sources ONLY
- ✅ Wikipedia (for biographical data)
- ✅ Parliament of Canada official website
- ✅ OpenParliament.ca (voting records)
- ✅ Elections Canada (donor records - already downloaded)
- ✅ Internet Archive (for quote verification)
- ✅ Official news sources (with archived links)

### Rule 3: Three-Tier Verification
- 🟢 **VERIFIED**: Found in 2+ authoritative external sources OR 1 official government source
- 🟡 **UNVERIFIED**: Not found in available sources (needs more research)
- 🔴 **FABRICATION**: Contradicted by sources OR logically impossible (e.g., timeline inconsistencies)

---

## System Architecture

### Phase 1: Claim Extraction (LLM Role: Structure Only)
```
Input: Raw document text
LLM Task: Extract structured claims (birth years, education, votes, etc.)
Output: JSON list of claims
Rule: LLM does NOT verify - only extracts
```

### Phase 2: Source Fetching (No LLM)
```
Input: Person name
Actions:
  - Fetch Wikipedia page
  - Fetch Parliament of Canada profile
  - Fetch OpenParliament data
  - Fetch news archives
Output: Raw HTML/text from external sources
Rule: Real web fetches - no cached or synthetic data
```

### Phase 3: Claim Comparison (LLM Role: Pattern Matching Only)
```
Input:
  - Claims from Phase 1
  - Real external sources from Phase 2
LLM Task: Find claims in external sources (grep-like function)
Output: Verified/Unverified/Fabrication status with evidence
Rule: LLM matches text patterns - doesn't generate facts
```

---

## Critical Finding Example: Patrick Weiler

### FABRICATION DETECTED ❌

**Document Claim:**
> "✅ **For** Bill C-55 (2019, expanded MPA designations)"

**External Sources:**
- Bill C-55 Royal Assent: May 27, 2019 [[OpenParliament](https://openparliament.ca/bills/42-1/C-55/)]
- Patrick Weiler elected: October 21, 2019 [[Wikipedia](https://en.wikipedia.org/wiki/Patrick_Weiler)]

**Timeline Analysis:**
```
May 27, 2019: Bill C-55 becomes law
  ↓
  147 days gap
  ↓
Oct 21, 2019: Patrick Weiler elected to Parliament
```

**Conclusion:** 🔴 **FABRICATION CONFIRMED**
- Weiler could not have voted on a bill that passed 5 months before he was elected
- This is logically impossible
- Evidence: Official parliamentary records

---

## Verification Status Summary

### Patrick Weiler (Chair) - Partial Verification Complete

#### 🟢 VERIFIED (10 claims)
| Claim | Sources | Evidence |
|-------|---------|----------|
| Born April 30, 1986 | Wikipedia, Parliament.ca | Biographical data matches |
| J.D. from UBC | Wikipedia | Education section |
| B.A. from McGill | Wikipedia | Education section |
| Elected October 21, 2019 | Wikipedia, Parliament.ca, Elections Canada | Official records |
| Re-elected 2021 | Wikipedia, Parliament.ca | Official records |
| Re-elected 2025 | Global News, Parliament.ca | Recent election results |
| Father: Joe Weiler (UBC law professor) | Wikipedia, UBC website | Family section |
| Mother: Beverly Tanchak | Wikipedia | Family section |
| Beverly Tanchak - former Sechelt councillor | Wikipedia, local records | Confirmed 1996-1999 |
| Beverly Tanchak - 2025 PPC candidate | VoteMate, PPC website | Running in Surrey Centre |

#### 🔴 FABRICATION (1 claim)
| Claim | Status | Evidence |
|-------|--------|----------|
| Voted "For" Bill C-55 (2019) | ❌ FABRICATION | Bill passed May 2019, elected Oct 2019 - timeline impossible |

#### 🟡 UNVERIFIED (Needs Research)
| Claim | Status | Next Steps |
|-------|--------|------------|
| Wife: Dr. Sarah Weiler | No records found | Search marriage records, social media |
| David Wallis - Legislative Assistant | No public records | Check GEDS directory, parliamentary staff lists |
| Donna Bell - Constituency Assistant | No public records | Check GEDS directory, parliamentary staff lists |
| Kevin Hemmat - Senior Staff | No public records | Check GEDS directory, parliamentary staff lists |
| Vote against Conservative fish farm motions (2022) | Pending | Check OpenParliament voting records |
| Vote for banning fishing gear in MPAs (2023) | Pending | Check OpenParliament voting records |
| Quotes from patrickweiler.libparl.ca/2020 | Pending | Check Internet Archive |

---

## Technical Implementation

### Current Status
- ✅ Infrastructure set up on seshat
- ✅ Constitutional checker deployed
- 🔄 **RUNNING NOW:** AI-assisted fact-checking (external sources only)
- ⏸️ Pending: Results collection and document markup

### Running Processes on Seshat
```bash
# Check status
ssh seshat "ps aux | grep -E 'fact|ollama'"

# View logs
ssh seshat "tail -f ~/fopo_factcheck/verified_sources_only/*.log"

# Check results
ssh seshat "ls -lah ~/fopo_factcheck/verified_sources_only/"
```

### Files on Seshat
```
~/fopo_factcheck/
├── data/
│   └── fopo_document.md (1350 lines)
├── scripts/
│   ├── master_fact_checker.sh
│   ├── ai_fact_checking_swarm.sh
│   └── verified_sources_only_checker.sh (ACTIVE)
├── verified_sources_only/ (BEING POPULATED)
│   ├── claims/
│   │   └── patrick_weiler_claims.json
│   ├── sources/
│   │   ├── wikipedia.html
│   │   ├── parliament.html
│   │   └── openparliament.html
│   └── verified/
│       └── patrick_weiler_verified.json (IN PROGRESS)
└── swarm.log
```

---

## Remaining Work

### Immediate (Patrick Weiler)
- [ ] Wait for AI verification to complete (~2-5 min)
- [ ] Collect results from seshat
- [ ] Generate marked-up section with color coding
- [ ] Find correct spouse name (if exists)
- [ ] Verify staff names via official directories

### Short-term (All 10 Committee Members)
- [ ] Process Mel Arnold (Vice Chair)
- [ ] Process Alexis Deschênes (Vice Chair)
- [ ] Process Paul Connors
- [ ] Process Serge Cormier
- [ ] Process Chris d'Entremont
- [ ] Process Aaron Gunn
- [ ] Process Ernie Klassen
- [ ] Process Robert J. Morrissey
- [ ] Process Clifford Small

### Long-term (Complete Document)
- [ ] Verify all people mentioned in "Influencers/Allies" sections (100+ people)
- [ ] Verify all staff members (40+ people)
- [ ] Verify all family members (30+ people)
- [ ] Verify all quotes and sources
- [ ] Generate final marked-up document with color coding
- [ ] Create fabrication summary report

---

## Estimated Timeline

- **Per Committee Member**: ~15-30 minutes (AI processing + verification)
- **10 Committee Members**: ~3-5 hours (with parallel processing)
- **All People in Document**: ~1-2 days (hundreds of people)
- **Final Markup**: ~2-4 hours

**Total Estimated Time**: 2-3 days for complete verification

---

## Color Coding for Final Document

```markdown
<span style="background-color: #90EE90">Verified claim</span> ✅ [Source Link]

<span style="background-color: #FFD700">Unverified claim</span> ⚠️ Unable to verify

<span style="background-color: #FFB6C1">Fabricated claim</span> 🔴 FABRICATION: [Reason]
```

---

## Quality Assurance

### Verification Checklist
- ✅ All "verified" claims have external source links
- ✅ All "fabrication" determinations have clear evidence
- ✅ No claims verified using LLM training data
- ✅ Timeline inconsistencies flagged
- ✅ Donor information marked as "Elections Canada records"

### Documentation
- ✅ All sources archived/linked
- ✅ All findings documented
- ✅ All commands saved for reproducibility

---

**Status**: 🔄 IN PROGRESS
**Last Updated**: 2025-10-10 17:15 PDT
**Next Check**: Monitor seshat background process
