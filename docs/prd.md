# PRD: Scholarship Matcher (working title)

For: Tadiwa (own product). Written: 2026-11-07 (updated after the owner's answers). Source: my own idea.

## The client

Tadiwa, solo founder building a free-to-use web product for students who are in university or about to start, from anywhere in the world.

## The problem

Students struggle to find scholarships they can actually use. Lists are scattered across hundreds of sites, and most do not say whether a scholarship fits the student's nationality, what they can afford a year, or the country and city where their university is.

## Who uses it

- **Prospective student**: about to apply to university, wants to know which scholarships they qualify for.
- **Current student**: already at a university, needs funding to stay or finish.

Students can be from any country.

## What it must do (app projects only)

1. A student answers a short step-by-step profile, one question at a time: nationality, country and city of the university, level of study (undergraduate, masters, PhD), field of study, and what they can afford per year (amount and currency).
2. The app shows matching scholarships grouped as Best fit, Worth a try and Stretch, each with a short reason it matched.
3. A student can filter and sort the matches (amount, deadline, country).
4. A student can open a scholarship to see the amount, what it covers, who is eligible, the deadline and a link to the official application page.
5. Works well on a phone first, and on desktop.

## How the client will judge it

- "I enter my nationality, budget and where I want to study and see a list in under 10 seconds."
- "Every scholarship in Best fit is one I could actually apply to, and it tells me why."
- "I can click through to the real application page."

## Constraints

Web only, phone first. Next.js on Vercel, Supabase for data. Free tier or cheap services only. Worldwide audience: many currencies and many nationalities.

## Not in this version

The owner listed nothing as out of scope except saved shortlists, which come right after v1. v1 also leaves out: accounts and logins, application tracking, deadline reminder emails, an admin screen, payments, essay help, any AI chat.

## Data

Scholarships: name, provider, amount, currency, what it covers, level of study, field, university country and city (or "any"), nationalities eligible (list, or "any"), eligibility notes, deadline, official link, and an estimated yearly cost of study for the destination so "budget" can be compared with the gap. The owner asked Claude to run the research: collect real scholarships from official provider pages, record the source link and the date checked, and import them as a seed file into Supabase. The student's profile in v1 is not stored; it lives in the page link only.

## Decisions made

- Budget means what the student can afford per year.
- Matching includes the student's nationality (moved into v1).
- Claude researches the scholarship data.
- Saved shortlists and accounts come straight after v1.

## Open questions

1. Which destination countries should the first research round cover? Suggested start: UK, USA, Canada, Germany, Netherlands, France, Australia, Ireland, Japan, plus global funders open to many nationalities.
2. How to read "budget" against a scholarship: suggested rule is Best fit when the scholarship plus the student's budget covers the estimated yearly cost of study, Worth a try when it covers most of it or competition is high, Stretch when it covers little or only part of the eligibility. OK?
3. Final app name (suggestions given in chat).
