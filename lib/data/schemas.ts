import { z } from "zod";
import { FIELD_OPTIONS } from "../fields";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD");
const url = z.string().url();
const level = z.enum(["undergraduate", "masters", "phd"]);

// Mirrors Scholarship in lib/types.ts
export const scholarshipSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "id must be lowercase and hyphenated"),
  name: z.string().min(1),
  provider: z.string().min(1),
  summary: z.string().min(1),
  amount: z.number().nonnegative().nullable(),
  amountPeriod: z.enum(["year", "total"]),
  currency: z.string().length(3),
  fullFunding: z.boolean(),
  covers: z.array(z.string()),
  levels: z.array(level).min(1),
  fields: z
    .array(
      z.string().refine((f) => f === "ANY" || (FIELD_OPTIONS as readonly string[]).includes(f), {
        message: `must be "ANY" or exactly one of the shared fields: ${FIELD_OPTIONS.join(", ")}`,
      }),
    )
    .min(1),
  studyCountries: z.array(z.string()).min(1),
  studyCities: z.array(z.string()),
  eligibleNationalities: z.array(z.string()).min(1),
  excludedNationalities: z.array(z.string()),
  eligibilityNotes: z.string(),
  deadline: date.nullable(),
  deadlineNote: z.string().nullable(),
  officialUrl: url,
  sourceUrl: url,
  checkedOn: date,
});

// Mirrors CountryCost in lib/types.ts
export const countryCostSchema = z.object({
  country: z.string().length(2),
  currency: z.string().length(3),
  yearlyCost: z.object({
    undergraduate: z.number().nonnegative(),
    masters: z.number().nonnegative(),
    phd: z.number().nonnegative(),
  }),
  sourceUrl: url,
  checkedOn: date,
});

// Mirrors StudentProfile in lib/types.ts
export const studentProfileSchema = z.object({
  nationality: z.string().length(2, "nationality must be a 2-letter country code, e.g. NG"),
  studyCountry: z.string().length(2, "studyCountry must be a 2-letter country code, e.g. DE"),
  studyCity: z.string().optional(),
  level: level,
  field: z.string().min(1, "field is required"),
  yearlyBudget: z.number().nonnegative("yearlyBudget must be 0 or more"),
  budgetCurrency: z.string().length(3, "budgetCurrency must be a 3-letter code, e.g. USD"),
});
