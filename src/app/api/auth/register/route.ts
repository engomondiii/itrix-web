import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * POST /api/auth/register — open registration (Backend v7.1 §15.5).
 *
 * ── IT 404s WHEN DISABLED, NOT 403 ──────────────────────────────────────────
 * A disabled feature should not advertise itself. A 403 says "this exists and you may
 * not"; a 404 says nothing, which is the correct amount to say about a capability that is
 * deliberately switched off.
 *
 * ── AND IT IS THE THIRD OF THREE LAYERS ─────────────────────────────────────
 * The sign-up page does not render the form, `useSignUp.register` refuses, and this route
 * 404s. Three layers, because the consequence of open registration arriving by accident
 * is Clients with no Lead, no journey state and no disclosure basis — which breaks
 * value-first, qualification and the persona-keyed pitch model at once
 * (Architecture v2.8 §00.2).
 *
 * `NEXT_PUBLIC_ENABLE_OPEN_SIGNUP` is read here rather than a server-only variable so the
 * surface and the proxy cannot disagree about whether the feature is on. The backend has
 * its own `ENABLE_OPEN_SIGNUP` and is the one that actually binds.
 */
const OPEN_SIGNUP = (process.env.NEXT_PUBLIC_ENABLE_OPEN_SIGNUP ?? '').toLowerCase() === 'true';

export async function POST(req: Request) {
  if (!OPEN_SIGNUP) {
    return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register/`, {
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

    const text = await res.text();
    const payload = text ? (JSON.parse(text) as unknown) : null;
    return NextResponse.json(payload ?? { created: res.ok }, { status: res.status });
  } catch {
    return NextResponse.json({ detail: 'Registration service unavailable.' }, { status: 503 });
  }
}
