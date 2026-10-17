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

const missingAmount = calculatePeriod({ ...completePeriod, amountPerOccurrence: null }, 30);
assert.equal(missingAmount.estimatedTotalAmount, null);
assert.equal(missingAmount.amountUnit, null);

const customUnit = calculatePeriod({ ...completePeriod, amountUnit: 'other', customUnitLabel: 'scoops' }, 30);
assert.equal(customUnit.estimatedTotalAmount, 2 * WEEKS_PER_YEAR * 3 * 10);
assert.equal(customUnit.amountUnit, 'other');
assert.equal(customUnit.amountUnitLabel, 'scoops');

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

console.log('History calculation regression checks passed.');
