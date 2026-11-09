# Lane A: matching, data loading, match API

Built per docs/lanes/lane-a.md. Notes:
- `matchScholarships` takes an optional 4th argument `{ rates, today }`; fallback exchange rates live in `lib/matching/rates.ts` (rough, for grouping only).
- "total" awards are turned into yearly amounts using typical course length (undergraduate 4, masters 2, phd 3).
- Unknown yearly cost or currency, or unpublished amount, puts a scholarship in Stretch.
- Files use relative imports because vitest has no `@/` alias.

## Codex review

Round 1, VERDICT: FINDINGS(2)
1. MAJOR, city never checked: Fixed (city-listed scholarships need a matching city; no city given keeps them).
2. MINOR, field substring overlap ("art" vs "cartography"): Fixed (whole-word matching).
