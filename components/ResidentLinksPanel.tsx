'use client';

import { useState } from 'react';
import type { ResidentLink } from '@/lib/types';

// Badge label for a resident-link source. Unknown types fall back to a
// capitalized form so a badge never renders blank.
function badgeLabel(type: string): string {
  switch (type) {
    case 'reddit': return 'Reddit';
    case 'niche':  return 'Niche';
    case 'guide':  return 'Guide';
    default:       return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Link';
  }
}

export default function ResidentLinksPanel({ links }: { links?: ResidentLink[] }) {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  if (!links || links.length === 0) return null;

  return (
    <section className="rl-panel" aria-label="What residents actually say">
      <h3 className="rl-headline">
        The scores tell you the shape of a place. Residents tell you what it&apos;s
        like to actually live there.
      </h3>

      <div className="rl-links">
        {links.map((link, i) => {
          // YouTube: thumbnail card
          if (link.type === 'youtube' && link.videoId) {
            const href = `https://www.youtube.com/watch?v=${link.videoId}`;
            const thumb = `https://img.youtube.com/vi/${link.videoId}/mqdefault.jpg`;
            const errored = imgErrors[i];
            return (
              <a
                key={i}
                className="rl-video"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="rl-thumb">
                  {errored ? (
                    <span className="rl-thumb-fallback" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  ) : (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb}
                        alt={`Video: ${link.label}`}
                        loading="lazy"
                        onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
                      />
                      <span className="rl-play" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </>
                  )}
                </span>
                <span className="rl-video-label">{link.label}</span>
              </a>
            );
          }

          // Everything else: text link with a source badge (skip if no url)
          if (!link.url) return null;
          return (
            <a
              key={i}
              className="rl-text-link"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-badge">{badgeLabel(link.type)}</span>
              <span className="rl-text-label">{link.label}</span>
              <span className="rl-ext" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </span>
            </a>
          );
        })}
      </div>

      <p className="rl-note">
        Real discussions on other sites, opens in a new tab, we don&apos;t write or
        edit these.
      </p>

      <style jsx>{`
        .rl-panel {
          border: 2px solid var(--amber);
          border-radius: 14px;
          padding: 20px;
          margin: 24px 0;
          background: var(--amber-bg);
        }
        .rl-headline {
          font-family: var(--font-display);
          font-size: 1.1rem;
          line-height: 1.3;
          color: var(--navy);
          margin: 0 0 16px;
        }
        .rl-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .rl-video {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          background: var(--white);
          border: 1px solid var(--blue-pale);
          border-radius: 10px;
          padding: 8px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .rl-video:hover {
          border-color: var(--amber);
          box-shadow: 0 2px 10px rgba(22, 47, 74, 0.08);
        }
        .rl-thumb {
          position: relative;
          flex-shrink: 0;
          width: 120px;
          height: 68px;
          border-radius: 7px;
          overflow: hidden;
          background: var(--blue-pale);
        }
        .rl-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .rl-play {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rl-play svg {
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5));
        }
        .rl-thumb-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--navy);
        }
        .rl-video-label {
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--navy);
          line-height: 1.4;
        }
        .rl-text-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          background: var(--white);
          border: 1px solid var(--blue-pale);
          border-radius: 10px;
          padding: 12px 14px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .rl-text-link:hover {
          border-color: var(--amber);
          box-shadow: 0 2px 10px rgba(22, 47, 74, 0.08);
        }
        .rl-badge {
          flex-shrink: 0;
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: var(--amber);
          background: var(--amber-bg);
          border: 1px solid var(--amber);
          border-radius: 6px;
          padding: 3px 8px;
        }
        .rl-text-label {
          flex: 1;
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--navy);
          line-height: 1.4;
        }
        .rl-ext {
          flex-shrink: 0;
          color: var(--slate-500);
          display: flex;
        }
        .rl-note {
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--slate-500);
          line-height: 1.5;
          margin: 14px 0 0;
        }
      `}</style>
    </section>
  );
}
