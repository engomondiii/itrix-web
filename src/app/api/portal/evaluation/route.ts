import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import type { PortalEvaluation } from '@/types/portal.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/portal/evaluation — evaluation tracking (client-JWT, disclosure-gated by Django). */
export async function GET() {
  const res = await djangoFetch<PortalEvaluation>(apiRoutes.portalEvaluation, { method: 'GET' });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  return NextResponse.json(res.data);
}
