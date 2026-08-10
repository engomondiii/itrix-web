import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import type { PortalNdaRequestResult } from '@/types/portal.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST — ask the itriX team to arrange an NDA (client-JWT).
 *
 * Submitted from the Documents screen, in place. Django stamps the request,
 * posts the note into the customer's workspace inbox and sends the emails; this
 * proxy only carries the customer's identity and passes the answer back.
 */
export async function POST() {
  const res = await djangoFetch<PortalNdaRequestResult>(apiRoutes.portalNdaRequest, {
    method: 'POST',
    body: {},
  });
  if (res.status === 401) {
    return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  }
  if (!res.ok || res.data === null) {
    return NextResponse.json({ error: { detail: `nda ${res.status}` } }, { status: 502 });
  }
  return NextResponse.json(res.data);
}
