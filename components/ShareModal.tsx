'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  neighborhoodName: string;
  cityLabel: string;
  matchPercent: number;
}

const APP_URL = 'https://citytwinapp.com';

export default function ShareModal({ isOpen, onClose, neighborhoodName, cityLabel, matchPercent }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `I matched with ${neighborhoodName} in ${cityLabel} at ${matchPercent}% on CityTwin. Find your neighborhood match!`;
  const shareUrl = APP_URL;
  const fullText = `${shareText} ${shareUrl}`;

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My CityTwin Match', text: shareText, url: shareUrl });
      } catch {
        // user cancelled
      }
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-heading"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="share-card">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="modal-heading" id="share-modal-heading">Share your match</h2>
        <p className="share-preview">&ldquo;{shareText}&rdquo;</p>

        <div className="share-actions">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button className="share-btn share-btn-native" onClick={handleNativeShare}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share via…
            </button>
          )}

          <a className="share-btn share-btn-twitter" href={twitterUrl} target="_blank" rel="noopener noreferrer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Post on X
          </a>

          <a className="share-btn share-btn-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>

          <a className="share-btn share-btn-facebook" href={facebookUrl} target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.5 1.6-1.5H17V4.3c-.3 0-1.3-.1-2.5-.1-2.4 0-4 1.5-4 4.1v2.5H7.8V14h2.7v8h3z" />
            </svg>
            Facebook
          </a>

          <button className="share-btn share-btn-copy" onClick={handleCopy}>
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .share-card {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 32px 28px 28px;
          width: 100%;
          max-width: 400px;
          margin: 0 16px;
          box-shadow: 0 24px 64px rgba(14, 28, 46, 0.18);
        }
        .share-preview {
          font-size: 13px;
          color: var(--slate);
          background: var(--blue-mist);
          border-radius: 10px;
          padding: 12px 14px;
          line-height: 1.5;
          margin: 0 0 20px;
        }
        .share-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .share-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          text-decoration: none;
          border: 1.5px solid transparent;
          transition: opacity 0.15s ease;
        }
        .share-btn:hover { opacity: 0.85; }
        .share-btn-native {
          background: var(--navy);
          color: white;
          border-color: var(--navy);
        }
        .share-btn-twitter {
          background: #000;
          color: white;
        }
        .share-btn-whatsapp {
          background: #25D366;
          color: white;
        }
        .share-btn-facebook {
          background: #1877F2;
          color: white;
        }
        .share-btn-copy {
          background: white;
          color: var(--navy);
          border-color: var(--blue-pale);
        }
      `}</style>
    </div>
  );
}
