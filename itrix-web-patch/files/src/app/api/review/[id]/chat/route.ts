import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import type { ChatMessage, Citation, GovernanceStatus } from '@/types/chat.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface ChatBody {
  body?: string;
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

function normalizeReply(raw: AnyRec): ChatMessage {
  const body = str(raw.reply) || str(raw.body);
  return {
    id: str(raw.messageId) || str(raw.id) || localId('a'),
    conversationId: str(raw.conversationId) || str(raw.conversation_id) || '',
    senderKind: 'agent',
    agentKey: str(raw.agentKey) || 'concierge',
    body,
    citations: normalizeCitations(raw.citations ?? raw.citedChunkIds ?? raw.cited_chunk_ids),
    governanceStatus: normalizeGovernance(raw.governanceStatus ?? raw.governance_status),
    streaming: false,
    createdAt: str(raw.createdAt) || new Date().toISOString(),
  };
}

/**
 * POST /api/review/[id]/chat — proxy to Django POST /review/sessions/{id}/chat/.
 * Runs a governed Concierge turn on the anonymous review session. Same governance
 * contract as the client-page chat: a held reply returns underReview/pending. The reply
 * is normalized into a full ChatMessage so the UI never crashes on a missing field.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as ChatBody;
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.reviewChat(id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ body: body.body ?? '', message: body.body ?? '' }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: { detail: `review chat ${res.status}` } }, { status: 502 });
    }
    const raw = (await res.json().catch(() => ({}))) as AnyRec;

    const governanceStatus = normalizeGovernance(raw.governanceStatus ?? raw.governance_status);
    if (raw.underReview === true || governanceStatus === 'pending' || governanceStatus === 'blocked') {
      return NextResponse.json({ governanceStatus, underReview: true });
    }
    return NextResponse.json(normalizeReply(raw));
  } catch (e) {
    return NextResponse.json(
      { error: { detail: e instanceof Error ? e.message : 'Backend unreachable.' } },
      { status: 502 },
    );
  }
}
