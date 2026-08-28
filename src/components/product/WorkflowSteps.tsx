'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { useLocaleStore } from '@/store/localeStore';

export interface WorkflowStep {
  title: string;
  description: string;
  titleKo?: string;
  descriptionKo?: string;
}

export function WorkflowSteps({ label, labelKo, steps }: { label: string; labelKo?: string; steps: WorkflowStep[] }) {
  const locale = useLocaleStore((state) => state.locale);
  return (
    <section className="section border-b border-border-medium bg-surface">
      <div className="container-page">
        <SectionLabel>{locale === 'ko' && labelKo ? labelKo : label}</SectionLabel>
        <ol className="mt-8 flex flex-col gap-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-md border border-border-medium bg-surface p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-soft font-mono text-secondary text-ink-primary">{i + 1}</span>
              <div>
                <p className="text-card-title text-ink-primary">{locale === 'ko' && s.titleKo ? s.titleKo : s.title}</p>
                <p className="mt-1 text-secondary text-ink-secondary">{locale === 'ko' && s.descriptionKo ? s.descriptionKo : s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
