import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * POST /api/auth/password-reset/confirm — redeem a reset token (Backend v7.1 §15.1).
 *
 * ── THIS ONE FORWARDS FAILURE, UNLIKE THE REQUEST ───────────────────────────
 * The visitor is holding a link they believe works. Reporting success when the token was
 * expired would leave them with an unchanged password and no idea why they cannot sign
 * in, which is worse than a clear refusal.
 *
 * What it does NOT do is distinguish the causes: expired, already consumed and unknown
 * are collapsed into one status the client renders as a single message with an offer of a
 * new link. Telling an attacker holding a guessed token that it "expired" would confirm
 * they had guessed a real one.
 *
 * ── THE ORDERING THAT MATTERS IS ON THE BACKEND ─────────────────────────────
 * The token must be burned in the SAME transaction as the password write, and BEFORE it
 * (Backend v7.1 §15.3 property 2). This is worth naming here because `claim_invite` got
 * exactly this wrong: its recovery branch ran before the nonce was consumed, so a
 * single-use invite token could be reused. Nothing this proxy does can compensate for
 * getting that wrong on the other side.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/auth/password-reset/confirm/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (res.status === 429) {
      const retryAfter = Number.parseInt(res.headers.get('Retry-After') ?? '60', 10);
      return NextResponse.json(
        { retryAfter: Number.isFinite(retryAfter) ? retryAfter : 60 },
        { status: 429, headers: { 'Retry-After': String(retryAfter || 60) } },
      );
    }

    /* Every rejection collapses to 400. The client renders one message for all of them. */
    if (res.status === 400 || res.status === 404 || res.status === 410 || res.status === 403) {
      return NextResponse.json({ detail: 'That link is no longer usable.' }, { status: 400 });
    }

    if (!res.ok) return NextResponse.json({ detail: 'Reset service unavailable.' }, { status: 502 });

    /* The backend signs out other sessions as part of the change. Nothing is echoed back
       about the account — the client already knows what it asked for. */
    return NextResponse.json({ changed: true }, { status: 200 });
  } catch {
    return NextResponse.json({ detail: 'Reset service unavailable.' }, { status: 503 });
  }
}
