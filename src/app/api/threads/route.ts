import { NextResponse } from 'next/server';
import { toSubmitResult, toThreadList } from '@/lib/api/normalizeWire';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * Server-only proxy for the conversation spine (Backend v6.0 §7.1).
 *
 * Surface 1 holds no secrets and no business logic. This handler forwards the
 * visitor's cookies so Django can identify the session, and returns what Django
 * says. It does not decide what a thread contains, who owns it, or what may be
 * shown.
 *
 * It also does NOT invent a fallback thread. If the backend is unavailable the
 * failure is reported honestly and the client degrades in the UI, where the
 * visitor can see it — a proxy that silently manufactured a thread would hide a
 * real outage behind a working-looking interface.
 *
 * ── WHAT CHANGED (v6.0 wire fix) ────────────────────────────────────────────
 * It used to pass Django's body straight through. Django returns
 * `{ threadId, title, turns: [...], shell: {...} }`; the client expects
 * `SubmitResult` — `{ thread: { id, ... }, visitorTurn, ... }`.
 *
 * So `useComposer` read `result.data.thread.id` off an object with no `thread`
 * key and threw. The optimistic `thr_local_…` id was then never swapped for the
 * server id, and every call after that — shell, thread detail, turns — went out
 * with an id the backend had never issued. Hence the wall of 404s and
 * "We could not reach itriX just now."
 *
 * Normalising here fixes all of them at once, because they all had one cause.
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

    /* Errors pass through UNTOUCHED, including the 413 that carries the server
       safety cap. The composer turns that into a specific, recoverable message
       rather than a silent truncation — normalising it would destroy the
       `detail` string the visitor needs to read. */
    if (!res.ok) {
      return NextResponse.json(payload ?? { detail: 'Empty response.' }, { status: res.status });
    }

    // Also forward the Set-Cookie so the visitor session issued by Django on
    // thread creation reaches the browser. Without it the next request is a
    // different session and the thread is invisible to its own creator.
    const out = NextResponse.json(toSubmitResult(payload), { status: 201 });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) out.headers.set('set-cookie', setCookie);
    return out;
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
    /* `threadId` → `id`. The sidebar's conversation list keys on `id`, so
       without this every row rendered with an undefined key and the list came
       out empty even when the backend had threads to show. */
    return NextResponse.json({ threads: toThreadList(payload) }, { status: 200 });
  } catch {
    return NextResponse.json({ detail: 'Conversation service unavailable.' }, { status: 503 });
  }
}
