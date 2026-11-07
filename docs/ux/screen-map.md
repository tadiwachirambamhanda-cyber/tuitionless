# Screen map: Scholarship Matcher

Each screen is judged against its row, on a screenshot of the running app at 390 and 1440 wide.

| Route | Type | User | Job (one line) | Main content (must stand out) | Primary action (exactly one) | Other actions | States |
|---|---|---|---|---|---|---|---|
| `/` | landing | Any student | Understand what the app does and start | The headline and the Start button, over the coral-to-orange gradient | Start matching | Read how it works | loading, error (page failed to load) |
| `/find` | form (step by step) | Any student | Tell the app who I am, one question at a time | The single current question with its answer control | Next (on the last step: See my matches) | Back, change an earlier answer | empty (first step), loading (finding matches), error (answer missing or search failed) |
| `/results` | list | Any student | See which scholarships fit me and why | The three groups (Best fit, Worth a try, Stretch) with the first scholarship cards | View Details | Filter, sort, edit my answers | empty ("No matches yet. Try a higher budget or another country"), loading, error |
| `/scholarships/[id]` | detail | Any student | Decide whether to apply and get to the official page | Amount and deadline, then the reason it matched | Apply on official site | Back to results | loading, error (scholarship not found) |

## Users and access

- **Student** (prospective or current, from any country): no sign-in in v1. Reaches every screen.
