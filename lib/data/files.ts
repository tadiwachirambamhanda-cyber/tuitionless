import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { CountryCost, Scholarship } from "../types";
import { countryCostSchema, scholarshipSchema } from "./schemas";

export interface LoadedData {
  scholarships: Scholarship[];
  costs: CountryCost[];
  errors: string[];
}

function readJson(file: string, errors: string[]): unknown {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    errors.push(`${path.relative(process.cwd(), file)}: not valid JSON (${(e as Error).message})`);
    return undefined;
  }
}

function checkList<T>(file: string, raw: unknown, schema: z.ZodType<T>, errors: string[]): T[] {
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) {
    errors.push(`${path.relative(process.cwd(), file)}: must be a JSON array`);
    return [];
  }
  const out: T[] = [];
  raw.forEach((item, i) => {
    const r = schema.safeParse(item);
    if (r.success) out.push(r.data);
    else {
      const label = (item as { id?: string; country?: string })?.id ?? (item as { country?: string })?.country ?? `#${i}`;
      for (const issue of r.error.issues) {
        errors.push(`${path.relative(process.cwd(), file)} [${label}] ${issue.path.join(".") || "(record)"}: ${issue.message}`);
      }
    }
  });
  return out;
}

export function loadDataFolder(dataDir: string): LoadedData {
  const errors: string[] = [];
  const scholarships: Scholarship[] = [];
  const dir = path.join(dataDir, "scholarships");
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    const full = path.join(dir, f);
    scholarships.push(...checkList(full, readJson(full, errors), scholarshipSchema, errors));
  }

  const seen = new Map<string, number>();
  for (const s of scholarships) seen.set(s.id, (seen.get(s.id) ?? 0) + 1);
  for (const [id, n] of seen) if (n > 1) errors.push(`duplicate scholarship id "${id}" appears ${n} times`);

  const costFile = path.join(dataDir, "country-costs.json");
  const costs = checkList(costFile, readJson(costFile, errors), countryCostSchema, errors);
  const seenC = new Map<string, number>();
  for (const c of costs) seenC.set(c.country, (seenC.get(c.country) ?? 0) + 1);
  for (const [c, n] of seenC) if (n > 1) errors.push(`duplicate country "${c}" in country-costs.json (${n} times)`);

  return { scholarships, costs, errors };
}
