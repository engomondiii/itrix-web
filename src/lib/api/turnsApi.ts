/**
 * Typed client for turn submission (/api/threads/[id]/turns).
 *
 * A turn is one contribution to an open thread. Submitting a turn NEVER
 * navigates and never creates a surface — it appends to the conversation the
 * visitor is already in (Surface 1 v5.0 §2.3, R21).
 *
 * Phase 1 posts the body only. `attachmentIds` is already in the request type so
 * Phase 2 adds attachments without changing this proxy's shape.
 */

import type { CreateTurnRequest, SubmitResult } from '@/types/thread.types';
import type { ApiResult } from '@/lib/api/threadsApi';
import {
  conversationFailureFromResponse,
  networkConversationFailure,
  newConversationRequestId,
} from '@/lib/api/conversationFailure';

export const turnsApi = {
  async retry(threadId: string): Promise<ApiResult<{ assistantTurn: import('@/types/thread.types').Turn | null; pending: boolean; reused: boolean }>> {
    const requestId = newConversationRequestId();
    try {
      const res = await fetch(`/api/threads/${encodeURIComponent(threadId)}/retry`, {
        method: 'POST',
        cache: 'no-store',
        headers: { Accept: 'application/json', 'X-Request-ID': requestId },
      });
      if (!res.ok && res.status !== 202) {
        const failure = await conversationFailureFromResponse(res, requestId);
        return { data: null, error: failure.detail, failure };
      }
      const data = await res.json().catch(() => null) as { assistantTurn?: import('@/types/thread.types').Turn | null; pending?: boolean; reused?: boolean } | null;
      return { data: { assistantTurn: data?.assistantTurn ?? null, pending: data?.pending === true, reused: data?.reused === true }, error: null, failure: null };
    } catch (e) {
      const failure = networkConversationFailure(requestId);
      return { data: null, error: e instanceof Error ? e.message : failure.detail, failure };
    }
  },
  async submit(threadId: string, body: CreateTurnRequest): Promise<ApiResult<SubmitResult>> {
    const requestId = newConversationRequestId();
    try {
      const res = await fetch(`/api/threads/${encodeURIComponent(threadId)}/turns`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Request-ID': requestId },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const failure = await conversationFailureFromResponse(res, requestId);
        return { data: null, error: failure.detail, failure };
      }
      const data = (await res.json()) as SubmitResult;
      return { data, error: null, failure: null };
    } catch (e) {
      const failure = networkConversationFailure(requestId);
      return { data: null, error: e instanceof Error ? e.message : failure.detail, failure };
    }
  },
};
