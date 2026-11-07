# Research data (Lane C owns this folder)

- `data/scholarships/<country-or-funder>.json`: an array of scholarships in the exact shape of `Scholarship` in `lib/types.ts`.
- `data/country-costs.json`: an array of `CountryCost`.
- Every record needs `officialUrl`, `sourceUrl` and `checkedOn`. Only facts read from the provider's official page. If a fact is not published, use null or an empty list, never a guess.
- Ids: lowercase, hyphenated, unique across all files, e.g. `chevening-uk`.
