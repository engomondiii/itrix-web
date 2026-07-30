/**
 * Typed client for the authentication proxies (Backend v7.1 §15.1).
 *
 * Never throws — returns a discriminated result rather than `{ data, error }`, because
 * the interesting outcomes here are not "data or failure" but WHICH failure, and one of
 * them (rate limiting) carries a duration the surface has to show.
 *
 * ── WHAT THIS CLIENT CAN AND CANNOT LEARN ───────────────────────────────────
 * By design, very little. It cannot tell whether an address is registered, whether an
 * invitation code exists, or why a sign-in failed. The proxies collapse those
 * distinctions before the answer reaches here, so the surface is structurally unable
 * to leak them even if a future component tried to (Architecture v2.8 §26.5).
 */

export type AuthOutcome =
  | { kind: 'ok' }
  | { kind: 'rejected' }
  | { kind: 'rate_limited'; retryAfterSeconds: number }
  | { kind: 'unavailable' };

export interface InviteLookupResult {
  usable: boolean;
  /** Where to send the visitor when the code is usable. Nothing else is returned. */
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
  /**
   * Request a reset link.
   *
   * ALWAYS resolves `ok` when the request reached the proxy, whatever the backend said
   * about the address. The proxy is deliberately incapable of reporting otherwise —
   * see app/api/auth/password-reset/request/route.ts.
   */
  async requestReset(email: string): Promise<AuthOutcome> {
    try {
      const res = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        cache: 'no-store',
        headers: JSON_HEADERS,
        body: JSON.stringify({ email }),
      });
      if (res.status === 429) return { kind: 'rate_limited', retryAfterSeconds: retryAfterFrom(res, await readJson(res)) };
      /* Anything else, including a backend failure, is reported as accepted. A visitor
         must not be able to tell a missing account from a broken service, because one
         of those answers is a fact about the account. */
      return { kind: 'ok' };
    } catch {
      return { kind: 'ok' };
    }
  },

  /**
   * Redeem a reset token.
   *
   * Unlike the request, this one reports failure honestly: the visitor is holding a
   * link they believe works, and telling them nothing would leave them stuck. It still
   * does not distinguish expired from consumed from unknown — one message covers all
   * three (Playbook v1.8 §18E).
   */
  async confirmReset(token: string, password: string): Promise<AuthOutcome> {
    try {
      const res = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        cache: 'no-store',
        headers: JSON_HEADERS,
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

  /**
   * Check an invitation code.
   *
   * Returns usable-or-not and, when usable, where to go. It returns no Lead, no
   * organisation, no persona and no email — everything it returns is a disclosure to an
   * unauthenticated party (Backend v7.1 §15.4).
   */
  async lookupInvite(code: string): Promise<{ outcome: AuthOutcome; result?: InviteLookupResult }> {
    try {
      const res = await fetch(`/api/auth/invite/lookup?code=${encodeURIComponent(code)}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
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

  /**
   * Open registration. 404s unless the backend has it enabled — a disabled feature
   * should not advertise itself with a 403 (Backend v7.1 §15.5).
   */
  async register(payload: {
    email: string;
    password: string;
    fullName: string;
    organization: string;
    role?: string;
  }): Promise<AuthOutcome> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        cache: 'no-store',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
      });
      if (res.ok) return { kind: 'ok' };
      if (res.status === 429) return { kind: 'rate_limited', retryAfterSeconds: retryAfterFrom(res, await readJson(res)) };
      if (res.status === 400 || res.status === 409) return { kind: 'rejected' };
      return { kind: 'unavailable' };
    } catch {
      return { kind: 'unavailable' };
    }
  },
};
