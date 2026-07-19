import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { BackgroundGrid } from '@/components/visual/BackgroundGrid';
import { XMotif } from '@/components/visual/XMotif';
import { brand } from '@/constants/brand';
import { CTA } from '@/lib/content/ctaCopy';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border-medium bg-canvas">
      <BackgroundGrid />
      <div className="container-page relative grid items-center gap-10 py-20 md:grid-cols-[1.5fr_1fr] md:py-28">
        <div>
          <SectionLabel>{brand.positioning}</SectionLabel>
          <h1 className="mt-5 max-w-2xl text-web-h1 text-structure-900">
            Do not scale inefficient computation.
            <span className="block text-ink-primary">Make computation worth scaling first.</span>
          </h1>
          <p className="reading mt-5 text-web-lead text-ink-secondary">
            iTrix is computational AI infrastructure for sustainable AI. We diagnose how a workload is
            represented before anyone tries to run it faster — because the cheapest computation is the
            one you never needed to do.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={CTA.beginReview.href}>
              <Button variant="primary" size="lg">
                {CTA.beginReview.label}
              </Button>
            </Link>
            <Link href={CTA.exploreTechnology.href}>
              <Button variant="secondary" size="lg">
                {CTA.exploreTechnology.label}
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-caption text-ink-secondary">{CTA.beginReview.sublabel}</p>
        </div>
        <div className="hidden justify-center md:flex">
          <XMotif size={220} />
        </div>
      </div>
    </section>
  );
}
