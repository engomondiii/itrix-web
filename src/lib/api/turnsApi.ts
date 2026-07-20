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

export const turnsApi = {
  async submit(threadId: string, body: CreateTurnRequest): Promise<ApiResult<SubmitResult>> {
    try {
      const res = await fetch(`/api/threads/${encodeURIComponent(threadId)}/turns`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let detail: string | null = null;
        try {
          detail = ((await res.json()) as { detail?: string }).detail ?? null;
        } catch {
          detail = null;
        }
        return { data: null, error: detail ?? `turn ${res.status}` };
      }
      const data = (await res.json()) as SubmitResult;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'turn unreachable' };
    }
  },
};
