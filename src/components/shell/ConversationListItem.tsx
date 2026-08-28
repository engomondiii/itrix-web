'use client';

import { useRailCopy } from '@/lib/i18n/conversationLocale';

import { useState } from 'react';
import { useThreadContext } from '@/context/ThreadContext';
import { useRailStore } from '@/store/railStore';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { RenameThreadDialog } from './RenameThreadDialog';
import type { ThreadSummary } from '@/types/thread.types';

/**
 * One conversation in the rail.
 *
 * Selecting it does NOT navigate: the thread becomes active and the same transcript
 * node re-renders with its turns. The URL follows via replaceState.
 *
 * PHASE 2 COMPLETES THE SWITCH. `switchTo` pushes a history entry, clears the
 * composer (a half-typed message belongs to the conversation it was written in), and
 * closes the pane's mobile sheet. The content pane's own state is keyed by thread, so
 * it rebinds without being told. Scroll position is restored by the transcript's
 * `useScrollMemory` (Surface 1 v6.0 §3.12, R37).
 *
 * The title is generated from the visitor's own words and is renameable. It inherits
 * the no-inference rule — a title may never name an inferred company, department or
 * persona (Playbook v1.7 §16A).
 */
export function ConversationListItem({ thread }: { thread: ThreadSummary }) {
  const railCopy = useRailCopy();
  const { activeThreadId, switchTo, rename, remove } = useThreadContext();
  const closeSheet = useRailStore((s) => s.closeSheet);
  /* Renaming opens a dialog rather than replacing this row with an input. The rail
     is a narrow fixed column and a generated title is drawn from the visitor's own
     opening sentence, so it is routinely 60-80 characters — the inline field could
     not show the name being edited. See RenameThreadDialog. */
  const [renaming, setRenaming] = useState(false);

  const active = activeThreadId === thread.id;
  // The store preserves the real title across partial updates. Even a malformed
  // or legacy row still gets an explicit conversation label rather than a blank row.
  const visibleTitle = thread.title.trim() || railCopy.newChat;

  return (
    <li className="rail-thread" data-active={active || undefined}>
      <button
        type="button"
        aria-current={active ? 'true' : undefined}
        className="rail-thread__open"
        onClick={() => {
          /* v6.0 PHASE 2: `switchTo`, not `select`. A deliberate switch adds a history
             entry so Back returns to the previous conversation, and it rebinds the
             transcript, the content pane and the composer inside the mounted shell —
             the shell is never unmounted (R37). */
          switchTo(thread.id);
          closeSheet();
          trackEvent('thread.selected', { fromRail: true });
        }}
      >
        <span className="rail-thread__title">{visibleTitle}</span>
      </button>

      {/* Two plain controls rather than a hidden menu: a keyboard user should not
          have to discover a hover affordance to rename their own conversation. */}
      <span className="rail-thread__actions">
        <button
          type="button"
          className="rail-thread__action"
          aria-label={`${railCopy.rename} “${visibleTitle}”`}
          onClick={() => setRenaming(true)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
          </svg>
        </button>
        <button
          type="button"
          className="rail-thread__action"
          aria-label={`${railCopy.delete} “${visibleTitle}”`}
          onClick={() => remove(thread.id)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 7h14M10 7V5h4v2M8 7l1 12h6l1-12" />
          </svg>
        </button>
      </span>

      {/* Mounted only while open, so the draft is seeded from the current title on
          every open without an effect to keep it in step. */}
      {renaming ? (
        <RenameThreadDialog
          open
          currentTitle={visibleTitle}
          onClose={() => setRenaming(false)}
          onSave={(title) => rename(thread.id, title)}
        />
      ) : null}
    </li>
  );
}
