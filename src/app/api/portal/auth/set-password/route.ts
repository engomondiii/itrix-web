import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';
import { setClientSession } from '@/lib/server/session';
import type { ClientIdentity } from '@/types/portal.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/portal/auth/set-password — sets a first-time / reset password using a
 * one-time token. On success Django may return a fresh client-JWT, which we store in
 * httpOnly cookies so the client lands straight in the workspace.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { token?: string; password?: string };
  if (!body.token || !body.password) {
    return NextResponse.json({ error: { detail: 'Missing token or password.' } }, { status: 400 });
  }
  const res = await djangoFetch<{ access?: string; refresh?: string; client?: ClientIdentity }>(
    '/client/auth/password/set/',
    { method: 'POST', authed: false, body: { token: body.token, password: body.password } },
  );
  if (!res.ok) {
    return NextResponse.json({ error: { detail: 'reset_failed' } }, { status: 400 });
  }
  if (res.data?.access) {
    await setClientSession({ accessToken: res.data.access, refreshToken: res.data.refresh ?? null });
  }
  return NextResponse.json({ ok: true });
}
