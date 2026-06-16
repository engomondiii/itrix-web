import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface CaptureBody {
  leadId?: string | null;
  sessionId?: string | null;
  email?: string;
  name?: string;
  company?: string;
  source?: string;
}

/** Best-effort email capture: persists to Django when reachable, always resolves OK
 *  to the client so the visitor sees a clean confirmation. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as CaptureBody;
  try {
    await fetch(`${API_BASE}${apiRoutes.leadCaptureEmail}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({
        lead_id: body.leadId ?? null,
        session_id: body.sessionId ?? null,
        email: body.email ?? '',
        name: body.name ?? '',
        company: body.company ?? '',
        source: body.source ?? 'web',
      }),
    });
  } catch {
    /* swallow — capture is best-effort from the public surface */
  }
  return NextResponse.json({ ok: true, leadId: body.leadId ?? null });
}
