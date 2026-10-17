import { ArrowUpRight, BookOpen, Info } from 'lucide-react';
import type { SubstanceDataset } from '../types/substance';

interface SourceNotesProps {
  dataset: SubstanceDataset;
}

const references = [
  { title: 'CDC · About polysubstance overdose', detail: 'Public-health surveillance and prevention context; co-involvement does not itself establish an individual outcome.', url: 'https://www.cdc.gov/overdose-prevention/about/polysubstance-overdose.html' },
  { title: 'NIAAA · Alcohol and potentially dangerous medication mixes', detail: 'Evidence for the exact, source-named alcohol + opioid and alcohol + benzodiazepine entries matched here.', url: 'https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/alcohol-medication-interactions-potentially-dangerous-mixes' },
  { title: 'CDC · Stimulant overdose guide', detail: 'Emergency signs and actions for suspected stimulant overdose.', url: 'https://www.cdc.gov/overdose-prevention/media/pdfs/2024/03/CDC-Stimulant-Guide.pdf' },
  { title: 'NIDA · Methamphetamine', detail: 'Official information on known short- and long-term health risks; not an individual prediction.', url: 'https://nida.nih.gov/research-topics/methamphetamine' },
  { title: 'SAMHSA · National Helpline', detail: 'U.S.-specific, free, confidential, 24/7 treatment-referral information service.', url: 'https://www.samhsa.gov/find-help/national-helpline' },
];

const contentReviewedAt = '17 October 2026';

export function SourceNotes({ dataset }: SourceNotesProps) {
  const refreshedDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(dataset.retrievedAt));

  return (
    <section className="sources-section" id="sources" aria-labelledby="sources-title">
      <div className="section-kicker"><span className="kicker-mark">05</span> Sources & limits</div>
      <h2 id="sources-title">Show the evidence. Show the gaps.</h2>
      <p className="sources-lede">This site avoids personal health forecasts because the available population studies do not validate them. It cannot measure brain health, diagnose a condition, predict recovery or lifespan, tell you a safe dose, or clear a substance combination.</p>

      <div className="source-dataset-card">
        <BookOpen size={20} aria-hidden="true" />
        <div>
          <h3>{dataset.recordCount} reference records · {dataset.source}</h3>
          <p>Snapshot retrieved {refreshedDate}. Names, class labels, and reported route metadata are community-curated and may be incomplete or wrong. A missing item is not evidence that a substance or route does not exist.</p>
          <p>Source notes last checked {contentReviewedAt}; this is not a clinical review. One record, 1,3-Butanediol, is retained by name and source link while its upstream class and route fields are withheld for a data-consistency issue.</p>
          <p>{dataset.attribution}</p>
          <div className="source-actions">
            <a href={dataset.sourceUrl} target="_blank" rel="noreferrer">Open public API <ArrowUpRight size={14} /></a>
            <a href={dataset.copyrightUrl} target="_blank" rel="noreferrer">PsychonautWiki reuse terms <ArrowUpRight size={14} /></a>
            <a href={dataset.licenseUrl} target="_blank" rel="noreferrer">CC BY 4.0 license <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </div>

      <div className="reference-list">
        {references.map((reference, index) => (
          <article className="reference-item" key={reference.title}>
            <span className="reference-number">{String(index + 1).padStart(2, '0')}</span>
            <div><a href={reference.url} target="_blank" rel="noreferrer">{reference.title} <ArrowUpRight size={14} aria-hidden="true" /></a><p>{reference.detail}</p></div>
          </article>
        ))}
      </div>

      <div className="limitations-note"><Info size={17} aria-hidden="true" /><p><strong>Not a clinical tool.</strong> Interaction coverage is deliberately narrow. A warning is general information, not a personal risk estimate; no warning means “not assessed here,” not “safe.” Verify prescription questions with an official label, pharmacist, or clinician.</p></div>
    </section>
  );
}
