import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * POST /api/threads/[id]/turns — append one turn to an open conversation.
 *
 * A turn NEVER creates a surface and never advances state from here. Journey
 * state has exactly one writer, `journey.advance()` on the backend; this handler
 * posts a message and returns what came back (Backend v6.0 §3.4).
 *
 * Phase 1 forwards the body only. `attachmentIds` is already accepted by the
 * request type, so Phase 2 adds attachments without changing this shape.
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
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(cookie ? { cookie } : {}) },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const text = await res.text();
    const payload = text ? (JSON.parse(text) as unknown) : null;
    return NextResponse.json(payload ?? { detail: 'Empty response.' }, { status: res.status });
  } catch {
    return NextResponse.json({ detail: 'Conversation service unavailable.' }, { status: 503 });
  }
}
