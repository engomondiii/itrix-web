import { NextResponse } from 'next/server';
import { getClientAccessToken } from '@/lib/server/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * POST /api/attachments — stage one upload (Backend v6.0 §7.1).
 *
 * This handler does NOT read, parse, inspect or transform the file: scanning happens
 * on the backend, in a sandbox, BEFORE extraction (Backend v6.0 §4.3). A proxy that
 * peeked inside uploads would be doing exactly the thing the sandbox exists to
 * contain. It forwards the visitor's cookies so Django can bind the attachment to
 * the session and the thread, and returns whatever Django says — including the 413
 * that carries the server size cap, which the UI turns into a specific, recoverable
 * sentence.
 *
 * ── WHY THE BODY IS BUFFERED AND NOT STREAMED (fix, 2026-08-12) ──────────────
 * THE "No file supplied." BUG. This used to pass `req.body` through with
 * `duplex: 'half'`. undici then sends the upload with
 * `Transfer-Encoding: chunked` and NO `Content-Length` — and Django's
 * `MultiPartParser` treats a missing content length as an empty body, returning an
 * empty `request.FILES`. So the file left the browser, arrived at Django, and was
 * discarded before the view ever looked at it. Every signal in between said the
 * upload had worked.
 *
 * Reading the bytes into an ArrayBuffer lets fetch set a real `Content-Length`.
 * That is NOT the same as inspecting the upload: the bytes are opaque here, the
 * multipart envelope is never parsed, and nothing is decoded or rewritten. The
 * sandbox boundary is exactly where it was.
 *
 * The cost is that a large upload is held in memory in this process for the
 * duration of one request. That is bounded by the server's own size ceiling
 * (MAX_ATTACHMENT_BYTES), which is the limit that actually decides what is
 * acceptable — and a streamed upload that is silently thrown away is worse than a
 * buffered one that arrives.
 */
export async function POST(req: Request) {
  const cookie = req.headers.get('cookie');
  const contentType = req.headers.get('content-type');
  /* CLIENT PLANE (2026-08-10): the workspace uploads through this same proxy, and
   Django authenticates the client with a Bearer JWT, not a cookie — the token is
   httpOnly on THIS host, so only the server can attach it. Absent for anonymous
   visitors, whose signed session cookie is forwarded below as before. */
  const token = await getClientAccessToken();

  try {
    /* Opaque bytes. The multipart envelope is never parsed here — see the note above. */
    const body = await req.arrayBuffer();
    if (body.byteLength === 0) {
      /* Nothing arrived from the browser. Answered here rather than forwarded, so the
         message names the real problem instead of Django's "No file supplied." for a
         request that never carried one. */
      return NextResponse.json({ detail: 'The upload was empty.' }, { status: 400 });
    }

    const res = await fetch(`${API_BASE}/attachments/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(contentType ? { 'content-type': contentType } : {}),
        ...(cookie ? { cookie } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        /* Explicit, and also set by fetch for an ArrayBuffer body. Stated because it is
           the whole point of buffering: without it Django parses an empty body. */
        'content-length': String(body.byteLength),
      },
      body,
      cache: 'no-store',
    });

    const text = await res.text();
    const payload = text ? (JSON.parse(text) as unknown) : null;
    return NextResponse.json(payload ?? { detail: 'Empty response.' }, { status: res.status });
  } catch {
    return NextResponse.json({ detail: 'Attachment service unavailable.' }, { status: 503 });
  }
}
