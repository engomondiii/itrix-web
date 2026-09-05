import { NextResponse } from 'next/server';
import { toSubmitResult, toThreadList } from '@/lib/api/normalizeWire';
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
  const { attachmentIds, ...rest } = record;
  return {
    ...rest,
    ...(Array.isArray(attachmentIds) ? { attachment_ids: attachmentIds } : {}),
  };
}

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
/* CLIENT PLANE (2026-08-10): the workspace reaches this proxy too, and Django
   authenticates the customer with a Bearer client-JWT (httpOnly on this host) —
   attached server-side. Anonymous visitors keep the cookie path unchanged. */
function forwardHeaders(req: Request, requestId: string): Record<string, string> {
  const idempotencyKey = req.headers.get('idempotency-key');
  return conversationForwardHeaders(
    req,
    requestId,
    idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
  );
}

/** POST /api/threads — open a conversation with the visitor's first sentence. */
export async function POST(req: Request) {
  const requestId = conversationRequestId(req);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  const res = await djangoFetch<unknown>('/threads/', {
    method: 'POST',
    body: toDjangoAttachmentPayload(body),
    headers: forwardHeaders(req, requestId),
  });
  if (!res.ok) return conversationErrorResponse(res, requestId);

  const out = NextResponse.json(toSubmitResult(res.data), { status: res.status || 201 });
  if (res.setCookie) out.headers.set('set-cookie', res.setCookie);
  return applyConversationResponseHeaders(out, res, requestId);
}

/** GET /api/threads — this session's threads. Metadata only, never transcripts. */
export async function GET(req: Request) {
  const requestId = conversationRequestId(req);
  const res = await djangoFetch<unknown>('/threads/', {
    method: 'GET',
    headers: forwardHeaders(req, requestId),
  });
  if (!res.ok) return conversationErrorResponse(res, requestId);
  const out = NextResponse.json({ threads: toThreadList(res.data) }, { status: 200 });
  return applyConversationResponseHeaders(out, res, requestId);
}
