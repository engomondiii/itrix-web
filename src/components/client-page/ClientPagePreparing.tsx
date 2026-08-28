'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

/**
 * The loading state shown on /c while the personalized AI review is being
 * generated. We deliberately do NOT show the deterministic stub first (which then
 * flips/reloads to the AI version) — instead we hold here until the AI page is ready and
 * reveal the finished review once. Rotating status lines make the wait feel considered
 * rather than stuck.
 */
export function ClientPagePreparing() {
  const copy = useCommonCopy();
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, copy.reviewStatus.length - 1)), 3500);
    return () => clearInterval(t);
  }, [copy.reviewStatus.length]);

  return (
    <div className="container-page py-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-lg border border-border-medium bg-surface px-6 py-16 text-center shadow-1 md:py-20">
        <SectionLabel>{copy.yourReview}</SectionLabel>
        <h1 className="text-web-h2 text-structure-900">{copy.preparingReview}</h1>
        <p className="reading max-w-md text-ink-secondary">{copy.preparingReviewBody}</p>
        <div className="mt-2 flex items-center gap-3 text-secondary text-ink-secondary">
          <Spinner size="sm" />
          <span aria-live="polite">{copy.reviewStatus[i]}</span>
        </div>
      </div>
    </div>
  );
}
