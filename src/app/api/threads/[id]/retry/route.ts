import { NextResponse } from 'next/server';
import { getClientAccessToken } from '@/lib/server/session';
import { toTurn } from '@/lib/api/normalizeWire';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

type Raw = Record<string, unknown>;

/** Retry generation for the latest persisted visitor turn; never re-submits the visitor text. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const cookie = req.headers.get('cookie');
  const token = await getClientAccessToken();
  try {
    const res = await fetch(`${API_BASE}/threads/${encodeURIComponent(id)}/retry/`, {
      method: 'POST', cache: 'no-store', headers: {
        Accept: 'application/json', ...(cookie ? { cookie } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const raw = (await res.json().catch(() => ({}))) as Raw;
    if (!res.ok && res.status !== 202) return NextResponse.json(raw, { status: res.status });
    const assistant = raw.assistantTurn ? toTurn(raw.assistantTurn, id) : null;
    return NextResponse.json({ assistantTurn: assistant, pending: raw.pending === true, reused: raw.reused === true }, { status: res.status });
  } catch { return NextResponse.json({ detail: 'Conversation service unavailable.' }, { status: 503 }); }
}
