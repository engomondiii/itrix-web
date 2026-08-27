'use client';

import { useShellContext } from '@/context/ShellContext';
import { useLocaleStore } from '@/store/localeStore';
import { reviewCopy } from '@/lib/i18n/reviewLocale';

function indexFor(stage: string | undefined, mirrorStatus: string | undefined): number {
  if (stage === 'poc' || stage === 'integration' || stage === 'licensing') return 4;
  if (stage === 'controlled_evaluation' || stage === 'formal_evaluation' || stage === 'assessment') return 3;
  if (mirrorStatus === 'confirmed' || mirrorStatus === 'skipped') return 2;
  if (mirrorStatus === 'pending' || mirrorStatus === 'refine') return 1;
  return 0;
}

export function CustomerStageIndicator() {
  const shell = useShellContext();
  const locale = useLocaleStore((s) => s.locale);
  const copy = reviewCopy(locale);
  if (shell.relationshipState !== 'customer' && shell.relationshipState !== 'strategic_customer') return null;
  const current = indexFor(shell.evaluationType || shell.engagementStage, shell.mirrorStatus);
  return (
    <section className="customer-stage" aria-label={copy.stageLabel}>
      <p className="customer-stage__label">{copy.stageLabel}</p>
      <ol>
        {copy.stages.map((label, i) => <li key={label} data-state={i < current ? 'done' : i === current ? 'current' : 'upcoming'}>{label}</li>)}
      </ol>
    </section>
  );
}
