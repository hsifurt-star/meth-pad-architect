import type { DoseUnit, PeriodCalculation, UsePeriod } from '../types/history.ts';

const WEEKS_PER_YEAR = 365.2425 / 7;
const RECOGNIZED_UNITS: readonly Exclude<DoseUnit, ''>[] = ['mg', 'g', 'mcg', 'mL', 'tablets', 'other'];

type NonEmptyDoseUnit = Exclude<DoseUnit, ''>;

function isFiniteNonNegative(value: number | null): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isRecognizedUnit(unit: DoseUnit): unit is NonEmptyDoseUnit {
  return RECOGNIZED_UNITS.includes(unit as NonEmptyDoseUnit);
}

function addNumberMessage(messages: string[], label: string, value: number | null): void {
  if (value === null) {
    messages.push(`Add ${label} to make the related estimate available.`);
    return;
  }

  if (!isFiniteNonNegative(value)) {
    messages.push(`${label} must be a finite, non-negative number.`);
  }
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
  const hasDuration = isFiniteNonNegative(durationInput);
  const hasOccasionsPerWeek = isFiniteNonNegative(occasionsPerWeekInput);
  const hasAmountPerOccurrence = isFiniteNonNegative(amountPerOccurrenceInput);
  const hasAmountUnit = isRecognizedUnit(period.amountUnit);
  const hasCustomUnitLabel = period.customUnitLabel.trim().length > 0;
  const hasUnitForTotal = hasAmountUnit && (period.amountUnit !== 'other' || hasCustomUnitLabel);

  addNumberMessage(messages, 'a duration in years', durationInput);
  addNumberMessage(messages, 'average occasions per week', occasionsPerWeekInput);
  addNumberMessage(messages, 'average amount per occurrence', amountPerOccurrenceInput);

  if (period.amountUnit === '') {
    messages.push('Select an amount unit to estimate a total amount.');
  } else if (!hasAmountUnit) {
    messages.push('The amount unit is not recognized.');
  } else if (period.amountUnit === 'other' && !hasCustomUnitLabel) {
    messages.push('Add a custom unit label to estimate a total amount with another unit.');
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
      amountUnitLabel = period.amountUnit === 'other' ? period.customUnitLabel : null;
    } else {
      messages.push('Estimated total amount cannot be represented as a finite number.');
    }
  }

  let estimatedAgeAtStart: number | null = null;
  if (period.activeNow) {
    if (currentAge === null) {
      messages.push('Add the current age to estimate the age at the start of an active period.');
    } else if (!isFiniteNonNegative(currentAge)) {
      messages.push('Current age must be a finite, non-negative number.');
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
  } else if (isFiniteNonNegative(period.ageAtStart)) {
    estimatedAgeAtStart = period.ageAtStart;
  } else {
    messages.push('Age at start must be a finite, non-negative number.');
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
