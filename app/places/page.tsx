'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import CTLogo from '@/components/CTLogo';
import AuthModal from '@/components/AuthModal';
import UpgradeModal from '@/components/UpgradeModal';
import { createClient } from '@/lib/supabase';
import type { MatchResult, Place } from '@/lib/types';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const API_BASE = 'https://citytwin-api.azurewebsites.net/api/places';

const CATEGORIES = [
  { id: 'coffeeShops',       label: 'Coffee',        icon: '☕' },
  { id: 'foodScene',         label: 'Food',          icon: '🍜' },
  { id: 'fitness',           label: 'Fitness',       icon: '💪' },
  { id: 'faith',             label: 'Faith',         icon: '⛪' },
  { id: 'outdoorSpaces',     label: 'Outdoors',      icon: '🌳' },
  { id: 'nightlife',         label: 'Nightlife',     icon: '🎵' },
  { id: 'culturalDiversity', label: 'Intl Markets',  icon: '🌍' },
  { id: 'grocery',           label: 'Grocery',       icon: '🛒' },
  { id: 'familyFriendly',    label: 'Family',        icon: '👨‍👩‍👧' },
  { id: 'shopping',          label: 'Shopping',      icon: '🛍️' },
  { id: 'entertainment',     label: 'Entertainment', icon: '🎭' },
  { id: 'trails',            label: 'Trails',        icon: '🥾' },
];

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function PlacesPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef    = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapboxglRef = useRef<any>(null);

  const [allResults, setAllResults]       = useState<MatchResult[]>([]);
  const [userPriorities, setUserPriorities] = useState<Record<string, string>>({});
  const [activeIdx, setActiveIdx]         = useState(0);            // which result we're viewing
  const [activeCat, setActiveCat]         = useState<string | null>(null);
  const [places, setPlaces]               = useState<Place[]>([]);
  const [placeLoading, setPlaceLoading]   = useState(false);
  const [placeError, setPlaceError]       = useState(false);
  const [placeCounts, setPlaceCounts]     = useState<Record<string, number>>({});
  const [highlightedCard, setHighlighted] = useState<number | null>(null);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [authOpen, setAuthOpen]           = useState(false);
  const [upgradeOpen, setUpgradeOpen]     = useState(false);
  const [switcherLocked, setSwitcherLocked] = useState(true);
  const placesCache = useRef<Record<string, Record<string, Place[]>>>({});

  const supabase = createClient();

  const currentResult = allResults[activeIdx];
  const coords = currentResult?.coords
    ? { lat: currentResult.coords.lat, lng: currentResult.coords.lng }
    : { lat: 41.9088, lng: -87.6788 };

  // ── Load session storage ──────────────────────────────────────────────────────
  useEffect(() => {
    const raw    = sessionStorage.getItem('citytwin_results');
    const rawPri = sessionStorage.getItem('citytwin_priorities');
    if (raw)    setAllResults(JSON.parse(raw));
    if (rawPri) setUserPriorities(JSON.parse(rawPri));
  }, []);

  // ── Init Mapbox ───────────────────────────────────────────────────────────────
  useEffect(() => {
    // Wait for results so we center on the real neighborhood, not the fallback coords
    if (!mapContainerRef.current || mapRef.current || !allResults.length) return;

    let mounted = true;
    let initTimer: ReturnType<typeof setTimeout> | null = null;

    // 100ms delay lets the DOM fully settle before Mapbox measures the container
    initTimer = setTimeout(() => {
      if (!mounted) return;

      import('mapbox-gl')
        .then(({ default: mapboxgl }) => {
          if (!mounted || !mapContainerRef.current || mapRef.current) return;
          try {
            mapboxglRef.current = mapboxgl;

            // Ensure container is empty before Mapbox writes its canvas
            mapContainerRef.current.innerHTML = '';

            mapboxgl.accessToken = MAPBOX_TOKEN;
            const map = new mapboxgl.Map({
              container: mapContainerRef.current!,
              style: 'mapbox://styles/mapbox/light-v11',
              center: [allResults[0].coords.lng, allResults[0].coords.lat],
              zoom: 14,
            });
            map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');
            mapRef.current = map;
            setTimeout(() => { map.resize(); }, 200);

            // Center marker
            new mapboxgl.Marker({ color: '#162F4A', scale: 0.8 })
              .setLngLat([allResults[0].coords.lng, allResults[0].coords.lat])
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<div class="popup-name">${currentResult?.name || 'Your neighborhood'}</div>
                 <div class="popup-address">Your matched neighborhood</div>`
              ))
              .addTo(map);

            map.on('load', () => {
              if (CATEGORIES.length > 0) selectCategory(CATEGORIES[0]);
            });
          } catch {
            if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
          }
        })
        .catch(() => {});
    }, 100);

    return () => {
      mounted = false;
      if (initTimer) clearTimeout(initTimer);
      markersRef.current = [];
      searchMarkerRef.current = null;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allResults]);

  // ── Auth gate ─────────────────────────────────────────────────────────────────
  const handleSession = useCallback(async (session: { user: { id: string } } | null) => {
    if (!session) { setSwitcherLocked(true); return; }
    const { data: profile } = await supabase
      .from('profiles').select('tier').eq('id', session.user.id).single();
    if (profile?.tier === 'premium') {
      setSwitcherLocked(false);
    } else {
      setSwitcherLocked(false); // logged in but free — allow, upgrade on click
    }
  }, [supabase]);

  useEffect(() => {
    async function applyGate() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await handleSession(session);
    }
    applyGate();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setAuthOpen(false);
        await handleSession(session);
      } else if (event === 'SIGNED_OUT') {
        setSwitcherLocked(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [handleSession, supabase.auth]);

  // ── Clear markers helper ──────────────────────────────────────────────────────
  function clearMarkers() {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }

  // ── Select category ───────────────────────────────────────────────────────────
  async function selectCategory(cat: typeof CATEGORIES[0]) {
    setActiveCat(cat.id);
    setHighlighted(null);

    const cacheKey = allResults[activeIdx]?.id || 'default';
    if (placesCache.current[cacheKey]?.[cat.id]) {
      renderPlaces(placesCache.current[cacheKey][cat.id], cat);
      return;
    }

    setPlaceLoading(true);
    setPlaceError(false);
    setPlaces([]);
    clearMarkers();

    try {
      const url = `${API_BASE}?lat=${coords.lat}&lng=${coords.lng}&type=${cat.id}&radius=4827`;
      const res  = await fetch(url);
      const data = await res.json();
      const fetched: Place[] = (data.results || []).map((p: Record<string, unknown>) => ({
        name:    p.name,
        lat:     p.lat,
        lng:     p.lng,
        rating:  p.rating,
        reviews: p.user_ratings_total,
        address: p.vicinity,
        open:    p.open_now,
      }));

      if (!placesCache.current[cacheKey]) placesCache.current[cacheKey] = {};
      placesCache.current[cacheKey][cat.id] = fetched;

      setPlaceCounts((prev) => ({ ...prev, [cat.id]: fetched.length }));
      renderPlaces(fetched, cat);
    } catch {
      setPlaceError(true);
      setPlaceLoading(false);
    }
  }

  function renderPlaces(data: Place[], cat: typeof CATEGORIES[0]) {
    setPlaces(data);
    setPlaceLoading(false);
    clearMarkers();

    if (!mapRef.current || !data.length || !mapboxglRef.current) return;

    const mapboxgl = mapboxglRef.current;
    mapRef.current.jumpTo({ center: [coords.lng, coords.lat], zoom: 14 });

    data.forEach((place, i) => {
      if (!place.lat || !place.lng) return;

      const el    = document.createElement('div');
      el.style.cssText = 'width:32px;height:32px;background:var(--navy);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;cursor:pointer;box-shadow:0 2px 8px rgba(22,47,74,.3);transition:transform .2s;display:flex;align-items:center;justify-content:center;';
      const inner = document.createElement('div');
      inner.style.cssText = 'transform:rotate(45deg);font-size:.75rem;line-height:1;';
      inner.textContent = cat.icon;
      el.appendChild(inner);

      const popup = new mapboxgl.Popup({ offset: 30, closeButton: false }).setHTML(
        `<div class="popup-name">${place.name}</div>
         ${place.rating ? `<div class="popup-rating">${'★'.repeat(Math.round(place.rating))} ${place.rating}</div>` : ''}
         <div class="popup-address">${place.address || ''}</div>`
      );

      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.lng, place.lat])
        .setPopup(popup)
        .addTo(mapRef.current);

      el.addEventListener('click', () => {
        setHighlighted(i);
        const cards = document.querySelectorAll('.place-card');
        cards[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });

      markersRef.current.push(marker);
    });
  }

  function focusPlace(place: Place, index: number) {
    if (!place.lat || !place.lng || !mapRef.current) return;
    mapRef.current.flyTo({ center: [place.lng, place.lat], zoom: 15.5, duration: 600 });
    markersRef.current[index]?.togglePopup();
    setHighlighted(index);
  }

  // ── Switch neighborhood ───────────────────────────────────────────────────────
  function switchNeighborhood(index: number) {
    if (index > 0 && switcherLocked) { setAuthOpen(true); return; }
    if (index > 0 && !switcherLocked) { setUpgradeOpen(true); return; }

    setActiveIdx(index);
    clearMarkers();
    setPlaces([]);
    setActiveCat(null);
    setPlaceCounts({});

    const n = allResults[index];
    if (!n || !mapRef.current) return;

    const c = { lat: n.coords?.lat || 41.9088, lng: n.coords?.lng || -87.6788 };
    mapRef.current.flyTo({ center: [c.lng, c.lat], zoom: 14, duration: 800 });
    mapRef.current.resize();

    // Re-select current tab for new neighborhood
    if (activeCat) {
      const cat = CATEGORIES.find((c2) => c2.id === activeCat);
      if (cat) selectCategory(cat);
    } else if (CATEGORIES.length > 0) {
      selectCategory(CATEGORIES[0]);
    }
  }

  // ── Map fullscreen toggle ─────────────────────────────────────────────────────
  function toggleMapFullscreen() {
    setMapFullscreen((v) => !v);
    setTimeout(() => mapRef.current?.resize(), 350);
  }

  // ── Address search ────────────────────────────────────────────────────────────
  const [addressQuery, setAddressQuery]   = useState('');
  const [addressResults, setAddressResults] = useState<{ place_name: string; center: [number, number] }[]>([]);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleAddressSearch(val: string) {
    setAddressQuery(val);
    if (val.length < 3) { setAddressResults([]); return; }
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      try {
        const res  = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?access_token=${MAPBOX_TOKEN}&limit=4&country=us`);
        const data = await res.json();
        setAddressResults(data.features || []);
      } catch { setAddressResults([]); }
    }, 400);
  }

  function selectAddress(lat: number, lng: number, name: string) {
    setAddressResults([]);
    setAddressQuery(name);

    if (searchMarkerRef.current) searchMarkerRef.current.remove();

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      const el = document.createElement('div');
      el.style.cssText = 'width:14px;height:14px;background:#C47B2B;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(196,123,43,.5)';
      searchMarkerRef.current = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(mapRef.current);
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14, duration: 600 });

      // Update distances on cards
      const currentPlaces = placesCache.current[allResults[activeIdx]?.id]?.[activeCat || ''] || [];
      const cards = document.querySelectorAll<HTMLElement>('.place-card');
      cards.forEach((card, i) => {
        const place = currentPlaces[i];
        if (!place?.lat || !place?.lng) return;
        const dist = haversine(lat, lng, place.lat, place.lng);
        let distEl = card.querySelector<HTMLElement>('.place-distance');
        if (!distEl) {
          distEl = document.createElement('div');
          distEl.className = 'place-distance';
          distEl.style.cssText = 'font-size:.7rem;color:var(--navy-soft);font-weight:600;margin-top:4px';
          card.appendChild(distEl);
        }
        distEl.textContent = `📍 ${dist.toFixed(1)} mi from your address`;
      });
    });
  }

  const mapEl     = mapFullscreen ? 'map-fullscreen' : '';
  const panelEl   = mapFullscreen ? 'panel-hidden'   : '';
  const toggleIco = mapFullscreen ? '✕' : '🗺️';
  const toggleLbl = mapFullscreen ? 'Close map' : 'Full map';

  // Sort categories: user priorities first
  const priorityOrder: Record<string, number> = { 'must-have': 0, 'important': 1, 'nice-to-have': 2 };
  const sortedCats = [...CATEGORIES].sort((a, b) => {
    const pa = userPriorities[a.id] !== undefined ? priorityOrder[userPriorities[a.id]] : 10;
    const pb = userPriorities[b.id] !== undefined ? priorityOrder[userPriorities[b.id]] : 10;
    return pa - pb;
  });

  return (
    <div style={{ fontFamily: 'var(--font-body)', background: 'var(--brand-50)', color: 'var(--navy)', display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', WebkitFontSmoothing: 'antialiased' }}>

      {/* ── NAV ── */}
      <nav className="places-nav">
        <Link href="/" className="nav-brand">
          <CTLogo size={32} />
          <span className="nav-brand-name">CityTwin</span>
        </Link>
        <Link href="/results" className="nav-back">← Back to results</Link>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div className="neighborhood-name">
          Your places in <em>{currentResult?.name || 'your neighborhood'}</em>
        </div>
        <div className="header-sub">
          {currentResult
            ? `Showing real venues near ${currentResult.name} - filtered by your priorities`
            : 'Loading your lifestyle map…'}
        </div>
      </div>

      {/* ── SWITCHER ── */}
      {allResults.length > 1 && (
        <div className="switcher-wrap">
          <div className="switcher">
            <span className="switcher-label">Explore</span>
            {allResults.map((r, i) => {
              const rankLabels = ['#1 match', '#2 match', '#3 match'];
              const locked = i > 0 && switcherLocked;
              return (
                <button
                  key={i}
                  className={`switcher-btn${activeIdx === i ? ' active' : ''}${locked ? ' locked' : ''}`}
                  onClick={() => switchNeighborhood(i)}
                >
                  <span className="switcher-rank">{rankLabels[i] || `#${i + 1}`}</span>
                  {r.name}
                  {locked && <span className="switcher-lock">🔒</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CATEGORY TABS ── */}
      <div className="tabs-wrap">
        <div className="tabs">
          {sortedCats.map((cat) => (
            <button
              key={cat.id}
              className={`tab${activeCat === cat.id ? ' active' : ''}`}
              onClick={() => selectCategory(cat)}
            >
              <span className="tab-icon">{cat.icon}</span>
              {cat.label}
              <span className="tab-count">{placeCounts[cat.id] ?? '—'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN: MAP + PANEL ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>

        {/* Map container */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <div
            id="map"
            ref={mapContainerRef}
            className={mapEl}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>

        {/* Mobile fullscreen toggle */}
        <button
          className={`map-toggle-btn${mapFullscreen ? ' map-mode' : ''}`}
          style={mapFullscreen ? { position: 'fixed', bottom: 20, right: 16, zIndex: 500 } : {}}
          onClick={toggleMapFullscreen}
        >
          <span>{toggleIco}</span>
          <span>{toggleLbl}</span>
        </button>

        {/* Sidebar */}
        <div
          className={`places-panel${panelEl ? ` ${panelEl}` : ''}`}
          style={{ width: '340px', flexShrink: 0, background: '#FFFFFF', borderLeft: '1px solid #E8EFF6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <div className="panel-head">
            <div className="panel-title">
              {activeCat
                ? `${CATEGORIES.find((c) => c.id === activeCat)?.icon} ${CATEGORIES.find((c) => c.id === activeCat)?.label} nearby`
                : 'Nearby places'}
            </div>
            <div className="panel-sub">
              {placeLoading
                ? `Searching near ${currentResult?.name || ''}…`
                : places.length > 0
                ? `${places.length} place${places.length !== 1 ? 's' : ''} within 1 mile`
                : 'Select a category above'}
            </div>
          </div>

          {/* Address search */}
          <div style={{ padding: '7px 10px', borderBottom: '1px solid var(--blue-pale)', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search address to measure distance…"
                value={addressQuery}
                onChange={(e) => handleAddressSearch(e.target.value)}
                style={{ width: '100%', padding: '7px 32px 7px 10px', border: '1.5px solid var(--blue-pale)', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '.76rem', color: 'var(--navy)', background: 'var(--bg)', outline: 'none' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--navy-mid)'; }}
                onBlur={(e)  => { e.target.style.borderColor = 'var(--blue-pale)'; }}
              />
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '.85rem', pointerEvents: 'none' }}>🔍</span>
            </div>
            {addressResults.length > 0 && (
              <div style={{ background: 'var(--white)', border: '1px solid var(--blue-pale)', borderRadius: 10, marginTop: 4, maxHeight: 160, overflowY: 'auto', boxShadow: 'var(--shadow-soft)' }}>
                {addressResults.map((f, i) => (
                  <div
                    key={i}
                    style={{ padding: '10px 12px', fontSize: '.78rem', color: 'var(--navy)', cursor: 'pointer', borderBottom: '1px solid var(--blue-pale)', lineHeight: 1.4 }}
                    onClick={() => selectAddress(f.center[1], f.center[0], f.place_name)}
                    onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--blue-mist)'; }}
                    onMouseOut={(e)  => { (e.currentTarget as HTMLElement).style.background = ''; }}
                  >
                    📍 {f.place_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Places list */}
          <div className="places-list">
            {placeLoading && (
              <div className="loading-state">
                <div className="loading-spinner" />
                <div className="loading-text">
                  Finding {CATEGORIES.find((c) => c.id === activeCat)?.label?.toLowerCase() || 'places'} near {currentResult?.name || ''}…
                </div>
              </div>
            )}
            {placeError && (
              <div className="empty-state">
                <div className="empty-icon">⚠️</div>
                <div className="empty-title">Couldn&apos;t load places</div>
                <div className="empty-sub">Check your connection and try again.</div>
              </div>
            )}
            {!placeLoading && !placeError && places.length === 0 && activeCat && (
              <div className="empty-state">
                <div className="empty-icon">{CATEGORIES.find((c) => c.id === activeCat)?.icon}</div>
                <div className="empty-title">None found nearby</div>
                <div className="empty-sub">
                  No {CATEGORIES.find((c) => c.id === activeCat)?.label?.toLowerCase()} found within 1 mile of {currentResult?.name}. Try another category.
                </div>
              </div>
            )}
            {!placeLoading && !placeError && places.map((place, i) => {
              const openStatus = place.open === true ? 'open' : place.open === false ? 'closed' : 'unknown';
              const openLabel  = place.open === true ? 'Open' : place.open === false ? 'Closed' : 'Hours vary';
              const stars = place.rating
                ? '★'.repeat(Math.round(place.rating)) + '☆'.repeat(5 - Math.round(place.rating))
                : '';
              return (
                <div
                  key={i}
                  className={`place-card${highlightedCard === i ? ' highlighted' : ''}`}
                  onClick={() => focusPlace(place, i)}
                >
                  <div className="place-card-top">
                    <div className="place-name">{place.name}</div>
                    <span className={`place-open ${openStatus}`}>{openLabel}</span>
                  </div>
                  {place.rating && (
                    <div className="place-meta">
                      <span className="place-rating">{stars} {place.rating}</span>
                      {place.reviews && (
                        <span className="place-reviews">({place.reviews.toLocaleString()} reviews)</span>
                      )}
                    </div>
                  )}
                  {place.address && <div className="place-address">{place.address}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        heading="Unlock all neighborhoods"
        sub="Sign up to explore all three of your matched neighborhoods - free account, no credit card required."
      />
      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
