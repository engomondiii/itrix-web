import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { EvalStageLine } from './EvalStageLine';
import { EVALUATION_STAGE_ORDER } from '@/config/portal.config';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import type { PortalEvaluation } from '@/types/portal.types';

/** Evaluation tracking (§66). Stages progress requested → … → report ready. */
export function EvalTracker({ evaluation }: { evaluation: PortalEvaluation }) {
  const currentIndex = EVALUATION_STAGE_ORDER.indexOf(evaluation.stage);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h2 className="text-web-h2 text-indigo-950">{PORTAL_COPY.evaluation.header}</h2>
        <p className="reading text-ink-700">{PORTAL_COPY.evaluation.intro}</p>
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
          <div className="border-t border-line-subtle pt-4">
            <Link href={evaluation.reportHref}>
              <Button variant="primary" size="md">
                {PORTAL_COPY.evaluation.reportButton}
              </Button>
            </Link>
          </div>
        ) : null}
      </Card>

      <div className="rounded-md border border-line-subtle bg-surface-warm px-4 py-3">
        <SectionLabel withRule={false}>What an evaluation measures</SectionLabel>
        <p className="mt-1 text-secondary text-ink-700">{PORTAL_COPY.evaluation.measuresReminder}</p>
      </div>
    </div>
  );
}
