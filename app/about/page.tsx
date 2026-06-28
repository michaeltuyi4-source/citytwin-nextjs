"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CTLogo from "@/components/CTLogo";
import NavAuth from "@/components/NavAuth";

export default function AboutPage() {
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
          <Link className="nav-link" href="/#how-it-works">
            How it works
          </Link>
          <Link className="nav-link" href="/#sample-match">
            See a match
          </Link>
          <a className="nav-link" href="mailto:hello@citytwinapp.com">
            For businesses
          </a>
        </div>

        <div className="nav-actions">
          <NavAuth />
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
        <div className="mm-divider" />
        <NavAuth variant="mobile" onAction={() => setMenuOpen(false)} />
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
                employees find their neighborhood fit, and how it integrates
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

      {/* ── ABOUT ── */}
      <main className="about">
        <article className="ab-inner">
          <div className="ab-eyebrow">About</div>
          <h1 className="ab-title">Why I built CityTwin.</h1>

          <p className="ab-body">
            I&apos;ve moved four times across the United States. Before that, I
            moved to America several years ago. So I know what it feels like to
            start over.
          </p>

          <p className="ab-body">
            Every move came with the same problem. Not the boxes, not the lease,
            not the logistics. The harder part: rebuilding a life from scratch
            in a place that didn&apos;t yet know you.
          </p>

          <p className="ab-body">
            I&apos;m not someone who thrives in crowds. I don&apos;t make
            friends at happy hours or random events. So when I moved from
            Illinois to Maryland, I tried everything anyway. Happy hours. Local
            meetups. Friendship apps. Parks. Showed up to things I didn&apos;t
            want to be at, hoping something would click.
          </p>

          <p className="ab-body ab-body-end">
            Nothing did. The connections never felt organic.
          </p>

          <blockquote className="ab-quote">
            I couldn&apos;t find a barber who could cut my hair. A gym with a
            track. An international grocery store with the food I grew up on.
            The things that quietly make a place feel like home.
          </blockquote>

          <p className="ab-body">
            Those aren&apos;t things you can search for on Zillow. They
            don&apos;t show up in a relocation packet. They&apos;re the texture
            of daily life, and they vanish when you move.
          </p>

          <p className="ab-body">
            Three years later I moved again, from Maryland to Virginia.
            That&apos;s when I stopped accepting that this was just how moving
            worked, and started building CityTwin.
          </p>

          <p className="ab-body">
            CityTwin is the tool I wish I&apos;d had every time I moved. It
            matches you to neighborhoods based on how you actually live (the
            rituals, the routines, the small things that make a place feel like
            yours). Not just walk scores and rent ranges. The barber. The gym.
            The grocery store. The people.
          </p>

          <p className="ab-body ab-body-end">
            If you&apos;re moving, I hope it helps you land somewhere your life
            already fits.
          </p>

          <div className="ab-signature">
            <div
              style={{
                width: 24,
                height: 2,
                background: "var(--amber)",
                borderRadius: 1,
                marginBottom: 12,
              }}
            />
            <div className="ab-sig-name">Michael</div>
            <div className="ab-sig-role">Founder, CityTwin</div>
          </div>

          <div className="ab-cta-wrap">
            <Link href="/find" className="btn-primary">
              Find your match →
            </Link>
          </div>
        </article>
      </main>

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
              <Link className="ft-link" href="/#how-it-works">
                How it works
              </Link>
              <Link className="ft-link" href="/#sample-match">
                See a match
              </Link>
              <Link className="ft-link" href="/#principles">
                Our principles
              </Link>
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
