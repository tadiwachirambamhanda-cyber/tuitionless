# Lane brief: Lane C (Research data)

Written by the Chief Architect.

| Field | Value |
|---|---|
| Lane name | Lane C |
| Goal | At least 100 real, verified scholarships from at least 8 destination countries, plus yearly study costs for each country, ready to import. |
| Features | F1 (the research half) |
| Worktree and branch | `.claude/worktrees/lane-c`, branch `worktree-lane-c` |
| Starting point | main after the foundation pull request is merged |
| Allowed files and folders | `data/**`, `plans/lane-c-*.md` |
| Do not touch | everything else, including `lib/`, `app/`, `scripts/` (Lane A), `supabase/` and config. |
| Builds on | `lib/types.ts` (the `Scholarship` and `CountryCost` shapes) and `data/README.md` |
| Dev server port | 3003 (not needed) |
| Depends on / blocks | Needs Lane A's `scripts/validate-data.ts` to check the files. Until it is merged, check the shape by hand against `lib/types.ts`. Blocks nothing. |

## What to research

- First destination countries: UK, USA, Canada, Germany, Netherlands, France, Australia, Ireland, Japan. Plus global funders open to many nationalities (for example Mastercard Foundation, Commonwealth, Erasmus Mundus, Fulbright, Chevening, DAAD, Gates Cambridge, Rhodes, Aga Khan, Rotary). Mix levels (undergraduate, masters, PhD) and nationalities, with a strong share open to students from Africa, South Asia, the Middle East and Latin America.
- Use official provider or university pages only. Each record has `officialUrl` (the application page), `sourceUrl` (the page the facts came from) and `checkedOn` (the date you read it).
- Never guess. If the amount, deadline or an eligible nationality list is not published, use `null`, an empty list, or `deadlineNote`. A scholarship you cannot verify does not go in.
- `eligibleNationalities`: use ISO country codes, or `["ANY"]` only when the page says all nationalities. If a page lists eligible regions, expand them to country codes and say so in `eligibilityNotes`.
- `data/country-costs.json`: typical yearly tuition plus living cost per country and level, with a source link and date. Use official or government sources (for example the country's study-abroad body).
- Files go in `data/scholarships/<country-or-funder>.json`, ids unique and hyphenated.
- Do not copy long text from pages. Summaries are in your own words, one or two sentences.

## Done means

- [ ] At least 100 scholarships from at least 8 destination countries, all with source link and date checked.
- [ ] `data/country-costs.json` has an entry for every destination country in the data.
- [ ] `npx tsx scripts/validate-data.ts` passes (once Lane A has merged it).
- [ ] A short `data/RESEARCH-NOTES.md` lists what was skipped because it could not be verified, and anything the owner should double check.

## Checks to run before reporting

The project checks (typecheck, lint, build, test) all pass, then /codex-review with every finding triaged (the review should spot-check that five random records match their source pages), then /pr.

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

- You need to change a file on the "Do not touch" list, or the `Scholarship` shape cannot hold a fact you need.
- A source page contradicts another.
- The same error happens 3 times.
- You are about to add something that is not in "Done means".
