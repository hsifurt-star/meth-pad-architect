import type { InteractionFinding, SubstanceRecord } from '../types/substance';

const NIAAA = 'https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/alcohol-medication-interactions-potentially-dangerous-mixes';

// Deliberately match only substances specifically named by the cited NIAAA page.
// PsychonautWiki's broad semantic classes include antagonists (e.g. naloxone),
// so those labels must not be treated as evidence of respiratory depression.
const NIAAA_LISTED_OPIOIDS = new Set([
  'buprenorphine',
  'fentanyl',
  'hydrocodone',
  'methadone',
  'morphine',
  'oxycodone',
]);

const NIAAA_LISTED_BENZODIAZEPINES = new Set([
  'alprazolam',
  'clonazepam',
  'diazepam',
  'lorazepam',
  'temazepam',
]);

function isInNamedSet(substance: SubstanceRecord, names: Set<string>): boolean {
  return names.has(substance.name.trim().toLocaleLowerCase('en'));
}

function isAlcohol(substance: SubstanceRecord): boolean {
  return /^(alcohol|ethanol)$/i.test(substance.name.trim());
}

export function getInteractionFindings(selected: SubstanceRecord[]): InteractionFinding[] {
  const alcoholPresent = selected.some(isAlcohol);
  if (!alcoholPresent) return [];

  const findings: InteractionFinding[] = [];
  if (selected.some((substance) => isInNamedSet(substance, NIAAA_LISTED_OPIOIDS))) {
    findings.push({
      id: 'alcohol-opioids',
      title: 'Alcohol + selected opioids: serious breathing risk',
      summary: 'NIAAA says combining alcohol with opioids such as these named medications can further suppress the respiratory system and increase overdose risk. The source describes especially dangerous synergistic effects when alcohol, opioids, and benzodiazepines are combined. This checker cannot estimate an individual’s risk. If someone is hard to wake, breathing slowly or irregularly, or unresponsive, contact emergency services now. If opioid exposure is possible, give naloxone if available and follow the dispatcher’s instructions.',
      level: 'high-concern',
      sourceLabel: 'NIAAA: Alcohol–medication interactions',
      sourceUrl: NIAAA,
    });
  }
  if (selected.some((substance) => isInNamedSet(substance, NIAAA_LISTED_BENZODIAZEPINES))) {
    findings.push({
      id: 'alcohol-benzodiazepines',
      title: 'Alcohol + selected benzodiazepines: sedation and overdose risk',
      summary: 'NIAAA describes additive and possibly synergistic effects on central nervous system function, including increased respiratory-depression, injury, and memory-impairment risks. This is general information for the named substances, not a personal prediction or a complete medication check.',
      level: 'high-concern',
      sourceLabel: 'NIAAA: Alcohol–medication interactions',
      sourceUrl: NIAAA,
    });
  }
  return findings;
}

export function hasUnassessedCombination(selected: SubstanceRecord[], findings: InteractionFinding[]): boolean {
  return selected.length > 1 && findings.length === 0;
}
