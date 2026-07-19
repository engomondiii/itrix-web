import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/portal/success/deployments — thin proxy to Django.
 *
 * The client-JWT lives in an httpOnly cookie and is attached server-side by
 * djangoFetch, so it never reaches browser JavaScript. Django re-verifies the
 * signature, the audience and the disclosure ceiling on every call — this handler
 * forwards and shapes errors, and makes no authorization decision of its own.
 */
export async function GET() {
  const res = await djangoFetch<unknown>('/portal/success/deployments/', { method: 'GET' });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (res.status === 403) return NextResponse.json({ error: { detail: 'not_contracted' } }, { status: 403 });
  if (!res.ok || res.data === null) {
    return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  }
  return NextResponse.json(res.data);
}
