import { Suspense } from "react";
import { DetailView } from "@/components/DetailView";
import { Skeleton } from "@/components/Skeleton";

export const metadata = { title: "Scholarship · Tuitionless" };

async function Detail({ params }: { params: PageProps<"/scholarships/[id]">["params"] }) {
  const { id } = await params;
  return (
    <Suspense fallback={null}>
      <DetailView id={id} />
    </Suspense>
  );
}

export default function ScholarshipDetail(props: PageProps<"/scholarships/[id]">) {
  return (
    <Suspense fallback={<main aria-busy="true" className="mx-auto max-w-5xl space-y-4 px-4 pt-6"><Skeleton className="h-64 w-full" /></main>}>
      <Detail params={props.params} />
    </Suspense>
  );
}
