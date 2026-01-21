# Research Gaps - Queue to Resolve

Generated: $(date)

## 1. Projects Missing from Graph (9 projects)
These exist in deliverables/ but are not in public/data/research-graph.json:

- [ ] confer
- [ ] incognito  
- [ ] meshtastic
- [ ] miden
- [ ] nym
- [ ] protonmail
- [ ] secret-network
- [ ] signal
- [ ] telegram

**Action**: Regenerate research-graph.json to include all projects

---

## 2. Short/Empty Reports (need expansion)

### TEAM.md files saying "not publicly available":
- [ ] circom
- [ ] concordium
- [ ] darkfi
- [ ] deeper-network
- [ ] elusiv
- [ ] fileverse
- [ ] findora
- [ ] firo
- [ ] fluidkey
- [ ] hopr
- [ ] iden3
- [ ] incognito
- [ ] iron-fish
- [ ] mask-network
- [ ] mobilecoin
- [ ] monero
- [ ] mysterium-network
- [ ] oasis-network
- [ ] orchid
- [ ] oxen
- [ ] privatepool
- [ ] rotki
- [ ] semaphore
- [ ] sentinel
- [ ] sienna-network
- [ ] snarkjs
- [ ] starkex
- [ ] suterusu
- [ ] tornado-cash
- [ ] typhoon-network
- [ ] wasabi-wallet
- [ ] webb-protocol
- [ ] xx-network
- [ ] zano
- [ ] zcash
- [ ] zeal
- [ ] zk-money
- [ ] zksync
- [ ] zkvote

### SECURITY.md files with no audit data:
- [ ] circom
- [ ] concordium
- [ ] darkfi
- [ ] deeper-network
- [ ] elusiv
- [ ] fileverse
- [ ] findora
- [ ] firo
- [ ] fluidkey
- [ ] hopr
- [ ] iden3
- [ ] incognito
- [ ] iron-fish
- [ ] mask-network
- [ ] mobilecoin
- [ ] monero
- [ ] mysterium-network
- [ ] oasis-network
- [ ] orchid
- [ ] oxen
- [ ] privatepool
- [ ] rotki
- [ ] semaphore
- [ ] sentinel
- [ ] sienna-network
- [ ] snarkjs
- [ ] starkex
- [ ] suterusu
- [ ] tornado-cash
- [ ] typhoon-network
- [ ] wasabi-wallet
- [ ] webb-protocol
- [ ] xx-network
- [ ] zano
- [ ] zcash
- [ ] zeal
- [ ] zk-money
- [ ] zksync
- [ ] zkvote

---

## 3. Blockchain Metrics (research attempted, no data found)
- [ ] circom
- [ ] fileverse
- [ ] fluidkey
- [ ] hopr
- [ ] incognito
- [ ] iron-fish
- [ ] mask-network
- [ ] privatepool
- [ ] rotki
- [ ] semaphore
- [ ] snarkjs
- [ ] tornado-cash
- [ ] webb-protocol
- [ ] zk-money
- [ ] zksync
- [ ] zkvote

---

## 4. OSINT Tier Inconsistency
The site marks these 8 as OSINT tier:
- mysterium-network, mask-network, zano, hopr, semaphore, sienna-network, suterusu, tornado-cash

But deliverables has 18 opsec_vulnerability_assessment.md files. 
**Action**: Review which should be marked OSINT tier.

---

## Priority Actions

1. **HIGH**: Regenerate research-graph.json with all 48 projects
2. **HIGH**: Fix ProjectMiniGraph to show connections
3. **MEDIUM**: Fill in team data where publicly available
4. **MEDIUM**: Find security audits for projects that have them
5. **LOW**: Add blockchain metrics for on-chain projects

