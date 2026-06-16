import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CLOSING_LINE, CTA } from '@/lib/content/ctaCopy';

export function ProductCTA({ heading }: { heading?: string }) {
  return (
    <section className="section bg-canvas">
      <div className="container-page max-w-3xl rounded-lg border border-line bg-surface p-10 text-center shadow-1">
        <h2 className="text-web-h2 text-indigo-950">{heading ?? 'Start with the workload, not a sales call.'}</h2>
        <p className="reading mx-auto mt-3 text-center">{CLOSING_LINE}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href={CTA.beginReview.href}><Button variant="primary" size="lg">{CTA.beginReview.label}</Button></Link>
          <Link href={CTA.licensing.href}><Button variant="secondary" size="lg">{CTA.licensing.label}</Button></Link>
        </div>
      </div>
    </section>
  );
}
