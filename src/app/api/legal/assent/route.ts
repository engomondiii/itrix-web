import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * POST /api/legal/assent — record affirmative assent (Backend v7.0 §7.2).
 *
 * ── THE FAILURE MODE IS THE INTERESTING PART ────────────────────────────────
 * Backend v7.0 §9 records assent INSIDE THE SAME TRANSACTION as the invite nonce burn
 * and the thread claim, "so a Client never exists without the assent that created it".
 * This route is the path for the case where the frontend records it separately — during
 * the deployment window before that transaction ships, and for a re-prompt after a
 * material version change.
 *
 * Which means a FAILURE HERE MUST BE VISIBLE, not swallowed. If the record does not
 * land, the account-creation flow has to know: an account created without a recorded
 * assent is exactly the state §19.10 exists to prevent, and pretending it succeeded
 * would make the audit trail confidently wrong. So this forwards the real status rather
 * than degrading to 200, which is the opposite of what the shell and journey proxies do
 * and is deliberate.
 */
export async function POST(req: Request) {
  const cookie = req.headers.get('cookie');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/portal/legal/assent/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const text = await res.text();
    const payload = text ? (JSON.parse(text) as unknown) : null;
    return NextResponse.json(payload ?? { recorded: res.ok }, { status: res.status });
  } catch {
    return NextResponse.json({ detail: 'Assent service unavailable.' }, { status: 503 });
  }
}
