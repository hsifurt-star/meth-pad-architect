import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, Check, ExternalLink, Search, X } from 'lucide-react';
import type { SubstanceRecord } from '../types/substance';

interface SubstanceDirectoryProps {
  records: SubstanceRecord[];
  onAdd: (record: SubstanceRecord) => void;
  canAddPeriod: boolean;
  maxPeriods: number;
}

function toggleInSet(current: Set<string>, value: string): Set<string> {
  const next = new Set(current);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function SubstanceDirectory({ records, onAdd, canAddPeriod, maxPeriods }: SubstanceDirectoryProps) {
  const [query, setQuery] = useState('');
  const [classFilters, setClassFilters] = useState<Set<string>>(new Set());
  const [routeFilters, setRouteFilters] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(24);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState('');

  const classes = useMemo(() => [...new Set(records.flatMap((record) => record.psychoactiveClasses))].sort((a, b) => a.localeCompare(b)), [records]);
  const routes = useMemo(() => [...new Set(records.flatMap((record) => record.reportedRoutes))].sort((a, b) => a.localeCompare(b)), [records]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return records.filter((record) => {
      const haystack = [record.name, ...record.chemicalClasses, ...record.psychoactiveClasses, ...record.reportedRoutes].join(' ').toLocaleLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesClass = classFilters.size === 0 || record.psychoactiveClasses.some((item) => classFilters.has(item));
      const matchesRoute = routeFilters.size === 0 || record.reportedRoutes.some((item) => routeFilters.has(item));
      return matchesQuery && matchesClass && matchesRoute;
    });
  }, [records, query, classFilters, routeFilters]);

  useEffect(() => setVisibleCount(24), [query, classFilters, routeFilters]);
  const visible = filtered.slice(0, visibleCount);
  const hasFilters = Boolean(query.trim()) || classFilters.size > 0 || routeFilters.size > 0;

  const addRecord = (record: SubstanceRecord) => {
    onAdd(record);
    setAddedMessage(`${record.name} added as a new period in the calculator.`);
  };

  return (
    <section className="directory" aria-labelledby="directory-title">
      <div className="directory-intro">
        <div>
          <div className="section-kicker"><span className="kicker-mark">03</span> Substance index</div>
          <h2 id="directory-title">Search the wider index</h2>
          <p>Find a source record, inspect its listed classes and routes, then add it as another calculator period. Route labels describe the source metadata; they are not recommendations or safety rankings.</p>
        </div>
        <div className="index-count"><span>{records.length}</span><small>source records</small></div>
      </div>

      <div className="search-field">
        <Search size={19} aria-hidden="true" />
        <label className="visually-hidden" htmlFor="substance-search">Search substances, classes, or routes</label>
        <input id="substance-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search names, classes, or route labels" />
        {query && <button type="button" className="search-clear" aria-label="Clear search" onClick={() => setQuery('')}><X size={16} /></button>}
      </div>

      <div className="filter-block">
        <div className="filter-label"><span>Class</span><small>Select more than one</small></div>
        <div className="filter-chips" role="group" aria-label="Filter by psychoactive class">
          {classes.map((item) => <button key={item} type="button" className={`filter-chip ${classFilters.has(item) ? 'is-active' : ''}`} aria-pressed={classFilters.has(item)} onClick={() => setClassFilters((current) => toggleInSet(current, item))}>{classFilters.has(item) && <Check size={13} />} {item}</button>)}
        </div>
      </div>

      <div className="filter-block route-filter-block">
        <div className="filter-label"><span>Reported route</span><small>Multiple filters match any selected route</small></div>
        <div className="filter-chips" role="group" aria-label="Filter by reported route">
          {routes.map((item) => <button key={item} type="button" className={`filter-chip route-chip ${routeFilters.has(item) ? 'is-active' : ''}`} aria-pressed={routeFilters.has(item)} onClick={() => setRouteFilters((current) => toggleInSet(current, item))}>{routeFilters.has(item) && <Check size={13} />} {item}</button>)}
        </div>
      </div>

      {hasFilters && <button type="button" className="text-button clear-filters" onClick={() => { setQuery(''); setClassFilters(new Set()); setRouteFilters(new Set()); }}>Clear all filters</button>}

      <div className="result-summary" aria-live="polite">
        <span>{filtered.length === 0 ? 'No records match these filters' : `Showing ${Math.min(visibleCount, filtered.length)} of ${filtered.length} matching records`}</span>
        <span>Source metadata may be incomplete</span>
      </div>
      {!canAddPeriod && <p className="period-limit-note" role="status">This profile is at its {maxPeriods}-period limit. Remove a period above or clear the history to add another.</p>}
      <p className="directory-added-status" role="status" aria-live="polite">{addedMessage}</p>

      <div className="substance-list">
        {visible.map((record) => {
          const isExpanded = expandedId === record.id;
          return (
            <article className="substance-row" key={record.id}>
              <div className="substance-row-main">
                <button type="button" className="substance-name-button" onClick={() => setExpandedId(isExpanded ? null : record.id)} aria-expanded={isExpanded}>
                  <span className="substance-name">{record.name}</span>
                  <span className="substance-subtitle">{record.psychoactiveClasses.length ? record.psychoactiveClasses.join(' · ') : 'Class not listed'}</span>
                </button>
                <button type="button" className="select-substance" disabled={!canAddPeriod} onClick={() => addRecord(record)} aria-label={`Add another ${record.name} use period to the calculator`}>
                  <Check size={14} aria-hidden="true" /> {canAddPeriod ? 'Add period' : 'Limit reached'}
                </button>
              </div>
              {isExpanded && (
                <div className="substance-details">
                  <div className="detail-line"><span>Chemical class</span><span>{record.chemicalClasses.length ? record.chemicalClasses.join(', ') : 'Not listed in source snapshot'}</span></div>
                  <div className="detail-line"><span>Reported routes</span><span>{record.reportedRoutes.length ? record.reportedRoutes.join(', ') : 'Not listed in source snapshot'}</span></div>
                  <p className="route-caveat">Reported route names describe source metadata; they do not rank routes, imply safety, or recommend use.</p>
                  <a className="source-link" href={record.sourceUrl} target="_blank" rel="noreferrer">Open this PsychonautWiki source page <ExternalLink size={13} /></a>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {filtered.length > visibleCount && <button type="button" className="load-more" onClick={() => setVisibleCount((current) => current + 24)}>Load more records <ArrowDown size={16} /></button>}
      {filtered.length > 0 && filtered.length <= visibleCount && visibleCount > 24 && <button type="button" className="text-button clear-filters" onClick={() => setVisibleCount(24)}>Show fewer</button>}
      <div className="directory-footnote"><ArrowUpRight size={15} /><span>Data and source pages are credited to PsychonautWiki; see the source and license notes below.</span></div>
    </section>
  );
}
