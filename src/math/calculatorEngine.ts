export type ROA = 'oral' | 'snort' | 'smoke' | 'iv';
export type SpeedballFreq = 'none' | 'occasional' | 'chronic';

export interface UserInputs {
  chronologicalAge: number;
  onsetAge: number;
  yearsOfUse: number;
  dailyGrams: number;
  roa: ROA;
  speedball: SpeedballFreq;
  abstinenceMonths: number;
  aerobicExercise: boolean;
  sleepOptimization: boolean;
}

export interface CalculationResults {
  padBase: number;
  roaMultiplier: number;
  doseFactor: number;
  speedballMultiplier: number;
  compositeMultiplier: number;
  padElevated: number;
  recoveryAmount: number;
  finalPAD: number;
  biologicalBrainAge: number;
  dsstCognitiveShift: number;
  estimatedYearsLifeLost: number;
  projectedLifespan: number;
}

const ROA_WEIGHTS: Record<ROA, number> = {
  oral: 1.00,
  snort: 1.15,
  smoke: 1.32,
  iv: 1.48,
};

const SPEEDBALL_WEIGHTS: Record<SpeedballFreq, number> = {
  none: 1.00,
  occasional: 1.20,
  chronic: 1.42,
};

export function calculateAddictionImpact(input: UserInputs): CalculationResults {
  const {
    chronologicalAge,
    onsetAge,
    yearsOfUse,
    dailyGrams,
    roa,
    speedball,
    abstinenceMonths,
    aerobicExercise,
    sleepOptimization,
  } = input;

  const padBase = -0.2672 * onsetAge + 0.1097 * yearsOfUse + 9.2335;
  const roaMultiplier = ROA_WEIGHTS[roa];
  const doseFactor = 1 + 0.28 * Math.log(1 + Math.max(0, dailyGrams) / 0.1);
  const speedballMultiplier = SPEEDBALL_WEIGHTS[speedball];

  const compositeMultiplier = roaMultiplier * doseFactor * speedballMultiplier;
  const padElevated = Math.max(0, padBase * compositeMultiplier);

  let recoveryCap = 0.70;
  if (aerobicExercise) recoveryCap += 0.08;
  if (sleepOptimization) recoveryCap += 0.07;

  const maxRecoverablePAD = Math.min(padElevated * recoveryCap, 5.0);
  const recoveryAmount = maxRecoverablePAD * (1 - Math.exp(-Math.max(0, abstinenceMonths) / 6.5));

  const finalPAD = Math.max(0, padElevated - recoveryAmount);
  const biologicalBrainAge = chronologicalAge + finalPAD;
  const dsstCognitiveShift = -1.68 * finalPAD;

  const baseLifespanLossPerYear = 0.85 * Math.min(dailyGrams / 0.2, 3.0);
  const yllRaw = baseLifespanLossPerYear * yearsOfUse * roaMultiplier * speedballMultiplier;
  
  const mortalityRecoveryFactor = 1 - 0.40 * (1 - Math.exp(-abstinenceMonths / 12.0));
  const estimatedYearsLifeLost = Math.max(0, yllRaw * mortalityRecoveryFactor);
  
  const baselineLifeExpectancy = 78.5;
  const projectedLifespan = Math.max(chronologicalAge, baselineLifeExpectancy - estimatedYearsLifeLost);

  return {
    padBase,
    roaMultiplier,
    doseFactor,
    speedballMultiplier,
    compositeMultiplier,
    padElevated,
    recoveryAmount,
    finalPAD,
    biologicalBrainAge,
    dsstCognitiveShift,
    estimatedYearsLifeLost,
    projectedLifespan,
  };
}

