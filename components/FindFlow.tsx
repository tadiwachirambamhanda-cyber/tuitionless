"use client";

import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { StepProgress } from "./StepProgress";
import { ArrowLeft, ArrowRight, Check, Search } from "./icons";
import {
  COUNTRY_CODES, CURRENCIES, FIELDS, LEVELS, POPULAR_NATIONALITIES, TOTAL_STEPS,
  countryName, draftToQuery, flag, levelLabel, readDraft, type Draft,
} from "@/lib/client/profile";

const QUESTIONS = ["Where are you from?", "Where is your university?", "What will you study?", "What's your field?", "What can you afford a year?"];
const HELP = [
  "Pick the country on your passport. Many scholarships are only open to certain nationalities.",
  "Choose the country, and a city if you know it.",
  "Pick the level you are studying or about to start.",
  "Pick the closest match.",
  "Scholarships that pay part of your costs can still fit.",
];
const MISSING = [
  "Choose your nationality to continue.",
  "Choose the country of your university to continue.",
  "Choose your level of study to continue.",
  "Choose your field to continue.",
  "Enter what you can afford a year, for example 4000.",
];

function OptionRow({ name, value, checked, onChange, label, icon, sub, invalid, describedBy }: {
  name: string; value: string; checked: boolean; onChange: () => void; label: string; icon?: string; sub?: string; invalid: boolean; describedBy?: string;
}) {
  return (
    <label className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-2 ${checked ? "border-coral-700 bg-[#FFF3EE]" : invalid ? "border-error bg-surface" : "border-border bg-surface"} has-[:focus-visible]:shadow-(--focus-ring)`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} aria-describedby={describedBy} className="sr-only" />
      {icon && <span className="text-2xl" aria-hidden="true">{icon}</span>}
      <span className="flex-1">
        <span className="block font-semibold">{label}</span>
        {sub && <span className="block text-sm text-ink-muted">{sub}</span>}
      </span>
      <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${checked ? "border-transparent bg-(image:--gradient-action) text-white" : "border-border-strong"}`} aria-hidden="true">
        {checked && <Check size={14} />}
      </span>
    </label>
  );
}

export function FindFlow() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();
  const draft = useMemo(() => readDraft(new URLSearchParams(sp.toString())), [sp]);
  const stepRaw = Number(sp.get("step") ?? 1);
  const step = Number.isInteger(stepRaw) && stepRaw >= 1 && stepRaw <= TOTAL_STEPS ? stepRaw : 1;

  return <StepForm key={step + "|" + sp.toString()} step={step} draft={draft} pending={pending} go={(d, nextStep) => {
    const q = draftToQuery(d, nextStep ? { step: String(nextStep) } : {});
    startTransition(() => {
      if (nextStep) router.push(`/find?${q}`);
      else router.push(`/results?${q}`);
    });
  }} />;
}

