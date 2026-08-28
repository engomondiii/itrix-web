'use client';

import { useRailCopy } from '@/lib/i18n/conversationLocale';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThreadContext } from '@/context/ThreadContext';
import { cn } from '@/lib/cn';

/**
 * The workspace's own conversation list — "Your conversations", inside the
 * portal sidebar (2026-08-10).
 *
 * ── WHY THIS IS NOT `ConversationList` ──────────────────────────────────────
 * The rail's list navigates with `switchTo` (a history push against the mounted
 * working shell). The portal has no working shell: a conversation here is a
 * ROUTE — /workspace/review/<id> — rendered inside the portal's own chrome, so
 * plain links are the honest mechanics and the browser's Back does the right
 * thing for free. The label and the empty sentence reuse the approved rail
 * copy, so the two surfaces never drift apart in vocabulary.
 *
 * Same data, same order: `useThreadContext().threads` is the one list the whole
 * surface shares (client-owned plus this browser's still-anonymous threads —
 * the backend's union). Nothing here decides what a customer may open; the
 * route re-authorizes on fetch.
 */
export function PortalConversationList() {
  const railCopy = useRailCopy();
  const { threads, activeThreadId, refresh } = useThreadContext();
  const pathname = usePathname();

  /* ── WHY THIS REFETCHES (2026-08-10) ──────────────────────────────────────
     The thread list is fetched once, when ThreadProvider mounts — which on a
     client-side sign-in happens BEFORE the customer has a client session. That
     first response is the anonymous one (their client-owned conversations are
     invisible to it), and nothing refetched afterwards, so the workspace showed
     an empty list for an account that had conversations. Mounting this list is
     the honest trigger: it happens exactly when the signed-in workspace needs
     the signed-in answer. */
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.5">
      <h2 className="px-3 text-micro font-semibold uppercase tracking-[0.1em] text-ink-secondary">
        {railCopy.conversationsLabel}
      </h2>

      {threads.length === 0 ? (
        <p className="px-3 text-caption text-ink-secondary">{railCopy.conversationsEmpty}</p>
      ) : (
        <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-1">
          {threads.map((thread) => {
            const href = `/workspace/review/${encodeURIComponent(thread.id)}`;
            const active = pathname === href || thread.id === activeThreadId;
            return (
              <li key={thread.id}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'block truncate rounded-md px-3 py-1.5 text-secondary transition-colors',
                    active
                      ? 'bg-soft font-medium text-ink-primary'
                      : 'text-ink-secondary hover:bg-surface hover:text-ink-primary',
                  )}
                >
                  {thread.title || 'Untitled conversation'}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
