import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import { setClientSession } from '@/lib/server/session';
import type { ClientIdentity } from '@/types/portal.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface LoginBody {
  email?: string;
  password?: string;
}

/**
 * POST /api/portal/auth/login — exchanges client credentials for a client-JWT.
 * The JWT is stored in httpOnly cookies server-side; the browser only receives the
 * client profile. Django (ClientJWTAuth, audience=client) is authoritative.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as LoginBody;
  if (!body.email || !body.password) {
    return NextResponse.json({ error: { detail: 'Email and password are required.' } }, { status: 400 });
  }

  const res = await djangoFetch<{ access: string; refresh?: string; client: ClientIdentity }>(
    apiRoutes.clientAuthLogin,
    { method: 'POST', authed: false, body: { email: body.email, password: body.password } },
  );

  if (res.status === 401 || res.status === 400) {
    return NextResponse.json({ error: { detail: 'Those credentials did not match.' } }, { status: 401 });
  }
  if (!res.ok || !res.data?.access) {
    return NextResponse.json({ error: { detail: `login ${res.status}` } }, { status: 502 });
  }

  await setClientSession({ accessToken: res.data.access, refreshToken: res.data.refresh ?? null });
  return NextResponse.json({ client: res.data.client });
}
