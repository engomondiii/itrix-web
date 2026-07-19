import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/portal/success/feedback — the private satisfaction pulse.
 *
 * WRITE ONLY, deliberately. There is no GET here and there should never be one:
 * a pulse goes to the customer-success owner and nowhere else, and an endpoint
 * that could read one back is an endpoint that could be made to render it to the
 * customer as a score about them (Playbook v1.5 §12I).
 *
 * The response is a receipt, not the submission.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    score?: number; freeText?: string; followUpRequested?: boolean;
  };
  const res = await djangoFetch<unknown>('/portal/success/feedback/', {
    method: 'POST',
    body: JSON.stringify({
      score: body.score,
      free_text: body.freeText ?? '',
      follow_up_requested: Boolean(body.followUpRequested),
    }),
  });
  if (res.status === 401) return NextResponse.json({ error: { detail: 'not_authenticated' } }, { status: 401 });
  if (!res.ok || res.data === null) {
    return NextResponse.json({ error: { detail: `upstream ${res.status}` } }, { status: 502 });
  }
  return NextResponse.json(res.data, { status: 201 });
}
