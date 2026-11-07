import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { countryCostToRow, scholarshipToRow } from "../lib/data/load";
import { loadDataFolder } from "../lib/data/files";
import { createServiceClient } from "../lib/supabase/server";

loadEnvConfig(process.cwd());

async function main() {
  const { scholarships, costs, errors } = loadDataFolder(path.join(process.cwd(), "data"));
  if (errors.length > 0) {
    console.error(`Not seeding: ${errors.length} data problem(s). Run validate-data for details.`);
    for (const e of errors) console.error(` - ${e}`);
    process.exit(1);
  }
  const db = createServiceClient();
  if (scholarships.length > 0) {
    const { error } = await db.from("scholarships").upsert(scholarships.map(scholarshipToRow));
    if (error) throw new Error(`scholarships upsert failed: ${error.message}`);
  }
  if (costs.length > 0) {
    const { error } = await db.from("country_costs").upsert(costs.map(countryCostToRow));
    if (error) throw new Error(`country_costs upsert failed: ${error.message}`);
  }
  console.log(`Seeded ${scholarships.length} scholarships and ${costs.length} country costs.`);
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exit(1);
});
