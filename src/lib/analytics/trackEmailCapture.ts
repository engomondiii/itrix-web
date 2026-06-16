import { trackEvent } from './trackEvent';
import type { LeadTier } from '@/types/lead.types';

export function trackEmailCapture(input: { location: string; tier?: LeadTier | null; leadId?: string | null }): void {
  trackEvent('email_capture', { location: input.location, tier: input.tier ?? null, lead_id: input.leadId ?? null });
}
