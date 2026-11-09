# Lane C: research data

Goal: 100+ verified scholarships from 8+ destination countries plus yearly costs (see docs/lanes/lane-c.md).
Result: 119 scholarships in `data/scholarships/*.json` (9 destination countries plus global funders), 9 entries in `data/country-costs.json`, caveats in `data/RESEARCH-NOTES.md`.

## Codex review

Round 1, VERDICT: FINDINGS(5). Codex also fetched five source pages (Glasgow, Sydney VC, Government of Ireland, Trudeau, Sciences Po Boutmy); name, amounts, levels and deadlines matched.

1. MAJOR, `XK` used as a nationality code (Kosovo): Dismissed. XK is the code every major system uses for Kosovo; the owner/Lane A should make sure the country list includes it. Flagged to the Chief Architect.
2. MAJOR, Pearson deadline 2026-11-06 already passed: Fixed. Deadline set to null with a note that the round closed.
3. MAJOR, Australia costs rest on a secondary source and a minimum-fee floor: Dismissed for now. No official average exists to replace it; the weakness is stated in `RESEARCH-NOTES.md`. Owner to double check.
4. MAJOR, UK costs from search snippets and visa funds: Dismissed for now. Same reason, listed in `RESEARCH-NOTES.md` as minimum planning figures.
5. MINOR, Trudeau page gives no nationality or deadline: Dismissed. Page says students outside Canada are not eligible, which is in the record's notes; nationality is otherwise unrestricted. Deadline is already null.

## Codex review: field re-map (branch claude/lane-c-fields)

Round 1, VERDICT: FINDINGS(5). Codex confirmed only `fields` and the two RMIT URLs changed in the data.
1. MINOR, notes file additions: Dismissed. The Chief Architect asked for awkward mappings to be noted there.
2. MAJOR, Fulbright-Nehru broad categories: Dismissed. Each category comes from that record's original source terms (higher education administration, public health, etc.), mapped one to one.
3. MINOR, Joint Japan/World Bank mapping: Dismissed. The brief says to keep `["ANY"]` records and map the rest; the awkward fit is listed in RESEARCH-NOTES.md.
4. MINOR, food science to Environment and agriculture: Dismissed. Closest shared option, noted.
5. MINOR, technology to Computer science: Dismissed. Closest shared option, noted.

## Round 2 (branch claude/lane-c-round2)
Gap-filling research: 51 new records, nationality re-check of 74 ANY records, AU/UK costs and Erasmus countries re-checked (no better official source, left as is). See the Round 2 section of data/RESEARCH-NOTES.md.

### Codex review, round 2 (VERDICT: FINDINGS(5))
Codex fetched five new records (Böll, Toronto Arts and Science, Yale, Princeton matched; UBC page unreachable).
- MAJOR, ASU 54 African countries: Dismissed. The page names the region (young African professionals); the brief allows expanding a named region to codes, and the record's notes say so.
- MAJOR, ASU yearless deadline: Fixed. Deadline set to null with the date in the note.
- MAJOR, Engineering yearless January 15: Fixed, same way.
- MINOR, other yearless deadlines (Manitoba, UAlberta x2, Villigst): Fixed, same way. Pasteur's page states the year, so it stays.
- MINOR, Böll ANY: Dismissed. The page gives DAC countries only as priority and sets no exclusion.
