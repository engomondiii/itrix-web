import { NextResponse } from 'next/server';
import { toTurn } from '@/lib/api/normalizeWire';
import { djangoFetch } from '@/lib/server/proxy';
import {
  applyConversationResponseHeaders,
  conversationErrorResponse,
  conversationForwardHeaders,
  conversationRequestId,
} from '@/lib/server/conversationProxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Raw = Record<string, unknown>;

/** Retry generation for the latest persisted visitor turn; never re-submits the visitor text. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const requestId = conversationRequestId(req);
  const res = await djangoFetch<Raw>(`/threads/${encodeURIComponent(id)}/retry/`, {
    method: 'POST',
    headers: conversationForwardHeaders(req, requestId),
  });
  if (!res.ok && res.status !== 202) return conversationErrorResponse(res, requestId);
  const raw = (res.data ?? {}) as Raw;
  const assistant = raw.assistantTurn ? toTurn(raw.assistantTurn, id) : null;
  const pending = raw.pending === true;
  return applyConversationResponseHeaders(
    NextResponse.json(
      {
        assistantTurn: assistant,
        pending,
        reused: raw.reused === true,
        ...(pending ? { code: 'GENERATION_ALREADY_IN_PROGRESS' } : {}),
        requestId: res.requestId ?? requestId,
      },
      { status: res.status || (pending ? 202 : 200) },
    ),
    res,
    requestId,
  );
}
