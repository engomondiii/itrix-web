import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { buildImmediateResponse } from '@/lib/content/immediateResponses';
import type { PressureArea } from '@/types/review.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Resolve the backend base URL from any of the vars we might have set on Railway.
 * (Different deploys have used API_URL, NEXT_PUBLIC_API_URL, or DJANGO_API_URL.)
 * Trailing slashes are trimmed so we never build a `//` path.
 */
function resolveApiBase(): string {
  const raw =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.DJANGO_API_URL ??
    'http://localhost:8000/api/v1';
  return raw.replace(/\/+$/, '');
}

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
 * session id + an on-message immediate acknowledgement.
 *
 * HARDENED (v4.0.3): resolves the base URL from all known env vars, follows redirects,
 * parses the id defensively, and — crucially — no longer silently swallows failures. On
 * any backend problem it still returns a usable body (sessionId may be null so the client
 * shows the local acknowledgement) BUT attaches a `debug` object describing exactly what
 * happened, so a null sessionId is diagnosable from the response alone.
 */
export async function POST(req: Request) {
  const API_BASE = resolveApiBase();
  const body = (await req.json().catch(() => ({}))) as SubmitBody;
  const prompt = body.prompt ?? '';
  const pressures = body.selectedPressures ?? [];
  const immediateResponse = buildImmediateResponse(prompt, pressures);

  let sessionId: string | null = body.sessionId ?? null;
  const debug: Record<string, unknown> = { apiBase: API_BASE };

  try {
    if (!sessionId) {
      const url = `${API_BASE}${apiRoutes.reviewSession}`;
      debug.sessionUrl = url;
      const created = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        cache: 'no-store',
        redirect: 'follow',
        body: JSON.stringify({ client_id: body.clientId ?? null, visitor_type: body.visitorType ?? null }),
      });
      debug.sessionStatus = created.status;

      const text = await created.text();
      let data: { id?: string; session_id?: string } | null = null;
      try {
        data = JSON.parse(text) as { id?: string; session_id?: string };
      } catch {
        debug.sessionBodySnippet = text.slice(0, 200);
      }

      if (created.ok && data) {
        sessionId = data.id ?? data.session_id ?? null;
        if (!sessionId) debug.sessionParse = 'no id/session_id in body';
      } else if (!created.ok) {
        debug.sessionError = `backend returned ${created.status}`;
        if (!data) debug.sessionBodySnippet = text.slice(0, 200);
      }
    }

    if (sessionId) {
      const purl = `${API_BASE}${apiRoutes.reviewPrompt(sessionId)}`;
      const promptRes = await fetch(purl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        cache: 'no-store',
        redirect: 'follow',
        body: JSON.stringify({ prompt, pressure_areas: pressures, environment: body.environment ?? null }),
      });
      debug.promptStatus = promptRes.status;
    }
  } catch (e) {
    debug.exception = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  return NextResponse.json({ sessionId, immediateResponse, debug });
}
