import { NextResponse } from 'next/server';
import { getClientAccessToken } from '@/lib/server/session';
import { toAttachment } from '@/lib/api/normalizeWire';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/* CLIENT PLANE (2026-08-10): the workspace reaches these proxies too, and Django
   authenticates the client with a Bearer JWT (httpOnly on this host) — attached
   here server-side. Anonymous visitors keep their cookie path unchanged. */
async function headersFor(req: Request): Promise<HeadersInit> {
  const cookie = req.headers.get('cookie');
  const token = await getClientAccessToken();
  return {
    Accept: 'application/json',
    ...(cookie ? { cookie } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** GET — status and metadata. Never the contents. */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const res = await fetch(`${API_BASE}/attachments/${encodeURIComponent(id)}/`, {
      method: 'GET',
      headers: await headersFor(req),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ detail: `attachment ${res.status}` }, { status: res.status });
    /* Same normalisation as the upload route — the poller and the uploader must agree on
       the field names, or a status read would blank the row it was meant to update. */
    return NextResponse.json(toAttachment((await res.json()) as unknown), { status: 200 });
  } catch {
    return NextResponse.json({ detail: 'Attachment service unavailable.' }, { status: 503 });
  }
}

/**
 * DELETE — visitor-initiated purge.
 *
 * The backend deletes the blob, the scan, the extraction and every derived
 * excerpt, and the purge is verifiable (Backend v6.0 §4.6, rule 4). This is not
 * a soft delete and this proxy adds no cache that could outlive it.
 */
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const res = await fetch(`${API_BASE}/attachments/${encodeURIComponent(id)}/`, {
      method: 'DELETE',
      headers: await headersFor(req),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ detail: `attachment ${res.status}` }, { status: res.status });
    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch {
    return NextResponse.json({ detail: 'Attachment service unavailable.' }, { status: 503 });
  }
}
