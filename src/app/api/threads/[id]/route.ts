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
