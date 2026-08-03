import { MetadataRoute } from 'next';

// Canonical base is the WWW host (not the apex or the vercel.app subdomain).
const BASE = 'https://www.citytwinapp.com';

// Only public, indexable page routes are listed. Transient / non-indexable
// routes are intentionally excluded: /results (and its ?success / ?cancelled
// payment states), /auth/* (reset-password, callback), and all /api routes.
// There is no per-city page route (cities are client-side selections inside
// /find), so no per-city URLs are emitted.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${BASE}`, lastModified: now, priority: 1.0 },
    { url: `${BASE}/find`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/places`, lastModified: now, priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, priority: 0.3 },
  ];
}
