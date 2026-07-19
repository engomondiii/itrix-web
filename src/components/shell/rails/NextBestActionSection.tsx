'use client';

import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel, RailStrong, RailText, RailEmpty } from './_primitives';

/**
 * ONE next step. Never a list of offers.
 *
 * The customer-first guardrail lives on the backend (Architecture v2.5 §18.7):
 * this component renders whatever action was ranked primary and never re-orders
 * it. If the backend suppressed a commercial action, what arrives here is the
 * support or outcome action — and that is exactly what should be shown.
 */
export function NextBestActionSection({
  label,
  detail,
  href,
}: RailSectionRenderProps & {
  label?: string;
  detail?: string;
  href?: string;
}) {
  if (!label) return <RailEmpty />;
  return (
    <RailPanel title="Next step">
      <RailStrong>{label}</RailStrong>
      {detail ? <RailText>{detail}</RailText> : null}
      {href ? (
        <a href={href} className="text-caption text-ink-primary underline underline-offset-2">
          Continue
        </a>
      ) : null}
    </RailPanel>
  );
}
