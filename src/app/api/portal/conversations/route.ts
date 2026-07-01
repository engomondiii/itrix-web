import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import type { PortalConversation } from '@/types/portal.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/portal/conversations — the client's conversation list (client-JWT, disclosure-gated by Django). */
export async function GET() {
  const res = await djangoFetch<PortalConversation[]>(apiRoutes.portalConversations, { method: 'GET' });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  return NextResponse.json(res.data);
}
