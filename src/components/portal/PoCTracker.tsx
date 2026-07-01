import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PoCMilestoneLine } from './PoCMilestoneLine';
import { POC_MILESTONE_ORDER } from '@/config/portal.config';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import type { PortalPoC } from '@/types/portal.types';

/** PoC milestone tracking (§67), with the agreed success criteria. */
export function PoCTracker({ poc }: { poc: PortalPoC }) {
  const currentIndex = POC_MILESTONE_ORDER.indexOf(poc.milestone);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h2 className="text-web-h2 text-indigo-950">{PORTAL_COPY.poc.header}</h2>
        <p className="reading text-ink-700">{PORTAL_COPY.poc.intro}</p>
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
          <SectionLabel withRule={false}>Success criteria</SectionLabel>
          <ul className="flex flex-col gap-1.5">
            {poc.successCriteria.map((c) => (
              <li key={c} className="flex items-start gap-2 text-secondary text-ink-700">
                <span aria-hidden className="mt-1 text-sapphire-600">•</span>
                {c}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="rounded-md border border-line-subtle bg-surface-warm px-4 py-3">
        <p className="text-secondary text-ink-700">{PORTAL_COPY.poc.successNote}</p>
      </div>
    </div>
  );
}
