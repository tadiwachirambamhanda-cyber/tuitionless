import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { sampleCosts, sampleProfile, sampleScholarships } from "../sample-data";
import type { Scholarship, StudentProfile } from "../types";
import { matchScholarships } from "./index";

const rates = { USD: 1, EUR: 1, SEK: 10 };
const today = "2026-11-07";
const profile: StudentProfile = { ...sampleProfile, yearlyBudget: 2000, budgetCurrency: "EUR" };
// Germany masters costs 12,000 EUR; budget 2,000 -> gap 10,000.

const base: Scholarship = {
  ...sampleScholarships[0],
  id: "t",
  name: "Test",
  amount: 10000,
  amountPeriod: "year",
  currency: "EUR",
  fullFunding: false,
  levels: ["masters"],
  fields: ["ANY"],
  studyCountries: ["DE"],
  eligibleNationalities: ["ANY"],
  excludedNationalities: [],
  deadline: "2027-01-01",
};

function run(s: Partial<Scholarship>, p: StudentProfile = profile) {
  return matchScholarships(p, [{ ...base, ...s }], sampleCosts, { rates, today });
}

describe("hard filters", () => {
  it("allows ANY nationality and a listed nationality", () => {
    expect(run({ eligibleNationalities: ["ANY"] }).total).toBe(1);
    expect(run({ eligibleNationalities: ["NG"] }).total).toBe(1);
  });
  it("drops an unlisted nationality", () => {
    expect(run({ eligibleNationalities: ["GH"] }).total).toBe(0);
  });
  it("drops an excluded nationality even when ANY", () => {
    expect(run({ excludedNationalities: ["NG"] }).total).toBe(0);
  });
  it("filters by study country, allowing ANY", () => {
    expect(run({ studyCountries: ["SE"] }).total).toBe(0);
    expect(run({ studyCountries: ["ANY"] }).total).toBe(1);
  });
  it("filters by level", () => {
    expect(run({ levels: ["phd"] }).total).toBe(0);
  });
  it("filters by field with exact, case-insensitive equality, allowing ANY", () => {
    const p = { ...profile, field: "computer science" };
    expect(run({ fields: ["Law and public policy"] }, p).total).toBe(0);
    expect(run({ fields: ["Computer science"] }, p).total).toBe(1);
    expect(run({ fields: ["Engineering", "Computer science"] }, p).total).toBe(1);
    expect(run({ fields: ["ANY"] }, p).total).toBe(1);
  });
  it("does not match a field by part of another field", () => {
    expect(run({ fields: ["Computer science and AI"] }, { ...profile, field: "computer science" }).total).toBe(0);
  });
  it("'Something else' only matches ANY", () => {
    const p = { ...profile, field: "Something else" };
    expect(run({ fields: ["Something else"] }, p).total).toBe(0);
    expect(run({ fields: ["Engineering"] }, p).total).toBe(0);
    expect(run({ fields: ["ANY"] }, p).total).toBe(1);
  });
  it("filters by city only when the scholarship lists cities and the student gave one", () => {
    expect(run({ studyCities: ["Berlin"] }, { ...profile, studyCity: "Munich" }).total).toBe(0);
    expect(run({ studyCities: ["Munich"] }, { ...profile, studyCity: "munich" }).total).toBe(1);
    expect(run({ studyCities: ["Berlin"] }, { ...profile, studyCity: undefined }).total).toBe(1);
    expect(run({ studyCities: [] }, { ...profile, studyCity: "Munich" }).total).toBe(1);
  });
  it("drops past deadlines but keeps null and today", () => {
    expect(run({ deadline: "2026-11-06" }).total).toBe(0);
    expect(run({ deadline: null }).total).toBe(1);
    expect(run({ deadline: "2026-11-07" }).total).toBe(1);
  });
});

