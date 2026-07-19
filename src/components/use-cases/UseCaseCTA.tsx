import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ConfidentialityNote } from '@/components/center/ConfidentialityNote';
import type { UseCase } from '@/lib/content/useCases';

/** The approach + single CTA that closes a use-case page (Playbook §70–75). */
export function UseCaseCTA({ useCase }: { useCase: UseCase }) {
  return (
    <section className="container-page py-14">
      <div className="mx-auto flex max-w-reading flex-col gap-6">
        <div className="flex flex-col gap-3">
          <SectionLabel>How itriX would approach it</SectionLabel>
          <p className="reading text-ink-primary">{useCase.approach}</p>
        </div>

        <Card variant="warm" className="flex flex-col gap-2">
          <SectionLabel withRule={false}>Where it usually starts</SectionLabel>
          <p className="text-body text-ink-primary">{useCase.startsWith}</p>
        </Card>

        <div className="flex flex-col gap-3">
          <Link href={useCase.ctaHref}>
            <Button variant="primary" size="lg">
              {useCase.ctaLabel}
            </Button>
          </Link>
          <ConfidentialityNote />
        </div>
      </div>
    </section>
  );
}
