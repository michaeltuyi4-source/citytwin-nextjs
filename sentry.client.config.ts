// Sentry browser SDK init. Loaded into the client bundle by withSentryConfig.
// Errors only: no performance tracing, no session replay, no profiling.
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Errors only. No performance tracing.
  tracesSampleRate: 0,

  // No session replay (replay integration is not added, and sample rates are
  // pinned to 0 as a belt-and-suspenders guard).
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});
