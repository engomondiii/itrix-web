import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET /api/shell — the shell contract (Backend v6.0 §3.1).
 *
 * REPLACES the rails proxy. It returns sidebar sections, the conversation header
 * and the composer label; `left_rail` and `right_rail` are gone.
 *
 * THE FAILURE MODE IS DELIBERATE. On any error this returns an EMPTY payload
 * rather than a permissive default. The client then falls back to the five base
 * sections — the most restrictive sidebar there is. If the backend is down or
 * the vocabularies drift, the visitor sees LESS than they were entitled to,
 * never more.
 */
export async function GET(req: Request) {
  const cookie = req.headers.get('cookie');
  const thread = new URL(req.url).searchParams.get('thread');
  const query = thread ? `?thread=${encodeURIComponent(thread)}` : '';

  try {
    const res = await fetch(`${API_BASE}/shell/${query}`, {
      method: 'GET',
      headers: { Accept: 'application/json', ...(cookie ? { cookie } : {}) },
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({}, { status: res.status });
    const payload = (await res.json()) as unknown;
    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json({}, { status: 503 });
  }
}
