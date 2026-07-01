'use client';

import { useMemo } from 'react';
import { readCapabilityToken, isLikelyExpired } from '@/lib/journey/capabilityToken';
import type { CapabilityTokenPayload } from '@/lib/journey/capabilityToken';

interface UseCapabilityTokenResult {
  token: string;
  payload: CapabilityTokenPayload | null;
  /** Well-formed locally (NOT verified — the backend is authoritative). */
  wellFormed: boolean;
  likelyExpired: boolean;
  subjectId: string | null;
  type: CapabilityTokenPayload['typ'] | null;
}

/**
 * Read (never verify) a /c/[token] capability token. Lets the shell decide which
 * skeleton to render and whether to show an expired notice while the real check
 * happens server-side on the client-page fetch.
 */
export function useCapabilityToken(token: string): UseCapabilityTokenResult {
  return useMemo(() => {
    const payload = readCapabilityToken(token);
    return {
      token,
      payload,
      wellFormed: payload !== null,
      likelyExpired: isLikelyExpired(payload),
      subjectId: payload?.sub ?? null,
      type: payload?.typ ?? null,
    };
  }, [token]);
}
