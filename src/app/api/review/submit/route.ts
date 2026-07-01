import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { buildImmediateResponse } from '@/lib/content/immediateResponses';
import type { PressureArea } from '@/types/review.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface SubmitBody {
  prompt?: string;
  selectedPressures?: PressureArea[];
  environment?: string | null;
  sessionId?: string | null;
  clientId?: string | null;
  visitorType?: string | null;
}

/**
 * Creates/continues a backend review session and records the prompt, returning the
 * session id (used by the Concierge conversation) + an on-message immediate
 * acknowledgement. Degrades gracefully: if the backend is unreachable, the session
 * id stays null and the client uses the local acknowledgement.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as SubmitBody;
  const prompt = body.prompt ?? '';
  const pressures = body.selectedPressures ?? [];
  const immediateResponse = buildImmediateResponse(prompt, pressures);

  let sessionId: string | null = body.sessionId ?? null;
  try {
    if (!sessionId) {
      const created = await fetch(`${API_BASE}${apiRoutes.reviewSession}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ client_id: body.clientId ?? null, visitor_type: body.visitorType ?? null }),
      });
      if (created.ok) {
        const data = (await created.json()) as { id?: string; session_id?: string };
        sessionId = data.id ?? data.session_id ?? null;
      }
    }
    if (sessionId) {
      await fetch(`${API_BASE}${apiRoutes.reviewPrompt(sessionId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ prompt, pressure_areas: pressures, environment: body.environment ?? null }),
      });
    }
  } catch {
    /* backend unreachable — fall through with local acknowledgement */
  }
  return NextResponse.json({ sessionId, immediateResponse });
}
