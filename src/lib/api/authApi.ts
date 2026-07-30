/**
 * Typed client for the authentication proxies (Backend v7.2 §15.1).
 *
 * Never throws — returns a discriminated result rather than `{ data, error }`, because
 * the interesting outcomes here are not "data or failure" but WHICH failure, and one of
 * them (rate limiting) carries a duration the surface has to show.
 *
 * ── WHAT THIS CLIENT CAN AND CANNOT LEARN ───────────────────────────────────
 * By design, very little. It cannot tell whether an address is registered, whether an
 * invitation code exists, why a sign-in failed, or — from v8.0 — whether a registration
 * created anything. The proxies collapse those distinctions before the answer reaches
 * here, so the surface is structurally unable to leak them even if a future component
 * tried to (Architecture v2.9 §26.5, §27.6).
 */

import type { LegalInstrumentVersion } from '@/lib/api/legalApi';

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
   * three (Playbook v1.9 §18E).
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
   * unauthenticated party (Backend v7.2 §15.4).
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
   * OPEN REGISTRATION (Architecture v2.9 §27, R60).
   *
   * `assent` carries the instrument versions the visitor was shown, and the backend writes
   * the record inside the transaction that creates the Client (R62). It is sent HERE rather
   * than POSTed first because `portal/legal/assent/` authenticates on the client plane, and
   * at registration there is no client-JWT and no Client to attach a record to.
   *
   * ── `ok` MEANS ACCEPTED, NOT CREATED ────────────────────────────────────
   * The proxy collapses every non-rate-limited outcome into one response so the browser
   * cannot learn whether the address was already in use (R64). A 409 from the backend
   * arrives here as an acceptance, and that is the intended behaviour rather than a bug to
   * be fixed later: the alternative is a form that answers "is this company your customer?"
   * for anyone who can type an address.
   *
   * It 404s when the kill switch is thrown — a disabled capability should not advertise
   * itself with a 403 (Backend v7.2 §15.5).
   */
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
        method: 'POST',
        cache: 'no-store',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
      });
      if (res.status === 202 || res.ok) return { kind: 'ok' };
      if (res.status === 429) return { kind: 'rate_limited', retryAfterSeconds: retryAfterFrom(res, await readJson(res)) };
      return { kind: 'unavailable' };
    } catch {
      return { kind: 'unavailable' };
    }
  },

  /**
   * Confirm an email address.
   *
   * Reports failure honestly, like the reset confirm and for the same reason: the visitor
   * is holding a link they believe works. It does not distinguish expired from consumed
   * from unknown — one message covers all three (Playbook v1.9 §18G).
   */
  async verifyEmail(token: string): Promise<AuthOutcome> {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        cache: 'no-store',
        headers: JSON_HEADERS,
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

  /**
   * Ask for another confirmation link.
   *
   * ALWAYS resolves `ok`, like the reset request: a resend that answered differently for an
   * unknown, an unconfirmed and an already-confirmed address would be the enumeration
   * oracle the whole zone is built to avoid.
   */
  async resendVerification(email?: string): Promise<AuthOutcome> {
    try {
      const res = await fetch('/api/auth/verify-email/resend', {
        method: 'POST',
        cache: 'no-store',
        headers: JSON_HEADERS,
        body: JSON.stringify(email ? { email } : {}),
      });
      if (res.status === 429) return { kind: 'rate_limited', retryAfterSeconds: retryAfterFrom(res, await readJson(res)) };
      return { kind: 'ok' };
    } catch {
      return { kind: 'ok' };
    }
  },
};
