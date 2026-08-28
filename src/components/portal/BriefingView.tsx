'use client';

import { BriefingSection } from './BriefingSection';
import { UpdateNotice } from './UpdateNotice';
import { routeLabel, licenseLabel } from '@/lib/formatting/formatRoute';
import { usePortalCopy } from '@/lib/i18n/portalLocale';
import type { PortalBriefing } from '@/types/portal.types';
import { useLocaleStore } from '@/store/localeStore';

/**
 * The living Problemology review inside the portal (§64). Mirrors the customized
 * page sections and shows a last-updated line + an update notice when it changed.
 */
export function BriefingView({ briefing }: { briefing: PortalBriefing }) {
  const portalCopy = usePortalCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h2 className="text-web-h2 text-structure-900">{portalCopy.briefing.header}</h2>
        <p className="reading text-ink-secondary">{portalCopy.briefing.intro}</p>
        <div className="flex flex-wrap gap-x-8 gap-y-1 text-secondary text-ink-secondary">
          <span>{ko ? '권고:' : 'Recommended:'} <strong className="text-ink-primary">{routeLabel(briefing.productRoute)}</strong></span>
          <span>{ko ? '경로:' : 'Pathway:'} <strong className="text-ink-primary">{licenseLabel(briefing.licensePathway)}</strong></span>
        </div>
        {briefing.lastUpdated ? (
          <p className="text-caption text-ink-secondary">{portalCopy.briefing.lastUpdated(briefing.lastUpdated)}</p>
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
