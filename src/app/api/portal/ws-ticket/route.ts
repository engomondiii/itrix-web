import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface WsTicketResponse {
  ticket: string;
  expiresIn: number;
}

/**
 * Same-origin bridge from the httpOnly client session to a narrow WS credential.
 * The client access JWT remains server-only; browser JS sees only this short-lived,
 * WebSocket-only signed ticket.
 */
export async function POST() {
  const res = await djangoFetch<WsTicketResponse>(apiRoutes.portalWsTicket, { method: 'POST' });
  if (res.status === 401 || res.status === 403) {
    return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  }
  if (!res.ok || !res.data?.ticket) {
    return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  }
  return NextResponse.json(res.data, {
    headers: { 'Cache-Control': 'no-store, private' },
  });
}
