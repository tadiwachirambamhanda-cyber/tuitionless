# Lane brief: Lane A (Data and matching)

Written by the Chief Architect.

| Field | Value |
|---|---|
| Lane name | Lane A |
| Goal | A student profile goes in and grouped matches with reasons come out, from real data in the database. |
| Features | F3, F4, and the database half of F1 (validate and import the seed) |
| Worktree and branch | `.claude/worktrees/lane-a`, branch `worktree-lane-a` |
| Starting point | main after the foundation pull request is merged |
| Allowed files and folders | `lib/matching/**`, `lib/data/**`, `scripts/**`, `app/api/**`, `plans/lane-a-*.md` |
| Do not touch | `lib/types.ts`, `lib/currency.ts`, `lib/sample-data.ts`, `lib/supabase/`, `supabase/migrations/`, `app/layout.tsx`, `package.json` and config, `data/` (Lane C), screens and `components/` (Lane B). Need a new dependency or a schema change? Ask the Chief Architect. |
| Builds on | `lib/types.ts` (Scholarship, StudentProfile, CountryCost, MatchResult), `lib/currency.ts`, `lib/supabase/server.ts`, the stub in `lib/matching/index.ts` |
| Dev server port | 3001 |
| Depends on / blocks | Needs Lane C's files in `data/` for the real seed (use `lib/sample-data.ts` until then). Blocks nothing: Lane B builds against the stub. |

## What to build

1. `lib/matching/index.ts`: replace the stub body of `matchScholarships(profile, scholarships, costs)`, keep the signature.
   - Hard filters (a scholarship that fails any is not shown): nationality is in `eligibleNationalities` or it is `ANY`, and not in `excludedNationalities`; study country is in `studyCountries` or `ANY`; level is in `levels`; field matches `fields` or `ANY`; the deadline has not passed (null deadline passes).
   - Groups, using the student's yearly budget converted to the scholarship currency and the destination's yearly cost from `costs`:
     - Best fit: full funding, or scholarship amount per year plus the student's budget covers the yearly cost.
     - Worth a try: covers at least half of the gap.
     - Stretch: passes the hard filters but covers less than half, or the amount is not published.
   - `reason`: one short friendly line, for example "Open to Nigerian students. Covers masters in Germany, up to 11,000 EUR a year."
   - Unit tests in `lib/matching/*.test.ts` for every filter and every group.
2. `lib/data/load.ts`: read scholarships and costs from Supabase (public client) and map database column names (snake_case) to the `Scholarship` and `CountryCost` types.
3. `app/api/match/route.ts`: `POST` with a `StudentProfile` JSON body, validate it with zod, return a `MatchResult`. Bad input returns 400 with a clear message. This is the only way Lane B's screens get matches.
4. `scripts/validate-data.ts` (`npm run`-able through `npx tsx`): validate every file in `data/` against a zod schema that mirrors `lib/types.ts`, check ids are unique, print a count. Lane C runs it.
5. `scripts/seed.ts`: validate, then upsert `data/` into Supabase with the service role key. Never print keys.

## Done means

- [ ] `npm run check` is green and the matching tests cover each filter and group.
- [ ] With sample data, a Nigerian masters student for Germany sees only scholarships open to Nigerians or any nationality, for Germany or any country, for masters.
- [ ] `curl -X POST localhost:3001/api/match` with a valid profile returns grouped matches; an invalid one returns 400.
- [ ] `npx tsx scripts/validate-data.ts` reports the record count and fails with a clear message on a bad record.

## Checks to run before reporting

The project checks (typecheck, lint, build, test) all pass, then /codex-review with every finding triaged, then /pr.

## How to report

Send a message to "Chief Architect" in this format:

```text
STATUS: DONE | BLOCKED | QUESTION
PR: #<number>
Checks: green | red (what failed)
Files changed outside my allowed list: none
Look at: <one line on what to check first>
```

## When to stop and ask instead of guessing

- You need to change a file on the "Do not touch" list.
- The brief and the data or types disagree.
- The same error happens 3 times.
- You are about to build something not in "Done means".
