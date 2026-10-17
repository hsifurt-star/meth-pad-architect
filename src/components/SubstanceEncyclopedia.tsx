import React, { useState } from 'react';
import { BookOpen, ShieldAlert, AlertTriangle, Activity, Info, CheckCircle2 } from 'lucide-react';

interface SubstanceProfile {
  id: string;
  name: string;
  category: string;
  routes: string[];
  onsetMinutes: { [key: string]: string };
  durationHours: { [key: string]: string };
  halfLife: string;
  commonDoses: {
    threshold: string;
    light: string;
    common: string;
    strong: string;
    heavyRisk: string;
  };
  neurotoxicity: 'Low' | 'Moderate' | 'High' | 'Severe';
  harmReductionGuidelines: string[];
  overdoseSymptoms: string[];
  emergencyAction: string;
}

const SUBSTANCE_DATABASE: SubstanceProfile[] = [
  {
    id: 'meth',
    name: 'Methamphetamine (D-Meth)',
    category: 'CNS Stimulant / Sympathomimetic',
    routes: ['Smoking', 'Intravenous', 'Insufflation', 'Oral', 'Rectal'],
    onsetMinutes: { smoking: '5–15s', iv: '< 30s', insufflation: '3–5m', oral: '20–30m', rectal: '5–10m' },
    durationHours: { smoking: '4–8h', iv: '4–6h', insufflation: '6–8h', oral: '8–12h', rectal: '8–12h' },
    halfLife: '9–12 hours',
    commonDoses: {
      threshold: '5–10 mg',
      light: '10–25 mg',
      common: '25–50 mg',
      strong: '50–100 mg+',
      heavyRisk: '150 mg+ (High risk of hypertensive crisis & psychosis)'
    },
    neurotoxicity: 'Severe',
    harmReductionGuidelines: [
      'Forced Hydration: Drink electrolytes, but avoid over-hydration (hyponatremia).',
      'Mandatory Sleep Windows: Sleep deprivation past 48 hours exponentially spikes psychotic symptoms and cognitive decline.',
      'Temperature Monitoring: Stimulants impair thermoregulation; monitor for hyperthermia.'
    ],
    overdoseSymptoms: ['Chest pain', 'Extreme tachycardia (>140 bpm)', 'Paranoia/Hallucinations', 'Hyperthermia', 'Seizures'],
    emergencyAction: 'Call emergency services immediately. Cool the patient, keep them calm in a low-stimulus environment, and administer benzodiazepines only under medical supervision.'
  },
  {
    id: 'cocaine',
    name: 'Cocaine Hydrochloride / Crack',
    category: 'CNS Stimulant / DRI',
    routes: ['Insufflation', 'Smoking (Crack)', 'Intravenous'],
    onsetMinutes: { insufflation: '1–3m', smoking: '< 10s', iv: '< 30s' },
    durationHours: { insufflation: '0.5–1h', smoking: '0.2–0.5h', iv: '0.3–0.5h' },
    halfLife: '0.8–1 hour',
    commonDoses: {
      threshold: '10–20 mg',
      light: '20–40 mg',
      common: '50–100 mg',
      strong: '100–200 mg',
      heavyRisk: '250 mg+ (Acute cardiac arrhythmia risk)'
    },
    neurotoxicity: 'High',
    harmReductionGuidelines: [
      'Avoid Speedballing: Combining with opioids masks depressive symptoms and dramatically increases fatal respiratory depression.',
      'Cardiovascular Strain: Rapid spikes in heart rate and vasoconstriction risk myocardial infarction.'
    ],
    overdoseSymptoms: ['Severe chest tightness', 'Arrhythmia', 'Agitation', 'Seizures', 'Stroke symptoms'],
    emergencyAction: 'Immediate emergency medical intervention required. Aspirin and nitro-glycerine protocols under physician care.'
  },
  {
    id: 'alcohol',
    name: 'Ethanol (Alcohol)',
    category: 'CNS Depressant / GABA-A Modulator',
    routes: ['Oral'],
    onsetMinutes: { oral: '15–30m' },
    durationHours: { oral: '1–3h per standard drink' },
    halfLife: '~1 hour per unit (zero-order kinetics)',
    commonDoses: {
      threshold: '1 standard drink (14g pure ethanol)',
      light: '1–2 drinks',
      common: '2–4 drinks',
      strong: '4–6 drinks',
      heavyRisk: '6+ drinks (Respiratory depression risk)'
    },
    neurotoxicity: 'Moderate',
    harmReductionGuidelines: [
      'Never mix depressants with central stimulants to avoid masking intoxication cues.',
      'Alternate alcoholic drinks with electrolyte water to prevent severe neurovascular dehydration.'
    ],
    overdoseSymptoms: ['Respiratory depression', 'Aspiration risk via vomiting', 'Unconsciousness', 'Coma'],
    emergencyAction: 'Place person in recovery position (side) to prevent asphyxiation. Monitor breathing and call ambulance if unresponsive.'
  },
  {
    id: 'opioids',
    name: 'Opioids / Heroin / Fentanyl Analogue',
    category: 'Mu-Opioid Receptor Agonist',
    routes: ['Intravenous', 'Smoking', 'Insufflation', 'Oral'],
    onsetMinutes: { iv: '< 1m', smoking: '1–3m', insufflation: '5–10m', oral: '15–30m' },
    durationHours: { iv: '3–5h', smoking: '3–4h', insufflation: '4–6h', oral: '4–6h' },
    halfLife: '3–4 hours (Fentanyl is shorter, Methadone is 24–36h)',
    commonDoses: {
      threshold: 'Varies wildly by tolerance and purity',
      light: 'Low titration mandatory',
      common: 'Dependent on baseline habit',
      strong: 'High overdose potential',
      heavyRisk: 'Fatally lethal respiratory arrest threshold'
    },
    neurotoxicity: 'High',
    harmReductionGuidelines: [
      'Never Use Alone: Always ensure someone nearby carries Naloxone (Narcan).',
      'Fentanyl Strip Testing: Test all substances for synthetic fentanyl adulterants prior to consumption.',
      'Start Low, Go Slow: Purity fluctuations cause accidental overdoses.'
    ],
    overdoseSymptoms: ['Blue lips/fingertips (cyanosis)', 'Pinpoint pupils', 'Unresponsiveness', 'Gurgling or snoring respiration'],
    emergencyAction: 'Administer Naloxone (Narcan) nasal spray immediately. Call emergency services. Begin rescue breathing if pulse is present.'
  }
];

