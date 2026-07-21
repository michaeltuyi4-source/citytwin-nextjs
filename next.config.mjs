import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
  // Required on Next 14.2 so instrumentation.ts runs (stable in Next 15).
  experimental: {
    instrumentationHook: true,
  },
};

// Sentry org/project slugs. Used only for source-map upload, which is gated on
// the auth token below, so tokenless local builds never reference these.
const SENTRY_ORG = 'citytwin';
const SENTRY_PROJECT = 'javascript-nextjs';

export default withSentryConfig(nextConfig, {
  org: SENTRY_ORG,
  project: SENTRY_PROJECT,

  // Quiet build logs from the Sentry plugin.
  silent: true,

  // Upload source maps only when an auth token is present. Tokenless local
  // builds skip upload and never fail.
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
