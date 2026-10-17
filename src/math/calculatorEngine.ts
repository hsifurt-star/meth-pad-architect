export type ROA = 'oral' | 'snort' | 'smoke' | 'iv';
export type SpeedballFreq = 'none' | 'occasional' | 'chronic';
export type UsagePattern = 'chronic' | 'binge';
export type BiologicalSex = 'male' | 'female';

export interface UserInputs {
  chronologicalAge: number;
  onsetAge: number;
  yearsOfUse: number;
  dailyGrams: number;
  roa: ROA;
  speedball: SpeedballFreq;
  usagePattern: UsagePattern;
  biologicalSex: BiologicalSex;
  concomitantAlcohol: boolean;
  concomitantOpioids: boolean;
  abstinenceMonths: number;
  aerobicExercise: boolean;
  sleepOptimization: boolean;
}

export interface CalculationResults {
  padBase: number;
  roaMultiplier: number;
  doseFactor: number;
  speedballMultiplier: number;
  patternMultiplier: number;
  sexMultiplier: number;
  polydrugMultiplier: number;
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

const PATTERN_WEIGHTS: Record<UsagePattern, number> = {
  chronic: 1.00,
  binge: 1.25, // Binge-crash cycles induce heightened neuro-excitotoxicity
};

export function calculateAddictionImpact(input: UserInputs): CalculationResults {
  const {
    chronologicalAge,
    onsetAge,
    yearsOfUse,
    dailyGrams,
    roa,
    speedball,
    usagePattern,
    biologicalSex,
    concomitantAlcohol,
    concomitantOpioids,
    abstinenceMonths,
    aerobicExercise,
    sleepOptimization,
  } = input;

  // Wen et al. connectome regression baseline for structural brain age acceleration
  const padBase = -0.2672 * onsetAge + 0.1097 * yearsOfUse + 9.2335;
  
  const roaMultiplier = ROA_WEIGHTS[roa];
  const doseFactor = 1 + 0.28 * Math.log(1 + Math.max(0, dailyGrams) / 0.1);
  const speedballMultiplier = SPEEDBALL_WEIGHTS[speedball];
  const patternMultiplier = PATTERN_WEIGHTS[usagePattern];
  
  // Biological sex susceptibility adjustment (clinical studies show distinct neuroinflammatory variance)
  const sexMultiplier = biologicalSex === 'female' ? 1.08 : 1.00;

  // Polydrug compounding factor
  let polydrugMultiplier = 1.00;
  if (concomitantAlcohol) polydrugMultiplier += 0.12;
  if (concomitantOpioids) polydrugMultiplier += 0.18;

  const compositeMultiplier = 
    roaMultiplier * 
    doseFactor * 
    speedballMultiplier * 
    patternMultiplier * 
    sexMultiplier * 
    polydrugMultiplier;

  const padElevated = Math.max(0, padBase * compositeMultiplier);

  // Neuroplastic recovery kinetics (Abstinence & Lifestyle BDNF/Sleep factors)
  let recoveryCap = 0.70;
  if (aerobicExercise) recoveryCap += 0.08;
  if (sleepOptimization) recoveryCap += 0.07;

  const maxRecoverablePAD = Math.min(padElevated * recoveryCap, 6.0);
  const recoveryAmount = maxRecoverablePAD * (1 - Math.exp(-Math.max(0, abstinenceMonths) / 6.5));

  const finalPAD = Math.max(0, padElevated - recoveryAmount);
  const biologicalBrainAge = chronologicalAge + finalPAD;
  const dsstCognitiveShift = -1.68 * finalPAD;

  // Actuarial lifespan loss calculations (YLL)
  const baseLifespanLossPerYear = 0.85 * Math.min(dailyGrams / 0.2, 3.0);
  const yllRaw = baseLifespanLossPerYear * yearsOfUse * roaMultiplier * speedballMultiplier * polydrugMultiplier;
  
  const mortalityRecoveryFactor = 1 - 0.40 * (1 - Math.exp(-abstinenceMonths / 12.0));
  const estimatedYearsLifeLost = Math.max(0, yllRaw * mortalityRecoveryFactor);
  
  const baselineLifeExpectancy = 78.5;
  const projectedLifespan = Math.max(chronologicalAge, baselineLifeExpectancy - estimatedYearsLifeLost);

  return {
    padBase,
    roaMultiplier,
    doseFactor,
    speedballMultiplier,
    patternMultiplier,
    sexMultiplier,
    polydrugMultiplier,
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

