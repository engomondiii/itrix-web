import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import type { ClientIdentity } from '@/types/portal.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/portal/auth/me — the signed-in client (via httpOnly client-JWT). */
export async function GET() {
  const res = await djangoFetch<ClientIdentity>(apiRoutes.clientMe, { method: 'GET' });
  if (res.status === 401) {
    return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  }
  if (!res.ok || !res.data) {
    return NextResponse.json({ error: { detail: `me ${res.status}` } }, { status: 502 });
  }
  return NextResponse.json(res.data);
}
