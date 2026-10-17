# Substance — product and redesign plan

## Product direction

Continue the current React/TypeScript/Vite application and 373-record attributed index. The homepage becomes a compact use-history workbench, not a landing page or long explainer. Keep the detailed inputs and transparent arithmetic users liked; make optional information easy to find without forcing it onto every screen.

## Calculator and evidence

- Retain multiple substance periods, current age, duration, frequency, optional amount and user-entered unit, multi-select reported routes, and explicitly marked overlapping period pairs. Keep the 12-period session cap, unit-preserving per-period math, exact-name interaction rules, and in-memory-only history.
- Show the core fields first. Move amount, route, and past-period age context into a clearly named “More details” disclosure in each period. Put one formula note beside the results rather than repeating paragraphs in every card.
- Add a narrow summary rail for the period/substance counts and the requested life-years question. State “Individual years of life lost: not estimable from this history.” A collapsed population-evidence note may cite the NSW opioid agonist treatment cohort’s roughly 15-year group-average life-expectancy difference, with its specific cohort/time/place and an explicit warning that it is not a personal forecast or transferable to other substances. Do not calculate or display a personal life-years estimate.
- Keep health-outcome claims tied to the model or source that supports them. The bundled PsychonautWiki snapshot supplies names, classes, source links, and reported routes; it is not health-outcome or dose-response data. Continue to identify all unsupported combinations as “not assessed,” not safe.
- Continue to link WHO ASSIST and NIDA TAPS without reproducing or rescoring them. Keep user data in component memory only.

## Information architecture and interaction

- Replace the large hero, three-number promo strip, left section rail, and separate “can/cannot” essay with a compact header and direct calculator title.
- Put one slim, high-contrast emergency strip before the calculator; show the immediate action in the strip and keep source/treatment details available on demand.
- Use a desktop two-zone workbench: calculator editor in the main column and a quiet, sticky summary rail. Stack the rail after the heading on mobile.
- Keep duration and typical frequency visible on each period. Place optional amount/unit, routes, and age context behind native accessible disclosures. Show results as a restrained per-period ledger row. Keep marked co-use warnings visible and source-linked.
- Keep the 373-record directory, search, multi-select class/route filters, route descriptions, and add-to-calculator action, but collapse the large filter arrays until requested. Consolidate citations and lengthy limitations into one closed-by-default evidence disclosure. Remove repeated explanatory copy and decorative icon clutter; do not remove citations or urgent instructions.
- No accounts, server, database, analytics, remote fonts, decorative stock art, or persistent use-history storage. Keep the single `/` route and port 3000.

## Project structure

- `src/App.tsx`: compact header, emergency-first shell, calculator/library navigation, and main workbench.
- `src/components/UseHistoryCalculator.tsx`: period editor, progressive disclosures, calculation rows, and explicit overlap review.
- `src/components/CalculationSummary.tsx`: period/substance counts and the population-versus-personal life-years note.
- `src/components/EmergencyPanel.tsx`: concise first response instruction plus optional support details.
- `src/components/SubstanceDirectory.tsx`: searchable 373-record index with collapsed multi-select filters and source detail.
- `src/components/SourceNotes.tsx`: single evidence/method disclosure and nearby source links.
- `src/data/substances.json`, `src/types/`, `src/lib/`, and `scripts/`: preserve attributed source snapshot, types, unit-preserving arithmetic, narrow interaction rules, updater, and regression checks.
- `src/index.css`: replace the current spacing-heavy system with the new compact editorial workbench; keep responsive and reduced-motion behavior.
- `docs/`: concise attribution and evidence scope notes.

## Design

Three possible directions: **independent science periodical** (0.08), **library-card ledger** (0.06), and **1970s clinical form** (0.04). Chosen: the independent science periodical, with the precision of a printed field record and the informality of a small editorial desk—not a generic SaaS dashboard.

- **Design Movement:** Late-20th-century independent science magazine and Swiss editorial information design, translated into a printed use-history ledger.
- **Core Principles:** Compact over spacious; authored typography over decoration; details on demand; every number traceable to inputs or a named source.
- **Color Philosophy:** Chalk paper and near-black ink for a tactile, quiet base. Burnt vermilion marks periods and wayfinding; muted blue-green marks evidence links. Emergency red remains reserved for immediate danger. No gradients, glows, or status colors that imply a risk score.
- **Layout Paradigm:** A short top masthead, one strong emergency line, then an offset two-column workbench with the period editor beside a narrow results margin. No splash page, oversized hero, full-height side menu, or three-metric banner. On phones, the summary follows the title and the form becomes a single readable column.
- **Signature Elements:** Marginal period numbers in vermilion; fine ink rules that organize data like a ledger; a small square index mark in the wordmark.
- **Interaction Philosophy:** Fast keyboard-friendly search, short forms first, optional fields one click away, live per-period results, and overlap warnings that stay conspicuous when selected. No data persistence or score theatrics.
- **Animation:** Nearly still: 100–140 ms color/underline changes, no entrance choreography or pulsing. Honor `prefers-reduced-motion`.
- **Typography System:** Georgia/Palatino system serif for display and record titles; system sans for forms and body copy; system monospace only for dates, periods, and numeric readouts. No remote font requests.
- **Brand Essence:** A careful record of substance-use history that shows its arithmetic without impersonating a clinician. Personality: candid, crafted, composed.
- **Brand Voice:** Plain, specific, and never promotional. Example lines: “One period for each pattern.” “Years lost: not estimable from this record.”
- **Wordmark & Logo:** “SUBSTANCE / USE LEDGER” beside a bespoke three-rule index mark with a single vermilion registration square; no brain, atom, waveform, or medical-cross cliché.
- **Signature Brand Color:** Burnt vermilion, used sparingly for index numbers and active marks.
