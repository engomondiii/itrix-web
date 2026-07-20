import { NextResponse } from 'next/server';

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

  try {
    const res = await fetch(`${API_BASE}/attachments/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(contentType ? { 'content-type': contentType } : {}),
        ...(cookie ? { cookie } : {}),
      },
      body: req.body,
      /* Required by undici when streaming a request body. */
      duplex: 'half',
      cache: 'no-store',
    } as RequestInit & { duplex: 'half' });

    const text = await res.text();
    const payload = text ? (JSON.parse(text) as unknown) : null;
    return NextResponse.json(payload ?? { detail: 'Empty response.' }, { status: res.status });
  } catch {
    return NextResponse.json({ detail: 'Attachment service unavailable.' }, { status: 503 });
  }
}
