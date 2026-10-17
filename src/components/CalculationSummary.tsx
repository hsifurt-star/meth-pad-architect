import type { UsePeriod } from '../types/history';

interface CalculationSummaryProps {
  periods: UsePeriod[];
}

const LIFE_EXPECTANCY_COHORT = 'https://www.sciencedirect.com/science/article/pii/S0022395620309249';

export function CalculationSummary({ periods }: CalculationSummaryProps) {
  const distinctSubstances = new Set(periods.map((period) => period.substanceId)).size;

  return (
    <aside className="summary-rail" aria-labelledby="summary-title">
      <div className="rail-kicker"><span className="rail-mark" aria-hidden="true" /> LIVE SUMMARY</div>
      <h2 id="summary-title">This session</h2>

      <dl className="summary-counts" aria-live="polite">
        <div><dt>Use periods</dt><dd>{periods.length}</dd></div>
        <div><dt>Substances</dt><dd>{distinctSubstances}</dd></div>
      </dl>

      <div className="rail-rule" />

      <section className="life-years-result" aria-labelledby="life-years-title">
        <div className="rail-label">PERSONAL LIFE-YEARS LOST</div>
        <h3 id="life-years-title">Not estimable</h3>
        <p>These entries cannot predict one person’s lifespan. A made-up number would look more certain than the evidence.</p>
        <details className="population-evidence">
          <summary>See a population finding</summary>
          <div>
            <p>One New South Wales cohort of 47,197 people prescribed opioid agonist treatment (2001–2018) had an estimated average life expectancy about 15 years below the general population. That group result is not your estimate and does not transfer to other drugs or histories.</p>
            <a href={LIFE_EXPECTANCY_COHORT} target="_blank" rel="noreferrer">Read the cohort study <span aria-hidden="true">↗</span></a>
          </div>
        </details>
      </section>

      <p className="rail-privacy"><span aria-hidden="true">—</span> Nothing here is saved or sent.</p>
    </aside>
  );
}
