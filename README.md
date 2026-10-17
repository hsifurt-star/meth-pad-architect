# Substance Field Guide

A static, evidence-traced harm-reduction reference built from the existing `meth-pad-architect` React/TypeScript project. It replaces unsupported individualized brain-age, cognitive-score, lifespan, and recovery predictions with emergency guidance, a broad searchable substance directory, and a narrow source-linked interaction checker.

## Start locally

```sh
npm ci
npm run dev
```

Create a production build with `npm run build`. The site is client-only: no account, application server, database, or server-side storage is used. Substance selections exist only in page memory and are not persisted.

Run `npm run test:safety` to check the explicit interaction matching cases, including the naloxone exclusion and the unassessed-result behavior.

## Substance index and attribution

The checked-in `src/data/substances.json` snapshot currently contains 373 records. It is generated from the PsychonautWiki public GraphQL API by `npm run data:refresh`. The query requests only substance names, page URLs, source class labels, and reported route labels. It intentionally omits dose, onset, duration, potency, and user-experience content. A common-name alias field was excluded after source data review found a likely mismapping.

PsychonautWiki states that its **semantic data** may be reused under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) with attribution. The directory links every entry to its source and displays the attribution, license, and retrieval date. Data is community-curated, can be incomplete or incorrect, and is not clinical consensus. A reported route is a descriptive label, not a recommendation or a statement that any route is safe. See [docs/sources-and-method.md](docs/sources-and-method.md).

TripSit data is not copied into this project because the repository does not state a clear reuse license. Future source additions should receive the same attribution and field-level review.

## Interaction checker and limitations

The checker currently contains two narrow, exact-name rules supported by NIAAA: alcohol with six opioids named on the cited page (buprenorphine, fentanyl, hydrocodone, methadone, morphine, oxycodone), and alcohol with five named benzodiazepines (alprazolam, clonazepam, diazepam, lorazepam, temazepam). It does not infer respiratory risk from a broad community class (for example, naloxone is not treated as a respiratory-depressant opioid). This is not an exhaustive interaction checker or a personal risk estimate. A missing rule means “not assessed here,” never “safe.” Prescription and non-prescription medication questions should be checked against official product information and with a pharmacist or clinician.

Emergency information links to CDC guidance. U.S. treatment-referral information links to SAMHSA's National Helpline. Source pages were last checked on 2026-10-17; that is not a clinical review. The site is educational and cannot diagnose, recommend a dose, verify substance contents, or predict an individual's brain health, impairment, recovery, or lifespan. It has not been clinically reviewed.

## Evidence source highlights

- [PsychonautWiki copyright and reuse terms](https://psychonautwiki.org/wiki/Copyrights)
- [NIAAA alcohol–medication interactions](https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/alcohol-medication-interactions-potentially-dangerous-mixes)
- [CDC polysubstance overdose overview](https://www.cdc.gov/overdose-prevention/about/polysubstance-overdose.html)
- [CDC stimulant overdose guide](https://www.cdc.gov/overdose-prevention/media/pdfs/2024/03/CDC-Stimulant-Guide.pdf)
- [NIDA methamphetamine overview](https://nida.nih.gov/research-topics/methamphetamine)
- [SAMHSA National Helpline](https://www.samhsa.gov/find-help/national-helpline)
