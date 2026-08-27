import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import type { QualificationAnswers } from '@/types/qualification.types';
import { VISITOR_SESSION_COOKIE, cookieOptions, visitorBindingFromRequest } from '@/lib/server/reviewAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface QualifyBody { sessionId?: string | null; answers?: QualificationAnswers; }
type BackendQualify = Record<string, unknown> & { generation_status?: string; generationStatus?: string; };

/**
 * Qualification is authoritative on Django. The browser only needs generation readiness;
 * lead ids, score/tier, hidden route and commercial pathway stay server/internal-plane.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as QualifyBody;
  const binding = visitorBindingFromRequest(req);
  if (!body.sessionId) return NextResponse.json({ error: { detail: 'No review session.' } }, { status: 502 });
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.reviewQualify(body.sessionId)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Itrix-Session': binding.value },
      cache: 'no-store', body: JSON.stringify({ answers: body.answers ?? {} }),
    });
    if (!res.ok) return NextResponse.json({ error: { detail: `Backend qualify failed (${res.status}).` } }, { status: 502 });
    const raw = (await res.json().catch(() => ({}))) as BackendQualify;
    const rawStatus = raw.generationStatus ?? raw.generation_status;
    const generationStatus = rawStatus === 'ready' ? 'ready' : rawStatus === 'failed' ? 'failed' : 'pending';
    const out = NextResponse.json({ accepted: true, generationStatus });
    if (binding.created) out.cookies.set(VISITOR_SESSION_COOKIE, binding.value, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
    return out;
  } catch (e) {
    return NextResponse.json({ error: { detail: e instanceof Error ? e.message : 'Backend unreachable.' } }, { status: 502 });
  }
}
