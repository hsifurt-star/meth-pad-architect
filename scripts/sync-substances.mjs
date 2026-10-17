import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const endpoint = 'https://api.psychonautwiki.org/';
const pageSize = 100;
const queryFor = (offset) => `query SubstanceIndex { substances(limit: ${pageSize}, offset: ${offset}) { name url class { chemical psychoactive } roas { name } } }`;

// This upstream record currently has inconsistent name/class/route metadata.
// Keep its name and source link, but quarantine the class and route fields until reviewed.
const quarantinedMetadata = new Set(['1,3-Butanediol']);

async function fetchPage(offset) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ query: queryFor(offset) }),
  });
  if (!response.ok) throw new Error(`PsychonautWiki API returned HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.errors?.length) throw new Error(`PsychonautWiki API error: ${payload.errors.map((error) => error.message).join('; ')}`);
  if (!Array.isArray(payload.data?.substances)) throw new Error('Unexpected API response: substances list is missing.');
  return payload.data.substances;
}

function cleanStringList(value, field, substanceName) {
  if (value == null) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(`Invalid ${field} list for ${substanceName}`);
  }
  return [...new Set(value.map((item) => item.trim()).filter(Boolean))];
}

const sourceRows = [];
for (let offset = 0; ; offset += pageSize) {
  const page = await fetchPage(offset);
  sourceRows.push(...page);
  if (page.length < pageSize) break;
  if (offset >= 5000) throw new Error('Safety stop: source pagination exceeded 5,000 records.');
}

const records = sourceRows.map((row) => {
  if (!row || typeof row.name !== 'string' || !row.name.trim() || typeof row.url !== 'string') {
    throw new Error('Invalid source row: every record needs a name and URL.');
  }
  if (row.class != null && (typeof row.class !== 'object' || Array.isArray(row.class))) {
    throw new Error(`Invalid class object for ${row.name}`);
  }
  if (row.roas != null && !Array.isArray(row.roas)) {
    throw new Error(`Invalid route list for ${row.name}`);
  }
  const safeName = row.name.trim();
  const sourceUrl = new URL(row.url);
  if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'psychonautwiki.org' || !sourceUrl.pathname.startsWith('/wiki/') || sourceUrl.username || sourceUrl.password) {
    throw new Error(`Unexpected source URL for ${safeName}`);
  }
  const classes = row.class ?? {};
  const chemicalClasses = cleanStringList(classes.chemical, 'chemical class', safeName);
  const psychoactiveClasses = cleanStringList(classes.psychoactive, 'psychoactive class', safeName);
  const sourceRoutes = row.roas ?? [];
  if (sourceRoutes.some((route) => !route || typeof route.name !== 'string')) {
    throw new Error(`Invalid reported route entry for ${safeName}`);
  }
  const reportedRoutes = [...new Set(sourceRoutes.map((route) => route.name.trim()).filter(Boolean))];
  const quarantined = quarantinedMetadata.has(safeName);
  const id = safeName.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!id) throw new Error(`Could not make a stable identifier for ${safeName}`);

  return {
    id,
    name: safeName,
    sourceUrl: sourceUrl.href,
    chemicalClasses: quarantined ? [] : chemicalClasses,
    psychoactiveClasses: quarantined ? [] : psychoactiveClasses,
    reportedRoutes: quarantined ? [] : reportedRoutes,
  };
}).sort((a, b) => a.name.localeCompare(b.name, 'en'));

const names = new Set();
const ids = new Set();
for (const record of records) {
  const normalizedName = record.name.toLocaleLowerCase('en');
  if (names.has(normalizedName)) throw new Error(`Duplicate substance name: ${record.name}`);
  if (ids.has(record.id)) throw new Error(`Generated identifier collision for ${record.name}: ${record.id}`);
  names.add(normalizedName);
  ids.add(record.id);
}
if (records.length < 300) throw new Error(`Safety stop: only ${records.length} records were returned.`);

const dataset = {
  source: 'PsychonautWiki semantic substance data',
  sourceUrl: endpoint,
  copyrightUrl: 'https://psychonautwiki.org/wiki/Copyrights',
  license: 'CC BY 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  retrievedAt: new Date().toISOString(),
  recordCount: records.length,
  attribution: 'Substance names, class metadata, and reported route labels adapted from PsychonautWiki semantic data. Used under CC BY 4.0 with attribution; no endorsement implied.',
  records,
};

const output = resolve('src/data/substances.json');
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8');
console.log(`Wrote ${records.length} substance records to ${output} (retrieved ${dataset.retrievedAt}); metadata quarantine entries: ${quarantinedMetadata.size}.`);
