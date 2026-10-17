import assert from 'node:assert/strict';
import { calculatePeriod } from '../src/lib/history-calculations.ts';

const WEEKS_PER_YEAR = 365.2425 / 7;

const completePeriod = {
  id: 'period-1',
  substanceId: 'example-substance',
  durationYears: 2,
  activeNow: true,
  ageAtStart: null,
  occasionsPerWeek: 3,
  amountPerOccurrence: 10,
  amountUnit: 'mg',
  customUnitLabel: '',
  routes: ['oral'],
};

const completeCalculation = calculatePeriod(completePeriod, 30);
assert.equal(completeCalculation.durationYears, 2);
assert.equal(completeCalculation.estimatedOccasions, 2 * WEEKS_PER_YEAR * 3);
assert.equal(completeCalculation.estimatedTotalAmount, 2 * WEEKS_PER_YEAR * 3 * 10);
assert.equal(completeCalculation.amountUnit, 'mg');
assert.equal(completeCalculation.amountUnitLabel, null);

const missingUnit = calculatePeriod({ ...completePeriod, amountUnit: '' }, 30);
assert.equal(missingUnit.estimatedTotalAmount, null);
assert.equal(missingUnit.amountUnit, null);

const amountNotEntered = calculatePeriod({ ...completePeriod, amountPerOccurrence: null, amountUnit: '' }, 30);
assert.equal(amountNotEntered.estimatedTotalAmount, null);
assert.ok(!amountNotEntered.messages.some((message) => message.includes('Select an amount unit')));

const missingAmount = calculatePeriod({ ...completePeriod, amountPerOccurrence: null }, 30);
assert.equal(missingAmount.estimatedTotalAmount, null);
assert.equal(missingAmount.amountUnit, null);

const customUnit = calculatePeriod({ ...completePeriod, amountUnit: 'other', customUnitLabel: 'scoops' }, 30);
assert.equal(customUnit.estimatedTotalAmount, 2 * WEEKS_PER_YEAR * 3 * 10);
assert.equal(customUnit.amountUnit, 'other');
assert.equal(customUnit.amountUnitLabel, 'scoops');

const tooLongCustomUnit = calculatePeriod({ ...completePeriod, amountUnit: 'other', customUnitLabel: 'x'.repeat(21) }, 30);
assert.equal(tooLongCustomUnit.estimatedTotalAmount, null);
assert.ok(tooLongCustomUnit.messages.some((message) => message.includes('1–20 characters')));

const missingCustomUnitLabel = calculatePeriod({ ...completePeriod, amountUnit: 'other', customUnitLabel: '' }, 30);
assert.equal(missingCustomUnitLabel.estimatedTotalAmount, null);
assert.equal(missingCustomUnitLabel.amountUnit, null);
assert.equal(missingCustomUnitLabel.amountUnitLabel, null);

for (const invalidValue of [-1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
  const invalidCalculation = calculatePeriod(
    {
      ...completePeriod,
      durationYears: invalidValue,
      occasionsPerWeek: invalidValue,
      amountPerOccurrence: invalidValue,
    },
    invalidValue,
  );
  assert.equal(invalidCalculation.durationYears, null);
  assert.equal(invalidCalculation.estimatedOccasions, null);
  assert.equal(invalidCalculation.estimatedTotalAmount, null);
  assert.equal(invalidCalculation.estimatedAgeAtStart, null);
  assert.ok(invalidCalculation.messages.length > 0);
}

for (const invalidAge of [0, 120.5, 121]) {
  const result = calculatePeriod(completePeriod, invalidAge);
  assert.equal(result.estimatedAgeAtStart, null);
  assert.ok(result.messages.some((message) => message.includes('whole number between 1 and 120')));
}

for (const validAge of [1, 120]) {
  const result = calculatePeriod({ ...completePeriod, durationYears: 0 }, validAge);
  assert.equal(result.estimatedAgeAtStart, validAge);
}

const invalidDuration = calculatePeriod({ ...completePeriod, durationYears: 120.1 }, 30);
assert.equal(invalidDuration.durationYears, null);
assert.equal(invalidDuration.estimatedOccasions, null);
assert.equal(invalidDuration.estimatedTotalAmount, null);
assert.ok(invalidDuration.messages.some((message) => message.includes('between 0 and 120')));

const maximumDuration = calculatePeriod({ ...completePeriod, durationYears: 120 }, 120);
assert.equal(maximumDuration.durationYears, 120);
assert.equal(maximumDuration.estimatedAgeAtStart, 0);

const invalidFrequency = calculatePeriod({ ...completePeriod, occasionsPerWeek: 1000.1 }, 30);
assert.equal(invalidFrequency.estimatedOccasions, null);
assert.equal(invalidFrequency.estimatedTotalAmount, null);
assert.ok(invalidFrequency.messages.some((message) => message.includes('between 0 and 1000')));

const maximumFrequency = calculatePeriod({ ...completePeriod, occasionsPerWeek: 1000 }, 30);
assert.equal(maximumFrequency.estimatedOccasions, 2 * WEEKS_PER_YEAR * 1000);

const invalidPastStartAge = calculatePeriod({ ...completePeriod, activeNow: false, ageAtStart: 121 }, 30);
assert.equal(invalidPastStartAge.estimatedAgeAtStart, null);
assert.ok(invalidPastStartAge.messages.some((message) => message.includes('between 0 and 120')));

const minimumPastStartAge = calculatePeriod({ ...completePeriod, activeNow: false, ageAtStart: 0 }, 30);
assert.equal(minimumPastStartAge.estimatedAgeAtStart, 0);

const invalidNegativeStart = calculatePeriod({ ...completePeriod, durationYears: 10 }, 5);
assert.equal(invalidNegativeStart.estimatedAgeAtStart, null);
assert.ok(invalidNegativeStart.messages.some((message) => message.includes('cannot be negative')));

const overflow = calculatePeriod({ ...completePeriod, amountPerOccurrence: Number.MAX_VALUE }, 30);
assert.equal(overflow.estimatedTotalAmount, null);
assert.ok(overflow.messages.some((message) => message.includes('cannot be represented as a finite number')));

assert.equal(calculatePeriod(completePeriod, 30).estimatedAgeAtStart, 28);
assert.equal(
  calculatePeriod({ ...completePeriod, activeNow: false, ageAtStart: 19 }, 30).estimatedAgeAtStart,
  19,
);

const routeIndependent = calculatePeriod({ ...completePeriod, routes: ['inhaled', 'other'] }, 30);
assert.deepEqual(routeIndependent, completeCalculation);

const zeroDuration = calculatePeriod({ ...completePeriod, durationYears: 0 }, 30);
assert.equal(zeroDuration.durationYears, 0);
assert.equal(zeroDuration.estimatedOccasions, 0);
assert.equal(zeroDuration.estimatedTotalAmount, 0);
assert.equal(zeroDuration.amountUnit, 'mg');

console.log('History calculation regression checks passed (bounds, units, and arithmetic).');
