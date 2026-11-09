import { Suspense } from "react";
import { FindFlow } from "@/components/FindFlow";
import { Skeleton } from "@/components/Skeleton";

export const metadata = { title: "Tell us about you · Tuitionless" };

export default function Find() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-xl space-y-4 px-4 pt-6" aria-busy="true"><Skeleton className="h-8 w-40" /><Skeleton className="h-96 w-full" /></main>}>
      <FindFlow />
    </Suspense>
  );
}
