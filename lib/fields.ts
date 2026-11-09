// Shared list of study fields. Owned by the Chief Architect.
// Screens offer exactly these values; scholarship data uses exactly these values in `fields`
// (or "ANY"); the matcher compares them by exact, case-insensitive equality.
export const FIELD_OPTIONS = [
  "Computer science",
  "Engineering",
  "Business and economics",
  "Medicine and health",
  "Natural sciences",
  "Mathematics and statistics",
  "Social sciences",
  "Law and public policy",
  "Arts and humanities",
  "Education",
  "Environment and agriculture",
  "Something else",
] as const;

export type FieldOption = (typeof FIELD_OPTIONS)[number];
