import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PRODUCT_ROUTES } from '@/lib/content/productRoutes';

export function PathRecommendationSection() {
  const compute = PRODUCT_ROUTES.alpha_compute;
  const core = PRODUCT_ROUTES.alpha_core;
  return (
    <section className="section border-b border-line bg-surface-warm">
      <div className="container-page">
        <SectionLabel>Where the review can lead</SectionLabel>
        <h2 className="mt-4 max-w-2xl text-web-h2 text-indigo-950">A recommendation, not a checkout.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[compute, core].map((p) => (
            <Card key={p.route} variant="default" interactive className="flex flex-col gap-3">
              <h3 className="text-web-h3 text-indigo-950">{p.label}</h3>
              <p className="text-secondary text-ink-700">{p.blurb}</p>
              <Link href={p.href} className="mt-auto">
                <Button variant="secondary" size="sm">Explore {p.label}</Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
