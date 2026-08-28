import { LocalizedText } from '@/components/i18n/LocalizedText';
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

export const metadata = buildMetadata({ title: 'ALPHA Core', description: PRODUCTS.alpha_core.thesis, path: routes.alphaCore });

export default function AlphaCorePage() {
  return (
    <>
      <ProductHero product={PRODUCTS.alpha_core} />
      <ProductThesis
        label={<LocalizedText en="The thesis" ko="핵심 명제" />}
        statement={<LocalizedText en="Core validates whether the reconstructed form can run." ko="Core는 재구성된 형태가 실제로 실행될 수 있는지 검증합니다." />}
        body={<LocalizedText en="ALPHA Core is an execution-validation layer used when a previously established ALPHA Compute representation hypothesis warrants deeper testing. It does not create the representation hypothesis and it is not the default destination. A PoC is a separate stage that requires its own explicit selection." ko="ALPHA Core는 이미 수립된 ALPHA Compute 표현 가설이 더 깊은 시험을 정당화할 때 사용하는 실행 검증 계층입니다. 표현 가설을 만드는 계층도, 기본 목적지도 아닙니다. PoC는 별도의 명시적 선택이 필요한 독립 단계입니다." />}
      />
      <section className="section border-b border-border-medium bg-canvas"><div className="container-page"><SectionLabel><LocalizedText en="The boundary" ko="제품 경계" /></SectionLabel><div className="mt-6"><ProductBoundaryTable /></div></div></section>
      <section className="section border-b border-border-medium bg-surface"><div className="container-page"><SectionLabel><LocalizedText en="Potential execution routes" ko="가능한 실행 경로" /></SectionLabel><div className="mt-6 grid gap-4 md:grid-cols-3">
        <TechnologyRouteCard tech={TECHNOLOGIES.fqnm} relevance="Only where the validated workload falls within FQNM's supported conservative-dynamics domain." relevanceKo="검증된 워크로드가 FQNM의 지원되는 보존형 동역학 범위에 속할 때만 고려합니다." />
        <TechnologyRouteCard tech={TECHNOLOGIES.cre} relevance="Only where an eligible structured real embedding has first been established." relevanceKo="적합한 구조화 실수 임베딩이 먼저 성립한 경우에만 고려합니다." />
        <TechnologyRouteCard tech={TECHNOLOGIES.boundary_aware} relevance="A cross-cutting execution principle for aligning a validated form with runtime and hardware boundaries." relevanceKo="검증된 형태를 런타임 및 하드웨어 경계와 정렬하기 위한 횡단 실행 원칙입니다." />
      </div></div></section>
      <UseCaseGrid label="Where deeper execution validation may fit" labelKo="더 깊은 실행 검증을 고려할 수 있는 영역" useCases={[
        { title:'Hardware & accelerators', titleKo:'하드웨어 및 가속기', description:'Testing a validated computational form against a specific target execution environment.', descriptionKo:'검증된 계산 형태를 특정 목표 실행 환경에서 시험합니다.' },
        { title:'Cloud & infrastructure', titleKo:'클라우드 및 인프라', description:'Measuring whether a validated representation survives deployment-scale constraints.', descriptionKo:'검증된 표현이 배포 규모 제약에서도 유지되는지 측정합니다.' },
        { title:'Edge & on-device', titleKo:'엣지 및 온디바이스', description:'Evaluating validated forms under constrained memory, power, latency or thermal envelopes.', descriptionKo:'메모리, 전력, 지연 또는 열 제약 아래에서 검증된 형태를 평가합니다.' },
      ]} />
      <WorkflowSteps label="How execution validation works" labelKo="실행 검증 방식" steps={[
        { title:'Receive a validated hypothesis', titleKo:'검증된 가설 인계', description:'Start from an ALPHA Compute representation hypothesis that already has evidence behind it.', descriptionKo:'이미 근거가 있는 ALPHA Compute 표현 가설에서 시작합니다.' },
        { title:'Agree the evidence plan', titleKo:'증거 계획 합의', description:'Freeze workload, baseline, KPIs and the decision criterion before testing.', descriptionKo:'시험 전에 워크로드, 기준선, KPI 및 판단 기준을 고정합니다.' },
        { title:'Run the selected validation', titleKo:'선택된 검증 수행', description:'A controlled evaluation and a PoC remain distinct; a PoC occurs only if separately selected.', descriptionKo:'통제된 평가와 PoC는 서로 다르며, PoC는 별도로 선택된 경우에만 수행합니다.' },
        { title:'Report the result', titleKo:'결과 보고', description:'A positive, neutral or negative result is valid. Production rights require a separate applicable agreement.', descriptionKo:'긍정·중립·부정 결과 모두 유효합니다. 프로덕션 사용 권리는 별도의 적용 가능한 계약이 필요합니다.' },
      ]} />
      <section className="section bg-canvas"><div className="container-page max-w-4xl"><SectionLabel><LocalizedText en="Possible progression" ko="가능한 진행" /></SectionLabel><div className="mt-6"><CommercialPathDiagram /></div></div></section>
      <ProductCTA heading="Have a validated hypothesis? Test whether it runs." headingKo="검증된 가설이 있나요? 실제 실행 가능성을 시험하세요." />
    </>
  );
}
