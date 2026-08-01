'use client';

import { useRouter } from 'next/navigation';

import { useThreadContext } from '@/context/ThreadContext';
import { useComposerStore } from '@/store/composerStore';
import { useRailStore } from '@/store/railStore';
import { RAIL_COPY } from '@/lib/content/composerCopy';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * New chat — at the top of the conversation rail, at every state.
 *
 * RENAMED FROM NewReviewButton, and the label changed with it: "New chat" rather
 * than "New review" (Playbook v1.7 §16A). A customer at State 10 opening one is
 * not starting a new review; they are starting a new conversation inside a
 * relationship that already exists.
 *
 * WHICH IS THE INVARIANT THAT MATTERS: a new chat INHERITS the subject's plane
 * and journey state (R36). It never resets a journey, never re-runs
 * qualification, and never lowers a disclosure ceiling. Nothing here calls
 * `advance()`, and nothing here decides a state — the backend does, and Backend
 * v7.0 §7.2 is where that guarantee is enforced. This button only clears the
 * local active thread.
 *
 * IT DOES NAVIGATE, and that is correct. R21 forbids a route transition on
 * SUBMIT — the visitor must never be thrown to a new page for describing their
 * problem. Deliberately starting over is the opposite: they are asking for a
 * fresh conversation. It has to be a real navigation because the centre only
 * renders from the `/` route segment; clearing the thread and rewriting the URL
 * with replaceState left /review/[threadId] rendered, which produced a bare
 * centre with no shell around it.
 *
 * WHAT `/` RENDERS IS NOT THE FRONT DOOR for this visitor: with conversations in
 * the rail, useArrivalMode keeps the WORKING shell, so a new chat is the fresh
 * centre composer with their history still beside it — never a bounce back to
 * the marketing arrival screen.
 */
export function NewChatButton() {
  const { startNew } = useThreadContext();
  const clear = useComposerStore((s) => s.clear);
  const closeSheet = useRailStore((s) => s.closeSheet);

  const router = useRouter();

  return (
    <button
      type="button"
      className="rail-new-chat"
      onClick={() => {
        startNew();
        clear();
        closeSheet();
        trackEvent('new_chat.created', {});
        /* Back to the front door. The arrival shell takes focus itself, so
           requestFocus() is not called here — it would fight the new mount. */
        router.push('/');
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
      <span>{RAIL_COPY.newChat}</span>
    </button>
  );
}
