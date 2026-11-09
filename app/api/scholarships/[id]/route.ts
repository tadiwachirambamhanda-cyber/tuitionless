import { loadScholarship } from "@/lib/data/load";

export async function GET(_request: Request, ctx: RouteContext<"/api/scholarships/[id]">) {
  const { id } = await ctx.params;
  // Ids are lowercase and hyphenated, so anything else cannot exist: answer without touching the database.
  if (id.length > 200 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    return Response.json({ error: "Scholarship not found." }, { status: 404 });
  }
  try {
    const scholarship = await loadScholarship(id);
    if (!scholarship) return Response.json({ error: "Scholarship not found." }, { status: 404 });
    return Response.json(scholarship);
  } catch (e) {
    console.error("scholarship load failed:", (e as Error).message);
    return Response.json({ error: "Could not load the scholarship. Please try again." }, { status: 500 });
  }
}
