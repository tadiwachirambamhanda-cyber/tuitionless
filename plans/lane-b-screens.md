# Lane B: screens (landing, /find, /results, /scholarships/[id])

Built from `docs/lanes/lane-b.md` and `design/handoff/`. Matches come through one function in `lib/client/matches.ts`
(runs the stub matcher on sample data until Lane A's `POST /api/match` is merged).
Screenshots at 390 and 1440 wide: `plans/lane-b-screenshots/` (results shots use temporary extra sample scholarships).

## Codex review

### Round 1: VERDICT: FINDINGS(5)

| # | Severity | Finding | Decision |
|---|---|---|---|
| 1 | MAJOR | Results use the stub matcher (positional groups, placeholder reasons) | Dismissed: the stub is Lane A's; resolved when Lane A's PR #1 merges. Switching is one function in `lib/client/matches.ts`. |
| 2 | MAJOR | Amount filter let unpublished-amount awards through | Fixed: full-funding awards stay, others drop when a minimum is set |
| 3 | MAJOR | Profile values in the link were not validated | Fixed: nationality, country, field and currency are checked against the supported lists |
| 4 | MINOR | Detail error state stuck when the id changed | Fixed: failure is stored with its id |
| 5 | MINOR | Nationality search claimed to be a combobox | Fixed: now a labelled search that filters the radio list |
