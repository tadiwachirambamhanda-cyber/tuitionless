# Plan: keep the database awake

Owner: Chief Architect. Date: 2026-11-10. Branch: `feat/keep-awake`.

## Why
Supabase pauses a free project after about a week with too little database activity. Paused, the live site loses all its results. The owner chose to stay on the free plan and asked for this to be handled.

## Steps
1. `app/api/health/route.ts`: a `GET` that reads one row id from `scholarships` with the public client and returns `{ ok: true }`, or `{ ok: false }` with status 503 on error. No scholarship data in the response.
2. `vercel.ts` (or `vercel.json` if the config package is not worth adding): one cron at a fixed daily time calling `/api/health`. Hobby allows once a day.
3. Guard: the route accepts the call from anyone, because it reads nothing private and does nothing but one small read.

## Checks
- `npm run check` passes.
- `curl https://<preview>/api/health` returns `{"ok":true}` with status 200.
- After merge, the Vercel project's Cron Jobs page lists the job.
- After a day, the job's log shows a 200.

## Limits
- Once a day is the most the Hobby plan allows. Supabase says a few requests a day usually keeps a project running, but does not guarantee it. The owner still gets Supabase's warning email about a week before any pause.
- The update engine, once built, will read the database daily too and can take this job over.

## Codex review

Round 1, VERDICT: PASS. No findings.
