# FOPO Fact-Checking Commands Reference

## SSH Connection
```bash
ssh seshat
# Connected to your-server.example.com as your-username on port 8888
```

## Initial Setup
```bash
# Create working directory on seshat
ssh seshat "mkdir -p /mnt/sandisk/fopo_factcheck"

# Copy document to seshat
scp "/home/flower/fact checking/# Standing Committee on Fisheries and Oc.md" seshat:/mnt/sandisk/fopo_factcheck/

# Monitor system resources
ssh seshat "htop"  # or "top"
```

## Fact-Checking Scripts
Scripts are being deployed to seshat:/mnt/sony/fopo_verification_scripts/

## Progress Tracking
Check verification progress:
```bash
ssh seshat "cat ~/fopo_factcheck/fact_check.log"
```

View extracted committee members:
```bash
ssh seshat "cat ~/fopo_factcheck/results/member_tasks.txt"
```

## Results Collection
Download verification results:
```bash
scp -r seshat:~/fopo_factcheck/results/* "/home/flower/fact checking/results/"
```

## Committee Members Found
At least 10 committee members identified:
1. Patrick Weiler (Chair) - Liberal
2. Mel Arnold (Vice Chair) - Conservative
3. Alexis Deschênes (Vice Chair) - Bloc Québécois
4. Paul Connors - Liberal
5. Serge Cormier - Liberal
6. Chris d'Entremont - Conservative
7. Aaron Gunn - Conservative
8. Ernie Klassen - Liberal
9. Robert J. Morrissey - Liberal
10. Clifford Small - Conservative

## Fact-Checking Methodology
1. **Biographical data**: Wikipedia, Parliament of Canada website
2. **Voting records**: openparliament.ca, House of Commons records
3. **Quotes**: Internet Archive, original sources
4. **Family/Staff**: Public records, news articles
5. **Donors**: Elections Canada records (already downloaded per user)

## View Verification Reports

### Complete all-members report (RECOMMENDED)
```bash
cat "/home/flower/fact checking/COMPLETE_ALL_MEMBERS_VERIFICATION.md"
```

### Individual member reports
```bash
cat "/home/flower/fact checking/verification_results_patrick_weiler.md"
cat "/home/flower/fact checking/MEMBERS_2-10_VERIFICATION_RESULTS.md"
cat "/home/flower/fact checking/UPDATED_FACT_CHECK_STATUS.md"
```

## Key Findings

### Fabrications Found: 4
1. **Patrick Weiler** - Bill C-55 vote (2019) - voted 147 days before being elected ❌
2. **Patrick Weiler** - "Dr. Sarah Weiler" (complete fabrication - CORRECTED: Partner Nicole) ❌
3. **Clifford Small** - MPA votes (2019) - voted 2 years before being elected ❌
4. **Serge Cormier** - "Wife" vs "Partner" terminology (minor issue) ⚠️

### Facts Verified: 120 ✅
### Uncertain Claims: 46+ ⚠️

---
Last updated: 2025-10-10 22:00 PDT
