# Tuitionless: scholarship matcher

A free web app that matches students from **any country** with scholarships by nationality, yearly budget and where the university is. Phone first.

**Live:** https://tuitionless.vercel.app

## What a student does
1. Answers a short step-by-step profile: nationality, university country and city, level of study, field, and what they can afford per year (any currency).
2. Sees scholarships grouped as **Best fit**, **Worth a try** and **Stretch**, each with the reason it matched.
3. Filters and sorts by amount, deadline or country, then opens a scholarship for what it covers, who is eligible, the deadline and a link to the official application page.

## Data
A researched dataset of **169 scholarships** across 9 destination countries plus global awards, and a country cost-of-living table. Sources and notes are in `data/`. Scholarship data is validated with Zod schemas before it is loaded.

## How it was built
A chief-architect foundation first, then **three parallel lanes** with separate file ownership (matching engine, screens, research), merged through gated pull requests. See `docs/` for the PRD, feature list, lane briefs and reviews.

## Run it
```bash
npm install
npm run dev
npm run check    # typecheck, lint, tests and build
```
Copy `.env.example` to `.env.local` for the Supabase values. Public reads only; writes need a server key that is never exposed to the browser.

## Stack
Next.js 16 (App Router), React 19, TypeScript, Supabase, Zod, Vitest, Vercel (daily health check keeps the free database awake).
