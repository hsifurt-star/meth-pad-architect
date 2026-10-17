import React, { useState } from 'react';
import { 
  calculateAddictionImpact, 
  UserInputs, 
  ROA, 
  SpeedballFreq, 
  UsagePattern, 
  BiologicalSex 
} from './math/calculatorEngine';
import { ConnectomeCanvas } from './components/ConnectomeCanvas';
import { Activity, Brain, ShieldCheck, Flame, HeartPulse, Sliders, Users } from 'lucide-react';

export default function App() {
  const [inputs, setInputs] = useState<UserInputs>({
    chronologicalAge: 28,
    onsetAge: 20,
    yearsOfUse: 3.0,
    dailyGrams: 0.3,
    roa: 'smoke',
    speedball: 'none',
    usagePattern: 'chronic',
    biologicalSex: 'male',
    concomitantAlcohol: false,
    concomitantOpioids: false,
    abstinenceMonths: 6,
    aerobicExercise: true,
    sleepOptimization: true,
  });

  const results = calculateAddictionImpact(inputs);

  const updateInput = <K extends keyof UserInputs>(key: K, value: UserInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 max-w-4xl mx-auto pb-12">
      <header className="border-b border-zinc-800 pb-3 mb-5">
        <div className="flex items-center gap-2 text-rose-500 mb-0.5">
          <Activity className="w-4 h-4" />
          <span className="text-[11px] font-mono uppercase tracking-widest">Precision Clinical Tool v2.0</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">Addiction Biological Impact Calculator</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Advanced neuroimaging regression modeling (Wen et al.) with polydrug compounding and neuroplastic recovery curves.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Expanded Telemetry Inputs */}
        <div className="space-y-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <h2 className="text-xs font-mono uppercase text-zinc-400 tracking-wider flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Usage Telemetry & Demographics
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Current Age</label>
              <input
                type="number"
                value={inputs.chronologicalAge}
                onChange={(e) => updateInput('chronologicalAge', Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-mono text-zinc-200"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Onset Age</label>
              <input
                type="number"
                value={inputs.onsetAge}
                onChange={(e) => updateInput('onsetAge', Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-mono text-zinc-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Duration (Years)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.yearsOfUse}
                onChange={(e) => updateInput('yearsOfUse', Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-mono text-zinc-200"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Daily Use (Grams)</label>
              <input
                type="number"
                step="0.05"
                value={inputs.dailyGrams}
                onChange={(e) => updateInput('dailyGrams', Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-mono text-zinc-200"
              />
            </div>
          </div>

          {/* Biological Sex & Usage Pattern */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs text-zinc-400 block mb-1.5 flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-400" /> Biological Sex
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['male', 'female'] as BiologicalSex[]).map((sex) => (
                  <button
                    key={sex}
                    onClick={() => updateInput('biologicalSex', sex)}
                    className={`py-1.5 text-xs font-mono rounded-lg border capitalize transition-all ${
                      inputs.biologicalSex === sex
                        ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {sex}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1.5">Usage Pattern</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['chronic', 'binge'] as UsagePattern[]).map((pat) => (
                  <button
                    key={pat}
                    onClick={() => updateInput('usagePattern', pat)}
                    className={`py-1.5 text-xs font-mono rounded-lg border capitalize transition-all ${
                      inputs.usagePattern === pat
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {pat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1.5">Route of Administration (ROA)</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['oral', 'snort', 'smoke', 'iv'] as ROA[]).map((r) => (
                <button
                  key={r}
                  onClick={() => updateInput('roa', r)}
                  className={`py-1.5 text-xs font-mono rounded-lg border capitalize transition-all ${
                    inputs.roa === r
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1.5">Speedball Co-Use</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['none', 'occasional', 'chronic'] as SpeedballFreq[]).map((s) => (
                <button
                  key={s}
                  onClick={() => updateInput('speedball', s)}
                  className={`py-1.5 text-xs font-mono rounded-lg border capitalize transition-all ${
                    inputs.speedball === s
                      ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Polydrug Concomitant Factors */}
          <div className="pt-2 border-t border-zinc-800 space-y-2">
            <label className="text-xs text-zinc-400 block uppercase tracking-wider font-mono">
              Polydrug Concomitant Factors
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.concomitantAlcohol}
                  onChange={(e) => updateInput('concomitantAlcohol', e.target.checked)}
                  className="accent-rose-500"
                />
                Concomitant Alcohol Use
              </label>
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.concomitantOpioids}
                  onChange={(e) => updateInput('concomitantOpioids', e.target.checked)}
                  className="accent-rose-500"
                />
                Opioid Co-Involvement
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 space-y-3">
            <h2 className="text-xs font-mono uppercase text-emerald-400 tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Recovery & Rehabilitation
            </h2>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">Abstinence Duration</span>
                <span className="font-mono text-emerald-400">{inputs.abstinenceMonths} Months</span>
              </div>
              <input
                type="range"
                min="0"
                max="36"
                value={inputs.abstinenceMonths}
                onChange={(e) => updateInput('abstinenceMonths', Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.aerobicExercise}
                  onChange={(e) => updateInput('aerobicExercise', e.target.checked)}
                  className="accent-emerald-500"
                />
                Cardio / BDNF Therapy
              </label>
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.sleepOptimization}
                  onChange={(e) => updateInput('sleepOptimization', e.target.checked)}
                  className="accent-emerald-500"
                />
                Sleep Architecture
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Clinical Readouts */}
        <div className="space-y-4 flex flex-col justify-between">
          <ConnectomeCanvas padScore={results.finalPAD} />

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                Brain Biological Age
              </div>
              <div className="text-2xl font-mono font-bold text-purple-300">
                {results.biologicalBrainAge.toFixed(1)} <span className="text-xs text-zinc-500">yrs</span>
              </div>
              <div className="text-[11px] font-mono text-purple-400 mt-0.5">
                +{results.finalPAD.toFixed(2)} yrs PAD gap
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                Lifespan Impact (YLL)
              </div>
              <div className="text-2xl font-mono font-bold text-rose-400">
                -{results.estimatedYearsLifeLost.toFixed(1)} <span className="text-xs text-zinc-500">yrs</span>
              </div>
              <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                Proj: {results.projectedLifespan.toFixed(1)} yrs
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-3 rounded-xl space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>Baseline PAD (Wen et al.):</span>
              <span className="text-zinc-200">+{results.padBase.toFixed(2)} yrs</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Composite Multiplier:</span>
              <span className="text-amber-400">{results.compositeMultiplier.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Neuroplastic Recovery:</span>
              <span className="text-emerald-400">-{results.recoveryAmount.toFixed(2)} yrs</span>
            </div>
            <div className="flex justify-between text-zinc-400 border-t border-zinc-800 pt-1">
              <span>Est. DSST Cognitive Shift:</span>
              <span className="text-purple-400">{results.dsstCognitiveShift.toFixed(1)} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

