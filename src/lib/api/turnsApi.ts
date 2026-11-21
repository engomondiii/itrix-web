import { readConversationStream, type ConversationStreamHandlers } from './readConversationStream';
import { useLocaleStore } from "@/store/localeStore";
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
  async retry(threadId: string, stream?: ConversationStreamHandlers): Promise<ApiResult<{ assistantTurn: import('@/types/thread.types').Turn | null; pending: boolean; reused: boolean }>> {
    const requestId = newConversationRequestId();
    try {
      const res = await fetch(`/api/threads/${encodeURIComponent(threadId)}/retry`, {
        method: 'POST',
        cache: 'no-store',
        headers: { Accept: 'application/json', 'X-Request-ID': requestId, ...(stream ? { 'X-Itrix-Stream': '1' } : {}) },
      });
      if (!res.ok && res.status !== 202) {
        const failure = await conversationFailureFromResponse(res, requestId);
        return { data: null, error: failure.detail, failure };
      }
      if (res.headers.get('content-type')?.includes('application/x-ndjson')) {
        const result = await readConversationStream(res, stream);
        if (result.generationStatus === 'failed') throw new Error('Response generation failed. Please try again.');
        return { data: { assistantTurn: result.itrixTurn ?? null, pending: result.generationStatus === 'pending', reused: false }, error: null, failure: null };
      }
      const data = await res.json().catch(() => null) as { assistantTurn?: import('@/types/thread.types').Turn | null; pending?: boolean; reused?: boolean } | null;
      return { data: { assistantTurn: data?.assistantTurn ?? null, pending: data?.pending === true, reused: data?.reused === true }, error: null, failure: null };
    } catch (e) {
      const failure = networkConversationFailure(requestId);
      return { data: null, error: e instanceof Error ? e.message : failure.detail, failure };
    }
  },
  async submit(threadId: string, body: CreateTurnRequest, stream?: ConversationStreamHandlers): Promise<ApiResult<SubmitResult>> {
    const requestId = newConversationRequestId();
    try {
      const res = await fetch(`/api/threads/${encodeURIComponent(threadId)}/turns`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Request-ID': requestId, ...(stream ? { 'X-Itrix-Stream': '1' } : {}) },
        body: JSON.stringify({ ...body, locale: useLocaleStore.getState().locale }),
      });
      if (!res.ok) {
        const failure = await conversationFailureFromResponse(res, requestId);
        return { data: null, error: failure.detail, failure };
      }
      const data = await readConversationStream(res, stream);
      return { data, error: null, failure: null };
    } catch (e) {
      const failure = networkConversationFailure(requestId);
      return { data: null, error: e instanceof Error ? e.message : failure.detail, failure };
    }
  },
};
