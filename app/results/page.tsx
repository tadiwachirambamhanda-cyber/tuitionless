import { Suspense } from "react";
import { ResultsFallback, ResultsView } from "@/components/ResultsView";

export const metadata = { title: "Your matches · Tuitionless" };

export default function Results() {
  return (
    <Suspense fallback={<ResultsFallback />}>
      <ResultsView />
    </Suspense>
  );
}
