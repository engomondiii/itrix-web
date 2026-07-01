/**
 * Capability-token read helpers (client-side, NON-authoritative).
 *
 * A capability token is `base64url(payload).base64url(hmac)` (Architecture App. B).
 * The frontend can read the payload to render the right shell and to know the
 * token TYPE, but it NEVER trusts it: the backend re-checks signature + expiry +
 * journey + disclosure on every fetch. This helper only decodes; it does not verify.
 */

import type { RevealSurface, JourneyState } from '@/types/journey.types';

export interface CapabilityTokenPayload {
  sub: string; // lead_id | client_id
  typ: Extract<RevealSurface, 'client_page' | 'account_invite' | 'portal'>;
  state: JourneyState;
  exp: number; // unix seconds
  nonce: string;
  single_use?: boolean;
}

function base64UrlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  if (typeof atob === 'function') return atob(b64);
  // Node / server runtime
  return Buffer.from(b64, 'base64').toString('binary');
}

/** Decode (never verify) the payload half of a capability token. Returns null if malformed. */
export function readCapabilityToken(token: string): CapabilityTokenPayload | null {
  try {
    const [payloadPart] = token.split('.');
    if (!payloadPart) return null;
    const json = decodeURIComponent(
      Array.prototype.map
        .call(base64UrlDecode(payloadPart), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    const parsed = JSON.parse(json) as CapabilityTokenPayload;
    if (!parsed || typeof parsed.sub !== 'string' || typeof parsed.typ !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Best-effort local expiry check (backend is authoritative). */
export function isLikelyExpired(payload: CapabilityTokenPayload | null): boolean {
  if (!payload || typeof payload.exp !== 'number') return false;
  return payload.exp * 1000 < Date.now();
}
