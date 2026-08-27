import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET /api/auth/invite/lookup?code= — is this invitation usable (Backend v7.1 §15.4).
 *
 * ── EVERYTHING THIS RETURNS IS A DISCLOSURE TO AN UNAUTHENTICATED PARTY ─────
 *
 * Anyone with a guessable string can call it, so it answers exactly two things: is the
 * code usable, and where should the visitor be sent. It returns **no Lead, no
 * organisation, no persona, no journey state, no earlier conversation and no email
 * address** — and this route re-shapes the backend's answer rather than forwarding it,
 * so a future backend field cannot leak through by accident.
 *
 * A helpful "Welcome back, {organisation}" here would be a free customer list.
 *
 * ── ONE FAILURE SHAPE FOR THREE CAUSES (R54) ────────────────────────────────
 * Unknown, consumed and expired all return `{ usable: false }` with a 200. Not a 404 for
 * one and a 410 for another: the status code is as readable as the body, and three
 * distinguishable answers is a code oracle.
 */
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code')?.trim() ?? '';

  /* An empty code is answered the same way as a wrong one. */
  if (!code) return NextResponse.json({ usable: false }, { status: 200 });

  try {
    const res = await fetch(`${API_BASE}/auth/invite/lookup/?code=${encodeURIComponent(code)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (res.status === 429) {
      const retryAfter = Number.parseInt(res.headers.get('Retry-After') ?? '60', 10);
      return NextResponse.json(
        { usable: false, retryAfter: Number.isFinite(retryAfter) ? retryAfter : 60 },
        { status: 429, headers: { 'Retry-After': String(retryAfter || 60) } },
      );
    }

    if (!res.ok) return NextResponse.json({ usable: false }, { status: 200 });

    const payload = (await res.json()) as Record<string, unknown>;
    const usable = payload.usable === true;

    /* Re-shaped, not forwarded. Only these two fields can ever reach the client, whatever
       the backend decides to include later. */
    const backendUrl = typeof payload.redeemUrl === 'string' ? payload.redeemUrl : '';
    const directToken = typeof payload.token === 'string' ? payload.token : '';
    const legacyMatch = backendUrl.match(/\/c\/([^/]+)\/create-account(?:$|[?#])/);
    const inviteMatch = backendUrl.match(/\/invite\/([^/]+)\/create-account(?:$|[?#])/);
    const rawToken = directToken || (inviteMatch?.[1] ? decodeURIComponent(inviteMatch[1]) : '') || (legacyMatch?.[1] ? decodeURIComponent(legacyMatch[1]) : '');
    const redeemUrl = rawToken ? `/invite/${encodeURIComponent(rawToken)}/create-account` : null;

    if (!usable || !redeemUrl) return NextResponse.json({ usable: false }, { status: 200 });
    return NextResponse.json({ usable: true, redeemUrl }, { status: 200 });
  } catch {
    return NextResponse.json({ usable: false }, { status: 200 });
  }
}
