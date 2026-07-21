// Sentry edge runtime SDK init (middleware and edge routes). Errors only.
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Errors only. No performance tracing.
  tracesSampleRate: 0,
});
