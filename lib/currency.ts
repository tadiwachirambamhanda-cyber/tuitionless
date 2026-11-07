// Shared currency helpers. Owned by the Chief Architect.
export type Rates = Record<string, number>; // units of each currency per 1 USD

export function convert(amount: number, from: string, to: string, rates: Rates): number {
  if (from === to) return amount;
  const f = rates[from];
  const t = rates[to];
  if (!f || !t) throw new Error(`Missing rate for ${!f ? from : to}`);
  return (amount / f) * t;
}

export function formatMoney(amount: number, currency: string, locale = "en"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}
