import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import type { PortalConversation } from '@/types/portal.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Django's ConversationSummarySerializer speaks its own dialect — `title`,
 * `lastPreview`, `unreadCount`, `lastMessageAt` — and this proxy used to pass it
 * through untouched while the screens read `subject`, `lastMessagePreview`,
 * `unread`, `updatedAt`. Every one of those reads came back `undefined`: the list
 * showed fallback subjects, no timestamps, and — the visible symptom — `unread`
 * could never satisfy `> 0`, so an unread badge could not render at all.
 * Normalising at the proxy is the house pattern (see lib/api/normalizeWire.ts for
 * threads); the screens stay on the typed shape.
 */
interface WireConversationSummary {
  id: string;
  context?: string;
  title?: string | null;
  lastPreview?: string | null;
  unreadCount?: number;
  lastMessageAt?: string | null;
  teamJoined?: boolean;
}

function toPortalConversation(wire: WireConversationSummary): PortalConversation {
  return {
    id: wire.id,
    subject: wire.title ?? null,
    lastMessagePreview: wire.lastPreview ?? null,
    unread: typeof wire.unreadCount === 'number' ? wire.unreadCount : 0,
    teamJoined: Boolean(wire.teamJoined),
    updatedAt: wire.lastMessageAt ?? '',
  };
}

/** GET /api/portal/conversations — the client's conversation list (client-JWT, disclosure-gated by Django). */
export async function GET() {
  const res = await djangoFetch<WireConversationSummary[]>(apiRoutes.portalConversations, { method: 'GET' });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  return NextResponse.json((Array.isArray(res.data) ? res.data : []).map(toPortalConversation));
}
