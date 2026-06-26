// Photo URLs and labels for the results page hero and match cards.
// One representative city-level photo per launch city. Per-neighborhood
// photography is deferred, so neighborhood cards use the city photo for now.
// All URLs are Unsplash (images.unsplash.com) with size and quality params baked in.

export const CITY_PHOTOS: Record<string, string> = {
  chicago:          'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=60',
  charlotte:        'https://images.unsplash.com/photo-1660585410813-dc380d75bf46?w=1600&auto=format&q=85',
  dallas:           'https://images.unsplash.com/photo-1578234467412-b0bbdb4c2283?w=1600&auto=format&q=85',
  houston:          'https://images.unsplash.com/photo-1746311528667-1038fe0c8c46?w=1600&auto=format&q=85',
  atlanta:          'https://images.unsplash.com/photo-1663601460253-aba72eea6edf?w=1600&auto=format&q=85',
  seattle:          'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1200&q=60',
  phoenix:          'https://images.unsplash.com/photo-1597271479771-757112f11d9f?w=1600&auto=format&q=85',
  montgomery:       'https://images.unsplash.com/photo-1691858922507-b18dc6247796?w=1600&auto=format&q=85',
  // Launch cities added with the DB migration.
  austin:           'https://images.unsplash.com/photo-1607305080638-ec3afec8e28d?w=1600&auto=format&q=85',
  denver:           'https://images.unsplash.com/photo-1709689702529-6fa1f343e108?w=1600&auto=format&q=85',
  nashville:        'https://images.unsplash.com/photo-1556033681-83abea291a96?w=1600&auto=format&q=85',
  miami:            'https://images.unsplash.com/photo-1741023705528-2953cb652705?w=1600&auto=format&q=85',
  raleigh:          'https://images.unsplash.com/photo-1676934556859-624fa21e2588?w=1600&auto=format&q=85',
  springfield:      'https://images.unsplash.com/photo-1642799819201-c3ccf956b013?w=1600&auto=format&q=85',
  dcmetro:          'https://images.unsplash.com/photo-1649184046382-b815f1f43d06?w=1600&auto=format&q=85',
  northernvirginia: 'https://images.unsplash.com/photo-1654803291865-a92b7b496bb3?w=1600&auto=format&q=85',
};

export function getCityPhoto(cityKey: string): string {
  return CITY_PHOTOS[cityKey] || CITY_PHOTOS.chicago;
}

// City display label (e.g. "Chicago, IL"). Derived from a find-flow city key.
export function getCityLabel(cityKey: string): string {
  const labels: Record<string, string> = {
    chicago:          'Chicago, IL',
    charlotte:        'Charlotte, NC',
    dallas:           'Dallas, TX',
    houston:          'Houston, TX',
    atlanta:          'Atlanta, GA',
    seattle:          'Seattle, WA',
    phoenix:          'Phoenix, AZ',
    montgomery:       'Montgomery County, MD',
    austin:           'Austin, TX',
    denver:           'Denver, CO',
    nashville:        'Nashville, TN',
    miami:            'Miami, FL',
    raleigh:          'Raleigh, NC',
    springfield:      'Springfield, IL',
    dcmetro:          'DC Metro, DC',
    northernvirginia: 'Northern Virginia, VA',
  };
  return labels[cityKey] || 'Your city';
}
