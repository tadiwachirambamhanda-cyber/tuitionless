import path from "node:path";
import { describe, expect, it } from "vitest";
import { CURRENCIES } from "../client/profile";
import { loadDataFolder } from "../data/files";
import { FALLBACK_RATES } from "./rates";

describe("FALLBACK_RATES", () => {
  it("covers every currency a student can pick", () => {
    const missing = CURRENCIES.filter((c) => !FALLBACK_RATES[c]);
    expect(missing).toEqual([]);
  });
  it("covers every currency used in data/", () => {
    const { scholarships, costs } = loadDataFolder(path.join(process.cwd(), "data"));
    const used = new Set([...scholarships.map((s) => s.currency), ...costs.map((c) => c.currency)]);
    const missing = [...used].filter((c) => !FALLBACK_RATES[c]);
    expect(missing).toEqual([]);
  });
});
