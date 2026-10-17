# Substance — implementation and design plan

## Product direction

Continue from the existing `meth-pad-architect` React/TypeScript/Vite site. Make the primary experience a multi-substance use-history calculator backed by a broad searchable substance index. Let a visitor describe distinct periods for multiple substances, then return transparent arithmetic summaries and only source-backed co-use warnings. The app must not convert user-entered history into invented addiction, brain-age, recovery, lifespan, or overdose probabilities.

## Calculator behavior and scientific limits

- Allow an optional current age and up to 12 use-period entries in one in-memory profile. Each period references a substance from the indexed dataset and records its duration, whether that pattern is ongoing, optional age at start for a past period, usual occasions per week, optional amount per occasion and its original unit, and one or more source-reported routes. A second entry for the same substance represents a changed period or pattern.
- Calculate approximate occasions as duration in years × 365.2425/7 weeks per year × entered average occasions per week. Calculate approximate cumulative reported amount as occasions × entered average amount per occasion only when all inputs and a unit are supplied. Keep results per period and in their original units. Never add quantities across substances or periods or convert mg, g, mcg, mL, tablets, or user-labeled units.
- Label these as user-history arithmetic, not toxicology, dependence, safe-use advice or predicted health outcomes. State that totals assume the entered average pattern remained typical for the entire period; users with changed patterns should enter separate periods. For an ongoing period, optionally derive age at start as current age minus duration; for a past period, treat entered age at start as user-provided. Missing or invalid values produce no estimate rather than a guess.
- Let users explicitly mark which substance-period pairs overlapped. Run only the narrowly sourced interaction rules against those marked pairs. Do not let age, dose, frequency, route or duration modify a warning or create a risk multiplier.
- Link to validated screening resources such as WHO ASSIST and NIDA TAPS with their clinical-use, substance-coverage and diagnostic limits. Do not reproduce or alter a clinical screening instrument unless its intended setting and reuse terms are verified. Screening categories are not individual outcome probabilities or diagnoses.
- No user-entered history is transmitted or persisted. Keep it in component memory, with a visible clear-all control and privacy explanation. Do not save it to localStorage, a database, or analytics.

## Evidence and data strategy

- Keep the checked-in, attributed PsychonautWiki semantic snapshot as the searchable index (currently 373 source records). It provides names, source links, class labels and reported routes; it does not provide a validated cross-substance dose-response model. Do not imply that an index entry's community metadata is clinically verified.
- Keep dose and duration data user-entered and unsourced; do not import dose guidance, onset, duration or potency tables as calculator coefficients. Route labels remain descriptive, not ranked or recommended. Maintain the 1,3-Butanediol quarantine and update-time schema/ID checks.
- Use WHO ASSIST and NIDA TAPS only as cited links/reference pathways unless exact intended-use and reuse conditions are satisfied. Explain that screening is not diagnosis and that TAPS performance differs by substance.
- Every interaction finding has a source, exact match criteria and a stated gap. Where no validated model covers the requested personal estimate, say it is not estimable from this calculator rather than fabricating a number. Keep emergency guidance prominent and independent of calculations.

## Stack and serving

Use the current React 18 + TypeScript + Vite static application, native CSS editorial system and pinned lockfile. No managed server or database is needed. The application uses an in-memory history model and the bundled index. The developer preview listens on port 3000; `/manus-routes.json` declares the single `/` route. Keep external source links visible and browser-facing URLs relative.

## Project structure

- `src/App.tsx`: site shell, emergency-first messaging, primary calculator and navigation.
- `src/components/UseHistoryCalculator.tsx`: multi-substance period editor, pairwise overlap selection and calculation/result cards.
- `src/components/EmergencyPanel.tsx`: emergency signs, immediate action and clearly labeled US helpline.
- `src/components/SubstanceDirectory.tsx`: searchable index and descriptive routes/classes.
- `src/components/SourceNotes.tsx`: dataset attribution, calculation limits and validated-screening links.
- `src/data/substances.json`: attributed, versioned static source snapshot.
- `src/lib/history-calculations.ts`: pure, unit-preserving arithmetic for use periods; never a clinical probability model.
- `src/lib/interaction-checker.ts`: small source-linked rules matched only to explicitly supported entries and co-use pairs.
- `src/types/`: typed index, exposure-period, history and warning records.
- `src/index.css`: responsive calculator form/result states using the existing editorial design language.
- `scripts/`: constrained dataset refresh plus regression checks for arithmetic and interaction boundaries.
- `docs/`: data provenance, calculator assumptions and scientific scope.

## Design

Three alternative directions were considered: **Swiss public-health field guide** (0.08), **warm library index cards** (0.06), and **dark laboratory terminal** (0.04). Chosen: the **Swiss public-health field guide**, a quiet editorial style that makes sources, user-provided data and uncertainty easy to distinguish while keeping urgent information highly legible.

- **Design Movement:** Swiss editorial information design translated into a contemporary public-health field guide.
- **Core Principles:** The calculator is the main task; emergency guidance stays prominent; computed values show their inputs and assumptions; content works at mobile sizes without dense tables.
- **Color Philosophy:** Warm paper and ink establish a non-alarmist reading surface. Deep pine is the signature focus/brand color. Amber distinguishes uncertainty; clear red is reserved for emergency action and never used as an ungrounded risk grade.
- **Layout Paradigm:** Left-aligned editorial document with a narrow section index and a wide calculator work area; results sit adjacent to their input period on large screens and stack directly below it on mobile.
- **Signature Elements:** Small numbered evidence labels; fine ruled dividers with a green section marker; compact source chips beside calculated and evidence-backed statements.
- **Interaction Philosophy:** Multiple episodes and substances are easy to add/remove within the 12-period cap; inputs are explicit and optional when not needed; route controls are multi-select; clear-all is visible; entries are session-only; no opaque score is shown.
- **Animation:** Minimal and functional: short opacity/height transitions only, no pulsation, simulated neural networks or alarming motion; obey `prefers-reduced-motion`.
- **Typography System:** A legible native sans-serif (Avenir Next/Segoe UI/Arial fallbacks) for interface/body copy, paired with a restrained editorial serif (Iowan Old Style/Palatino/Georgia fallbacks) for display headings; a modest system monospace is reserved for numeric inputs/evidence metadata. Load no third-party font service.
- **Brand Essence:** A careful, source-traced calculator for recording substance-use history without pretending to predict an individual's health outcome. Personality: calm, candid, humane.
- **Brand Voice:** Headlines are direct and nonjudgmental; calls to action point to concrete next steps. Examples: “See what your history adds up to.” “A calculated total is not a health-risk prediction.”
- **Wordmark & Logo:** “SUBSTANCE / FIELD NOTES” with a custom small index-mark of three uneven ruled lines and a numbered source dot; no medical cross or brain icon.
- **Signature Brand Color:** Deep pine, used for source-linked wayfinding and the primary mark.
