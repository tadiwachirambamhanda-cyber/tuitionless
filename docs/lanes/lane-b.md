# Lane brief: Lane B (Screens)

Written by the Chief Architect.

| Field | Value |
|---|---|
| Lane name | Lane B |
| Goal | A student can walk landing, step-by-step profile, grouped results and scholarship detail on a phone and on a desktop. |
| Features | F2, F5, F6, F7 (and the landing page) |
| Worktree and branch | `.claude/worktrees/lane-b`, branch `worktree-lane-b` |
| Starting point | main after the foundation pull request is merged |
| Allowed files and folders | `app/page.tsx`, `app/find/**`, `app/results/**`, `app/scholarships/**`, `components/**`, `lib/client/**`, `plans/lane-b-*.md` |
| Do not touch | `lib/types.ts`, `lib/currency.ts`, `lib/sample-data.ts`, `lib/supabase/`, `supabase/migrations/`, `lib/matching/`, `app/api/` (Lane A), `data/` (Lane C), `app/layout.tsx`, `app/globals.css`, `package.json` and config. Need a layout, global style or dependency change? Ask the Chief Architect. |
| Builds on | `docs/ux/screen-map.md` (the contract for each screen), `design/brief.md`, `design/handoff/` (Claude Design's prototypes, tokens and README), `lib/types.ts`, `lib/currency.ts`, `lib/sample-data.ts` |
| Dev server port | 3002 |
| Depends on / blocks | Needs `design/handoff/` to hold Claude Design's handoff. If the folder only has `.gitkeep`, stop and report BLOCKED. Matches come from Lane A's `POST /api/match`; until it is merged, build against `matchScholarships` and `lib/sample-data.ts`, behind one small function in `lib/client/` so switching is one change. |

## What to build

- Follow `design/handoff/README.md` for tokens and parts. Put the tokens in `lib/client/` or component styles, and send any `app/globals.css` change to the Chief Architect.
- `/find`: one question at a time with a visible step count, Back, and an error for a missing answer. Questions: nationality, university country and city, level, field, yearly budget with currency. The profile travels to `/results` in the page link, and is not stored.
- `/results`: Best fit, Worth a try and Stretch groups, cards that show amount, deadline and the reason, filter and sort (amount, deadline, country), and the empty state "No matches yet. Try a higher budget or another country".
- `/scholarships/[id]`: amount, coverage, eligibility, deadline, reason it matched, and the Apply on official site button.
- Every screen has its empty, loading and error states from the screen map. One primary action per screen. No sideways scroll at 390 wide, tap targets at least 44px.
- Read `node_modules/next/dist/docs/` before writing Next code: this version needs `<Suspense>` around `params` and `searchParams`.

## Done means

- [ ] `npm run check` is green.
- [ ] On a 390 wide screen I go from the landing page through all profile questions to results without sideways scrolling.
- [ ] Going Back on `/find` keeps my earlier answers; leaving a question empty shows a clear message.
- [ ] Results show three groups; sorting by deadline puts the soonest first; filtering to one country leaves only that country.
- [ ] Tapping View Details opens the detail page; Apply opens the official link in a new tab.
- [ ] A very narrow profile shows the empty message, not a blank page.
- [ ] Screenshots at 390 and 1440 wide of each screen match `design/handoff/` (attach them to the pull request).

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
- The brief and the handoff disagree.
- The same error happens 3 times.
- You are about to build something not in "Done means".
