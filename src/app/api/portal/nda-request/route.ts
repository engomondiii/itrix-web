import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import type { PortalNdaRequestPayload, PortalNdaRequestResult } from '@/types/portal.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** NDA request proxy. Problem/workload context is non-confidential framing only;
 * the request never grants restricted-content authorization. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as PortalNdaRequestPayload;
  const res = await djangoFetch<PortalNdaRequestResult>(apiRoutes.portalNdaRequest, {
    method: 'POST',
    body,
  });
  if (res.status === 401) {
    return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  }
  // Preserve a governed context-required response rather than converting it to 502.
  if (res.status === 400 && res.data) {
    return NextResponse.json(res.data, { status: 400 });
  }
  if (!res.ok || res.data === null) {
    return NextResponse.json({ error: { detail: `nda ${res.status}` } }, { status: 502 });
  }
  return NextResponse.json(res.data);
}
