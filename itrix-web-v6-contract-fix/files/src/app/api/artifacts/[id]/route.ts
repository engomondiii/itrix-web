import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET /api/artifacts/[id] — one governed artifact.
 *
 * EVERY FETCH IS RE-AUTHORIZED SERVER-SIDE: Django re-checks token, journey
 * state and disclosure ceiling on every read (Architecture v2.6 §11.9). This
 * proxy forwards the cookie and returns the answer; it never caches, because a
 * cached artifact would outlive the authorization that produced it.
 *
 * ── WHY THIS FALLS BACK TO THE THREAD (v6.0 contract fix) ──────────────────
 * Backend v6.0 has NO standalone `/artifacts/{id}/` route, and that is by
 * design rather than an omission. §2.5 is explicit:
 *
 *     The in-thread rendering is PRIMARY. A dedicated route is an ALTERNATIVE
 *     view — for emailing, sharing under a capability token, or printing.
 *
 * The risk register names what happens if that inverts: "deep-linked artifacts
 * become the real interface and the thread decays." So artifacts arrive
 * EMBEDDED in the thread detail response, and this route reads them from there.
 *
 * Calling the non-existent path returned 404 on every artifact fetch, which the
 * caller surfaced as a load failure for content the visitor was entitled to see.
 *
 * `?thread=` is required because an artifact is scoped to its thread, and the
 * backend authorizes by THREAD OWNERSHIP. Fetching one by id alone would mean
 * treating the id as a secret — and URL obscurity is never authorization
 * (§11.9).
 */

type Raw = Record<string, unknown>;

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const cookie = req.headers.get('cookie');
  const thread = new URL(req.url).searchParams.get('thread');

  if (!thread) {
    return NextResponse.json(
      {
        detail:
          'An artifact is scoped to its thread. Pass ?thread={threadId} so the backend can authorize the read by ownership.',
      },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${API_BASE}/threads/${encodeURIComponent(thread)}/`, {
      method: 'GET',
      headers: { Accept: 'application/json', ...(cookie ? { cookie } : {}) },
      cache: 'no-store',
    });

    // 404 covers both "no such thread" and "not your thread" — the backend
    // deliberately does not distinguish them, and neither should this.
    if (!res.ok) {
      return NextResponse.json({ detail: `artifact ${res.status}` }, { status: res.status });
    }

    const body = (await res.json()) as Raw;
    const artifacts = Array.isArray(body.artifacts) ? (body.artifacts as Raw[]) : [];
    const match = artifacts.find(
      (a) => String(a.artifactId ?? a.id ?? '') === id,
    );

    if (!match) {
      return NextResponse.json({ detail: 'artifact 404' }, { status: 404 });
    }
    return NextResponse.json(match, { status: 200 });
  } catch {
    return NextResponse.json({ detail: 'Artifact service unavailable.' }, { status: 503 });
  }
}
