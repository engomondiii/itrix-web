import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import type { PortalThread } from '@/types/portal.types';
import type { ChatMessage } from '@/types/chat.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET — the message history for a conversation (client-JWT). */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const res = await djangoFetch<PortalThread>(apiRoutes.portalConversationMessages(id), { method: 'GET' });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (res.status === 403 || res.status === 404)
    return NextResponse.json({ error: { detail: 'not_found' } }, { status: 404 });
  if (!res.ok || res.data === null) return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  return NextResponse.json(res.data);
}

interface SendBody {
  body?: string;
}

/**
 * POST — send a client message on this conversation. Django runs the governed reply
 * (agent or team) and returns it; a held reply carries governance_status='pending'
 * so the UI shows the "under review" state. Never fabricates a reply locally.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as SendBody;
  const res = await djangoFetch<ChatMessage>(apiRoutes.portalConversationSend(id), {
    method: 'POST',
    body: { body: body.body ?? '' },
  });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) return NextResponse.json({ error: { detail: `send ${res.status}` } }, { status: 502 });
  return NextResponse.json(res.data);
}
