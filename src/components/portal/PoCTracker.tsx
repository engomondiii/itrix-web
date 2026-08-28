'use client';

import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PoCMilestoneLine } from './PoCMilestoneLine';
import { POC_MILESTONE_ORDER } from '@/config/portal.config';
import { usePortalCopy } from '@/lib/i18n/portalLocale';
import type { PortalPoC } from '@/types/portal.types';
import { useLocaleStore } from '@/store/localeStore';

/** PoC milestone tracking (§67), with the agreed success criteria. */
export function PoCTracker({ poc }: { poc: PortalPoC }) {
  const portalCopy = usePortalCopy();
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  const currentIndex = POC_MILESTONE_ORDER.indexOf(poc.milestone);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h2 className="text-web-h2 text-structure-900">{portalCopy.poc.header}</h2>
        <p className="reading text-ink-secondary">{portalCopy.poc.intro}</p>
      </header>

      <Card variant="default" className="flex flex-col gap-4">
        <ul className="flex flex-col gap-3">
          {POC_MILESTONE_ORDER.map((m, i) => (
            <PoCMilestoneLine
              key={m}
              milestone={m}
              state={i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming'}
            />
          ))}
        </ul>
      </Card>

      {poc.successCriteria.length > 0 ? (
        <Card variant="warm" className="flex flex-col gap-2">
          <SectionLabel withRule={false}>{ko ? '성공 기준' : 'Success criteria'}</SectionLabel>
          <ul className="flex flex-col gap-1.5">
            {poc.successCriteria.map((c) => (
              <li key={c} className="flex items-start gap-2 text-secondary text-ink-secondary">
                <span aria-hidden className="mt-1 text-ink-primary">•</span>
                {c}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="rounded-md border border-border-soft bg-surface px-4 py-3">
        <p className="text-secondary text-ink-secondary">{portalCopy.poc.successNote}</p>
      </div>
    </div>
  );
}
