import { SectionLabel } from '@/components/ui/SectionLabel';
import { stageLabel } from '@/lib/content/qualificationQuestions';
import type { ReviewStageId } from '@/lib/content/qualificationQuestions';

/**
 * A calm progress hint for the two-stage flow (e.g. "Step 1 of 2"). It never shows
 * a score, a tier, or a numbered questionnaire — just gentle orientation.
 */
export function StageHint({ stage, eyebrow }: { stage: ReviewStageId; eyebrow?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <SectionLabel>{stageLabel(stage)}</SectionLabel>
      {eyebrow ? <span className="text-secondary text-ink-500">{eyebrow}</span> : null}
    </div>
  );
}
