// Shared contract. Owned by the Chief Architect. Lanes must not edit this file.
// Countries are ISO 3166-1 alpha-2 codes (e.g. "DE"). Currencies are ISO 4217 codes (e.g. "EUR").
// The value "ANY" means "no restriction" in list fields.

export type StudyLevel = "undergraduate" | "masters" | "phd";
export type MatchGroup = "best_fit" | "worth_a_try" | "stretch";

export interface StudentProfile {
  nationality: string; // ISO country code
  studyCountry: string; // ISO country code of the university
  studyCity?: string;
  level: StudyLevel;
  field: string; // free text or one of the field list, e.g. "computer science"
  yearlyBudget: number; // what the student can afford per year
  budgetCurrency: string; // ISO currency code
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  summary: string;
  amount: number | null; // null when the amount is not published
  amountPeriod: "year" | "total";
  currency: string;
  fullFunding: boolean; // covers tuition and living costs
  covers: string[]; // e.g. ["tuition", "living allowance", "flights"]
  levels: StudyLevel[];
  fields: string[]; // ["ANY"] when open to all fields
  studyCountries: string[]; // ["ANY"] when it can be used anywhere
  studyCities: string[]; // empty when not city specific
  eligibleNationalities: string[]; // ["ANY"] when open to all
  excludedNationalities: string[];
  eligibilityNotes: string;
  deadline: string | null; // YYYY-MM-DD, null when rolling or unknown
  deadlineNote: string | null;
  officialUrl: string; // the official application page
  sourceUrl: string; // where the facts were checked
  checkedOn: string; // YYYY-MM-DD
}

export interface CountryCost {
  country: string;
  currency: string;
  yearlyCost: Record<StudyLevel, number>; // typical tuition plus living, per year
  sourceUrl: string;
  checkedOn: string;
}

export interface Match {
  scholarship: Scholarship;
  group: MatchGroup;
  reason: string; // one short, friendly line shown on the card
}

export interface MatchResult {
  groups: Record<MatchGroup, Match[]>;
  total: number;
}
