import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';
import { getVerificationEmailHint } from '@/lib/server/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ACCEPTED = { accepted: true } as const;

/** Enumeration-safe verification resend. Client cookies are translated to Bearer server-side. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: unknown };
  const suppliedEmail = typeof body?.email === 'string' ? body.email.trim() : '';
  const email = suppliedEmail || (await getVerificationEmailHint()) || '';

  const res = await djangoFetch<unknown>('/auth/verify-email/resend/', {
    method: 'POST',
    body: email ? { email } : {},
    // Keep auth enabled: an authenticated client can omit the address. Anonymous callers
    // simply have no access cookie and reach the backend's AllowAny handler.
  });

  if (res.status === 429) {
    const init = res.retryAfter
      ? { status: 429, headers: { 'Retry-After': String(res.retryAfter) } }
      : { status: 429 };
    return NextResponse.json({ retryAfter: res.retryAfter }, init);
  }

  // One body/status for unknown, confirmed, unconfirmed and transient backend failure.
  return NextResponse.json(ACCEPTED, { status: 202 });
}
