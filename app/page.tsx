"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CTLogo from "@/components/CTLogo";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  function handleDemoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.querySelector<HTMLInputElement>('[type="email"]');
    if (emailInput) setDemoEmail(emailInput.value);
    setDemoSuccess("success");
  }

  function closeDemo() {
    setDemoOpen(false);
    setDemoSuccess("");
    document.body.style.overflow = "";
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDemo();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* ── NAV ── */}
      <nav className="nav">
        <Link href="/" className="nav-brand">
          <CTLogo size={34} />
          <span className="nav-brand-name">CityTwin</span>
        </Link>

        <div className="nav-links">
          <a className="nav-link" href="#how-it-works">
            How it works
          </a>
          <a className="nav-link" href="#sample-match">
            See a match
          </a>
          <a className="nav-link" href="mailto:hello@citytwinapp.com">
            For businesses
          </a>
        </div>

        <div className="nav-actions">
          <Link href="/find" className="nav-cta">
            Start matching →
          </Link>
        </div>

        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <Link
          href="/find"
          className="mm-primary"
          onClick={() => setMenuOpen(false)}
        >
          Start Matching →
        </Link>
        <button
          className="mm-ghost"
          onClick={() => {
            setMenuOpen(false);
            setDemoOpen(true);
            document.body.style.overflow = "hidden";
          }}
        >
          Request a Demo
        </button>
      </div>

      {/* ── DEMO MODAL ── */}
      <div
        className={`demo-overlay${demoOpen ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeDemo();
        }}
      >
        <div className="demo-modal">
          <button className="demo-close" onClick={closeDemo} aria-label="Close">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {demoSuccess === "success" ? (
            <div className="demo-success">
              <div className="demo-success-icon">✦</div>
              <div className="demo-success-title">You&apos;re on the list.</div>
              <p className="demo-success-sub">
                We&apos;ll reach out to {demoEmail} within one business day to
                schedule your walkthrough.
              </p>
            </div>
          ) : (
            <>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: ".08em",
                  color: "#C47B2B",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                FOR TEAMS &amp; BUSINESSES
              </p>
              <div
                className="demo-title"
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.8rem",
                  color: "#162F4A",
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}
              >
                See CityTwin
                <br />
                in action
              </div>
              <p
                className="demo-sub"
                style={{
                  fontSize: ".88rem",
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                We&apos;ll walk you through how CityTwin helps relocating
                employees find their neighborhood fit - and how it integrates
                into your relocation workflow.
              </p>
              <div
                style={{
                  marginBottom: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  "Personalized neighborhood matches per employee",
                  "Places map showing real venues by lifestyle",
                  "B2B portal with PDF reports (coming soon)",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "#C47B2B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    </div>
                    <span
                      style={{
                        fontSize: ".84rem",
                        color: "#162F4A",
                        lineHeight: 1.4,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <form className="demo-form" onSubmit={handleDemoSubmit}>
                <div className="demo-field">
                  <input
                    className="demo-input"
                    type="text"
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="demo-field">
                  <input
                    className="demo-input"
                    type="email"
                    placeholder="Work email"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="demo-field">
                  <input
                    className="demo-input"
                    type="text"
                    placeholder="Company"
                    autoComplete="organization"
                  />
                </div>
                <button type="submit" className="demo-submit">
                  Request demo →
                </button>
              </form>
              <p className="demo-fine">
                We&apos;ll follow up within one business day. No pressure.
              </p>
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

          <p className="hero-sub">
            Find the neighborhood where your life already exists.
          </p>

          <div className="hero-actions">
            <Link href="/find" className="btn-primary">
              Start matching →
            </Link>
            <a href="#how-it-works" className="btn-ghost">
              See how it works
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div
            className="hero-image"
            style={{ backgroundImage: "url('/images/hero_three_coffees.jpg')" }}
          />
        </div>
      </section>

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg,transparent,var(--brand-200),transparent)",
          maxWidth: 800,
          margin: "0 auto",
        }}
      />

      {/* ── HOW IT WORKS ── */}
      <section className="how" id="how-it-works">
        <div className="sh">
          <div className="eyebrow">How it works</div>
          <div className="stitle">
            Three steps to your
            <br />
            neighborhood match
          </div>
          <p className="ssub">
            No long questionnaires. No generic advice. A matching engine built
            around how you actually live.
          </p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-ico">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#244B75"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              <div className="step-num">1</div>
            </div>
            <div className="step-title">Pick your destination</div>
            <p className="step-desc">
              Tap your destination city on our map. More cities added every
              month based on where people are moving.
            </p>
          </div>
          <div className="step">
            <div className="step-ico">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#244B75"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
                <circle
                  cx="9"
                  cy="6"
                  r="2"
                  fill="white"
                  stroke="#244B75"
                  strokeWidth="1.8"
                />
                <circle
                  cx="15"
                  cy="12"
                  r="2"
                  fill="white"
                  stroke="#244B75"
                  strokeWidth="1.8"
                />
                <circle
                  cx="10"
                  cy="18"
                  r="2"
                  fill="white"
                  stroke="#244B75"
                  strokeWidth="1.8"
                />
              </svg>
              <div className="step-num">2</div>
            </div>
            <div className="step-title">Tell us how you live</div>
            <p className="step-desc">
              Choose your lifestyle priorities (coffee, fitness, faith, food,
              community) and weight each one by how much it matters.
            </p>
          </div>
          <div className="step">
            <div className="step-ico">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#244B75"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="step-num">3</div>
            </div>
            <div className="step-title">Get your match</div>
            <p className="step-desc">
              See your top neighborhood with a lifestyle score, honest
              explanation, real venues on a map, and local events and groups
              nearby.
            </p>
          </div>
        </div>
      </section>

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg,transparent,var(--brand-200),transparent)",
          maxWidth: 800,
          margin: "0 auto",
        }}
      />

      {/* ── SAMPLE MATCH ── */}
      <section className="sample-match" id="sample-match">
        <div className="sm-inner">
          <div className="sm-header">
            <div className="eyebrow">A real match</div>
            <div className="sm-title">This is what you&apos;ll see.</div>
            <p className="sm-sub">
              One example from the matching engine. Your result is built the
              same way, around how you actually live.
            </p>
          </div>

          <Link href="/find" className="sm-card">
            <div
              className="sm-photo"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?w=900&q=60')",
              }}
            >
              <div className="sm-city-pill">Chicago, IL</div>
              <div className="sm-score">
                <span className="sm-score-num">77%</span>
                <span className="sm-score-label">match</span>
              </div>
            </div>

            <div className="sm-body">
              <div className="sm-name">Lincoln Park</div>
              <div className="sm-tagline">
                Chicago&apos;s most walkable family-friendly neighborhood
              </div>

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

      {/* ── PRINCIPLES ── */}
      <section className="principles" id="principles">
        <div className="pr-inner">
          <div className="pr-header">
            <div className="eyebrow">How we work</div>
            <div className="pr-title">
              Three commitments behind
              <br />
              every match.
            </div>
          </div>

          <div className="pr-grid">
            <div className="pr-item">
              <div className="pr-num">01</div>
              <div className="pr-name">Hand researched</div>
              <p className="pr-desc">
                Every neighborhood scored by a person who knows it, not a
                scraper. Local truth beats algorithm output.
              </p>
            </div>

            <div className="pr-item pr-item-middle">
              <div className="pr-num">02</div>
              <div className="pr-name">Trade-offs surfaced</div>
              <p className="pr-desc">
                Every match shows what fits and what doesn&apos;t. No
                neighborhood is perfect. We tell you which ones aren&apos;t.
              </p>
            </div>

            <div className="pr-item">
              <div className="pr-num">03</div>
              <div className="pr-name">No signup wall</div>
              <p className="pr-desc">
                First match is free. No email gate, no account creation. You see
                results before we ask for anything.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S COMING ── */}
      <section className="coming-strip" id="coming">
        <div className="cs-inner">
          <div className="cs-block">
            <div className="cs-eyebrow">Integrating soon with</div>
            <div className="cs-row">
              <span className="cs-item">Eventbrite</span>
              <span className="cs-item">Meetup</span>
              <span className="cs-item">OpenTable</span>
              <span className="cs-item">Bucketlisters</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="ft-top">
          <div className="ft-brand-col">
            <div className="ft-brand">
              <CTLogo size={28} fillColor="#244B75" />
              <span className="ft-brand-name">CityTwin</span>
            </div>
            <div className="ft-tagline">
              Helping movers preserve their lifestyle when they relocate.
            </div>
          </div>

          <div className="ft-links">
            <div className="ft-col">
              <div className="ft-col-title">Product</div>
              <a className="ft-link" href="#how-it-works">
                How it works
              </a>
              <a className="ft-link" href="#sample-match">
                See a match
              </a>
              <a className="ft-link" href="#principles">
                Our principles
              </a>
              <a className="ft-link" href="mailto:hello@citytwinapp.com">
                For businesses
              </a>
            </div>

            <div className="ft-col">
              <div className="ft-col-title">Cities live</div>
              <Link className="ft-link" href="/find">
                Charlotte, NC
              </Link>
              <Link className="ft-link" href="/find">
                Chicago, IL
              </Link>
              <Link className="ft-link" href="/find">
                Atlanta, GA
              </Link>
              <Link className="ft-link" href="/find">
                Dallas, TX
              </Link>
              <Link className="ft-link" href="/find">
                Houston, TX
              </Link>
              <Link className="ft-link" href="/find">
                Seattle, WA
              </Link>
              <Link className="ft-link" href="/find">
                Phoenix, AZ
              </Link>
              <Link className="ft-link" href="/find">
                Montgomery County, MD
              </Link>
            </div>

            <div className="ft-col">
              <div className="ft-col-title">Coming soon</div>
              <div className="ft-link ft-link-dim">Denver</div>
              <div className="ft-link ft-link-dim">Nashville</div>
              <div className="ft-link ft-link-dim">Austin</div>
              <div className="ft-link ft-link-dim">Miami</div>
              <div className="ft-link ft-link-dim">Raleigh</div>
              <a
                className="ft-link-request"
                href="mailto:hello@citytwinapp.com?subject=Request%20your%20city"
              >
                Request your city →
              </a>
            </div>

            <div className="ft-col">
              <div className="ft-col-title">Company</div>
              <Link className="ft-link" href="/about">
                About
              </Link>
              <a className="ft-link" href="mailto:hello@citytwinapp.com">
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="ft-bottom">
          <div className="ft-copy">
            © {year} CityTwin LLC. All rights reserved.
          </div>
          <div className="ft-legal">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
          </div>
        </div>
      </footer>
    </>
  );
}
