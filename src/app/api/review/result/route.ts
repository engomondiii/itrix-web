import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import type { QualificationAnswers } from '@/types/qualification.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface ResultBody {
  leadId?: string | null;
  sessionId?: string | null;
  answers?: QualificationAnswers;
}

/** Asks Django to generate the AI result, then fetches the assembled result page.
 *  On failure returns non-OK so the client builds an on-message local result. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as ResultBody;
  if (!body.leadId) {
    return NextResponse.json({ error: { detail: 'No lead id — using local result.' } }, { status: 502 });
  }
  try {
    await fetch(`${API_BASE}${apiRoutes.generateResult}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ lead_id: body.leadId, session_id: body.sessionId ?? null }),
    });
    const page = await fetch(`${API_BASE}${apiRoutes.resultPage(body.leadId)}`, { cache: 'no-store' });
    if (!page.ok) {
      return NextResponse.json({ error: { detail: `Result page failed (${page.status}).` } }, { status: 502 });
    }
    const data = await page.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: { detail: e instanceof Error ? e.message : 'Backend unreachable.' } },
      { status: 502 },
    );
  }
}
