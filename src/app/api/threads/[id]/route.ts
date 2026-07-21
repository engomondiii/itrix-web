import { NextResponse } from 'next/server';
import { toThread } from '@/lib/api/normalizeWire';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET / PATCH / DELETE /api/threads/[id] — one thread.
 *
 * Django re-authorises on EVERY call: the thread is fetched by the owning
 * session, so a guessed id returns 404 rather than 403. A 403 would confirm the
 * thread exists; 404 tells an attacker nothing (Architecture v2.6 §11.9).
 *
 * Responses are normalised — `threadId` → `id`, `at` → `createdAt`,
 * `senderKind` → `role` — so the transcript renders. See
 * `lib/api/normalizeWire.ts` for the full mapping and why it exists.
 */
/**
 * A `thr_local_…` id is the composer's OPTIMISTIC id, minted so the visitor's
 * sentence renders instantly, before any network call. The backend has never
 * seen it and never will — it is swapped for the server id the moment
 * `POST /threads/` answers.
 *
 * Between those two moments, hooks keyed on the active thread fire with the
 * local id. Forwarding those to Django produced the 404 pairs in the console:
 * harmless, transient, and indistinguishable at a glance from a real failure —
 * which is the actual cost. A console that cries wolf during normal operation
 * trains you to ignore it.
 *
 * So a local id is answered HERE, without a round trip. It is not an error
 * condition; it is a request about a thread that does not exist yet.
 */
function isLocalId(id: string): boolean {
  return id.startsWith('thr_local_');
}

function headers(req: Request): HeadersInit {
  const cookie = req.headers.get('cookie');
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(cookie ? { cookie } : {}),
  };
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  /* An optimistic thread has no server record yet. Return an EMPTY THREAD
     rather than a 404: the transcript store already holds the visitor's turn,
     and a 404 would make the client discard what is on screen. */
  if (isLocalId(id)) {
    return NextResponse.json(
      { id, title: '', createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(), turns: [] },
      { status: 200 },
    );
  }

  try {
    const res = await fetch(`${API_BASE}/threads/${encodeURIComponent(id)}/`, {
      method: 'GET',
      headers: headers(req),
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json({ detail: `thread ${res.status}` }, { status: res.status });
    }
    return NextResponse.json(toThread(await res.json()), { status: 200 });
  } catch {
    return NextResponse.json({ detail: 'Conversation service unavailable.' }, { status: 503 });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  // Renaming a thread the backend has not issued is a no-op, not an error.
  if (isLocalId(id)) return NextResponse.json({}, { status: 200 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }
  try {
    const res = await fetch(`${API_BASE}/threads/${encodeURIComponent(id)}/`, {
      method: 'PATCH',
      headers: headers(req),
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const text = await res.text();
    const payload = text ? (JSON.parse(text) as unknown) : null;
    return NextResponse.json(payload ?? {}, { status: res.status });
  } catch {
    return NextResponse.json({ detail: 'Conversation service unavailable.' }, { status: 503 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  // Nothing server-side to delete; the client drops its local copy.
  if (isLocalId(id)) return new NextResponse(null, { status: 204 });
  try {
    const res = await fetch(`${API_BASE}/threads/${encodeURIComponent(id)}/`, {
      method: 'DELETE',
      headers: headers(req),
      cache: 'no-store',
    });
    return new NextResponse(null, { status: res.status === 204 ? 204 : res.status });
  } catch {
    return NextResponse.json({ detail: 'Conversation service unavailable.' }, { status: 503 });
  }
}