export const SubstanceEncyclopedia: React.FC = () => {
  const [activeSubstance, setActiveSubstance] = useState<SubstanceProfile>(SUBSTANCE_DATABASE[0]);
  const [userLoggedDose, setUserLoggedDose] = useState<string>('');

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <BookOpen className="w-4 h-4" />
          <h2 className="text-xs font-mono uppercase tracking-wider">Clinical Substance Lexicon & Harm Reduction</h2>
        </div>
        <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
          Evidence-Based Toxicology
        </span>
      </div>

      {/* Substance Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {SUBSTANCE_DATABASE.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubstance(sub)}
            className={`p-2.5 rounded-lg border text-left transition-all text-xs font-mono ${
              activeSubstance.id === sub.id
                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-md'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="font-bold truncate">{sub.name.split(' ')[0]}</div>
            <div className="text-[10px] text-zinc-500 truncate mt-0.5">{sub.category.split('/')[0]}</div>
          </button>
        ))}
      </div>

      {/* Active Substance Details Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-zinc-800/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-zinc-100">{activeSubstance.name}</h3>
            <p className="text-xs text-zinc-400 font-mono">{activeSubstance.category}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded border border-rose-500/40 bg-rose-950/30 text-rose-300 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Neurotoxicity: {activeSubstance.neurotoxicity}
            </span>
          </div>
        </div>

        {/* Pharmacokinetics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-400 block mb-1">Elimination Half-Life</span>
            <span className="text-zinc-200 font-bold">{activeSubstance.halfLife}</span>
          </div>
          <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-400 block mb-1">Routes of Administration</span>
            <span className="text-emerald-400">{activeSubstance.routes.join(', ')}</span>
          </div>
          <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-400 block mb-1">Primary Onset Speed</span>
            <span className="text-purple-300">Varies by ROA (Smoking/IV fastest)</span>
          </div>
        </div>

        {/* Dosage Thresholds */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-3 rounded-lg space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" /> Standard Dosage Guidelines
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono">
            <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
              <div className="text-zinc-500 text-[10px]">Threshold</div>
              <div className="text-zinc-300 mt-0.5">{activeSubstance.commonDoses.threshold}</div>
            </div>
            <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
              <div className="text-zinc-500 text-[10px]">Light</div>
              <div className="text-emerald-400 mt-0.5">{activeSubstance.commonDoses.light}</div>
            </div>
            <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
              <div className="text-zinc-500 text-[10px]">Common</div>
              <div className="text-amber-400 mt-0.5">{activeSubstance.commonDoses.common}</div>
            </div>
            <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
              <div className="text-zinc-500 text-[10px]">Strong</div>
              <div className="text-rose-400 mt-0.5">{activeSubstance.commonDoses.strong}</div>
            </div>
            <div className="bg-zinc-950 p-2 rounded border border-zinc-800 col-span-2 md:col-span-1">
              <div className="text-zinc-500 text-[10px]">Heavy Risk</div>
              <div className="text-rose-500 font-bold mt-0.5">{activeSubstance.commonDoses.heavyRisk}</div>
            </div>
          </div>
        </div>

        {/* Harm Reduction & Safety Protocols */}
        <div className="space-y-2 pt-1">
          <div className="text-xs font-mono uppercase tracking-wide text-emerald-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Clinical Harm Reduction Protocols
          </div>
          <ul className="space-y-1.5">
            {activeSubstance.harmReductionGuidelines.map((guideline, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 bg-zinc-900/30 p-2 rounded border border-zinc-800/60">
                <span className="text-emerald-500 font-mono mt-0.5">•</span> {guideline}
              </li>
            ))}
          </ul>
        </div>

        {/* Emergency Overdose Action Plan */}
        <div className="bg-rose-950/20 border border-rose-500/40 rounded-lg p-3 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Acute Overdose Warning & Protocol
          </div>
          <div className="text-xs text-zinc-300 space-y-1 font-mono">
            <div><strong className="text-rose-300">Symptoms:</strong> {activeSubstance.overdoseSymptoms.join(', ')}</div>
            <div className="pt-1 border-t border-rose-500/20"><strong className="text-emerald-300">Emergency Action:</strong> {activeSubstance.emergencyAction}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
