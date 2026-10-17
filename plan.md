# Substance — implementation and design plan

## Product direction

Continue from the existing `meth-pad-architect` React/TypeScript/Vite site. Replace the unsupported individual harm-prediction calculator with an evidence-traced, non-scored harm-reduction guide. Keep an interactive tool, but do not claim to measure brain health, diagnose, predict lifespan or recovery, or calculate a safe amount. The first release should serve as a credible base that can be improved iteratively.

### Evidence and information design

- Remove self-reported dose/year/sex/route multipliers, synthetic recovery curves, PAD/brain-age and DSST estimates, lifespan/life-years-lost forecasts, and visualizations presented as brain/connectome measurements. Those outputs are not validated for these inputs; the cited fMRI study reports group-level associations from imaging data rather than an individual prediction from a web form.
- Avoid dose recommendations, use planning, route rankings, onset/duration comparisons, clearance countdowns, a dose log, or an individual numeric risk score.
- Build a searchable broad substance index from PsychonautWiki's public semantic data/API where fields can be verified. Retain only factual directory metadata needed for browsing (name, class/category, reported routes and a source link); do not ingest dose guidance or user experiences. Omit common-name aliases because a source sample contains a likely mismapping. Attribute the source and its CC BY 4.0 semantic-data license, include a snapshot/review date, and explain that community-curated records are not clinical consensus. Do not bulk copy the TripSit repository unless explicit reuse permission is established.
- Make route labels useful for filtering and reference, not recommendations: do not order routes by speed/potency or imply that any route is safe. Multiple selected route filters and multiple selected substances are allowed when useful.
- Replace numeric prediction with transparent, non-scored, rule-based interaction warnings only for explicitly named substances supported by an official or peer-reviewed source. Match against a small reviewed set of named entries rather than broad community class labels (which can contain antagonists such as naloxone). A missing rule must say evidence is insufficient; it must never imply a combination is safe. Distinguish observed co-involvement from causal interaction. The checker is educational, incomplete, and not a substitute for checking prescription labels or urgent clinical advice.
- Put emergency guidance and the local emergency-number prompt first, with a US SAMHSA support link as a clearly labeled US-specific resource. Do not collect personal health or usage data; selected items remain transient in the browser. Include nonjudgmental language and plain limitations throughout.
- Scientific coverage is improved by traceability, correct population-level interpretation and honest uncertainty, not by inventing a new clinical score. The result is educational general information, not medical advice or a clinician-reviewed device.

### Data strategy

PsychonautWiki states that semantic data are reusable under CC BY 4.0 with attribution and most content is CC BY-SA 4.0. Use only semantic fields and attribution; link users to each source. Generate a checked-in static data snapshot so the site works without an API request or user-data transfer. Keep an update script and a compact source/attribution note with the source endpoint, license, extraction policy and update date. Validate API field shapes and stable IDs before extracting. Leave any unavailable or ambiguous field blank rather than infer it; quarantine the known 1,3-Butanediol class/route mismatch until reviewed. TripSit data do not show an explicit repository license, so do not copy its dataset.

### Stack and serving

Use the existing React 18 + TypeScript + Vite foundation with a native CSS editorial system; upgrade Vite to a patched release and remove unused Tailwind/PostCSS dependencies. The site is a static client-side app and does not need a managed server or database: no accounts, server-side health data or persistence are planned. Keep choices in ephemeral component state only. Use links to CDC, NIAAA, NIDA, SAMHSA and original research alongside the source dataset. No generated decorative imagery is needed for this information tool.

## Project structure

- `src/App.tsx`: application shell, section navigation and in-memory state for filters/selections.
- `src/components/`: emergency/support panel, directory search/filter, detail/source panel and interaction checker; reuse or refactor existing components as appropriate.
- `src/data/`: checked-in attributed substance metadata and separately curated, source-cited interaction rules.
- `src/lib/`: pure filtering and evidence-rule matching (qualitative results only; no numeric risk model).
- `src/types/`: explicit source/evidence/license and directory record types.
- `src/index.css`: responsive editorial design tokens, accessible focus states and reduced-motion behavior.
- `public/manus-routes.json`: complete static route manifest (single-page `/`).
- `scripts/`: repeatable, constrained dataset refresh/validation script; no dosage fields are emitted.
- `docs/`: source notes, update date and dataset attribution.

## Design

Three alternative directions were considered: **Swiss public-health field guide** (0.08), **warm library index cards** (0.06), and **dark laboratory terminal** (0.04). Chosen: the **Swiss public-health field guide**, a quiet editorial style that makes sources and uncertainty easy to see and keeps urgent information highly legible.

- **Design Movement:** Swiss editorial information design translated into a contemporary public-health field guide.
- **Core Principles:** Urgent guidance has unmistakable priority; evidence and uncertainty sit beside each claim; navigation stays calm and predictable; content works at mobile sizes without dense tables.
- **Color Philosophy:** Warm paper and ink establish a non-alarmist reading surface. Deep pine is the signature focus/brand color. Amber distinguishes caution; clear red is reserved for emergency action and never used as an ungrounded risk grade.
- **Layout Paradigm:** Left-aligned editorial document with a narrow section index, a wide reading column, and an adjacent source rail on large screens; stacks into a readable single column on mobile instead of centering a dashboard grid.
- **Signature Elements:** Small numbered evidence labels; fine ruled dividers with a green section marker; compact source chips that expose the original citation.
- **Interaction Philosophy:** Search is immediate, filters are multi-select and clearly removable, selections never persist, and every interaction communicates scope without assigning the visitor a score.
- **Animation:** Minimal and functional: short opacity/height transitions only, no pulsation, simulated neural networks or alarming motion; obey `prefers-reduced-motion`.
- **Typography System:** A legible native sans-serif (Avenir Next/Segoe UI/Arial fallbacks) for interface/body copy, paired with a restrained editorial serif (Iowan Old Style/Palatino/Georgia fallbacks) for the main display title; a modest system monospace is reserved for evidence metadata. Load no third-party font service so the site does not send visitors' requests to an extra provider.
- **Brand Essence:** A careful, source-traced guide to substance health information that replaces invented certainty with honest evidence. Personality: calm, candid, humane.
- **Brand Voice:** Headlines are direct and nonjudgmental; calls to action point to concrete next steps. Examples: “Get help now if someone is unresponsive.” “This information can’t tell you that a combination is safe.”
- **Wordmark & Logo:** “SUBSTANCE / FIELD NOTES” with a custom small index-mark of three uneven ruled lines and a numbered source dot; no medical cross or brain icon.
- **Signature Brand Color:** Deep pine, used for source-linked wayfinding and the primary mark.

## Main interactions

A prominent emergency/support view is available first. The directory can be searched across the imported substance names, filtered by category and by multiple reported route labels, and opened to see its source. Multiple substances may be selected together for a non-scored interaction check. Only explicit, source-backed warnings are shown; all other pairs receive a clear “not enough evidence here to assess; not a declaration of safety” result. The interface shows source quality/context where available and does not produce an individual health prediction.
