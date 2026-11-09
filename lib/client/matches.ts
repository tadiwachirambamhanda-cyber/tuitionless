// The ONE place the screens get data from. Talks to the app's own API routes only,
// so the matcher and the scholarship data never ship to the browser.
import type { Match, MatchResult, Scholarship, StudentProfile } from "@/lib/types";

async function failMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
}

export async function getMatches(profile: StudentProfile): Promise<MatchResult> {
  const res = await fetch("/api/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error(await failMessage(res, "Could not load matches."));
  return (await res.json()) as MatchResult;
}

/** Returns null when the scholarship does not exist; throws when the call fails. */
export async function getScholarship(
  id: string,
  profile: StudentProfile | null,
): Promise<{ scholarship: Scholarship; match: Match | null } | null> {
  const res = await fetch(`/api/scholarships/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await failMessage(res, "Could not load the scholarship."));
  const scholarship = (await res.json()) as Scholarship;

  // The reasons need the profile. If matching fails the page still shows the facts.
  let match: Match | null = null;
  if (profile) {
    try {
      const r = await getMatches(profile);
      match = [...r.groups.best_fit, ...r.groups.worth_a_try, ...r.groups.stretch].find((m) => m.scholarship.id === id) ?? null;
    } catch {
      match = null;
    }
  }
  return { scholarship, match };
}

/** Real counts for the landing page. Null when unavailable (the page then shows the "adding every week" card). */
export function getCounts(): { scholarships: number; countries: number } | null {
  return null;
}
