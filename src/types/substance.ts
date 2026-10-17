export interface SubstanceRecord {
  id: string;
  name: string;
  sourceUrl: string;
  chemicalClasses: string[];
  psychoactiveClasses: string[];
  reportedRoutes: string[];
}

export interface SubstanceDataset {
  source: string;
  sourceUrl: string;
  copyrightUrl: string;
  license: string;
  licenseUrl: string;
  retrievedAt: string;
  recordCount: number;
  attribution: string;
  records: SubstanceRecord[];
}

export interface InteractionFinding {
  id: string;
  title: string;
  summary: string;
  level: 'high-concern';
  sourceLabel: string;
  sourceUrl: string;
}
