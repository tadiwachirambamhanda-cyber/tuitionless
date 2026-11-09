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

## Follow-up: exact fields, validation, rates, detail API

Diagnosis (119 records, 9 countries with costs, today 2026-11-09), records left after each hard filter in order (nationality, country, level, deadline, field, city):
- NG, masters, DE (Munich): 98, 8, 5, 5, 3, 3. Result 3, all Stretch.
- IN, undergraduate, CA: 100, 13, 6, 6, 6, 6. Result 6 (1 Best fit, 2 Worth a try, 3 Stretch).
- KE, PhD, GB: 98, 15, 2, 2, 2, 2. Result 2 (1 Best fit, 1 Stretch).
Country and level are what thin the list. 54 records have no published amount and are not full funding, so they can only be Stretch.

## Codex review (follow-up)

Round 1, VERDICT: FINDINGS(1)
1. MINOR, id not validated on GET /api/scholarships/[id]: Fixed (bad ids return 404 without a database call).

## Decision: unpublished amounts are Worth a try

Owner decision (relayed by the Chief Architect): a record with `amount: null` that is not full funding is "worth_a_try" instead of "stretch". "No cost data for the country" and "unknown currency" stay Stretch. The reason line says "Amount not published, check the official page."

## Codex review (unpublished amounts)

Round 1, VERDICT: FINDINGS(1)
1. MINOR, same unknown currency on cost, budget and scholarship skipped the rate check: Fixed (every currency is checked against the rates first).
