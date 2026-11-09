import { describe, expect, it } from "vitest";
import { sampleScholarships } from "../sample-data";
import { scholarshipSchema } from "./schemas";

const good = { ...sampleScholarships[0], fields: ["Computer science", "ANY"] };

describe("scholarshipSchema fields", () => {
  it("accepts shared field names and ANY", () => {
    expect(scholarshipSchema.safeParse(good).success).toBe(true);
  });
  it("rejects a field outside the shared list", () => {
    const r = scholarshipSchema.safeParse({ ...good, fields: ["computer science and AI"] });
    expect(r.success).toBe(false);
  });
  it("is case sensitive so data stays tidy", () => {
    expect(scholarshipSchema.safeParse({ ...good, fields: ["computer science"] }).success).toBe(false);
  });
});
