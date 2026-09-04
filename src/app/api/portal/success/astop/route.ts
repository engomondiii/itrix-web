import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/portal/success/astop — thin customer-safe proxy to Django.
 *
 * Authentication and authorization stay backend-owned. The browser never receives
 * the client JWT and this handler deliberately performs no progression inference.
 */
export async function GET() {
  const res = await djangoFetch<unknown>('/portal/success/astop/', { method: 'GET' });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (res.status === 403) return NextResponse.json({ error: { detail: 'not_contracted' } }, { status: 403 });
  if (!res.ok || res.data === null) {
    return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  }
  return NextResponse.json(res.data);
}
