'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  if (!isOpen) return null;

  async function handleUpgrade() {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Please sign in first.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      const { url } = await res.json();
      if (url) window.location.href = url;

    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-heading"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="upgrade-card">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="upgrade-badge">Free account</div>
        <h2 className="modal-heading" id="upgrade-modal-heading">Unlock your full results</h2>
        <p className="modal-sub">
          You&apos;re in. Upgrade once to see all three matches, plus priority access to every new city we add.
        </p>

        <div className="pricing-options">
          <div className="price-card selected">
            <div className="price-amount">$9</div>
            <div className="price-label">one-time</div>
          </div>
        </div>

        {error && (
          <p style={{ color: '#e05c4b', fontSize: '13px', textAlign: 'center', marginBottom: 8 }}>
            {error}
          </p>
        )}

        <button
          className="btn-upgrade"
          onClick={handleUpgrade}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Redirecting...' : 'Unlock for $9'}
        </button>
        <button className="upgrade-later" onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}