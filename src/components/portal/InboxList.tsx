'use client';

import { cn } from '@/lib/cn';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import type { PortalConversation } from '@/types/portal.types';

/**
 * The inbox's message list (2026-08-10).
 *
 * An ordinary inbox column: what the conversation is about, a one-line preview of
 * where it got to, when it last moved, and an unread count when there is one. The
 * briefing sits at the top as a pinned item — the team sends it to you to read,
 * which is exactly what belongs in an inbox.
 *
 * It renders only; selection is the page's business, and nothing here decides
 * what may be opened.
 */
function whenLabel(iso: string): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '';
  const mins = Math.round((Date.now() - then.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString();
}

export function InboxList({
  conversations,
  activeId,
  onSelect,
  briefingId,
  briefingAvailable,
}: {
  conversations: PortalConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  briefingId: string;
  briefingAvailable: boolean;
}) {
  const copy = PORTAL_COPY.messages.inbox;

  return (
    <aside className="w-full shrink-0 lg:w-72" aria-label={copy.listLabel}>
      <h2 className="px-1 pb-2 text-micro font-semibold uppercase tracking-[0.1em] text-ink-secondary">
        {copy.listLabel}
      </h2>

      <ul className="flex flex-col gap-1">
        {briefingAvailable ? (
          <li>
            <button
              type="button"
              onClick={() => onSelect(briefingId)}
              aria-current={activeId === briefingId ? 'true' : undefined}
              className={cn(
                'w-full rounded-md border px-3 py-2.5 text-left transition-colors',
                activeId === briefingId
                  ? 'border-border-medium bg-soft'
                  : 'border-transparent hover:border-border-soft hover:bg-surface',
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-body font-medium text-ink-primary">{copy.briefingRow}</span>
                <span className="shrink-0 rounded-pill border border-border-medium px-1.5 text-micro text-ink-secondary">
                  {copy.teamJoinedTag}
                </span>
              </span>
              <span className="mt-0.5 block truncate text-caption text-ink-secondary">
                {copy.briefingPreview}
              </span>
            </button>
          </li>
        ) : null}

        {(conversations ?? []).map((c) => {
          const active = c.id === activeId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'w-full rounded-md border px-3 py-2.5 text-left transition-colors',
                  active
                    ? 'border-border-medium bg-soft'
                    : 'border-transparent hover:border-border-soft hover:bg-surface',
                )}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      'truncate text-body text-ink-primary',
                      c.unread > 0 ? 'font-semibold' : 'font-medium',
                    )}
                  >
                    {c.subject || copy.threadFallbackSubject}
                  </span>
                  <span className="shrink-0 text-micro text-ink-secondary">{whenLabel(c.updatedAt)}</span>
                </span>
                <span className="mt-0.5 flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-caption text-ink-secondary">
                    {c.lastMessagePreview || '—'}
                  </span>
                  {c.unread > 0 ? (
                    <span
                      aria-label={copy.unreadLabel(c.unread)}
                      className="inline-flex min-w-5 shrink-0 items-center justify-center rounded-pill bg-error px-1.5 text-micro font-semibold text-white"
                    >
                      {c.unread}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
