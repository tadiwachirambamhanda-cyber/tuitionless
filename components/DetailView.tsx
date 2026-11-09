"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { GroupBadge } from "./GroupBadge";
import { DeadlineFigure, MoneyFigure } from "./Figures";
import { StatePanel } from "./StatePanel";
import { Skeleton } from "./Skeleton";
import { ArrowLeft, Check, External } from "./icons";
import { getScholarship } from "@/lib/client/matches";
import { longDate } from "@/lib/client/dates";
import { countryName, draftToProfile, levelLabel, readDraft } from "@/lib/client/profile";
import type { Match, Scholarship, StudentProfile } from "@/lib/types";

type Loaded = { id: string; data: { scholarship: Scholarship; match: Match | null } | null };

function reasons(s: Scholarship, p: StudentProfile | null): string[] {
  if (!p) return [];
  const out: string[] = [];
  if (s.eligibleNationalities.includes("ANY") || s.eligibleNationalities.includes(p.nationality)) out.push(`Open to students from ${countryName(p.nationality)}`);
  if (s.levels.includes(p.level)) out.push(`Covers ${levelLabel(p.level).toLowerCase()} study`);
  if (s.studyCountries.includes("ANY") || s.studyCountries.includes(p.studyCountry)) out.push(s.studyCountries.includes("ANY") ? "Can be used in any country" : `Can be used in ${countryName(p.studyCountry)}`);
  if (s.fields.includes("ANY") || s.fields.includes(p.field)) out.push(s.fields.includes("ANY") ? "Open to every field" : `Open to ${p.field}`);
  return out;
}

export function DetailView({ id }: { id: string }) {
  const sp = useSearchParams();
  const qs = sp.toString();
  const profile = useMemo(() => draftToProfile(readDraft(new URLSearchParams(qs))), [qs]);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [failedId, setFailedId] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    getScholarship(id, profile).then((data) => live && setLoaded({ id, data }), () => live && setFailedId(id));
    return () => { live = false; };
  }, [id, profile]);

  const back = `/results${qs ? `?${qs}` : ""}`;
  const top = (
    <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-1">
      <Button variant="ghost" href={back}><ArrowLeft size={18} /> Back to results</Button>
      <Logo />
    </div>
  );

  if (failedId === id || (loaded && loaded.id === id && !loaded.data)) {
    return <main>{top}<StatePanel tone="error" title="We couldn't find this scholarship" help="It may have been removed, or the link is wrong." action={<Button href={back}>Back to results</Button>} /></main>;
  }
  if (!loaded || loaded.id !== id || !loaded.data) {
    return (
      <main aria-busy="true" role="status">
        {top}
        <div className="mx-auto max-w-5xl space-y-4 px-4"><Skeleton className="h-64 w-full rounded-[28px]" /><Skeleton className="h-40 w-full" /></div>
      </main>
    );
  }

  const { scholarship: s, match } = loaded.data;
  const cur = profile?.budgetCurrency ?? s.currency;
  const why = reasons(s, profile);
  const place = s.studyCountries.includes("ANY") ? "Any country" : s.studyCountries.map(countryName).join(", ");
  const apply = (
    <Button href={s.officialUrl} target="_blank" className="w-full">
      Apply on official site <External size={18} /><span className="sr-only">(opens in a new tab)</span>
    </Button>
  );
  const card = "rounded-[20px] border border-border bg-surface p-5";

  return (
    <main className="pb-28 min-[1100px]:pb-10">
      {top}
      <div className="mx-auto grid max-w-5xl gap-6 px-4 min-[1100px]:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <header className="rounded-[28px] bg-(image:--gradient-hero) p-6">
            {match && <GroupBadge group={match.group} label={`${match.group === "best_fit" ? "Best fit" : match.group === "worth_a_try" ? "Worth a try" : "Stretch"} for you`} />}
            <h1 className="mt-3 font-display text-3xl font-bold md:text-5xl">{s.name}</h1>
            <p className="mt-1">{s.provider} · {place}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.06em]">Amount</p><MoneyFigure s={s} currency={cur} big="text-3xl" /></div>
              <div className="rounded-xl bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.06em]">Deadline</p><DeadlineFigure s={s} big="text-3xl" /></div>
            </div>
          </header>

          {(match || why.length > 0) && (
            <section className={`${card} border-best-fg`} aria-labelledby="why">
              <h2 id="why" className="font-display text-xl font-bold">Why it matched you</h2>
              {match && <p className="mt-2">{match.reason}</p>}
              <ul className="mt-3 space-y-2">{why.map((w) => <li key={w} className="flex gap-2"><span className="text-best-fg"><Check size={20} /></span>{w}</li>)}</ul>
            </section>
          )}

          <section className={card} aria-labelledby="covers">
            <h2 id="covers" className="font-display text-xl font-bold">What it covers</h2>
            {s.covers.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">{s.covers.map((c) => <li key={c} className="rounded-full bg-best-bg px-3 py-1 text-sm font-semibold text-best-fg">{c}</li>)}</ul>
            ) : (
              <p className="mt-2 italic text-ink-muted">The provider hasn&apos;t said what this covers. Check the official site.</p>
            )}
          </section>

          <section className={card} aria-labelledby="who">
            <h2 id="who" className="font-display text-xl font-bold">Who can apply</h2>
            <p className="mt-2">{s.eligibilityNotes || <span className="italic text-ink-muted">Check the official site for who can apply.</span>}</p>
          </section>

          <section className={card} aria-labelledby="facts">
            <h2 id="facts" className="font-display text-xl font-bold">Key facts</h2>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              <dt className="text-ink-muted">Where</dt><dd>{place}</dd>
              <dt className="text-ink-muted">Level</dt><dd>{s.levels.map(levelLabel).join(", ")}</dd>
              <dt className="text-ink-muted">Field</dt><dd>{s.fields.includes("ANY") ? "Any field" : s.fields.join(", ")}</dd>
              <dt className="text-ink-muted">Provider</dt><dd>{s.provider}</dd>
              <dt className="text-ink-muted">Paid</dt><dd>{s.amountPeriod === "year" ? "Every year" : "One payment"}</dd>
            </dl>
            <p className="mt-4 text-sm text-ink-muted">Facts checked on {longDate(s.checkedOn)} on the provider&apos;s own page.</p>
          </section>
        </div>

        <aside className="hidden min-[1100px]:block">
          <div className={`${card} sticky top-6 space-y-4`}>
            <div><p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Amount</p><MoneyFigure s={s} currency={cur} /></div>
            <div><p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Deadline</p><DeadlineFigure s={s} /></div>
            {apply}
          </div>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-bg/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur min-[1100px]:hidden">{apply}</div>
    </main>
  );
}
