// FICTIONAL sample data for building screens. Never loaded into the database.
import type { CountryCost, Scholarship, StudentProfile } from "@/lib/types";

export const sampleProfile: StudentProfile = {
  nationality: "NG",
  studyCountry: "DE",
  studyCity: "Munich",
  level: "masters",
  field: "computer science",
  yearlyBudget: 4000,
  budgetCurrency: "USD",
};

const base = {
  fullFunding: false,
  studyCities: [] as string[],
  excludedNationalities: [] as string[],
  deadlineNote: null,
  checkedOn: "2026-11-07",
  sourceUrl: "https://example.com/sample",
  officialUrl: "https://example.com/apply",
};

export const sampleScholarships: Scholarship[] = [
  { ...base, id: "sample-1", name: "Rhine Future Scholars Award (sample)", provider: "Sample Foundation", summary: "Sample masters award for Germany.", amount: 11000, amountPeriod: "year", currency: "EUR", covers: ["tuition", "living allowance"], levels: ["masters"], fields: ["ANY"], studyCountries: ["DE"], eligibleNationalities: ["ANY"], eligibilityNotes: "Sample only.", deadline: "2027-01-15" },
  { ...base, id: "sample-2", name: "Northern Lights Master's Grant (sample)", provider: "Sample University", summary: "Sample full tuition grant.", amount: null, amountPeriod: "year", currency: "SEK", fullFunding: true, covers: ["tuition"], levels: ["masters"], fields: ["computer science"], studyCountries: ["SE"], eligibleNationalities: ["NG", "GH", "KE"], eligibilityNotes: "Sample only.", deadline: "2026-12-01" },
  { ...base, id: "sample-3", name: "Open Doors Global Bursary (sample)", provider: "Sample Trust", summary: "Sample bursary open to all nationalities.", amount: 5000, amountPeriod: "year", currency: "USD", covers: ["living allowance"], levels: ["undergraduate", "masters"], fields: ["ANY"], studyCountries: ["ANY"], eligibleNationalities: ["ANY"], eligibilityNotes: "Sample only.", deadline: "2027-03-30" },
];

export const sampleCosts: CountryCost[] = [
  { country: "DE", currency: "EUR", yearlyCost: { undergraduate: 12000, masters: 12000, phd: 12000 }, sourceUrl: "https://example.com/sample", checkedOn: "2026-11-07" },
];
