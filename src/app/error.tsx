'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface 1 holds no business logic; log to the console for now.
    // Production telemetry is wired in Phase 3 (analytics/).
    console.error('itrix-web error:', error);
  }, [error]);

  return (
    <section className="container-page section flex flex-col items-center text-center" role="alert">
      <SectionLabel tone="error">Something went wrong</SectionLabel>
      <h1 className="mt-4 text-web-h2">We hit an unexpected error</h1>
      <p className="reading mt-3 text-center">
        The page failed to load. You can try again, and if it keeps happening, the assessment team
        will still receive any review you submitted.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-caption text-ink-400">Reference: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex gap-3">
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <Button variant="secondary" onClick={() => (window.location.href = '/')}>
          Go to homepage
        </Button>
      </div>
    </section>
  );
}
