'use client';
import { cn } from '@/lib/cn';
import { EVALUATION_STAGE_LINE } from '@/config/portal.config';
import { EVALUATION_STAGE_LINE_KO } from '@/lib/i18n/portalConfigLocale';
import { useLocaleStore } from '@/store/localeStore';
import type { EvaluationStage } from '@/types/portal.types';

export function EvalStageLine({ stage, state }: { stage: EvaluationStage; state: 'done' | 'current' | 'upcoming' }) {
  const locale = useLocaleStore((s) => s.locale);
  const lines = locale === 'ko' ? EVALUATION_STAGE_LINE_KO : EVALUATION_STAGE_LINE;
  return <li className="flex items-start gap-3">
    <span aria-hidden className={cn('mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-pill',state==='done'&&'bg-tier-1',state==='current'&&'bg-accent ring-2 ring-accent-soft/40',state==='upcoming'&&'bg-border-strong')} />
    <span className={cn('text-body', state === 'upcoming' ? 'text-ink-secondary' : 'text-ink-primary')}>{lines[stage]}</span>
  </li>;
}
