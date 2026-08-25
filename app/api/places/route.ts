import { NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// Google Places URL builders (LEGACY endpoints)
//
// These use the LEGACY Google Places web-service endpoints (Nearby Search and
// Text Search), which return results[] with rating/user_ratings_total and
// photos[].photo_reference. A future migration to Places API (New) is localized
// to these two helpers: New uses POST places:searchNearby / places:searchText
// with a field mask and different response/field shapes. Keep every Google URL
// constructed here so that migration touches only this block.
// ─────────────────────────────────────────────────────────────────────────────
const NEARBY_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const TEXT_SEARCH_URL   = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

function buildNearbySearchUrl(
  { lat, lng, radius, placeType, key }:
  { lat: number; lng: number; radius: number; placeType: string; key: string },
): string {
  const u = new URL(NEARBY_SEARCH_URL);
  u.searchParams.set('location', `${lat},${lng}`);
  u.searchParams.set('radius', String(radius));
  u.searchParams.set('type', placeType);
  u.searchParams.set('key', key);
  return u.toString();
}

function buildTextSearchUrl(
  { query, lat, lng, radius, key }:
  { query: string; lat: number; lng: number; radius: number; key: string },
): string {
  const u = new URL(TEXT_SEARCH_URL);
  u.searchParams.set('query', query);
  u.searchParams.set('location', `${lat},${lng}`);
  u.searchParams.set('radius', String(radius));
  u.searchParams.set('key', key);
  return u.toString();
}

// ─── Category → Google Places `type` (Nearby Search). 12 categories, matching the
// frontend tabs exactly. Ported verbatim from the retired Azure Function. ───────
const CATEGORY_TYPES: Record<string, string> = {
  coffeeShops:       'cafe',
  foodScene:         'restaurant',
  fitness:           'gym',
  faith:             'church',
  outdoorSpaces:     'park',
  nightlife:         'bar',
  culturalDiversity: 'supermarket',
  grocery:           'supermarket',
  familyFriendly:    'playground',
  shopping:          'shopping_mall',
  entertainment:     'movie_theater',
  trails:            'park',
};

// ─── Categories routed to Text Search (static routing, NO fallback) ─────────────
// faith and culturalDiversity always use Text Search with an OR-query; every
// other category always uses Nearby Search. Behavior-identical to the retired
// function (no "retry the other endpoint on zero results" logic).
const TEXT_SEARCH_QUERIES: Record<string, string> = {
  faith:             'church OR mosque OR synagogue OR temple OR worship',
  culturalDiversity: 'international grocery OR ethnic market OR asian market OR african market',
};

export async function GET(request: Request) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    // Defensive: the key must be set in the Vercel env. Never leak it or details.
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const params   = new URL(request.url).searchParams;
  const lat      = parseFloat(params.get('lat') ?? '');
  const lng      = parseFloat(params.get('lng') ?? '');
  const category = params.get('type') || 'coffee';
  const radius   = parseInt(params.get('radius') || '4827', 10);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  const useTextSearch = category in TEXT_SEARCH_QUERIES;

  try {
    const searchUrl = useTextSearch
      ? buildTextSearchUrl({
          query: `${TEXT_SEARCH_QUERIES[category]} near ${lat},${lng}`,
          lat, lng, radius, key,
        })
      : buildNearbySearchUrl({
          lat, lng, radius,
          placeType: CATEGORY_TYPES[category] || 'establishment',
          key,
        });

    const searchRes  = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API: ${searchData.status}`);
    }

    // First 6 in Google's returned order (no re-sort), matching the old function.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = (searchData.results || []).slice(0, 6).map((place: any) => ({
      place_id:           place.place_id,
      name:               place.name,
      rating:             place.rating || null,
      user_ratings_total: place.user_ratings_total ?? null,
      vicinity:           place.formatted_address || place.vicinity,
      open_now:           place.opening_hours?.open_now ?? null,
      lat:                place.geometry?.location?.lat,
      lng:                place.geometry?.location?.lng,
    }));

    return NextResponse.json(
      { results, status: searchData.status },
      { headers: { 'Cache-Control': 'public, s-maxage=86400' } }, // 24h CDN cache
    );
  } catch (err) {
    console.error('[api/places] search error:', err);
    return NextResponse.json({ error: 'Places search failed' }, { status: 500 });
  }
}
