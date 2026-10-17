# Substance Use History Calculator

A static, calculator-first website built from the existing `meth-pad-architect` React/TypeScript project. It lets visitors add multiple substances and separate use periods, enter current age, duration, average frequency, amount and unit, select reported routes, and mark period pairs that overlapped. Each profile supports up to 12 periods so pairwise review remains manageable. Results are transparent arithmetic summaries for the entered history plus a small number of source-linked co-use warnings.

## Run locally

```sh
npm ci
npm run dev
```

Create a production build with `npm run build`. Run the regression checks with `npm run test:history` and `npm run test:safety`. Refresh the public substance metadata snapshot with `npm run data:refresh` and inspect the resulting diff before accepting it.

The site is client-only: no account, application server, database or analytics is used for calculator entries. Age and use-history data stay in in-memory page state only; refreshing or leaving the page clears them. They are not sent to or persisted by this application.

## What the calculator calculates

For one use period at a time, when the required values are provided:

- Approximate occasions = duration in years × 365.2425/7 weeks per year × entered average occasions per week.
- Approximate reported amount = approximate occasions × entered average amount per occasion, in the same user-entered unit.
- For an ongoing period only, approximate age at the period's start may be shown as current age minus entered duration. For a past period, age at start is user-entered.

These are arithmetic summaries, not toxicology or validated estimates of addiction, overdose, health damage, brain age, recovery or lifespan. They assume the entered average pattern remained typical across the entire period; use separate periods when the pattern changed. No conversions or totals across substances or periods are performed. Age, dose, frequency and route do not change any interaction warning. A missing model result is not evidence of safety.

The site links to WHO ASSIST and NIDA TAPS as validated screening resources; it does not reproduce or modify their questionnaires. These tools have clinical-use and substance-specific limitations and are not diagnoses or individualized outcome probabilities.

## Substance index and attribution

The checked-in `src/data/substances.json` snapshot currently contains 373 records. It is generated from the PsychonautWiki public GraphQL API by `npm run data:refresh`. The query requests substance names, page URLs, source class labels and reported route labels only; dose guidance, onset, duration, potency and user-experience content are deliberately omitted. Common-name aliases were excluded after source review found a likely mismatch.

PsychonautWiki states that its **semantic data** may be reused under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) with attribution. The directory links every entry to its source and displays the attribution, license and retrieval date. Data is community-curated, can be incomplete or incorrect, and is not clinical consensus. A reported route is descriptive, not a recommendation or a statement that any route is safe. See [docs/sources-and-method.md](docs/sources-and-method.md).

TripSit data is not copied because the repository does not state a clear reuse license. Future source additions should receive the same attribution and field-level review.

## Interaction warnings and limits

The checker currently contains two narrow exact-name rules supported by NIAAA: alcohol with six opioids named on the cited page (buprenorphine, fentanyl, hydrocodone, methadone, morphine, oxycodone), and alcohol with five named benzodiazepines (alprazolam, clonazepam, diazepam, lorazepam, temazepam). It runs only when a visitor explicitly marks a period pair as overlapping. It does not infer risk from broad community class labels (for example, naloxone is not treated as a respiratory-depressant opioid). Other pairs are unassessed, not cleared or safe.

Emergency information links to CDC guidance; U.S. treatment-referral information links to SAMHSA's National Helpline. Source pages were checked on 2026-10-18; this is not a clinical review. The site cannot diagnose, recommend a dose, verify substance contents, or predict an individual's health outcome. It has not been clinically reviewed. A cited opioid-treatment cohort result is displayed only as population context, never as a personal years-lost estimate.
