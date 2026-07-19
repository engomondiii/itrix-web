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
  title: 'ALPHA Compute',
  description: PRODUCTS.alpha_compute.thesis,
  path: routes.alphaCompute,
});

export default function AlphaComputePage() {
  return (
    <>
      <ProductHero product={PRODUCTS.alpha_compute} />
      <ProductThesis
        label="The thesis"
        statement="Compute defines the representation hypothesis."
        body="Before any hardware question, ALPHA Compute asks what form the computation should take. It reads the algebraic and structural shape of a workload and proposes a transformation — a hypothesis about a representation that does less work for the same answer."
      />
      <section className="section border-b border-border-medium bg-canvas">
        <div className="container-page">
          <SectionLabel>The boundary</SectionLabel>
          <div className="mt-6"><ProductBoundaryTable /></div>
        </div>
      </section>
      <section className="section border-b border-border-medium bg-surface">
        <div className="container-page">
          <SectionLabel>Technology routes</SectionLabel>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <TechnologyRouteCard tech={TECHNOLOGIES.axiom} relevance="Primary: frames the workload as algebraic state with preserved hidden structure." />
            <TechnologyRouteCard tech={TECHNOLOGIES.cre} relevance="For complex and tensor operator structure that embeds into real arithmetic." />
            <TechnologyRouteCard tech={TECHNOLOGIES.fqnm} relevance="For conservation-law structure that suits exact integer transfer." />
          </div>
        </div>
      </section>
      <UseCaseGrid
        label="Where it fits"
        useCases={[
          { title: 'Numerical computing', description: 'MATLAB / Julia / SciPy workloads where dense or complex algebra dominates cost.' },
          { title: 'Simulation', description: 'CAE and Simulink/Modelica models with heavy operator or transport structure.' },
          { title: 'AI infrastructure', description: 'Training and inference primitives where representation, not just hardware, sets the cost.' },
        ]}
      />
      <WorkflowSteps
        label="How an engagement starts"
        steps={[
          { title: 'Structural review', description: 'Describe the workload; receive a representation-level read.' },
          { title: 'Diagnosis', description: 'Where the cost actually sits, and which method route applies.' },
          { title: 'Transformation hypothesis', description: 'A concrete proposal for a representation that does less work.' },
          { title: 'Handoff to ALPHA Core', description: 'The hypothesis goes to Core to validate whether it can run.' },
        ]}
      />
      <section className="section bg-canvas">
        <div className="container-page max-w-4xl">
          <SectionLabel>From review to license</SectionLabel>
          <div className="mt-6"><CommercialPathDiagram /></div>
        </div>
      </section>
      <ProductCTA heading="Bring a workload. Get a structural read." />
    </>
  );
}
