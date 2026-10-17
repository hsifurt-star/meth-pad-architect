import { AlertTriangle, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { getInteractionFindings, hasUnassessedCombination } from '../lib/interaction-checker';
import type { SubstanceRecord } from '../types/substance';

interface InteractionCheckerProps {
  selected: SubstanceRecord[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function InteractionChecker({ selected, onRemove, onClear }: InteractionCheckerProps) {
  const findings = getInteractionFindings(selected);
  const unassessed = hasUnassessedCombination(selected, findings);

  return (
    <section className="checker-card" aria-labelledby="checker-title">
      <div className="checker-heading">
        <div className="section-kicker"><span className="kicker-mark">02</span> Interaction context</div>
        <h2 id="checker-title">Check selected substances</h2>
        <p>This is a narrow reference check, not a complete interaction database or personal risk score.</p>
      </div>

      <div className="checker-selection" aria-live="polite">
        {selected.length === 0 ? (
          <p className="empty-selection">Add substances from the index below to see whether this guide has a source-backed warning.</p>
        ) : (
          <>
            <div className="selection-chips">
              {selected.map((substance) => (
                <span className="selection-chip" key={substance.id}>
                  {substance.name}
                  <button type="button" onClick={() => onRemove(substance.id)} aria-label={`Remove ${substance.name}`}>
                    <X size={14} aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
            <button className="text-button" type="button" onClick={onClear}>Clear selection</button>
          </>
        )}
      </div>

      {selected.length === 1 && (
        <div className="checker-neutral"><ShieldCheck size={17} aria-hidden="true" /><span>Select another substance to check the limited interaction rules.</span></div>
      )}

      {findings.map((finding) => (
        <article className="finding-card" key={finding.id}>
          <div className="finding-symbol"><AlertTriangle size={18} aria-hidden="true" /></div>
          <div>
            <h3>{finding.title}</h3>
            <p>{finding.summary}</p>
            <a className="source-link" href={finding.sourceUrl} target="_blank" rel="noreferrer">
              {finding.sourceLabel} <ExternalLink size={13} aria-hidden="true" />
            </a>
          </div>
        </article>
      ))}

      {unassessed && (
        <div className="checker-unknown" role="status">
          <strong>No matching rule in this limited checker.</strong> That does not mean the combination is safe. Other selected pairs are not assessed here. Check official medication information and contact a pharmacist or clinician; seek emergency help for urgent symptoms.
        </div>
      )}

      {selected.length > 1 && findings.length > 0 && (
        <p className="checker-footnote">Only the warning(s) listed above were matched. Any other pair in your selection has not been assessed by this tool.</p>
      )}

      <p className="privacy-note">Your selection stays in this tab only. Nothing is sent to a server or saved.</p>
    </section>
  );
}
