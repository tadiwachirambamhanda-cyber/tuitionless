import { loadScholarship } from "@/lib/data/load";

export async function GET(_request: Request, ctx: RouteContext<"/api/scholarships/[id]">) {
  const { id } = await ctx.params;
  try {
    const scholarship = await loadScholarship(id);
    if (!scholarship) return Response.json({ error: "Scholarship not found." }, { status: 404 });
    return Response.json(scholarship);
  } catch (e) {
    console.error("scholarship load failed:", (e as Error).message);
    return Response.json({ error: "Could not load the scholarship. Please try again." }, { status: 500 });
  }
}
