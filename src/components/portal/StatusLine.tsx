import { SectionLabel } from '@/components/ui/SectionLabel';
import { PORTAL_STAGE_LINE } from '@/config/portal.config';
import type { PortalStage } from '@/types/portal.types';

/** The one stage-based status line shown on the workspace home (§62). */
export function StatusLine({ stage }: { stage: PortalStage }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border-soft bg-surface px-4 py-3">
      <SectionLabel withRule={false}>Where things stand</SectionLabel>
      <p className="text-body text-ink-primary">{PORTAL_STAGE_LINE[stage] ?? PORTAL_STAGE_LINE.review_ready}</p>
    </div>
  );
}
