// Supabase clients. Owned by the Chief Architect.
import { createClient } from "@supabase/supabase-js";

// Read-only client (public data). Safe in the browser and on the server.
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars are missing. See .env.example");
  return createClient(url, key);
}

// Server-only client with write access, used by the seed script. Never import this in a component.
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service env vars are missing. See .env.example");
  return createClient(url, key, { auth: { persistSession: false } });
}
