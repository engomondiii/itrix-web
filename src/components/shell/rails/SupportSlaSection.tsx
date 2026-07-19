'use client';

import { RailPanel, RailText, RailEmpty } from './_primitives';
import { useSuccessOverview } from '@/hooks/useSuccessOverview';

/**
 * Support access and the response time, in the rail.
 *
 * Present from the FIRST PAYMENT, not from license-out. A paid Assessment
 * customer must be able to reach support immediately, and a rail entry is how
 * that stays true on every screen rather than only on the support page.
 */
export function SupportSlaSection() {
  const { data } = useSuccessOverview();
  if (!data) return <RailEmpty />;

  const open = data.openSupport.length;

  return (
    <RailPanel title="Support">
      {data.supportSlaHours ? (
        <RailText>We respond within {data.supportSlaHours} hours.</RailText>
      ) : (
        <RailText>We respond within the agreed time.</RailText>
      )}
      <RailText>{open === 0 ? 'No open requests.' : `${open} open request${open > 1 ? 's' : ''}.`}</RailText>
      <a href="/workspace/success/support" className="text-caption text-ink-primary underline underline-offset-2">
        Ask for help
      </a>
    </RailPanel>
  );
}
