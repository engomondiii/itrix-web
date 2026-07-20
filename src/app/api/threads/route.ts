import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * Thin server-only proxy for the conversation spine (Backend v6.0 §7.1).
 *
 * Surface 1 holds no secrets and no business logic. This handler forwards the
 * visitor's cookies so Django can identify the session, and returns whatever
 * Django says. It does not decide what a thread contains, who owns it, or what
 * may be shown.
 *
 * It also does NOT invent a fallback thread. If the backend is unavailable the
 * failure is reported honestly and the client degrades in the UI, where the
 * visitor can see it — a proxy that silently manufactures a thread would hide a
 * real outage behind a working-looking interface.
 */
function forwardHeaders(req: Request): HeadersInit {
  const cookie = req.headers.get('cookie');
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(cookie ? { cookie } : {}),
  };
}

/** POST /api/threads — open a conversation with the visitor's first sentence. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/threads/`, {
      method: 'POST',
      headers: forwardHeaders(req),
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const text = await res.text();
    const payload = text ? (JSON.parse(text) as unknown) : null;

    /* Pass the backend's own status through, including the 413 that carries the
       server safety cap. The composer turns that into a specific, recoverable
       message rather than a silent truncation. */
    return NextResponse.json(payload ?? { detail: 'Empty response.' }, { status: res.status });
  } catch {
    return NextResponse.json({ detail: 'Conversation service unavailable.' }, { status: 503 });
  }
}

/** GET /api/threads — this session's threads. Metadata only, never transcripts. */
export async function GET(req: Request) {
  try {
    const res = await fetch(`${API_BASE}/threads/`, {
      method: 'GET',
      headers: forwardHeaders(req),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ threads: [] }, { status: res.status });
    const payload = (await res.json()) as unknown;
    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json({ detail: 'Conversation service unavailable.' }, { status: 503 });
  }
}
