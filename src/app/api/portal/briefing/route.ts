import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';
import type { PortalBriefing } from '@/types/portal.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/portal/briefing — the living Problemology review inside the portal.
 * Served by the backend result_page/Diagnosis projection for the signed-in client
 * (client-JWT). Disclosure-gated: NDA-only sections are withheld until the NDA is in
 * place. Mirrors the customized page sections (Playbook §64 / Part X).
 */
export async function GET() {
  const res = await djangoFetch<PortalBriefing>('/portal/briefing/', { method: 'GET' });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) return NextResponse.json({ error: { detail: `briefing ${res.status}` } }, { status: 502 });
  return NextResponse.json(res.data);
}
