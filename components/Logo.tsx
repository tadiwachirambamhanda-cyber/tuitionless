import Link from "next/link";

// Logo C: spark in a round tile, "less" in brand coral (dark on the hero, where coral text would disappear).
export function Logo({ onHero = false }: { onHero?: boolean }) {
  return (
    <Link href="/" aria-label="Tuitionless home" className="inline-flex min-h-11 items-center gap-2 rounded-lg">
      <span className={`grid h-8 w-8 place-items-center rounded-full text-white ${onHero ? "bg-ink" : "bg-(image:--gradient-action)"}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2 14.2 9.8 22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
        </svg>
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-ink">
        Tuition<span className={onHero ? "" : "text-brand-text"}>less</span>
      </span>
    </Link>
  );
}
