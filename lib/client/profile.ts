import { FIELD_OPTIONS } from "@/lib/fields";
import type { StudentProfile, StudyLevel } from "@/lib/types";

export const STEP_TOPICS = ["Nationality", "University", "Level", "Field", "Budget"] as const;
export const TOTAL_STEPS = STEP_TOPICS.length;

// Every ISO 3166-1 country plus Kosovo (XK), which the research data uses as a nationality code.
export const COUNTRY_CODES = [
  "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB",
  "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "BN", "BG", "BF", "BI", "CV", "KH", "CM",
  "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ",
  "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF",
  "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN",
  "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR",
  "XK", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MH",
  "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ",
  "NI", "NE", "NG", "NU", "NF", "MK", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT",
  "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC",
  "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "TW", "TJ",
  "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ",
  "VU", "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW",
] as const;
export const POPULAR_NATIONALITIES = ["NG", "IN", "KE", "BR", "PK"];

export const FIELDS: readonly string[] = FIELD_OPTIONS; // shared list from lib/fields.ts
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
  const known = (c: string) => (COUNTRY_CODES as readonly string[]).includes(c);
  if (!known(d.n) || !(d.c === "ANY" || known(d.c))) return null;
  if (!CURRENCIES.includes(d.cur) || !FIELDS.includes(d.f)) return null;
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
