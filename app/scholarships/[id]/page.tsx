import { Suspense } from "react";

async function Detail({ params }: { params: PageProps<"/scholarships/[id]">["params"] }) {
  const { id } = await params;
  return <h1 className="p-4 text-2xl">Scholarship {id} (Lane B builds this)</h1>;
}

export default function ScholarshipDetail(props: PageProps<"/scholarships/[id]">) {
  return (
    <Suspense fallback={<p className="p-4">Loading…</p>}>
      <Detail params={props.params} />
    </Suspense>
  );
}
