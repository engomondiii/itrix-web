import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * `ENABLE_OPEN_SIGNUP` now DEFAULTS ON (Architecture v2.9 §22.1).
 *
 * Only the literal string `false` closes it. The variable is read here rather than from a
 * server-only name so the page and the proxy cannot disagree about whether the feature is on;
 * the backend has its own `ENABLE_OPEN_SIGNUP` and is the one that actually binds.
 */
const OPEN_SIGNUP = (process.env.NEXT_PUBLIC_ENABLE_OPEN_SIGNUP ?? '').toLowerCase() !== 'false';

/** ONE body, ONE status. Built once so no branch below can vary it. */
const ACCEPTED = { accepted: true } as const;

/**
 * POST /api/auth/register — open registration (Architecture v2.9 §27, Backend v7.2 §15.5).
 *
 * ── IT COLLAPSES EVERY BACKEND OUTCOME INTO ONE ANSWER (R64) ────────────────
 * The v7.0 version forwarded the backend's status and body. That was correct while the route
 * was switched off and unreachable; it is an enumeration hole the moment registration is
 * public, because a 409 on an address that already has a workspace is a customer list — and a
 * free one, since anybody can type an address into a form.
 *
 * So: 202 with an identical body for created, already-in-use and rejected alike. When the
 * address is already held, the BACKEND emails the person who owns it; the person who typed it
 * learns nothing (§27.6).
 *
 * ── WHAT MAKES THE COLLAPSE SAFE RATHER THAN JUST OPAQUE ────────────────────
 * Everything a person could FIX has already been checked on the surface: required fields, the
 * address shape, twelve characters, the confirmation match, and the assent tick. If those
 * checks and the backend's ever drift apart, this collapse starts hiding real validation
 * failures behind a success screen — so `RegistrationForm.validate()` and the backend's
 * serializer are a matched pair and must be changed together.
 *
 * Two things are NOT collapsed, and neither is a fact about an account:
 *   429  a fact about the CALLER, which the surface shows as a stated wait rather than a
 *        silent failure that teaches people to retry harder
 *   400  a malformed request or a missing assent array, which is our own programming error
 *        and cannot be used to probe for addresses
 *
 * ── AND A NETWORK FAILURE IS REPORTED HONESTLY ──────────────────────────────
 * 503, not 202. The reset-REQUEST proxy degrades to accepted because there a missing account
 * and a broken service must be indistinguishable. Registration has no such requirement, and
 * telling somebody they have a workspace when nothing was created sends them to a sign-in page
 * that will reject them.
 */
export async function POST(req: Request) {
  if (!OPEN_SIGNUP) {
    /* A disabled capability does not advertise itself. 404, never 403 (§27.10). */
    return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  /* The assent versions are not optional. A Client created without a recorded basis is the
     state §19.10 exists to prevent, and refusing here is cheaper than discovering it in an
     audit — it names nothing about any address, so it is safe to report. */
  const assent = (body as { assent?: unknown } | null)?.assent;
  if (!Array.isArray(assent) || assent.length === 0) {
    return NextResponse.json({ detail: 'Assent is required.' }, { status: 400 });
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
      const seconds = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 60;
      return NextResponse.json(
        { retryAfter: seconds },
        { status: 429, headers: { 'Retry-After': String(seconds) } },
      );
    }

    if (res.status >= 500) {
      return NextResponse.json({ detail: 'Registration service unavailable.' }, { status: 503 });
    }

    /* 2xx and every 4xx below 429 arrive here as the same acceptance. Read the body so the
       connection is drained, then discard it: nothing the backend said about this address may
       reach the browser. */
    await res.text();
    return NextResponse.json(ACCEPTED, { status: 202 });
  } catch {
    return NextResponse.json({ detail: 'Registration service unavailable.' }, { status: 503 });
  }
}
