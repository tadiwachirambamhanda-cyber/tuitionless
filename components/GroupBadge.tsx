import type { MatchGroup } from "@/lib/types";

export const GROUP_INFO: Record<MatchGroup, { label: string; cls: string; dot: string; blurb: string }> = {
  best_fit: { label: "Best fit", cls: "bg-best-bg text-best-fg", dot: "bg-best-fg", blurb: "You can apply, and together with what you can afford, these cover a typical year." },
  worth_a_try: { label: "Worth a try", cls: "bg-worth-bg text-worth-fg", dot: "bg-worth-fg", blurb: "You can apply, but it covers part of your costs, many people apply, or the amount is not published." },
  stretch: { label: "Stretch", cls: "bg-stretch-bg text-stretch-fg", dot: "bg-stretch-fg", blurb: "A long shot: it covers little, or you meet only part of what they ask." },
};

export function GroupBadge({ group, label }: { group: MatchGroup; label?: string }) {
  const g = GROUP_INFO[group];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${g.cls}`}>
      <span className={`h-2 w-2 rounded-full ${g.dot}`} aria-hidden="true" />
      {label ?? g.label}
    </span>
  );
}
