'use client';

// Catches render errors in the root layout and reports them to Sentry.
// global-error must render its own html and body tags.
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <h2>Something went wrong.</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
