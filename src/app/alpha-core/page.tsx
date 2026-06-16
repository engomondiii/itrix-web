import { ProductHero } from '@/components/product/ProductHero';
import { ProductThesis } from '@/components/product/ProductThesis';
import { ProductBoundaryTable } from '@/components/product/ProductBoundaryTable';
import { TechnologyRouteCard } from '@/components/product/TechnologyRouteCard';
import { UseCaseGrid } from '@/components/product/UseCaseGrid';
import { WorkflowSteps } from '@/components/product/WorkflowSteps';
import { CommercialPathDiagram } from '@/components/product/CommercialPathDiagram';
import { ProductCTA } from '@/components/product/ProductCTA';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { PRODUCTS, TECHNOLOGIES } from '@/constants/products';
import { routes } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'ALPHA Core',
  description: PRODUCTS.alpha_core.thesis,
  path: routes.alphaCore,
});

export default function AlphaCorePage() {
  return (
    <>
      <ProductHero product={PRODUCTS.alpha_core} />
      <ProductThesis
        label="The thesis"
        statement="Core validates whether it can run."
        body="A transformation is only worth anything if it survives contact with real hardware. ALPHA Core takes the representation hypothesis from Compute and validates it through execution and proof-of-concept — against agreed baselines, on the workloads that matter."
      />
      <section className="section border-b border-line bg-canvas">
        <div className="container-page">
          <SectionLabel>The boundary</SectionLabel>
          <div className="mt-6"><ProductBoundaryTable /></div>
        </div>
      </section>
      <section className="section border-b border-line bg-surface-warm">
        <div className="container-page">
          <SectionLabel>Technology routes</SectionLabel>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <TechnologyRouteCard tech={TECHNOLOGIES.fqnm} relevance="Executes conservation-law dynamics as exact integer transfer." />
            <TechnologyRouteCard tech={TECHNOLOGIES.cre} relevance="Runs operator workloads through their real embedding." />
            <TechnologyRouteCard tech={TECHNOLOGIES.boundary_aware} relevance="Aligns the transformed form with hardware and runtime boundaries." />
          </div>
        </div>
      </section>
      <UseCaseGrid
        label="Where it fits"
        useCases={[
          { title: 'Hardware & accelerators', description: 'Embedding licensed methods into chip and accelerator runtimes.' },
          { title: 'Cloud & infrastructure', description: 'Validating transformed workloads at deployment scale.' },
          { title: 'Edge & on-device', description: 'Running conserved, quantized dynamics where resources are tight.' },
        ]}
      />
      <WorkflowSteps
        label="How validation works"
        steps={[
          { title: 'Receive the hypothesis', description: 'The transformation proposed by ALPHA Compute.' },
          { title: 'Proof-of-concept', description: 'Run it on the real workload against an agreed baseline.' },
          { title: 'Backend execution', description: 'Adapt to the target hardware and runtime boundaries.' },
          { title: 'Validated result', description: 'A confirmed, conservative outcome — or an honest no.' },
        ]}
      />
      <section className="section bg-canvas">
        <div className="container-page max-w-4xl">
          <SectionLabel>From review to license</SectionLabel>
          <div className="mt-6"><CommercialPathDiagram /></div>
        </div>
      </section>
      <ProductCTA heading="Have a hypothesis? Find out if it runs." />
    </>
  );
}
