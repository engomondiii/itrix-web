import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import type { ChatMessage, Citation, GovernanceStatus } from '@/types/chat.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface ChatBody {
  body?: string;
  conversationId?: string | null;
}

type AnyRec = Record<string, unknown>;

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function localId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeGovernance(v: unknown): GovernanceStatus {
  return v === 'pending' || v === 'approved' || v === 'blocked' || v === 'auto_approved'
    ? v
    : 'auto_approved';
}

function normalizeCitations(v: unknown): Citation[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((c) => {
      if (typeof c === 'string') return { chunkId: c } as Citation;
      const rec = (c ?? {}) as AnyRec;
      const chunkId = str(rec.chunkId) || str(rec.chunk_id);
      if (!chunkId) return null;
      return { chunkId, label: str(rec.label) || undefined } as Citation;
    })
    .filter((c): c is Citation => c !== null);
}

/**
 * Map the Django chat response into a full ``ChatMessage``.
 *
 * Django returns ``{ conversationId, reply, governanceStatus, underReview, citedChunkIds }``
 * — which is NOT a ChatMessage (no id/body/senderKind/citations). Passing it straight to
 * the UI made ``ChatThread`` read ``m.citations.length`` off ``undefined`` and crash the
 * page. This normalizes it so the fallback (non-realtime) path is always safe.
 */
function normalizeReply(raw: AnyRec, conversationId: string | null): ChatMessage {
  const governanceStatus = normalizeGovernance(raw.governanceStatus ?? raw.governance_status);
  const body = str(raw.reply) || str(raw.body);
  return {
    id: str(raw.messageId) || str(raw.id) || localId('a'),
    conversationId: str(raw.conversationId) || str(raw.conversation_id) || conversationId || '',
    senderKind: 'agent',
    agentKey: str(raw.agentKey) || 'concierge',
    body,
    citations: normalizeCitations(raw.citations ?? raw.citedChunkIds ?? raw.cited_chunk_ids),
    governanceStatus,
    streaming: false,
    createdAt: str(raw.createdAt) || new Date().toISOString(),
  };
}

/**
 * POST /api/client-page/[token]/chat — proxy to Django POST /client-page/{token}/chat/.
 * Django runs the governed agent turn and returns the reply with a governance_status;
 * if held for approval it returns underReview/governanceStatus='pending' and the UI
 * shows the "under review" state. The frontend never fabricates a reply.
 */
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as ChatBody;
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.clientPageChat(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ body: body.body ?? '', message: body.body ?? '', conversation_id: body.conversationId ?? null }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: { detail: `chat ${res.status}` } }, { status: 502 });
    }
    const raw = (await res.json().catch(() => ({}))) as AnyRec;

    // Held for human approval → tell the client to show the "under review" state.
    const governanceStatus = normalizeGovernance(raw.governanceStatus ?? raw.governance_status);
    if (raw.underReview === true || governanceStatus === 'pending' || governanceStatus === 'blocked') {
      return NextResponse.json({ governanceStatus, underReview: true });
    }

    return NextResponse.json(normalizeReply(raw, body.conversationId ?? null));
  } catch (e) {
    return NextResponse.json(
      { error: { detail: e instanceof Error ? e.message : 'Backend unreachable.' } },
      { status: 502 },
    );
  }
}
