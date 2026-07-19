import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';
import { buildMetadata } from '@/components/seo/PageMeta';
import { routes } from '@/constants/routes';
import { brand } from '@/constants/brand';

export const metadata = buildMetadata({
  title: 'About',
  description: `${brand.legalEntity} — ${brand.positioning}.`,
  path: routes.about,
});

export default function AboutPage() {
  return (
    <PageWrapper eyebrow="About iTrix" title="Computational AI infrastructure for sustainable AI" grid
      lead={`${brand.legalEntity} exists to make computation worth scaling before anyone scales it.`}>
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
        <div className="reading">
          <p>
            The industry's default answer to a hard computation is more hardware. iTrix takes the opposite
            starting point: most cost, energy, and latency are decided long before execution, in how a
            problem is represented. Fix the representation and the work shrinks — sometimes dramatically,
            always conservatively, and always validated against a real baseline.
          </p>
          <p className="mt-4">
            That conviction runs through two products. ALPHA Compute diagnoses representation and proposes
            a transformation hypothesis. ALPHA Core validates whether that transformed form can actually run.
            Underneath sit three patented methods — AXIOM, CRE, and FQNM — and a published numerical result.
          </p>
          <p className="mt-4 font-medium text-structure-900">"{brand.thesis}"</p>
        </div>
        <Card variant="warm" className="self-start">
          <span className="text-micro font-semibold uppercase tracking-[0.06em] text-ink-secondary">The name</span>
          <ul className="mt-3 flex flex-col gap-3">
            {brand.letters.map((l) => (
              <li key={l.meaning} className="flex items-baseline gap-3">
                <span className="font-mono text-web-h3 text-ink-primary">{l.char}</span>
                <span className="text-secondary text-ink-secondary">{l.meaning}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageWrapper>
  );
}
