'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useLocaleStore } from '@/store/localeStore';
import { qualificationUi } from '@/lib/i18n/qualificationLocale';
import type { ReviewStageId } from '@/lib/content/qualificationQuestions';

export function StageHint({ stage, eyebrow }: { stage: ReviewStageId; eyebrow?: string }) {
  const locale = useLocaleStore((s) => s.locale);
  const copy = qualificationUi(locale);
  return <div className="flex flex-col gap-1"><SectionLabel>{stage === 'stage_1' ? copy.stage1 : copy.stage2}</SectionLabel><span className="text-secondary text-ink-secondary">{stage === 'stage_1' ? copy.eyebrow1 : copy.eyebrow2 || eyebrow}</span></div>;
}
