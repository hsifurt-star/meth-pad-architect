# Data sources, calculation method and limits

## PsychonautWiki substance index

The bundled directory is a static snapshot of PsychonautWiki's public GraphQL semantic data at `https://api.psychonautwiki.org/`. The snapshot contains substance names, source-page URLs, chemical/psychoactive class labels, and reported route labels only. The refresh query deliberately does not request dose guidance, duration, onset, potency, effects or user-experience fields. Common-name aliases are omitted because a source sample contained a likely mismatch. One record, 1,3-Butanediol, is retained by name and page link but its upstream class and route labels are quarantined because they conflict with the substance name. The refresh script enforces this exception until a human reviews a source correction.

PsychonautWiki's [copyright policy](https://psychonautwiki.org/wiki/Copyrights) says its semantic data may be used by anyone for any purpose when properly attributed, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribution: “Substance names, class metadata, and reported route labels adapted from PsychonautWiki semantic data. Used under CC BY 4.0 with attribution; no endorsement implied.” The source pages are linked record by record. This is a community-curated index, not a regulatory or clinical drug reference. Missing fields mean “not listed in this snapshot,” not “does not exist” or “safe.”

To refresh the local snapshot, run `npm run data:refresh`. Review the resulting `src/data/substances.json` diff; the updater requests only the metadata described above. Do not bulk import TripSit data unless explicit reuse terms are established.

## User-history arithmetic

The calculator supports up to 12 periods in one in-memory profile so multi-period co-use review remains manageable. Each period represents one typical use pattern for one indexed substance. If the amount or frequency changed, record separate periods rather than applying a new average to the entire history. Periods may have age/duration context, average occasions per week, optional amount per occasion in the user's entered unit, and one or more reported route labels.

For a period with the required numeric entries, the displayed arithmetic is:

- Approximate occasions = duration in years × 365.2425/7 weeks per year × average occasions per week.
- Approximate reported amount = approximate occasions × average amount per occasion, kept in that same entered unit.
- For an ongoing period only, approximate age at period start = current age − duration. For a past period, age at start is user-entered and is not inferred from population evidence.

The total assumes that the entered average amount and frequency remained typical for the whole period. It is an approximate sum of user-entered quantities—not a toxicology calculation, dependence score, safe-use guide, or estimate of health effects. The app does not convert units or add amounts across substances or separate periods. Routes do not modify any formula. Missing or invalid inputs do not produce a guessed total.

## Interaction warnings

The checker has only two focused rules, matched by exact record name rather than community-curated pharmacology classes: alcohol with NIAAA-named opioids (buprenorphine, fentanyl, hydrocodone, methadone, morphine, oxycodone), and alcohol with NIAAA-named benzodiazepines (alprazolam, clonazepam, diazepam, lorazepam, temazepam). A visitor must explicitly mark a pair of periods as overlapping before the rule is displayed. Naloxone and other class members not explicitly listed do not trigger the opioid rule. The supporting source is the [National Institute on Alcohol Abuse and Alcoholism (NIAAA)](https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/alcohol-medication-interactions-potentially-dangerous-mixes). These rules are intentionally narrow. A pair without a warning is unassessed, not cleared or safe; this is not a prescription-medication interaction checker.

For stimulant-overdose emergencies, the [CDC stimulant guide](https://www.cdc.gov/overdose-prevention/media/pdfs/2024/03/CDC-Stimulant-Guide.pdf) says to call emergency services when overdose is suspected; if opioids could be involved, administer naloxone and start rescue breathing. Follow local dispatcher instructions. The [CDC polysubstance overview](https://www.cdc.gov/overdose-prevention/about/polysubstance-overdose.html) discusses co-involvement in overdose deaths; surveillance data do not establish an individual outcome or a specific pharmacological interaction.

## Screening resources (not embedded or re-scored here)

The [WHO ASSIST manual](https://www.who.int/publications/i/item/978924159938-2) describes a substance-involvement screening tool intended to help identify risks and support intervention/referral in primary and general health-care settings. Its categories are not personal outcome probabilities.

The [NIDA TAPS page](https://nida.nih.gov/taps2/) describes a two-stage screen: past-year use frequency followed by substance-specific assessment. NIDA lists risk categories of 0 (no use in past 3 months), 1 (problem use), and 2+ (higher risk). NIDA says the tool should be used under medical-provider supervision and is not intended for self-diagnosis or treatment decisions; its stated sensitivity differs by substance, with additional assessment advised for substances other than tobacco, alcohol and marijuana at a score of 1+.

A [TAPS validation study in community pharmacies](https://pmc.ncbi.nlm.nih.gov/articles/PMC8712403/) included 1,523 adults filling opioid prescriptions at 19 pharmacies in Ohio and Indiana and compared TAPS with ASSIST risk categories. Performance varied by substance and threshold. This narrow validation does not support a universal probability model that combines arbitrary substances, doses, routes, age and years of use. The website links to these tools but does not reproduce or alter their questionnaires or output a diagnosis.

## Privacy and support

No account or server is required. Age and use history exist only in browser page memory; they are not sent to the application server, saved in local storage, or retained after leaving or refreshing the page. “Clear all history” removes the active profile from the page.

The [SAMHSA National Helpline](https://www.samhsa.gov/find-help/national-helpline) is a U.S.-specific, free, confidential, 24/7 treatment-referral and information service in English and Spanish: 1-800-662-HELP (4357). It is not an emergency line and does not provide crisis counseling. Elsewhere, contact local medical or public-health services.

## General limits

Source-backed content was checked against the linked public-health sources on 2026-10-17; this is a source check, not clinician or regulatory review. The app is educational and has not been clinically reviewed. It cannot diagnose, recommend a dose, verify substance contents, identify a safe combination, or predict an individual's addiction probability, brain health, impairment, recovery or lifespan. If a requested personal health estimate is not supported by a validated model for the exact inputs and setting, it is not estimable from this calculator.
