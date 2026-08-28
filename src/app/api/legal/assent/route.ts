import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Re-assent path for an already authenticated Client. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body.' }, { status: 400 });
  }

  const res = await djangoFetch<unknown>('/portal/legal/assent/', { method: 'POST', body });
  if (res.status === 401) return NextResponse.json({ detail: 'not_authenticated' }, { status: 401 });
  if (!res.ok) {
    return NextResponse.json(res.data ?? { detail: 'Assent service unavailable.' }, { status: res.status || 503 });
  }
  return NextResponse.json(res.data ?? { recorded: true }, { status: res.status });
}
