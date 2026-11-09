import type { Rates } from "../currency";

// Rough fallback exchange rates (units per 1 USD), used only to compare money sizes
// when no live rates are passed in. Good enough to sort matches into groups, not for quotes.
export const FALLBACK_RATES: Rates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.37,
  AUD: 1.52,
  NZD: 1.65,
  CHF: 0.88,
  SEK: 10.5,
  NOK: 10.7,
  DKK: 6.9,
  JPY: 150,
  KRW: 1350,
  CNY: 7.2,
  SGD: 1.34,
  HKD: 7.8,
  INR: 83,
  ZAR: 18.5,
  NGN: 1500,
  KES: 130,
  GHS: 15,
  TRY: 32,
  AED: 3.67,
  SAR: 3.75,
  BRL: 5.0,
  MXN: 17.5,
};
