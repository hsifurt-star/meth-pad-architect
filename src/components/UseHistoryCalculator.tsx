import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowUpRight, Calculator, Plus, ShieldCheck, Trash2, X } from 'lucide-react';
import { getInteractionFindings } from '../lib/interaction-checker';
import { calculatePeriod } from '../lib/history-calculations';
import type { UsePeriod } from '../types/history';
import type { SubstanceRecord } from '../types/substance';

interface UseHistoryCalculatorProps {
  records: SubstanceRecord[];
  currentAge: number | null;
  onCurrentAgeChange: (age: number | null) => void;
  periods: UsePeriod[];
  onPeriodsChange: (periods: UsePeriod[]) => void;
  onAddPeriod: (record: SubstanceRecord) => void;
  onClear: () => void;
  canAddPeriod: boolean;
  maxPeriods: number;
}

interface CoUsePair {
  key: string;
  left: UsePeriod;
  right: UsePeriod;
  leftRecord: SubstanceRecord;
  rightRecord: SubstanceRecord;
  label: string;
}

function parseOptionalNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function pairKey(leftId: string, rightId: string): string {
  return [leftId, rightId].sort().join('::');
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value);
}

export function UseHistoryCalculator({
  records,
  currentAge,
  onCurrentAgeChange,
  periods,
  onPeriodsChange,
  onAddPeriod,
  onClear,
  canAddPeriod,
  maxPeriods,
}: UseHistoryCalculatorProps) {
  const [search, setSearch] = useState('');
  const [coUsePairs, setCoUsePairs] = useState<Set<string>>(new Set());
  const recordById = useMemo(() => new Map(records.map((record) => [record.id, record])), [records]);

  const matches = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return [];
    return records
      .filter((record) => [record.name, ...record.chemicalClasses, ...record.psychoactiveClasses].join(' ').toLocaleLowerCase().includes(term))
      .slice(0, 8);
  }, [records, search]);

  const pairs = useMemo<CoUsePair[]>(() => {
    const result: CoUsePair[] = [];
    const periodNumberById = new Map<string, number>();
    const countBySubstance = new Map<string, number>();
    for (const period of periods) {
      if (!recordById.has(period.substanceId)) continue;
      const count = (countBySubstance.get(period.substanceId) ?? 0) + 1;
      countBySubstance.set(period.substanceId, count);
      periodNumberById.set(period.id, count);
    }
    for (let leftIndex = 0; leftIndex < periods.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < periods.length; rightIndex += 1) {
        const left = periods[leftIndex];
        const right = periods[rightIndex];
        if (left.substanceId === right.substanceId) continue;
        const leftRecord = recordById.get(left.substanceId);
        const rightRecord = recordById.get(right.substanceId);
        if (!leftRecord || !rightRecord) continue;
        const leftNumber = periodNumberById.get(left.id) ?? leftIndex + 1;
        const rightNumber = periodNumberById.get(right.id) ?? rightIndex + 1;
        result.push({
          key: pairKey(left.id, right.id),
          left,
          right,
          leftRecord,
          rightRecord,
          label: `${leftRecord.name} · period ${leftNumber} + ${rightRecord.name} · period ${rightNumber}`,
        });
      }
    }
    return result;
  }, [periods, recordById]);

  const validPairKeys = useMemo(() => new Set(pairs.map((pair) => pair.key)), [pairs]);
  useEffect(() => {
    setCoUsePairs((current) => new Set([...current].filter((key) => validPairKeys.has(key))));
  }, [validPairKeys]);

  const updatePeriod = (periodId: string, patch: Partial<UsePeriod>) => {
    onPeriodsChange(periods.map((period) => period.id === periodId ? { ...period, ...patch } : period));
  };

  const toggleRoute = (period: UsePeriod, route: string) => {
    const routes = period.routes.includes(route)
      ? period.routes.filter((item) => item !== route)
      : [...period.routes, route];
    updatePeriod(period.id, { routes });
  };

  const togglePair = (key: string) => {
    setCoUsePairs((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section className="calculator-section" id="calculator" aria-labelledby="calculator-title">
      <div className="calculator-intro">
        <div>
          <div className="section-kicker"><span className="kicker-mark">01</span> Multi-substance history</div>
          <h2 id="calculator-title">Build a use-history profile</h2>
          <p>Add one period for each typical pattern. If a substance's dose or frequency changed, split it into separate periods. Up to {maxPeriods} periods fit in one profile; your entries stay in this page session.</p>
        </div>
        <div className="calculator-symbol" aria-hidden="true"><Calculator size={23} /></div>
      </div>

      <div className="calculator-privacy"><ShieldCheck size={16} aria-hidden="true" /><span>Private by default: this history is not sent to a server or saved after you leave or refresh.</span></div>

      <div className="calculator-age-card">
        <label htmlFor="current-age">Current age <span>optional</span></label>
        <input id="current-age" type="number" min="1" max="120" step="1" inputMode="numeric" placeholder="e.g. 32" value={currentAge ?? ''} onChange={(event) => onCurrentAgeChange(parseOptionalNumber(event.target.value))} />
        <p>Used only to estimate the age at the start of an ongoing period. It does not change any interaction warning or health-risk score.</p>
      </div>

      <div className="substance-picker">
        <label htmlFor="calculator-substance-search">Add a substance or another use period</label>
        <div className="search-field calculator-search-field">
          <input id="calculator-substance-search" type="search" autoComplete="off" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the indexed substances" aria-controls="calculator-search-results" aria-expanded={matches.length > 0} />
          {search && <button type="button" className="search-clear" aria-label="Clear search" onClick={() => setSearch('')}><X size={16} aria-hidden="true" /></button>}
        </div>
        {search.trim() && (
          <div id="calculator-search-results" className="calculator-search-results" aria-live="polite">
            {matches.length === 0 ? <p>No indexed substance matches that search.</p> : matches.map((record) => (
                <button type="button" key={record.id} disabled={!canAddPeriod} onClick={() => { onAddPeriod(record); setSearch(''); }}>
                  <span><strong>{record.name}</strong><small>{record.psychoactiveClasses.length ? record.psychoactiveClasses.join(' · ') : 'Class not listed'}</small></span>
                  <span className="add-period-label">{canAddPeriod ? <><Plus size={14} aria-hidden="true" /> Add period</> : `Limit reached (${maxPeriods})`}</span>
              </button>
            ))}
            {!canAddPeriod && <p className="search-more-note" role="status">This profile is at its {maxPeriods}-period limit. Remove a period or clear the history to add another.</p>}
            {records.filter((record) => [record.name, ...record.chemicalClasses, ...record.psychoactiveClasses].join(' ').toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())).length > matches.length && <p className="search-more-note">Showing the first 8 matches. Refine your search to narrow results.</p>}
          </div>
        )}
      </div>

      {periods.length === 0 ? (
        <div className="calculator-empty">
          <div className="empty-mark"><Plus size={18} aria-hidden="true" /></div>
          <div><strong>No use periods added</strong><p>Search above to add one or more substances. You can add the same substance again to represent a different period or pattern.</p></div>
        </div>
      ) : (
        <>
          <div className="period-list" aria-label="Use periods">
            {periods.map((period, index) => {
              const record = recordById.get(period.substanceId);
              if (!record) return null;
              const calculation = calculatePeriod(period, currentAge);
              const unitOptions = [
                { value: '', label: 'Select unit' },
                { value: 'mg', label: 'mg' },
                { value: 'g', label: 'g' },
                { value: 'mcg', label: 'mcg' },
                { value: 'mL', label: 'mL' },
                { value: 'tablets', label: 'tablets' },
                { value: 'other', label: 'Other (label it)' },
              ];
              return (
                <article className="period-card" key={period.id}>
                  <header className="period-header">
                    <div>
                      <div className="period-overline">PERIOD {String(index + 1).padStart(2, '0')}</div>
                      <h3>{record.name}</h3>
                      <p>{record.psychoactiveClasses.length ? record.psychoactiveClasses.join(' · ') : 'Source class not listed'}</p>
                    </div>
                    <div className="period-header-actions">
                      <a href={record.sourceUrl} target="_blank" rel="noreferrer" aria-label={`Open the source page for ${record.name}`}><ArrowUpRight size={15} aria-hidden="true" /> Source</a>
                      <button type="button" className="remove-period" onClick={() => onPeriodsChange(periods.filter((item) => item.id !== period.id))} aria-label={`Remove ${record.name}, period ${index + 1}`}><Trash2 size={16} aria-hidden="true" /></button>
                    </div>
                  </header>

                  <div className="period-fields">
                    <label htmlFor={`duration-${period.id}`}>Duration of this pattern <span>years</span>
                      <input id={`duration-${period.id}`} type="number" min="0" max="120" step="0.1" inputMode="decimal" placeholder="e.g. 2.5" value={period.durationYears ?? ''} onChange={(event) => updatePeriod(period.id, { durationYears: parseOptionalNumber(event.target.value) })} />
                    </label>
                    <label htmlFor={`frequency-${period.id}`}>Typical occasions <span>per week</span>
                      <input id={`frequency-${period.id}`} type="number" min="0" max="1000" step="0.1" inputMode="decimal" placeholder="e.g. 3" value={period.occasionsPerWeek ?? ''} onChange={(event) => updatePeriod(period.id, { occasionsPerWeek: parseOptionalNumber(event.target.value) })} />
                    </label>
                    <label htmlFor={`amount-${period.id}`}>Typical amount <span>per occasion · optional</span>
                      <input id={`amount-${period.id}`} type="number" min="0" step="any" inputMode="decimal" placeholder="e.g. 10" value={period.amountPerOccurrence ?? ''} onChange={(event) => updatePeriod(period.id, { amountPerOccurrence: parseOptionalNumber(event.target.value) })} />
                    </label>
                    <label htmlFor={`unit-${period.id}`}>Amount unit
                      <select id={`unit-${period.id}`} value={period.amountUnit} onChange={(event) => updatePeriod(period.id, { amountUnit: event.target.value as UsePeriod['amountUnit'] })}>
                        {unitOptions.map((option) => <option key={option.value || 'blank'} value={option.value}>{option.label}</option>)}
                      </select>
                    </label>
                    {period.amountUnit === 'other' && <label htmlFor={`custom-unit-${period.id}`}>Name the unit
                      <input id={`custom-unit-${period.id}`} type="text" maxLength={20} placeholder="e.g. units" value={period.customUnitLabel ?? ''} onChange={(event) => updatePeriod(period.id, { customUnitLabel: event.target.value })} />
                    </label>}
                  </div>

                  <div className="period-options">
                    <label className="checkline"><input type="checkbox" checked={period.activeNow} onChange={(event) => updatePeriod(period.id, { activeNow: event.target.checked })} /> This pattern is ongoing now</label>
                    {period.activeNow ? (
                      calculation.estimatedAgeAtStart !== null && <div className="age-result">Approximate age this period began: <strong>{formatNumber(calculation.estimatedAgeAtStart)}</strong> <span>(current age minus duration)</span></div>
                    ) : (
                      <label className="ended-age-field" htmlFor={`start-age-${period.id}`}>Age when this period began <span>optional</span>
                        <input id={`start-age-${period.id}`} type="number" min="0" max="120" step="0.1" inputMode="decimal" placeholder="e.g. 24" value={period.ageAtStart ?? ''} onChange={(event) => updatePeriod(period.id, { ageAtStart: parseOptionalNumber(event.target.value) })} />
                      </label>
                    )}
                  </div>

                  <fieldset className="route-fieldset">
                    <legend>Reported route(s) <span>select all that apply; source metadata only</span></legend>
                    {record.reportedRoutes.length === 0 ? <p className="route-empty">No route labels are listed in this source snapshot.</p> : (
                      <div className="route-options">
                        {record.reportedRoutes.map((route) => <label key={route} className={`route-option ${period.routes.includes(route) ? 'is-active' : ''}`}><input type="checkbox" checked={period.routes.includes(route)} onChange={() => toggleRoute(period, route)} />{route}</label>)}
                      </div>
                    )}
                  </fieldset>

                  <div className="period-calculations" aria-live="polite">
                    <div className="calc-heading"><Calculator size={15} aria-hidden="true" /><span>What the entries calculate</span><small>arithmetic only</small></div>
                    <div className="calc-result-grid">
                      <div><span>Duration entered</span><strong>{calculation.durationYears === null ? 'Add duration' : `${formatNumber(calculation.durationYears)} years`}</strong></div>
                      <div><span>Approx. occasions</span><strong>{calculation.estimatedOccasions === null ? 'Add duration + frequency' : formatNumber(calculation.estimatedOccasions)}</strong></div>
                    <div><span>Approx. total amount</span><strong>{calculation.estimatedTotalAmount === null ? (period.amountUnit === 'other' && !period.customUnitLabel.trim() ? 'Name a unit to calculate' : 'Add amount, unit, duration + frequency') : `${formatNumber(calculation.estimatedTotalAmount)} ${calculation.amountUnitLabel ?? calculation.amountUnit}`}</strong></div>
                  </div>
                  {calculation.messages.some((message) => !message.startsWith('Add ')) && <p className="calc-validation-note">{calculation.messages.filter((message) => !message.startsWith('Add ')).join(' ')}</p>}
                    <p className="formula-note">Occasions ≈ years × 52.18 weeks/year × occasions/week. Total amount ≈ occasions × amount/occasion. This assumes the entered average stayed typical for the full period; split changed patterns into separate periods. Values are not a toxicology or health-risk estimate.</p>
                  </div>
                </article>
              );
            })}
          </div>

          <section className="co-use-section" aria-labelledby="co-use-title">
            <div className="co-use-heading"><div><div className="section-kicker"><span className="kicker-mark">02</span> Combination context</div><h3 id="co-use-title">Mark periods used together</h3><p>Only mark a pair if the periods overlapped in time. This does not estimate a personal risk.</p></div></div>
            {pairs.length === 0 ? <p className="co-use-empty">Add different substances to mark any overlapping-use pairs.</p> : (
              <div className="co-use-pairs">
                {pairs.map((pair) => {
                  const selected = coUsePairs.has(pair.key);
                  const findings = selected ? getInteractionFindings([pair.leftRecord, pair.rightRecord]) : [];
                  return (
                    <article className={`co-use-pair ${selected ? 'is-selected' : ''}`} key={pair.key}>
                      <label className="co-use-toggle"><input type="checkbox" checked={selected} onChange={() => togglePair(pair.key)} /><span><strong>{pair.label}</strong><small>Mark as overlapping use</small></span></label>
                      {selected && findings.length > 0 && findings.map((finding) => <div className="co-use-finding" key={finding.id}><AlertTriangle size={17} aria-hidden="true" /><div><strong>{finding.title}</strong><p>{finding.summary}</p><a href={finding.sourceUrl} target="_blank" rel="noreferrer">{finding.sourceLabel} <ArrowUpRight size={13} aria-hidden="true" /></a></div></div>)}
                      {selected && findings.length === 0 && <p className="co-use-unknown" role="status"><strong>No matching rule is available for this pair.</strong> This is not evidence that the combination is safe. Check professional or official sources.</p>}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <div className="calculator-limits"><AlertTriangle size={17} aria-hidden="true" /><p><strong>This cannot calculate addiction probability, safe dosage, brain age, recovery time, or lifespan.</strong> No validated model in this tool combines these entered histories into a personal prognosis. Screening tools and sources are linked below; screening is not diagnosis.</p></div>
          <button type="button" className="clear-history-button" onClick={onClear}><Trash2 size={15} aria-hidden="true" /> Clear all history from this session</button>
        </>
      )}

      <p className="calculator-data-note">Substance names, classes and route labels come from the attributed community index below. Missing data means “not listed,” not “does not exist.”</p>
    </section>
  );
}
