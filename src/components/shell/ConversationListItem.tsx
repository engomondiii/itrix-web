'use client';

import { useEffect, useRef, useState } from 'react';
import { useThreadContext } from '@/context/ThreadContext';
import { useSidebarStore } from '@/store/sidebarStore';
import { SIDEBAR_COPY } from '@/lib/content/composerCopy';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { ThreadSummary } from '@/types/thread.types';

/** Relative time, dependency-free and stable enough for a list label. */
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'yesterday' : `${days}d ago`;
}

/**
 * One conversation in the sidebar list.
 *
 * Selecting it does NOT navigate: the thread becomes active and the same
 * transcript node re-renders with its turns. The URL follows via replaceState.
 *
 * The title is generated from the visitor's own words and is renameable. It
 * inherits the no-inference rule — a title may never name an inferred company,
 * department or persona (Playbook v1.6 §16A, Architecture v2.6 §4).
 */
export function ConversationListItem({ thread }: { thread: ThreadSummary }) {
  const { activeThreadId, select, rename, remove } = useThreadContext();
  const closeSheet = useSidebarStore((s) => s.closeSheet);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(thread.title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const active = activeThreadId === thread.id;

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function commit() {
    const next = draft.trim();
    if (next && next !== thread.title) rename(thread.id, next);
    else setDraft(thread.title);
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="sidebar-thread sidebar-thread--editing">
        <input
          ref={inputRef}
          value={draft}
          aria-label="Rename this review"
          className="sidebar-thread__input"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            }
            if (e.key === 'Escape') {
              setDraft(thread.title);
              setEditing(false);
            }
          }}
        />
      </li>
    );
  }

  return (
    <li className="sidebar-thread" data-active={active || undefined}>
      <button
        type="button"
        aria-current={active ? 'true' : undefined}
        className="sidebar-thread__open"
        onClick={() => {
          select(thread.id);
          closeSheet();
          trackEvent('thread.selected', { fromSidebar: true });
        }}
      >
        <span className="sidebar-thread__title">{thread.title}</span>
        <span className="sidebar-thread__time">{relativeTime(thread.lastActivityAt)}</span>
      </button>

      {/* Two plain controls rather than a hidden menu: a keyboard user should not
          have to discover a hover affordance to rename their own conversation. */}
      <span className="sidebar-thread__actions">
        <button
          type="button"
          className="sidebar-thread__action"
          aria-label={`${SIDEBAR_COPY.rename} “${thread.title}”`}
          onClick={() => setEditing(true)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
          </svg>
        </button>
        <button
          type="button"
          className="sidebar-thread__action"
          aria-label={`${SIDEBAR_COPY.delete} “${thread.title}”`}
          onClick={() => remove(thread.id)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 7h14M10 7V5h4v2M8 7l1 12h6l1-12" />
          </svg>
        </button>
      </span>
    </li>
  );
}