describe("groups", () => {
  it("full funding is best fit", () => {
    expect(run({ fullFunding: true, amount: null }).groups.best_fit).toHaveLength(1);
  });
  it("amount plus budget covering the cost is best fit", () => {
    expect(run({ amount: 10000 }).groups.best_fit).toHaveLength(1);
  });
  it("covering at least half the gap is worth a try", () => {
    expect(run({ amount: 5000 }).groups.worth_a_try).toHaveLength(1);
  });
  it("covering less than half is a stretch", () => {
    expect(run({ amount: 4000 }).groups.stretch).toHaveLength(1);
  });
  it("unpublished amount that is not full funding is worth a try", () => {
    expect(run({ amount: null }).groups.worth_a_try).toHaveLength(1);
  });
  it("unpublished amount says so and points to the official page", () => {
    const m = run({ amount: null, eligibleNationalities: ["NG"] }).groups.worth_a_try[0];
    expect(m.reason).toBe(
      "Open to students from Nigeria. Covers masters in Germany. Amount not published, check the official page.",
    );
  });
  it("unpublished amount with no cost data for the country is still a stretch", () => {
    const r = matchScholarships(profile, [{ ...base, amount: null }], [], { rates, today });
    expect(r.groups.stretch).toHaveLength(1);
  });
  it("unpublished amount in an unknown currency is still a stretch", () => {
    expect(run({ amount: null, currency: "XXX" }).groups.stretch).toHaveLength(1);
  });
  it("an unknown currency used everywhere is still a stretch", () => {
    const costs = [{ ...sampleCosts[0], currency: "XXX" }];
    const r = matchScholarships({ ...profile, budgetCurrency: "XXX" }, [{ ...base, amount: null, currency: "XXX" }], costs, { rates, today });
    expect(r.groups.stretch).toHaveLength(1);
  });
  it("unpublished amount is best fit when it is full funding", () => {
    expect(run({ amount: null, fullFunding: true }).groups.best_fit).toHaveLength(1);
  });
  it("converts currencies before comparing", () => {
    // 100,000 SEK = 10,000 EUR at the test rate
    expect(run({ amount: 100000, currency: "SEK" }).groups.best_fit).toHaveLength(1);
  });
  it("turns a total award into a yearly amount using course length", () => {
    // masters = 2 years: 20,000 total = 10,000 a year
    expect(run({ amount: 20000, amountPeriod: "total" }).groups.best_fit).toHaveLength(1);
    expect(run({ amount: 8000, amountPeriod: "total" }).groups.stretch).toHaveLength(1);
  });
  it("is a stretch when no cost is known for the country", () => {
    const r = matchScholarships(profile, [base], [], { rates, today });
    expect(r.groups.stretch).toHaveLength(1);
  });
  it("is best fit when the student budget alone covers the cost", () => {
    expect(run({ amount: 100 }, { ...profile, yearlyBudget: 20000 }).groups.best_fit).toHaveLength(1);
  });
});

describe("reason and result", () => {
  it("writes a friendly reason", () => {
    const m = run({ amount: 11000 }).groups.best_fit[0];
    expect(m.reason).toContain("Open to students from any country.");
    expect(m.reason).toContain("masters in Germany");
    expect(m.reason).toContain("a year");
  });
  it("names the nationality when restricted", () => {
    expect(run({ eligibleNationalities: ["NG"] }).groups.best_fit[0].reason).toContain("Nigeria");
  });
  it("counts the total across groups", () => {
    const r = matchScholarships(profile, sampleScholarships, sampleCosts, { today: "2026-11-07" });
    expect(r.total).toBe(r.groups.best_fit.length + r.groups.worth_a_try.length + r.groups.stretch.length);
  });
  it("sample data: a Nigerian masters student for Germany only sees fitting scholarships", () => {
    const r = matchScholarships(sampleProfile, sampleScholarships, sampleCosts, { today: "2026-11-07" });
    const ids = Object.values(r.groups).flat().map((m) => m.scholarship.id).sort();
    expect(ids).toEqual(["sample-1", "sample-3"]);
  });
  it("sorts full funding first", () => {
    const r = matchScholarships(
      profile,
      [{ ...base, id: "a", name: "A", amount: 10000 }, { ...base, id: "b", name: "B", fullFunding: true }],
      sampleCosts,
      { rates, today },
    );
    expect(r.groups.best_fit.map((m) => m.scholarship.id)).toEqual(["b", "a"]);
  });
});

// Reproduces: Chevening (round closed, next not published) showed as Best fit for a Nigerian masters student.
describe("closed rounds", () => {
  const closed = { roundClosed: true } as unknown as Partial<Scholarship>;
  const groupsOf = (r: ReturnType<typeof run>) => r.groups as unknown as Record<string, unknown[]>;

  it("never puts a closed round in Best fit, even with full funding", () => {
    const r = run({ ...closed, fullFunding: true });
    expect(groupsOf(r).best_fit).toHaveLength(0);
    expect(groupsOf(r).closed).toHaveLength(1);
    expect(r.total).toBe(1);
  });
  it("keeps closed rounds out of Worth a try and Stretch too", () => {
    const r = run({ ...closed, amount: null });
    expect(groupsOf(r).worth_a_try).toHaveLength(0);
    expect(groupsOf(r).stretch).toHaveLength(0);
    expect(groupsOf(r).closed).toHaveLength(1);
  });
  it("leaves an open round where it was", () => {
    const r = run({ roundClosed: false, fullFunding: true } as unknown as Partial<Scholarship>);
    expect(groupsOf(r).best_fit).toHaveLength(1);
    expect(groupsOf(r).closed).toHaveLength(0);
  });
  it("marks Chevening closed in the research data", () => {
    const uk = JSON.parse(readFileSync(join(process.cwd(), "data/scholarships/uk.json"), "utf8")) as Array<{ id: string; roundClosed?: boolean }>;
    expect(uk.find((s) => s.id === "chevening-scholarship-uk")?.roundClosed).toBe(true);
  });
});
