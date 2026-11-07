# Tuitionless design handoff (Option B: warm, mobile-first)

For: the coding agent building Lane B in Next.js 16 + Tailwind 4. From: the design lane. Date: 2026-11-07.

## What is in this folder

| File | What it is |
|---|---|
| `tokens.css` | Source of truth for colour, type, spacing, radius, shadow and motion. Exact values below. |
| `landing.html` | `/` prototype. States: Default, Empty (no figures yet), Loading, Error. |
| `find.html` | `/find` prototype. States: Step 1 (empty), Steps 2 to 5, Error: answer missing, Error: search failed, Loading (finding matches). |
| `results.html` | `/results` prototype. States: Default, Filter sheet open (mobile), Loading, Empty, Error. |
| `detail.html` | `/scholarships/[id]` prototype. States: Default, Empty (details not published), Loading, Error (not found). |
| `screenshots/` | PNGs rendered in headless Chrome. Every screen at 390 and 1440 wide, plus every state at 390. |

Open any `.html` file in a browser. The dark bar at the top is a **prototype-only state switcher**: do not build it. You can also open a state directly, e.g. `results.html?state=empty` (`&shot=1` hides the bar).
Each file is self-contained: the tokens and shared component CSS are copied into its `<style>`. Only the Google Fonts link is external.

All names, providers, amounts and deadlines are **fictional** sample content (student: Nigerian, masters in computer science, Munich, Germany, $4,000 a year). Today in the mock-ups is 7 Nov 2026. Currency conversion uses 1 EUR = 1.08 USD for the mock-ups only.

## 1. Tokens (exact values)

Put these in the theme. Suggested Tailwind 4 mapping (send the `app/globals.css` change to the Chief Architect; Lane B may not edit it):

```css
@theme {
  --color-bg: #FFF7F2;  --color-surface: #FFFFFF;  --color-surface-muted: #FFF0E8;
  --color-ink: #2A1712; --color-ink-muted: #6B524B; --color-brand: #B8371F;
  /* ...one line per colour token below... */
  --font-display: var(--font-bricolage); --font-sans: var(--font-jakarta);
  --radius-card: 20px; --radius-panel: 28px;
}
```

