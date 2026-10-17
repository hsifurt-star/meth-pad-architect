import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
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
  const selectedFilterCount = classFilters.size + routeFilters.size;

  const addRecord = (record: SubstanceRecord) => {
    onAdd(record);
    setAddedMessage(`${record.name} added to the calculator.`);
  };

  return (
    <section className="directory" id="directory" aria-labelledby="directory-title">
      <header className="directory-intro">
        <div>
          <div className="section-kicker"><span className="section-number">02</span> INDEX</div>
          <h2 id="directory-title">Browse substances</h2>
          <p>Names, classes and reported routes from a source-linked community index.</p>
        </div>
        <div className="index-count"><strong>{records.length}</strong><span>records</span></div>
      </header>

      <div className="search-field directory-search">
        <Search size={16} aria-hidden="true" />
        <label className="visually-hidden" htmlFor="substance-search">Search names, classes, or reported routes</label>
        <input id="substance-search" type="search" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search names, classes or routes" />
        {query && <button type="button" className="search-clear" aria-label="Clear search" onClick={() => setQuery('')}><X size={15} aria-hidden="true" /></button>}
      </div>

      <details className="filter-disclosure">
        <summary>Filter by class or route <span>{selectedFilterCount ? `${selectedFilterCount} selected` : 'optional'}</span></summary>
        <div className="filter-panel">
          <div className="filter-block">
            <div className="filter-label"><span>Class</span><small>Multiple selections match any</small></div>
            <div className="filter-chips" role="group" aria-label="Filter by psychoactive class">
              {classes.map((item) => <button key={item} type="button" className={`filter-chip ${classFilters.has(item) ? 'is-active' : ''}`} aria-pressed={classFilters.has(item)} onClick={() => setClassFilters((current) => toggleInSet(current, item))}>{item}</button>)}
            </div>
          </div>
          <div className="filter-block">
            <div className="filter-label"><span>Reported route</span><small>Multiple selections match any</small></div>
            <div className="filter-chips" role="group" aria-label="Filter by reported route">
              {routes.map((item) => <button key={item} type="button" className={`filter-chip ${routeFilters.has(item) ? 'is-active' : ''}`} aria-pressed={routeFilters.has(item)} onClick={() => setRouteFilters((current) => toggleInSet(current, item))}>{item}</button>)}
            </div>
          </div>
        </div>
      </details>

      {hasFilters && <button type="button" className="text-button clear-filters" onClick={() => { setQuery(''); setClassFilters(new Set()); setRouteFilters(new Set()); }}>Clear search and filters</button>}

      <div className="result-summary" aria-live="polite">
        <span>{filtered.length === 0 ? 'No matches' : `Showing ${Math.min(visibleCount, filtered.length)} of ${filtered.length}`}</span>
        <span>Metadata may be incomplete</span>
      </div>
      {!canAddPeriod && <p className="period-limit-note" role="status">At the {maxPeriods}-period limit. Remove a period above to add another.</p>}
      <p className="directory-added-status" role="status" aria-live="polite">{addedMessage}</p>

      <div className="substance-list">
        {visible.map((record) => {
          const isExpanded = expandedId === record.id;
          return (
            <article className="substance-row" key={record.id}>
              <div className="substance-row-main">
                <button type="button" className="substance-name-button" onClick={() => setExpandedId(isExpanded ? null : record.id)} aria-expanded={isExpanded} aria-controls={`substance-detail-${record.id}`}>
                  <span className="substance-name">{record.name}</span>
                  <span className="substance-subtitle">{record.psychoactiveClasses.length ? record.psychoactiveClasses.join(' · ') : 'Class not listed'}</span>
                </button>
                <button type="button" className="select-substance" disabled={!canAddPeriod} onClick={() => addRecord(record)} aria-label={`Add another ${record.name} period to the calculator`}>
                  {canAddPeriod ? 'Add period +' : 'Limit reached'}
                </button>
              </div>
              {isExpanded && (
                <div className="substance-details" id={`substance-detail-${record.id}`}>
                  <div className="detail-line"><span>Chemical class</span><span>{record.chemicalClasses.length ? record.chemicalClasses.join(', ') : 'Not listed'}</span></div>
                  <div className="detail-line"><span>Reported routes</span><span>{record.reportedRoutes.length ? record.reportedRoutes.join(', ') : 'Not listed'}</span></div>
                  <p className="route-caveat">Route labels describe source metadata; they do not rank or recommend routes.</p>
                  <a className="source-link" href={record.sourceUrl} target="_blank" rel="noreferrer">Open source page <ArrowUpRight size={12} aria-hidden="true" /></a>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {filtered.length > visibleCount && <button type="button" className="load-more" onClick={() => setVisibleCount((current) => current + 24)}>Load 24 more</button>}
      {filtered.length > 0 && filtered.length <= visibleCount && visibleCount > 24 && <button type="button" className="text-button clear-filters" onClick={() => setVisibleCount(24)}>Show fewer</button>}
      <p className="directory-footnote">PsychonautWiki semantic data · CC BY 4.0 · source links on each record. Routes are descriptive metadata, not safety advice.</p>
    </section>
  );
}
