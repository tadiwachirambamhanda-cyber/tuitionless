import Link from "next/link";
import { Cap } from "./icons";

export function Logo({ onHero = false }: { onHero?: boolean }) {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg">
      <span className={`grid h-8 w-8 place-items-center rounded-[10px] text-white ${onHero ? "bg-ink" : "bg-(image:--gradient-action)"}`}>
        <Cap size={18} />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-ink">Tuitionless</span>
    </Link>
  );
}
