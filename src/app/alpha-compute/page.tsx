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

export const metadata = buildMetadata({ title: 'ALPHA Compute', description: PRODUCTS.alpha_compute.thesis, path: routes.alphaCompute });

export default function AlphaComputePage() {
  return (
    <>
      <ProductHero product={PRODUCTS.alpha_compute} />
      <ProductThesis
        label={<LocalizedText en="The thesis" ko="핵심 명제" />}
        statement={<LocalizedText en="Compute defines the representation hypothesis." ko="Compute는 표현 가설을 정의합니다." />}
        body={<LocalizedText en="Before any hardware question, ALPHA Compute asks what form the computation should take. It examines the algebraic and structural shape of a workload and, where evidence supports it, proposes a transformation hypothesis. Eligibility and advantage are not assumed." ko="하드웨어를 논하기 전에 ALPHA Compute는 계산이 어떤 형태를 가져야 하는지 묻습니다. 워크로드의 대수적·구조적 형태를 살펴보고 근거가 있는 경우 변환 가설을 제안합니다. 적합성이나 이점은 미리 가정하지 않습니다." />}
      />
      <section className="section border-b border-border-medium bg-canvas"><div className="container-page"><SectionLabel><LocalizedText en="The boundary" ko="제품 경계" /></SectionLabel><div className="mt-6"><ProductBoundaryTable /></div></div></section>
      <section className="section border-b border-border-medium bg-surface">
        <div className="container-page">
          <SectionLabel><LocalizedText en="Technology routes" ko="기술 경로" /></SectionLabel>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <TechnologyRouteCard tech={TECHNOLOGIES.axiom} relevance="May frame eligible workloads as algebraic state with structure that ordinary observation can hide." relevanceKo="적합한 워크로드에서 일반 관측이 숨길 수 있는 구조를 보존하는 대수 상태 관점이 관련될 수 있습니다." />
            <TechnologyRouteCard tech={TECHNOLOGIES.cre} relevance="May apply where eligible complex/operator structure can be represented through a structured real embedding." relevanceKo="적합한 복소수/연산자 구조를 구조화된 실수 임베딩으로 표현할 수 있는 경우 관련될 수 있습니다." />
            <TechnologyRouteCard tech={TECHNOLOGIES.fqnm} relevance="May apply to selected conservative dynamics that fit the proven countable-transfer domain." relevanceKo="현재 입증된 셀 수 있는 전달 범위에 맞는 선택된 보존형 동역학에 관련될 수 있습니다." />
          </div>
        </div>
      </section>
      <UseCaseGrid label="Where it may fit" labelKo="적용 가능성을 검토할 수 있는 영역" useCases={[
        { title:'Numerical computing', titleKo:'수치 계산', description:'Selected workloads where representation or structured operators materially contribute to cost.', descriptionKo:'표현 또는 구조화된 연산자가 비용에 실질적으로 기여하는 선택된 워크로드.' },
        { title:'Simulation', titleKo:'시뮬레이션', description:'Selected models where the baseline is defined and versioned before testing. Material baseline errors may be corrected only with the reason documented and affected comparisons rerun.', descriptionKo:'테스트 전에 기준선을 정의하고 버전을 기록하는 선택된 모델. 기준선에 중대한 오류가 확인되면 수정 사유를 기록하고 영향을 받은 비교를 다시 실행합니다.' },
        { title:'AI infrastructure', titleKo:'AI 인프라', description:'Workloads where representation, data movement or execution boundaries may be worth measuring before adding capacity.', descriptionKo:'용량 추가 전에 표현, 데이터 이동 또는 실행 경계를 측정할 가치가 있을 수 있는 워크로드.' },
      ]} />
      <WorkflowSteps label="How an evaluation can start" labelKo="평가를 시작할 수 있는 방법" steps={[
        { title:'Describe the workload', titleKo:'워크로드 설명', description:'Start with the actual decision, pressure and known constraints.', descriptionKo:'실제 의사결정, 압박 요인, 알려진 제약부터 시작합니다.' },
        { title:'Diagnose and classify', titleKo:'진단 및 분류', description:'Separate representation, movement, precision, runtime and hardware-bound hypotheses.', descriptionKo:'표현, 이동, 정밀도, 런타임, 하드웨어 제약 가설을 구분합니다.' },
        { title:'Define a transformation hypothesis', titleKo:'변환 가설 정의', description:'Only where the evidence supports a plausible representation-level route.', descriptionKo:'근거가 표현 수준의 경로를 뒷받침할 때만 정의합니다.' },
        { title:'Choose the next evidence step', titleKo:'다음 증거 단계 선택', description:'No action, further analysis, a controlled evaluation, or—separately and only if warranted—deeper execution validation.', descriptionKo:'조치 없음, 추가 분석, 통제된 평가 또는 별도 선택과 근거가 있을 때 더 깊은 실행 검증 중에서 결정합니다.' },
      ]} />
      <section className="section bg-canvas"><div className="container-page max-w-4xl"><SectionLabel><LocalizedText en="Possible progression" ko="가능한 진행" /></SectionLabel><div className="mt-6"><CommercialPathDiagram /></div></div></section>
      <ProductCTA heading="Bring a workload. Get a structural read." headingKo="워크로드를 가져오세요. 구조적 관점에서 함께 살펴봅니다." />
    </>
  );
}
