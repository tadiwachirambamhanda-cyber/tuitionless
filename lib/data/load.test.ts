import { describe, expect, it, vi } from "vitest";

vi.mock("../supabase/server", () => ({
  createPublicClient: () => ({
    from: () => ({
      select: () => Object.assign(Promise.resolve({ data: null, error: { message: "database is down" } }), {
        eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: { message: "database is down" } }) }),
      }),
    }),
  }),
}));

import { loadCountryCosts, loadScholarship, loadScholarships } from "./load";

describe("when the database is down", () => {
  it("answers from the data files", async () => {
    const scholarships = await loadScholarships();
    expect(scholarships.length).toBeGreaterThan(100);
    expect((await loadCountryCosts()).length).toBeGreaterThan(5);
    const one = await loadScholarship(scholarships[0].id);
    expect(one?.id).toBe(scholarships[0].id);
  });
});
