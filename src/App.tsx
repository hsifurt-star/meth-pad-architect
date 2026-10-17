import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CalculationSummary } from './components/CalculationSummary';
import { EmergencyPanel } from './components/EmergencyPanel';
import { SourceNotes } from './components/SourceNotes';
import { SubstanceDirectory } from './components/SubstanceDirectory';
import { UseHistoryCalculator } from './components/UseHistoryCalculator';
import substanceIndex from './data/substances.json';
import type { UsePeriod } from './types/history';
import type { SubstanceDataset, SubstanceRecord } from './types/substance';

const dataset = substanceIndex as SubstanceDataset;
const MAX_USE_PERIODS = 12;

function newPeriod(record: SubstanceRecord): UsePeriod {
  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    substanceId: record.id,
    durationYears: null,
    activeNow: true,
    ageAtStart: null,
    occasionsPerWeek: null,
    amountPerOccurrence: null,
    amountUnit: '',
    customUnitLabel: '',
    routes: [],
  };
}

export default function App() {
  const [periods, setPeriods] = useState<UsePeriod[]>([]);
  const [currentAge, setCurrentAge] = useState<number | null>(null);
  const canAddPeriod = periods.length < MAX_USE_PERIODS;

  const addPeriod = (record: SubstanceRecord) => {
    if (!canAddPeriod) return;
    setPeriods((current) => [...current, newPeriod(record)]);
  };

  const clearHistory = () => {
    setPeriods([]);
    setCurrentAge(null);
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header className="topbar">
        <a className="brand" href="#main-content" aria-label="Substance Use Ledger home">
          <img src="/fieldnotes-mark.svg" width="34" height="34" alt="" />
          <span className="brand-name">SUBSTANCE</span>
          <span className="brand-slash">/</span>
          <span className="brand-descriptor">USE LEDGER</span>
        </a>
        <nav className="topbar-nav" aria-label="Main navigation">
          <a href="#calculator">Calculator</a>
          <a href="#directory">Index <span>{dataset.recordCount}</span></a>
          <a href="#sources">Evidence</a>
        </nav>
        <div className="privacy-status"><span className="privacy-dot" aria-hidden="true" /> Session only</div>
      </header>

      <div className="safety-ribbon" role="note">
        <strong>Someone in immediate danger?</strong>
        <span>Call your local emergency number.</span>
        <a href="#emergency">Emergency signs &amp; help <ArrowUpRight size={13} aria-hidden="true" /></a>
      </div>

      <main id="main-content" className="page-layout">
        <EmergencyPanel />

        <div className="page-heading">
          <div className="page-kicker"><span>01</span> PERSONAL RECORD</div>
          <h1>Use history</h1>
          <p>Record each pattern separately. See what the entries add up to—and where the evidence stops.</p>
        </div>

        <div className="workbench">
          <div className="workbench-main">
            <UseHistoryCalculator
              records={dataset.records}
              currentAge={currentAge}
              onCurrentAgeChange={setCurrentAge}
              periods={periods}
              onPeriodsChange={setPeriods}
              onAddPeriod={addPeriod}
              onClear={clearHistory}
              canAddPeriod={canAddPeriod}
              maxPeriods={MAX_USE_PERIODS}
            />

            <SubstanceDirectory
              records={dataset.records}
              onAdd={addPeriod}
              canAddPeriod={canAddPeriod}
              maxPeriods={MAX_USE_PERIODS}
            />

            <SourceNotes dataset={dataset} />
          </div>

          <CalculationSummary periods={periods} />
        </div>

        <footer className="site-footer">
          <a className="footer-brand" href="#main-content"><img src="/fieldnotes-mark.svg" width="20" height="20" alt="" /> SUBSTANCE / USE LEDGER</a>
          <span>For education, not diagnosis or treatment.</span>
          <a href="#emergency">Immediate help <ArrowUpRight size={13} aria-hidden="true" /></a>
        </footer>
      </main>
    </div>
  );
}
