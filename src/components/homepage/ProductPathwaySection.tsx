import Link from 'next/link';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { PRODUCTS } from '@/constants/products';
import { routes } from '@/constants/routes';

const LINKS = { alpha_compute: routes.alphaCompute, alpha_core: routes.alphaCore } as const;

export function ProductPathwaySection() {
  return (
    <section className="section border-b border-border-medium bg-canvas">
      <div className="container-page">
        <SectionLabel>Two layers, one boundary</SectionLabel>
        <h2 className="mt-4 max-w-2xl text-web-h2 text-structure-900">
          ALPHA Compute defines the hypothesis. ALPHA Core validates whether it can run.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {(['alpha_compute', 'alpha_core'] as const).map((key) => {
            const p = PRODUCTS[key];
            return (
              <Card key={key} variant="default" interactive className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-web-h3 text-structure-900">{p.name}</h3>
                  <Tag>{p.layer}</Tag>
                </div>
                <p className="text-secondary text-ink-secondary">{p.thesis}</p>
                <p className="text-caption text-ink-secondary">For {p.buyer}.</p>
                <div className="mt-2">
                  <Link href={LINKS[key]}>
                    <Button variant="secondary" size="sm">
                      Explore {p.name}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
