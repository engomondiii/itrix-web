import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * POST /api/auth/verify-email — confirm an address (Backend v7.2 §15.3).
 *
 * ── THIS ONE FORWARDS THE REAL STATUS, UNLIKE THE RESEND ────────────────────
 * The visitor is holding a link they believe works. Reporting success for a dead token
 * would leave them believing an address is confirmed when it is not, and the consequence
 * shows up much later as an NDA that cannot be issued.
 *
 * It still does not distinguish expired from consumed from unknown: the backend returns one
 * error for all three and this passes that through unchanged.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  const token = (body as { token?: unknown } | null)?.token;
  if (typeof token !== 'string' || token.trim().length === 0) {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/auth/verify-email/confirm/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ token }),
      cache: 'no-store',
    });

    if (res.status === 429) {
      const retryAfter = Number.parseInt(res.headers.get('Retry-After') ?? '60', 10);
      const seconds = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 60;
      return NextResponse.json({ retryAfter: seconds }, { status: 429, headers: { 'Retry-After': String(seconds) } });
    }

    if (res.ok) return NextResponse.json({ confirmed: true }, { status: 200 });
    if (res.status === 400 || res.status === 404 || res.status === 410) {
      return NextResponse.json({ confirmed: false }, { status: 410 });
    }
    return NextResponse.json({ detail: 'Verification service unavailable.' }, { status: 503 });
  } catch {
    return NextResponse.json({ detail: 'Verification service unavailable.' }, { status: 503 });
  }
}
