import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { VISITOR_SESSION_COOKIE, cookieOptions, visitorBindingFromRequest } from '@/lib/server/reviewAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

async function forward(req: Request, id: string, method: 'GET' | 'POST') {
  const binding = visitorBindingFromRequest(req);
  const postBody = method === 'POST' ? await req.json().catch(() => ({})) : undefined;
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.reviewResultStatus(id)}`, {
      method,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-Itrix-Session': binding.value },
      body: method === 'POST' ? JSON.stringify(postBody ?? {}) : undefined,
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    const out = NextResponse.json(data, { status: res.status });
    if (binding.created) out.cookies.set(VISITOR_SESSION_COOKIE, binding.value, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
    return out;
  } catch {
    return NextResponse.json({ error: { detail: 'Review service unavailable.' } }, { status: 503 });
  }
}

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return forward(req, (await ctx.params).id, 'GET');
}
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return forward(req, (await ctx.params).id, 'POST');
}
