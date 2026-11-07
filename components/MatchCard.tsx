import Link from "next/link";
import type { Match } from "@/lib/types";
import { countryName } from "@/lib/client/profile";
import { GroupBadge } from "./GroupBadge";
import { DeadlineFigure, MoneyFigure } from "./Figures";
import { ArrowRight, CheckCircle, Globe, Pin } from "./icons";

export function MatchCard({ match, currency, query }: { match: Match; currency: string; query: string }) {
  const s = match.scholarship;
  const place = s.studyCountries.includes("ANY") ? "Any country" : s.studyCountries.map(countryName).join(", ");
  return (
    <article className="flex flex-col gap-4 rounded-[20px] border border-border bg-surface p-5 shadow-(--shadow-sm)">
      <div className="flex items-center justify-between gap-2">
        <GroupBadge group={match.group} />
        <span className="inline-flex items-center gap-1 text-sm text-ink-muted">
          {s.studyCountries.includes("ANY") ? <Globe size={16} /> : <Pin size={16} />}
          {place}
        </span>
      </div>
      <div>
        <h3 className="font-display text-xl font-bold">{s.name}</h3>
        <p className="text-sm text-ink-muted">{s.provider}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-muted p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Amount</p>
          <MoneyFigure s={s} currency={currency} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Deadline</p>
          <DeadlineFigure s={s} />
        </div>
      </div>
      <p className="flex gap-2 text-sm"><span className="mt-0.5 text-best-fg"><CheckCircle size={18} /></span>{match.reason}</p>
      <Link
        href={`/scholarships/${s.id}${query ? `?${query}` : ""}`}
        className="mt-auto inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-(image:--gradient-action) px-6 text-lg font-semibold text-white shadow-(--shadow-action) hover:bg-(image:--gradient-action-hover)"
      >
        View Details <ArrowRight size={18} />
      </Link>
    </article>
  );
}
