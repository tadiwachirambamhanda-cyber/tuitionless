import type { StudentProfile, StudyLevel } from "@/lib/types";

export const STEP_TOPICS = ["Nationality", "University", "Level", "Field", "Budget"] as const;
export const TOTAL_STEPS = STEP_TOPICS.length;

export const COUNTRY_CODES = [
  "NG", "IN", "KE", "BR", "PK", "GH", "ZA", "ZW", "UG", "TZ", "ZM", "ET", "EG", "MA", "CM", "SN", "RW", "BD", "LK", "NP",
  "ID", "PH", "VN", "TH", "MY", "CN", "TR", "IR", "JO", "LB", "UA", "MX", "CO", "AR", "PE", "CL", "JM", "DE", "FR", "NL",
  "SE", "FI", "NO", "DK", "IT", "ES", "AT", "CH", "BE", "IE", "GB", "US", "CA", "AU", "NZ", "JP", "KR", "SG", "AE",
] as const;
export const POPULAR_NATIONALITIES = ["NG", "IN", "KE", "BR", "PK"];

export const FIELDS = [
  "Computer science", "Engineering", "Business", "Medicine and health", "Natural sciences",
  "Social sciences", "Law", "Arts and humanities", "Something else",
];
export const CURRENCIES = ["USD", "EUR", "GBP", "NGN", "INR", "KES", "BRL", "PKR", "GHS", "ZAR"];
export const LEVELS: { value: StudyLevel; label: string; sub: string }[] = [
  { value: "undergraduate", label: "Undergraduate", sub: "Bachelor's degree" },
  { value: "masters", label: "Masters", sub: "Master's degree" },
  { value: "phd", label: "PhD", sub: "Doctorate or research degree" },
];

let names: Intl.DisplayNames | null = null;
export function countryName(code: string): string {
  if (code === "ANY") return "Any country";
  try {
    names ??= new Intl.DisplayNames(["en"], { type: "region" });
    return names.of(code) ?? code;
  } catch {
    return code;
  }
}

export function flag(code: string): string {
  if (code.length !== 2) return "🌍";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export function levelLabel(l: StudyLevel): string {
  return LEVELS.find((x) => x.value === l)?.label ?? l;
}

export type Draft = Partial<Record<"n" | "c" | "city" | "l" | "f" | "b" | "cur", string>>;
const KEYS = ["n", "c", "city", "l", "f", "b", "cur"] as const;

export function readDraft(sp: URLSearchParams): Draft {
  const d: Draft = {};
  for (const k of KEYS) {
    const v = sp.get(k);
    if (v) d[k] = v;
  }
  return d;
}

export function draftToQuery(d: Draft, extra: Record<string, string> = {}): string {
  const q = new URLSearchParams();
  for (const k of KEYS) if (d[k]) q.set(k, d[k]);
  for (const [k, v] of Object.entries(extra)) q.set(k, v);
  return q.toString();
}

/** Returns a full profile, or null when any answer is missing or invalid. */
export function draftToProfile(d: Draft): StudentProfile | null {
  const budget = Number(d.b);
  if (!d.n || !d.c || !d.l || !d.f || !d.cur || !Number.isFinite(budget) || budget < 0 || d.b === undefined) return null;
  if (!LEVELS.some((x) => x.value === d.l)) return null;
  return {
    nationality: d.n,
    studyCountry: d.c,
    studyCity: d.city || undefined,
    level: d.l as StudyLevel,
    field: d.f.toLowerCase(),
    yearlyBudget: budget,
    budgetCurrency: d.cur,
  };
}
