import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import type { QualificationAnswers } from '@/types/qualification.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface QualifyBody {
  sessionId?: string | null;
  clientId?: string | null;
  answers?: QualificationAnswers;
}

/** Proxies qualification answers to Django for authoritative scoring. On any failure
 *  it returns a non-OK status so the client falls back to its local estimate. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as QualifyBody;
  if (!body.sessionId) {
    return NextResponse.json({ error: { detail: 'No review session — using local estimate.' } }, { status: 502 });
  }
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.reviewQualify(body.sessionId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ answers: body.answers ?? {} }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: { detail: `Backend qualify failed (${res.status}).` } }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: { detail: e instanceof Error ? e.message : 'Backend unreachable.' } },
      { status: 502 },
    );
  }
}
