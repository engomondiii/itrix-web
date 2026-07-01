import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import type { PortalSettings } from '@/types/portal.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET — profile · team access · notification preferences (client-JWT). */
export async function GET() {
  const res = await djangoFetch<PortalSettings>(apiRoutes.portalSettings, { method: 'GET' });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) return NextResponse.json({ error: { detail: `settings ${res.status}` } }, { status: 502 });
  return NextResponse.json(res.data);
}

interface PatchBody {
  profile?: Partial<PortalSettings['profile']>;
  notifications?: PortalSettings['notifications'];
}

/** PATCH — update profile and/or notification preferences. */
export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => ({}))) as PatchBody;
  const res = await djangoFetch<PortalSettings>(apiRoutes.portalSettings, { method: 'PATCH', body });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) return NextResponse.json({ error: { detail: `settings ${res.status}` } }, { status: 502 });
  return NextResponse.json(res.data);
}

interface PostBody {
  inviteEmail?: string;
}

/** POST — invite a teammate into the workspace. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as PostBody;
  if (!body.inviteEmail) {
    return NextResponse.json({ error: { detail: 'An email is required.' } }, { status: 400 });
  }
  const res = await djangoFetch<PortalSettings>(apiRoutes.portalTeamInvite, {
    method: 'POST',
    body: { email: body.inviteEmail },
  });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) return NextResponse.json({ error: { detail: `invite ${res.status}` } }, { status: 502 });
  return NextResponse.json(res.data);
}
