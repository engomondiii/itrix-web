import { SectionLabel } from '@/components/ui/SectionLabel';
import type { UseCase } from '@/lib/content/useCases';

/** The situation-mirroring hero for a single use case (Playbook §70–75). */
export function UseCaseHero({ useCase }: { useCase: UseCase }) {
  return (
    <section className="border-b border-border-medium bg-canvas">
      <div className="container-page py-16">
        <div className="mx-auto max-w-reading">
          <SectionLabel>{useCase.audience}</SectionLabel>
          <h1 className="mt-4 text-web-h1 text-structure-900">{useCase.headline}</h1>
          <p className="reading mt-5 text-web-lead text-ink-secondary">{useCase.situation}</p>
        </div>
      </div>
    </section>
  );
}
