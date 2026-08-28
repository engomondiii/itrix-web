'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PORTAL_STAGE_LINE } from '@/config/portal.config';
import { PORTAL_STAGE_LINE_KO } from '@/lib/i18n/portalConfigLocale';
import { useLocaleStore } from '@/store/localeStore';
import type { PortalStage } from '@/types/portal.types';

export function StatusLine({ stage }: { stage: PortalStage }) {
  const locale = useLocaleStore((s) => s.locale);
  const lines = locale === 'ko' ? PORTAL_STAGE_LINE_KO : PORTAL_STAGE_LINE;
  return <div className="flex flex-col gap-1 rounded-md border border-border-soft bg-surface px-4 py-3">
    <SectionLabel withRule={false}>{locale === 'ko' ? '현재 상태' : 'Where things stand'}</SectionLabel>
    <p className="text-body text-ink-primary">{lines[stage] ?? lines.review_ready}</p>
  </div>;
}
