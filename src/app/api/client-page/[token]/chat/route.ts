import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface ChatBody {
  body?: string;
  conversationId?: string | null;
}

/**
 * POST /api/client-page/[token]/chat — proxy to Django POST /client-page/{token}/chat/.
 * Django runs the governed agent turn (Diagnosis/Pitch) and returns the reply with a
 * governance_status; if held for approval it returns governance_status='pending' and
 * the UI shows the "under review" state. The frontend never fabricates a reply.
 */
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as ChatBody;
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.clientPageChat(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ body: body.body ?? '', conversation_id: body.conversationId ?? null }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: { detail: `chat ${res.status}` } }, { status: 502 });
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
