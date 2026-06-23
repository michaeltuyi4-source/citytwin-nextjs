'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CTLogo from '@/components/CTLogo';
import AuthModal from '@/components/AuthModal';
import UpgradeModal from '@/components/UpgradeModal';
import ShareModal from '@/components/ShareModal';
import { createClient } from '@/lib/supabase';
import { getCityPhoto, getNeighborhoodPhoto, getCityLabel } from '@/lib/photos';
import type { MatchResult, PhraseChip, Gap } from '@/lib/types';

function useCountUp(target: number, duration = 900, triggerKey: unknown = null) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf = 0;
    setValue(0);
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, triggerKey]);

  return value;
}

function getCategoryIcon(category: string): React.ReactNode {
  const props = {
    width: 14,
    height: 14,
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
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" /></svg>;
  }
}

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults]         = useState<MatchResult[]>([]);
  const [priorities, setPriorities]   = useState<Record<string, string>>({});
  const [activeIdx, setActiveIdx]     = useState(0);
  const [cityKey, setCityKey]         = useState('');
  const [mounted, setMounted]         = useState(false);
  const [authOpen, setAuthOpen]             = useState(false);
  const [upgradeOpen, setUpgradeOpen]       = useState(false);
  const [unlocked, setUnlocked]             = useState(false);
  const [session, setSession]               = useState<{ user: { id: string } } | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [shareOpen, setShareOpen]                 = useState(false);
  const [pollTimedOut, setPollTimedOut]           = useState(false);
  const [hydrated, setHydrated]                   = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const supabase = createClient();

  // Session check
  const handleSession = useCallback(async (session: { user: { id: string } } | null) => {
    if (!session) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', session.user.id)
      .single();

    if (profile?.tier === 'premium') {
      setUnlocked(true);
    }
  }, [supabase]);

  // Storage hydration with runtime validation
  useEffect(() => {
    setMounted(true);

    const raw     = sessionStorage.getItem('citytwin_results')    || localStorage.getItem('citytwin_results');
    const rawPri  = sessionStorage.getItem('citytwin_priorities') || localStorage.getItem('citytwin_priorities');
    const rawCity = sessionStorage.getItem('citytwin_city')       || localStorage.getItem('citytwin_city');

    if (rawCity) setCityKey(rawCity);
    if (rawPri) setPriorities(JSON.parse(rawPri));

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const valid = Array.isArray(parsed) && parsed.every((m: unknown) =>
          typeof m === 'object' && m !== null &&
          'id' in m && 'name' in m && 'insightLine' in m && 'phraseChips' in m
        );
        if (valid) {
          setResults(parsed as MatchResult[]);
        } else {
          sessionStorage.removeItem('citytwin_results');
          localStorage.removeItem('citytwin_results');
          router.push('/find');
          return;
        }
      } catch {
        router.push('/find');
        return;
      }
    }

    setHydrated(true);

    // If returning from Stripe success, poll tier until webhook updates it
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) return;
        supabase
          .from('profiles')
          .select('tier')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile?.tier === 'premium') {
              setUnlocked(true);
              return;
            }
            // Webhook hasn't updated yet — poll every second for up to 15s
            setPaymentProcessing(true);
            let attempts = 0;
            pollRef.current = setInterval(async () => {
              attempts++;
              const { data: p } = await supabase
                .from('profiles')
                .select('tier')
                .eq('id', session.user.id)
                .single();
              if (p?.tier === 'premium') {
                setUnlocked(true);
                setPaymentProcessing(false);
                clearInterval(pollRef.current!);
                pollRef.current = null;
                toast.success('Your matches are unlocked!', { description: 'Welcome to CityTwin — all three neighborhoods are now yours.' });
              } else if (attempts >= 15) {
                clearInterval(pollRef.current!);
                pollRef.current = null;
                setPaymentProcessing(false);
                setPollTimedOut(true);
              }
            }, 1000);
          });
      });
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [supabase, router]);

  // Auth gate
  useEffect(() => {
    async function applyGate() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) await handleSession(session);
    }
    applyGate();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        setAuthOpen(false);
        await handleSession(session);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUpgradeOpen(false);
        setUnlocked(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [handleSession, supabase.auth]);

  // Derived values
  const activeMatch = results[activeIdx];
  const cityLabel   = getCityLabel(cityKey);
  const cityPhoto   = getCityPhoto(cityKey);

  const animatedScore = useCountUp(
    activeMatch?.matchPercent ?? 0,
    900,
    activeIdx
  );

  const placeholderMatchCount = useMemo(() => {
    if (!activeMatch) return 0;
    let h = 0;
    for (let i = 0; i < activeMatch.id.length; i++) {
      h = ((h << 5) - h + activeMatch.id.charCodeAt(i)) & 0xffffffff;
    }
    return 80 + (Math.abs(h) % 260);
  }, [activeMatch]);

  // Handlers
  function handleTabClick(idx: number) {
    console.log('[gate] handleTabClick', { idx, hasSession: !!session, unlocked });
    if (idx > 0 && !unlocked) {
      if (session) {
        setUpgradeOpen(true);
      } else {
        setAuthOpen(true);
      }
      return;
    }
    setActiveIdx(idx);
  }

  function handleChangePriorities(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('citytwin_returning', 'true');
    }
    router.push('/find');
  }

  function handleFindPlaces() {
    router.push('/places');
  }

  function handleShare() {
    setShareOpen(true);
  }

  // Silence unused-variable warning; priorities is preserved for Phase 2b use
  void priorities;

  // Not yet hydrated from storage — render nothing to avoid flash
  if (!hydrated) return null;

  // Empty state (only shown after hydration confirms no results)
  if (results.length === 0) {
    return (
      <>
        <nav style={{ background: 'var(--white)', borderBottom: '1px solid var(--blue-pale)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 62 }}>
          <Link href="/" className="nav-brand">
            <CTLogo size={32} />
            <span className="nav-brand-name">CityTwin</span>
          </Link>
        </nav>
        <div style={{ marginTop: 62, padding: '60px 24px', textAlign: 'center' }}>
          <div className="no-results">
            <h2>No results found</h2>
            <p>Something went wrong. Let&apos;s try again.</p>
            <Link href="/find" className="btn-primary">Start over</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="rp-root">

      <div className="rp-bg" aria-hidden="true" />

      <nav className="rp-nav">
        <div className="rp-nav-inner">
          <Link href="/" className="rp-nav-brand">
            <CTLogo size={32} />
            <span className="rp-nav-brand-name">CityTwin</span>
          </Link>
          <button onClick={handleChangePriorities} className="rp-nav-cta">
            Change priorities
          </button>
        </div>
      </nav>

      <section className="rp-hero" aria-label="Your match">
        <div className="rp-hero-photo-wrap">
          {mounted && (
            <Image
              src={cityPhoto}
              alt={`${cityLabel} skyline`}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          )}
          <div className="rp-hero-overlay" aria-hidden="true" />
        </div>
        <div className="rp-hero-content">
          <div className="rp-city-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{cityLabel}</span>
          </div>
          <h1 className="rp-hero-title">
            {results[0]?.name} fits how you live
          </h1>
          <p className="rp-hero-sub">
            3 neighborhoods ranked by how you actually live.
          </p>
        </div>
      </section>

      <div className="rp-rail-wrap">
        <div className="rp-rail" role="tablist" aria-label="Your matches">
          {results.map((r, i) => {
            const isActive = i === activeIdx;
            const isLocked = i > 0 && !unlocked;
            return (
              <button
                key={r.id}
                role="tab"
                aria-selected={isActive}
                className={`rp-rail-card${isActive ? ' rp-rail-card-active' : ''}${isLocked ? ' rp-rail-card-locked' : ''}`}
                onClick={() => handleTabClick(i)}
              >
                <div className="rp-rail-rank">
                  {i === 0 ? 'Best match' : `#${i + 1}`}
                </div>
                <div className="rp-rail-name">{r.name}</div>
                <div className="rp-rail-score">
                  {isLocked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 018 0v4" />
                    </svg>
                  )}
                  <span>{r.matchPercent}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {(paymentProcessing || pollTimedOut) && !unlocked && (
        <div style={{ maxWidth: 720, margin: '12px auto 0', padding: '0 20px' }}>
          <div style={{ background: 'rgba(196,123,43,0.08)', border: '1px solid rgba(196,123,43,0.25)', borderRadius: 12, padding: '14px 18px', fontSize: 13, color: 'var(--navy)', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 12 }}>
            {paymentProcessing && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, animation: 'rp-spin 0.9s linear infinite' }}>
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25" />
                <path d="M21 12a9 9 0 00-9-9" />
              </svg>
            )}
            <span style={{ flex: 1 }}>
              {paymentProcessing
                ? 'Unlocking your matches\u2026 this takes just a moment.'
                : 'Taking longer than expected.'}
            </span>
            {pollTimedOut && (
              <button
                onClick={() => window.location.reload()}
                style={{ flexShrink: 0, background: 'var(--amber)', color: 'white', border: 0, borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Refresh
              </button>
            )}
          </div>
        </div>
      )}

      {activeMatch && (
        <article className="rp-card" key={activeIdx}>

          <div className="rp-card-photo">
            {mounted && (
              <Image
                src={getNeighborhoodPhoto(activeMatch.id, cityKey)}
                alt={`Street scene in ${activeMatch.name}`}
                fill
                sizes="(max-width: 700px) 100vw, 600px"
                style={{ objectFit: 'cover' }}
              />
            )}
            <div className="rp-card-photo-overlay" aria-hidden="true" />
            <div className={`rp-rank-badge${activeIdx === 0 ? ' rp-rank-badge-best' : ''}`}>
              {activeIdx === 0 ? 'Best match' : `#${activeIdx + 1} match`}
            </div>
            <div className="rp-card-photo-bottom">
              <div className="rp-card-photo-text">
                <h2 className="rp-card-name">{activeMatch.name}</h2>
                <p className="rp-card-tagline">{activeMatch.tagline}</p>
              </div>
              <div className={`rp-score-ring${activeIdx === 0 ? ' rp-score-ring-best' : ''}`}>
                <span className="rp-score-ring-value">{animatedScore}%</span>
                <span className="rp-score-ring-label">match</span>
              </div>
            </div>
          </div>

          <div className="rp-card-body">

            <div className="rp-insight">
              {activeMatch.insightLine}
            </div>

            {activeMatch.phraseChips && activeMatch.phraseChips.length > 0 && (
              <section className="rp-section">
                <h3 className="rp-section-label">How it fits how you live</h3>
                <div className="rp-chips">
                  {activeMatch.phraseChips.map((chip: PhraseChip, i: number) => (
                    <div key={i} className={`rp-chip rp-chip-${chip.weight}`}>
                      <span className="rp-chip-icon" aria-hidden="true">
                        {getCategoryIcon(chip.category)}
                      </span>
                      <span className="rp-chip-text">{chip.phrase}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="rp-stats">
              <div className="rp-stat">
                <div className="rp-stat-label">Rent range</div>
                <div className="rp-stat-value">{activeMatch.rentRange}</div>
              </div>
              <div className="rp-stat">
                <div className="rp-stat-label">Walk score</div>
                <div className="rp-stat-value">{activeMatch.walkScore} / 100</div>
              </div>
            </section>

            {activeMatch.highlights && activeMatch.highlights.length > 0 && (
              <section className="rp-section">
                <h3 className="rp-section-label">What makes it stand out</h3>
                <ul className="rp-bullet-list">
                  {activeMatch.highlights.slice(0, 4).map((h: string, i: number) => (
                    <li key={i} className="rp-bullet-row">
                      <span className="rp-bullet-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 16 16">
                          <circle cx="8" cy="8" r="8" fill="#EAF5EF" />
                          <path d="M4.5 8.3l2.2 2.2L11.6 5.6" stroke="#2A7A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      </span>
                      <span className="rp-bullet-text">{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {activeMatch.bestFor && activeMatch.bestFor.length > 0 && (
              <section className="rp-section">
                <h3 className="rp-section-label">People who land here</h3>
                <div className="rp-personas">
                  {activeMatch.bestFor.map((p: string, i: number) => (
                    <span key={i} className="rp-persona">{p}</span>
                  ))}
                </div>
              </section>
            )}

            <section className="rp-social-proof">
              <span className="rp-social-proof-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </span>
              <span className="rp-social-proof-text">
                {placeholderMatchCount} movers matched to {activeMatch.name} this month.
              </span>
            </section>

            {activeMatch.gaps && activeMatch.gaps.length > 0 && (
              <section className="rp-section">
                <h3 className="rp-section-label">Worth a heads up</h3>
                <div className="rp-heads-up">
                  {activeMatch.gaps.slice(0, 4).map((g: Gap, i: number) => (
                    <div key={i} className={`rp-heads-up-item${g.isMustHave ? ' rp-heads-up-item-must' : ''}`}>
                      <span className="rp-heads-up-dot" aria-hidden="true" />
                      <span className="rp-heads-up-text">{g.text}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        </article>
      )}

      {activeMatch && (
        <section className="rp-cta">
          <h3 className="rp-cta-title">Ready to see {activeMatch.name} up close?</h3>
          <p className="rp-cta-sub">
            Find the coffee shops, parks, and gyms that match your style, right inside {activeMatch.name}.
          </p>
          <div className="rp-cta-actions">
            <button className="rp-btn-primary" onClick={handleFindPlaces}>
              Find my places in {activeMatch.name}
            </button>
            <button className="rp-btn-ghost" onClick={handleShare}>
              Share my match
            </button>
          </div>
        </section>
      )}

      <footer className="rp-footer">
        <div className="rp-footer-inner">
          <div className="rp-footer-social">
            <a href="https://x.com/CityTwinApp" target="_blank" rel="noopener noreferrer" aria-label="Follow CityTwin on X" className="rp-social-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://instagram.com/citytwinapp" target="_blank" rel="noopener noreferrer" aria-label="Follow CityTwin on Instagram" className="rp-social-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <path d="M16 11.4A4 4 0 1112.6 8 4 4 0 0116 11.4z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://facebook.com/Citytwinapp" target="_blank" rel="noopener noreferrer" aria-label="Follow CityTwin on Facebook" className="rp-social-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.5 1.6-1.5H17V4.3c-.3 0-1.3-.1-2.5-.1-2.4 0-4 1.5-4 4.1v2.5H7.8V14h2.7v8h3z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="rp-footer-legal">
          CityTwin &copy; 2026 &middot; <Link href="/privacy">Privacy</Link> &middot; <Link href="/terms">Terms</Link>
        </div>
      </footer>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        heading="Unlock all matches"
        sub="See your #2 and #3 neighborhood matches. Free account, no credit card required."
        onSignupSuccess={() => setUpgradeOpen(true)}
      />
      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        neighborhoodName={activeMatch?.name ?? ''}
        cityLabel={cityLabel}
        matchPercent={activeMatch?.matchPercent ?? 0}
      />

      <style jsx>{`
        .rp-root {
          position: relative;
          min-height: 100vh;
          font-family: var(--font-body), 'DM Sans', system-ui, sans-serif;
          color: var(--slate);
        }

        .rp-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          background: linear-gradient(180deg, #ECF1F8 0%, #F5F1E9 55%, #FBF6EE 100%);
        }

        .rp-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(242, 246, 251, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 0.5px solid var(--blue-pale);
        }
        .rp-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
        }
        .rp-nav-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--navy);
        }
        .rp-nav-brand-name {
          font-family: var(--font-display);
          font-size: 18px;
        }
        .rp-nav-cta {
          background: transparent;
          color: var(--navy);
          border: 1.5px solid var(--blue-pale);
          border-radius: 100px;
          padding: 7px 16px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .rp-nav-cta:hover {
          border-color: var(--navy-mid);
          color: var(--navy-mid);
        }

        .rp-hero {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        @media (min-width: 720px) {
          .rp-hero { height: 240px; }
        }
        .rp-hero-photo-wrap {
          position: absolute;
          inset: 0;
        }
        .rp-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(14, 28, 46, 0.3) 0%, rgba(22, 47, 74, 0.5) 50%, rgba(22, 47, 74, 0.85) 100%);
        }
        .rp-hero-content {
          position: relative;
          z-index: 1;
          max-width: 720px;
          margin: 0 auto;
          height: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 8px;
        }
        .rp-city-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          align-self: flex-start;
          background: var(--amber-bg);
          color: var(--amber);
          font-size: 11px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 100px;
        }
        .rp-hero-title {
          font-family: var(--font-display);
          font-size: 26px;
          line-height: 1.15;
          color: white;
          margin: 0;
        }
        @media (min-width: 720px) {
          .rp-hero-title { font-size: 32px; }
        }
        .rp-hero-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.75);
          margin: 0;
        }

        .rp-rail-wrap {
          background: transparent;
          padding: 16px 20px 0;
          max-width: 720px;
          margin: 0 auto;
        }
        .rp-rail {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .rp-rail::-webkit-scrollbar { display: none; }
        .rp-rail-card {
          flex: 0 0 calc(33.33% - 7px);
          min-width: 150px;
          background: white;
          border: 1px solid var(--blue-pale);
          border-radius: 14px;
          padding: 10px 12px;
          text-align: left;
          cursor: pointer;
          scroll-snap-align: start;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        @media (max-width: 480px) {
          .rp-rail-card { flex: 0 0 70%; }
        }
        .rp-rail-card:hover:not(.rp-rail-card-locked):not(.rp-rail-card-active) {
          border-color: var(--navy-soft);
        }
        .rp-rail-card-active {
          border-color: var(--navy);
          border-width: 2px;
          padding: 9px 11px;
          box-shadow: 0 4px 16px rgba(120, 60, 20, 0.08);
        }
        .rp-rail-card-locked {
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
        }
        .rp-rail-rank {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--slate-400);
          margin-bottom: 4px;
        }
        .rp-rail-card-active .rp-rail-rank {
          color: var(--amber);
        }
        .rp-rail-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rp-rail-score {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 500;
          color: var(--navy);
        }
        .rp-rail-card-locked .rp-rail-score {
          color: var(--slate-400);
        }

        .rp-card {
          max-width: 720px;
          margin: 16px auto 24px;
          background: rgba(255, 255, 255, 0.96);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(120, 60, 20, 0.08);
          animation: rpFadeIn 0.25s ease;
        }
        @keyframes rpFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes rp-spin {
          to { transform: rotate(360deg); }
        }

        .rp-card-photo {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        .rp-card-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(22, 47, 74, 0.85) 0%, rgba(22, 47, 74, 0) 55%);
        }
        .rp-rank-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.85);
          color: var(--navy);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 5px 10px;
          border-radius: 100px;
          z-index: 2;
        }
        .rp-rank-badge-best {
          background: var(--amber);
          color: white;
        }
        .rp-card-photo-bottom {
          position: absolute;
          bottom: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          z-index: 2;
        }
        .rp-card-photo-text {
          min-width: 0;
        }
        .rp-card-name {
          font-family: var(--font-display);
          font-size: 24px;
          color: white;
          margin: 0 0 2px;
          line-height: 1.1;
        }
        .rp-card-tagline {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.75);
          margin: 0;
        }
        .rp-score-ring {
          flex-shrink: 0;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 2px solid rgba(255, 255, 255, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .rp-score-ring-best {
          border-color: var(--amber-light);
          background: rgba(232, 164, 74, 0.18);
        }
        .rp-score-ring-value {
          font-family: var(--font-display);
          font-size: 17px;
          line-height: 1;
        }
        .rp-score-ring-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.8;
          margin-top: 1px;
        }

        .rp-card-body {
          padding: 20px 20px 24px;
        }

        .rp-insight {
          background: var(--amber-bg);
          border-left: 3px solid var(--amber);
          border-radius: 12px;
          padding: 14px 16px;
          font-family: var(--font-display);
          font-size: 17px;
          line-height: 1.4;
          color: var(--navy);
          margin-bottom: 22px;
        }
        @media (min-width: 720px) {
          .rp-insight { font-size: 18px; }
        }

        .rp-section {
          margin-bottom: 22px;
        }
        .rp-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--slate-400);
          margin: 0 0 12px;
        }

        .rp-chips {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .rp-chip {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: var(--blue-mist);
          border: 0.5px solid var(--blue-pale);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          color: var(--slate);
          line-height: 1.4;
        }
        .rp-chip-must-have {
          background: var(--amber-bg);
          border-color: rgba(196, 123, 43, 0.2);
        }
        .rp-chip-icon {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          color: var(--navy);
          margin-top: 1px;
        }
        .rp-chip-must-have .rp-chip-icon {
          color: var(--amber);
        }
        .rp-chip-text {
          flex: 1;
        }

        .rp-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 22px;
        }
        .rp-stat {
          background: var(--bg);
          border-radius: 10px;
          padding: 10px 12px;
        }
        .rp-stat-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--slate-400);
          margin-bottom: 3px;
        }
        .rp-stat-value {
          font-size: 13px;
          font-weight: 500;
          color: var(--navy);
        }

        .rp-bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .rp-bullet-row {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .rp-bullet-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }
        .rp-bullet-text {
          font-size: 13px;
          color: var(--slate);
          line-height: 1.45;
        }

        .rp-personas {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .rp-persona {
          font-size: 12px;
          background: var(--blue-mist);
          color: var(--navy);
          border: 0.5px solid var(--blue-pale);
          border-radius: 100px;
          padding: 4px 11px;
        }

        .rp-social-proof {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg);
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 22px;
          color: var(--slate-500);
          font-size: 12px;
        }
        .rp-social-proof-icon {
          color: var(--navy-soft);
        }

        .rp-heads-up {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .rp-heads-up-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: var(--amber-pale);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          line-height: 1.4;
          color: #7A4A10;
        }
        .rp-heads-up-item-must {
          background: var(--amber-bg);
          border: 0.5px solid var(--amber);
        }
        .rp-heads-up-dot {
          flex-shrink: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--amber);
          margin-top: 7px;
        }
        .rp-heads-up-text {
          flex: 1;
        }

        .rp-cta {
          max-width: 720px;
          margin: 0 16px 24px;
          padding: 24px 20px;
          background: var(--navy-mid);
          border-radius: 20px;
          color: white;
          text-align: center;
        }
        @media (min-width: 752px) {
          .rp-cta {
            margin-left: auto;
            margin-right: auto;
          }
        }
        .rp-cta-title {
          font-family: var(--font-display);
          font-size: 22px;
          line-height: 1.2;
          margin: 0 0 8px;
        }
        .rp-cta-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 20px;
          line-height: 1.5;
        }
        .rp-cta-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: stretch;
        }
        @media (min-width: 480px) {
          .rp-cta-actions {
            flex-direction: row;
            justify-content: center;
          }
        }
        .rp-btn-primary {
          background: white;
          color: var(--navy);
          border: 0;
          border-radius: 100px;
          padding: 13px 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .rp-btn-primary:hover {
          background: var(--brand-50);
        }
        .rp-btn-primary:active {
          transform: scale(0.98);
        }
        .rp-btn-ghost {
          background: transparent;
          color: rgba(255, 255, 255, 0.85);
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          border-radius: 100px;
          padding: 12px 22px;
          font-size: 13px;
          cursor: pointer;
          transition: border-color 0.15s ease;
        }
        .rp-btn-ghost:hover {
          border-color: rgba(255, 255, 255, 0.5);
        }

        .rp-footer {
          max-width: 720px;
          margin: 0 auto;
          padding: 20px;
          border-top: 0.5px solid var(--blue-pale);
        }
        .rp-footer-inner {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .rp-footer-social {
          display: flex;
          gap: 6px;
        }
        .rp-social-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: var(--bg);
          border: 0.5px solid var(--blue-pale);
          border-radius: 8px;
          color: var(--navy);
          transition: background 0.15s ease, color 0.15s ease;
        }
        .rp-social-btn:hover {
          background: var(--navy);
          color: white;
          border-color: var(--navy);
        }
        .rp-footer-legal {
          font-size: 11px;
          color: var(--slate-400);
          text-align: center;
        }
        .rp-footer-legal a {
          color: var(--slate-400);
          text-decoration: none;
        }
        .rp-footer-legal a:hover {
          text-decoration: underline;
        }
      `}</style>

    </div>
  );
}
