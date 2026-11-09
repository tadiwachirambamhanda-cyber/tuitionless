import { loadCountryCosts, loadScholarships } from "@/lib/data/load";
import { studentProfileSchema } from "@/lib/data/schemas";
import { matchScholarships } from "@/lib/matching";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = studentProfileSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
      .join("; ");
    return Response.json({ error: `Invalid profile. ${message}` }, { status: 400 });
  }

  try {
    const [scholarships, costs] = await Promise.all([loadScholarships(), loadCountryCosts()]);
    return Response.json(matchScholarships(parsed.data, scholarships, costs));
  } catch (e) {
    console.error("match failed:", (e as Error).message);
    return Response.json({ error: "Could not load scholarships. Please try again." }, { status: 500 });
  }
}
