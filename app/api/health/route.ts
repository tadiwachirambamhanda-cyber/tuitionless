import { connection } from "next/server";
import { createPublicClient } from "@/lib/supabase/server";

// Called once a day by the Vercel cron in vercel.json. The small database read counts as
// activity, so the free Supabase project is not paused. It returns no scholarship data.
export async function GET() {
  await connection(); // always run at request time, never prerendered at build
  try {
    const { error } = await createPublicClient().from("scholarships").select("id").limit(1);
    if (error) throw new Error(error.message);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("health check failed:", (e as Error).message);
    return Response.json({ ok: false }, { status: 503 });
  }
}
