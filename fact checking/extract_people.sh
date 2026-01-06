#!/bin/bash
# Extract all people mentioned in the FOPO document

DOC="/home/flower/fact checking/# Standing Committee on Fisheries and Oc.md"
OUTPUT="/home/flower/fact checking/people_list.txt"

echo "Extracting all people from FOPO document..." > "$OUTPUT"
echo "=============================================" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Extract committee member names (numbered sections)
echo "COMMITTEE MEMBERS:" >> "$OUTPUT"
grep -E "^## (Chair|[0-9]+\.)" "$DOC" | sed 's/^## //' >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Extract staff mentions
echo "STAFF MENTIONED:" >> "$OUTPUT"
grep -iE "(Legislative Assistant|Constituency Assistant|Senior Staff|Chief of Staff)" "$DOC" | grep -v "^#" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Extract family mentions
echo "FAMILY MEMBERS MENTIONED:" >> "$OUTPUT"
grep -iE "(Wife|Husband|Mother|Father|Son|Daughter|Partner|Spouse)" "$DOC" | grep -v "^#" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Extract donors
echo "DONORS MENTIONED:" >> "$OUTPUT"
grep -A 1 "## Notable Donors" "$DOC" | grep "^\- \*\*" | sed 's/- \*\*//' | sed 's/\*\*.*//' >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Extract influencers/allies
echo "INFLUENCERS/ALLIES MENTIONED:" >> "$OUTPUT"
grep -A 1 "## Key Influencers" "$DOC" | grep "^\- " | sed 's/- \*\*//' | sed 's/\*\*:.*//' >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Extract lobbyists
echo "LOBBYISTS MENTIONED:" >> "$OUTPUT"
grep -A 1 "## Relevant Lobbying" "$DOC" | grep "^\- " >> "$OUTPUT"

cat "$OUTPUT"
