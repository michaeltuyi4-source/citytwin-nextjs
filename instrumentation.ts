// Next.js instrumentation hook. Loads the right Sentry init for each runtime.
// Next 14.2 requires experimental.instrumentationHook in next.config to run this.
// onRequestError is a Next 15 feature and is intentionally not exported here.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
