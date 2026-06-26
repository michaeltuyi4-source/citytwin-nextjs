'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  heading?: string;
  sub?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  heading = 'Unlock all matches',
  sub = 'Create a free account — no credit card required.',
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [view, setView]         = useState<'form' | 'reset-request' | 'reset-sent'>('form');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [checkEmail, setCheckEmail]     = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  if (!isOpen) return null;

  const supabase = createClient();

  async function handleSubmit() {
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters.');  return; }

    setLoading(true);
    try {
      if (activeTab === 'signup') {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/results` },
        });
        if (err) { setError(err.message); } else { setCheckEmail(true); }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) setError(err.message);
      }
    } catch (thrown) {
      console.error('[auth-modal] signInWithPassword threw (not returned error)', thrown);
      setError('Unexpected error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetRequest() {
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    setLoading(false);
    if (err) { setError(err.message); } else { setView('reset-sent'); }
  }

  async function handleResend() {
    setResendStatus('sending');
    setError('');
    const { error: err } = await supabase.auth.resend({ type: 'signup', email });
    if (err) { setResendStatus('idle'); setError(err.message); }
    else setResendStatus('sent');
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
  }

  const isSignup = activeTab === 'signup';

  if (view === 'reset-sent') {
    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-modal-heading" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="modal-card" style={{ textAlign: 'center' }}>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '8px auto 16px', display: 'block', color: 'var(--navy)' }} aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 7l10 7 10-7" />
          </svg>
          <h2 className="modal-heading" id="auth-modal-heading">Check your inbox</h2>
          <p className="modal-sub">We sent a password reset link to</p>
          <p style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 14, margin: '4px 0 16px' }}>{email}</p>
          <p className="modal-sub" style={{ marginBottom: 24 }}>Click the link in the email to set a new password.</p>
          <button
            onClick={() => { setView('form'); setActiveTab('login'); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--navy-soft)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Back to log in
          </button>
        </div>
      </div>
    );
  }

  if (view === 'reset-request') {
    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="auth-modal-heading" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="modal-card">
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          <h2 className="modal-heading" id="auth-modal-heading">Reset your password</h2>
          <p className="modal-sub" style={{ marginBottom: 22 }}>Enter your email and we&apos;ll send you a reset link.</p>
          <div className="modal-form">
            <div className="form-field">
              <label className="form-label" htmlFor="auth-email">Email</label>
              <input
                className="form-input"
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleResetRequest(); }}
              />
            </div>
            {error && <p className="form-error" role="alert" style={{ color: 'var(--red)' }}>{error}</p>}
            <button className="btn-submit" onClick={handleResetRequest} disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </div>
          <button
            onClick={() => { setView('form'); setError(''); }}
            style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: 'var(--navy-soft)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Back to log in
          </button>
        </div>
      </div>
    );
  }

  if (checkEmail) {
    return (
      <div
        className="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-heading"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="modal-card" style={{ textAlign: 'center' }}>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '8px auto 16px', display: 'block', color: 'var(--navy)' }} aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 7l10 7 10-7" />
          </svg>
          <h2 className="modal-heading" id="auth-modal-heading">Check your inbox</h2>
          <p className="modal-sub">We sent a confirmation link to</p>
          <p style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 14, margin: '4px 0 16px' }}>{email}</p>
          <p className="modal-sub" style={{ marginBottom: 24 }}>
            Click the link in the email to confirm your account, then come back here to log in.
          </p>
          {error && <p className="form-error" role="alert" style={{ color: 'var(--red)', marginBottom: 12 }}>{error}</p>}
          {resendStatus === 'sent'
            ? <p style={{ color: 'var(--green)', fontSize: 13, marginBottom: 16 }}>Email resent — check your inbox.</p>
            : (
              <button
                className="btn-submit"
                onClick={handleResend}
                disabled={resendStatus === 'sending'}
                style={{ marginBottom: 16 }}
              >
                {resendStatus === 'sending' ? 'Sending…' : 'Resend confirmation email'}
              </button>
            )
          }
          <button
            onClick={() => { setCheckEmail(false); setActiveTab('login'); setError(''); setResendStatus('idle'); }}
            style={{ background: 'none', border: 'none', color: 'var(--navy-soft)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Already confirmed? Log in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-heading"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <h2 className="modal-heading" id="auth-modal-heading">{heading}</h2>
        <p className="modal-sub">{sub}</p>

        <div className="modal-tabs" role="tablist">
          {(['signup', 'login'] as const).map((tab) => (
            <button
              key={tab}
              className={`modal-tab${activeTab === tab ? ' active' : ''}`}
              role="tab"
              onClick={() => { setActiveTab(tab); setError(''); setView('form'); }}
            >
              {tab === 'signup' ? 'Sign up' : 'Log in'}
            </button>
          ))}
        </div>

        <div className="modal-form">
          <div className="form-field">
            <label className="form-label" htmlFor="auth-email">Email</label>
            <input
              className="form-input"
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="auth-password">Password</label>
            <input
              className="form-input"
              id="auth-password"
              type="password"
              placeholder={isSignup ? 'Min. 8 characters' : 'Your password'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            />
          </div>

          {!isSignup && (
            <button
              onClick={() => { setView('reset-request'); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--navy-soft)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', padding: 0, marginTop: -4, textAlign: 'right', display: 'block', width: '100%' }}
            >
              Forgot password?
            </button>
          )}

          {error && <p className="form-error" role="alert" style={{ color: 'var(--red)' }}>{error}</p>}

          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? (isSignup ? 'Creating account…' : 'Logging in…')
              : (isSignup ? 'Create account' : 'Log in')}
          </button>
        </div>

        <div className="modal-divider">or</div>

        <button className="btn-google" onClick={handleGoogle}>
          <GoogleIcon />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
