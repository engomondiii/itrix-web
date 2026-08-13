import { NextResponse } from 'next/server';
import { getClientAccessToken } from '@/lib/server/session';
import { toAttachmentUploadResult } from '@/lib/api/normalizeWire';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * POST /api/attachments — stage one upload (Backend v6.0 §7.1).
 *
 * The multipart body is normally streamed straight through. If the inbound request
 * arrives without Content-Length, this proxy buffers the raw bytes only long enough
 * to compute that length before forwarding them; it never parses, inspects or
 * transforms the file. Scanning still happens on the backend, in a sandbox, BEFORE
 * extraction (Backend v6.0 §4.3).
 *
 * It forwards the visitor's cookies so Django can bind the attachment to the
 * session and the thread, and returns whatever Django says — including the
 * 413 that carries the server size cap, which the UI turns into a specific,
 * recoverable sentence.
 */
export async function POST(req: Request) {
  const cookie = req.headers.get('cookie');
  const contentType = req.headers.get('content-type');
  const incomingContentLength = req.headers.get('content-length');
  /* CLIENT PLANE (2026-08-10): the workspace uploads through this same proxy, and
   Django authenticates the client with a Bearer JWT, not a cookie — the token is
   httpOnly on THIS host, so only the server can attach it. Absent for anonymous
   visitors, whose signed session cookie is forwarded below as before. */
  const token = await getClientAccessToken();

  try {
    if (!contentType?.toLowerCase().startsWith('multipart/form-data')) {
      return NextResponse.json({ detail: 'Expected multipart/form-data upload.' }, { status: 400 });
    }

    /* ── PRESERVE A REAL CONTENT-LENGTH FOR DJANGO MULTIPART PARSING ─────────
       The browser sends a normal multipart body to this Next route. The old proxy
       forwarded `req.body` as a stream but dropped Content-Length. Undici therefore
       sent the upstream request with `Transfer-Encoding: chunked`. Django's multipart
       parser treats a missing CONTENT_LENGTH as zero and returns an empty FILES map,
       so the backend correctly reported `No file supplied.` even though the browser
       had selected one.

       Keep the zero-copy streaming path when the inbound request includes a length.
       If an intermediary removed it (legal with HTTP/2), buffer only as a fallback so
       we can compute the exact byte count. In both cases the original multipart
       Content-Type (including its boundary) is preserved byte-for-byte. */
    let upstreamBody: BodyInit;
    let upstreamLength: string;
    let needsDuplex = false;

    if (incomingContentLength && req.body) {
      upstreamBody = req.body;
      upstreamLength = incomingContentLength;
      needsDuplex = true;
    } else {
      const bytes = await req.arrayBuffer();
      upstreamBody = bytes;
      upstreamLength = String(bytes.byteLength);
    }

    const init: RequestInit & { duplex?: 'half' } = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': contentType,
        'content-length': upstreamLength,
        ...(cookie ? { cookie } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: upstreamBody,
      cache: 'no-store',
      ...(needsDuplex ? { duplex: 'half' as const } : {}),
    };

    const res = await fetch(`${API_BASE}/attachments/`, init);

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
