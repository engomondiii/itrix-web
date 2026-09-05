/**
 * Typed client for the thread proxies (/api/threads*).
 *
 * Never throws — returns { data } or { error }, matching the house pattern in
 * journeyApi. Two things matter more here than in the other clients:
 *
 *   · The backend conversation spine (Backend v6.0 Phase 1) may not be deployed
 *     yet. Every call therefore reports failure honestly rather than throwing,
 *     and the caller decides whether to fall back — see `useComposer`, which
 *     keeps the visitor's sentence and says plainly that it has not been
 *     reviewed. We NEVER fabricate an itriX response to cover a gap.
 *
 *   · Nothing here derives authorization. The proxy carries the visitor session
 *     cookie; Django decides what the thread contains and what may be shown.
 *
 * Surface 1 v5.0 §2.3 · Backend v6.0 §7.1
 */

import type {
  CreateThreadRequest, SubmitResult, Thread, ThreadSummary,
} from '@/types/thread.types';
import {
  conversationFailureFromResponse,
  networkConversationFailure,
  newConversationRequestId,
} from '@/lib/api/conversationFailure';
import type { ConversationFailure } from '@/lib/api/conversationFailure';

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
  failure?: ConversationFailure | null;
}

async function readJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const threadsApi = {
  /**
   * Open a conversation with the visitor's first sentence.
   *
   * The sentence IS turn 1 (R12). There is no separate "start" step, because a
   * separate step is exactly how a surface ends up asking for it twice.
   */
  async create(body: CreateThreadRequest, idempotencyKey?: string): Promise<ApiResult<SubmitResult>> {
    const requestId = newConversationRequestId();
    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Request-ID': requestId,
          ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const failure = await conversationFailureFromResponse(res, requestId);
        return { data: null, error: failure.detail, failure };
      }
      const data = await readJson<SubmitResult>(res);
      return data
        ? { data, error: null, failure: null }
        : { data: null, error: 'threads: empty response', failure: null };
    } catch (e) {
      const failure = networkConversationFailure(requestId);
      return { data: null, error: e instanceof Error ? e.message : failure.detail, failure };
    }
  },

  /** The current session's threads. Metadata only — never transcript text. */
  async list(): Promise<ApiResult<ThreadSummary[]>> {
    const requestId = newConversationRequestId();
    try {
      const res = await fetch('/api/threads', {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json', 'X-Request-ID': requestId },
      });
      if (!res.ok) {
        const failure = await conversationFailureFromResponse(res, requestId);
        return { data: null, error: failure.detail, failure };
      }
      const data = await readJson<{ threads: ThreadSummary[] }>(res);
      return { data: data?.threads ?? [], error: null, failure: null };
    } catch (e) {
      const failure = networkConversationFailure(requestId);
      return { data: null, error: e instanceof Error ? e.message : failure.detail, failure };
    }
  },

  /** One thread with its transcript, re-authorized server-side on every fetch. */
  async get(threadId: string): Promise<ApiResult<Thread>> {
    const requestId = newConversationRequestId();
    try {
      const res = await fetch(`/api/threads/${encodeURIComponent(threadId)}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json', 'X-Request-ID': requestId },
      });
      if (!res.ok) {
        const failure = await conversationFailureFromResponse(res, requestId);
        return { data: null, error: failure.detail, failure };
      }
      const data = await readJson<Thread>(res);
      return data
        ? { data, error: null, failure: null }
        : { data: null, error: 'thread: empty response', failure: null };
    } catch (e) {
      const failure = networkConversationFailure(requestId);
      return { data: null, error: e instanceof Error ? e.message : failure.detail, failure };
    }
  },

  /**
   * Delete a thread on the SERVER, session-authorized by Django.
   *
   * This is the missing half of "delete a chat": the rail removed the row locally
   * but nothing ever told the backend, so the next list fetch merged the thread
   * straight back in — deletion appeared not to work. A `thr_local_…` id is
   * answered by the proxy with 204 without a round trip (nothing exists upstream).
   */
  async remove(threadId: string): Promise<ApiResult<null>> {
    const requestId = newConversationRequestId();
    try {
      const res = await fetch(`/api/threads/${encodeURIComponent(threadId)}`, {
        method: 'DELETE',
        cache: 'no-store',
        headers: { Accept: 'application/json', 'X-Request-ID': requestId },
      });
      if (res.ok || res.status === 204 || res.status === 404) {
        /* 404 counts as success: the thread is already gone server-side, which is
           the state the visitor asked for. */
        return { data: null, error: null, failure: null };
      }
      const failure = await conversationFailureFromResponse(res, requestId);
      return { data: null, error: failure.detail, failure };
    } catch (e) {
      const failure = networkConversationFailure(requestId);
      return { data: null, error: e instanceof Error ? e.message : failure.detail, failure };
    }
  },
};
