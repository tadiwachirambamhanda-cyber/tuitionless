import { describe, expect, it } from "vitest";
import { convert } from "./currency";

describe("convert", () => {
  const rates = { USD: 1, EUR: 0.9 };
  it("returns the same amount for the same currency", () => {
    expect(convert(100, "USD", "USD", rates)).toBe(100);
  });
  it("converts USD to EUR", () => {
    expect(convert(100, "USD", "EUR", rates)).toBeCloseTo(90);
  });
  it("throws on an unknown currency", () => {
    expect(() => convert(1, "USD", "XXX", rates)).toThrow();
  });
});
