/**
 * Typed client for the rails payload.
 *
 * Rails are CONTENT the backend authorizes, never layout the frontend decides
 * (Surface 1 v4.0 §3.2). This client reads them from the journey payload, which
 * is the same GET the journey subscription already uses — one round trip, one
 * source of truth, no second endpoint to drift.
 *
 * Never throws: returns { data } or { error }.
 */

import type { JourneyStatePayload, RailsPayload } from '@/types/journey.types';

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

/** An empty payload. Both rails absent means neither mounts — the correct default. */
export const EMPTY_RAILS: RailsPayload = { left: [], right: [] };

/**
 * Normalise whatever the backend returned into a payload the UI can trust.
 *
 * A v3.0 backend returns no `rails` key at all, in which case both rails stay
 * empty and the shell renders ambient structure — exactly the Phase 1 behaviour.
 * Anything that is not an array of strings is discarded rather than coerced: a
 * malformed payload must not become a half-rendered rail.
 */
export function normalizeRails(payload: Partial<JourneyStatePayload> | null | undefined): RailsPayload {
  const rails = payload?.rails;
  if (!rails || typeof rails !== 'object') return EMPTY_RAILS;
  const clean = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.length > 0) : [];
  return { left: clean(rails.left), right: clean(rails.right) };
}

export const railsApi = {
  /**
   * Fetch the rails for a capability token.
   *
   * This deliberately reuses /api/journey/[token] rather than adding a parallel
   * endpoint: rails and state must never disagree, and the only way to guarantee
   * that is to read them from the same response.
   */
  async get(token: string): Promise<ApiResult<RailsPayload>> {
    try {
      const res = await fetch(`/api/journey/${encodeURIComponent(token)}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return { data: EMPTY_RAILS, error: `rails ${res.status}` };
      const payload = (await res.json()) as JourneyStatePayload;
      return { data: normalizeRails(payload), error: null };
    } catch (e) {
      // Fail closed: no rails rather than stale or guessed ones.
      return { data: EMPTY_RAILS, error: e instanceof Error ? e.message : 'rails unreachable' };
    }
  },
};
