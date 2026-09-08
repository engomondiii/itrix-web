'use client';

import { useRailCopy } from '@/lib/i18n/conversationLocale';

import { useState } from 'react';
import { useThreadContext } from '@/context/ThreadContext';
import { useRailStore } from '@/store/railStore';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { RenameThreadDialog } from './RenameThreadDialog';
import { DeleteThreadDialog } from './DeleteThreadDialog';
import type { ThreadSummary } from '@/types/thread.types';

/**
 * One conversation in the rail.
 *
 * Selecting it does NOT navigate: the thread becomes active and the same transcript
 * node re-renders with its turns. The URL follows via replaceState.
 *
 * The backend is authoritative for management. Rename/delete update the local mirror
 * only after the corresponding PATCH/DELETE succeeds. That is equally true for a
 * signed-in owner and for the anonymous visitor session that owns its thread.
 */
export function ConversationListItem({ thread }: { thread: ThreadSummary }) {
  const railCopy = useRailCopy();
  const { activeThreadId, switchTo, rename, remove } = useThreadContext();
  const closeSheet = useRailStore((s) => s.closeSheet);
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const active = activeThreadId === thread.id;
  const visibleTitle = thread.title.trim() || railCopy.newChat;

  return (
    <li className="rail-thread" data-active={active || undefined}>
      <button
        type="button"
        aria-current={active ? 'true' : undefined}
        className="rail-thread__open"
        onClick={() => {
          switchTo(thread.id);
          closeSheet();
          trackEvent('thread.selected', { fromRail: true });
        }}
      >
        <span className="rail-thread__title">{visibleTitle}</span>
      </button>

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
          onClick={() => setDeleting(true)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 7h14M10 7V5h4v2M8 7l1 12h6l1-12" />
          </svg>
        </button>
      </span>

      {renaming ? (
        <RenameThreadDialog
          open
          currentTitle={visibleTitle}
          onClose={() => setRenaming(false)}
          onSave={(title) => rename(thread.id, title)}
        />
      ) : null}

      {deleting ? (
        <DeleteThreadDialog
          open
          currentTitle={visibleTitle}
          onClose={() => setDeleting(false)}
          onDelete={async () => {
            const deleted = await remove(thread.id);
            if (deleted && active) {
              /* `remove` has already cleared the local stores. A real replacement
                 navigation now removes the deleted /review/<id> route segment from
                 browser history and lets the canonical fresh/empty surface render. */
              closeSheet();
              window.location.replace('/');
            }
            return deleted;
          }}
        />
      ) : null}
    </li>
  );
}
