import { PageWrapper } from '@/components/layout/PageWrapper';
import { LocalizedText } from '@/components/i18n/LocalizedText';
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
      eyebrow={<LocalizedText en="Use Cases" ko="사용 사례" />}
      title={<LocalizedText en="Does one of these sound like you?" ko="이 중 하나가 현재 상황과 비슷한가요?" />}
      lead={<LocalizedText en="Short, plain-language scenarios. Find the one that resembles your situation and see how itriX would examine it — no guaranteed outcomes and no automatic customer classification." ko="짧고 쉬운 시나리오입니다. 현재 상황과 비슷한 항목을 골라 itriX가 어떤 관점으로 검토하는지 확인하세요. 결과를 보장하거나 자동으로 고객으로 분류하지 않습니다." />}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((uc) => (
          <ScenarioCard key={uc.slug} useCase={uc} />
        ))}
      </div>
    </PageWrapper>
  );
}