### Colour

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--gradient-hero` | `linear-gradient(135deg, #FF7A5C 0%, #FF9055 55%, #FFA24C 100%)` | Landing hero, results summary, detail header. **Dark ink text only** on it. | ink on #FF7A5C 6.66:1 |
| `--gradient-action` | `linear-gradient(135deg, #CF3B2C 0%, #BF4A0A 100%)` | Primary buttons, progress bar, selected tick | white on stops 4.87 / 5.00:1 |
| `--gradient-action-hover` | `linear-gradient(135deg, #B8331F 0%, #A84006 100%)` | Primary hover | |
| `--gradient-soft` | `linear-gradient(180deg, #FFE9DF 0%, #FFF7F2 100%)` | `/find` background, skeleton hero | |
| `--color-bg` | `#FFF7F2` | Page background (warm cream) | |
| `--color-surface` | `#FFFFFF` | Cards, inputs, sheets | |
| `--color-surface-muted` | `#FFF0E8` | Chips, icon tiles, notes | |
| `--color-border` | `#F1DDD3` | Card hairlines (decorative) | |
| `--color-border-strong` | `#A3887F` | Input and secondary button borders | 3.2:1 on white (non-text AA) |
| `--color-ink` | `#2A1712` | Headings, body | 16.1:1 on cream |
| `--color-ink-muted` | `#6B524B` | Secondary text | 6.76:1 on cream, 7.16:1 on white |
| `--color-brand-text` | `#B8371F` | Links, eyebrows, step count, icons | 5.50:1 on cream |
| `--color-primary-on-hero` | `#2A1712` | The primary button when it sits on the hero gradient (landing) | white text 16:1 |
| `--color-coral-500` / `--color-orange-400` | `#FF7A5C` / `#FFA24C` | Hero gradient stops (decorative) | |
| `--color-coral-700` / `--color-orange-700` | `#CF3B2C` / `#BF4A0A` | Action gradient stops, checkbox accent | |
| `--color-best-fg` / `--color-best-bg` | `#1E6B45` / `#E6F4EC` | Best fit badge, "why it matched" ticks, success | 5.71:1 |
| `--color-worth-fg` / `--color-worth-bg` | `#8A4B00` / `#FFF1DC` | Worth a try badge; also warning ("24 days left") | 6.11:1 |
| `--color-stretch-fg` / `--color-stretch-bg` | `#6B3FA0` / `#F2EBFB` | Stretch badge | 6.35:1 |
| `--color-error` / `--color-error-bg` | `#B42318` / `#FEECEB` | Error text, invalid borders, alerts | 5.76:1 on bg, 6.57:1 on white |
| `--color-focus` | `#1D4ED8` | Focus ring (`0 0 0 3px #fff, 0 0 0 6px #1D4ED8`) | visible on cream, white and coral |

Never put white text on the bright hero gradient (fails AA). Never put coral (`#FF7A5C`) text on white.

### Type

Fonts, both free via `next/font/google`:
- **Bricolage Grotesque** (display: headings, money figures, counts) weights 600, 700, 800.
- **Plus Jakarta Sans** (body and UI) weights 400, 500, 600, 700.

```ts
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600","700","800"], variable: "--font-bricolage" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-jakarta" });
```

| Token | Size / line height | Use |
|---|---|---|
| `--text-xs` | 12 / 16 | Badges, uppercase labels (AMOUNT, DEADLINE) with `letter-spacing: 0.06em` |
| `--text-sm` | 14 / 20 | Meta, helper text, reasons on cards, chips |
| `--text-base` | 16 / 24 | Body, inputs (never under 16px on inputs: stops iOS zoom) |
| `--text-lg` | 18 / 28 | Button text, step titles |
| `--text-xl` | 20 / 28 | Card titles, panel titles |
| `--text-2xl` | 24 / 32 | Money and date figures on cards, `/find` question (mobile), state titles |
| `--text-3xl` | 30 / 36 | Page titles (mobile), detail figures |
| `--text-4xl` | 38 / 44 | Landing hero (mobile), `/find` question (768+) |
| `--text-5xl` | 48 / 52 | Page titles (768+) |
| `--text-6xl` | 60 / 64 | Landing hero (1024+) |

Display headings: `letter-spacing: -0.02em`, line height 1.1. Hero H1 weight 800, other headings 700.

### Spacing, layout, radius, shadow

- Spacing (4px base): 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 (`--space-1` to `--space-20`).
- Page gutter 16px under 768, 32px from 768. Content max width 1152px (`--container-max`). `/find` column 576px.
- Tap targets: min 44px (`--tap-min`). Buttons and inputs 52px high (`--control-h`).
- Radius: 8 (small), 12 (inputs, option rows), 20 (cards), 28 (hero panels, sheets, bottom corners of hero bands; 48 at 1024+), pill 999 (buttons, chips, badges).
- Shadows (warm tinted): `--shadow-sm` `0 1px 2px rgba(42,23,18,.06), 0 1px 3px rgba(42,23,18,.08)` (cards); `--shadow-md` `0 4px 12px rgba(42,23,18,.08), 0 2px 4px rgba(42,23,18,.05)` (card hover); `--shadow-lg` `0 16px 40px rgba(191,74,10,.16), 0 4px 12px rgba(42,23,18,.08)` (sheet, landing preview); `--shadow-action` `0 6px 16px rgba(207,59,44,.32)` (primary button).
- Motion: 120 / 200 / 320ms, `cubic-bezier(0.22, 1, 0.36, 1)`; all set to 0 under `prefers-reduced-motion`. Skeleton shimmer stops too.

## 2. Reusable components (build these in `components/`)

| Component | Where | Notes |
|---|---|---|
| `Logo` | all | 32px gradient tile with a cap icon + "Tuitionless" (Bricolage 800, 20px). On a hero the tile turns ink. |
| `Button` | all | Variants: `primary` (action gradient, white, pill, 52px), `primaryOnHero` (ink fill, landing only), `secondary` (white, 1.5px `#A3887F` border), `ghost` (text, 44px). Optional leading/trailing icon. Works as `<button>` or `<Link>`. |
| `GroupBadge` | results, detail | `best_fit` → "Best fit" green, `worth_a_try` → "Worth a try" amber, `stretch` → "Stretch" purple. Dot + label, never colour alone. |
| `MatchCard` | results, landing preview | Badge + place, name, provider, a facts box (Amount, Deadline), reason line with tick icon, full-width **View Details** button. See rules below. |
| `MoneyFigure` | card, detail | Student's currency first, big (`formatMoney` from `lib/currency.ts`), then "a year · €11,000" (period + original). If `amount` is null and `fullFunding` → "Full tuition"; if null otherwise → "Not published". `amountPeriod: "total"` → "one payment". |
| `DeadlineFigure` | card, detail | "15 Jan" big, "2027 · 69 days left" small. Under 30 days: amber "24 days left" badge with clock icon. `deadline: null` → "Rolling" or the `deadlineNote`. |
| `StepProgress` | /find | "Step 2 of 5" (brand text, bold) + topic on the right + 5-segment bar. Wrap in `aria-live="polite"`. |
| `AnswerChips` | /find | One chip per earlier answer, each a 44px link back to that step ("change an earlier answer"). |
| `OptionCard` (radio) | /find | 56px row, optional icon tile and sub-label, round tick on the right; selected = coral border, `#FFF3EE` fill, gradient tick. Real `<input type="radio">` inside a `<label>`. |
| `StatePanel` | all | Centred icon tile (warm or error), title, one-sentence help, one primary button. Used for empty and error. |
| `Skeleton` | all | Shimmer blocks in `#F6E6DE → #FCF1EB`, same shapes as the real content. |
| `FilterPanel` | results | Same content as a bottom sheet (< 1100px) and a sticky sidebar card (≥ 1100px). |
| `StickyActionBar` | /find, detail (mobile) | Fixed bottom bar, cream with blur, safe-area padding. Becomes static/inline at 768 (/find) or a sidebar card at 1100 (detail). |

## 3. Screens, parts and states

### `/` landing — primary action: **Start matching**
Parts, top to bottom:
1. Hero band on `--gradient-hero` with the header inside (Logo, "How it works" link).
2. Eyebrow chip "Free for students from every country", H1 "Find scholarships you can actually apply for.", lede, **Start matching** (ink button → `/find`), "How it works" text link, three reassurance ticks (No sign-up, About 1 minute, Links to official sites).
3. Example match card (decorative, `aria-hidden` content, no button so it is not a second action). At 1024+ it sits to the right, rotated -2°.
4. Proof figures: three stat cards overlapping the hero edge ("100+ scholarships", "8+ study countries", "€11k a year from one award"). **Wire these to real counts from the database**; the numbers in the mock-up are placeholders matching the F1 target.
5. How it works: three numbered cards. 6. Footer note.

States: **Loading** = skeleton hero (soft gradient) and two skeleton stat cards. **Empty** = counts unavailable: the stat row is replaced by one card "We're adding scholarships every week" (page still works, Start matching stays). **Error** = plain header + StatePanel "This page didn't load" with **Try again**.

### `/find` — primary action: **Next** (last step: **See my matches**)
One question per screen. Layout: Logo, StepProgress, AnswerChips (from step 2), question card (H1 question, help line, control), action bar (Back secondary + Next primary; step 1 has Next only).

| Step | Question | Control |
|---|---|---|
| 1 of 5 Nationality | "Where are you from?" | Search combobox + "Popular" radio list (with flags). Full list filters as you type. |
| 2 of 5 University | "Where is your university?" | Country select (includes "Any country (not decided yet)") + optional City text input. |
| 3 of 5 Level | "What will you study?" | Three OptionCards: Undergraduate, Masters, PhD (maps to `StudyLevel`). |
| 4 of 5 Field | "What's your field?" | 9 radio chips (2 columns mobile, 3 at 768+) incl. "Something else". |
| 5 of 5 Budget | "What can you afford a year?" | Amount (numeric, Bricolage 24px) + currency select, hint, note "We don't save this. It only lives in the link to your results." Button reads **See my matches**. |

States: **Empty** = step 1 with nothing chosen (Next stays enabled; pressing it shows the missing error, never a disabled button). **Error: answer missing** = option borders turn red, message under the control "Choose your level of study to continue." (`role="alert"`, linked by `aria-describedby`), focus moves to the first option. **Error: search failed** = red alert above the card on step 5 "We couldn't finish your search. Your answers are still here…", button becomes **Try again**. **Loading** = spinner, "Finding your matches…", and a 3-row checklist echoing the answers.
Back keeps answers. The profile lives in the URL query (no storage), so the browser Back button also works.

### `/results` — primary action: **View Details** (on each card)
Parts:
1. Summary band on `--gradient-hero` (header inside: Logo + "Edit answers" ghost button). Kicker "Good news", H1 "**8 scholarships** matched your profile", line "3 are a Best fit. Start there, deadlines come fast.", answer chips (From Nigeria, Munich Germany, Masters, Computer science, $4,000 a year).
2. Sticky toolbar: three group tabs with counts (Best fit / Worth a try / Stretch) that jump to the group sections (`aria-current` on the group in view); Filter button (mobile only) with a count bubble when filters are on; Sort select: Best match, Deadline: soonest first, Amount: highest first, Country: A to Z.
3. Groups, in order Best fit, Worth a try, Stretch. Each: badge + "3 scholarships" heading, one-line explanation of the group, MatchCard grid (1 column; 2 columns from 768).
4. At 1100+: left sticky FilterPanel (Country checkboxes with counts, Amount a year select, Deadline radios). Below 1100: the same panel as a bottom sheet with Clear and "Show 8 matches".

Every MatchCard **must** show amount, deadline and the reason without opening it. A group with no matches is hidden from the list and its tab shows 0 and is disabled-looking but still focusable with "0" read out.
States: **Loading** = summary "Finding your matches…" + skeleton cards. **Empty** = StatePanel with the exact text "No matches yet. Try a higher budget or another country", help line, **Edit my answers** (→ `/find` at step 5 with answers kept). **Error** = "We couldn't load your matches" + **Try again**.

### `/scholarships/[id]` — primary action: **Apply on official site**
Parts: top bar ("Back to results" + small logo), header panel on `--gradient-hero` (group badge "Best fit for you", name, provider · country, Amount and Deadline tiles), then cards: **Why it matched you** (green-outlined, ticks built from the match: nationality, place and level, field, budget gap), **What it covers** (green chips for covered, dashed chips for not covered), **Who can apply**, **Key facts** (Where, Level, Field, Provider, Paid), and a source line "Facts checked on 7 Nov 2026 on the provider's own page".
**Apply on official site**: sticky bottom bar on mobile; at 1100+ a sticky right sidebar card repeating amount and deadline above the button. It is an `<a target="_blank" rel="noopener noreferrer">` to `officialUrl`, with an external icon and sr-only "(opens in a new tab)".
States: **Loading** = skeleton header and panel. **Empty** = details not published: "Not published", "Rolling", "The provider hasn't said what this covers. Check the official site." in muted italics; Apply stays. **Error (not found)** = StatePanel "We couldn't find this scholarship" + **Back to results**.
Why it matched needs the student profile: pass the results query string through to the detail link so this page can rebuild the reasons.

## 4. Interaction and accessibility notes

- Exactly one visual primary (gradient or ink button) per view; everything else is secondary, ghost or a text link. On `/results` the repeated View Details is the screen map's primary action; filter and sort stay visibly secondary.
- Tap targets ≥ 44px everywhere (chips, answer chips, tabs, close buttons, checkbox rows). Verified: nothing renders wider than 390 at 390 wide in any state.
- Keyboard: logical DOM order; focus ring `0 0 0 3px #fff, 0 0 0 6px #1D4ED8` on every interactive element (`:focus-visible`). Radios use native inputs (arrow keys move between options). Enter on `/find` = Next. After Next/Back, move focus to the new question's H1 (`tabIndex={-1}`). The filter sheet is a modal dialog: trap focus, Esc closes, return focus to the Filter button.
- Combobox (nationality): `role="combobox"`, `aria-expanded`, `aria-controls` the listbox; arrow keys move, Enter selects.
- Loading regions use `role="status"` / `aria-busy`; errors use `role="alert"`.
- Never colour alone: group badges carry text; deadline-soon badge has a clock icon and "days left".
- Copy: friendly second person. Use "scholarship", "matches", "Best fit", "Worth a try", "Stretch", "what you can afford a year", "View Details", "Apply on official site". Never the forbidden words from the brief.
- Respect `prefers-reduced-motion` (tokens drop to 0ms, shimmer and spinner stop).

## 5. Design choices (short)

- **Two gradients, not one.** The bright coral-to-orange (`#FF7A5C → #FFA24C`) is the mood and only carries dark ink text. Buttons use a deeper coral-to-burnt-orange (`#CF3B2C → #BF4A0A`) so white button text passes AA. On the landing hero the primary is ink so it stands out against the bright gradient.
- **Warm cream page** (`#FFF7F2`) instead of white keeps it friendly; white cards lift off it without heavy shadows.
- **Bricolage Grotesque + Plus Jakarta Sans:** rounded, characterful headings and big money figures (the "big numbers as proof" idea), with a very readable UI face.
- **Group colours** (green, amber, purple) read as "go, maybe, long shot" without using red, which is reserved for errors.
- **Results groups are stacked with jump tabs** rather than hidden tabs, so a student scrolling on a phone sees every group and the counts at once.
- **Answer chips on `/find`** let a student change an earlier answer in one tap while still seeing only one question.

## 6. Things the build should know

- The brief's sample "Northern Lights Master's Grant" is for Sweden, so it cannot match a Germany profile (F3). I left it out of the results mock and used other fictional names (Bavaria Code Talent Stipend, Harbour Light STEM Fellowship, Danube Bridge Mobility Award, Kestrel Computing Futures Prize, Meridian Leaders Scholarship, Alpine Research Starter Grant).
- The brief asked for `.dc.html`; the task asked for plain `.html`, so files are `landing.html`, `find.html`, `results.html`, `detail.html`.
- The current `app/layout.tsx` header (links "Find scholarships", "Results") should be removed or slimmed by the Chief Architect: each screen here owns its own top bar, and the layout fonts should switch from Geist to the two fonts above.
- Landing stat numbers are placeholders until the database has real counts.
