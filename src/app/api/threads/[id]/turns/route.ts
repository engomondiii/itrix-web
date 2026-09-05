import { NextResponse } from 'next/server';
import { toTurnSubmitResult } from '@/lib/api/normalizeWire';
import { djangoFetch } from '@/lib/server/proxy';
import {
  applyConversationResponseHeaders,
  conversationErrorResponse,
  conversationForwardHeaders,
  conversationRequestId,
} from '@/lib/server/conversationProxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Surface code uses camelCase; Django's serializer contract uses snake_case.
 * Keep that translation at the BFF/proxy boundary so neither side has to carry
 * two spellings of the same field. All unrelated request fields pass through.
 */
function toDjangoAttachmentPayload(body: unknown): unknown {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body;

  const record = body as Record<string, unknown>;
  if (!Array.isArray(record.attachmentIds)) return body;

  const { attachmentIds, ...rest } = record;
  return { ...rest, attachment_ids: attachmentIds };
}

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
  const requestId = conversationRequestId(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  const res = await djangoFetch<unknown>(`/threads/${encodeURIComponent(id)}/turns/`, {
    method: 'POST',
    body: toDjangoAttachmentPayload(body),
    headers: conversationForwardHeaders(req, requestId),
  });
  if (!res.ok) return conversationErrorResponse(res, requestId);
  return applyConversationResponseHeaders(
    NextResponse.json(toTurnSubmitResult(res.data, id), { status: res.status || 201 }),
    res,
    requestId,
  );
}
