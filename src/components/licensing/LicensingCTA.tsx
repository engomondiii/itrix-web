import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CTA } from '@/lib/content/ctaCopy';
import { NDA_WARNINGS } from '@/lib/content/ndaWarnings';

export function LicensingCTA() {
  return (
    <section className="section bg-canvas">
      <div className="container-page max-w-3xl rounded-lg border border-border-medium bg-surface p-10 text-center shadow-1">
        <h2 className="text-web-h2 text-structure-900">Licensing starts with a conversation, not a price list.</h2>
        <p className="reading mx-auto mt-3 text-center">{NDA_WARNINGS.pricing}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href={CTA.contactTeam.href}><Button variant="primary" size="lg">{CTA.contactTeam.label}</Button></Link>
          <Link href={CTA.beginReview.href}><Button variant="secondary" size="lg">{CTA.beginReview.label}</Button></Link>
        </div>
      </div>
    </section>
  );
}
