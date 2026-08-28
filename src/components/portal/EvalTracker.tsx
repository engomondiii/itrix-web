'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { EvalStageLine } from './EvalStageLine';
import { EVALUATION_STAGE_ORDER } from '@/config/portal.config';
import { usePortalCopy } from '@/lib/i18n/portalLocale';
import type { PortalEvaluation } from '@/types/portal.types';
import { useLocaleStore } from '@/store/localeStore';

/** Evaluation tracking (§66). Stages progress requested → … → report ready. */
export function EvalTracker({ evaluation }: { evaluation: PortalEvaluation }) {
  const portalCopy = usePortalCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  const currentIndex = EVALUATION_STAGE_ORDER.indexOf(evaluation.stage);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h2 className="text-web-h2 text-structure-900">{portalCopy.evaluation.header}</h2>
        <p className="reading text-ink-secondary">{portalCopy.evaluation.intro}</p>
      </header>

      <Card variant="default" className="flex flex-col gap-4">
        <ul className="flex flex-col gap-3">
          {EVALUATION_STAGE_ORDER.map((stage, i) => (
            <EvalStageLine
              key={stage}
              stage={stage}
              state={i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming'}
            />
          ))}
        </ul>

        {evaluation.stage === 'report_ready' && evaluation.reportHref ? (
          <div className="border-t border-border-soft pt-4">
            <Link href={evaluation.reportHref}>
              <Button variant="primary" size="md">
                {portalCopy.evaluation.reportButton}
              </Button>
            </Link>
          </div>
        ) : null}
      </Card>

      <div className="rounded-md border border-border-soft bg-surface px-4 py-3">
        <SectionLabel withRule={false}>{ko ? '평가에서 측정하는 항목' : 'What an evaluation measures'}</SectionLabel>
        <p className="mt-1 text-secondary text-ink-secondary">{portalCopy.evaluation.measuresReminder}</p>
      </div>
    </div>
  );
}
