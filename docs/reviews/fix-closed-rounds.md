# Review: fix/closed-rounds

## Codex review

Round 1, VERDICT: FINDINGS(1).

1. MAJOR, `scripts/seed.ts:18` and `supabase/migrations/0002_round_closed.sql:1`: if the seed runs before the migration, the upsert fails because `round_closed` does not exist. Dismissed by the owner: the failure is loud and harmless, and the migration is applied first when this ships. Reading is safe in either order because `rowToScholarship` falls back to false.
