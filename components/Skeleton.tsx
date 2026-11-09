export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-[#F6E6DE] motion-reduce:animate-none ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-surface p-5">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-[52px] w-full rounded-full" />
    </div>
  );
}
