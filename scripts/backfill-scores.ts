/**
 * One-time backfill of three category scores on the Supabase `neighborhoods` table.
 *
 *   fitness, faith          derived from REAL Google Places venue density, via a
 *                           direct Google Places Nearby Search (legacy endpoint)
 *                           with pagination for a true count (not the capped proxy).
 *   quiet_residential       derived from existing 1-10 scores (no API).
 *
 * Standalone script, NOT wired into the app runtime.
 *
 * Requires GOOGLE_PLACES_API_KEY (read from process.env or .env.local; never
 * hardcoded, never committed).
 *
 * Dry run (DEFAULT, no DB writes, prints a review table + count distribution):
 *   npx tsx scripts/backfill-scores.ts
 *
 * Write to the DB (only after you have reviewed the dry-run numbers):
 *   npx tsx scripts/backfill-scores.ts --write
 *
 * Before --write, the `quiet_residential` column must exist. Idempotent SQL:
 *   alter table public.neighborhoods add column if not exists quiet_residential integer;
 */

import { readFileSync } from 'fs';

// ─────────────────────────────────────────────────────────────────────────────
// Tunable constants. Review the dry-run output, then adjust these and re-run.
// ─────────────────────────────────────────────────────────────────────────────

// Tight neighborhood-level radius for a sharp density signal. At 2400m the gym
// count saturated at the 60 cap for most urban rows; 1200m de-saturates it.
const RADIUS_METERS = 1200; // meters (~0.75 miles)

// Normalization of a raw venue count to a 1-10 integer score.
// A raw count of SCORE_CEILING or more maps to 10/10; 0 venues maps to SCORE_FLOOR.
//   score = clamp(round(FLOOR + (count / CEILING) * (10 - FLOOR)), FLOOR, 10)
// Tuned to the 1200m fitness distribution so only genuinely dense areas hit 10.
// Observed at 1200m: min=2 max=60 median=22 p75=31 p90=53. Set near p90 so only
// the densest ~10% reach 10/10 and the rest spread across 1-9.
const SCORE_CEILING = 50; // raw gym count that earns 10/10 (~p90 at 1200m)
const SCORE_FLOOR = 1;    // minimum score; the scale is 1-10, never 0

// quiet_residential = formula over existing scores. UNCHANGED.
// Intent: low nightlife/commercial intensity + higher residential/family character.
const QUIET_BASELINE = 5.5;      // neutral midpoint of the 1-10 scale
const W_FAMILY = 0.6;            // family character pushes quiet up
const W_NIGHTLIFE = 0.7;         // nightlife pushes quiet down
const W_FOOD = 0.2;              // dense dining pushes quiet down
const W_COFFEE = 0.1;            // cafe density pushes quiet down

// Direct Google Places Nearby Search (legacy). Chosen because it uniquely gives
// BOTH a strict radius circle AND pagination to ~60. The New API searchNearby
// caps at 20 with no pagination; New searchText only biases (does not restrict)
// by circle, so it leaks distant results and inflates sparse areas.
//
// NOTE: faith is intentionally NOT derived here. place_of_worship saturates at
// the 60 result cap for every populated neighborhood even at 500m (no signal),
// so it is excluded from this backfill and never written. Handled separately.
const NEARBY_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const FITNESS_TYPE = 'gym';              // gyms, fitness centers, studios
const MAX_PAGES = 3;                      // API max is 3 pages (~60 results)
const PAGE_TOKEN_DELAY_MS = 2200;         // next_page_token needs a brief delay to activate
const CONCURRENCY = 6;                    // neighborhoods queried in parallel

// ─────────────────────────────────────────────────────────────────────────────

type Row = {
  id: string;
  name: string;
  city_id: string;
  lat: number;
  lng: number;
  fitness: number | null;
  family_friendly: number | null;
  nightlife: number | null;
  food_scene: number | null;
  coffee_shops: number | null;
};

type Derived = {
  row: Row;
  city: string;
  fitnessCount: number | null; // null = Places error
  fitnessScore: number | null;
  quiet: number;
  flags: string[];
};

