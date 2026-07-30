import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * POST /api/auth/password-reset/request — ask for a reset link (Backend v7.1 §15.1).
 *
 * ── THIS PROXY IS STRUCTURALLY INCAPABLE OF LEAKING (R49) ───────────────────
 *
 * It returns **202 with an identical body** whatever the backend says: whether the
 * address has a Client, whether the email service is up, whether the backend is deployed
 * at all. The only status it ever forwards is 429, because a rate limit is a fact about
 * the REQUEST rather than about the account.
 *
 * That is deliberate belt-and-braces. The page is careful not to render a "we couldn't
 * find that address" state, and the copy is written to be true either way — but a page
 * can be edited by someone who does not know why. A proxy that cannot report the
 * difference means a future component cannot accidentally surface it.
 *
 * NOTE the contrast with every other proxy on this surface: the shell and journey
 * proxies degrade to an empty 200 so a visitor sees LESS than they were entitled to.
 * This one degrades to SUCCESS, because here the honest-looking failure is the leak.
 */
export async function POST(req: Request) {
  let email = '';
  try {
    const body = (await req.json()) as { email?: unknown };
    email = typeof body.email === 'string' ? body.email.trim() : '';
  } catch {
    /* A malformed body is answered the same way as a good one. Even "your request was
       badly formed" is a distinguishable response, and there is nothing here worth
       distinguishing. */
  }

  try {
    const res = await fetch(`${API_BASE}/auth/password-reset/request/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    });

    if (res.status === 429) {
      const retryAfter = Number.parseInt(res.headers.get('Retry-After') ?? '60', 10);
      return NextResponse.json(
        { accepted: false, retryAfter: Number.isFinite(retryAfter) ? retryAfter : 60 },
        { status: 429, headers: { 'Retry-After': String(retryAfter || 60) } },
      );
    }
  } catch {
    /* Swallowed on purpose — see the note above. */
  }

  return NextResponse.json({ accepted: true }, { status: 202 });
}
