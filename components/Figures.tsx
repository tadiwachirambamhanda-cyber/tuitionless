import { convert, formatMoney } from "@/lib/currency";
import type { Scholarship } from "@/lib/types";
import { RATES } from "@/lib/client/rates";
import { dayMonth, daysLeft, year } from "@/lib/client/dates";
import { Clock } from "./icons";

export function toDisplay(amount: number, from: string, to: string): number | null {
  try {
    return convert(amount, from, to, RATES);
  } catch {
    return null;
  }
}

export function MoneyFigure({ s, currency, big = "text-2xl" }: { s: Scholarship; currency: string; big?: string }) {
  if (s.amount === null) {
    return s.fullFunding ? (
      <>
        <p className={`font-display ${big} font-bold`}>Full tuition</p>
        <p className="text-sm text-ink-muted">amount set by your university</p>
      </>
    ) : (
      <>
        <p className={`font-display ${big} font-bold text-ink-muted`}>Not published</p>
        <p className="text-sm text-ink-muted">check the official site</p>
      </>
    );
  }
  const shown = toDisplay(s.amount, s.currency, currency);
  const period = s.amountPeriod === "year" ? "a year" : "one payment";
  const original = formatMoney(s.amount, s.currency);
  return (
    <>
      <p className={`font-display ${big} font-bold`}>{shown === null ? original : formatMoney(shown, currency)}</p>
      <p className="text-sm text-ink-muted">{shown === null || s.currency === currency ? period : `${period} · ${original}`}</p>
    </>
  );
}

export function DeadlineFigure({ s, big = "text-2xl" }: { s: Scholarship; big?: string }) {
  if (!s.deadline) {
    return (
      <>
        <p className={`font-display ${big} font-bold`}>Rolling</p>
        {s.deadlineNote && <p className="text-sm text-ink-muted">{s.deadlineNote}</p>}
      </>
    );
  }
  const left = daysLeft(s.deadline);
  return (
    <>
      <p className={`font-display ${big} font-bold`}>{dayMonth(s.deadline)}</p>
      {left >= 0 && left < 30 ? (
        <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-warning-bg px-2 py-0.5 text-sm font-semibold text-warning">
          <Clock size={14} />
          {left} days left
        </p>
      ) : (
        <p className="text-sm text-ink-muted">
          {year(s.deadline)}
          {left >= 0 ? ` · ${left} days left` : " · closed"}
        </p>
      )}
    </>
  );
}
