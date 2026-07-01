import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/portal/auth/forgot-password — forwards a reset request to Django.
 * Always returns 200 with the same neutral body regardless of whether the email is
 * registered (no account enumeration).
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  await djangoFetch('/client/auth/password/reset/', {
    method: 'POST',
    authed: false,
    body: { email: body.email ?? '' },
  });
  return NextResponse.json({ ok: true });
}
