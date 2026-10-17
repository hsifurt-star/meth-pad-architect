import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Trash2, X } from 'lucide-react';
import { getInteractionFindings } from '../lib/interaction-checker';
import { calculatePeriod, HISTORY_LIMITS } from '../lib/history-calculations';
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

  const searchTerm = search.trim().toLocaleLowerCase();
  const matchingRecords = useMemo(() => {
    if (!searchTerm) return [];
    return records.filter((record) => [
      record.name,
      ...record.chemicalClasses,
      ...record.psychoactiveClasses,
      ...record.reportedRoutes,
    ].join(' ').toLocaleLowerCase().includes(searchTerm));
  }, [records, searchTerm]);
  const matches = matchingRecords.slice(0, 8);

  const pairs = useMemo<CoUsePair[]>(() => {
    const result: CoUsePair[] = [];
    const periodNumberById = new Map<string, number>();

    periods.forEach((period, index) => {
      if (!recordById.has(period.substanceId)) return;
      periodNumberById.set(period.id, periodNumberById.get(period.id) ?? index + 1);
    });

    for (let leftIndex = 0; leftIndex < periods.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < periods.length; rightIndex += 1) {
        const left = periods[leftIndex];
        const right = periods[rightIndex];
        if (left.substanceId === right.substanceId) continue;
        const leftRecord = recordById.get(left.substanceId);
        const rightRecord = recordById.get(right.substanceId);
        if (!leftRecord || !rightRecord) continue;
        result.push({
          key: pairKey(left.id, right.id),
          left,
          right,
          leftRecord,
          rightRecord,
          label: `${leftRecord.name} · period ${periodNumberById.get(left.id)} + ${rightRecord.name} · period ${periodNumberById.get(right.id)}`,
        });
      }
    }
    return result;
  }, [periods, recordById]);

  const validPairKeys = useMemo(() => new Set(pairs.map((pair) => pair.key)), [pairs]);
  useEffect(() => {
    setCoUsePairs((current) => new Set([...current].filter((key) => validPairKeys.has(key))));
  }, [validPairKeys]);

  const markedPairs = useMemo(() => pairs
    .filter((pair) => coUsePairs.has(pair.key))
    .map((pair) => ({ ...pair, findings: getInteractionFindings([pair.leftRecord, pair.rightRecord]) })), [pairs, coUsePairs]);
  const currentAgeInvalid = currentAge !== null && (
    !Number.isInteger(currentAge)
    || currentAge < HISTORY_LIMITS.currentAge.min
    || currentAge > HISTORY_LIMITS.currentAge.max
  );

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
      <div className="calculator-heading">
        <div>
          <div className="section-kicker"><span className="section-number">01</span> USE PERIODS</div>
          <h2 id="calculator-title">Add a pattern</h2>
          <p>One period for each typical pattern. Split it when the frequency or amount changed.</p>
        </div>
        <label className="global-age-field" htmlFor="current-age">
          <span>Age now <small>optional</small></span>
          <input id="current-age" type="number" min={HISTORY_LIMITS.currentAge.min} max={HISTORY_LIMITS.currentAge.max} step="1" inputMode="numeric" placeholder="Years" value={currentAge ?? ''} aria-invalid={currentAgeInvalid} aria-describedby={currentAgeInvalid ? 'current-age-error' : undefined} onChange={(event) => onCurrentAgeChange(parseOptionalNumber(event.target.value))} />
          <small>For ongoing-period start age only</small>
          {currentAgeInvalid && <small id="current-age-error" className="current-age-error">Enter a whole age from 1 to 120.</small>}
        </label>
      </div>

      <div className="calculator-status">
        <span>Entries stay in this page session; refreshing clears them.</span>
        <span>{periods.length} / {maxPeriods} periods</span>
      </div>

      <div className="substance-picker">
        <label htmlFor="calculator-substance-search">Add a substance or another period</label>
        <div className="search-field calculator-search-field">
          <input id="calculator-substance-search" type="search" autoComplete="off" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search names, classes or routes" aria-controls="calculator-search-results" aria-expanded={Boolean(searchTerm)} />
          {search && <button type="button" className="search-clear" aria-label="Clear search" onClick={() => setSearch('')}><X size={15} aria-hidden="true" /></button>}
        </div>
        {searchTerm && (
          <div id="calculator-search-results" className="calculator-search-results" aria-live="polite">
            {matches.length === 0 ? <p>No indexed record matches that search.</p> : matches.map((record) => (
              <button type="button" key={record.id} disabled={!canAddPeriod} onClick={() => { onAddPeriod(record); setSearch(''); }}>
                <span><strong>{record.name}</strong><small>{record.psychoactiveClasses.length ? record.psychoactiveClasses.join(' · ') : 'Class not listed'}</small></span>
                <span className="add-period-label">{canAddPeriod ? 'Add period +' : `Limit ${maxPeriods}`}</span>
              </button>
            ))}
            {!canAddPeriod && <p className="search-more-note" role="status">Remove a period or clear this session to add another.</p>}
            {matchingRecords.length > matches.length && <p className="search-more-note">Showing 8 of {matchingRecords.length}; refine the search.</p>}
          </div>
        )}
      </div>

      {periods.length === 0 ? (
        <div className="calculator-empty"><span className="empty-index">01</span><p>Start with a substance search. Add another period if the pattern changed over time.</p></div>
      ) : (
        <>
          <div className="period-list" aria-label="Use periods">
            {periods.map((period, index) => {
              const record = recordById.get(period.substanceId);
              if (!record) return null;
              const calculation = calculatePeriod(period, currentAge);
              const validationMessages = calculation.messages.filter((message) => !message.startsWith('Add ') && !message.startsWith('Current age must be'));
              const unitOptions = [
                { value: '', label: 'Choose' },
                { value: 'mg', label: 'mg' },
                { value: 'g', label: 'g' },
                { value: 'mcg', label: 'mcg' },
                { value: 'mL', label: 'mL' },
                { value: 'tablets', label: 'tablets' },
                { value: 'other', label: 'Other' },
              ];
              const totalAmount = calculation.estimatedTotalAmount === null
                ? '—'
                : `${formatNumber(calculation.estimatedTotalAmount)} ${calculation.amountUnitLabel ?? calculation.amountUnit}`;

              return (
                <article className="period-card" key={period.id}>
                  <header className="period-header">
                    <div className="period-title-block">
                      <span className="period-number">{String(index + 1).padStart(2, '0')}</span>
                      <div><h3>{record.name}</h3><p>{record.psychoactiveClasses.length ? record.psychoactiveClasses.join(' · ') : 'Class not listed'}</p></div>
                    </div>
                    <div className="period-actions">
                      <a href={record.sourceUrl} target="_blank" rel="noreferrer">Source <ArrowUpRight size={12} aria-hidden="true" /></a>
                      <button type="button" className="remove-period" onClick={() => onPeriodsChange(periods.filter((item) => item.id !== period.id))} aria-label={`Remove ${record.name}, period ${index + 1}`}><Trash2 size={15} aria-hidden="true" /></button>
                    </div>
                  </header>

                  <div className="period-core-fields">
                    <label htmlFor={`duration-${period.id}`}>Pattern duration <span>years</span>
                      <input id={`duration-${period.id}`} type="number" min={HISTORY_LIMITS.durationYears.min} max={HISTORY_LIMITS.durationYears.max} step="any" inputMode="decimal" placeholder="e.g. 2.5" value={period.durationYears ?? ''} onChange={(event) => updatePeriod(period.id, { durationYears: parseOptionalNumber(event.target.value) })} />
                    </label>
                    <label htmlFor={`frequency-${period.id}`}>Typical occasions <span>per week</span>
                      <input id={`frequency-${period.id}`} type="number" min={HISTORY_LIMITS.occasionsPerWeek.min} max={HISTORY_LIMITS.occasionsPerWeek.max} step="any" inputMode="decimal" placeholder="e.g. 3" value={period.occasionsPerWeek ?? ''} onChange={(event) => updatePeriod(period.id, { occasionsPerWeek: parseOptionalNumber(event.target.value) })} />
                    </label>
                    <label className="ongoing-check"><input type="checkbox" checked={period.activeNow} onChange={(event) => updatePeriod(period.id, { activeNow: event.target.checked })} /> Ongoing now</label>
                  </div>

                  <details className="period-details">
                    <summary>Amount, age and route details <span>{period.routes.length ? `${period.routes.length} route${period.routes.length === 1 ? '' : 's'} selected` : 'optional'}</span></summary>
                    <div className="period-detail-body">
                      <div className="amount-fields">
                        <label htmlFor={`amount-${period.id}`}>Amount per occasion <span>optional</span>
                          <input id={`amount-${period.id}`} type="number" min="0" step="any" inputMode="decimal" placeholder="e.g. 10" value={period.amountPerOccurrence ?? ''} onChange={(event) => updatePeriod(period.id, { amountPerOccurrence: parseOptionalNumber(event.target.value) })} />
                        </label>
                        <label htmlFor={`unit-${period.id}`}>Unit
                          <select id={`unit-${period.id}`} value={period.amountUnit} onChange={(event) => updatePeriod(period.id, { amountUnit: event.target.value as UsePeriod['amountUnit'] })}>
                            {unitOptions.map((option) => <option key={option.value || 'blank'} value={option.value}>{option.label}</option>)}
                          </select>
                        </label>
                        {period.amountUnit === 'other' && <label htmlFor={`custom-unit-${period.id}`}>Name the unit
                          <input id={`custom-unit-${period.id}`} type="text" maxLength={20} placeholder="e.g. units" value={period.customUnitLabel ?? ''} onChange={(event) => updatePeriod(period.id, { customUnitLabel: event.target.value })} />
                        </label>}
                      </div>

                      {period.activeNow ? (
                        calculation.estimatedAgeAtStart !== null && <p className="age-result">Approximate start age: <strong>{formatNumber(calculation.estimatedAgeAtStart)}</strong> <span>current age minus duration</span></p>
                      ) : (
                        <label className="ended-age-field" htmlFor={`start-age-${period.id}`}>Age when this pattern began <span>optional</span>
                          <input id={`start-age-${period.id}`} type="number" min={HISTORY_LIMITS.ageAtStart.min} max={HISTORY_LIMITS.ageAtStart.max} step="any" inputMode="decimal" placeholder="e.g. 24" value={period.ageAtStart ?? ''} onChange={(event) => updatePeriod(period.id, { ageAtStart: parseOptionalNumber(event.target.value) })} />
                        </label>
                      )}

                      <fieldset className="route-fieldset">
                        <legend>Reported route(s) <span>metadata only; select all that apply</span></legend>
                        {record.reportedRoutes.length === 0 ? <p className="route-empty">No route labels listed in this source snapshot.</p> : (
                          <div className="route-options">
                            {record.reportedRoutes.map((route) => (
                              <label key={route} className={`route-option ${period.routes.includes(route) ? 'is-active' : ''}`}>
                                <input type="checkbox" checked={period.routes.includes(route)} onChange={() => toggleRoute(period, route)} />{route}
                              </label>
                            ))}
                          </div>
                        )}
                      </fieldset>
                    </div>
                  </details>

                  <div className="period-results" aria-live="polite">
                    <div><span>Duration</span><strong>{calculation.durationYears === null ? '—' : `${formatNumber(calculation.durationYears)} y`}</strong></div>
                    <div><span>Approx. occasions</span><strong>{calculation.estimatedOccasions === null ? '—' : formatNumber(calculation.estimatedOccasions)}</strong></div>
                    <div><span>Approx. amount</span><strong>{totalAmount}</strong></div>
                  </div>
                  {validationMessages.length > 0 && <p className="calc-validation-note">{validationMessages.join(' ')}</p>}
                  <p className="arithmetic-label">Calculated from this period only · not a health-risk estimate</p>
                </article>
              );
            })}
          </div>

          {pairs.length > 0 && (
            <section className="overlap-section" aria-labelledby="overlap-title">
              <details className="overlap-details">
                <summary id="overlap-title">Review overlapping pairs <span>{markedPairs.length} marked · {pairs.length} possible</span></summary>
                <p>Mark only periods that overlapped in time. Rules are narrow; an unlisted pair is not assessed.</p>
                <div className="co-use-pairs">
                  {pairs.map((pair) => (
                    <label className="co-use-pair" key={pair.key}>
                      <input type="checkbox" checked={coUsePairs.has(pair.key)} onChange={() => togglePair(pair.key)} />
                      <span>{pair.label}</span>
                    </label>
                  ))}
                </div>
              </details>

              {markedPairs.length > 0 && (
                <div className="overlap-results" aria-live="polite">
                  {markedPairs.map((pair) => pair.findings.length > 0
                    ? pair.findings.map((finding) => (
                      <article className="co-use-finding" key={`${pair.key}-${finding.id}`}>
                        <div><span className="result-label">SOURCE-BACKED INTERACTION NOTE</span><h3>{finding.title}</h3><p>{finding.summary}</p><a href={finding.sourceUrl} target="_blank" rel="noreferrer">{finding.sourceLabel} <ArrowUpRight size={12} aria-hidden="true" /></a></div>
                      </article>
                    ))
                    : <p className="co-use-unknown" key={pair.key}><strong>{pair.label}:</strong> no matching rule is available. This pair is not assessed here; it is not evidence of safety.</p>)}
                </div>
              )}
            </section>
          )}

          <button type="button" className="clear-history-button" onClick={onClear}><Trash2 size={14} aria-hidden="true" /> Clear this session</button>
        </>
      )}
    </section>
  );
}
