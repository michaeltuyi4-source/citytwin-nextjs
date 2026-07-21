"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import CTLogo from "@/components/CTLogo";
import NavAuth from "@/components/NavAuth";
import AuthModal from "@/components/AuthModal";
import UpgradeModal from "@/components/UpgradeModal";
import { createClient } from "@/lib/supabase";
import { getCategoryIcon } from "@/lib/categoryIcons";
import type { MatchResult, Place } from "@/lib/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const API_BASE = "https://citytwin-api.azurewebsites.net/api/places";

const CATEGORIES = [
  { id: "coffeeShops", label: "Coffee" },
  { id: "foodScene", label: "Food" },
  { id: "fitness", label: "Fitness" },
  { id: "faith", label: "Faith" },
  { id: "outdoorSpaces", label: "Outdoors" },
  { id: "nightlife", label: "Nightlife" },
  { id: "culturalDiversity", label: "Intl Markets" },
  { id: "grocery", label: "Grocery" },
  { id: "familyFriendly", label: "Family" },
  { id: "shopping", label: "Shopping" },
  { id: "entertainment", label: "Entertainment" },
  { id: "trails", label: "Trails" },
];

function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePlaces(data: any): Place[] {
  return (data?.results || []).map((p: Record<string, unknown>) => ({
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    rating: p.rating,
    reviews: p.user_ratings_total,
    address: p.vicinity,
    open: p.open_now,
  })) as Place[];
}

