/**
 * Typed client for the authentication proxies (Backend v7.2 §15.1).
 *
 * Never throws — returns a discriminated result rather than `{ data, error }`, because
 * the interesting outcomes here are not "data or failure" but WHICH failure, and one of
 * them (rate limiting) carries a duration the surface has to show.
 */

import type { LegalInstrumentVersion } from '@/lib/api/legalApi';

export type AuthOutcome =
  | { kind: 'ok' }
  | { kind: 'rejected' }
  | { kind: 'rate_limited'; retryAfterSeconds: number }
  | { kind: 'legal_terms_changed' }
  | { kind: 'unavailable' };

export interface InviteLookupResult {
  usable: boolean;
  redeemUrl?: string;
}

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

function retryAfterFrom(res: Response, body: unknown): number {
  const header = Number.parseInt(res.headers.get('Retry-After') ?? '', 10);
  if (Number.isFinite(header) && header > 0) return header;
  const fromBody = (body as { retryAfter?: unknown } | null)?.retryAfter;
  return typeof fromBody === 'number' && fromBody > 0 ? fromBody : 60;
}

async function readJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const authApi = {
  async requestReset(email: string): Promise<AuthOutcome> {
    try {
      const res = await fetch('/api/auth/password-reset/request', {
        method: 'POST', cache: 'no-store', headers: JSON_HEADERS,
        body: JSON.stringify({ email }),
      });
      if (res.status === 429) return { kind: 'rate_limited', retryAfterSeconds: retryAfterFrom(res, await readJson(res)) };
      return { kind: 'ok' };
    } catch {
      return { kind: 'ok' };
    }
  },

  async confirmReset(token: string, password: string): Promise<AuthOutcome> {
    try {
      const res = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST', cache: 'no-store', headers: JSON_HEADERS,
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) return { kind: 'ok' };
      if (res.status === 429) return { kind: 'rate_limited', retryAfterSeconds: retryAfterFrom(res, await readJson(res)) };
      if (res.status === 400 || res.status === 404 || res.status === 410) return { kind: 'rejected' };
      return { kind: 'unavailable' };
    } catch {
      return { kind: 'unavailable' };
    }
  },

  async lookupInvite(code: string): Promise<{ outcome: AuthOutcome; result?: InviteLookupResult }> {
    try {
      const res = await fetch(`/api/auth/invite/lookup?code=${encodeURIComponent(code)}`, {
        method: 'GET', cache: 'no-store', headers: { Accept: 'application/json' },
      });
      if (res.status === 429) {
        return { outcome: { kind: 'rate_limited', retryAfterSeconds: retryAfterFrom(res, await readJson(res)) } };
      }
      if (!res.ok) return { outcome: { kind: 'rejected' } };
      const body = (await readJson(res)) as InviteLookupResult | null;
      if (!body?.usable || !body.redeemUrl) return { outcome: { kind: 'rejected' } };
      return { outcome: { kind: 'ok' }, result: body };
    } catch {
      return { outcome: { kind: 'unavailable' } };
    }
  },

  /** Open registration. Legal-version races are safe to expose because they are not account facts. */
  async register(payload: {
    email: string;
    password: string;
    fullName: string;
    organization: string;
    role?: string;
    assent: LegalInstrumentVersion[];
  }): Promise<AuthOutcome> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', cache: 'no-store', headers: JSON_HEADERS,
        body: JSON.stringify(payload),
      });
      if (res.status === 202 || res.ok) return { kind: 'ok' };
      if (res.status === 429) return { kind: 'rate_limited', retryAfterSeconds: retryAfterFrom(res, await readJson(res)) };
      if (res.status === 409) {
        const body = (await readJson(res)) as { code?: unknown } | null;
        if (body?.code === 'LEGAL_TERMS_CHANGED') return { kind: 'legal_terms_changed' };
      }
      return { kind: 'unavailable' };
    } catch {
      return { kind: 'unavailable' };
    }
  },

  async verifyEmail(token: string): Promise<AuthOutcome> {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST', cache: 'no-store', headers: JSON_HEADERS,
        body: JSON.stringify({ token }),
      });
      if (res.ok) return { kind: 'ok' };
      if (res.status === 429) return { kind: 'rate_limited', retryAfterSeconds: retryAfterFrom(res, await readJson(res)) };
      if (res.status === 400 || res.status === 404 || res.status === 410) return { kind: 'rejected' };
      return { kind: 'unavailable' };
    } catch {
      return { kind: 'unavailable' };
    }
  },

  async resendVerification(email?: string): Promise<AuthOutcome> {
    try {
      const res = await fetch('/api/auth/verify-email/resend', {
        method: 'POST', cache: 'no-store', headers: JSON_HEADERS,
        body: JSON.stringify(email ? { email } : {}),
      });
      if (res.status === 429) return { kind: 'rate_limited', retryAfterSeconds: retryAfterFrom(res, await readJson(res)) };
      return { kind: 'ok' };
    } catch {
      return { kind: 'ok' };
    }
  },
};
