'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { useLocaleStore } from '@/store/localeStore';
import { reviewCopy } from '@/lib/i18n/reviewLocale';
import type { ClientPage } from '@/types/client.types';

export function PersonalizedHero({ page }: { page: ClientPage }) {
  const locale = useLocaleStore((s) => s.locale);
  const copy = reviewCopy(locale);
  return (
    <header className="rounded-lg border border-border-medium bg-surface p-6 shadow-1 md:p-8">
      <SectionLabel>{copy.reviewTitle}</SectionLabel>
      <h1 className="mt-3 text-web-h1 text-structure-900">{copy.whatHeard}</h1>
      <div className="mt-5 grid gap-5">
        <section>
          <h2 className="text-secondary font-semibold text-ink-primary">{copy.statedFacts}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 reading text-ink-primary">
            {(page.problemMirror?.statedFacts ?? []).map((fact, i) => <li key={`${i}-${fact.slice(0,24)}`}>{fact}</li>)}
          </ul>
        </section>
        <section><h2 className="text-secondary font-semibold text-ink-primary">{copy.affectedDecision}</h2><p className="mt-1 reading text-ink-primary">{page.problemMirror?.affectedDecision}</p></section>
        <section><h2 className="text-secondary font-semibold text-ink-primary">{copy.consequence}</h2><p className="mt-1 reading text-ink-primary">{page.problemMirror?.consequence}</p></section>
      </div>
    </header>
  );
}
