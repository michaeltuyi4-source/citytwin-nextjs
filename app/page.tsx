'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CTLogo from '@/components/CTLogo';

export default function HomePage() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [demoOpen, setDemoOpen]     = useState(false);
  const [demoSuccess, setDemoSuccess] = useState('');
  const [demoEmail, setDemoEmail]   = useState('');
  const [pbSlide, setPbSlide]       = useState(0);
  const [year, setYear]             = useState('');

  const pbTimer   = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setYear(String(new Date().getFullYear()));

    pbTimer.current = setInterval(() => setPbSlide((s) => (s + 1) % 3), 6000);

    return () => {
      if (pbTimer.current) clearInterval(pbTimer.current);
    };
  }, []);

  function goToPbSlide(n: number) {
    setPbSlide(n);
    if (pbTimer.current) clearInterval(pbTimer.current);
    pbTimer.current = setInterval(() => setPbSlide((s) => (s + 1) % 3), 6000);
  }

  function handleDemoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.querySelector<HTMLInputElement>('[type="email"]');
    if (emailInput) setDemoEmail(emailInput.value);
    setDemoSuccess('success');
  }

  function openDemo(e: React.MouseEvent) {
    e.preventDefault();
    setDemoOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeDemo() {
    setDemoOpen(false);
    setDemoSuccess('');
    document.body.style.overflow = '';
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') closeDemo(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const pbSlides = [
    '/images/friends_grabbing_coffee_2.jpg',
    '/images/pexelsrdne4920851.jpg',
    '/images/pexelscottonbro7339201.jpg',
  ];

  return (
    <>
      {/* ── NAV ── */}
      <nav className="nav">
        <Link href="/" className="nav-brand">
          <CTLogo size={34} />
          <span className="nav-brand-name">CityTwin</span>
        </Link>

        <div className="nav-links">
          <a className="nav-link" href="#how-it-works">How it works</a>
          <a className="nav-link" href="#cities">Cities</a>
          <a className="nav-link" href="mailto:hello@citytwinapp.com">For businesses</a>
        </div>

        <div className="nav-actions">
          <Link href="/find" className="nav-cta">Start matching →</Link>
        </div>

        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <Link href="/find" className="mm-primary" onClick={() => setMenuOpen(false)}>
          Start Matching →
        </Link>
        <button
          className="mm-ghost"
          onClick={() => { setMenuOpen(false); setDemoOpen(true); document.body.style.overflow = 'hidden'; }}
        >
          Request a Demo
        </button>
      </div>

      {/* ── DEMO MODAL ── */}
      <div
        className={`demo-overlay${demoOpen ? ' open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeDemo(); }}
      >
        <div className="demo-modal">
          <button className="demo-close" onClick={closeDemo} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          {demoSuccess === 'success' ? (
            <div className="demo-success">
              <div className="demo-success-icon">✦</div>
              <div className="demo-success-title">You&apos;re on the list.</div>
              <p className="demo-success-sub">
                We&apos;ll reach out to {demoEmail} within one business day to schedule your walkthrough.
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.08em', color: '#C47B2B', textTransform: 'uppercase', marginBottom: 10 }}>FOR TEAMS &amp; BUSINESSES</p>
              <div className="demo-title" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.8rem', color: '#162F4A', marginBottom: 10, lineHeight: 1.2 }}>See CityTwin<br/>in action</div>
              <p className="demo-sub" style={{ fontSize: '.88rem', lineHeight: 1.6, marginBottom: 20 }}>
                We&apos;ll walk you through how CityTwin helps relocating employees find their neighborhood fit - and how it integrates into your relocation workflow.
              </p>
              <div style={{ marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Personalized neighborhood matches per employee',
                  'Places map showing real venues by lifestyle',
                  'B2B portal with PDF reports (coming soon)',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#C47B2B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2,6 5,9 10,3"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: '.84rem', color: '#162F4A', lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
              <form className="demo-form" onSubmit={handleDemoSubmit}>
                <div className="demo-field">
                  <input className="demo-input" type="text" placeholder="Your name" required autoComplete="name" />
                </div>
                <div className="demo-field">
                  <input className="demo-input" type="email" placeholder="Work email" required autoComplete="email" />
                </div>
                <div className="demo-field">
                  <input className="demo-input" type="text" placeholder="Company" autoComplete="organization" />
                </div>
                <button type="submit" className="demo-submit">Request demo →</button>
              </form>
              <p className="demo-fine">We&apos;ll follow up within one business day. No pressure.</p>
            </>
          )}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero" id="hero">
        <div className="hero-left">
          <div className="hero-pill">
            <span className="pill-dot" />
            Neighborhood matching - now live
          </div>

          <h1 className="hero-h1">
            Moving to a new city shouldn&apos;t mean <em>starting over.</em>
          </h1>

          <p className="hero-sub">Find the neighborhood where your life already exists.</p>

          <div className="hero-actions">
            <Link href="/find" className="btn-primary">Start matching →</Link>
            <a href="#how-it-works" className="btn-ghost">See how it works</a>
          </div>
        </div>

        <div className="hero-right">
          <div
            className="hero-image"
            style={{ backgroundImage: "url('/images/hero_three_coffees.jpg')" }}
          />
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--brand-200),transparent)', maxWidth: 800, margin: '0 auto' }} />

      {/* ── HOW IT WORKS ── */}
      <section className="how" id="how-it-works">
        <div className="sh">
          <div className="eyebrow">How it works</div>
          <div className="stitle">Three steps to your<br/>neighborhood match</div>
          <p className="ssub">No long questionnaires. No generic advice. A matching engine built around how you actually live.</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#244B75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
              </svg>
              <div className="step-num">1</div>
            </div>
            <div className="step-title">Pick your destination</div>
            <p className="step-desc">Tap your destination city on our map. More cities added every month based on where people are moving.</p>
          </div>
          <div className="step">
            <div className="step-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#244B75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                <circle cx="9" cy="6" r="2" fill="white" stroke="#244B75" strokeWidth="1.8"/>
                <circle cx="15" cy="12" r="2" fill="white" stroke="#244B75" strokeWidth="1.8"/>
                <circle cx="10" cy="18" r="2" fill="white" stroke="#244B75" strokeWidth="1.8"/>
              </svg>
              <div className="step-num">2</div>
            </div>
            <div className="step-title">Tell us how you live</div>
            <p className="step-desc">Choose your lifestyle priorities (coffee, fitness, faith, food, community) and weight each one by how much it matters.</p>
          </div>
          <div className="step">
            <div className="step-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#244B75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div className="step-num">3</div>
            </div>
            <div className="step-title">Get your match</div>
            <p className="step-desc">See your top neighborhood with a lifestyle score, honest explanation, real venues on a map, and local events and groups nearby.</p>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--brand-200),transparent)', maxWidth: 800, margin: '0 auto' }} />

      {/* ── SAMPLE MATCH ── */}
      <section className="sample-match" id="sample-match">
        <div className="sm-inner">
          <div className="sm-header">
            <div className="eyebrow">A real match</div>
            <div className="sm-title">This is what you&apos;ll see.</div>
            <p className="sm-sub">One example from the matching engine. Your result is built the same way, around how you actually live.</p>
          </div>

          <Link href="/find" className="sm-card">
            <div
              className="sm-photo"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=900&q=60')" }}
            >
              <div className="sm-city-pill">Chicago, IL</div>
              <div className="sm-score">
                <span className="sm-score-num">77%</span>
                <span className="sm-score-label">match</span>
              </div>
            </div>

            <div className="sm-body">
              <div className="sm-name">Lincoln Park</div>
              <div className="sm-tagline">Chicago&apos;s most walkable family-friendly neighborhood</div>

              <div className="sm-chips">
                <span className="sm-chip">Walkable</span>
                <span className="sm-chip">Family-friendly</span>
                <span className="sm-chip">Coffee culture</span>
                <span className="sm-chip">Parks nearby</span>
              </div>

              <div className="sm-cta">See your match →</div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── CITIES ── */}
      <section className="cities" id="cities">
        <div className="sh">
          <div className="eyebrow">8 Cities Live</div>
          <div className="stitle">Where are you moving?</div>
          <p className="ssub">Tap your destination city. Dimmed cities are coming soon - leave your email and we&apos;ll notify you the moment they launch.</p>
        </div>
        <div className="map-wrap">
          <div className="map-bg-inner" style={{ backgroundImage: "url('/images/neighborhood_photo.jpg')" }} />
          <div className="map-glow" />
          <div className="us-outline" />
          {/* Live cities */}
          {[
            { left: '72%', top: '55%', label: 'Charlotte', active: true },
            { left: '62%', top: '37%', label: 'Chicago' },
            { left: '55%', top: '61%', label: 'Atlanta' },
            { left: '46%', top: '62%', label: 'Dallas' },
            { left: '49%', top: '68%', label: 'Houston' },
            { left: '19%', top: '29%', label: 'Seattle' },
            { left: '29%', top: '52%', label: 'Phoenix' },
            { left: '80%', top: '40%', label: 'DC Area' },
          ].map(({ left, top, label, active }) => (
            <div className="city-pin" style={{ left, top }} key={label}>
              <div className={`cp-ring${active ? ' active' : ''}`}><div className="cp-core" /></div>
              <div className="cp-label">{label}</div>
            </div>
          ))}
          {/* Coming soon */}
          {[
            { left: '38%', top: '42%', label: 'Denver' },
            { left: '60%', top: '52%', label: 'Nashville' },
            { left: '42%', top: '56%', label: 'Austin' },
            { left: '77%', top: '72%', label: 'Miami' },
            { left: '67%', top: '44%', label: 'Raleigh' },
          ].map(({ left, top, label }) => (
            <div className="city-pin" style={{ left, top }} key={label}>
              <div className="cp-ring dim"><div className="cp-core" /></div>
              <div className="cp-label dim">{label}</div>
            </div>
          ))}
          <div className="map-selected">
            <div className="ms-dot" />
            <div>
              <div className="ms-name">Charlotte, NC</div>
              <div className="ms-sub">8 neighborhoods · updated 2 days ago</div>
            </div>
            <Link href="/find" className="ms-btn">Start →</Link>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--brand-200),transparent)', maxWidth: 800, margin: '0 auto' }} />

      {/* ── PHOTO BANNER ── */}
      <section className="photo-banner">
        <div className="pb-img">
          {pbSlides.map((src, i) => (
            <div
              key={i}
              className={`pb-slide${pbSlide === i ? ' active' : ''}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
          <div className="pb-overlay" />
          <div className="pb-content">
            <div className="pb-headline">Find your people.<br/>Find your place.</div>
            <Link href="/find" className="pb-cta">Start matching →</Link>
          </div>
          <div className="pb-dots">
            {pbSlides.map((_, i) => (
              <button
                key={i}
                className={`pb-dot${pbSlide === i ? ' active' : ''}`}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goToPbSlide(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY ── */}
      <section className="community" id="community">
        <div className="comm-grid" style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12 }}>
          {/* Meetup — Young Professionals */}
          <a className="cc" href="https://www.meetup.com/find/?keywords=young+professionals" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', minHeight: 200 }}>
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=160&fit=crop&crop=center&auto=format" alt="Young professionals networking" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, display: 'block', marginBottom: 14 }} />
            <div className="cc-src">Meetup</div>
            <div className="cc-title">Young Professionals Near You</div>
            <div className="cc-meta">Browse groups in your new city</div>
            <div style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--amber)', marginTop: 'auto', paddingTop: 10 }}>Explore on Meetup →</div>
          </a>
          {/* Eventbrite — Weekend Events */}
          <a className="cc" href="https://www.eventbrite.com/d/united-states/events/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', minHeight: 200 }}>
            <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=160&fit=crop&crop=center&auto=format" alt="Outdoor weekend event crowd" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, display: 'block', marginBottom: 14 }} />
            <div className="cc-src">Eventbrite</div>
            <div className="cc-title">Weekend Events &amp; Things To Do</div>
            <div className="cc-meta">Concerts, art walks, food markets &amp; more</div>
            <div style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--amber)', marginTop: 'auto', paddingTop: 10 }}>Browse on Eventbrite →</div>
          </a>
          {/* Bucketlisters — Hidden Gems */}
          <a className="cc" href="https://bucketlisters.com/experiences" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', minHeight: 200 }}>
            <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=160&fit=crop&crop=center&auto=format" alt="People exploring a city neighborhood" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, display: 'block', marginBottom: 14 }} />
            <div className="cc-src">Bucketlisters</div>
            <div className="cc-title">Hidden Gems &amp; Local Experiences</div>
            <div className="cc-meta">Unique things to do in every city</div>
            <div style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--amber)', marginTop: 'auto', paddingTop: 10 }}>Discover more →</div>
          </a>
          {/* OpenTable — Restaurants */}
          <a className="cc" href="https://www.opentable.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', minHeight: 200 }}>
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=160&fit=crop&crop=center&auto=format" alt="Restaurant dining experience" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, display: 'block', marginBottom: 14 }} />
            <div className="cc-src">OpenTable</div>
            <div className="cc-title">Restaurant Reservations Nearby</div>
            <div className="cc-meta">Book a table at top-rated restaurants in your new neighborhood</div>
            <div style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--amber)', marginTop: 'auto', paddingTop: 10 }}>Reserve a table →</div>
          </a>
        </div>

        <div className="comm-copy">
          <div className="eyebrow">Coming soon</div>
          <div className="stitle">Find your people,<br/>not just your place</div>
          <p className="ssub">Finding the right neighborhood is step one. CityTwin goes further - connecting you to local events, community groups, and people who share your lifestyle.</p>
          <div className="int-logos">
            <div className="int-logo"><div className="int-dot" style={{ background: '#F05537' }} />Eventbrite</div>
            <div className="int-logo"><div className="int-dot" style={{ background: '#ED1C40' }} />Meetup</div>
            <div className="int-logo"><div className="int-dot" style={{ background: 'var(--amber)' }} />Local guides</div>
          </div>
          <Link href="/find" className="btn-primary">Try it free →</Link>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--brand-200),transparent)', maxWidth: 800, margin: '0 auto' }} />

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="ft-top">
          <div>
            <div className="ft-brand">
              <CTLogo size={28} fillColor="#244B75" />
              <span className="ft-brand-name">CityTwin</span>
            </div>
            <div className="ft-tagline">Helping movers preserve their lifestyle when they relocate.</div>
          </div>
          <div className="ft-links">
            <div>
              <div className="ft-col-title">Product</div>
              <a className="ft-link" href="#how-it-works">How it works</a>
              <a className="ft-link" href="#cities">Cities covered</a>
              <a className="ft-link" href="mailto:hello@citytwinapp.com">For businesses</a>
            </div>
            <div>
              <div className="ft-col-title">Company</div>
              <a className="ft-link" href="#how-it-works">About</a>
              <a className="ft-link" href="mailto:hello@citytwinapp.com">Contact</a>
            </div>
          </div>
        </div>
        <div className="ft-bottom">
          <div className="ft-copy">© {year} CityTwin LLC. All rights reserved.</div>
          <div className="ft-legal">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
          </div>
        </div>
      </footer>
    </>
  );
}
