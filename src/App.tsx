import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BookOpen, Check, CircleHelp, Info, LockKeyhole, ShieldAlert } from 'lucide-react';
import { EmergencyPanel } from './components/EmergencyPanel';
import { InteractionChecker } from './components/InteractionChecker';
import { SourceNotes } from './components/SourceNotes';
import { SubstanceDirectory } from './components/SubstanceDirectory';
import substanceIndex from './data/substances.json';
import type { SubstanceDataset, SubstanceRecord } from './types/substance';

const dataset = substanceIndex as SubstanceDataset;

const navigation = [
  { href: '#overview', label: 'Overview', number: '00' },
  { href: '#emergency', label: 'Immediate help', number: '01' },
  { href: '#checker', label: 'Interaction context', number: '02' },
  { href: '#directory', label: 'Substance index', number: '03' },
  { href: '#sources', label: 'Sources & limits', number: '05' },
];

export default function App() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedRecords = useMemo(
    () => dataset.records.filter((record) => selectedIds.includes(record.id)),
    [selectedIds],
  );

  const toggleSelected = (record: SubstanceRecord) => {
    setSelectedIds((current) => current.includes(record.id)
      ? current.filter((id) => id !== record.id)
      : [...current, record.id]);
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <header className="topbar">
        <a className="brand" href="#overview" aria-label="Substance Field Guide home">
          <img src="/fieldnotes-mark.svg" width="36" height="36" alt="" />
          <span className="brand-wordmark">SUBSTANCE<span>FIELD GUIDE</span></span>
        </a>
        <div className="topbar-meta">
          <span className="edition-label">A public-health reference</span>
          <span className="privacy-status"><LockKeyhole size={14} aria-hidden="true" /> No account · no saved selections</span>
        </div>
      </header>

      <div className="safety-ribbon" role="note">
        <span><ShieldAlert size={17} aria-hidden="true" /><strong>Possible medical emergency?</strong> Call your local emergency number.</span>
        <a href="#emergency">Signs and what to do <ArrowUpRight size={14} aria-hidden="true" /></a>
      </div>

      <div className="page-layout">
        <nav className="section-nav" aria-label="Page sections">
          <div className="nav-caption">IN THIS GUIDE</div>
          {navigation.map((item) => (
            <a className="nav-link" key={item.href} href={item.href}>
              <span className="nav-number">{item.number}</span>{item.label}
            </a>
          ))}
          <div className="nav-note">
            <LockKeyhole size={15} aria-hidden="true" />
            <p>Your selections stay in this browser tab. They are not stored in an account or sent to a server.</p>
          </div>
          <div className="nav-source-count"><BookOpen size={15} aria-hidden="true" /><span>{dataset.recordCount} index records<br />Snapshot · {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(dataset.retrievedAt))}</span></div>
        </nav>

        <main id="main-content" className="main-content">
          <EmergencyPanel />

          <section className="hero-section" id="overview">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> SAFETY INFORMATION · EVIDENCE FIRST</div>
              <h1>Clear information.<br /><em>No false precision.</em></h1>
              <p className="hero-lede">A searchable substance reference and a focused interaction checker—built to show what a source says, and where the evidence stops.</p>
              <div className="hero-actions">
                <a className="button-primary" href="#directory">Browse the index <ArrowDownRight size={16} aria-hidden="true" /></a>
                <a className="button-secondary" href="#checker">Check selected substances <ArrowUpRight size={15} aria-hidden="true" /></a>
              </div>
            </div>
            <aside className="hero-note" aria-label="Evidence principle">
              <div className="hero-note-top"><span>FIELD NOTE</span><span>NO. 001</span></div>
              <div className="hero-note-mark"><span /> <span /> <span /></div>
              <p>Population research is not a personal measurement.</p>
              <div className="hero-note-bottom"><span>UNCERTAINTY</span><strong>MAKE IT VISIBLE</strong></div>
            </aside>
          </section>

          <div className="measure-strip" aria-label="How this reference works">
            <div><strong>{dataset.recordCount}</strong><span>substances indexed</span></div>
            <div><strong>02</strong><span>focused interaction rules</span></div>
            <div><strong>0</strong><span>personal scores or forecasts</span></div>
          </div>

          <section className="checker-section" id="checker">
            <div className="section-heading-row">
              <div>
                <div className="section-kicker"><span className="kicker-mark">02</span> Limited reference tool</div>
                <h2>Check interaction context</h2>
                <p>Select more than one substance from the index. The checker only displays a warning when its specific sources support one; everything else is unassessed.</p>
              </div>
              <div className="not-a-score"><Info size={15} aria-hidden="true" /> No numeric risk score</div>
            </div>
            <InteractionChecker selected={selectedRecords} onRemove={(id) => setSelectedIds((current) => current.filter((item) => item !== id))} onClear={() => setSelectedIds([])} />
          </section>

          <section className="library-section" id="directory">
            <SubstanceDirectory records={dataset.records} selectedIds={selectedIds} onToggle={toggleSelected} />
          </section>

          <section className="can-cannot-section" aria-labelledby="scope-title">
            <div className="section-kicker"><span className="kicker-mark">04</span> Scope, at a glance</div>
            <h2 id="scope-title">Useful context, not a verdict.</h2>
            <div className="scope-columns">
              <article className="scope-card scope-card-positive">
                <div className="scope-icon"><Check size={16} aria-hidden="true" /></div>
                <h3>This guide can</h3>
                <p>Show directory metadata, link each entry to its source, and flag a small number of interactions described by an official public-health source.</p>
              </article>
              <article className="scope-card scope-card-limits">
                <div className="scope-icon"><CircleHelp size={16} aria-hidden="true" /></div>
                <h3>This guide cannot</h3>
                <p>Identify a safe dose or mixture, verify a substance's contents, diagnose a condition, or predict an individual's brain health, impairment, recovery, or lifespan.</p>
              </article>
            </div>
          </section>

          <SourceNotes dataset={dataset} />

          <footer className="site-footer">
            <a className="footer-brand" href="#overview"><img src="/fieldnotes-mark.svg" width="24" height="24" alt="" /> SUBSTANCE / FIELD GUIDE</a>
            <span>For education only. If someone's safety is at risk, contact emergency services.</span>
            <a href="#sources">Sources & limitations <ArrowUpRight size={13} aria-hidden="true" /></a>
          </footer>
        </main>
      </div>
    </div>
  );
}
