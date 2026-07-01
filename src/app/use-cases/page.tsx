import { PageWrapper } from '@/components/layout/PageWrapper';
import { ScenarioCard } from '@/components/use-cases/ScenarioCard';
import { buildMetadata } from '@/components/seo/PageMeta';
import { USE_CASES } from '@/lib/content/useCases';

export const metadata = buildMetadata({
  title: 'Use Cases',
  description: 'Plain-language scenarios — recognise your situation and see how itriX would approach it.',
  path: '/use-cases',
});

/** Use Cases index (Playbook Part XIII). Each scenario is a calm, qualitative screen. */
export default function UseCasesPage() {
  return (
    <PageWrapper
      eyebrow="Use Cases"
      title="Does one of these sound like you?"
      lead="Short, plain-language scenarios. Find the one that mirrors your situation, and see how itriX would approach it — no numbers, no promises."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((uc) => (
          <ScenarioCard key={uc.slug} useCase={uc} />
        ))}
      </div>
    </PageWrapper>
  );
}
