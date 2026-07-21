// Sentry Node.js (server) SDK init. Errors only: no performance tracing.
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Errors only. No performance tracing.
  tracesSampleRate: 0,
});
