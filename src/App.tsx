import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BookOpen, Check, CircleHelp, LockKeyhole, ShieldAlert } from 'lucide-react';
import { EmergencyPanel } from './components/EmergencyPanel';
import { SourceNotes } from './components/SourceNotes';
import { SubstanceDirectory } from './components/SubstanceDirectory';
import { UseHistoryCalculator } from './components/UseHistoryCalculator';
import substanceIndex from './data/substances.json';
import type { UsePeriod } from './types/history';
import type { SubstanceDataset, SubstanceRecord } from './types/substance';

const dataset = substanceIndex as SubstanceDataset;
const MAX_USE_PERIODS = 12;

const navigation = [
  { href: '#calculator', label: 'History calculator', number: '01' },
  { href: '#emergency', label: 'Immediate help', number: '02' },
  { href: '#directory', label: 'Substance index', number: '03' },
  { href: '#scope', label: 'What it can show', number: '04' },
  { href: '#sources', label: 'Sources & limits', number: '05' },
];

function newPeriod(record: SubstanceRecord): UsePeriod {
  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
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

  const addPeriod = (record: SubstanceRecord) => {
    if (periods.length >= MAX_USE_PERIODS) return;
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
        <a className="brand" href="#overview" aria-label="Substance use history calculator home">
          <img src="/fieldnotes-mark.svg" width="36" height="36" alt="" />
          <span className="brand-wordmark">SUBSTANCE<span>USE HISTORY CALCULATOR</span></span>
        </a>
        <div className="topbar-meta">
          <span className="edition-label">Evidence before estimates</span>
          <span className="privacy-status"><LockKeyhole size={14} aria-hidden="true" /> Session-only · no account</span>
        </div>
      </header>

      <div className="safety-ribbon" role="note">
        <span><ShieldAlert size={17} aria-hidden="true" /><strong>Possible medical emergency?</strong> Call your local emergency number.</span>
        <a href="#emergency">Signs and what to do <ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>

      <div className="page-layout">
        <nav className="section-nav" aria-label="Page sections">
          <div className="nav-caption">IN THIS TOOL</div>
          {navigation.map((item) => (
            <a className="nav-link" key={item.href} href={item.href}>
              <span className="nav-number">{item.number}</span>{item.label}
            </a>
          ))}
          <div className="nav-note">
            <LockKeyhole size={15} aria-hidden="true" />
            <p>Use-history entries remain in page memory only. They are not sent to a server or saved.</p>
          </div>
          <div className="nav-source-count"><BookOpen size={15} aria-hidden="true" /><span>{dataset.recordCount} index records<br />Snapshot · {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(dataset.retrievedAt))}</span></div>
        </nav>

        <main id="main-content" className="main-content">
          <div className="emergency-anchor" aria-label="Immediate help"><EmergencyPanel /></div>

          <section className="hero-section calculator-hero" id="overview">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> USE HISTORY · TRANSPARENT ARITHMETIC</div>
              <h1>Calculate what your history shows.<br /><em>Not what it cannot know.</em></h1>
              <p className="hero-lede">Record multiple substances and changing use periods. See the arithmetic, units and assumptions beside each result—without turning them into a personal medical prediction.</p>
              <div className="hero-actions">
                <a className="button-primary" href="#calculator">Build a use history <ArrowDownRight size={16} aria-hidden="true" /></a>
                <a className="button-secondary" href="#sources">See evidence limits <ArrowUpRight size={15} aria-hidden="true" /></a>
              </div>
            </div>
            <aside className="hero-note" aria-label="Evidence principle">
              <div className="hero-note-top"><span>CALCULATION NOTE</span><span>NO. 001</span></div>
              <div className="hero-note-mark"><span /> <span /> <span /></div>
              <p>A reported total is arithmetic, not a health-risk score.</p>
              <div className="hero-note-bottom"><span>ASSUMPTIONS</span><strong>SHOW THEM</strong></div>
            </aside>
          </section>

          <div className="measure-strip" aria-label="How the tool works">
            <div><strong>{dataset.recordCount}</strong><span>source-linked substance records</span></div>
            <div><strong>Per period</strong><span>unit-preserving arithmetic</span></div>
            <div><strong>0</strong><span>invented personal probabilities</span></div>
          </div>

          <UseHistoryCalculator
            records={dataset.records}
            currentAge={currentAge}
            onCurrentAgeChange={setCurrentAge}
            periods={periods}
            onPeriodsChange={setPeriods}
            onAddPeriod={addPeriod}
            onClear={clearHistory}
            canAddPeriod={periods.length < MAX_USE_PERIODS}
            maxPeriods={MAX_USE_PERIODS}
          />

          <section className="library-section" id="directory">
            <SubstanceDirectory records={dataset.records} onAdd={addPeriod} canAddPeriod={periods.length < MAX_USE_PERIODS} maxPeriods={MAX_USE_PERIODS} />
          </section>

          <section className="can-cannot-section" id="scope" aria-labelledby="scope-title">
            <div className="section-kicker"><span className="kicker-mark">04</span> Scope, at a glance</div>
            <h2 id="scope-title">Useful arithmetic. Honest boundaries.</h2>
            <div className="scope-columns">
              <article className="scope-card scope-card-positive">
                <div className="scope-icon"><Check size={16} aria-hidden="true" /></div>
                <h3>This calculator can</h3>
                <p>Estimate reported duration, occasions and cumulative quantity for one substance-period when the required inputs and a consistent unit are supplied; show the formula and mark explicitly overlapping co-use periods against a limited set of source-backed warnings.</p>
              </article>
              <article className="scope-card scope-card-limits">
                <div className="scope-icon"><CircleHelp size={16} aria-hidden="true" /></div>
                <h3>This calculator cannot</h3>
                <p>Determine a diagnosis, addiction probability, safe dose, substance contents, brain age, impairment, recovery time or lifespan. An unassessed combination or missing estimate is not evidence of safety.</p>
              </article>
            </div>
          </section>

          <SourceNotes dataset={dataset} />

          <footer className="site-footer">
            <a className="footer-brand" href="#overview"><img src="/fieldnotes-mark.svg" width="24" height="24" alt="" /> SUBSTANCE / FIELD NOTES</a>
            <span>For education only. If someone's safety is at risk, contact emergency services.</span>
            <a href="#sources">Sources & limitations <ArrowUpRight size={13} aria-hidden="true" /></a>
          </footer>
        </main>
      </div>
    </div>
  );
}
