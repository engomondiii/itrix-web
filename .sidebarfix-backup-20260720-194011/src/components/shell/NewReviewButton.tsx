'use client';

import { useThreadContext } from '@/context/ThreadContext';
import { useComposerStore } from '@/store/composerStore';
import { useSidebarStore } from '@/store/sidebarStore';
import { SIDEBAR_COPY } from '@/lib/content/composerCopy';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * Start a new review.
 *
 * It does NOT navigate. Starting a new review clears the active thread, which
 * returns the same mounted surface to its empty state — the approved centre with
 * the composer back in the middle. The URL is updated with replaceState by
 * `startNew`; no route transition fires (R21).
 */
export function NewReviewButton() {
  const { startNew } = useThreadContext();
  const clear = useComposerStore((s) => s.clear);
  const requestFocus = useComposerStore((s) => s.requestFocus);
  const closeSheet = useSidebarStore((s) => s.closeSheet);

  return (
    <button
      type="button"
      className="sidebar-new-review"
      onClick={() => {
        startNew();
        clear();
        requestFocus();
        closeSheet();
        trackEvent('shell.new_review', {});
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span>{SIDEBAR_COPY.newReview}</span>
    </button>
  );
}
