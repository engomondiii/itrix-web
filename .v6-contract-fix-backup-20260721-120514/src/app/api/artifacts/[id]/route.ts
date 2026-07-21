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
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const cookie = req.headers.get('cookie');

  try {
    const res = await fetch(`${API_BASE}/artifacts/${encodeURIComponent(id)}/`, {
      method: 'GET',
      headers: { Accept: 'application/json', ...(cookie ? { cookie } : {}) },
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ detail: `artifact ${res.status}` }, { status: res.status });
    return NextResponse.json((await res.json()) as unknown, { status: 200 });
  } catch {
    return NextResponse.json({ detail: 'Artifact service unavailable.' }, { status: 503 });
  }
}