export default function PlacesPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapboxglRef = useRef<any>(null);

  const [allResults, setAllResults] = useState<MatchResult[]>([]);
  const [userPriorities, setUserPriorities] = useState<Record<string, string>>(
    {},
  );
  const [activeIdx, setActiveIdx] = useState(0); // which result we're viewing
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [placeLoading, setPlaceLoading] = useState(false);
  const [placeError, setPlaceError] = useState(false);
  const [placeCounts, setPlaceCounts] = useState<Record<string, number>>({});
  const [highlightedCard, setHighlighted] = useState<number | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // tier === 'premium'
  const placesCache = useRef<Record<string, Record<string, Place[]>>>({});
  // Neighborhood ids whose category counts have already been prefetched this
  // session. Guards the parallel fetch so it fires at most once per neighborhood.
  const countsFetchedRef = useRef<Set<string>>(new Set());
  // The neighborhood currently being viewed, so a late-resolving fetch only
  // writes counts when its neighborhood is still active (not after a switch).
  const activeCacheKeyRef = useRef<string>("");

  const supabase = createClient();

  const currentResult = allResults[activeIdx];
  const coords = currentResult?.coords
    ? { lat: currentResult.coords.lat, lng: currentResult.coords.lng }
    : { lat: 41.9088, lng: -87.6788 };

  // ── Load session storage ──────────────────────────────────────────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem("citytwin_results");
    const rawPri = sessionStorage.getItem("citytwin_priorities");
    if (raw) setAllResults(JSON.parse(raw));
    if (rawPri) setUserPriorities(JSON.parse(rawPri));
  }, []);

  // ── Prefetch counts for every category so all tabs show a count (incl. 0) ───────
  useEffect(() => {
    const result = allResults[activeIdx];
    if (!result?.coords) return;
    const { lat, lng } = result.coords;
    const cacheKey = result.id || "default";
    activeCacheKeyRef.current = cacheKey;

    // Always seed every tab from the in-memory cache so counts (incl. 0) show
    // immediately, including when returning to an already-fetched neighborhood.
    setPlaceCounts(() => {
      const seed: Record<string, number> = {};
      CATEGORIES.forEach((c) => {
        seed[c.id] = placesCache.current[cacheKey]?.[c.id]?.length ?? 0;
      });
      return seed;
    });

    // Fetch the parallel batch at most once per neighborhood per session.
    // Revisiting a neighborhood serves counts and place data from cache only.
    if (countsFetchedRef.current.has(cacheKey)) return;
    countsFetchedRef.current.add(cacheKey);

    CATEGORIES.forEach(async (cat) => {
      if (placesCache.current[cacheKey]?.[cat.id]) return; // already cached and counted
      try {
        const res = await fetch(
          `${API_BASE}?lat=${lat}&lng=${lng}&type=${cat.id}&radius=4827`,
        );
        const data = await res.json();
        const fetched = normalizePlaces(data);
        if (!placesCache.current[cacheKey]) placesCache.current[cacheKey] = {};
        placesCache.current[cacheKey][cat.id] = fetched;
        // Only apply if this neighborhood is still the one being viewed.
        if (activeCacheKeyRef.current === cacheKey) {
          setPlaceCounts((prev) => ({ ...prev, [cat.id]: fetched.length }));
        }
      } catch {
        /* leave this category's count at 0; not retried this session */
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx, allResults]);

  // ── Init Mapbox ───────────────────────────────────────────────────────────────
  useEffect(() => {
    // Wait for results so we center on the real neighborhood, not the fallback coords
    if (!mapContainerRef.current || mapRef.current || !allResults.length)
      return;

    let mounted = true;
    let initTimer: ReturnType<typeof setTimeout> | null = null;

    // 100ms delay lets the DOM fully settle before Mapbox measures the container
    initTimer = setTimeout(() => {
      if (!mounted) return;

      import("mapbox-gl")
        .then(({ default: mapboxgl }) => {
          if (!mounted || !mapContainerRef.current || mapRef.current) return;
          try {
            mapboxglRef.current = mapboxgl;

            // Ensure container is empty before Mapbox writes its canvas
            mapContainerRef.current.innerHTML = "";

            mapboxgl.accessToken = MAPBOX_TOKEN;
            const map = new mapboxgl.Map({
              container: mapContainerRef.current!,
              style: "mapbox://styles/mapbox/light-v11",
              center: [allResults[0].coords.lng, allResults[0].coords.lat],
              zoom: 14,
            });
            map.addControl(
              new mapboxgl.NavigationControl({ showCompass: false }),
              "top-left",
            );
            mapRef.current = map;
            setTimeout(() => {
              map.resize();
            }, 200);

            // Center marker
            new mapboxgl.Marker({ color: "#162F4A", scale: 0.8 })
              .setLngLat([allResults[0].coords.lng, allResults[0].coords.lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(
                  `<div class="popup-name">${currentResult?.name || "Your neighborhood"}</div>
                 <div class="popup-address">Your matched neighborhood</div>`,
                ),
              )
              .addTo(map);

            map.on("load", () => {
              if (CATEGORIES.length > 0) selectCategory(CATEGORIES[0]);
            });
          } catch {
            if (mapRef.current) {
              mapRef.current.remove();
              mapRef.current = null;
            }
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
  // Reads the LIVE session and tier (profiles.tier, the same source of truth the
  // rest of the app uses for premium) and updates the signed-in and premium
  // signals. Returns whether the user is premium right now. Called at mount, on
  // auth changes, and at click time, so the gate never relies on a stale
  // mount-time tier value (e.g. right after a Stripe upgrade).
  const refreshPremium = useCallback(async (): Promise<{
    signedIn: boolean;
    premium: boolean;
  }> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setIsPremium(false);
      return { signedIn: false, premium: false };
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier")
      .eq("id", session.user.id)
      .single();
    const premium = profile?.tier === "premium";
    setIsPremium(premium);
    return { signedIn: true, premium };
  }, [supabase]);

  useEffect(() => {
    refreshPremium();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // INITIAL_SESSION fires on a hard reload that restores a persisted session
      // (SIGNED_IN only fires on a fresh interactive login). Handle both so the
      // premium tier is re-read and the switcher stays unlocked on reload.
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
        setAuthOpen(false);
        // Defer out of the callback: calling Supabase (getSession + profiles
        // query in refreshPremium) directly inside onAuthStateChange deadlocks
        // on the INITIAL_SESSION path while GoTrue holds its auth lock.
        setTimeout(() => {
          refreshPremium();
        }, 0);
      } else if (event === "SIGNED_OUT") {
        setIsPremium(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshPremium, supabase.auth]);

  // ── Clear markers helper ──────────────────────────────────────────────────────
  function clearMarkers() {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }

  // ── Select category ───────────────────────────────────────────────────────────
  async function selectCategory(cat: (typeof CATEGORIES)[0]) {
    setActiveCat(cat.id);
    setHighlighted(null);

    const cacheKey = allResults[activeIdx]?.id || "default";
    if (placesCache.current[cacheKey]?.[cat.id]) {
      renderPlaces(placesCache.current[cacheKey][cat.id]);
      return;
    }

    setPlaceLoading(true);
    setPlaceError(false);
    setPlaces([]);
    clearMarkers();

    try {
      const url = `${API_BASE}?lat=${coords.lat}&lng=${coords.lng}&type=${cat.id}&radius=4827`;
      const res = await fetch(url);
      const data = await res.json();
      const fetched = normalizePlaces(data);

      if (!placesCache.current[cacheKey]) placesCache.current[cacheKey] = {};
      placesCache.current[cacheKey][cat.id] = fetched;

      setPlaceCounts((prev) => ({ ...prev, [cat.id]: fetched.length }));
      renderPlaces(fetched);
    } catch {
      setPlaceError(true);
      setPlaceLoading(false);
    }
  }

  function renderPlaces(data: Place[]) {
    setPlaces(data);
    setPlaceLoading(false);
    clearMarkers();

    if (!mapRef.current || !data.length || !mapboxglRef.current) return;

    const mapboxgl = mapboxglRef.current;
    mapRef.current.jumpTo({ center: [coords.lng, coords.lat], zoom: 14 });

    data.forEach((place, i) => {
      if (!place.lat || !place.lng) return;

      const el = document.createElement("div");
      el.style.cssText =
        "width:32px;height:32px;background:var(--navy);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;cursor:pointer;box-shadow:0 2px 8px rgba(22,47,74,.3);transition:transform .2s;display:flex;align-items:center;justify-content:center;";
      const inner = document.createElement("div");
      inner.style.cssText =
        "transform:rotate(45deg);display:flex;align-items:center;justify-content:center;";
      inner.innerHTML =
        '<svg width="9" height="9" viewBox="0 0 24 24" fill="#ffffff"><circle cx="12" cy="12" r="7"/></svg>';
      el.appendChild(inner);

      const popup = new mapboxgl.Popup({
        offset: 30,
        closeButton: false,
      }).setHTML(
        `<div class="popup-name">${place.name}</div>
         ${place.rating ? `<div class="popup-rating">${"★".repeat(Math.round(place.rating))} ${place.rating}</div>` : ""}
         <div class="popup-address">${place.address || ""}</div>`,
      );

      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.lng, place.lat])
        .setPopup(popup)
        .addTo(mapRef.current);

      el.addEventListener("click", () => {
        setHighlighted(i);
        const cards = document.querySelectorAll(".place-card");
        cards[i]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });

      markersRef.current.push(marker);
    });
  }

  function focusPlace(place: Place, index: number) {
    if (!place.lat || !place.lng || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [place.lng, place.lat],
      zoom: 15.5,
      duration: 600,
    });
    markersRef.current[index]?.togglePopup();
    setHighlighted(index);
  }

  // ── Switch neighborhood ───────────────────────────────────────────────────────
  async function switchNeighborhood(index: number) {
    // Match #1 is always free. For #2/#3, premium users switch with no modal,
    // unlimited times. Non-premium get the unlock prompt (auth if signed out,
    // upgrade if signed in free). isPremium short-circuits so premium switches
    // are instant with no query; otherwise re-check tier live to catch a
    // just-upgraded user rather than trusting stale mount-time state.
    if (index > 0 && !isPremium) {
      const { signedIn, premium } = await refreshPremium();
      if (!premium) {
        if (signedIn) setUpgradeOpen(true);
        else setAuthOpen(true);
        return;
      }
    }

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

  // ── Address search ────────────────────────────────────────────────────────────
  const [addressQuery, setAddressQuery] = useState("");
  const [addressResults, setAddressResults] = useState<
    { place_name: string; center: [number, number] }[]
  >([]);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleAddressSearch(val: string) {
    setAddressQuery(val);
    if (val.length < 3) {
      setAddressResults([]);
      return;
    }
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?access_token=${MAPBOX_TOKEN}&limit=4&country=us`,
        );
        const data = await res.json();
        setAddressResults(data.features || []);
      } catch {
        setAddressResults([]);
      }
    }, 400);
  }

  function selectAddress(lat: number, lng: number, name: string) {
    setAddressResults([]);
    setAddressQuery(name);

    if (searchMarkerRef.current) searchMarkerRef.current.remove();

    import("mapbox-gl").then(({ default: mapboxgl }) => {
      const el = document.createElement("div");
      el.style.cssText =
        "width:14px;height:14px;background:#C47B2B;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(196,123,43,.5)";
      searchMarkerRef.current = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14, duration: 600 });

      // Update distances on cards
      const currentPlaces =
        placesCache.current[allResults[activeIdx]?.id]?.[activeCat || ""] || [];
      const cards = document.querySelectorAll<HTMLElement>(".place-card");
      cards.forEach((card, i) => {
        const place = currentPlaces[i];
        if (!place?.lat || !place?.lng) return;
        const dist = haversine(lat, lng, place.lat, place.lng);
        let distEl = card.querySelector<HTMLElement>(".place-distance");
        if (!distEl) {
          distEl = document.createElement("div");
          distEl.className = "place-distance";
          distEl.style.cssText =
            "font-size:.7rem;color:var(--navy-soft);font-weight:600;margin-top:4px";
          card.appendChild(distEl);
        }
        distEl.textContent = `${dist.toFixed(1)} mi from your address`;
      });
    });
  }

  // Sort categories: user priorities first
  const priorityOrder: Record<string, number> = {
    "must-have": 0,
    important: 1,
    "nice-to-have": 2,
  };
  const sortedCats = [...CATEGORIES].sort((a, b) => {
    const pa =
      userPriorities[a.id] !== undefined
        ? priorityOrder[userPriorities[a.id]]
        : 10;
    const pb =
      userPriorities[b.id] !== undefined
        ? priorityOrder[userPriorities[b.id]]
        : 10;
    return pa - pb;
  });

  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        background:
          "linear-gradient(180deg, #ECF1F8 0%, #F5F1E9 55%, #FBF6EE 100%)",
        color: "var(--navy)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100vw",
        height: "100vh",
        overflow: "hidden",
        overflowX: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ── NAV ── */}
      <nav className="places-nav">
        <Link href="/" className="nav-brand">
          <CTLogo size={32} />
          <span className="nav-brand-name">CityTwin</span>
        </Link>
        <div className="nav-end">
          <Link href="/results" className="nav-back">
            ← Back to results
          </Link>
          <NavAuth />
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div className="page-header">
        <div className="neighborhood-name">
          Your places in <em>{currentResult?.name || "your neighborhood"}</em>
        </div>
        <div className="header-sub">
          {currentResult
            ? `Showing real venues near ${currentResult.name}, filtered by your priorities`
            : "Loading your lifestyle map…"}
        </div>
      </div>

      {/* ── SWITCHER ── */}
      {allResults.length > 1 && (
        <div className="switcher-wrap">
          <div className="switcher">
            <span className="switcher-label">Explore</span>
            {allResults.map((r, i) => {
              const rankLabels = ["#1 match", "#2 match", "#3 match"];
              const locked = i > 0 && !isPremium;
              return (
                <button
                  key={i}
                  className={`switcher-btn${activeIdx === i ? " active" : ""}${locked ? " locked" : ""}`}
                  onClick={() => switchNeighborhood(i)}
                >
                  <span className="switcher-rank">
                    {rankLabels[i] || `#${i + 1}`}
                  </span>
                  {r.name}
                  {locked && (
                    <span className="switcher-lock" aria-hidden="true">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 018 0v4" />
                      </svg>
                    </span>
                  )}
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
              className={`tab${activeCat === cat.id ? " active" : ""}`}
              onClick={() => selectCategory(cat)}
            >
              <span className="tab-icon">{getCategoryIcon(cat.id, 16)}</span>
              {cat.label}
              <span className="tab-count">{placeCounts[cat.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN: MAP + PANEL ── */}
      <div className="places-main">
        {/* Map container */}
        <div className="places-map-wrap">
          <div
            id="map"
            ref={mapContainerRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        {/* Sidebar */}
        <div className="places-panel">
          <div className="panel-head">
            <div className="panel-title">
              {activeCat ? (
                <span className="panel-title-inner">
                  <span className="panel-title-icon">
                    {getCategoryIcon(activeCat, 16)}
                  </span>
                  {CATEGORIES.find((c) => c.id === activeCat)?.label} nearby
                </span>
              ) : (
                "Nearby places"
              )}
            </div>
            <div className="panel-sub">
              {placeLoading
                ? `Searching near ${currentResult?.name || ""}…`
                : places.length > 0
                  ? `${places.length} place${places.length !== 1 ? "s" : ""} within 1 mile`
                  : "Select a category above"}
            </div>
          </div>

          {/* Address search */}
          <div
            style={{
              padding: "7px 10px",
              borderBottom: "1px solid var(--blue-pale)",
              flexShrink: 0,
            }}
          >
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search address to measure distance…"
                value={addressQuery}
                onChange={(e) => handleAddressSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 34px 9px 12px",
                  border: "1.5px solid var(--blue-pale)",
                  borderRadius: 10,
                  fontFamily: "var(--font-body)",
                  fontSize: "16px",
                  color: "var(--navy)",
                  background: "var(--bg)",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--navy-mid)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--blue-pale)";
                }}
              />
              <span
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "inline-flex",
                  color: "var(--slate-400)",
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </span>
            </div>
            {addressResults.length > 0 && (
              <div
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--blue-pale)",
                  borderRadius: 10,
                  marginTop: 4,
                  maxHeight: 160,
                  overflowY: "auto",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                {addressResults.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px 12px",
                      fontSize: ".78rem",
                      color: "var(--navy)",
                      cursor: "pointer",
                      borderBottom: "1px solid var(--blue-pale)",
                      lineHeight: 1.4,
                    }}
                    onClick={() =>
                      selectAddress(f.center[1], f.center[0], f.place_name)
                    }
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "var(--blue-mist)";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "";
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        verticalAlign: "middle",
                        marginRight: 6,
                        color: "var(--amber)",
                      }}
                      aria-hidden="true"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    {f.place_name}
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
                  Finding{" "}
                  {CATEGORIES.find(
                    (c) => c.id === activeCat,
                  )?.label?.toLowerCase() || "places"}{" "}
                  near {currentResult?.name || ""}…
                </div>
              </div>
            )}
            {placeError && (
              <div className="empty-state">
                <div className="empty-icon" aria-hidden="true">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                    <path d="M12 9v4M12 17h.01" />
                  </svg>
                </div>
                <div className="empty-title">Couldn&apos;t load places</div>
                <div className="empty-sub">
                  Check your connection and try again.
                </div>
              </div>
            )}
            {!placeLoading &&
              !placeError &&
              places.length === 0 &&
              activeCat && (
                <div className="empty-state">
                  <div className="empty-icon" aria-hidden="true">
                    {getCategoryIcon(activeCat, 32)}
                  </div>
                  <div className="empty-title">None found nearby</div>
                  <div className="empty-sub">
                    No{" "}
                    {CATEGORIES.find(
                      (c) => c.id === activeCat,
                    )?.label?.toLowerCase()}{" "}
                    found within 1 mile of {currentResult?.name}. Try another
                    category.
                  </div>
                </div>
              )}
            {!placeLoading &&
              !placeError &&
              places.map((place, i) => {
                const openStatus =
                  place.open === true
                    ? "open"
                    : place.open === false
                      ? "closed"
                      : "unknown";
                const openLabel =
                  place.open === true
                    ? "Open"
                    : place.open === false
                      ? "Closed"
                      : "Hours vary";
                const stars = place.rating
                  ? "★".repeat(Math.round(place.rating)) +
                    "☆".repeat(5 - Math.round(place.rating))
                  : "";
                return (
                  <div
                    key={i}
                    className={`place-card${highlightedCard === i ? " highlighted" : ""}`}
                    onClick={() => focusPlace(place, i)}
                  >
                    <div className="place-card-top">
                      <div className="place-name">{place.name}</div>
                      <span className={`place-open ${openStatus}`}>
                        {openLabel}
                      </span>
                    </div>
                    {place.rating && (
                      <div className="place-meta">
                        <span className="place-rating">
                          {stars} {place.rating}
                        </span>
                        {place.reviews && (
                          <span className="place-reviews">
                            ({place.reviews.toLocaleString()} reviews)
                          </span>
                        )}
                      </div>
                    )}
                    {place.address && (
                      <div className="place-address">{place.address}</div>
                    )}
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
        sub="Sign up to explore all three of your matched neighborhoods, free account, no credit card required."
      />
      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
      />
    </div>
  );
}
