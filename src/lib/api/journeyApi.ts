/**
 * Typed client for the journey proxy (/api/journey/[token]).
 * Poll-based in Phase 1; the same GET remains the fallback when WebSockets are
 * enabled in Phase 3. Never throws — returns { data } or { error }.
 */

import type { JourneyStatePayload } from '@/types/journey.types';

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

export const journeyApi = {
  async getState(token: string): Promise<ApiResult<JourneyStatePayload>> {
    try {
      const res = await fetch(`/api/journey/${encodeURIComponent(token)}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return { data: null, error: `journey ${res.status}` };
      const data = (await res.json()) as JourneyStatePayload;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'journey unreachable' };
    }
  },
};
