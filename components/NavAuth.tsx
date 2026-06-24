'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';

interface NavAuthProps {
  /** 'desktop' renders the top-nav control, 'mobile' renders the hamburger-menu item. */
  variant?: 'desktop' | 'mobile';
  /** Called after a menu action (e.g. to close the mobile hamburger menu). */
  onAction?: () => void;
  authHeading?: string;
  authSub?: string;
}

/**
 * Auth-aware nav control shared across every page that has a nav.
 * Logged out: the existing "Sign in" control (opens the AuthModal).
 * Logged in: an avatar (email initial) with a dropdown (email, Account, Sign out).
 * Reacts live to SIGNED_IN / SIGNED_OUT via the Supabase auth listener.
 */
export default function NavAuth({
  variant = 'desktop',
  onAction,
  authHeading = 'Welcome back',
  authSub = 'Sign in to pick up where you left off.',
}: NavAuthProps) {
  const supabase = createClient();
  const [email, setEmail]       = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // dropdown
  const wrapRef = useRef<HTMLDivElement>(null);

  // Live session: same source the rest of the app uses.
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) setEmail(session?.user?.email ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      if (session) setAuthOpen(false); // close the modal once signed in
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [supabase]);

  // Dropdown closes on outside click and Escape.
  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setMenuOpen(false); }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    onAction?.();
  }

  const initial = email ? email.charAt(0).toUpperCase() : '';

  // ── MOBILE (hamburger menu item) ──────────────────────────────────────────────
  if (variant === 'mobile') {
    if (!email) {
      return (
        <>
          <button type="button" className="mm-signin" onClick={() => { onAction?.(); setAuthOpen(true); }}>
            <svg className="mm-user" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Sign in
          </button>
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} heading={authHeading} sub={authSub} />
        </>
      );
    }
    return (
      <div className="mm-account">
        <div className="mm-account-email">{email}</div>
        {/* TODO: account page not built yet, kept disabled so it cannot 404 */}
        <span className="mm-account-item mm-account-disabled" aria-disabled="true">Account</span>
        <button type="button" className="mm-account-item mm-signout" onClick={handleSignOut}>Sign out</button>
      </div>
    );
  }

  // ── DESKTOP (top-right) ───────────────────────────────────────────────────────
  if (!email) {
    return (
      <>
        <button type="button" className="nav-signin" onClick={() => setAuthOpen(true)}>Sign in</button>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} heading={authHeading} sub={authSub} />
      </>
    );
  }

  return (
    <div className="nav-user" ref={wrapRef}>
      <button
        type="button"
        className="nav-avatar"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        {initial}
      </button>
      {menuOpen && (
        <div className="nav-dropdown" role="menu">
          <div className="nav-dropdown-email" title={email}>{email}</div>
          <div className="nav-dropdown-divider" />
          {/* TODO: account page not built yet, kept disabled so it cannot 404 */}
          <span className="nav-dropdown-item nav-dropdown-disabled" role="menuitem" aria-disabled="true">Account</span>
          <button type="button" className="nav-dropdown-item nav-dropdown-signout" role="menuitem" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
