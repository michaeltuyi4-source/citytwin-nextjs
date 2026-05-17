'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import CTLogo from '@/components/CTLogo';
import AuthModal from '@/components/AuthModal';
import UpgradeModal from '@/components/UpgradeModal';
import { createClient } from '@/lib/supabase';
import type { MatchResult } from '@/lib/types';

const CAT_META: Record<string, { label: string; icon: string }> = {
  walkability:       { label: 'Walkability',         icon: '🚶' },
  transitAccess:     { label: 'Public transit',      icon: '🚇' },
  foodScene:         { label: 'Food scene',          icon: '🍜' },
  coffeeShops:       { label: 'Coffee shops',        icon: '☕' },
  outdoorSpaces:     { label: 'Outdoor spaces',      icon: '🌳' },
  nightlife:         { label: 'Nightlife',           icon: '🎵' },
  familyFriendly:    { label: 'Family-friendly',     icon: '👨‍👩‍👧' },
  culturalDiversity: { label: 'Cultural diversity',  icon: '🌍' },
  affordability:     { label: 'Affordability',       icon: '💰' },
  quietResidential:  { label: 'Quiet & residential', icon: '🏡' },
};

export default function ResultsPage() {
  const [results, setResults]         = useState<MatchResult[]>([]);
  const [priorities, setPriorities]   = useState<Record<string, string>>({});
  const [openCards, setOpenCards]     = useState<Set<number>>(new Set());
  const [authOpen, setAuthOpen]       = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [unlocked, setUnlocked]       = useState(false);

  const supabase = createClient();

  // ── Session check ────────────────────────────────────────────────────────────
  const handleSession = useCallback(async (session: { user: { id: string } } | null) => {
    if (!session) return;
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', session.user.id)
      .single();

    if (profile?.tier === 'premium') {
      setUnlocked(true);
    } else {
      setUpgradeOpen(true);
    }
  }, [supabase]);

  // ── Load session storage ──────────────────────────────────────────────────────
  useEffect(() => {
    const raw    = sessionStorage.getItem('citytwin_results')    || localStorage.getItem('citytwin_results');
    const rawPri = sessionStorage.getItem('citytwin_priorities') || localStorage.getItem('citytwin_priorities');
    if (raw)    setResults(JSON.parse(raw));
    if (rawPri) setPriorities(JSON.parse(rawPri));

    // If returning from Stripe success, check tier directly from Supabase
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          supabase
            .from('profiles')
            .select('tier')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile?.tier === 'premium') setUnlocked(true);
            });
        }
      });
    }
  }, [supabase]);

  // ── Auth gate ─────────────────────────────────────────────────────────────────
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
        setUpgradeOpen(false);
        setUnlocked(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [handleSession, supabase.auth]);

  function toggleBreakdown(index: number) {
    setOpenCards((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }

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

  const userCats = Object.keys(priorities);

  return (
    <>
      {/* ── NAV ── */}
      <nav style={{ background: 'var(--white)', borderBottom: '1px solid var(--blue-pale)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 62 }}>
        <Link href="/" className="nav-brand">
          <CTLogo size={32} />
          <span className="nav-brand-name">CityTwin</span>
        </Link>
        <Link href="/find" className="nav-back">← Start over</Link>
      </nav>

      {/* ── HERO ── */}
      <div className="results-hero">
        <div className="hero-eyebrow">Your results</div>
        <h1 className="results-hero-title">
          Your top <em>neighborhoods in {results[0]?.cityName || ''}</em>
        </h1>
        <p className="results-hero-sub">
          Based on what you told us matters, here are the neighborhoods most likely to feel like home.
          Your match score is personal - it reflects how well each neighborhood fits <em>your</em> priorities,
          not a general quality ranking.
        </p>
      </div>

      {/* ── MATCH CARDS ── */}
      <div className="results-page">
        {results.map((r, i) => {
          const rank      = i + 1;
          const rankLabel = rank === 1 ? '🏆 Best match' : `#${rank} match`;
          const isLocked  = rank > 1 && !unlocked;
          const isOpen    = openCards.has(i);

          const card = (
            <div className={`match-card rank-${rank}${isLocked ? ' card-locked' : ''}`}>
              <div className="card-header">
                <div>
                  <div className="card-rank">{rankLabel}</div>
                  <div className="card-name">{r.name}</div>
                  <div className="card-tagline">{r.tagline}</div>
                </div>
                <div className="score-badge">
                  <div className="score-num">{r.matchPercent}%</div>
                  <div className="score-lbl">match</div>
                </div>
              </div>

              <div className="card-body">
                <div className="why-box">{r.explanation}</div>

                <div className="info-row">
                  <div className="info-block">
                    <div className="info-label">Rent range</div>
                    <div className="info-value">{r.rentRange}</div>
                  </div>
                  <div className="info-block">
                    <div className="info-label">Walk Score</div>
                    <div className="info-value">{r.walkScore} / 100</div>
                  </div>
                </div>

                {r.highlights?.length > 0 && (
                  <div className="highlights">
                    <div className="highlights-label">What makes it stand out</div>
                    <ul className="highlights-list">
                      {r.highlights.slice(0, 3).map((h, j) => <li key={j}>{h}</li>)}
                    </ul>
                  </div>
                )}

                {r.bestFor?.length > 0 && (
                  <div className="tags-row">
                    {r.bestFor.map((b) => <span key={b} className="tag">{b}</span>)}
                  </div>
                )}

                {r.gaps?.length > 0 && (
                  <div className="gaps-section">
                    <div className="gaps-label">Things to know</div>
                    {r.gaps.map((g, j) => {
                      const must = g.includes('must-have');
                      return (
                        <div key={j} className={`gap-item${must ? ' must' : ''}`}>
                          <span className="gap-icon">{must ? '⚠️' : '•'}</span>
                          <span>{g}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                className={`breakdown-toggle${isOpen ? ' open' : ''}`}
                onClick={() => toggleBreakdown(i)}
              >
                <span>{isOpen ? 'Hide score breakdown' : 'See full score breakdown'}</span>
                <span className="toggle-arrow">▾</span>
              </button>

              <div className={`breakdown-body${isOpen ? ' open' : ''}`}>
                {userCats.map((cat) => {
                  const m     = CAT_META[cat] || { label: cat, icon: '' };
                  const score = (r.scores[cat] ?? 0) as number;
                  const color = score >= 8 ? '#2A7A5A' : score >= 6 ? '#2F5C8F' : '#94A3B8';
                  return (
                    <div className="bar-row" key={cat}>
                      <span className="bar-lbl">{m.icon} {m.label}</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${score * 10}%`, background: color }} />
                      </div>
                      <span className="bar-score">{score}/10</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );

          if (isLocked) {
            return (
              <div className="card-gate-wrap" key={i}>
                {card}
                <div className="lock-overlay">
                  <div style={{ background: 'white', borderRadius: '20px', padding: '32px 28px', textAlign: 'center', maxWidth: '320px', boxShadow: '0 8px 40px rgba(22,47,74,0.12)', border: '1px solid #E8EFF6' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F2F6FB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#162F4A" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.08em', color: '#C47B2B', textTransform: 'uppercase', marginBottom: 8 }}>YOUR FULL PICTURE</p>
                    <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', color: '#162F4A', marginBottom: 10, lineHeight: 1.2 }}>See all 3 neighborhood matches</h3>
                    <p style={{ fontSize: '.84rem', color: '#64748B', lineHeight: 1.6, marginBottom: 24 }}>Your #2 and #3 matches often surprise people. Free to unlock - takes 30 seconds.</p>
                    <button
                      style={{ background: '#162F4A', color: 'white', border: 'none', borderRadius: '100px', padding: '13px 28px', fontSize: '.88rem', fontWeight: 600, cursor: 'pointer', width: '100%', marginBottom: 12 }}
                      onClick={() => setAuthOpen(true)}
                    >Create free account →</button>
                    <p style={{ fontSize: '.76rem', color: '#94A3B8' }}>
                      Already have an account?{' '}
                      <span style={{ color: '#162F4A', cursor: 'pointer', fontWeight: 500 }} onClick={() => setAuthOpen(true)}> Sign in</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return <div key={i}>{card}</div>;
        })}

        {/* Bottom CTA */}
        <div className="results-bottom">
          <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.2rem', color: 'var(--navy)', marginBottom: 8 }}>
            Ready to find your specific places?
          </p>
          <p style={{ marginBottom: 20, fontSize: '.86rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>
            See the actual coffee shops, gyms, faith communities, and markets near your top match - powered by live Google Places data.
          </p>
          <div className="bottom-btns">
            <Link href="/places" className="btn-primary">Find my places →</Link>
            <Link href="/find" className="btn-ghost">← Change priorities</Link>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        heading="Unlock all matches"
        sub="See your #2 and #3 neighborhood matches - free account, no credit card required."
      />
      <UpgradeModal isOpen={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </>
  );
}
