import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface ChatBody {
  body?: string;
}

/**
 * POST /api/review/[id]/chat — proxy to Django POST /review/sessions/{id}/chat/.
 * Runs a governed Concierge turn on the anonymous review session. Same governance
 * contract as the client-page chat: a held reply returns governance_status='pending'.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as ChatBody;
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.reviewChat(id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ body: body.body ?? '' }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: { detail: `review chat ${res.status}` } }, { status: 502 });
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
