import React, { useState } from 'react';
import { BookOpen, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

interface SubstanceInfo {
  name: string;
  category: string;
  halfLife: string;
  neurotoxicityRisk: 'High' | 'Moderate' | 'Severe';
  harmReductionTips: string[];
  clinicalNotes: string;
}

const SUBSTANCES: SubstanceInfo[] = [
  {
    name: 'Methamphetamine (D-Methamphetamine)',
    category: 'Central Nervous System Stimulant',
    halfLife: '9–12 hours',
    neurotoxicityRisk: 'Severe',
    harmReductionTips: [
      'Prioritize forced hydration and electrolyte balance to prevent hyperthermia and renal strain.',
      'Avoid repeat dosing during binge cycles to mitigate dopamine terminal oxidative stress and excitotoxicity.',
      'Ensure mandatory sleep windows; sleep deprivation exponentially accelerates cognitive deficits and psychotic symptoms.'
    ],
    clinicalNotes: 'Induces profound dopamine transporter (DAT) downregulation and long-term structural brain age acceleration (PAD) as modeled by Wen et al. Connectome regression.'
  },
  {
    name: 'Alcohol (Ethanol)',
    category: 'CNS Depressant / GABAergic',
    halfLife: '4–5 hours (per standard unit)',
    neurotoxicityRisk: 'Moderate',
    harmReductionTips: [
      'Concomitant co-use with stimulants masks sedation, leading to accidental overconsumption of both substances.',
      'Contributes heavily to neurovascular dehydration and cortical grey matter atrophy.'
    ],
    clinicalNotes: 'Synergistic compounding factor that accelerates neuroinflammation and degrades prefrontal white matter integrity.'
  },
  {
    name: 'Opioids / Synthetic Analgesics',
    category: 'Mu-Opioid Receptor Agonist',
    halfLife: '2–4 hours (varies by analogue)',
    neurotoxicityRisk: 'High',
    harmReductionTips: [
      'Never use alone (Speedball co-use dramatically increases fatal respiratory depression risk due to asynchronous clearance half-lives).',
      'Always have Naloxone (Narcan) accessible and ensure peers are trained in overdose response.'
    ],
    clinicalNotes: 'Speedball combinations place extreme acute strain on cardiovascular and autonomic regulatory centers.'
  }
];

export const SubstanceLexicon: React.FC = () => {
  const [selectedSubstance, setSelectedSubstance] = useState<SubstanceInfo>(SUBSTANCES[0]);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 text-emerald-400">
        <BookOpen className="w-4 h-4" />
        <h2 className="text-xs font-mono uppercase tracking-wider">Clinical Substance Lexicon & Harm Reduction</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {SUBSTANCES.map((sub) => (
          <button
            key={sub.name}
            onClick={() => setSelectedSubstance(sub)}
            className={`p-2.5 rounded-lg border text-left transition-all text-xs font-mono ${
              selectedSubstance.name === sub.name
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="font-bold truncate">{sub.name}</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{sub.category}</div>
          </button>
        ))}
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-zinc-100">{selectedSubstance.name}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/40 bg-rose-950/30 text-rose-300">
            Risk: {selectedSubstance.neurotoxicityRisk}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
          <div>Half-Life: <span className="text-zinc-200">{selectedSubstance.halfLife}</span></div>
          <div>Category: <span className="text-zinc-200">{selectedSubstance.category}</span></div>
        </div>

        <p className="text-xs text-zinc-300 bg-zinc-900/50 p-2.5 rounded border border-zinc-800/80">
          {selectedSubstance.clinicalNotes}
        </p>

        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Harm Reduction Protocol
          </div>
          <ul className="space-y-1">
            {selectedSubstance.harmReductionTips.map((tip, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                <span className="text-emerald-500 font-mono">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
