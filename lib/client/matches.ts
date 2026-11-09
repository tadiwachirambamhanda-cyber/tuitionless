// The ONE place the screens get data from. Until Lane A's POST /api/match is merged this
// runs the matcher in the browser on sample data. To switch, replace the bodies below.
import { matchScholarships } from "@/lib/matching";
import { sampleCosts, sampleScholarships } from "@/lib/sample-data";
import type { Match, MatchResult, Scholarship, StudentProfile } from "@/lib/types";

export async function getMatches(profile: StudentProfile): Promise<MatchResult> {
  return matchScholarships(profile, sampleScholarships, sampleCosts);
}

export async function getScholarship(id: string, profile: StudentProfile | null): Promise<{ scholarship: Scholarship; match: Match | null } | null> {
  const scholarship = sampleScholarships.find((s) => s.id === id);
  if (!scholarship) return null;
  let match: Match | null = null;
  if (profile) {
    const r = await getMatches(profile);
    match = [...r.groups.best_fit, ...r.groups.worth_a_try, ...r.groups.stretch].find((m) => m.scholarship.id === id) ?? null;
  }
  return { scholarship, match };
}

/** Real counts for the landing page. Null when unavailable (the page then shows the "adding every week" card). */
export function getCounts(): { scholarships: number; countries: number } | null {
  return null;
}
