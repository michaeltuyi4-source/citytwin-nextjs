import React from 'react';

/**
 * Single source of truth for category line icons, shared by the Results and
 * Places pages so both render identical brand SVGs (no emoji).
 * Keys cover the lifestyle categories used on Results plus the extra venue
 * categories used on Places (fitness, faith, grocery, shopping, entertainment,
 * trails).
 */
export function getCategoryIcon(category: string, size = 14): React.ReactNode {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (category) {
    case 'walkability':
      return <svg {...props}><circle cx="12" cy="5" r="2" /><path d="M9 22l3-8 3 8" /><path d="M9 9l-3 4 3 3" /><path d="M15 9l3 4-3 3" /></svg>;
    case 'transitAccess':
      return <svg {...props}><rect x="4" y="3" width="16" height="16" rx="2" /><path d="M4 11h16" /><circle cx="8" cy="15" r="1" /><circle cx="16" cy="15" r="1" /><path d="M9 19l-2 3M15 19l2 3" /></svg>;
    case 'foodScene':
      return <svg {...props}><path d="M3 2v7c0 1.1.9 2 2 2h2v11" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3z" /></svg>;
    case 'coffeeShops':
      return <svg {...props}><path d="M17 8h1a4 4 0 110 8h-1" /><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4z" /><path d="M6 1v3M10 1v3M14 1v3" /></svg>;
    case 'outdoorSpaces':
      return <svg {...props}><path d="M12 2L3 22h18z" /><path d="M12 10v12" /></svg>;
    case 'nightlife':
      return <svg {...props}><path d="M5 2h14l-7 10z" /><path d="M12 12v10M8 22h8" /></svg>;
    case 'familyFriendly':
      return <svg {...props}><circle cx="9" cy="7" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" /><path d="M14 21v-1a3 3 0 013-3h2a3 3 0 013 3v1" /></svg>;
    case 'culturalDiversity':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 010 20" /><path d="M12 2a15 15 0 000 20" /></svg>;
    case 'affordability':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M12 6v12M15 9.5c-.5-1-1.5-1.5-3-1.5s-3 .5-3 2 1.5 2 3 2 3 .5 3 2-1.5 2-3 2-2.5-.5-3-1.5" /></svg>;
    case 'quietResidential':
      return <svg {...props}><path d="M3 12l9-9 9 9" /><path d="M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10" /><path d="M10 21v-6h4v6" /></svg>;
    case 'fitness':
      return <svg {...props}><path d="M2 12h2M20 12h2" /><rect x="4" y="9" width="3" height="6" rx="1" /><rect x="17" y="9" width="3" height="6" rx="1" /><path d="M7 12h10" /></svg>;
    case 'faith':
      return <svg {...props}><path d="M12 2v4M10 4h4" /><path d="M12 6l6 5v11H6V11z" /><path d="M10 22v-5h4v5" /></svg>;
    case 'grocery':
      return <svg {...props}><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h2l2.4 12.2a1 1 0 001 .8h9.7a1 1 0 001-.8L21 7H6" /></svg>;
    case 'shopping':
      return <svg {...props}><path d="M6 8h12l-1 13H7z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>;
    case 'entertainment':
      return <svg {...props}><path d="M3 8a2 2 0 012-2h14a2 2 0 012 2 2 2 0 000 4 2 2 0 000 4 2 2 0 01-2 2H5a2 2 0 01-2-2 2 2 0 000-4 2 2 0 000-4z" /><path d="M13 6v12" /></svg>;
    case 'trails':
      return <svg {...props}><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h6a3 3 0 003-3V9" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" /></svg>;
  }
}
