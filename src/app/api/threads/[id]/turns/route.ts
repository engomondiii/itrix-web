import { NextResponse } from 'next/server';
import { toTurnSubmitResult } from '@/lib/api/normalizeWire';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * POST /api/threads/[id]/turns — a subsequent turn in an open thread.
 *
 * Django persists the visitor's words BEFORE attempting any generation, so a
 * turn is never lost to a downstream failure. The assistant reply arrives over
 * the socket rather than in this response — the backend returns
 * `assistantTurn: null` and says so honestly rather than implying one is coming
 * down this wire.
 *
 * Normalised to `SubmitResult` so the composer can reconcile its optimistic
 * copy. See `lib/api/normalizeWire.ts`.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const cookie = req.headers.get('cookie');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/threads/${encodeURIComponent(id)}/turns/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const text = await res.text();
    const payload = text ? (JSON.parse(text) as unknown) : null;

    /* Errors pass through untouched — the 413 carries the recoverable message
       about the server safety cap, and normalising it would discard it. */
    if (!res.ok) {
      return NextResponse.json(payload ?? { detail: 'Empty response.' }, { status: res.status });
    }
    return NextResponse.json(toTurnSubmitResult(payload, id), { status: 201 });
  } catch {
    return NextResponse.json({ detail: 'Conversation service unavailable.' }, { status: 503 });
  }
}
