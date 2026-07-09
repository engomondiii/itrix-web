import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import type { ClientPage } from '@/types/client.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET /api/client-page/[token] — proxy to Django GET /client-page/{token}/.
 * The backend re-checks (token valid) AND (journey permits) AND (disclosure allows)
 * on every call; a bad/expired/unauthorized token yields 404 here so the page shows
 * its not-found state. No content is ever synthesized locally for this route.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.clientPage(token)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (res.status === 404 || res.status === 403 || res.status === 410) {
      return NextResponse.json({ error: { detail: 'not_found' } }, { status: 404 });
    }
    if (!res.ok) {
      return NextResponse.json({ error: { detail: `client-page ${res.status}` } }, { status: 502 });
    }
    const data = (await res.json()) as ClientPage;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: { detail: e instanceof Error ? e.message : 'Backend unreachable.' } },
      { status: 502 },
    );
  }
}
