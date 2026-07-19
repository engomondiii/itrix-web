import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { BoundaryLine } from '@/components/visual/BoundaryLine';
import { brand } from '@/constants/brand';
import { CTA } from '@/lib/content/ctaCopy';

export function HumanFollowUpSection() {
  return (
    <section data-surface="indigo" className="ink-inverse section bg-structure-900 text-ink-inverse">
      <div className="container-page max-w-3xl text-center">
        <div className="mb-8"><BoundaryLine label="The human gate" /></div>
        <SectionLabel withRule={false} className="text-ink-inverse/80">No bots at the decision</SectionLabel>
        <h2 className="mt-4 text-web-h2 text-ink-inverse">A review is read by a person, not closed by a chatbot.</h2>
        <p className="reading mx-auto mt-4 text-center text-ink-inverse/80">
          The site can give you an immediate structural read, but every qualified conversation is picked
          up by the {brand.assessmentTeam}. Strategic and qualified leads hear back within a day or two —
          from a human who has read what you wrote.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href={CTA.beginReview.href}>
            <Button variant="primary" size="lg">
              {CTA.beginReview.label}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}