function loadEnv(): { url: string; key: string; googleKey: string } {
  const env: Record<string, string> = {};
  try {
    const text = readFileSync('.env.local', 'utf8');
    for (const line of text.split('\n')) {
      if (!line.includes('=') || line.trim().startsWith('#')) continue;
      const i = line.indexOf('=');
      env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  } catch {
    // .env.local optional if the vars are already in the environment
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY;
  const googleKey = process.env.GOOGLE_PLACES_API_KEY ?? env.GOOGLE_PLACES_API_KEY;
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  if (!googleKey) throw new Error('Missing GOOGLE_PLACES_API_KEY (set it in .env.local or the environment)');
  return { url, key, googleKey };
}

const { url: SUPA_URL, key: SUPA_KEY, googleKey: GOOGLE_KEY } = loadEnv();
const SUPA_HEADERS = { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` };

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function normalize(count: number): number {
  return clamp(Math.round(SCORE_FLOOR + (count / SCORE_CEILING) * (10 - SCORE_FLOOR)), SCORE_FLOOR, 10);
}

function quietResidential(r: Row): number {
  // Treat any missing score as the neutral midpoint so the term contributes 0.
  const fam = r.family_friendly ?? QUIET_BASELINE;
  const night = r.nightlife ?? QUIET_BASELINE;
  const food = r.food_scene ?? QUIET_BASELINE;
  const coffee = r.coffee_shops ?? QUIET_BASELINE;
  const raw =
    QUIET_BASELINE +
    (fam - QUIET_BASELINE) * W_FAMILY -
    (night - QUIET_BASELINE) * W_NIGHTLIFE -
    (food - QUIET_BASELINE) * W_FOOD -
    (coffee - QUIET_BASELINE) * W_COFFEE;
  return Math.round(clamp(raw, 1, 10));
}

let placesCalls = 0;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// True venue count via legacy Google Places Nearby Search, paginated to ~60.
// Returns null on a hard API error (flagged for review). Dedupes by place_id.
async function placesCount(lat: number, lng: number, type: string): Promise<number | null> {
  const ids = new Set<string>();
  let token: string | null = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    let url = `${NEARBY_URL}?location=${lat},${lng}&radius=${RADIUS_METERS}&type=${type}&key=${GOOGLE_KEY}`;
    if (token) url += `&pagetoken=${encodeURIComponent(token)}`;
    placesCalls++;
    let data: { status?: string; results?: { place_id?: string }[]; next_page_token?: string; error_message?: string };
    try {
      const res = await fetch(url);
      data = await res.json();
    } catch {
      return ids.size > 0 ? ids.size : null;
    }
    if (data.status === 'ZERO_RESULTS') return ids.size;
    if (data.status !== 'OK') {
      // A "not enabled" / REQUEST_DENIED style error must be surfaced, not hidden.
      if (page === 0) {
        console.error(`Places error (${type}): ${data.status} ${data.error_message ?? ''}`);
        return null;
      }
      return ids.size; // later-page error: keep what we have
    }
    for (const r of data.results ?? []) if (r.place_id) ids.add(r.place_id);
    token = data.next_page_token ?? null;
    if (!token) break;
    await sleep(PAGE_TOKEN_DELAY_MS); // token needs a moment before it activates
  }
  return ids.size;
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

function percentile(xs: number[], p: number): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const idx = Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1);
  return s[Math.max(0, idx)];
}

async function pool<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker));
  return out;
}

async function supaGet<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, { headers: SUPA_HEADERS });
  if (!res.ok) throw new Error(`Supabase GET ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function supaPatch(id: string, body: Record<string, number>): Promise<void> {
  const res = await fetch(`${SUPA_URL}/rest/v1/neighborhoods?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...SUPA_HEADERS, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Supabase PATCH ${id} failed: ${res.status} ${await res.text()}`);
}

function pad(s: string | number, w: number): string {
  return String(s).padEnd(w);
}

async function main() {
  const write = process.argv.includes('--write');

  const cities = await supaGet<{ id: string; name: string; state: string }[]>('cities?select=id,name,state');
  const cityName = new Map(cities.map((c) => [c.id, `${c.name}, ${c.state}`]));

  const rows = await supaGet<Row[]>(
    'neighborhoods?select=id,name,city_id,lat,lng,fitness,family_friendly,nightlife,food_scene,coffee_shops&order=name',
  );

  const hasQuietColumn = await (async () => {
    const probe = await supaGet<Record<string, unknown>[]>('neighborhoods?select=quiet_residential&limit=1');
    return Array.isArray(probe) && probe.length > 0 && 'quiet_residential' in probe[0];
  })().catch(() => false);

  console.log(`Neighborhoods: ${rows.length}. Mode: ${write ? 'WRITE' : 'DRY RUN (no DB writes)'}.`);
  console.log(`Endpoint: Google Places Nearby Search (legacy), radius=${RADIUS_METERS}m. Ceiling=${SCORE_CEILING}, Floor=${SCORE_FLOOR}.`);
  console.log(`Fitness type="${FITNESS_TYPE}". Faith: dropped (not derived, never written).\n`);

  const derived = await pool<Row, Derived>(rows, CONCURRENCY, async (row) => {
    const fitnessCount = await placesCount(row.lat, row.lng, FITNESS_TYPE);
    const flags: string[] = [];
    if (fitnessCount === null) flags.push('fitness:ERR');
    else if (fitnessCount === 0) flags.push('fitness:0');
    return {
      row,
      city: cityName.get(row.city_id) ?? row.city_id,
      fitnessCount,
      fitnessScore: fitnessCount === null ? null : normalize(fitnessCount),
      quiet: quietResidential(row),
      flags,
    };
  });

  derived.sort((a, b) => a.city.localeCompare(b.city) || a.row.name.localeCompare(b.row.name));

  // Review table.
  console.log(
    pad('neighborhood', 26) + pad('city', 22) +
    pad('fitness#', 9) + pad('fitness', 8) + 'quiet',
  );
  console.log('-'.repeat(72));
  for (const d of derived) {
    console.log(
      pad(d.row.name, 26) + pad(d.city, 22) +
      pad(d.fitnessCount === null ? 'ERR' : d.fitnessCount, 9) +
      pad(d.fitnessScore === null ? 'ERR' : d.fitnessScore, 8) +
      d.quiet,
    );
  }

  // Summary: fitness raw-count distribution so SCORE_CEILING can be confirmed.
  const fitCounts = derived.map((d) => d.fitnessCount).filter((c): c is number => c !== null);
  const flagged = derived.filter((d) => d.flags.length);
  console.log('\n' + '='.repeat(72));
  console.log(`Google Places calls made: ${placesCalls}`);
  if (fitCounts.length) {
    console.log(
      `fitness raw count: min=${Math.min(...fitCounts)} max=${Math.max(...fitCounts)} ` +
      `median=${median(fitCounts)} p75=${percentile(fitCounts, 75)} p90=${percentile(fitCounts, 90)}`,
    );
    const tens = derived.filter((d) => d.fitnessScore === 10).length;
    const ones = derived.filter((d) => d.fitnessScore === 1).length;
    console.log(`fitness scores at 10/10: ${tens}/${derived.length}, at 1/10: ${ones}/${derived.length} (SCORE_CEILING=${SCORE_CEILING}).`);
  }
  if (flagged.length) {
    console.log(`Rows with a 0 or errored Places result (review manually):`);
    for (const d of flagged) console.log(`  ${d.row.name} (${d.city}): ${d.flags.join(', ')}`);
  } else {
    console.log('No 0 or errored Places results.');
  }

  if (!write) {
    console.log('\nDRY RUN complete. No data written. Re-run with --write to persist.');
    return;
  }

  // ---- WRITE PATH ----
  if (!hasQuietColumn) {
    console.log(
      '\nABORT: column `quiet_residential` does not exist. Run this SQL first:\n' +
      '  alter table public.neighborhoods add column if not exists quiet_residential integer;',
    );
    process.exitCode = 1;
    return;
  }

  let written = 0;
  const skipped: string[] = [];
  for (const d of derived) {
    // faith is intentionally never written. quiet_residential always; fitness
    // only when Places returned a real count (never write a null/garbage value).
    const body: Record<string, number> = { quiet_residential: d.quiet };
    if (d.fitnessScore !== null) body.fitness = d.fitnessScore;
    else skipped.push(`${d.row.name}: fitness Places errored`);
    await supaPatch(d.row.id, body);
    written++;
  }
  console.log(`\nWRITE complete. Rows updated: ${written}. (faith not written by design.)`);
  if (skipped.length) {
    console.log('Rows where fitness was NOT written (Places errored, re-run to fill):');
    for (const s of skipped) console.log(`  ${s}`);
  }
}

main().catch((err) => {
  console.error('FATAL:', err.message || err);
  process.exitCode = 1;
});
