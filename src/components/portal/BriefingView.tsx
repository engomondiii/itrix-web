import { BriefingSection } from './BriefingSection';
import { UpdateNotice } from './UpdateNotice';
import { routeLabel, licenseLabel } from '@/lib/formatting/formatRoute';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import type { PortalBriefing } from '@/types/portal.types';

/**
 * The living Problemology review inside the portal (§64). Mirrors the customized
 * page sections and shows a last-updated line + an update notice when it changed.
 */
export function BriefingView({ briefing }: { briefing: PortalBriefing }) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h2 className="text-web-h2 text-structure-900">{PORTAL_COPY.briefing.header}</h2>
        <p className="reading text-ink-secondary">{PORTAL_COPY.briefing.intro}</p>
        <div className="flex flex-wrap gap-x-8 gap-y-1 text-secondary text-ink-secondary">
          <span>Recommended: <strong className="text-ink-primary">{routeLabel(briefing.productRoute)}</strong></span>
          <span>Pathway: <strong className="text-ink-primary">{licenseLabel(briefing.licensePathway)}</strong></span>
        </div>
        {briefing.lastUpdated ? (
          <p className="text-caption text-ink-secondary">{PORTAL_COPY.briefing.lastUpdated(briefing.lastUpdated)}</p>
        ) : null}
      </header>

      {briefing.updatedNotice ? <UpdateNotice /> : null}

      <div className="flex flex-col gap-3">
        {briefing.sections.map((s) => (
          <BriefingSection key={s.key} section={s} />
        ))}
      </div>
    </div>
  );
}
