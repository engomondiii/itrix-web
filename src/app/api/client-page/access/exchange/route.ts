import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { getClientAccessToken } from '@/lib/server/session';
import {
  REVIEW_ACCESS_COOKIE,
  REVIEW_ACCESS_MAX_AGE,
  VISITOR_SESSION_COOKIE,
  cookieOptions,
  visitorBindingFromRequest,
} from '@/lib/server/reviewAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { code?: string };
  const code = (body.code ?? '').trim();
  if (!code) return NextResponse.json({ error: { detail: 'Review access is unavailable.' } }, { status: 404 });

  const binding = visitorBindingFromRequest(req);
  const clientToken = await getClientAccessToken();
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.clientPageAccessExchange}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Itrix-Session': binding.value,
        ...(clientToken ? { Authorization: `Bearer ${clientToken}` } : {}),
      },
      body: JSON.stringify({ code }),
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ error: { detail: 'Review access is unavailable.' } }, { status: 404 });
    const data = (await res.json().catch(() => ({}))) as { sessionToken?: string };
    if (!data.sessionToken) return NextResponse.json({ error: { detail: 'Review access is unavailable.' } }, { status: 404 });

    const out = NextResponse.json({ ok: true });
    out.cookies.set(REVIEW_ACCESS_COOKIE, data.sessionToken, { ...cookieOptions, maxAge: REVIEW_ACCESS_MAX_AGE });
    if (binding.created) out.cookies.set(VISITOR_SESSION_COOKIE, binding.value, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
    return out;
  } catch {
    return NextResponse.json({ error: { detail: 'Review access is unavailable.' } }, { status: 503 });
  }
}
