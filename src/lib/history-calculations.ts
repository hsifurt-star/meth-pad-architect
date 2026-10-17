import type { DoseUnit, PeriodCalculation, UsePeriod } from '../types/history.ts';

const WEEKS_PER_YEAR = 365.2425 / 7;
const RECOGNIZED_UNITS: readonly Exclude<DoseUnit, ''>[] = ['mg', 'g', 'mcg', 'mL', 'tablets', 'other'];
const MAX_CUSTOM_UNIT_CHARS = 20;

type NonEmptyDoseUnit = Exclude<DoseUnit, ''>;

export const HISTORY_LIMITS = {
  currentAge: { min: 1, max: 120, integer: true },
  durationYears: { min: 0, max: 120 },
  occasionsPerWeek: { min: 0, max: 1000 },
  ageAtStart: { min: 0, max: 120 },
} as const;

function isFiniteNonNegative(value: number | null): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isWithin(value: number | null, min: number, max: number, integer = false): value is number {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= min
    && value <= max
    && (!integer || Number.isInteger(value));
}

function isRecognizedUnit(unit: DoseUnit): unit is NonEmptyDoseUnit {
  return RECOGNIZED_UNITS.includes(unit as NonEmptyDoseUnit);
}

function addMissingMessage(messages: string[], label: string, value: number | null): void {
  if (value === null) messages.push(`Add ${label} to make the related estimate available.`);
  else if (!Number.isFinite(value)) messages.push(`${label} must be a finite number.`);
}

/**
 * Calculates transparent, unit-preserving estimates for one user-entered use period.
 * Routes are retained as history data but deliberately do not affect these formulas.
 */
export function calculatePeriod(period: UsePeriod, currentAge: number | null): PeriodCalculation {
  const messages: string[] = [];
  const durationInput = period.durationYears;
  const occasionsPerWeekInput = period.occasionsPerWeek;
  const amountPerOccurrenceInput = period.amountPerOccurrence;
  const durationLimit = HISTORY_LIMITS.durationYears;
  const frequencyLimit = HISTORY_LIMITS.occasionsPerWeek;
  const startAgeLimit = HISTORY_LIMITS.ageAtStart;
  const hasDuration = isWithin(durationInput, durationLimit.min, durationLimit.max);
  const hasOccasionsPerWeek = isWithin(occasionsPerWeekInput, frequencyLimit.min, frequencyLimit.max);
  const hasAmountPerOccurrence = isFiniteNonNegative(amountPerOccurrenceInput);
  const hasAmountUnit = isRecognizedUnit(period.amountUnit);
  const customUnit = period.customUnitLabel.trim();
  const hasCustomUnitLabel = customUnit.length > 0 && customUnit.length <= MAX_CUSTOM_UNIT_CHARS;
  const hasUnitForTotal = hasAmountUnit && (period.amountUnit !== 'other' || hasCustomUnitLabel);

  if (durationInput === null) addMissingMessage(messages, 'a duration in years', durationInput);
  else if (!hasDuration) messages.push(`Duration in years must be between ${durationLimit.min} and ${durationLimit.max}.`);

  if (occasionsPerWeekInput === null) addMissingMessage(messages, 'average occasions per week', occasionsPerWeekInput);
  else if (!hasOccasionsPerWeek) messages.push(`Average occasions per week must be between ${frequencyLimit.min} and ${frequencyLimit.max}.`);

  if (amountPerOccurrenceInput !== null && !hasAmountPerOccurrence) {
    messages.push('Average amount per occurrence must be a finite, non-negative number.');
  }

  const amountDetailsEntered = amountPerOccurrenceInput !== null || period.amountUnit !== '' || customUnit.length > 0;
  if (amountDetailsEntered) {
    if (period.amountUnit === '') {
      messages.push('Select an amount unit to estimate a total amount.');
    } else if (!hasAmountUnit) {
      messages.push('The amount unit is not recognized.');
    } else if (period.amountUnit === 'other' && !hasCustomUnitLabel) {
      messages.push(`Add a custom unit label of 1–${MAX_CUSTOM_UNIT_CHARS} characters to estimate a total amount.`);
    }
  }

  const durationYears = hasDuration ? durationInput : null;

  let estimatedOccasions: number | null = null;
  if (hasDuration && hasOccasionsPerWeek) {
    const occasions = durationInput * WEEKS_PER_YEAR * occasionsPerWeekInput;
    if (Number.isFinite(occasions)) {
      estimatedOccasions = occasions;
    } else {
      messages.push('Estimated occasions cannot be represented as a finite number.');
    }
  }

  let estimatedTotalAmount: number | null = null;
  let amountUnit: DoseUnit | null = null;
  let amountUnitLabel: string | null = null;
  if (estimatedOccasions !== null && hasAmountPerOccurrence && hasUnitForTotal) {
    const totalAmount = estimatedOccasions * amountPerOccurrenceInput;
    if (Number.isFinite(totalAmount)) {
      estimatedTotalAmount = totalAmount;
      amountUnit = period.amountUnit;
      amountUnitLabel = period.amountUnit === 'other' ? customUnit : null;
    } else {
      messages.push('Estimated total amount cannot be represented as a finite number.');
    }
  }

  let estimatedAgeAtStart: number | null = null;
  if (period.activeNow) {
    const currentAgeLimit = HISTORY_LIMITS.currentAge;
    if (currentAge === null) {
      messages.push('Add the current age to estimate the age at the start of an active period.');
    } else if (!isWithin(currentAge, currentAgeLimit.min, currentAgeLimit.max, currentAgeLimit.integer)) {
      messages.push(`Current age must be a whole number between ${currentAgeLimit.min} and ${currentAgeLimit.max}.`);
    } else if (hasDuration) {
      const ageAtStart = currentAge - durationInput;
      if (ageAtStart >= 0 && Number.isFinite(ageAtStart)) {
        estimatedAgeAtStart = ageAtStart;
      } else {
        messages.push('Estimated age at start cannot be negative or non-finite.');
      }
    }
  } else if (period.ageAtStart === null) {
    messages.push('Add the age at start to show it for this past period.');
  } else if (isWithin(period.ageAtStart, startAgeLimit.min, startAgeLimit.max)) {
    estimatedAgeAtStart = period.ageAtStart;
  } else {
    messages.push(`Age at start must be between ${startAgeLimit.min} and ${startAgeLimit.max}.`);
  }

  return {
    durationYears,
    estimatedOccasions,
    estimatedTotalAmount,
    amountUnit,
    amountUnitLabel,
    estimatedAgeAtStart,
    messages,
  };
}
