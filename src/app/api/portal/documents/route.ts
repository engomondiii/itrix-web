import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import type { PortalDataRoom } from '@/types/portal.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/portal/documents — documents + NDA-gated data room (client-JWT, disclosure-gated by Django). */
export async function GET() {
  const res = await djangoFetch<PortalDataRoom>(apiRoutes.portalDocuments, { method: 'GET' });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  return NextResponse.json(res.data);
}
