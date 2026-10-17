export type ROA = 'oral' | 'snort' | 'smoke' | 'iv' | 'rectal';
export type SpeedballFreq = 'none' | 'occasional' | 'chronic' | 'prefer_not_to_say';
export type UsagePattern = 'chronic' | 'binge' | 'prefer_not_to_say';
export type BiologicalSex = 'male' | 'female' | 'prefer_not_to_say';

export interface UserInputs {
  chronologicalAge: number;
  onsetAge: number;
  yearsOfUse: number;
  dailyGrams: number;
  roas: ROA[]; // Multiple ROA selection
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

// Scientific bio-availability & blood-brain barrier penetration weights
const ROA_WEIGHTS: Record<ROA, number> = {
  oral: 1.00,
  snort: 1.15,
  smoke: 1.32,
  rectal: 1.38, // High mucosal absorption efficiency
  iv: 1.48,     // Maximum instantaneous peak plasma concentration (Cmax)
};

const SPEEDBALL_WEIGHTS: Record<SpeedballFreq, number> = {
  none: 1.00,
  occasional: 1.20,
  chronic: 1.42,
  prefer_not_to_say: 1.15, // Neutral statistical imputation fallback
};

const PATTERN_WEIGHTS: Record<UsagePattern, number> = {
  chronic: 1.00,
  binge: 1.25, // Heightened excitotoxic spiking during crash cycles
  prefer_not_to_say: 1.10, // Moderate population-weighted average fallback
};

export function calculateAddictionImpact(input: UserInputs): CalculationResults {
  const {
    chronologicalAge,
    onsetAge,
    yearsOfUse,
    dailyGrams,
    roas,
    speedball,
    usagePattern,
    biologicalSex,
    concomitantAlcohol,
    concomitantOpioids,
    abstinenceMonths,
    aerobicExercise,
    sleepOptimization,
  } = input;

  // Wen et al. structural brain age regression baseline
  const padBase = -0.2672 * onsetAge + 0.1097 * yearsOfUse + 9.2335;
  
  // Calculate average ROA weight if multiple selected, default to oral (1.0) if none
  let roaMultiplier = 1.00;
  if (roas && roas.length > 0) {
    const sumWeights = roas.reduce((acc, r) => acc + (ROA_WEIGHTS[r] || 1.0), 0);
    roaMultiplier = sumWeights / roas.length;
    // Compounding penalty for utilizing multiple high-efficiency ROAs
    if (roas.length > 1) roaMultiplier *= 1.08;
  }

  const doseFactor = 1 + 0.28 * Math.log(1 + Math.max(0, dailyGrams) / 0.1);
  const speedballMultiplier = SPEEDBALL_WEIGHTS[speedball] || 1.00;
  const patternMultiplier = PATTERN_WEIGHTS[usagePattern] || 1.00;
  
  // Biological sex susceptibility modifier (clinical neuroinflammation variance)
  let sexMultiplier = 1.00;
  if (biologicalSex === 'female') sexMultiplier = 1.08;
  else if (biologicalSex === 'prefer_not_to_say') sexMultiplier = 1.04; // Median blend

  // Polydrug compounding factors
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

  // Neuroplastic recovery kinetics (BDNF / Sleep architecture)
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
