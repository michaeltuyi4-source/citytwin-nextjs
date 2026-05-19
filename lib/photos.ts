// Photo URLs for the results page hero and match cards.
// City photos are the fallback when a specific neighborhood photo isn't available.
// All URLs are Unsplash with size and quality parameters baked in.

export const CITY_PHOTOS: Record<string, string> = {
  chicago:    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=60',
  charlotte:  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=60',
  dallas:     'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&q=60',
  houston:    'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1200&q=60',
  atlanta:    'https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?w=1200&q=60',
  seattle:    'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1200&q=60',
  phoenix:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=60',
  montgomery: 'https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=1200&q=60',
};

// Neighborhood-specific photos. Currently three confirmed; the rest fall back to the city photo.
export const NEIGHBORHOOD_PHOTOS: Record<string, string> = {
  'wicker-park':  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=60',
  'west-loop':    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=60',
  'lincoln-park': 'https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=900&q=60',
};

export function getCityPhoto(cityKey: string): string {
  return CITY_PHOTOS[cityKey] || CITY_PHOTOS.chicago;
}

export function getNeighborhoodPhoto(neighborhoodId: string, cityKey: string): string {
  return NEIGHBORHOOD_PHOTOS[neighborhoodId] || getCityPhoto(cityKey);
}

// City display label (e.g. "Chicago, IL"). Derived from a key.
export function getCityLabel(cityKey: string): string {
  const labels: Record<string, string> = {
    chicago:    'Chicago, IL',
    charlotte:  'Charlotte, NC',
    dallas:     'Dallas, TX',
    houston:    'Houston, TX',
    atlanta:    'Atlanta, GA',
    seattle:    'Seattle, WA',
    phoenix:    'Phoenix, AZ',
    montgomery: 'Montgomery County, MD',
  };
  return labels[cityKey] || 'Your city';
}
