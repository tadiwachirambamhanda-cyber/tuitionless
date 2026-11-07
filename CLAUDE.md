Project type: app

# Scholarship Matcher (working title)

Web app that matches students (from any country, in or heading to university) with scholarships by nationality, yearly budget and where the university is.
Stack: Next.js 16 (App Router), Vercel, Supabase. Free or cheap integrations only.
Follow the global rules in ~/.claude/CLAUDE.md. Next.js 16 differs from older versions: read the guide in `node_modules/next/dist/docs/` before writing Next code (see AGENTS.md).

Checks: `npm run check` (typecheck, lint, test, build). All must pass before a pull request.
Secrets: names live in `.env.example`; values in `.env.local` (never read or print). Never put NEXT_PUBLIC_ on a secret key.

## Folder owners

| Folder or file | Owner |
|---|---|
| `lib/types.ts`, `lib/currency.ts`, `lib/sample-data.ts`, `lib/supabase/`, `supabase/migrations/` | Chief Architect |
| `app/layout.tsx`, `app/globals.css`, `package.json`, config files, `.env.example`, `docs/`, `design/` | Chief Architect |
| `lib/matching/`, `lib/data/`, `scripts/`, `app/api/` | Lane A (matching and data loading) |
| `app/page.tsx`, `app/find/`, `app/results/`, `app/scholarships/`, `components/`, `lib/client/` | Lane B (screens) |
| `data/` | Lane C (research) |
| `plans/lane-a-*.md`, `plans/lane-b-*.md`, `plans/lane-c-*.md` | the matching lane |

Ports: main 3000, Lane A 3001, Lane B 3002, Lane C 3003.
Lane briefs: `docs/lanes/`. Design handoff from Claude Design: `design/handoff/`.
