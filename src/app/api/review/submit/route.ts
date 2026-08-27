import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { buildImmediateResponse } from '@/lib/content/immediateResponses';
import { familyForPrompt } from '@/lib/content/examplePrompts';
import { VISITOR_SESSION_COOKIE, cookieOptions, visitorBindingFromRequest } from '@/lib/server/reviewAccess';
import type { PressureArea } from '@/types/review.types';
import type { AppLocale } from '@/store/localeStore';

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
  locale?: AppLocale;
  /**
   * The functional-family prior, when the visitor used one of the five example
   * prompts. INTERNAL routing signal only — it is never returned to the client
   * and never rendered (Architecture v2.5 §4.2, §9.4).
   */
  family?: string | null;
}

/**
 * Creates/continues a backend review session and records THE FIRST REVIEW TURN.
 *
 * v4.0 CONTRACT (Surface 1 v4.0 §2.3)
 * ---------------------------------------------------------------------------
 * The sentence the visitor typed on the approved center IS the first review
 * turn. This route persists it against the session so the review surface can
 * continue from it rather than asking again. `first_turn: true` tells the
 * backend this prompt originated at the center, so the Concierge opens by
 * mirroring rather than by prompting.
 *
 * If the visitor selected one of the five example chips we also pass the
 * functional family as a routing PRIOR. It is a hypothesis, never a conclusion,
 * and it is never echoed back to the visitor.
 *
 * Reliability rule: backend failures return a recoverable, customer-safe error. Internal
 * URLs/status diagnostics are never serialized to the browser.
 */
export async function POST(req: Request) {
  const API_BASE = resolveApiBase();
  const body = (await req.json().catch(() => ({}))) as SubmitBody;
  const binding = visitorBindingFromRequest(req);
  const bindingHeaders = { 'X-Itrix-Session': binding.value };
  const prompt = (body.prompt ?? '').trim();
  const pressures = body.selectedPressures ?? [];
  const immediateResponse = buildImmediateResponse(prompt, pressures);
  const family = familyForPrompt(prompt) ?? (body.family || null);

  if (!prompt) {
    return NextResponse.json({ error: { detail: 'Tell us what you would like to explore.' } }, { status: 400 });
  }

  let sessionId: string | null = body.sessionId ?? null;
  try {
    if (!sessionId) {
      const created = await fetch(`${API_BASE}${apiRoutes.reviewSession}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...bindingHeaders },
        cache: 'no-store',
        redirect: 'follow',
        body: JSON.stringify({
          ...(body.clientId ? { client_id: body.clientId } : {}),
          ...(body.visitorType ? { visitor_type: body.visitorType } : {}),
          locale: body.locale === 'ko' ? 'ko' : 'en',
        }),
      });
      const data = (await created.json().catch(() => ({}))) as { id?: string; session_id?: string };
      if (!created.ok) {
        return NextResponse.json({ error: { detail: 'We could not start this review just now. Your message is still here; please try again.' } }, { status: 502 });
      }
      sessionId = data.id ?? data.session_id ?? null;
      if (!sessionId) {
        return NextResponse.json({ error: { detail: 'We could not start this review just now. Your message is still here; please try again.' } }, { status: 502 });
      }
    }

    const promptRes = await fetch(`${API_BASE}${apiRoutes.reviewPrompt(sessionId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...bindingHeaders },
      cache: 'no-store',
      redirect: 'follow',
      body: JSON.stringify({
        prompt,
        pressure_areas: pressures,
        environment: body.environment ?? null,
        first_turn: true,
        ...(family ? { functional_family: family } : {}),
      }),
    });
    if (!promptRes.ok) {
      return NextResponse.json({ error: { detail: 'We could not reach itriX just now. Your message is still here; please try again.' } }, { status: 502 });
    }

    const out = NextResponse.json({ sessionId, immediateResponse });
    if (binding.created) out.cookies.set(VISITOR_SESSION_COOKIE, binding.value, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
    return out;
  } catch {
    return NextResponse.json({ error: { detail: 'We could not reach itriX just now. Your message is still here; please try again.' } }, { status: 503 });
  }
}
