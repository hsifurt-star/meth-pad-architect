import { ArrowUpRight, BookOpen, Info } from 'lucide-react';
import type { SubstanceDataset } from '../types/substance';

interface SourceNotesProps {
  dataset: SubstanceDataset;
}

const references = [
  { title: 'WHO · ASSIST manual for primary care', detail: 'A substance-specific screening tool intended to support early identification and care/referral in health-care settings; it is not a personal probability model.', url: 'https://www.who.int/publications/i/item/978924159938-2' },
  { title: 'NIDA · TAPS screening tool', detail: 'A two-stage screen with substance-specific risk categories. NIDA says it should be used under medical-provider supervision and is not for self-diagnosis; sensitivity differs across substances.', url: 'https://nida.nih.gov/taps2/' },
  { title: 'Peer-reviewed · TAPS validation in community pharmacies', detail: 'A study of adults filling opioid prescriptions in 19 pharmacies; performance varied by substance and threshold, so it does not validate a universal estimate for arbitrary mixtures.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8712403/' },
  { title: 'CDC · About polysubstance overdose', detail: 'Public-health surveillance and prevention context; co-involvement does not itself establish an individual outcome.', url: 'https://www.cdc.gov/overdose-prevention/about/polysubstance-overdose.html' },
  { title: 'NIAAA · Alcohol and potentially dangerous medication mixes', detail: 'Evidence for the exact, source-named alcohol + opioid and alcohol + benzodiazepine entries matched here.', url: 'https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/alcohol-medication-interactions-potentially-dangerous-mixes' },
  { title: 'CDC · Stimulant overdose guide', detail: 'Emergency signs and actions for suspected stimulant overdose.', url: 'https://www.cdc.gov/overdose-prevention/media/pdfs/2024/03/CDC-Stimulant-Guide.pdf' },
  { title: 'SAMHSA · National Helpline', detail: 'U.S.-specific, free, confidential, 24/7 treatment-referral information service.', url: 'https://www.samhsa.gov/find-help/national-helpline' },
];

const contentReviewedAt = '17 October 2026';

export function SourceNotes({ dataset }: SourceNotesProps) {
  const refreshedDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(dataset.retrievedAt));

  return (
    <section className="sources-section" id="sources" aria-labelledby="sources-title">
      <div className="section-kicker"><span className="kicker-mark">05</span> Sources & limits</div>
      <h2 id="sources-title">Show the formula. Show the gaps.</h2>
      <p className="sources-lede">The calculator reports user-entered arithmetic for one period at a time. Individual probabilities of addiction, overdose, brain changes, recovery, or lifespan are not estimable from this calculator; no validated model matches this set of inputs. It does not apply a dose/route multiplier or convert that history into a personal medical outcome. Clinical screening links and their limits are listed below.</p>

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

      <div className="calculation-method-note"><Info size={17} aria-hidden="true" /><p><strong>How totals are derived:</strong> duration in years × 52.18 weeks/year × average occasions/week = approximate occasions; approximate occasions × user-entered amount/occasion = approximate amount for that single period in its entered unit. This assumes the average pattern held for the whole period. No units are converted and amounts are not summed across substances. This is not toxicology or a validated health-risk estimate.</p></div>
      <div className="limitations-note"><Info size={17} aria-hidden="true" /><p><strong>Not a clinical tool.</strong> Interaction coverage is deliberately narrow. A warning is general information, not a personal risk estimate; no warning means “not assessed here,” not “safe.” Screening resources are not diagnoses. Verify medication questions with an official label, pharmacist, or clinician.</p></div>
    </section>
  );
}
