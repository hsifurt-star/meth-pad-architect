export type DoseUnit = 'mg' | 'g' | 'mcg' | 'mL' | 'tablets' | 'other' | '';

export interface UsePeriod {
  id: string;
  substanceId: string;
  durationYears: number | null;
  activeNow: boolean;
  ageAtStart: number | null;
  occasionsPerWeek: number | null;
  amountPerOccurrence: number | null;
  amountUnit: DoseUnit;
  customUnitLabel: string;
  routes: string[];
}

export interface PeriodCalculation {
  durationYears: number | null;
  estimatedOccasions: number | null;
  estimatedTotalAmount: number | null;
  amountUnit: DoseUnit | null;
  amountUnitLabel: string | null;
  estimatedAgeAtStart: number | null;
  messages: string[];
}
