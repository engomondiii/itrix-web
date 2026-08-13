import { NextResponse } from 'next/server';
import { getClientAccessToken } from '@/lib/server/session';
import { toAttachmentUploadResult } from '@/lib/api/normalizeWire';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * POST /api/attachments — stage one upload (Backend v6.0 §7.1).
 *
 * The multipart body is streamed straight through. This handler does NOT read,
 * parse, inspect or transform the file: scanning happens on the backend, in a
 * sandbox, BEFORE extraction (Backend v6.0 §4.3). A proxy that peeked inside
 * uploads would be doing exactly the thing the sandbox exists to contain.
 *
 * It forwards the visitor's cookies so Django can bind the attachment to the
 * session and the thread, and returns whatever Django says — including the
 * 413 that carries the server size cap, which the UI turns into a specific,
 * recoverable sentence.
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
    const res = await fetch(`${API_BASE}/attachments/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(contentType ? { 'content-type': contentType } : {}),
        ...(cookie ? { cookie } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: req.body,
      /* Required by undici when streaming a request body. */
      duplex: 'half',
      cache: 'no-store',
    } as RequestInit & { duplex: 'half' });

    const text = await res.text();
    const payload = text ? (JSON.parse(text) as unknown) : null;

    /* Errors pass through UNTOUCHED — the 413 carries the server's own size cap and the
       composer turns it into a specific, recoverable sentence. Normalising an error body
       would destroy the `detail` string the visitor needs to read. */
    if (!res.ok) {
      return NextResponse.json(payload ?? { detail: 'Empty response.' }, { status: res.status });
    }

    /* ── NORMALISE, AND FORWARD THE SESSION (2026-08-13) ────────────────────
       Django answers with the visitor-plane serializer flat — `attachmentId`,
       `sizeBytes`, `detectedType` — and `useAttachments` reads `data.attachment`. See
       `normalizeWire.ts` for what that mismatch cost.

       The Set-Cookie matters just as much. When attaching is the visitor's FIRST
       action, Django mints the visitor session on this request. Dropping it here — as
       this route did, while `/api/threads` has always forwarded it — means the turn
       that follows arrives as a DIFFERENT visitor, and the thread it creates can never
       claim the file that was just staged. */
    const out = NextResponse.json(toAttachmentUploadResult(payload), { status: 201 });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) out.headers.set('set-cookie', setCookie);
    return out;
  } catch {
    return NextResponse.json({ detail: 'Attachment service unavailable.' }, { status: 503 });
  }
}
