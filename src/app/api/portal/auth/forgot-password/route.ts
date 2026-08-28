import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/portal/auth/forgot-password — legacy alias for the canonical reset request.
 * Always returns 200 with the same neutral body regardless of whether the email is
 * registered (no account enumeration).
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  await djangoFetch('/auth/password-reset/request/', {
    method: 'POST',
    authed: false,
    body: { email: body.email ?? '' },
  });
  return NextResponse.json({ ok: true });
}
