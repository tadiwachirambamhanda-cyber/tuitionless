import { convert, formatMoney, type Rates } from "../currency";
import type {
  CountryCost,
  Match,
  MatchGroup,
  MatchResult,
  Scholarship,
  StudentProfile,
  StudyLevel,
} from "../types";
import { FALLBACK_RATES } from "./rates";

export interface MatchOptions {
  rates?: Rates; // units of each currency per 1 USD
  today?: string; // YYYY-MM-DD, for deadline checks (defaults to today)
}

// Typical course length, used to turn a "total" award into a yearly amount.
const YEARS: Record<StudyLevel, number> = { undergraduate: 4, masters: 2, phd: 3 };

const ANY = "ANY";

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function upper(list: string[]): string[] {
  return list.map((c) => c.trim().toUpperCase());
}

export function passesNationality(profile: StudentProfile, s: Scholarship): boolean {
  const nat = profile.nationality.trim().toUpperCase();
  if (upper(s.excludedNationalities).includes(nat)) return false;
  const eligible = upper(s.eligibleNationalities);
  return eligible.includes(ANY) || eligible.includes(nat);
}

export function passesStudyCountry(profile: StudentProfile, s: Scholarship): boolean {
  const list = upper(s.studyCountries);
  return list.includes(ANY) || list.includes(profile.studyCountry.trim().toUpperCase());
}

export function passesLevel(profile: StudentProfile, s: Scholarship): boolean {
  return s.levels.includes(profile.level);
}

export function passesField(profile: StudentProfile, s: Scholarship): boolean {
  if (s.fields.some((f) => f.trim().toUpperCase() === ANY)) return true;
  const want = norm(profile.field);
  if (!want) return false;
  return s.fields.some((f) => {
    const have = norm(f);
    return have === want || have.includes(want) || want.includes(have);
  });
}

export function passesDeadline(s: Scholarship, today: string): boolean {
  return s.deadline === null || s.deadline >= today;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function yearlyAmount(s: Scholarship, level: StudyLevel): number | null {
  if (s.amount === null) return null;
  return s.amountPeriod === "year" ? s.amount : s.amount / YEARS[level];
}

function classify(
  profile: StudentProfile,
  s: Scholarship,
  costs: CountryCost[],
  rates: Rates,
): MatchGroup {
  if (s.fullFunding) return "best_fit";
  const perYear = yearlyAmount(s, profile.level);
  if (perYear === null) return "stretch";

  const cost = costs.find((c) => c.country.toUpperCase() === profile.studyCountry.toUpperCase());
  if (!cost) return "stretch"; // cannot judge the gap without a yearly cost

  try {
    const yearlyCost = convert(cost.yearlyCost[profile.level], cost.currency, s.currency, rates);
    const budget = convert(profile.yearlyBudget, profile.budgetCurrency, s.currency, rates);
    const gap = yearlyCost - budget;
    if (gap <= 0 || perYear >= gap) return "best_fit";
    if (perYear >= gap / 2) return "worth_a_try";
    return "stretch";
  } catch {
    return "stretch"; // unknown currency: be honest and do not over-promise
  }
}

function buildReason(profile: StudentProfile, s: Scholarship): string {
  const open = upper(s.eligibleNationalities).includes(ANY)
    ? "Open to students from any country."
    : `Open to students from ${countryName(profile.nationality)}.`;
  const place = upper(s.studyCountries).includes(ANY) ? "anywhere" : countryName(profile.studyCountry);
  let money: string;
  if (s.fullFunding) {
    money = "full funding";
  } else if (s.amount !== null) {
    money = `up to ${formatMoney(s.amount, s.currency)} ${s.amountPeriod === "year" ? "a year" : "in total"}`;
  } else {
    money = "amount not published";
  }
  const where = place === "anywhere" ? "Use it anywhere" : `Covers ${profile.level} in ${place}`;
  return `${open} ${where}, ${money}.`;
}

function fundingRank(s: Scholarship, level: StudyLevel, rates: Rates): number {
  if (s.fullFunding) return Number.MAX_SAFE_INTEGER;
  const perYear = yearlyAmount(s, level);
  if (perYear === null) return -1;
  try {
    return convert(perYear, s.currency, "USD", rates);
  } catch {
    return 0;
  }
}

export function matchScholarships(
  profile: StudentProfile,
  scholarships: Scholarship[],
  costs: CountryCost[],
  options: MatchOptions = {},
): MatchResult {
  const rates = options.rates ?? FALLBACK_RATES;
  const today = options.today ?? todayString();
  const groups: MatchResult["groups"] = { best_fit: [], worth_a_try: [], stretch: [] };

  for (const s of scholarships) {
    if (
      !passesNationality(profile, s) ||
      !passesStudyCountry(profile, s) ||
      !passesLevel(profile, s) ||
      !passesField(profile, s) ||
      !passesDeadline(s, today)
    ) {
      continue;
    }
    const group = classify(profile, s, costs, rates);
    const match: Match = { scholarship: s, group, reason: buildReason(profile, s) };
    groups[group].push(match);
  }

  for (const key of Object.keys(groups) as MatchGroup[]) {
    groups[key].sort(
      (a, b) =>
        fundingRank(b.scholarship, profile.level, rates) - fundingRank(a.scholarship, profile.level, rates) ||
        a.scholarship.name.localeCompare(b.scholarship.name),
    );
  }

  return {
    groups,
    total: groups.best_fit.length + groups.worth_a_try.length + groups.stretch.length,
  };
}
