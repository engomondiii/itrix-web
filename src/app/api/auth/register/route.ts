import { NextResponse } from 'next/server';
import { setVerificationEmailHint } from '@/lib/server/session';
import { getVisitorBinding } from '@/lib/server/reviewAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const OPEN_SIGNUP = (process.env.NEXT_PUBLIC_ENABLE_OPEN_SIGNUP ?? '').toLowerCase() !== 'false';
const ACCEPTED = { accepted: true } as const;

/** Open registration with enumeration-safe outcomes and explicit legal-version races. */
export async function POST(req: Request) {
  if (!OPEN_SIGNUP) return NextResponse.json({ detail: 'Not found.' }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  const assent = (body as { assent?: unknown } | null)?.assent;
  if (!Array.isArray(assent) || assent.length === 0) {
    return NextResponse.json({ detail: 'Assent is required.' }, { status: 400 });
  }

  const requestedEmail = (body as { email?: unknown } | null)?.email;
  const emailHint = typeof requestedEmail === 'string' ? requestedEmail.trim() : '';
  const visitorBinding = await getVisitorBinding();

  try {
    const res = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(visitorBinding ? { 'X-ITRIX-SESSION': visitorBinding } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (res.status === 429) {
      const retryAfter = Number.parseInt(res.headers.get('Retry-After') ?? '60', 10);
      const seconds = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 60;
      return NextResponse.json(
        { retryAfter: seconds },
        { status: 429, headers: { 'Retry-After': String(seconds) } },
      );
    }

    // This condition is deliberately NOT collapsed: it is a fact about the published
    // legal bundle, not about whether the submitted address has an account. The backend
    // evaluates it before its address branch for exactly that reason.
    if (res.status === 409) {
      const payload = (await res.json().catch(() => null)) as { code?: unknown } | null;
      if (payload?.code === 'LEGAL_TERMS_CHANGED') {
        return NextResponse.json(
          { code: 'LEGAL_TERMS_CHANGED' },
          { status: 409 },
        );
      }
    }

    if (res.status >= 500) {
      return NextResponse.json({ detail: 'Registration service unavailable.' }, { status: 503 });
    }

    await res.text();
    if (emailHint) await setVerificationEmailHint(emailHint);
    return NextResponse.json(ACCEPTED, { status: 202 });
  } catch {
    return NextResponse.json({ detail: 'Registration service unavailable.' }, { status: 503 });
  }
}
