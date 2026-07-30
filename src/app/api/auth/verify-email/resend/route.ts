import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/** One body, one status, always. Constructed here so no branch below can vary it. */
const ACCEPTED = { accepted: true } as const;

/**
 * POST /api/auth/verify-email/resend — ask for another confirmation link.
 *
 * ── IT IS INCAPABLE OF REPORTING ANYTHING ELSE (R64) ────────────────────────
 * 202 with an identical body whether the address is unknown, unconfirmed, already
 * confirmed, or the backend is down. A resend that answered differently for those cases
 * would be exactly the enumeration oracle the forgot-password confirmation is written to
 * avoid — and it would be a free one, because nobody thinks of a resend button as an
 * authentication endpoint.
 *
 * The single exception is 429, which is a fact about the CALLER rather than about any
 * account, and which the surface has to show as a stated wait rather than a silent
 * failure.
 *
 * The cookie is forwarded so a signed-in client can resend without naming an address at
 * all; an unauthenticated caller may pass one.
 */
export async function POST(req: Request) {
  const cookie = req.headers.get('cookie');
  const body = (await req.json().catch(() => ({}))) as { email?: unknown };
  const email = typeof body?.email === 'string' ? body.email : undefined;

  try {
    const res = await fetch(`${API_BASE}/auth/verify-email/resend/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(email ? { email } : {}),
      cache: 'no-store',
    });

    if (res.status === 429) {
      const retryAfter = Number.parseInt(res.headers.get('Retry-After') ?? '60', 10);
      const seconds = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 60;
      return NextResponse.json({ retryAfter: seconds }, { status: 429, headers: { 'Retry-After': String(seconds) } });
    }
  } catch {
    /* Deliberately swallowed. A backend outage must not be distinguishable from an
       address that has no workspace. */
  }

  return NextResponse.json(ACCEPTED, { status: 202 });
}
