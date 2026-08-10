'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThreadContext } from '@/context/ThreadContext';
import { RAIL_COPY } from '@/lib/content/composerCopy';
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
  const { threads, activeThreadId } = useThreadContext();
  const pathname = usePathname();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.5">
      <h2 className="px-3 text-micro font-semibold uppercase tracking-[0.1em] text-ink-secondary">
        {RAIL_COPY.conversationsLabel}
      </h2>

      {threads.length === 0 ? (
        <p className="px-3 text-caption text-ink-secondary">{RAIL_COPY.conversationsEmpty}</p>
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
