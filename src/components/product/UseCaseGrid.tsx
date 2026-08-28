'use client';

import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useLocaleStore } from '@/store/localeStore';

export interface UseCase {
  title: string;
  description: string;
  titleKo?: string;
  descriptionKo?: string;
}

export function UseCaseGrid({ label, labelKo, useCases }: { label: string; labelKo?: string; useCases: UseCase[] }) {
  const locale = useLocaleStore((state) => state.locale);
  return (
    <section className="section border-b border-border-medium bg-canvas">
      <div className="container-page">
        <SectionLabel>{locale === 'ko' && labelKo ? labelKo : label}</SectionLabel>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u) => (
            <Card key={u.title} variant="default" className="flex flex-col gap-2">
              <span className="text-card-title text-ink-primary">{locale === 'ko' && u.titleKo ? u.titleKo : u.title}</span>
              <span className="text-caption text-ink-secondary">{locale === 'ko' && u.descriptionKo ? u.descriptionKo : u.description}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
