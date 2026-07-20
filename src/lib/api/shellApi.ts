/**
 * Typed client for the shell contract (/api/shell).
 *
 * REPLACES railsApi. The backend returns sidebar sections, the conversation
 * header and the composer label; it no longer returns left_rail or right_rail.
 *
 * The failure mode is deliberate: when the contract cannot be fetched, the
 * caller falls back to the BASE sections only (brand, new review, conversations,
 * explore, legal). That is the most restrictive sidebar there is. If the two
 * vocabularies ever drift, or the backend is down, the visitor sees LESS than
 * they were entitled to — never more.
 *
 * Surface 1 v5.0 §3.2 · Backend v6.0 §3.1
 */

import type { ShellContractPayload } from '@/types/shell.types';
import type { ApiResult } from '@/lib/api/threadsApi';

export const shellApi = {
  async get(threadId?: string | null): Promise<ApiResult<ShellContractPayload>> {
    const query = threadId ? `?thread=${encodeURIComponent(threadId)}` : '';
    try {
      const res = await fetch(`/api/shell${query}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return { data: null, error: `shell ${res.status}` };
      const data = (await res.json()) as ShellContractPayload;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'shell unreachable' };
    }
  },
};
