/**
 * Typed client for the legal instruments and the assent record (Backend v7.0 §7.1–7.2).
 *
 * Never throws — returns { data } or { error }, matching the house pattern.
 *
 * ── WHAT ASSENT IS, AND WHY IT IS RECORDED THIS WAY ─────────────────────────
 * The record stores INSTRUMENT VERSIONS, not a boolean (Architecture v2.7 §19.10). That
 * is the whole point: it must always be answerable what a given customer actually agreed
 * to, and a boolean cannot answer that after the Terms change.
 *
 * So `record()` sends the versions that were ON SCREEN when the visitor ticked the box —
 * read from lib/content/legalCopy.ts, which is what rendered them. It does not ask the
 * backend what the current versions are and send those back: that would record what we
 * happened to be serving at the moment of the POST rather than what the person read.
 */

import type { ApiResult } from '@/lib/api/threadsApi';

export interface LegalInstrumentVersion {
  slug: string;
  version: string;
  effective: string;
}

export interface AssentPayload {
  /** The invite token, so the backend can attach the record to the Client it creates. */
  token?: string;
  /** The versions the visitor actually saw. */
  instruments: LegalInstrumentVersion[];
  /** ISO timestamp taken on the client, for the audit trail alongside the server's. */
  acceptedAt: string;
}

export interface AssentReceipt {
  recorded: boolean;
  acceptedAt?: string;
  instruments?: LegalInstrumentVersion[];
}

async function readJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const legalApi = {
  /**
   * The versions the backend believes are current.
   *
   * Used ONLY to warn in development when they differ from what this build renders. It
   * is never used to decide what to show: the page renders the instruments it ships, and
   * a mismatch means the two need reconciling by a human, not silently papering over.
   */
  async instruments(): Promise<ApiResult<{ instruments: LegalInstrumentVersion[] }>> {
    try {
      const res = await fetch('/api/legal/instruments', {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return { data: null, error: `legal ${res.status}` };
      const data = await readJson<{ instruments: LegalInstrumentVersion[] }>(res);
      return { data: data ?? { instruments: [] }, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'legal unreachable' };
    }
  },

  /** Record affirmative assent. Called at workspace creation and nowhere else. */
  async record(payload: AssentPayload): Promise<ApiResult<AssentReceipt>> {
    try {
      const res = await fetch('/api/legal/assent', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await readJson<{ detail?: string }>(res);
        return { data: null, error: body?.detail ?? `assent ${res.status}` };
      }
      const data = await readJson<AssentReceipt>(res);
      return { data: data ?? { recorded: true }, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'assent unreachable' };
    }
  },
};
