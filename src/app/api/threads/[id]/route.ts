import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET /api/threads/[id] — one thread and its transcript.
 *
 * EVERY FETCH IS RE-AUTHORIZED SERVER-SIDE. Django re-checks the session, the
 * journey state and the disclosure ceiling on every call; URL obscurity is never
 * authorization (Architecture v2.6 §11.9). This handler adds nothing to that and
 * takes nothing away — it forwards the cookie and returns the answer.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const cookie = req.headers.get('cookie');

  try {
    const res = await fetch(`${API_BASE}/threads/${encodeURIComponent(id)}/`, {
      method: 'GET',
      headers: { Accept: 'application/json', ...(cookie ? { cookie } : {}) },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json({ detail: `thread ${res.status}` }, { status: res.status });
    }
    const payload = (await res.json()) as unknown;
    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json({ detail: 'Conversation service unavailable.' }, { status: 503 });
  }
}
