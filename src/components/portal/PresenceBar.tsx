'use client';

import { usePortalStore } from '@/store/portalStore';
import { usePortalSocket } from '@/hooks/usePortalSocket';

/**
 * Live presence for a portal conversation (Phase 3). Mounting this bar opens the
 * authenticated portal socket, which feeds presence.update (and message streams) into
 * the stores. When realtime is off, the socket is inert and this simply reflects
 * whatever presence the store holds (usually empty), rendering nothing.
 */
export function PresenceBar({ conversationId }: { conversationId?: string | null }) {
  // Opening the socket here keeps presence live wherever the thread is shown.
  usePortalSocket(conversationId ?? null);
  const present = usePortalStore((s) => s.presentTeam);

  if (present.length === 0) return null;
  return (
    <div className="flex items-center gap-2 border-b border-border-soft px-1 pb-2 text-caption text-ink-secondary">
      <span aria-hidden className="inline-block h-2 w-2 rounded-pill bg-tier-1" />
      {present.join(', ')} from the itriX team {present.length === 1 ? 'is' : 'are'} here
    </div>
  );
}
