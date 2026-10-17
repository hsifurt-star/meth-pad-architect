# Data sources, attribution and limits

## PsychonautWiki substance index

The bundled directory is a static snapshot of PsychonautWiki's public GraphQL semantic data at `https://api.psychonautwiki.org/`. It contains names, source-page URLs, chemical/psychoactive class labels, and reported route labels only. The refresh query deliberately does not request dose, duration, onset, potency, effects, or user-experience fields. Common-name aliases are omitted because a source sample contained an apparent mismatch. One record, 1,3-Butanediol, is retained by name and page link but its upstream class and route labels are quarantined: they conflict with the substance name. The refresh script enforces this exception until a human reviews a source correction. The source currently returns hundreds of records; use the checked-in snapshot count and retrieval time shown in the interface rather than treating a remembered count as permanent.

PsychonautWiki's [copyright policy](https://psychonautwiki.org/wiki/Copyrights) says its semantic data may be used by anyone for any purpose when properly attributed, under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribution: “Substance names, class metadata, and reported route labels adapted from PsychonautWiki semantic data. Used under CC BY 4.0 with attribution; no endorsement implied.” The source pages are linked record by record. The directory is community-curated and is not a regulatory or clinical drug reference. Missing routes/classes mean “not listed in this snapshot,” not “impossible” or “safe.”

To refresh the local snapshot, run `npm run data:refresh`. Review changes and verify the resulting `src/data/substances.json`; the update script only requests the fields described above. Do not bulk import TripSit data unless explicit reuse terms are established.

## Interaction information

The checker has only two focused rules, matched by exact record name rather than community-curated pharmacology classes: alcohol with NIAAA-named opioids (buprenorphine, fentanyl, hydrocodone, methadone, morphine, oxycodone), and alcohol with NIAAA-named benzodiazepines (alprazolam, clonazepam, diazepam, lorazepam, temazepam). Naloxone and other opioid-class records not explicitly listed do not trigger the opioid rule. The supporting source is the [National Institute on Alcohol Abuse and Alcoholism (NIAAA)](https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/alcohol-medication-interactions-potentially-dangerous-mixes). These rules are intentionally narrow. A combination without a warning is unassessed, not cleared or safe; this is not a prescription-medication interaction checker.

For stimulant-overdose emergencies, the [CDC stimulant guide](https://www.cdc.gov/overdose-prevention/media/pdfs/2024/03/CDC-Stimulant-Guide.pdf) says to call emergency services when overdose is suspected; if opioids could be involved, administer naloxone and start rescue breathing. Use local dispatcher instructions. The [CDC polysubstance overview](https://www.cdc.gov/overdose-prevention/about/polysubstance-overdose.html) discusses co-involvement in overdose deaths; those surveillance data do not establish a personal outcome or a specific pharmacological interaction.

## Support links

The [SAMHSA National Helpline](https://www.samhsa.gov/find-help/national-helpline) is a U.S.-specific, free, confidential, 24/7 treatment-referral and information service in English and Spanish: 1-800-662-HELP (4357). It is not an emergency line and does not provide crisis counseling. Elsewhere, contact local medical or public-health services.

## General limits

Source-backed content was checked against the linked public-health sources on 2026-10-17; this is a content-source check, not clinician or regulatory review. This website is educational, not medical advice, diagnosis, a validated clinical screening instrument, or a prediction of brain health, impairment, recovery, or lifespan. It does not identify a safe dose or safe combination. No visitor selections are sent to an application server or saved by the application.
