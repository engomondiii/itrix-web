export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET /api/attachments/[id]/download — the audited download.
 *
 * THREE THINGS THIS HANDLER MUST NOT DO, and each is a security property rather
 * than a style preference (Backend v6.0 §4.4):
 *
 *   1. It NEVER rewrites the body. The bytes are streamed through untouched.
 *   2. It PRESERVES Content-Disposition: attachment. An uploaded file is never
 *      rendered inline as HTML or SVG, because an inline render is script
 *      execution on our own origin.
 *   3. It PRESERVES the restrictive Content-Security-Policy the backend sets,
 *      and adds nosniff so a mislabelled type cannot be reinterpreted.
 *
 * Authorization is the backend's: it re-checks the session, the thread and the
 * quarantine state on every request, and it writes the audit record. A
 * quarantined file is refused there, not hidden here.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const cookie = req.headers.get('cookie');

  try {
    const upstream = await fetch(`${API_BASE}/attachments/${encodeURIComponent(id)}/download/`, {
      method: 'GET',
      headers: { ...(cookie ? { cookie } : {}) },
      cache: 'no-store',
    });

    if (!upstream.ok || !upstream.body) {
      return new Response(JSON.stringify({ detail: `attachment ${upstream.status}` }), {
        status: upstream.status || 502,
        headers: { 'content-type': 'application/json' },
      });
    }

    const headers = new Headers();
    const passthrough = [
      'content-type',
      'content-length',
      'content-disposition',
      'content-security-policy',
      'etag',
    ];
    for (const name of passthrough) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }

    /* Belt and braces: if the backend ever omitted these, the file still cannot
       be sniffed into an executable type or rendered inline. */
    if (!headers.has('content-disposition')) {
      headers.set('content-disposition', 'attachment');
    }
    if (!headers.has('content-security-policy')) {
      headers.set('content-security-policy', "default-src 'none'; sandbox");
    }
    headers.set('x-content-type-options', 'nosniff');
    headers.set('cache-control', 'no-store');

    return new Response(upstream.body, { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ detail: 'Attachment service unavailable.' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }
}
