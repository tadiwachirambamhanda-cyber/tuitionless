// STUB. Lane A replaces the body of matchScholarships. Keep the signature.
import type { CountryCost, MatchResult, Scholarship, StudentProfile } from "@/lib/types";

export function matchScholarships(
  _profile: StudentProfile,
  scholarships: Scholarship[],
  _costs: CountryCost[],
): MatchResult {
  const groups: MatchResult["groups"] = { best_fit: [], worth_a_try: [], stretch: [] };
  scholarships.forEach((scholarship, i) => {
    const group = (["best_fit", "worth_a_try", "stretch"] as const)[i % 3];
    groups[group].push({ scholarship, group, reason: "Sample reason (stub matcher)" });
  });
  return { groups, total: scholarships.length };
}
