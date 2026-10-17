import assert from 'node:assert/strict';
import dataset from '../src/data/substances.json' with { type: 'json' };
import { getInteractionFindings, hasUnassessedCombination } from '../src/lib/interaction-checker.ts';

const byName = new Map(dataset.records.map((record) => [record.name.toLowerCase(), record]));
function records(...names) {
  return names.map((name) => {
    const record = byName.get(name.toLowerCase());
    assert.ok(record, `Expected source record: ${name}`);
    return record;
  });
}

const alcoholMorphine = records('Alcohol', 'Morphine');
assert.deepEqual(getInteractionFindings(alcoholMorphine).map((finding) => finding.id), ['alcohol-opioids']);

const alcoholAlprazolam = records('Alcohol', 'Alprazolam');
assert.deepEqual(getInteractionFindings(alcoholAlprazolam).map((finding) => finding.id), ['alcohol-benzodiazepines']);

const alcoholNaloxone = records('Alcohol', 'Naloxone');
assert.deepEqual(getInteractionFindings(alcoholNaloxone), [], 'Naloxone must not be treated as a respiratory-depressant opioid');
assert.equal(hasUnassessedCombination(alcoholNaloxone, []), true, 'No warning is an unassessed result, not a clearance');

const alcoholCocaine = records('Alcohol', 'Cocaine');
assert.deepEqual(getInteractionFindings(alcoholCocaine), []);
assert.equal(hasUnassessedCombination(alcoholCocaine, []), true);

const threeSelected = records('Alcohol', 'Morphine', 'Alprazolam');
assert.deepEqual(new Set(getInteractionFindings(threeSelected).map((finding) => finding.id)), new Set(['alcohol-opioids', 'alcohol-benzodiazepines']));

const oneSelected = records('Alcohol');
assert.deepEqual(getInteractionFindings(oneSelected), []);
assert.equal(hasUnassessedCombination(oneSelected, []), false);

const quarantined = byName.get('1,3-butanediol');
assert.ok(quarantined);
assert.deepEqual(quarantined.chemicalClasses, []);
assert.deepEqual(quarantined.psychoactiveClasses, []);
assert.deepEqual(quarantined.reportedRoutes, []);

console.log('Safety-rule regression checks passed (6 scenarios plus metadata quarantine).');
