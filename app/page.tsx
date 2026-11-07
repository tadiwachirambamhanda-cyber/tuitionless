import { Suspense } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { GroupBadge } from "@/components/GroupBadge";
import { ArrowRight, Check, CheckCircle, Globe } from "@/components/icons";
import { Skeleton } from "@/components/Skeleton";
import { getCounts } from "@/lib/client/matches";

const STEPS = [
  ["Tell us about you", "Five questions, one at a time: where you're from, where you want to study, your level, your field and what you can afford a year."],
  ["See your matches", "Grouped as Best fit, Worth a try and Stretch, each with the amount, the deadline and why it matched you."],
  ["Apply on the official site", "Open any scholarship to read what it covers and who can apply, then go straight to the provider's page."],
];

function Stats() {
  const counts = getCounts();
  if (!counts) {
    return (
      <div className="rounded-[20px] border border-border bg-surface p-5 text-center shadow-(--shadow-sm)">
        <p className="font-display text-xl font-bold">We&apos;re adding scholarships every week</p>
        <p className="text-ink-muted">Start matching to see what fits you today.</p>
      </div>
    );
  }
  const items = [[`${counts.scholarships}+`, "scholarships", "each checked on its official page"], [`${counts.countries}+`, "study countries", "plus awards you can use anywhere"]];
  return (
    <>
      {items.map(([n, t, d]) => (
        <div key={t} className="flex items-center gap-4 rounded-[20px] border border-border bg-surface p-5 shadow-(--shadow-sm)">
          <span className="font-display text-4xl font-extrabold text-brand-text">{n}</span>
          <span><span className="block font-bold">{t}</span><span className="text-sm text-ink-muted">{d}</span></span>
        </div>
      ))}
    </>
  );
}

export default function Home() {
  return (
    <main>
      <section className="rounded-b-[28px] bg-(image:--gradient-hero) px-4 pb-24 pt-2 lg:rounded-b-[48px]">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <Logo onHero />
            <a href="#how" className="inline-flex min-h-11 items-center font-semibold underline">How it works</a>
          </div>
          <div className="mt-6 grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-semibold"><Globe size={16} /> Free for students from every country</p>
              <h1 className="mt-4 font-display text-4xl font-extrabold lg:text-6xl">Find scholarships you can actually apply for.</h1>
              <p className="mt-4 text-lg">Answer 5 quick questions. We match you by your nationality, where you want to study and what you can afford a year, then tell you why each one fits.</p>
              <Button variant="primaryOnHero" href="/find" className="mt-6 w-full sm:w-auto">Start matching <ArrowRight size={18} /></Button>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                {["No sign-up", "About 1 minute", "Links to official sites"].map((t) => <li key={t} className="flex items-center gap-1"><Check size={16} />{t}</li>)}
              </ul>
            </div>
            <div aria-hidden="true" className="rounded-[20px] bg-surface p-5 shadow-(--shadow-lg) lg:rotate-[-2deg]">
              <div className="flex items-center justify-between"><GroupBadge group="best_fit" /><span className="text-sm text-ink-muted">Germany</span></div>
              <p className="mt-3 font-display text-xl font-bold">Rhine Future Scholars Award</p>
              <p className="text-sm text-ink-muted">Sample Foundation</p>
              <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-surface-muted p-4">
                <div><p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Amount</p><p className="font-display text-2xl font-bold">$11,880</p><p className="text-sm text-ink-muted">a year · €11,000</p></div>
                <div><p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">Deadline</p><p className="font-display text-2xl font-bold">15 Jan</p><p className="text-sm text-ink-muted">2027</p></div>
              </div>
              <p className="mt-3 flex gap-2 text-sm"><span className="text-best-fg"><CheckCircle size={18} /></span>Open to Nigerian students. Covers masters in Germany, up to €11,000 a year.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto -mt-12 grid max-w-6xl gap-4 px-4 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-24" />}><Stats /></Suspense>
      </div>

      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-bold uppercase tracking-[0.06em] text-brand-text">How it works</p>
        <h2 className="mt-2 font-display text-3xl font-bold md:text-5xl">Three steps to your matches</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="rounded-[20px] border border-border bg-surface p-6 shadow-(--shadow-sm)">
              <h3 className="font-display text-xl font-bold"><span className="text-brand-text">{i + 1}</span> {t}</h3>
              <p className="mt-2 text-ink-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>
      <footer className="mx-auto max-w-6xl px-4 pb-12">
        <p className="font-bold">Tuitionless</p>
        <p className="text-ink-muted">Free to use. We don&apos;t save your answers. Always check the details on each scholarship&apos;s official page before you apply.</p>
      </footer>
    </main>
  );
}
