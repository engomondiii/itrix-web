import type { InviteClaimResult } from '@/types/client.types';
import type { LegalInstrumentVersion } from '@/lib/api/legalApi';

export interface InviteClaimPayload {
  email?: string;
  password?: string;
  full_name?: string;
  organization?: string;
  role?: string;
  assent?: LegalInstrumentVersion[];
}

export type InviteClaimOutcome =
  | { kind: 'ok'; data: InviteClaimResult }
  | { kind: 'legal_terms_changed' }
  | { kind: 'failed'; error: string };

/** Browser contract for the invite BFF. Keeps the legal race distinct from an invalid invite. */
export async function claimInvite(
  token: string,
  payload: InviteClaimPayload,
): Promise<InviteClaimOutcome> {
  try {
    const res = await fetch(`/api/accounts/invite/${encodeURIComponent(token)}/claim`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => null);
    if (res.status === 409 && body?.code === 'LEGAL_TERMS_CHANGED') {
      return { kind: 'legal_terms_changed' };
    }
    if (!res.ok || !body?.client) {
      return { kind: 'failed', error: `invite_claim ${res.status}` };
    }
    return { kind: 'ok', data: body as InviteClaimResult };
  } catch (error) {
    return { kind: 'failed', error: error instanceof Error ? error.message : 'invite_claim unreachable' };
  }
}
