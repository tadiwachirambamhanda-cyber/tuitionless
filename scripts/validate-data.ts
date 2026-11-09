import path from "node:path";
import { loadDataFolder } from "../lib/data/files";

const { scholarships, costs, errors } = loadDataFolder(path.join(process.cwd(), "data"));

if (errors.length > 0) {
  console.error(`Data check FAILED with ${errors.length} problem(s):`);
  for (const e of errors) console.error(` - ${e}`);
  process.exit(1);
}
console.log(`Data OK: ${scholarships.length} scholarships, ${costs.length} country costs.`);
