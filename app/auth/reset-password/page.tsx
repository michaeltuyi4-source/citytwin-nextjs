'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CTLogo from '@/components/CTLogo';
import { createClient } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit() {
    setError('');
    if (!password) { setError('Please enter a new password.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) { setError(err.message); }
    else {
      setDone(true);
      setTimeout(() => router.push('/results'), 2500);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ECF1F8 0%, #F5F1E9 100%)', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '14px 24px', borderBottom: '0.5px solid var(--blue-pale)', background: 'rgba(242,246,251,0.85)' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--navy)' }}>
          <CTLogo size={32} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>CityTwin</span>
        </Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'white', borderRadius: 24, padding: '36px 32px', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(22,47,74,.12)' }}>
          {done ? (
            <div style={{ textAlign: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', display: 'block', color: 'var(--navy)' }} aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l3 3 5-5" />
              </svg>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--navy)', marginBottom: 8 }}>Password updated</h1>
              <p style={{ fontSize: '.88rem', color: 'var(--slate-500)' }}>Redirecting you to your results…</p>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--navy)', marginBottom: 6 }}>Set new password</h1>
              <p style={{ fontSize: '.88rem', color: 'var(--slate-500)', marginBottom: 24 }}>Choose a strong password for your account.</p>

              <div className="modal-form">
                <div className="form-field">
                  <label className="form-label" htmlFor="new-password">New password</label>
                  <input
                    className="form-input"
                    id="new-password"
                    type="password"
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="confirm-password">Confirm password</label>
                  <input
                    className="form-input"
                    id="confirm-password"
                    type="password"
                    placeholder="Repeat your new password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                  />
                </div>

                {error && <p className="form-error" role="alert" style={{ color: 'var(--red)' }}>{error}</p>}

                <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
