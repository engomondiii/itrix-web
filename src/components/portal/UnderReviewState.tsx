'use client';

import { usePortalCopy } from '@/lib/i18n/portalLocale';

/** The "held for human review" state (§63) — warning-soft, never a hard error. */
export function UnderReviewState() {
  const portalCopy = usePortalCopy();
  return (
    <div className="flex items-start gap-2 rounded-md border-l-[3px] border-warning bg-warning-soft px-4 py-3">
      <span aria-hidden className="mt-0.5 text-warning-text">◍</span>
      <p className="text-secondary text-warning-text">{portalCopy.messages.states.underReview}</p>
    </div>
  );
}
