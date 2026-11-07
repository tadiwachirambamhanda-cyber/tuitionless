# Design brief: Scholarship Matcher

For: Claude Design. From: Tadiwa. Date: 2026-11-07. Needed back by: not set.

## What this is and who uses it

A web app that matches students (in university or about to start) from any country with scholarships by nationality, what they can afford per year, and where the university is. It is for one person: a student, often on a phone, who wants to know "what can I actually apply for, and why me".

## Read these first

Screen map: `docs/ux/screen-map.md`

Direction chosen by the owner (Option B): warm and mobile-first, a coral-to-orange gradient, rounded cards, friendly encouraging copy, a step-by-step one-question-at-a-time profile, results grouped as Best fit / Worth a try / Stretch, a View Details button on each card.

Inspiration (links, no files yet in `design/reference/`):

- Dribbble "College Finder Results Page" (https://dribbble.com/shots/27063402-College-Finder-Results-Page): take the grouped results tabs, the friendly "60+ results matched your profile" headline and the card layout with a clear View Details button. Do not copy its artwork, logo, name or exact colours.
- Dribbble "Find Scholarship Landing page" (https://dribbble.com/shots/20604936-Find-Scholarship-Landing-page-Online-Scholarship-Your29): take the idea of big money figures as proof. Not its navy palette, illustrations or text.

## Screens to design

- `/` landing
- `/find` step-by-step profile
- `/results` grouped matches
- `/scholarships/[id]` scholarship detail

## Rules that cannot bend

1. One primary action per screen.
2. Every screen shows its empty, loading and error states.
3. At 390 wide there is no sideways scrolling, and tap targets are at least 44px.
4. On `/find` only one question is visible at a time, with a visible step count (for example "2 of 5").
5. Every result card shows the amount, the deadline and the reason it matched without opening it.

## Words to use (and never use)

Use: "scholarship", "matches", "Best fit", "Worth a try", "Stretch", "what you can afford a year", "View Details", "Apply on official site".

Never use: "grant algorithm", "eligibility engine", "user", "lorem ipsum", "AI-powered".

## Sample content for the mock-ups

Fictional student: Amara, Nigerian, wants a masters in Computer Science in Germany, can afford 4,000 USD a year. Sample scholarships (names fictional): "Rhine Future Scholars Award" (up to 11,000 EUR a year, deadline 15 Jan), "Northern Lights Master's Grant" (full tuition, Sweden, deadline 1 Dec), "Open Doors Global Bursary" (5,000 USD a year, any nationality, deadline 30 Mar). Amounts shown in the student's own currency with the original amount beside it. Group counts such as "[N] Best fit".

## You decide

Layout, exact colours, typography, components. If you change anything above, tell us why.

## Send back

Into `design/handoff/`: one `.dc.html` prototype per screen, a screenshot of each, and a `README.md` written to the coding agent that implements it. The README gives the tokens with exact values (colours, type sizes, spacing), each screen's parts and states, and a short note on your choices.
