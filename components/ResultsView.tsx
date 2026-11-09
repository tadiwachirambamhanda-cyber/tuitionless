"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { MatchCard } from "./MatchCard";
import { GROUP_INFO, GroupBadge } from "./GroupBadge";
import { StatePanel } from "./StatePanel";
import { CardSkeleton, Skeleton } from "./Skeleton";
import { toDisplay } from "./Figures";
import { Close, Filter } from "./icons";
import { getMatches } from "@/lib/client/matches";
import { daysLeft } from "@/lib/client/dates";
import { countryName, draftToProfile, draftToQuery, levelLabel, readDraft } from "@/lib/client/profile";
import { formatMoney } from "@/lib/currency";
import type { Match, MatchGroup, MatchResult } from "@/lib/types";

const GROUPS: MatchGroup[] = ["best_fit", "worth_a_try", "stretch", "closed"];
type Sort = "best" | "deadline" | "amount" | "country";
type Filters = { countries: string[]; minAmount: number; within: number };
const NO_FILTERS: Filters = { countries: [], minAmount: 0, within: 0 };

function countryOf(m: Match): string {
  const c = m.scholarship.studyCountries;
  return c.includes("ANY") ? "ANY" : c[0] ?? "ANY";
}

export function ResultsView() {
  const sp = useSearchParams();
  const qs = sp.toString();
  const draft = useMemo(() => readDraft(new URLSearchParams(qs)), [qs]);
  const profile = useMemo(() => draftToProfile(draft), [draft]);
  const [state, setState] = useState<{ key: string; result?: MatchResult; failed?: boolean }>({ key: "" });
  const [attempt, setAttempt] = useState(0);
  const key = qs + "#" + attempt;

  useEffect(() => {
    if (!profile) return;
    let live = true;
    getMatches(profile).then(
      (result) => live && setState({ key, result }),
      () => live && setState({ key, failed: true }),
    );
    return () => { live = false; };
  }, [profile, key]);

  const [sort, setSort] = useState<Sort>("best");
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);

  const editHref = `/find?${draftToQuery(draft, { step: "5" })}`;
  const header = (children?: React.ReactNode) => (
    <header className="rounded-b-[28px] bg-(image:--gradient-hero) px-4 pb-8 pt-2 lg:rounded-b-[48px]">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Logo onHero />
          <Button variant="ghost" href={editHref} className="!text-ink">Edit answers</Button>
        </div>
        {children}
      </div>
    </header>
  );

  if (!profile) {
    return (
      <main>
        {header()}
        <StatePanel title="We need your answers first" help="Answer five quick questions and we will find your matches." action={<Button href="/find">Start matching</Button>} />
      </main>
    );
  }
  if (state.key !== key) {
    return (
      <main aria-busy="true">
        {header(<h1 role="status" className="mt-6 font-display text-3xl font-bold md:text-5xl">Finding your matches…</h1>)}
        <div className="mx-auto mt-6 grid max-w-6xl gap-4 px-4 md:grid-cols-2"><CardSkeleton /><CardSkeleton /></div>
      </main>
    );
  }
  if (state.failed || !state.result) {
    return (
      <main>
        {header()}
        <StatePanel tone="error" title="We couldn't load your matches" help="Your answers are still here. Please try again." action={<Button onClick={() => { setAttempt((a) => a + 1); setState({ key: "" }); }}>Try again</Button>} />
      </main>
    );
  }

  const cur = profile.budgetCurrency;
  const all = GROUPS.flatMap((g) => state.result!.groups[g]);
  const countryCounts = new Map<string, number>();
  all.forEach((m) => countryCounts.set(countryOf(m), (countryCounts.get(countryOf(m)) ?? 0) + 1));

  const passes = (m: Match) => {
    const s = m.scholarship;
    if (filters.countries.length && !filters.countries.includes(countryOf(m))) return false;
    if (filters.minAmount) {
      // Unpublished amounts: keep full-funding awards, drop the rest.
      if (s.amount === null) {
        if (!s.fullFunding) return false;
      } else {
        const v = toDisplay(s.amount, s.currency, cur);
        if (v === null || v < filters.minAmount) return false;
      }
    }
    if (filters.within) {
      if (!s.deadline) return false;
      const d = daysLeft(s.deadline);
      if (d < 0 || d > filters.within) return false;
    }
    return true;
  };
  const sorter = (a: Match, b: Match) => {
    if (sort === "deadline") {
      // Upcoming first (soonest to latest), then closed, then no deadline published.
      const rank = (m: Match) => {
        const d = m.scholarship.deadline;
        if (!d) return 2;
        return daysLeft(d) >= 0 ? 0 : 1;
      };
      return rank(a) - rank(b) || (a.scholarship.deadline ?? "").localeCompare(b.scholarship.deadline ?? "");
    }
    if (sort === "amount") {
      const v = (m: Match) => (m.scholarship.amount === null ? (m.scholarship.fullFunding ? Infinity : -1) : toDisplay(m.scholarship.amount, m.scholarship.currency, cur) ?? 0);
      return v(b) - v(a);
    }
    if (sort === "country") return countryName(countryOf(a)).localeCompare(countryName(countryOf(b)));
    return 0;
  };
  const shown = Object.fromEntries(GROUPS.map((g) => [g, state.result!.groups[g].filter(passes).sort(sorter)])) as Record<MatchGroup, Match[]>;
  const shownTotal = GROUPS.reduce((n, g) => n + shown[g].length, 0);
  const filterCount = filters.countries.length + (filters.minAmount ? 1 : 0) + (filters.within ? 1 : 0);
  const query = qs;

  const answerChips = [
    `From ${countryName(profile.nationality)}`,
    [profile.studyCity, profile.studyCountry === "ANY" ? "Any country" : countryName(profile.studyCountry)].filter(Boolean).join(", "),
    levelLabel(profile.level),
    draft.f ?? profile.field,
    `${formatMoney(profile.yearlyBudget, cur)} a year`,
  ];

  const panel = (
    <FilterFields filters={filters} setFilters={setFilters} countryCounts={countryCounts} cur={cur} />
  );

  return (
    <main>
      {header(
        <>
        {state.result.total === 0 ? (
          <h1 className="mt-6 font-display text-3xl font-bold md:text-5xl">Your matches</h1>
        ) : (
          <>
            <p className="mt-6 inline-block rounded-full bg-white/50 px-3 py-1 text-sm font-semibold">Good news</p>
            <h1 className="mt-2 font-display text-3xl font-bold md:text-5xl"><span className="font-extrabold">{state.result.total} scholarships</span> matched your profile</h1>
            <p className="mt-2 text-lg">
              {state.result.groups.best_fit.length > 0
                ? `${state.result.groups.best_fit.length} ${state.result.groups.best_fit.length === 1 ? "is a Best fit" : "are a Best fit"}. Start there, deadlines come fast.`
                : "None is a Best fit yet. Start with Worth a try, and check each amount on the official page."}
            </p>
          </>
        )}
        <ul className="mt-4 flex flex-wrap gap-2">
          {answerChips.map((c) => <li key={c} className="rounded-full bg-white px-3 py-2 text-sm font-semibold">{c}</li>)}
        </ul>
        </>,
      )}

      {state.result.total === 0 ? (
        <StatePanel title="No matches yet. Try a higher budget or another country" help="Changing one answer often opens up new scholarships." action={<Button href={editHref}>Edit my answers</Button>} />
      ) : (
        <>
          <div className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
              <nav aria-label="Jump to a group" className="grid grid-cols-4 gap-2">
                {GROUPS.map((g) => (
                  <a key={g} href={`#${g}`} aria-label={`${GROUP_INFO[g].label}, ${shown[g].length}`} className="flex min-h-11 flex-col items-center justify-center rounded-xl border border-border bg-surface px-1 py-2 text-center text-xs font-semibold leading-tight">
                    <span className="font-display text-lg leading-none">{shown[g].length}</span>{GROUP_INFO[g].label}
                  </a>
                ))}
              </nav>
              <div className="flex gap-2">
                <button type="button" onClick={() => setSheetOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-border-strong bg-surface px-4 font-semibold min-[1100px]:hidden">
                  <Filter size={18} /> Filter{filterCount > 0 && <span className="rounded-full bg-coral-700 px-2 text-xs text-white">{filterCount}</span>}
                </button>
                <label className="flex-1">
                  <span className="sr-only">Sort</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-11 w-full rounded-full border-[1.5px] border-border-strong bg-surface px-4 text-base">
                    <option value="best">Sort: Best match</option>
                    <option value="deadline">Deadline: soonest first</option>
                    <option value="amount">Amount: highest first</option>
                    <option value="country">Country: A to Z</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="mx-auto flex max-w-6xl gap-8 px-4 py-6">
            <aside className="hidden w-64 shrink-0 min-[1100px]:block">
              <div className="sticky top-32 rounded-[20px] border border-border bg-surface p-5">
                <h2 className="mb-3 font-display text-xl font-bold">Filter</h2>
                {panel}
                <Button variant="ghost" onClick={() => setFilters(NO_FILTERS)} className="mt-3">Clear</Button>
              </div>
            </aside>
            <div className="flex-1 space-y-10">
              {shownTotal === 0 && (
                <StatePanel title="No matches with these filters" help="Clear a filter to see more." action={<Button variant="secondary" onClick={() => setFilters(NO_FILTERS)}>Clear filters</Button>} />
              )}
              {GROUPS.filter((g) => shown[g].length > 0).map((g) => (
                <section key={g} id={g} aria-labelledby={`h-${g}`} className="scroll-mt-40">
                  <div className="mb-1 flex items-center gap-3">
                    <GroupBadge group={g} />
                    <h2 id={`h-${g}`} className="font-display text-xl font-bold">{shown[g].length} scholarship{shown[g].length === 1 ? "" : "s"}</h2>
                  </div>
                  <p className="mb-4 text-sm text-ink-muted">{GROUP_INFO[g].blurb}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {shown[g].map((m) => <MatchCard key={m.scholarship.id} match={m} currency={cur} query={query} />)}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </>
      )}
      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onClear={() => setFilters(NO_FILTERS)} count={shownTotal}>{panel}</FilterSheet>
    </main>
  );
}

function FilterFields({ filters, setFilters, countryCounts, cur }: { filters: Filters; setFilters: (f: Filters) => void; countryCounts: Map<string, number>; cur: string }) {
  const toggle = (c: string) => setFilters({ ...filters, countries: filters.countries.includes(c) ? filters.countries.filter((x) => x !== c) : [...filters.countries, c] });
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 font-semibold">Country</legend>
        {[...countryCounts].map(([c, n]) => (
          <label key={c} className="flex min-h-11 items-center gap-3">
            <input type="checkbox" checked={filters.countries.includes(c)} onChange={() => toggle(c)} className="h-5 w-5 accent-coral-700" />
            <span className="flex-1">{countryName(c)}</span><span className="text-sm text-ink-muted">{n}</span>
          </label>
        ))}
      </fieldset>
      <label className="block">
        <span className="mb-1 block font-semibold">Amount a year</span>
        <select value={filters.minAmount} onChange={(e) => setFilters({ ...filters, minAmount: Number(e.target.value) })} className="min-h-11 w-full rounded-xl border-[1.5px] border-border-strong bg-surface px-3 text-base">
          <option value={0}>Any amount</option>
          {[2000, 5000, 10000].map((v) => <option key={v} value={v}>{formatMoney(v, cur)} or more</option>)}
        </select>
      </label>
      <fieldset>
        <legend className="mb-2 font-semibold">Deadline</legend>
        {[[0, "Any time"], [30, "Within 30 days"], [90, "Within 90 days"]].map(([v, l]) => (
          <label key={v} className="flex min-h-11 items-center gap-3">
            <input type="radio" name="deadline" checked={filters.within === v} onChange={() => setFilters({ ...filters, within: v as number })} className="h-5 w-5 accent-coral-700" />{l}
          </label>
        ))}
      </fieldset>
    </div>
  );
}

function FilterSheet({ open, onClose, onClear, count, children }: { open: boolean; onClose: () => void; onClear: () => void; count: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} aria-label="Filter matches" className="m-0 mt-auto w-full max-w-none rounded-t-[28px] bg-surface p-5 shadow-(--shadow-lg) backdrop:bg-ink/40 min-[1100px]:hidden">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Filter</h2>
        <button type="button" onClick={onClose} aria-label="Close filters" className="grid h-11 w-11 place-items-center rounded-full"><Close /></button>
      </div>
      {children}
      <div className="mt-5 flex gap-3">
        <Button variant="secondary" onClick={onClear}>Clear</Button>
        <Button onClick={onClose} className="flex-1">Show {count} matches</Button>
      </div>
    </dialog>
  );
}

export function ResultsFallback() {
  return (
    <main aria-busy="true">
      <div className="rounded-b-[28px] bg-(image:--gradient-soft) px-4 pb-8 pt-4"><Skeleton className="h-10 w-64" /></div>
      <div className="mx-auto mt-6 grid max-w-6xl gap-4 px-4 md:grid-cols-2"><CardSkeleton /><CardSkeleton /></div>
    </main>
  );
}
