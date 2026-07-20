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

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
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
  async create(body: CreateThreadRequest): Promise<ApiResult<SubmitResult>> {
    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const payload = await readJson<{ detail?: string }>(res);
        return { data: null, error: payload?.detail ?? `threads ${res.status}` };
      }
      const data = await readJson<SubmitResult>(res);
      return data ? { data, error: null } : { data: null, error: 'threads: empty response' };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'threads unreachable' };
    }
  },

  /** The current session's threads. Metadata only — never transcript text. */
  async list(): Promise<ApiResult<ThreadSummary[]>> {
    try {
      const res = await fetch('/api/threads', {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return { data: null, error: `threads ${res.status}` };
      const data = await readJson<{ threads: ThreadSummary[] }>(res);
      return { data: data?.threads ?? [], error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'threads unreachable' };
    }
  },

  /** One thread with its transcript, re-authorized server-side on every fetch. */
  async get(threadId: string): Promise<ApiResult<Thread>> {
    try {
      const res = await fetch(`/api/threads/${encodeURIComponent(threadId)}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return { data: null, error: `thread ${res.status}` };
      const data = await readJson<Thread>(res);
      return data ? { data, error: null } : { data: null, error: 'thread: empty response' };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'thread unreachable' };
    }
  },
};