function StepForm({ step, draft, pending, go }: { step: number; draft: Draft; pending: boolean; go: (d: Draft, nextStep: number | null) => void }) {
  const [local, setLocal] = useState<Draft>(draft);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const h1 = useRef<HTMLHeadingElement>(null);
  const errId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { h1.current?.focus(); }, []);

  const set = (patch: Draft) => { setLocal((l) => ({ ...l, ...patch })); setError(false); };

  const valid = () => {
    switch (step) {
      case 1: return !!local.n;
      case 2: return !!local.c;
      case 3: return !!local.l;
      case 4: return !!local.f;
      default: { const b = Number(local.b); return local.b !== undefined && local.b !== "" && Number.isFinite(b) && b >= 0; }
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid()) {
      setError(true);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("input, select")?.focus());
      return;
    }
    const merged: Draft = { ...local, cur: local.cur ?? "USD" };
    go(merged, step < TOTAL_STEPS ? step + 1 : null);
  };
  const back = () => go(local, step - 1);

  const chips: { label: string; step: number }[] = [];
  if (step > 1 && draft.n) chips.push({ label: `From ${countryName(draft.n)}`, step: 1 });
  if (step > 2 && draft.c) chips.push({ label: [draft.city, draft.c === "ANY" ? "Any country" : countryName(draft.c)].filter(Boolean).join(", "), step: 2 });
  if (step > 3 && draft.l) chips.push({ label: levelLabel(draft.l as never), step: 3 });
  if (step > 4 && draft.f) chips.push({ label: draft.f, step: 4 });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? COUNTRY_CODES.filter((c) => countryName(c).toLowerCase().includes(q)) : POPULAR_NATIONALITIES;
  }, [query]);

  if (pending && step === TOTAL_STEPS) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4 text-center" role="status">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-coral-700 motion-reduce:animate-none" aria-hidden="true" />
        <h1 className="font-display text-2xl font-bold">Finding your matches…</h1>
        <ul className="text-ink-muted">
          <li>{local.n ? `From ${countryName(local.n)}` : ""}</li>
          <li>{local.c ? `Studying in ${countryName(local.c)}` : ""}</li>
          <li>{local.b} {local.cur ?? "USD"} a year</li>
        </ul>
      </main>
    );
  }

  const invalid = error;
  return (
    <main className="min-h-dvh bg-(image:--gradient-soft)">
      <form ref={formRef} onSubmit={submit} noValidate className="mx-auto flex min-h-dvh max-w-xl flex-col px-4 pt-2 md:px-0 md:pt-4">
        <Logo />
        <div className="mt-2"><StepProgress step={step} /></div>
        {chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Your earlier answers. Select one to change it.">
            {chips.map((c) => (
              <li key={c.step}>
                <button type="button" onClick={() => go(local, c.step)} className="min-h-11 rounded-full bg-surface-muted px-4 text-sm font-semibold text-ink hover:bg-[#FFE3D6]">{c.label}</button>
              </li>
            ))}
          </ul>
        )}
        <section className="mt-4 rounded-[28px] bg-surface p-6 shadow-(--shadow-sm)">
          <h1 ref={h1} tabIndex={-1} className="font-display text-2xl font-bold outline-none md:text-4xl">{QUESTIONS[step - 1]}</h1>
          <p className="mt-2 text-ink-muted">{HELP[step - 1]}</p>
          <div className="mt-5 flex flex-col gap-3">
            {step === 1 && (
              <>
                <label className="relative block">
                  <span className="sr-only">Search for a country. The list below filters as you type.</span>
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"><Search /></span>
                  <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Start typing a country"
                    className="min-h-[52px] w-full rounded-xl border-[1.5px] border-border-strong bg-surface pl-12 pr-4 text-base" />
                </label>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">{query ? "Results" : "Popular"}</p>
                <div id="nat-list" role="radiogroup" aria-label="Nationality" className="flex flex-col gap-3">
                  {filtered.length === 0 && <p className="text-ink-muted">No country found. Try another spelling.</p>}
                  {filtered.map((c) => (
                    <OptionRow key={c} name="n" value={c} checked={local.n === c} onChange={() => set({ n: c })} label={countryName(c)} icon={flag(c)} invalid={invalid} describedBy={invalid ? errId : undefined} />
                  ))}
                  {local.n && !filtered.includes(local.n as never) && (
                    <OptionRow name="n" value={local.n} checked onChange={() => {}} label={countryName(local.n)} icon={flag(local.n)} invalid={false} />
                  )}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <label className="block">
                  <span className="mb-1 block font-semibold">Country</span>
                  <select value={local.c ?? ""} onChange={(e) => set({ c: e.target.value })} aria-invalid={invalid || undefined} aria-describedby={invalid ? errId : undefined}
                    className={`min-h-[52px] w-full rounded-xl border-[1.5px] bg-surface px-4 text-base ${invalid ? "border-error" : "border-border-strong"}`}>
                    <option value="" disabled>Choose a country</option>
                    <option value="ANY">Any country (not decided yet)</option>
                    {[...COUNTRY_CODES].sort((a, b) => countryName(a).localeCompare(countryName(b))).map((c) => <option key={c} value={c}>{countryName(c)}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block font-semibold">City <span className="font-normal text-ink-muted">(optional)</span></span>
                  <input type="text" value={local.city ?? ""} onChange={(e) => set({ city: e.target.value })} placeholder="For example Munich"
                    className="min-h-[52px] w-full rounded-xl border-[1.5px] border-border-strong bg-surface px-4 text-base" />
                </label>
              </>
            )}
            {step === 3 && (
              <div role="radiogroup" aria-label="Level of study" className="flex flex-col gap-3">
                {LEVELS.map((l) => (
                  <OptionRow key={l.value} name="l" value={l.value} checked={local.l === l.value} onChange={() => set({ l: l.value })} label={l.label} sub={l.sub} invalid={invalid} describedBy={invalid ? errId : undefined} />
                ))}
              </div>
            )}
            {step === 4 && (
              <div role="radiogroup" aria-label="Field of study" className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {FIELDS.map((f) => (
                  <OptionRow key={f} name="f" value={f} checked={local.f === f} onChange={() => set({ f })} label={f} invalid={invalid} describedBy={invalid ? errId : undefined} />
                ))}
              </div>
            )}
            {step === 5 && (
              <>
                <div className="flex gap-3">
                  <label className="flex-1">
                    <span className="mb-1 block font-semibold">Amount a year</span>
                    <input inputMode="numeric" pattern="[0-9]*" value={local.b ?? ""} onChange={(e) => set({ b: e.target.value.split(/[.,]/)[0].replace(/[^0-9]/g, "") })} placeholder="4000"
                      aria-invalid={invalid || undefined} aria-describedby={invalid ? errId : undefined}
                      className={`min-h-[52px] w-full rounded-xl border-[1.5px] bg-surface px-4 font-display text-2xl font-bold ${invalid ? "border-error" : "border-border-strong"}`} />
                  </label>
                  <label>
                    <span className="mb-1 block font-semibold">Currency</span>
                    <select value={local.cur ?? "USD"} onChange={(e) => set({ cur: e.target.value })} className="min-h-[52px] rounded-xl border-[1.5px] border-border-strong bg-surface px-3 text-base">
                      {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                </div>
                <p className="rounded-xl bg-surface-muted p-3 text-sm text-ink-muted">We don&apos;t save this. It only lives in the link to your results.</p>
              </>
            )}
            {invalid && <p id={errId} role="alert" className="font-semibold text-error">{MISSING[step - 1]}</p>}
          </div>
        </section>
        <div className="sticky bottom-0 mt-auto flex gap-3 border-t border-border bg-bg/90 px-0 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur md:static md:border-0 md:bg-transparent">
          {step > 1 && <Button variant="secondary" onClick={back} aria-label="Back"><ArrowLeft size={18} /> Back</Button>}
          <Button variant="primary" type="submit" className="flex-1">
            {step === TOTAL_STEPS ? "See my matches" : "Next"} <ArrowRight size={18} />
          </Button>
        </div>
      </form>
    </main>
  );
}
