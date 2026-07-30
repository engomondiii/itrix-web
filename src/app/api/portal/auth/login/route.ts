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
    /* ONE message for a wrong password and for an address we have never seen (R54).
       Anything more specific here is a way to test whether a company is our customer. */
    return NextResponse.json(
      { error: { detail: 'Those details did not match. Please check your email and password.' } },
      { status: 401 },
    );
  }

  /* v7.0 PHASE 4 — A REAL BUG FIXED.
     A rate-limited login previously fell into the branch below and was reported as
     `502 login 429`, so the surface showed a service failure for a security control
     working correctly. The visitor was told to try again immediately, which is exactly
     the traffic the limit exists to stop (R55). */
  if (res.status === 429) {
    return NextResponse.json(
      { error: { detail: 'Too many attempts. 429' }, retryAfter: 60 },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  if (!res.ok || !res.data?.access) {
    return NextResponse.json({ error: { detail: `login ${res.status}` } }, { status: 502 });
  }

  await setClientSession({ accessToken: res.data.access, refreshToken: res.data.refresh ?? null });
  return NextResponse.json({ client: res.data.client });
}
