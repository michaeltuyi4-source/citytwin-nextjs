// CityTwin, neighborhoods-db.ts
// Supabase-sourced neighborhood data for the matching flow.
//
// Produces the SAME object shape that scoring.js and phrases.js already consume,
// then (Option A) injects the mapped cityData into the NEIGHBORHOODS map so the
// existing getTopMatches(cityKey) runs unchanged. scoring.js and phrases.js are
// not modified. The hardcoded neighborhoods.js stays in place; a source flag
// selects which data the matching flow uses.

// @ts-ignore - JS module with no type declarations
import { NEIGHBORHOODS } from '@/neighborhoods';

// ─────────────────────────────────────────────
// Source flag: 'hardcoded' (default) or 'db'. Set NEXT_PUBLIC_NEIGHBORHOOD_SOURCE
// to 'db' to route the 8 shared cities through Supabase too. Default does NOT
// flip; DB-only cities always load from the DB regardless of this flag.
// ─────────────────────────────────────────────
export const NEIGHBORHOOD_SOURCE: 'hardcoded' | 'db' =
  process.env.NEXT_PUBLIC_NEIGHBORHOOD_SOURCE === 'db' ? 'db' : 'hardcoded';

// City key -> (name, state) as stored in the Supabase cities table.
// Keys must match the find-flow picker exactly.
export const CITY_KEY_MAP: Record<string, { name: string; state: string }> = {
  charlotte:        { name: 'Charlotte',         state: 'NC' },
  montgomery:       { name: 'Montgomery County', state: 'MD' },
  chicago:          { name: 'Chicago',           state: 'IL' },
  dallas:           { name: 'Dallas',            state: 'TX' },
  houston:          { name: 'Houston',           state: 'TX' },
  seattle:          { name: 'Seattle',           state: 'WA' },
  phoenix:          { name: 'Phoenix',           state: 'AZ' },
  atlanta:          { name: 'Atlanta',           state: 'GA' },
  austin:           { name: 'Austin',            state: 'TX' },
  nashville:        { name: 'Nashville',         state: 'TN' },
  denver:           { name: 'Denver',            state: 'CO' },
  miami:            { name: 'Miami',             state: 'FL' },
  raleigh:          { name: 'Raleigh',           state: 'NC' },
  springfield:      { name: 'Springfield',       state: 'IL' },
  dcmetro:          { name: 'DC Metro',          state: 'DC' },
  northernvirginia: { name: 'Northern Virginia', state: 'VA' },
};

// DB column -> scores key. ONLY the 10 matchable categories. fitness and faith
// are deliberately excluded (Places venue filter only, not matchable priorities).
const SCORE_MAP: Record<string, string> = {
  walkability:        'walkability',
  public_transit:     'transitAccess',
  food_scene:         'foodScene',
  coffee_shops:       'coffeeShops',
  outdoor_spaces:     'outdoorSpaces',
  nightlife:          'nightlife',
  cultural_diversity: 'culturalDiversity',
  family_friendly:    'familyFriendly',
  affordability:      'affordability',
  quiet_residential:  'quietResidential',
};

const NEIGHBORHOOD_COLUMNS = [
  'id', 'name', 'tagline',
  ...Object.keys(SCORE_MAP),
  'rent_min', 'rent_max', 'walk_score', 'highlights', 'gaps', 'best_for', 'lat', 'lng',
].join(',');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbRow = Record<string, any>;

interface MappedNeighborhood {
  id: string;
  name: string;
  tagline: string;
  scores: Record<string, number>;
  categoryPhrases: Record<string, string>;
  rentRange: string;
  walkScore: number | null;
  highlights: string[];
  gaps: string[];
  bestFor: string[];
  coords: { lat: number; lng: number };
}

export interface CityData {
  cityName: string;
  cityNote: string;
  neighborhoods: MappedNeighborhood[];
}

function supaEnv(): { url: string; anon: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return { url, anon };
}

async function restGet(path: string): Promise<DbRow[]> {
  const { url, anon } = supaEnv();
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: anon, Authorization: `Bearer ${anon}` },
  });
  if (!res.ok) throw new Error(`Supabase GET ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// rent_min + rent_max -> "$1,800-$2,300/mo (1BR)". Hyphen, comma thousands, no en/em dash.
function rentRange(min: number | null, max: number | null): string {
  if (min == null || max == null) return '';
  const fmt = (n: number) => '$' + Number(n).toLocaleString('en-US');
  return `${fmt(min)}-${fmt(max)}/mo (1BR)`;
}

function mapRow(row: DbRow): MappedNeighborhood {
  const scores: Record<string, number> = {};
  for (const [dbCol, key] of Object.entries(SCORE_MAP)) {
    scores[key] = row[dbCol] ?? 0; // coalesce null -> 0 to match scoring's `?? 0`
  }
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    scores,
    categoryPhrases: {}, // no DB column; contract expects an object
    rentRange: rentRange(row.rent_min, row.rent_max),
    walkScore: row.walk_score ?? null,
    highlights: row.highlights ?? [],
    gaps: row.gaps ?? [],
    bestFor: row.best_for ?? [],
    coords: { lat: row.lat, lng: row.lng },
  };
}

/**
 * getCityWithNeighborhoods
 * Resolves the city via CITY_KEY_MAP, fetches it and its neighborhoods from
 * Supabase, maps each flat row to the confirmed object shape, injects the
 * result into the NEIGHBORHOODS map under cityKey (Option A), and returns it.
 * Returns null if the key is unknown or the city is not found.
 */
export async function getCityWithNeighborhoods(cityKey: string): Promise<CityData | null> {
  const m = CITY_KEY_MAP[cityKey];
  if (!m) {
    console.error(`Unknown city key "${cityKey}" (not in CITY_KEY_MAP).`);
    return null;
  }

  const cities = await restGet(
    `cities?select=id,name,state&name=eq.${encodeURIComponent(m.name)}&state=eq.${encodeURIComponent(m.state)}&limit=1`,
  );
  const city = cities[0];
  if (!city) {
    console.error(`City "${m.name}, ${m.state}" not found in Supabase.`);
    return null;
  }

  const rows = await restGet(
    `neighborhoods?select=${NEIGHBORHOOD_COLUMNS}&city_id=eq.${city.id}&order=name`,
  );

  const cityData: CityData = {
    cityName: `${city.name}, ${city.state}`,
    cityNote: '', // no DB column; not consumed by results/scoring (confirmed)
    neighborhoods: rows.map(mapRow),
  };

  // Option A: make the existing getTopMatches(cityKey) work unchanged.
  (NEIGHBORHOODS as Record<string, CityData>)[cityKey] = cityData;
  return cityData;
}

/**
 * ensureCityData
 * Guarantees NEIGHBORHOODS[cityKey] is populated before getTopMatches runs.
 * DB-only cities always load from Supabase. Shared cities use the hardcoded
 * data unless NEIGHBORHOOD_SOURCE is 'db'. Returns whether data is available.
 */
export async function ensureCityData(cityKey: string): Promise<boolean> {
  const hasHardcoded = Boolean((NEIGHBORHOODS as Record<string, CityData>)[cityKey]);
  if (hasHardcoded && NEIGHBORHOOD_SOURCE !== 'db') return true;
  const data = await getCityWithNeighborhoods(cityKey);
  return Boolean(data);
}
