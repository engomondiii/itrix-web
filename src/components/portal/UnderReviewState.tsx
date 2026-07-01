import { PORTAL_COPY } from '@/lib/content/portalCopy';

/** The "held for human review" state (§63) — warning-soft, never a hard error. */
export function UnderReviewState() {
  return (
    <div className="flex items-start gap-2 rounded-md border-l-[3px] border-warning bg-warning-soft px-4 py-3">
      <span aria-hidden className="mt-0.5 text-warning-text">◍</span>
      <p className="text-secondary text-warning-text">{PORTAL_COPY.messages.states.underReview}</p>
    </div>
  );
}
