import path from "node:path";
import { createPublicClient } from "../supabase/server";
import { loadDataFolder, type LoadedData } from "./files";
import type { CountryCost, Scholarship } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function rowToScholarship(r: any): Scholarship {
  return {
    id: r.id,
    name: r.name,
    provider: r.provider,
    summary: r.summary,
    amount: r.amount === null ? null : Number(r.amount),
    amountPeriod: r.amount_period,
    currency: r.currency,
    fullFunding: r.full_funding,
    covers: r.covers ?? [],
    levels: r.levels ?? [],
    fields: r.fields ?? ["ANY"],
    studyCountries: r.study_countries ?? ["ANY"],
    studyCities: r.study_cities ?? [],
    eligibleNationalities: r.eligible_nationalities ?? ["ANY"],
    excludedNationalities: r.excluded_nationalities ?? [],
    eligibilityNotes: r.eligibility_notes ?? "",
    deadline: r.deadline,
    deadlineNote: r.deadline_note,
    roundClosed: r.round_closed ?? false,
    officialUrl: r.official_url,
    sourceUrl: r.source_url,
    checkedOn: r.checked_on,
  };
}

export function rowToCountryCost(r: any): CountryCost {
  return {
    country: r.country,
    currency: r.currency,
    yearlyCost: {
      undergraduate: Number(r.yearly_cost_undergraduate),
      masters: Number(r.yearly_cost_masters),
      phd: Number(r.yearly_cost_phd),
    },
    sourceUrl: r.source_url,
    checkedOn: r.checked_on,
  };
}

export function scholarshipToRow(s: Scholarship) {
  return {
    id: s.id,
    name: s.name,
    provider: s.provider,
    summary: s.summary,
    amount: s.amount,
    amount_period: s.amountPeriod,
    currency: s.currency,
    full_funding: s.fullFunding,
    covers: s.covers,
    levels: s.levels,
    fields: s.fields,
    study_countries: s.studyCountries,
    study_cities: s.studyCities,
    eligible_nationalities: s.eligibleNationalities,
    excluded_nationalities: s.excludedNationalities,
    eligibility_notes: s.eligibilityNotes,
    deadline: s.deadline,
    deadline_note: s.deadlineNote,
    round_closed: s.roundClosed,
    official_url: s.officialUrl,
    source_url: s.sourceUrl,
    checked_on: s.checkedOn,
  };
}

export function countryCostToRow(c: CountryCost) {
  return {
    country: c.country,
    currency: c.currency,
    yearly_cost_undergraduate: c.yearlyCost.undergraduate,
    yearly_cost_masters: c.yearlyCost.masters,
    yearly_cost_phd: c.yearlyCost.phd,
    source_url: c.sourceUrl,
    checked_on: c.checkedOn,
  };
}

// The research data also lives in the repository (data/). If the database cannot be reached
// (paused free project, network error), the app answers from those files instead of failing.
let fileCache: LoadedData | null = null;
function fromFiles(): LoadedData {
  fileCache ??= loadDataFolder(path.join(process.cwd(), "data"));
  return fileCache;
}

export async function loadScholarships(): Promise<Scholarship[]> {
  try {
    const { data, error } = await createPublicClient().from("scholarships").select("*");
    if (error) throw new Error(`Could not load scholarships: ${error.message}`);
    return (data ?? []).map(rowToScholarship);
  } catch (e) {
    console.error("database unavailable, using the data files:", (e as Error).message);
    return fromFiles().scholarships;
  }
}

export async function loadCountryCosts(): Promise<CountryCost[]> {
  try {
    const { data, error } = await createPublicClient().from("country_costs").select("*");
    if (error) throw new Error(`Could not load country costs: ${error.message}`);
    return (data ?? []).map(rowToCountryCost);
  } catch (e) {
    console.error("database unavailable, using the data files:", (e as Error).message);
    return fromFiles().costs;
  }
}

export async function loadScholarship(id: string): Promise<Scholarship | null> {
  try {
    const { data, error } = await createPublicClient().from("scholarships").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Could not load scholarship: ${error.message}`);
    return data ? rowToScholarship(data) : null;
  } catch (e) {
    console.error("database unavailable, using the data files:", (e as Error).message);
    return fromFiles().scholarships.find((x) => x.id === id) ?? null;
  }
}
