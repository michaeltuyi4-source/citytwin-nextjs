import { NextResponse } from 'next/server';

// Legacy Google Place Photo endpoint. See the migration note in
// app/api/places/route.ts (Places API (New) uses photos[].name + /v1/{name}/media).
const PLACE_PHOTO_URL = 'https://maps.googleapis.com/maps/api/place/photo';

function buildPlacePhotoUrl(
  { ref, maxwidth, key }: { ref: string; maxwidth: number; key: string },
): string {
  const u = new URL(PLACE_PHOTO_URL);
  u.searchParams.set('maxwidth', String(maxwidth));
  u.searchParams.set('photo_reference', ref);
  u.searchParams.set('key', key);
  return u.toString();
}

export async function GET(request: Request) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const ref = new URL(request.url).searchParams.get('ref');
  if (!ref) {
    return NextResponse.json({ error: 'ref required' }, { status: 400 });
  }

  try {
    // Key is attached only to this server-side request. We stream the image bytes
    // back (not a redirect), so the cached artifact is the image itself rather
    // than an expiring Google CDN URL. A durable blob cache could be added in
    // front of this later without changing the client contract.
    const googleUrl = buildPlacePhotoUrl({ ref, maxwidth: 400, key });
    const res = await fetch(googleUrl, { redirect: 'follow' });

    if (!res.ok || !res.body) {
      return new NextResponse(null, { status: 404 });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        'Content-Type':  contentType,
        'Cache-Control': 'public, max-age=604800', // 7 days
      },
    });
  } catch (err) {
    console.error('[api/place-photo] error:', err);
    return new NextResponse(null, { status: 500 });
  }
}
