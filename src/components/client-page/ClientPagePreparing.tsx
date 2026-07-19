'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * The loading state shown on /c/[token] while the personalized AI review is being
 * generated. We deliberately do NOT show the deterministic stub first (which then
 * flips/reloads to the AI version) — instead we hold here until the AI page is ready and
 * reveal the finished review once. Rotating status lines make the wait feel considered
 * rather than stuck.
 */
const STATUS_LINES = [
  'Reading the bottleneck you described…',
  'Mapping it to the itriX diagnostic frame…',
  'Assembling your personalized review…',
  'Preparing what can be shared before an NDA…',
  'Almost ready…',
];

export function ClientPagePreparing() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, STATUS_LINES.length - 1)), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="container-page py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-lg border border-border-medium bg-surface px-6 py-16 text-center shadow-1 md:py-20">
        <SectionLabel>Your review</SectionLabel>
        <h1 className="text-web-h2 text-structure-900">Preparing your review</h1>
        <p className="reading max-w-md text-ink-secondary">
          We&rsquo;re putting together a personalized read of the bottleneck you described.
          This takes a few moments — the page will appear here automatically when it&rsquo;s
          ready. No need to reload.
        </p>
        <div className="mt-2 flex items-center gap-3 text-secondary text-ink-secondary">
          <Spinner size="sm" />
          <span aria-live="polite">{STATUS_LINES[i]}</span>
        </div>
      </div>
    </div>
  );
}
