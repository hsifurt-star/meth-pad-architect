export type SubstanceCategory = 'Stimulants' | 'Depressants' | 'Entactogens' | 'Dissociatives' | 'Opioids' | 'Cannabinoids';

export type RouteOfAdministration = 'Oral' | 'Insufflation' | 'Smoking' | 'Intravenous' | 'Rectal' | 'Sublingual';

export interface PKProfile {
  onset: Record<RouteOfAdministration, string>;
  tMax: Record<RouteOfAdministration, string>;
  duration: Record<RouteOfAdministration, string>;
  halfLife: string;
  activeMetabolites: string[];
  eliminationPathway: string;
}

export interface DosageTier {
  threshold: number | string;
  light: string;
  common: string;
  strong: string;
  heavyToxic: string;
  units: string;
}

export interface ToxicityProfile {
  neurotoxicityGrade: 'Low' | 'Moderate' | 'High' | 'Severe';
  oxidativeStressPathways: string[];
  padCouplingFactor: number;
  cardiovascularRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface HarmReductionProtocol {
  preLoading: string[];
  postLoading: string[];
  mandatoryRestWindows: string;
  contraindications: string[];
}

export interface OverdoseProtocol {
  recognitionChecklist: string[];
  immediateIntervention: string[];
  specificAntagonist?: {
    agent: string;
    dosage: string;
    instructions: string;
  };
}

export interface SubstanceEntry {
  id: string;
  name: string;
  chemicalName: string;
  iupacClass: string;
  category: SubstanceCategory;
  primaryReceptorMechanisms: string[];
  pk: PKProfile;
  dosage: DosageTier;
  toxicity: ToxicityProfile;
  harmReduction: HarmReductionProtocol;
  overdose: OverdoseProtocol;
}

export interface UserSubstanceLog {
  id: string;
  substanceId: string;
  substanceName: string;
  dosageMg: number;
  roa: RouteOfAdministration;
  timestamp: number;
  notes?: string;
}
