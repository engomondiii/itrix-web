import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/portal/success/changes — "what changed since you were last here".
 *
 * The `since` marker is forwarded rather than trusted: Django scopes the digest
 * to the authenticated customer regardless of what timestamp arrives, so a
 * tampered value can only narrow what a customer sees of their OWN history — it
 * can never widen it to someone else's.
 */
export async function GET(req: Request) {
  const since = new URL(req.url).searchParams.get('since');
  const path = since ? `/portal/success/changes/?since=${encodeURIComponent(since)}` : '/portal/success/changes/';
  const res = await djangoFetch<unknown>(path, { method: 'GET' });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) {
    return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  }
  return NextResponse.json(res.data);
}
