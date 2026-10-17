import { ArrowUpRight } from 'lucide-react';
import type { SubstanceDataset } from '../types/substance';

interface SourceNotesProps {
  dataset: SubstanceDataset;
}

const references = [
  { title: 'NIAAA · alcohol and medication interactions', detail: 'Source for the exact alcohol–opioid and alcohol–benzodiazepine interaction entries.', url: 'https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/alcohol-medication-interactions-potentially-dangerous-mixes' },
  { title: 'WHO · ASSIST manual', detail: 'Substance-specific screening for health-care settings; not an individual outcome probability.', url: 'https://www.who.int/publications/i/item/978924159938-2' },
  { title: 'NIDA · TAPS screening tool', detail: 'NIDA says the tool should be used under provider supervision and is not for self-diagnosis.', url: 'https://nida.nih.gov/taps2/' },
  { title: 'Predictive models for opioid outcomes · 2024 review', detail: 'Outcome-specific models; heterogeneous performance and predominantly high risk of bias.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11150108/' },
  { title: 'Lewer et al. · opioid agonist treatment cohort', detail: 'A New South Wales cohort estimate; group context only, not an individual forecast.', url: 'https://www.sciencedirect.com/science/article/pii/S0022395620309249' },
  { title: 'CDC · stimulant emergency guidance', detail: 'Emergency signs and response guidance.', url: 'https://www.cdc.gov/overdose-prevention/media/pdfs/2024/03/CDC-Stimulant-Guide.pdf' },
  { title: 'SAMHSA · National Helpline', detail: 'U.S. treatment-referral information, 24/7; not an emergency line.', url: 'https://www.samhsa.gov/find-help/national-helpline' },
];

const contentReviewedAt = '18 October 2026';

export function SourceNotes({ dataset }: SourceNotesProps) {
  const refreshedDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(dataset.retrievedAt));

  return (
    <section className="sources-section" id="sources" aria-labelledby="sources-title">
      <details className="source-disclosure">
        <summary id="sources-title"><span>Evidence, data &amp; method</span><small>{dataset.recordCount} records · checked {contentReviewedAt}</small></summary>
        <div className="source-disclosure-body">
          <div className="source-dataset-card">
            <h3>{dataset.source} semantic data · snapshot {refreshedDate}</h3>
            <p>{dataset.attribution} The index contains names, class labels, source links, and reported routes only. Community metadata can be incomplete; a missing label does not mean “does not exist” or “safe.”</p>
            <div className="source-actions">
              <a href={dataset.sourceUrl} target="_blank" rel="noreferrer">Public API <ArrowUpRight size={12} aria-hidden="true" /></a>
              <a href={dataset.copyrightUrl} target="_blank" rel="noreferrer">Reuse terms <ArrowUpRight size={12} aria-hidden="true" /></a>
              <a href={dataset.licenseUrl} target="_blank" rel="noreferrer">CC BY 4.0 <ArrowUpRight size={12} aria-hidden="true" /></a>
            </div>
            <p className="data-exception">One source record, 1,3-Butanediol, is retained by name and link while inconsistent upstream class/route labels are withheld pending review.</p>
          </div>

          <div className="method-note">
            <h3>What the calculator does</h3>
            <p>Approximate occasions = years × 365.2425 ÷ 7 × average occasions/week. Approximate amount = occasions × amount/occasion. The entered average is assumed to hold throughout each period. Units are not converted; totals are never added across substances or periods. Routes do not alter the calculation.</p>
          </div>

          <div className="limitation-note">
            <h3>What it cannot estimate</h3>
            <p>This is not a diagnosis, toxicology model, safe-dose guide, or personal prediction of addiction, overdose, brain health, recovery, or lifespan. A missing interaction warning means “not assessed here,” not safe. The personal years-lost result is not estimable from these mixed inputs.</p>
          </div>

          <ol className="reference-list">
            {references.map((reference) => (
              <li className="reference-item" key={reference.title}>
                <a href={reference.url} target="_blank" rel="noreferrer">{reference.title} <ArrowUpRight size={12} aria-hidden="true" /></a>
                <p>{reference.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </details>
    </section>
  );
}
