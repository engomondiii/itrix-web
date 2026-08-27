/**
 * Legacy customer-facing pitch deck retirement.
 * Internal routing/pitch data must not be reconstructed from the safe My Review payload.
 */
import type { ClientPage } from '@/types/client.types';
export const PITCH_VARIANTS = ['strategic_executive','technical_buyer','semiconductor_hardware','cloud_ai_infra','cae_hpc_simulation','investor_strategic','government_public','curious_public','risk_competitor'] as const;
export type PitchVariant = (typeof PITCH_VARIANTS)[number];
export function buildLocalPitchDeck(_page: ClientPage): never[] { return []; }
export function resolvePitchDeck(_page: ClientPage): never[] { return []; }
