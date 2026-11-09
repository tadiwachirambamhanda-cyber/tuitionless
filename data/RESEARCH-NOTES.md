# Research notes (Lane C)

Checked on 2026-11-07. 119 scholarships across the UK, USA, Canada, Germany, Netherlands, France, Australia, Ireland and Japan, plus global funders. Facts were read from official provider or university pages. Many pages were summarised by the fetch tool rather than read raw, so the owner should spot-check records before launch.

## Removed after review
- OAS Academic Scholarships: the country list was filled in from general knowledge.
- Schwarzman Scholars: level and funding were inferred, not on the page read.

## Skipped because they could not be verified
- Could not open the page: Oxford (Clarendon, Reach Oxford, Rhodes), UCD, Maynooth, Monash, Melbourne, Rotary Peace, Friedrich Ebert, Home Affairs and British Council cost pages.
- Nationality rules unclear or by residence: Mastercard Foundation Scholars (set per partner university; only Berkeley, McGill and Toronto are included), Fulbright Foreign Student Program (per country), Heinrich Böll, Konrad Adenauer, Hanns Seidel, DAAD EPOS, Twente, East-West Center, Davis UWC, Pan African University.
- No country list, amount or dates published: Australia Awards, Destination Australia, IsDB, OPEC Fund, Rosa Luxemburg, UvA Amsterdam Excellence, Manchester, Sussex and Warwick awards, Weidenfeld-Hoffmann.
- Closed or ending: Vanier, Utrecht Excellence 2026-27, ASU Mastercard (Kigali only), Waseda, Sophia, Ritsumeikan, Nagoya.

## Owner should double check
- Nationality is `["ANY"]` where the page names no limit. Weakest cases: Rotary Yoneyama, APU, UTokyo, Keio, Osaka, Hiroshima (Japan), TU Delft and AMU TIGER, and most Australian awards.
- Erasmus Mundus, ADB-Japan and Joint Japan/World Bank have `studyCountries: ["ANY"]` as a placeholder because the page does not list study countries. Erasmus Mundus is really Europe.
- DAAD and several UK, Irish and Dutch awards are by country of residence, not nationality. The closest nationality codes are stored and each record's `eligibilityNotes` says so.
- Region lists (Africa, Latin America, OAS-style groups) were expanded to ISO codes by the researchers; the notes in each record say so.
- Monthly stipends are multiplied by 12 and stored as per year (DAAD, Japan).
- Many deadlines are `null` because the current round had closed or no year was shown. Dates present: Yenching 2026-11-30, Commonwealth Shared and Gates Cambridge 2026-12-08, Eiffel 2027-01-06 (Campus France also quotes 8 Jan), Pearson 2026-11-06 (already passed).
- `studyCities` for some US and Canadian records is the host university's city, not stated on the page.
- Chevening's 199 nationalities come from the page's country selector, not an explicit list.

## Country costs (`country-costs.json`)
Each figure is tuition midpoint plus living cost in local currency; the arithmetic is the researchers' own.
- Weakest: Australia (living figure via a secondary article, tuition is a minimum-fee floor, so understated).
- UK ranges came from search snippets of the British Council page (page blocked).
- Visa proof-of-funds amounts (DE, IE, AU, CA, NL, UK) are minimums, so real living costs are usually higher.
- PhD reuses the masters figure for UK, US, CA, IE, JP, which likely overestimates because many PhDs are funded. Germany ignores Baden-Württemberg's extra non-EU fee.

## Field mapping (round 2)
Every `fields` value is now one of the shared list in `lib/fields.ts`, or `["ANY"]`. Awkward mappings:
- Yenching Academy ("China studies"): Social sciences plus Arts and humanities, since the programme is interdisciplinary.
- Joint Japan/World Bank ("development-related fields"): the page names no discipline, so Social sciences, Business and economics, and Law and public policy are a best fit.
- ADB-Japan: "science and technology" became Natural sciences and Engineering; "development studies" became Social sciences.
- Türkiye Burslari: "basic sciences" became Natural sciences; "arts" joined Arts and humanities.
- AAUW: "technology" became Computer science.
- Fulbright-Nehru: urban and regional planning became Social sciences; sustainable development and environmental science became Environment and agriculture; journalism became Social sciences.
- UCC SEFS: food science became Environment and agriculture.

## Link and study-country follow-ups
- The RMIT Future Leaders links now use https (the https page loads and is the right page).
- Erasmus Mundus `studyCountries` stays `["ANY"]`: the official Erasmus+ page only says each programme involves at least three countries and gives no list, so no verified correction was possible. Use the course catalogue for the real countries.

## Closed rounds (`roundClosed`)
`roundClosed: true` is set on 30 records whose stored note says the current round has closed or its date has passed. Records that only say "likely closed" (Ireland Fellows), have conflicting dates (Fulbright-Nehru), or give no status stay `false`. This goes stale as new rounds open, so it needs rechecking.

## Round 2 (2026-11-10)
Added 51 records (files `*-round2.json`) aimed at thin spots; total now 169. Open-round matches (nationalities NG, IN, KE, PK, BR) rose as follows (before to after): UK PhD 1 to 5, UK undergraduate 3 to 8, Germany PhD 0 to 5, Germany masters 5 to 9, Ireland PhD 0 to 2, Ireland undergraduate 2 to 5, France PhD 1 to 3, Canada masters 2 to 5, US PhD 1 to 2. Netherlands PhD is still 0: Dutch PhDs are mostly paid jobs, and no scholarship open to international candidates could be verified.

Nationality re-check of the 74 `["ANY"]` records: every page was re-read. None listed eligible countries. All stay ANY. Changes: Yenching now excludes CN (international track needs a non-Chinese passport), Hiroshima IGS pre-arrival excludes JP, GRIPS MEXT dropped (no nationality rule could be confirmed and MEXT is limiting that route). Checked-on dates updated.
- ANU International Achievement Award is limited by country of residence (not nationality), which the data cannot express; the record says so.
- Turkiye Burslari: the TR exclusion is not stated on the page read.
- New records that were left out because nationality was not clear: KAS, TUM scholarship (depends on BAföG rules), three Polytechnique bachelor awards, a Reading award with no criteria, Dartmouth (source was a 2022 announcement).
- Region lists expanded to codes by the researchers (check borderline countries): FES (120 codes), KAAD (109), ASU Mastercard (54 African countries), McGill Mastercard (54), Surrey Future Leaders (30). `GB` in excludedNationalities is shorthand for home-fee students at UK universities.
- Yale: aid is need-based, so the amount is null (the page's 75,220 is an average for all aided students).
- Deadlines that the page prints without a year (ASU, Engineering, Manitoba, UAlberta, Villigst) are stored as null with the date in the note, not as a guessed year.

Not changed, because no better official source was found: Australia and UK entries in `country-costs.json` (the Home Affairs and HESA pages blocked the fetch), and Erasmus Mundus `studyCountries` (the official pages give only "at least 3 countries, one in the EU or an associated country: North Macedonia, Serbia, Iceland, Liechtenstein, Norway, Turkiye", not a host list).
