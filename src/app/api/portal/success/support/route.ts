import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/portal/success/support — the customer's own requests and their SLA. */
export async function GET() {
  const res = await djangoFetch<unknown>('/portal/success/support/', { method: 'GET' });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) {
    return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  }
  return NextResponse.json(res.data);
}

/**
 * POST /api/portal/success/support — open a request.
 *
 * Only the three fields a customer can legitimately set are forwarded. Owner,
 * SLA and status are assigned by the backend support router; accepting them from
 * the client would let a customer set their own priority, which is how an SLA
 * stops meaning anything.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    subject?: string; body?: string; urgency?: string;
  };
  const res = await djangoFetch<unknown>('/portal/success/support/', {
    method: 'POST',
    body: JSON.stringify({
      subject: body.subject ?? '',
      body: body.body ?? '',
      urgency: body.urgency ?? 'normal',
    }),
  });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) {
    return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  }
  return NextResponse.json(res.data, { status: 201 });
}
