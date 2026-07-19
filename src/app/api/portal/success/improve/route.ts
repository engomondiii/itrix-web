import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/portal/success/improve — "What can we improve for you?"
 *
 * The backend decides the route: support, an outcome change, a training request,
 * or a human. The customer picks nothing. This handler forwards the message and
 * returns the receipt telling them where it went and who has it.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { message?: string };
  const res = await djangoFetch<unknown>('/portal/success/improve/', {
    method: 'POST',
    body: JSON.stringify({ message: body.message ?? '' }),
  });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) {
    return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  }
  return NextResponse.json(res.data, { status: 201 });
}
